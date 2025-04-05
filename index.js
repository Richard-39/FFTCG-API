const express = require('express');
const app = express();
const cors = require('cors');
var path = require('path');

app.listen(3000, console.log("Server up on port 3000"));
app.use(cors());

app.use(express.json({limit: '50mb'}));
app.use("/image", express.static(path.join(__dirname, 'image')));

const {addOpus, getOpus, editOpus, deleteOpus} = require ('./connection.js');
const {addCard, editCard, deleteCard} = require ('./connection.js');
const {getRandomCard} = require ('./connection.js');

app.post("/opus", async (req, res) => {
    const {name} = req.body;
    await addOpus(name);
    res.send('Opus added!');
});



app.post("/card", async (req, res) => {
    const {name, code, rarity_id, opus_id, cost, card_type_id, exburst, multiplayable, power, abilities, elements_id, jobs_id, categories_id, images} = req.body;
    await addCard(name, code, rarity_id, opus_id, cost, card_type_id, exburst, multiplayable, power, abilities, elements_id, jobs_id, categories_id, images);
    res.send("Card Added !");
});

app.put("/api/v1/card", async (req, res) => {

    console.log(req.body);
    const body = req.body;
    await editCard(body);
    /** 
    const {id, name, code, rarity_id, opus_id, cost, card_type_id, exburst, multiplayable, power, abilities, elements_id, jobs_id, categories_id, images} = req.body;
    await editCard(id, name, code, rarity_id, opus_id, cost, card_type_id, exburst, multiplayable, power, abilities, elements_id, jobs_id, categories_id, images);
    */
    res.send("Card edited !");
});

app.delete("/api/v1/card/:id", async (req, res) => {
    const {id} = req.params;
    const result = await deleteCard(id);
    res.send("Card deleted"); 
}); 

app.get("/api/v1/card/random", async (req, res) => {
    const random = await getRandomCard();
    res.json(random);
})

app.put("/", (req, res) => {

});

app.delete("/", (req, res) => {

});