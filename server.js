const express = require("express");
const serveStatic = require("serve-static");
const path = require("path");
const basicAuth = require("express-basic-auth");

const app = express();

if (process.env.IS_STAGING) {
  app.use(
    basicAuth({
      users: { staging: process.env.STAGING_PWD },
      challenge: true,
    })
  );
}

//here we are configuring dist to serve app files
app.use("/", serveStatic(path.join(__dirname, "/dist")));

// this * route is to serve project on different page routes except root `/`
app.get(/.*/, function (req, res) {
  res.sendFile(path.join(__dirname, "/dist/index.html"));
});

const port = process.env.PORT || 8083;
app.listen(port);
console.log(`app is listening on port: ${port}`);
