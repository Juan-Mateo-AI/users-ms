import "dotenv/config";

import * as joi from "joi";

interface EnvVars {
  PORT: number;
  NATS_SERVERS: string[];
  MAIL_HOST: string;
  MAIL_USER: string;
  MAIL_PASSWORD: string;
  MAIL_FROM: string;
  MAIL_TRANSPORT: string;
  WEB_APP_URL: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
    MAIL_HOST: joi.string().required(),
    MAIL_USER: joi.string().required(),
    MAIL_PASSWORD: joi.string().required(),
    MAIL_FROM: joi.string().required(),
    MAIL_TRANSPORT: joi.string().required(),
    WEB_APP_URL: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS?.split(","),
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  natsServers: envVars.NATS_SERVERS,
  mailHost: envVars.MAIL_HOST,
  mailUser: envVars.MAIL_USER,
  mailPassword: envVars.MAIL_PASSWORD,
  mailFrom: envVars.MAIL_FROM,
  mailTransport: envVars.MAIL_TRANSPORT,
  webAppUrl: envVars.WEB_APP_URL,
};
