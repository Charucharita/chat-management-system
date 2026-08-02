const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const Chat = require('./models/chat.model.js')
const method = require('method-override')

const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(method('_method'))


app.use(express.static(path.join(__dirname, "public")))
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.send("hello world")
})

// app.post("/chats/send", async (req, res) => {
//     try {
//         const chats = await Chat.create(req.body)
//         res.status(200).json(chats)
//     } catch (error) {
//         res.status(500).json({ message: error.message })
//     }
// })


//Create route
app.post("/chats", (req, res) => {
    const { from, msg, to } = req.body
    const newChat = new Chat({
        from: from,
        msg: msg,
        to: to,
        created_at: new Date()
    })
    newChat.save().then((res) => {
        console.log("saved")
    }).catch((err) => {
        console.log(err)
    })

    res.redirect("/chats")
})

//New route
app.get("/chats/new", (req, res) => {
    res.render("newChat.ejs")
})

//edit route
app.get("/chats/:id/edit", async (req, res) => {
    const { id } = req.params
    const chat = await Chat.findById(id)
    res.render("edit.ejs", { chat })
})

//update route
app.put("/chats/:id", async (req, res) => {
    const { id } = req.params
    const { msg } = req.body
    const updated_at = new Date()
    const updatedMsg = await Chat.findByIdAndUpdate(
        id, 
        { msg ,updated_at},
        { runValidators: true },
        { new: true }
    )
    res.redirect("/chats")
})

//delete route
app.delete("/chats/:id", async (req, res) => {
    const { id } = req.params
    const deletedChat = await Chat.findByIdAndDelete(id)
    res.redirect("/chats")
})


//Index route
app.get("/chats", async (req, res) => {
    const chats = await Chat.find({})
    res.render("index", { chats })
})


//connecting mongoDB 
mongoose.connect("mongodb+srv://charucharitamp_db_user:charu123@cluster0.hm4zmec.mongodb.net/?appName=Cluster0")
    .then(() => {
        console.log("connected successfully")
        app.listen(port, () => {
            console.log(`App listening on port http://localhost/${port}`)
        })
    }).catch((error) => {
        console.log("connection failed" + error)
    })

