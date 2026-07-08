import expressLoader from "./express.js";
import sequelizeLoader from "./sequelize.js";

const loaders = async ({ expressApp }) => {
  // Initialize Database connection
  await sequelizeLoader();
  
  // Initialize Express configurations
  await expressLoader({ app: expressApp });
  console.log(" Express Intialized");
};

export default loaders;