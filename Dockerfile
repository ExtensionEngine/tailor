FROM node:14.21.3-slim@sha256:21b6dc452bd2c066724bd5be0f7256ef81a068c47de1adead10a2f810557de02 AS base
RUN apt update && apt install -y --no-install-recommends dumb-init
ENTRYPOINT ["dumb-init", "--"]

FROM node:14.21.3@sha256:2cafa3fbb0b6529ee4726b4f599ec27ee557ea3dea7019182323b3779959927f AS install
WORKDIR /usr/src/app
ENV NODE_ENV production
COPY package*.json .
RUN npm ci --only=production

FROM base AS configure
WORKDIR /usr/src/app
COPY --chown=node:node --from=install /usr/src/app/node_modules ./node_modules
COPY --chown=node:node package.json sequelize.config.js tailor.config.js ./
COPY --chown=node:node common ./common
COPY --chown=node:node config ./config
COPY --chown=node:node extensions ./extensions
COPY --chown=node:node server ./server

FROM configure AS run
ENV NODE_ENV production
USER node
CMD npm run db migrate && node -r ./server/script/preflight ./server/index.js
