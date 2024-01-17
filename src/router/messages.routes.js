import { Router } from "express";
import { messageModel } from "../DAO/models/messages.model.js";
import { transporter } from "../config/nodemailer.js";
import { client } from "../config/twilio.js";
import dotenv from 'dotenv'

dotenv.config()

const router = Router()

//get
router.get("/", async(req,res)=> {
    try {
        let  message= await messageModel.find()
        res.send({result : "success", payload:  message})
    } catch(error){
        console.log(error)
    }
})

//post
router.post("/" , async(req,res)=> {
    let{user,message}= req.body
    if(!user || !message){
        res.send({status: "error", error: "Faltan datos"})
    }
    let result = await messageModel.create({user, message})
    res.send({result: "success", payload: result})
})

//put
router.put("/:id_msg", async(req,res)=> {
    let{id_msg} = req.params

    let messageToReplace = req.body
    if(!messageToReplace.user || !messageToReplace.message){
        res.send({status: "error", error: "no hay datos en parametros"})
    }
    let result = await messageModel.updateOne({_id: id_msg}, messageToReplace)
    res.send({result: "success", payload: result})
})

//delete
router.delete("/:id_msg", async(req,res)=>{
    let{id_msg}= req.params
    let result = await messageModel.deleteOne({_id: id_msg})
    res.send({ result: "success", payload:result})
})


//nodemailer-----------------------
router.post("/mailer", async (req,res) =>{
    const {correo, mensaje, destinatario, asunto} = req.body

    const mailoption ={
        from:"pedrodaniel.diaz@gmail.com",
        to: destinatario,
        subject:asunto,
        text: `Mensaje: ${mensaje} `
    }

    transporter.sendMail(mailoption, (error, info)=>{
        if(error){
            console.log(error)
            res.send("Error al enviar correo")
        }else{
            console.log("Correo enviado")
            res.send("Correo enviado con exito")
        }
    })


})


// Twilio
router.post("/twilio", async (req, res) => {
    try {
        const { 'desti-num': destinationNumber, 'sms-text': smsMessage } = req.body;

        let result = await client.messages.create({
            body: smsMessage,
            from: process.env.TWILIO_SMS_NUMBER,
            to: destinationNumber
        });

        res.send({ status: "Success", result: "Mensaje enviado" });
    } catch (error) {
        res.status(500).send({ status: "Error", error: error.message || "Error al enviar el mensaje" });
    }
});

export default router


