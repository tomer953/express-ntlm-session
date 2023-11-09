// init project
var express = require("express");
var app = express();
var session = require("express-session");
var ntlm = require("express-ntlm");
const PORT = 8080;

// init session middleware
app.use(
  session({
    secret: "some-secret-string",
    resave: false,
    saveUninitialized: true,
  })
);

// init ntlm middleware
app.use(
  ntlm({
    // domaincontroller: process.env.DC,
    debug: function () {
        const args = Array.prototype.slice.apply(arguments);
        console.log.apply(null, args);
    },
    getProxyId: (req) => {
      console.log("session", req.session.id);
      return req.session.id;
    },
    getCachedUserData: (req) => req.session.ntlm,
    addCachedUserData: (req, res, ntlm) => {
      req.session.ntlm = ntlm;
    },
  })
);

// access the ntlm user data
app.get("/api/ping", (req, res) =>
  res.send({ ntlm: req.ntlm, headers: req.headers })
);

app.listen(PORT, function () {
  console.log("Listening on port " + PORT);
});
