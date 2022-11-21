import bcrypt from "bcrypt"
import {v4 as uuid} from "uuid"
import { MongoClient} from "mongodb";
import { usersdb, sessionsdb} from "../database/db.js";


export async function signIn (req, res){
    try{
        const user = req.body;

        //verificar se o usuarios esta cadastrado no DB:
        const userVerify = await usersdb.findOne({email:user.email});
        
        if(userVerify && bcrypt.compareSync(user.password, userVerify.password)) {
            const token = uuid();

            await sessionsdb.insertOne({
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
};

export async function signUp (req, res) {
    try{
        //Verificar se o email já está cadastrado no banco de dados:
        const newUserVerify = await usersdb.findOne({email:req.body.email});
        
        if(newUserVerify){
            return res.status(409).send("email já cadastrado");
        };

        //Inserir novo usuario no DB:
        const senhaCryptografada = bcrypt.hashSync(req.body.password, 10);

        const newUser = {
            name:req.body.name,
            email:req.body.email,
            password:senhaCryptografada,
            inputs:[]
        };

        await usersdb.insertOne(newUser);

    }catch(error){
        console.log(error);
    };

    res.send(201);
};