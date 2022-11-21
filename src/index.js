import express from "express";
import cors from "cors"
// import Joi from "joi";
// import { MongoClient } from "mongodb";
import router from "./routes/rename.js";


const app = express();

app.use(cors());

app.use(express.json());

app.use(router);

//metodo delete para apagar inputs:
// iniciar DB: mongod --dbpath ~/.mongo
//iniciar servidor local: npx nodemon src/index.js
//iniciar terminal mongo: mongo
//rodar o index: node src/index.js
// rodar projeto react: npm start


app.listen(5000);