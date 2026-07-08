'use strict';

import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import process from 'process';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname } from 'path';

// 1. Recreate __filename, __dirname, and basename
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const basename = path.basename(__filename);

// 2. Import your database config file (Adjust the path if your config.json is elsewhere!)
import configData from '../config/config.js';

const env = process.env.NODE_ENV || 'development';
const config = configData[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// 3. Filter files in the directory
const files = fs.readdirSync(__dirname).filter(file => {
  return (
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file.slice(-3) === '.js' &&
    file.indexOf('.test.js') === -1
  );
});

// 4. Asynchronously import and initialize models
for (const file of files) {
  const filePath = path.join(__dirname, file);
  // Windows compatibility requires converting paths to file:// URLs for dynamic imports
  const fileUrl = pathToFileURL(filePath).href;
  
  const { default: modelFactory } = await import(fileUrl);
  const model = modelFactory(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
}

// 5. Setup associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
