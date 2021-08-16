import { Mongoose } from "mongoose";
require("dotenv").config();
const { ApolloServer, gql } = require("apollo-server-express");
const fs = require("fs"); //node js file system
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const expressJwt = require("express-jwt");
import { Request, Response } from "express";
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const resolvers = require("./resolvers");
const Users = require("../models/users");

const port = process.env.PORT || 7000;
const jwtSecret = Buffer.from("Zn8Q5tyZ/G1MHltc4F/gTkVJMlrbKiZt", "base64");
// const jwtSecret = Buffer.from(String(process.env.JWT_SECRET), "base64");
//refresh token for expired tokens

const app = express();

//Cors Fight
app.options("*", cors());

// const corsOptions = {
//   origin: [
//     "http://localhost:3000",
//
//   ],
//   credentials: true,
//   optionSuccessStatus: 200,
// };
//app.use(cors(corsOptions));
app.use(
  cors(),
  bodyParser.json(),
  expressJwt({
    secret: jwtSecret,
    credentialsRequired: false,
    algorithms: ["RS256"], //RS digital signature needed for auth
  })
);
//MongoDB
mongoose
  .connect(
    "mongodb+srv://mcmlxiv:welcome9@todos.pxd2d.mongodb.net/Todos?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((response: Mongoose) => console.log(response + "connected!"));

//Setting up GQL
const typeDefs = gql(
  fs.readFileSync("schema/schema.graphql", { encoding: "utf8" })
);
//context from jwtToken from user to add auth to server

const context = ({ req }: { req: Request }) => ({
  token: req.headers.userauthorization || "",
});

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context,
});
apolloServer.applyMiddleware({ app, path: "/graphql" });

app.get("/", function (req: Request, res: Response) {
  res.send("hello");
});

app.head("/login", cors(), (req: Request, res: Response) => {
  console.info("HEAD /login");
  res.sendStatus(204);
});
app.get("/login", cors(), (req: Request, res: Response) => {
  console.info("GET /login");
  res.json({
    text: "Simple CORS requests are working. [GET]",
  });
});
const options = {
  origin: true,
  methods: ["POST"],
  credentials: false,
  maxAge: 3600,
};
app.options("/login", cors(options));

//login
app.post("/login", cors(), async (req: Request, res: Response) => {
  //incoming email and pass from client
  const { email, password } = req.body;

  //db user list
  const userFind = async () =>
    Users.findOne({
      email: email,
    });
  const user = await userFind();

  //Validation checking if email exist in user db
  if (!user) {
    const token = "case 1";
    res.status(401).send(token);

    return;
    //if password belongs to that email entered
  } else if (user && !(user.password === password)) {
    const token = "case 2";
    res.status(401).send(token);

    return;
  }
  //sending token with jwtSecret
  const token = jwt.sign({ sub: user.id }, jwtSecret, {
    algorithm: "HS256",
    expiresIn: "1d",
  });

  res.status(200).send({ token, user });
});

//Sign up
app.post("/signup", cors(), async (req: Request, res: Response) => {
  //incoming email and pass from client
  const { email } = req.body;

  const userFind = async () => Users.findOne({ email: email });
  const user = await userFind();

  //sending token with jwtSecret
  const token = jwt.sign({ sub: user.id }, jwtSecret, {
    algorithm: "HS256", //RS256 private key HS256 public key
    expiresIn: "1h",
  });
  res.status(200).send({ token, user });
});

app.listen(port, () => console.info(`Server started on port ${port}`));
