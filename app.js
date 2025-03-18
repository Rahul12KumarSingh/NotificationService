 const express  = require('express');
 const bodyParser = require('body-parser');
 const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json())
const admin = require("firebase-admin");

const serviceAccount =  require("./serviceAccountKey.json"); 

admin.initializeApp({
    credential : admin.credential.cert(serviceAccount),
}) 

let token = [] ;

app.post('/store-token', (req, res) => {
    token.push(req.body.token);
    res.send('Token stored');

    console.log("stored token", token);
}) ;


app.post('/send-notification', async(req, res) => {

     const message = {
        notification :{
            title : "New Notification",
            body : "kaise ho sab"
        } ,
        tokens : token
     } ;

     try {
          const response = await admin.messaging().sendEachForMulticast(message);

          res.status(200).json({
                success : true,
                response : response
          }) 
     } catch (error) {
         res.status(500).json({success: false , error: error.message }) ;
     }
}) ;

app.listen(5000, () => {    
     console.log('Server is up running.....');
}) ;