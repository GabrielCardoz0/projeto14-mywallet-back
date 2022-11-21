import { MongoClient } from "mongodb";
// import express from "express"
const mongoClient = new MongoClient("mongodb://localhost:27017");

let db;

await mongoClient.connect().then(() => {
    db = mongoClient.db("dbProjeto14");
  });

export const usersdb = db.collection("users");

export const sessionsdb = db.collection("sessions");
