const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const UserModel = require("./models/User");
const jsonWebToken = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const { request, response } = require("express");
const bcrypt = require("bcryptjs");
const ws = require("ws");

// Load environment variables
dotenv.config();

const mongoUrl = process.env.MONGO_URL;
const jwtSecretKey = process.env.JWT_SECRET_KEY;

// Connect to MongoDB
mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    throw new Error(`Error connecting to MongoDB: ${error.message}`);
  });

const app = express();

// Use the built-in middleware for parsing request bodies
app.use(express.json());

// Use cookie-parser middleware to parse cookies
app.use(cookieParser());

// Use CORS middleware to allow cross-origin requests
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.get("/test", (req, res) => {
  res.json("test okay");
});

app.get("/profile", (req, res) => {
  /* Returns the user data associated with the JWT token in the 'token' cookie. */
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized No Token" });
  }

  try {
    const userData = jsonWebToken.verify(token, jwtSecretKey);
    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Unauthorized Invalid Token" });
  }
});

app.post("/login", async (req, res) => {
  /* Authenticates the user with the provided username and password, and returns a JWT token as a cookie. */
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username: username });
  if (user) {
    // Compare the plaintext password with the stored hash
    const isSame = await bcrypt.compare(password, user.password);
    if (isSame) {
      jsonWebToken.sign(
        { userId: user._id, username },
        jwtSecretKey,
        {},
        (err, token) => {
          res
            .cookie("token", token, {
              httpOnly: true,
              sameSite: "none",
              secure: true,
            })
            .json({
              id: user._id,
            });
        }
      );
    }
  }
});

app.post("/register", async (req, res) => {
  /* Creates a new user with the provided username and password, and returns a JWT token as a cookie. */
  const { username, password } = req.body;

  try {
    // Create a new user object and save it to the database
    const hashedPassword = await bcrypt.hash(password, 10);
    // store hash in the database
    const createdUser = new UserModel({ username, password: hashedPassword });
    await createdUser.save();
    // Generate a JSON web token and set it as a cookie
    const token = jsonWebToken.sign(
      { userId: createdUser._id, username },
      jwtSecretKey
    );
    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .status(201)
      .json({
        id: createdUser._id,
        message: `User ${createdUser._id} created successfully`,
      });
  } catch (error) {
    console.log("Error creating user", error);
    throw new Error("Internal server error");
  }
});

const server = app.listen(4040, () => {
  console.log("Server listening on port 4040");
});

const wss = new ws.WebSocketServer({ server: server });

// Create a Set to store connected clients
const clients = new Set();

wss.on("connection", (connection, req) => {
  const cookies = req.headers.cookie;
  if (cookies) {
    const tokenCookieString = cookies
      .split(";")
      .find((str) => str.startsWith("token="));
    if (tokenCookieString) {
      const token = tokenCookieString.split("=")[1];
      if (token) {
        try {
          const decodedToken = jsonWebToken.verify(token, jwtSecretKey);
          const { userId, username } = decodedToken;
          console.log(`User connected: userId=${userId}, username=${username}`);
          // Remove any existing client object with the same user ID
          for (let c of clients) {
            if (c.id === userId) {
              clients.delete(c);
              break;
            }
          }          
          // Add the client to the list of online users
          clients.add({
            id: userId,
            username: username,
            ws: connection,
          });
          // Send the list of connected clients to all clients
          [...clients].forEach((client) =>
            client.ws.send(
              JSON.stringify(
                [...clients].map((c) => ({
                  userId: c.id,
                  username: c.username,
                }))
              )
            )
          );
          // Add a 'close' event listener to the WebSocket connection
          connection.on('close', () => {
            console.log(`User disconnected: userId=${userId}, username=${username}`);
            // Remove the client from the list of online users
            for (let c of clients) {
              if (c.id === userId) {
                clients.delete(c);
                break;
              }
            } 
            // Send the updated list of connected clients to all clients
            [...clients].forEach((client) =>
              client.ws.send(
                JSON.stringify(
                  [...clients].map((c) => ({
                    userId: c.id,
                    username: c.username,
                  }))
                )
              )
            );
          });
        } catch (err) {
          console.log("Error verifying JWT:", err);
        }
      }
    }
  }
});
