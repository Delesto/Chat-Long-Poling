const http = require("http");
const url = require("url");

const port = 3000;
const chat = require("./chat");

setInterval(() => {
  console.log(chat.clients.length);
}, 1000);

const server = http.createServer((req, res) => {
  const queryData = url.parse(req.url, true);

  switch (queryData.path) {
    case "/":
      res.writeHead(200, {
        "Content-Type": "text/plain",
      });

      res.end("Working!");
      break;
    case "/subscribe":
      res.writeHead(200, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept",
      });
      chat.subscribe(req, res);
      break;
    case "/publish":
      res.writeHead(200, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept",
      });

      let body = "";
      req.on("data", (chunk) => {
        if (body.length > 1e7) {
          res.writeHead(413, "Request Entity Too Large", {
            "Content-Type": "text/plain",
          });
          res.end("Request Entity Too Large");
        }

        body += chunk.toString();
      });

      req.on("end", () => {
        try {
          body = JSON.parse(body);
        } catch (e) {
          res.statusCode = 400;
          res.end("400");
        }

        chat.publish(body);
        res.end("ok");
      });
      break;
    default:
      res.writeHead(404, {
        "Content-Type": "text/html",
      });

      res.end("404");
      break;
  }
});

server.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
