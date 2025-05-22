const express = require('express');
const app = express();
const cors = require('cors');
var path = require('path');

const cardRoutes = require('./Controllers/Card/cardRoutes.js');
const authRoutes = require('./Controllers/Auth/authRoutes.js');
const otherRoutes = require('./Controllers/Other/OtherRoutes.js');

app.listen(3000, console.log("Server up on port 3000"));

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use("/api/image", express.static(path.join(__dirname, 'image')));
app.use("/api/v1/card", cardRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/other", otherRoutes);

app.get("*", (req, res) => {
    res.status(404).send("Esta ruta no existe")
});

