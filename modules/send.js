export const sendData = (res, data) => {
  console.log("Data ", data);
  res.writeHead(200, {
    "Content-Type": "text/json; charset=utf-8"
  });

  res.end(JSON.stringify(data));
}

export const sendError = (res, statusCode, errorMessage) => {
  res.writeHead(statusCode, {
    "Content-Type": "text/json; charset=utf-8"
  });

  res.end(errorMessage);
}