#!/bin/bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
source ~/.nvm/nvm.sh
nvm install 12

# git clone https://github.com/ikovac/express-hello-world.git
git clone https://github.com/ExtensionEngine/tailor.git
cd tailor
npm i
npm run build
npm i -g pm2
