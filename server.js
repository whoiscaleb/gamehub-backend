

// DEPENDENCIES ///
const dotenv = require("dotenv")
const cors = require('cors')
const morgan = require('morgan')

////////////////////////////////////
// get .env variables
require('dotenv').config();

// pull mongo url from env
const {PORT = 4000, MONGODB_URL} = process.env;

// import express 
const express = require("express")

//create application object
const app = express();

//import mongoose 
const mongoose = require("mongoose")


///DATABASE CONNECTION

//Establish Connection 
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

//Connection Events
mongoose.connection
.on("open", () => console.log("Mongo connected"))
.on("close", () => console.log("Mongo disconnected"))
.on("close", (error) => console.log(error));



/// MODELS 
const GameSchema = new mongoose.Schema({
    Game: String,
    Genre: String,
    ReleaseDate: String,
    PlayedOn: String, 
    Hours: Number,
    Rating: String,
    Review: String, 
    Publisher: String,
    Image: String,
    Number: Number,

});

 const Game = mongoose.model("Game", GameSchema)

// MiddleWare
app.use(cors()); // to prevent cors errors, open access to all origins
app.use(morgan("dev")); // logging
app.use(express.json()); // parse json bodies
app.use(express.urlencoded({ extended: true }));

// ROUTES 

// test route
app.get("/", (req, res) => {
    res.send("hello world");
});
// SPLASH ROUTE 

// INDEX ROUTE
app.get("/collection", async (req, res) => {
  try {
    const games = await Game.find({}); // Retrieve game data from MongoDB
    res.json(games); // Send the game data as the response
  } catch (error) {
    res.status(400).json(error);
  }
});


// CREATE ROUTE
app.post("/collection/create", async (req, res) => {
    try {
        // send all data
        res.json(await Game.create(req.body));
    } catch (error) {
        //send error
        res.status(400).json(error);
    }
});

// DELETE ROUTE
app.delete("/collection/:id", async (req, res) => {
    try {
      // send all people
      res.json(await Game.findByIdAndRemove(req.params.id));
    } catch (error) {
      //send error
      res.status(400).json(error);
    }
  });


  // UPDATE ROUTE
app.put("/collection/:id", async (req, res) => {
    try {
      // send all game data
      res.json(
        await Game.findByIdAndUpdate(req.params.id, req.body, { new: true })
      );
    } catch (error) {
      //send error
      res.status(400).json(error);
    }
})


// SHOW ROUTE 
app.get("/collection/:id", async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    res.json(game);
  } catch (error) {
    res.status(400).json(error);
  }
});


// LISTENER
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));