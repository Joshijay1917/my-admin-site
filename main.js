import mongoose from "mongoose"
import express from "express"
import { user } from "./models/userdata.js"
import cors from "cors"
const app = express()
const port = 3000
let currentusers = [];
let currentpasswords = []
let currentemails = []
let objectsid = []
let currentid

await mongoose.connect("localhost:27017/Company")
app.set(`view engine`, `ejs`)
app.use(express.static('views'))
app.use(express.text());
app.use(express.json());
app.use(cors());

app.get(`/`, async (req, res) => {
    res.render('welcome')
})

app.get(`/display`, async (req, res) => {
    res.sendFile("./index.html", {root:"D:\\Web Devlopment\\my admin site\\views"})
})

app.get('/update', async (req, res) => {
    let userna = await user.find({}, "username");
    userna.forEach(element => {
        currentusers.push(element.username)
    })
    currentusers = filterarray(currentusers, userna, 0);


    let passwordna = await user.find({}, "password");
    passwordna.forEach(element => {
        currentpasswords.push(element.password)
    })
    currentpasswords = filterarray(currentpasswords, passwordna, 1);

    let emailsna = await user.find({}, "email");
    emailsna.forEach(element => {
        currentemails.push(element.email)
    });
    currentemails = filterarray(currentemails, emailsna, 2);

    let objectsidna = await user.find({}, "_id");
    objectsidna.forEach(element => {
        objectsid.push(element._id)
    });
    objectsid = filterarray(objectsid, objectsidna, 3);

    res.json({ currentusers, currentpasswords, currentemails, objectsid })
})

app.post(`/delete`, async (req, res) => {
    let objectdeleteid = await req.body
    let a = user.findById(objectdeleteid)
    await user.deleteOne({_id:a._conditions._id})
})

app.post(`/editedcurrentid`, async (req, res) => {
    currentid = await req.body;
})

app.post(`/adding`, async (req, res) => {
    let addingdata = req.body;
    
    try {
        await user.create(addingdata)
        .then(()=>{res.json({msg:"Successfully add data"});})
        .catch((err)=>{console.log(err.errorResponse.code);
            let a = err.errorResponse.code
            res.status(500).json({err:a});
        })
    } catch (error) {
        console.log("Unable to add data", error);
    }
})

app.post(`/editeddata`, async (req, res) => {
    let editeddata = req.body;
    let a = user.findById(currentid)
    await user.updateOne({_id:a._conditions._id}, {$set:{username:editeddata.username, password:editeddata.password, email:editeddata.email}})
})

app.listen(port, () => {
    console.log(`Example app running on port ${port}`);
})

function filterarray(arr1, arr2, i) {
    let newarr = []
    arr2.forEach(e => {
        if (arr1.includes(e)) { }
        else {
            if (i == 0) {
                newarr.push(e.username);
            }
            else if (i == 1) {
                newarr.push(e.password);
            }
            else if (i == 2) {
                newarr.push(e.email);
            }
            else {
                newarr.push(e._id);
            }
        }
    })
    return newarr
}
