import * as dotenv from 'dotenv'
import { Dialect } from 'sequelize/types/sequelize'
dotenv.config()

export default {
    // App settings
    PORT: process.env.PORT as string,

    // JWT
    TOKEN_SECRET: process.env.TOKEN_SECRET as string,

    //  Database
    DB: process.env.DB as string,
    USER: process.env.USER as string,
    PASSWORD: process.env.PASSWORD as string,
    HOST: process.env.HOST as string,
    DB_PORT: process.env.DB_PORT as string,
    DIALECT: process.env.DIALECT as Dialect,
}
