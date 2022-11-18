import express from "express";
import cors from "cors"
import dayjs from "dayjs";
import Joi from "joi";
import { MongoClient } from "mongodb";
import bcrypt from "bcrypt"
import {v4 as uuid} from "uuid"


const app = express();
app.use(express.json());
app.use(cors());


const newUserSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email({tlds:{allow:false}}).required(),
    password: Joi.required()
  });

  const userSchema = Joi.object({
    name:Joi.string().required(),
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
//Metodos: post login, post register, put  

app.post("/register", ( async (req, res) => {
    try{


        //verificar se o body está correto:
        const verify = newUserSchema.validate(req.body);

        if(verify.error){
            const arr = verify.error.details.map(d => d.message)
            return res.status(422).send(arr)
        } 

        //Verificar se o email já está cadastrado no banco de dados:
        const newUserVerify = await db.collection('users').findOne({email:req.body.email});
        
        if(newUserVerify){
            return res.status(409).send("email já cadastrado");
        }

        //Inserir novo usuario no DB:
        const senhaCryptografada = bcrypt.hashSync(req.body.password, 10)

        const newUser = {
            name:req.body.name,
            email:req.body.email,
            password:senhaCryptografada,
            inputs:[]
        } 

        await db.collection("users").insertOne(newUser);

    }catch(error){
        console.log(error)
    };

    res.send(201)
}));


//post users: O usuario cria um novo user, enviando um objeto com nome, email, senha e senharepetida. Recebe um token e o status 201. A api cria um novo usuario com nome, email, senha (encriptografada), tokenId, e array de inputs 


//get input e output: o usuario faz uma requisição e recebe um objeto com seu nome e array de inputs e outputs. O get faz uma verificação do usuario pelo token recebido

// app.get("/outinputs", ((req, res) => {
//     res.send("Ola vacilao")
// }));

// app.listen(5000,"192.168.0.113")
app.listen(5000)