const pool = require('../../connection.js');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const login = async (req, res) => {

    const { email, password } = req.body;
    const userQuery = "select password from user where email = ? ;";
    const userValues = [email];

    try {
        const [result] = await pool.query(userQuery, userValues);
        if (result.length <= 0)
            throw { message: `authController.js -> login: There is not user with that email or password` }

        if (!bcrypt.compareSync(password, result[0].password))
            throw { code: 401, message: `authController.js -> login: Password wrong` }

        const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: 7200 })
        res.send(token)
    }
    catch (error) {
        console.log(error);
        res.status(error.code || 500).send(`authController.js -> login: ${error.message}`);
    }
};

const addUser = async (req, res) => {

    const { email, password, adminPass } = req.body;

    if (adminPass != process.env.NEW_USER_KEY) {
        res.status(400).send('Admin pass is not valid');
        return;
    }

    const encryptedPassword = bcrypt.hashSync(password);
    const userQuery = 'insert into `user` values (UUID_TO_BIN(?), ?, ?) ;';
    const userValues = [uuidv4(), email, encryptedPassword]

    try {
        await pool.query(userQuery, userValues);
        res.send("User created");
    } catch (error) {
        console.log(error);
        res.status(error.code || 500).send(`authController.js -> addUser: ${error}`);
    }
};

module.exports = { login, addUser };