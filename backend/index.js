const express = require('express');
const bodypraser = require('body-parser');
const cors = require('cors');
var multer = require('multer');
const nodemailer = require("nodemailer");


const app = express();
app.use(cors({ origin: "*" }));
app.use(bodypraser.json());
var dateTime=new Date();

const storage=multer.diskStorage({
    destination: (req,file,callBack)=>{
        callBack(null,'myFiles')
    },
    filename: (req,file,callBack)=>{
        callBack(null,`${dateTime.toISOString().slice(0,10)}_${file.originalname}`)
    }
});
var upload= multer({storage: storage});

app.post('/file/:email',upload.single('file'),(req,res,next)=>{
    const file=req.file;
    const email=req.params.email;
    if(!file){
        const error= new Error('Please upload file')
        error.httpStatusCode=400
        return next(error)
    }
    sendMail(email,file.path,file.filename);
    res.send(file);
});

function sendMail(email,filePath,fileName) {
    var transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: 'weTransferCo@gmail.com', 
          pass: 'pvdy buyh kjbg vnsy', 
        },
      });
      var mailOption={
          from: 'weTransferCo@gmail.com',
          to: email,
          subject: 'We Tranfser FILE',
          html: `<h1>Hello Friend</h1> <p>Now you can also download your file here: <a href="http://localhost:3000/file/${fileName}">${fileName}</a></p>`
      }
      transporter.verify(function (error, success) {
        if (error) {
          console.log('Mail ERROR=>>>',error);
        } else {
          console.log("Server is ready to take our messages");
        }
      });
      transporter.sendMail(mailOption,function(err, info){
            if(err) console.log("Something wrong =>",err);
            else console.logl('Email sent:' + info.messageId);
      });
}

app.get('/file/:path',(req,res,next)=>{
    const filePath= `myFiles/${req.params.path}` ;
    console.log('file path',filePath)
    res.download(filePath,(err)=>{
        if(err){
            console.log('something wrong =>',err);
            next(err);
        }
    });
});

app.listen(3000, () => {
    console.log("The server started on port 3000 !!!!!!");
});