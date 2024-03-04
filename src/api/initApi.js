import express from "express";
import cors from "cors";

function initApi(app) {
  const server = express();
  server.use(express.json());
  server.use(cors());

  server.get("/test", (req, res) => {
    console.log("hey world");
    res.json({
      message: "hey world",
    });
  });

  return server;
}

export default initApi;
