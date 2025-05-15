const express = require('express');
const app = express();
const cors = require('cors');
var path = require('path');
const jwt = require('jsonwebtoken');

const cardRoutes = require('./Routers/cardRoutes.js');

app.listen(3000, console.log("Server up on port 3000"));

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use("/image", express.static(path.join(__dirname, 'image')));
app.use("/api/v1/card", cardRoutes);

// const { addOpus, getOpus, editOpus, deleteOpus } = require('./connection.js');
// const { registerUser, verifyUser } = require('./connection.js');

app.post("/opus", async (req, res) => {
    const { name } = req.body;
    await addOpus(name);
    res.send('Opus added!');
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        await verifyUser(email, password);
        const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: 7200 })
        res.send(token)
    }
    catch (error) {
        res.status(error.code || 500).send(error.message);
    }
});

app.post("/user", async (req, res) => {
    try {
        const {email, password, adminPass} = req.body;

        if (adminPass != process.env.NEW_USER_KEY)
            throw { message: "Admin pass is not valid" }

        await registerUser(email, password);
        res.send("User created");
    } catch (error) {
        res.status(error.code || 500).send(error.message);
    }

});

app.get("*", (req, res) => {
    res.status(404).send("Esta ruta no existe")
});

