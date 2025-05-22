const jwt = require('jsonwebtoken');

const validateToken = (bearerToken) => {
    try {
        const token = bearerToken.split("Bearer ")[1];
        jwt.verify(token, process.env.SECRET_KEY); // exception if verification fail
        const payload = jwt.decode(token);
        return payload;
    } catch (error) {
        console.log(error);
        throw { message: `Token is not valid: ${error}` }
    }
};

module.exports = { validateToken }