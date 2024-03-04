import express from "express";
import cors from "cors";

function initApi(app) {
  const server = express();
  server.use(express.json());
  server.use(cors());

  server.get("/test", async (req, res) => {
    const records = await app.DAO.getRecords("todos");
    console.log("hey world");
    res.json({
      records,
    });
  });

  return server;
}

export default initApi;
