require("dotenv").config({path : "./.env"});
const express = require('express');
const MongoStore = require('connect-mongo');
const session = require('express-session');
const connect = require("./config/mongoose");
const router = require("./routes/index.js");
const ws = require('ws');
const { default: helmet } = require('helmet');
require("./auth/passport");
const cors = require('cors');
const app = express();
const http = require('http');
const bodyParser = require("body-parser");
const { connection } = require("mongoose");
const {connectSocket} = require("./socket");
const jwt = require("jsonwebtoken");
const port = 8000 || process.env.PORT;
const connectSocketService = require("./service/socket");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());

app.use(session({
    name: 'login_form',
    // TODO change the secret before deployment in production mode
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: MongoStore.create({
        mongoUrl: process.env.DB,
    
    })
}));

app.use("/api",router);

connect().then(async (db) => {
    const server = http.createServer(app);
     
    // connectSocket(server);
    connectSocketService(server);
    server.listen(port, function(err){
        if(err){
            console.log(err);
        }
        else {
            console.log("Server listening at port", port);
        }
    })

})

