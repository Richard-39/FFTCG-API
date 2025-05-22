const pool = require('../../connection.js');
const { v4: uuidv4 } = require('uuid');

const addOpus = async (req, res) => {

    const { name } = req.body;
    const post = 'insert into `opus` values (UUID_TO_BIN(?), ?);';
    const values = [uuidv4(), name];

    try {
        await pool.query(post, values);
        res.send('Opus added!');
    } catch (error) {
        console.log(error);
        res.status(error.code || 500).send(`otherController.js -> addOpus -> ${error}`);
    }
};

module.exports = { addOpus };