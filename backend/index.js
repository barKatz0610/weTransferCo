const express = require('express');//expose the server
const bodypraser = require('body-parser');//for the jason
const cors = require('cors');
var multer = require('multer');//for the files
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
//post-upload and send email
app.post('/file/:email',upload.single('file'),(req,res,next)=>{
    const file=req.file;
   // console.log(file.filename);
    //console.log(file.path);
    const email=req.params.email;
    if(!file){
        const error= new Error('Please upload file')
        error.httpStatusCode=400
        return next(error)
    }
    sendMail(email,file.path,file.filename);
  
    res.send(file)
});

function sendMail(email,filePath,fileName) {
    var transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: 'weTransferCo@gmail.com', // generated ethereal user
          pass: 'pvdy buyh kjbg vnsy', // generated ethereal password
        },
      });

      var mailOption={
          from: 'weTransferCo@gmail.com',
          to: email,
          subject: 'We Tranfser FILE',
          //text: `Hello, We send you your file that you upload. Now you can download it also here! `,
          html: '<h1>Hello</h1> <p> We send you your file that you uploaded. </p> <p>Now you can also download it here! </p>',
          attachments: {
              filename: fileName,
              path: filePath,
          }
          
      }
      transporter.sendMail(mailOption,function(err, info){
            if(err) console.log("Something wrong =>",err);

            else console.logl('Email sent:' + info.messageId);//this doesnt work
      });

}


//download the file
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