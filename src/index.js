import express from "express";
import cors from "cors"
import dayjs from "dayjs";
import Joi from "joi";
import { MongoClient, ObjectId } from "mongodb";
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
    email:Joi.string().email({tlds:{allow:false}}).required(),
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

app.post("/sign-up", ( async (req, res) => {
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

app.post("/sign-in", (async (req, res) => {
    try{
        const user = req.body;

        //veriicar o body da requset com JOi:
        const verify = userSchema.validate(user);

        if(verify.error){
            const arr = verify.error.details.map(d => d.message)
            return res.status(422).send(arr)
        } 

        //verificar se o usuarios esta cadastrado no DB:
        const userVerify = await db.collection("users").findOne({email:user.email});
        
        if(userVerify && bcrypt.compareSync(user.password, userVerify.password)) {
            const token = uuid();

            await db.collection("sessions").insertOne({
                userId:userVerify._id,
                token:token
            });

            return res.send({token:token});

        } else{
            return res.status(400).send("email ou senha inválidos");
        };
    }catch(error){
        console.log(error);
    };
}));

app.put("/input", ( async(req, res) => {
    try{


        const valueVerify = valueSchema.validate(req.body);

        if(valueVerify.error){
            const arr = valueVerify.error.details.map(d => d.message)
            return res.status(422).send(arr)
        } 


        //verificando se há token:
        const {authorization } = req.headers;
        const token = authorization?.replace("Bearer ", "");

        if(!token) return res.sendStatus(401);

        //veriricando se há sessao com esse token:
        const session = await db.collection("sessions").findOne({token:token});

        if(!session) return res.sendStatus(401);

        // verificando se há o usuario dessa sessao:

        const user = await db.collection("users").findOne({_id:session.userId});
        


        if(user){
            // insere o novo valor no DB:
            const newInput = {id:user.inputs.length,...req.body, date:dayjs(Date.now()).format("DD/MM/YY")}
            const inputsArr = [...user.inputs, newInput];

            await db.collection("users").updateOne({_id:session.userId}, {$set:{inputs:inputsArr}});
            const userUpdate = await db.collection("users").findOne({_id:session.userId});
            //retirando o valor do password para não haver dados sensíveis:
            delete userUpdate.password;

            // retorna o array de inputs para o front:
            return res.send(userUpdate);
        }else{
            return res.sendStatus(400);
        };


    }catch(error){
        console.log(error);
    };
}));



app.listen(5000)