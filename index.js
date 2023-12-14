import http from "node:http";
import { sendError } from "./modules/send.js";
import { checkFile } from "./modules/checkFile.js";
import { handleComediansRequest } from "./modules/handleComediansRequest.js"
import { handleAddClient } from "./modules/handleAddClient.js";
import { handleClientsRequest } from "./modules/handleClientsRequest.js";
import { handleUpdateClient } from "./modules/handleUpdateClient.js";
import fs from "node:fs/promises";

const PORT = 8080;
const COMEDIANS = './comedians.json';
export const CLIENTS = './clients.json';

const startServer = async () => {
  if (!(await checkFile(COMEDIANS, false))) {
    return;
  }

  await checkFile(CLIENTS, true);
  const comediansData = await fs.readFile(COMEDIANS, "utf-8");
  const comedians = JSON.parse(comediansData);

  http
    .createServer(async (req, res) => {
      try {
        const segments = req.url.split("/").filter(Boolean);

        if (req.method === "GET" && segments[0] === "comedians") {
          handleComediansRequest(req, res, comedians, segments);
          return;
        } else if (req.method === "POST" && segments[0] === "clients") {
          // POST /clients
          // add a new client
          handleAddClient(req, res);
          return;
        } else if (req.method === "GET" && segments[0] === "clients" && segments.length === 2) {
          // GET /clients/:ticketId
          // get a client by ticketId
          const ticket = segments[1];

          handleClientsRequest(req, res, ticket);
          return;
        } else if (req.method === "PATCH" && segments[0] === "clients" && segments.length === 2) {
          // PATCH /clients/:ticketId
          // edot a client by ticketId
          handleUpdateClient(req, res, segments[1]);
          return;
        } else {
          sendError(res, 404, "Not found");
        }
      } catch (error) {
        sendError(res, 500, `Error on server ${error}`);
      }
    })
    .listen(PORT);

  console.log(`Der server hat gestartet in http://localhost:${PORT}`);
}

startServer(); 