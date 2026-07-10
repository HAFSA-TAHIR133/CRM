import 'dotenv/config'; 

const config = {
  development: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'my_password',
    database: process.env.DB_NAME || 'CRM',
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    dialect: process.env.DB_DIALECT || 'postgres',
    seederStorage: "sequelize",
    seederStorageTableName: "SequelizeSeeders"
  },
  test: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'my_password',
    database: process.env.DB_NAME || 'CRM',
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    dialect: process.env.DB_DIALECT || 'postgres',
    seederStorage: "sequelize",           
    seederStorageTableName: "SequelizeSeeders"
  },
  production: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'my_password',
    database: process.env.DB_NAME || 'CRM',
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    dialect: process.env.DB_DIALECT || 'postgres',
    seederStorage: "sequelize",
    seederStorageTableName: "SequelizeSeeders"
  }
};

export default config;