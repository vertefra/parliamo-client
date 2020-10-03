const express = require("express");
const app = express();
const path = require("path");
const SSL_PORT = 443;
const HTTP_PORT = 4000;

app.use(express.static("build"));

app.get("*", (req, res) => {
  res.sendFile(path.join(`${__dirname}/build/index.html`));
});

app.listen(SSL_PORT && HTTP_PORT);
