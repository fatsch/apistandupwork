import { CLIENTS } from "../index.js";
import { sendData, sendError } from "./send.js";
import fs from "node:fs/promises";

export const handleAddClient = async (req, res) => {
  let body = '';

  try {
    // In backend "event" heisst "emit". Wenn passiert event "data", dann wird eine callback funktion aufgerufen, die ein chunk empfängt. 
    // dasevent "data" passiert in dem moment wenn das buffer vollstandig gefüllt ist und soll geleert werden. Dafür wird der Inhalt des 
    // buffers ins chunk übetragen 
    req.on('data', chunk => {
      body += chunk;
    });
  } catch (error) {
    console.log("Error beim Lesen des Requests");
    sendError(res, 500, "Error uf dem Server beim Lesen des Requests");
  }

  req.on("end", async () => {
    try {
      console.log(body);
      const newClient = JSON.parse(body);

      if (!newClient.fullName || !newClient.phone || !newClient.ticketNumber){
        sendError(res, 400, "Missing clients' data");
        return;
      }

      // return error if the new client has a booking 
      // AND the booking isn't an array or every item in the booking hasn't a comedian and time
      if (!newClient.booking || !Array.isArray(newClient.booking) 
          || !newClient.booking.every((item) => item.comedian && item.time)){
            sendError(res, 400, "Booking fields are filled in wrongly");
            return;
      }

      const clientData = await fs.readFile(CLIENTS, 'utf8');
      const clients = JSON.parse(clientData);
      clients.push(newClient);
      await fs.writeFile(CLIENTS, JSON.stringify(clients));

      console.log(newClient);
      sendData(res, newClient);
    } catch (error) {
      console.eroor("Error by handling a request");
      sendError(res, 500, `Error on server ${error}`);
    }
  });
}