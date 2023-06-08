import yn from 'yn';

export const sender = {
  name: process.env.EMAIL_SENDER_NAME,
  address: process.env.EMAIL_SENDER_ADDRESS
};

export const user = process.env.EMAIL_USER;

export const password = process.env.EMAIL_PASSWORD;

export const host = process.env.EMAIL_HOST;

export const port = process.env.EMAIL_PORT || null;

export const ssl = yn(process.env.EMAIL_SSL);

export const tls = yn(process.env.EMAIL_TLS);
