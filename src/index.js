import express from "express";
import cors from "cors"
import dayjs from "dayjs";
import Joi from "joi";
import { MongoClient } from "mongodb";


const app = express();
app.use(express.json());
app.use(cors());


const userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email({tlds:{allow:false}}).required(),
    password: Joi.required()
  });

const valueSchema = Joi.object({
    value:Joi.required(),
    depositType:Joi.required().valid(true,false)
});


//conexoes com o mongoDB:
const mongoClient = new MongoClient("mongodb://localhost:27017");

let db;

mongoClient.connect().then(() => {
    db = mongoClient.db("dbProjeto14");
  });

//metodos da API:



// app.post("/register", ( (req, res) => {
//     res.send("ola, você fez um post")
//     console.log(req.body);
//     console.log(req.headers);
// }));


//post users: O usuario cria um novo user, enviando um objeto com nome, email, senha e senharepetida. Recebe um token e o status 201. A api cria um novo usuario com nome, email, senha (encriptografada), tokenId, e array de inputs 


//get input e output: o usuario faz uma requisição e recebe um objeto com seu nome e array de inputs e outputs. O get faz uma verificação do usuario pelo token recebido

// app.get("/outinputs", ((req, res) => {
//     res.send("Ola vacilao")
// }));

// app.listen(5000,"192.168.0.113")
app.listen(5000)