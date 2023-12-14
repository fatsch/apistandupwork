import { CLIENTS } from "../index.js";
import { sendData, sendError } from "./send.js";
import fs from "node:fs/promises";

export const handleClientsRequest = async (req, res, ticket) => {
  try {
    const clientData = await fs.readFile(CLIENTS, "utf8");
    const clients = JSON.parse(clientData);

    const client = clients.find(c => c.ticketNumber === ticket);

    if(!client){
      sendError(res, 404, `Client with the ticket number ${ticket} not found`);
      return;
    }

    sendData(res, client);
  } catch (error) {
    console.error("Error beim Bearbeiten des Requests");
    sendError(res, 500, "Error uf dem Server beim Lesen des Requests");
  }
}
