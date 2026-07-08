import 'dotenv/config'; 

const config = {
  development: {
    username:'postgres',
    password: process.env.DB_PASSWORD || 'my_password',
    database: "CRM",
    host: '127.0.0.1',
    port:  5432,
    dialect: 'postgres',
    seederStorage: "sequelize",
    seederStorageTableName: "SequelizeSeeders"
  },
  test: {
    username: 'postgres',
    password: process.env.DB_PASSWORD || 'my_password',
    database: 'CRM',
    host: '127.0.0.1',
    dialect: 'postgres',
    seederStorage: "sequelize",           
    seederStorageTableName: "SequelizeSeeders"
  },
  production: {
    username: 'postgres',
    password: process.env.DB_PASSWORD || 'my_password',
    database: 'CRM',
    host: '127.0.0.1',
    dialect: 'postgres',
    seederStorage: "sequelize",
    seederStorageTableName: "SequelizeSeeders"
  }
};

export default config;