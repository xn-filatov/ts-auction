import { Sequelize } from 'sequelize-typescript';
import env from "../environment"

export const sequelize = new Sequelize(
  env.DB,
  env.USER,
  env.PASSWORD,
  {
    host: env.HOST,
    dialect: env.DIALECT,
    models: [__dirname + "/models"],
    logging: false
  },
);
