const express = require('express');
const app = express();
const cors = require('cors');
var path = require('path');
const jwt = require('jsonwebtoken');

app.listen(3000, console.log("Server up on port 3000"));
app.use(cors());

app.use(express.json({ limit: '50mb' }));
app.use("/image", express.static(path.join(__dirname, 'image')));

const { addOpus, getOpus, editOpus, deleteOpus } = require('./connection.js');
const { addCard, editCard, deleteCard } = require('./connection.js');
const { getCardByCode, getRandomCard, getCard } = require('./connection.js');
const { registerUser, verifyUser } = require('./connection.js');

app.post("/card", async (req, res) => {
    try {
        let email = validateToken(req.header("Authorization"));
        const { name, code, rarity_id, opus_id, cost, card_type_id, exburst, multiplayable, power, abilities, elements_id, jobs_id, categories_id, images } = req.body;
        await addCard(name, code, rarity_id, opus_id, cost, card_type_id, exburst, multiplayable, power, abilities, elements_id, jobs_id, categories_id, images);
        res.send("Card Added !");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.put("/api/v1/card", async (req, res) => {
    try {
        let email = validateToken(req.header("Authorization"));
        const body = req.body;
        await editCard(body);
        res.send("Card edited !");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.delete("/api/v1/card/:id", async (req, res) => {
    try {
        let email = validateToken(req.header("Authorization"));
        console.log(email);
        res.send("test");
        return;

        const { id } = req.params;
        const result = await deleteCard(id);
        res.send("Card deleted");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// this method should be first than "app.get("/api/v1/card/:code")", otherwise it'l not be readen 
app.get("/api/v1/card/random/", async (req, res) => {
    try {
        const random = await getRandomCard();
        res.json(random);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get("/api/v1/card/:code", async (req, res) => {
    try {
        const { code } = req.params;
        const card = await getCardByCode(code);
        res.json(card);
    } catch (error) {
        res.status(500).send(error.message);
    }
})

app.get("/api/v1/card", async (req, res) => {
    try {
        const queryString = req.query;
        const card = await getCard(queryString, req.url);
        res.json(card);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

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

        if (adminPass != process.env.SECRET_KEY)
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

const validateToken = (bearerToken, res) => {
    try {
        const token = bearerToken.split("Bearer ")[1];
        jwt.verify(token, process.env.SECRET_KEY); // exception if verification fail
        const { email } = jwt.decode(token);
        return email;
    } catch (error) {
        console.log(error);
        throw { message: `Token is not valid: ${error}` }
    }
};