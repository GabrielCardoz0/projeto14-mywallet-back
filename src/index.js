import express from "express";
import cors from "cors"
import dayjs from "dayjs";
import Joi from "joi";
import { MongoClient } from "mongodb";


const app = express();
app.use(express.json());
app.use(cors());


//post users: O usuario cria um novo user, enviando um objeto com nome, email, senha e senharepetida. Recebe um token e o status 201. A api cria um novo usuario com nome, email, senha (encriptografada), tokenId, e array de inputs 


//get input e output: o usuario faz uma requisição e recebe um objeto com seu nome e array de inputs e outputs. O get faz uma verificação do usuario pelo token recebido

app.get("/outinputs", ((req, res) => {
    res.send("oi")
}));

app.listen(5000)