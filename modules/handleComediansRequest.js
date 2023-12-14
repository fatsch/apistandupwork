import { sendData, sendError} from "./send.js";

export const handleComediansRequest = async (req, res, comedians, segments) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  
  if (segments.length === 2) {
    const comedian = comedians.find(
      (c) => c.id === segments[1]
    );

    if (!comedian) {
      sendError(res, 404, "The current comedian is not found");
      return;
    }

    sendData(res, comedian);
    return;
  }

  sendData(res, comedians);
}