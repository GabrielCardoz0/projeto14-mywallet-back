import dayjs from "dayjs";
// import { MongoClient} from "mongodb";
import { sessionsdb, usersdb } from "../database/db.js";

export async function putInput (req, res) {
    try{
        //verificando se há token:
        const {authorization } = req.headers;
        const token = authorization?.replace("Bearer ", "");

        if(!token) return res.sendStatus(401);

        //veriricando se há sessao com esse token:
        const session = await sessionsdb.findOne({token:token});

        if(!session) return res.sendStatus(401);

        // verificando se há o usuario dessa sessao:

        const user = await usersdb.findOne({_id:session.userId});
        


        if(user){
            // insere o novo valor no DB:
            const newInput = {id:user.inputs.length,...req.body, date:dayjs(Date.now()).format("DD/MM/YY")};
            const inputsArr = [...user.inputs, newInput];

            await usersdb.updateOne({_id:session.userId}, {$set:{inputs:inputsArr}});
            const userUpdate = await usersdb.findOne({_id:session.userId});
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
};