import express from "express";
import { env } from "./config/env.js";
import loaders from "./loaders/index.js";

async function startServer() {
  const app = express();

  await loaders({ expressApp: app });

  app.listen(env.port, () => {
    console.log(`
      ################################################
        Server listening on port: ${env.port} 
      ################################################
    `);
  });
}

startServer();