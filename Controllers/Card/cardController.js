const pool = require('../../connection.js');
const { v4: uuidv4 } = require('uuid');
const { dateFormat, clamp, getOperator, stringToCapitalize } = require('../../Extensions/formats.js');
const { constants } = require('../../constants.js');
const fs = require('fs');
const { validateToken } = require('../../Extensions/jwt.js');

const addCard = async (req, res) => {
    try {
        let payload = validateToken(req.header("Authorization"));
        console.log(payload);

        const { name, code, rarity_id, opus_id, cost, card_type_id, exburst, multiplayable, power, abilities, elements_id, jobs_id, categories_id, images } = req.body;

        // Adding card
        const post = 'insert into `card` values (UUID_TO_BIN(?), ?, ?, UUID_TO_BIN(?), UUID_TO_BIN(?), ?, UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?);';
        const cardId = uuidv4();
        const values = [cardId, name, code, rarity_id, opus_id, cost, card_type_id, exburst, multiplayable, power, abilities, dateFormat(new Date()), dateFormat(new Date())];

        try {
            await pool.query(post, values);
        } catch (error) {
            throw { message: `Insert a card: ${error}` }
        }

        // Adding element
        const arrayOfElements = elements_id.split(" ");
        for (const element of arrayOfElements) {
            const elementQuery = 'insert into `card_element` values (UUID_TO_BIN(?), UUID_TO_BIN(?));';
            const elementValues = [cardId, element];
            try {
                await pool.query(elementQuery, elementValues);
            } catch (error) {
                throw { message: `elementQuery: ${error}` }
            }
        }

        // adding job
        for (const job of jobs_id.array) {
            const jobQuery = 'insert into `card_job` values (UUID_TO_BIN(?), UUID_TO_BIN(?));';
            const jobValues = [cardId, job];
            try {
                await pool.query(jobQuery, jobValues);
            } catch (error) {
                throw { message: `jobQuery: ${error}` }
            }
        }

        // adding category
        const arrayOfCategories = categories_id.split(" ");
        for (const category of arrayOfCategories) {
            const categoryQuery = 'insert into `card_category` values (UUID_TO_BIN(?), UUID_TO_BIN(?));';
            const categoryValues = [cardId, category];
            try {
                await pool.query(categoryQuery, categoryValues);
            } catch (error) {
                console.log(error);
                throw { message: `categoryQuery: ${error}` }
            }
        }

        // Adding image
        try {
            await addArrayOfImage(images.array, cardId);
        } catch (error) {
            throw error
        }

        res.send("Card Added !");
    } catch (error) {
        console.log(error);
        res.status(error.code || 500).send(`cardController.js -> addCard -> ${error.message}`);
    }
};

const editCard = async (req, res) => {
    try {
        validateToken(req.header("Authorization"));
        const body = req.body;

        let columCardNameArray = ["name", "code", "rarity_id", "opus_id", "cost", "card_type_id", "exburst", "multiplayable", "power", "abilities"];
        let cardKeyArray = [];
        let cardValueArray = [];

        for (const [key, value] of Object.entries(body)) {

            if (columCardNameArray.includes(key)) {
                let columToSet = key;
                if (key.endsWith("id"))
                    columToSet += " = UUID_TO_BIN(?)";
                else
                    columToSet += " = ?";

                cardKeyArray.push(columToSet);
                cardValueArray.push(value);
            }
        }

        if (cardKeyArray.length > 0) {
            cardValueArray.push(body.id);
            const columCardString = cardKeyArray.join(", ");
            const initialCardString = 'update card set $ where id = UUID_TO_BIN(?);';
            const cardQuery = initialCardString.replace("$", columCardString);
            try {
                await pool.query(cardQuery, cardValueArray);
            } catch (error) {
                console.log(error);
                throw { code: error.code, message: `cardQuery: ${error}` }
            }
        }

        /* --------- OTHERS TABLES ----------- */

        if (body.hasOwnProperty('elements_id')) {
            const elementArray = body.elements_id.split(" ");
            if (elementArray.length > 0) {
                const elementDeleteQuery = 'delete from card_element where card_id = UUID_TO_BIN(?);';
                const elementDeleteValue = [body.id];
                try {
                    await pool.query(elementDeleteQuery, elementDeleteValue);
                } catch (error) {
                    throw { message: `elementDeleteQuery: ${error}` }
                }

                for (const element_id of elementArray) {
                    const elementQuery = 'insert into `card_element` values (UUID_TO_BIN(?), UUID_TO_BIN(?));';
                    const elementValues = [body.id, element_id];
                    try {
                        await pool.query(elementQuery, elementValues);
                    } catch (error) {
                        throw { message: `elementQuery: ${error}` }
                    }
                }
            }
        }

        if (body.hasOwnProperty('jobs_id')) {
            const jobArray = body.jobs_id.array;
            if (jobArray.length > 0) {
                const jobDeleteQuery = 'delete from card_job where card_id = UUID_TO_BIN(?);';
                const jobDeleteValue = [body.id];
                try {
                    await pool.query(jobDeleteQuery, jobDeleteValue);
                } catch (error) {
                    throw { message: `jobDeleteQuery: ${error}` }
                }

                for (const job_id of jobArray) {
                    const jobQuery = 'insert into `card_job` values (UUID_TO_BIN(?), UUID_TO_BIN(?));';
                    const jobValues = [body.id, job_id];
                    try {
                        await pool.query(jobQuery, jobValues);
                    } catch (error) {
                        throw { message: `jobQuery: ${error}` }
                    }
                }
            }
        }

        if (body.hasOwnProperty('categories_id')) {
            const categoryArray = body.categories_id.split(" ");
            if (categoryArray.length > 0) {
                const categoryDeleteQuery = 'delete from card_category where card_id = UUID_TO_BIN(?);';
                const categoryDeleteValue = [body.id];
                try {
                    await pool.query(categoryDeleteQuery, categoryDeleteValue);
                } catch (error) {
                    throw { message: `categoryDeleteQuery: ${error}` }
                }

                for (const category_id of categoryArray) {
                    const categoryQuery = 'insert into `card_category` values (UUID_TO_BIN(?), UUID_TO_BIN(?));';
                    const categoryValues = [body.id, category_id];
                    try {
                        await pool.query(categoryQuery, categoryValues);
                    } catch (error) {
                        throw { message: `categoryQuery: ${error}` }
                    }
                }
            }
        }

        if (body.hasOwnProperty('images')) {
            const imageArray = body.images.array;
            if (imageArray.length > 0) {
                // deleting currents images
                try {
                    await deleteImageFromDisc(body.id);
                } catch (error) {
                    throw error;
                }

                const imageDeleteQuery = 'delete from image where card_id = UUID_TO_BIN(?);';
                const imageDeleteValue = [body.id];
                try {
                    await pool.query(imageDeleteQuery, imageDeleteValue);
                } catch (error) {
                    throw { message: `imageDeleteQuery: ${error}` }
                }

                // Adding new image
                try {
                    await addArrayOfImage(imageArray, body.id);
                } catch (error) {
                    throw error;
                }
            }
        }

        res.send("Card edited !");
    } catch (error) {
        console.log(error);
        res.status(error.code || 500).send(`cardController.js -> editCard -> ${error.message}`);
    }
};

const deleteCard = async (req, res) => {
    try {
        let email = validateToken(req.header("Authorization"));
        console.log(email);
        const { id } = req.params;

        try {
            await deleteImageFromDisc(id);
        } catch (error) {
            throw error;
        }

        const deleteQuery = 'delete from card where id = UUID_TO_BIN(?);';
        const deleteValues = [id];
        try {
            await pool.query(deleteQuery, deleteValues);
        } catch (error) {
            throw error;
        }

        res.send("Card deleted");
    } catch (error) {
        console.log(error);
        res.status(error.code || 500).send(`cardController.js -> deleteCard -> ${error.message}`);
    }
};

const getRandomCard = async (req, res) => {
    try {
        let codeResult;
        const codeQuery = 'SELECT code from card order by rand() limit 1;';
        try {
            [codeResult] = await pool.query(codeQuery);
        } catch (error) {
            throw { message: `codeQuery: ${error}` }
        }

        res.redirect(`${process.env.LOCAL_PATH}/api/v1/card/${codeResult[0].code}`);
        
    } catch (error) {
        console.log(error);
        res.status(error.code || 500).send(`cardController.js -> getRandomCard -> ${error.message}`);
    }
};

const getCardByCode = async (req, res) => {
    try {
        const { code } = req.params;
        let cardResult, elementResult, jobResult, categoryResult, imageResult;

        const cardQuery = 'SELECT BIN_TO_UUID(card.id) as `id`, card.name, code, rarity.name as `rarity`, opus.name as `opus`, cost, card_type.name as `card type`, exburst, multiplayable, power, abilities, create_at, update_at from card join rarity on card.rarity_id = rarity.id join opus on card.opus_id = opus.id join card_type on card.card_type_id = card_type.id where code = ?;';
        const cardValue = [code];
        try {
            [cardResult] = await pool.query(cardQuery, cardValue);
        } catch (error) {
            throw { message: `cardQuery: ${error}` }
        }

        if (cardResult.length <= 0)
            throw { message: `cardQuery: no result for code given` }

        const elementQuery = 'select element.name from card_element join element on card_element.element_id = element.id where card_element.card_id = UUID_TO_BIN(?);';
        const elementValues = [cardResult[0].id];
        try {
            [elementResult] = await pool.query(elementQuery, elementValues);
        } catch (error) {
            throw { message: `elementQuery: ${error}` }
        }

        const jobQuery = 'select job.name from card_job join job on card_job.job_id = job.id where card_job.card_id = UUID_TO_BIN(?);';
        const jobValues = [cardResult[0].id];
        try {
            [jobResult] = await pool.query(jobQuery, jobValues);
        } catch (error) {
            throw { message: `jobQuery: ${error}` }
        }

        const categoryQuery = 'select category.name from card_category join category on card_category.category_id = category.id where card_category.card_id = UUID_TO_BIN(?);';
        const categoryValues = [cardResult[0].id];
        try {
            [categoryResult] = await pool.query(categoryQuery, categoryValues);
        } catch (error) {
            throw { message: `categoryQuery: ${error}` }
        }

        const imageQuery = 'select image_type.name as `ilustration`, src from image join image_type on image.image_type_id = image_type.id where image.card_id = UUID_TO_BIN(?);';
        const ImageValues = [cardResult[0].id];
        try {
            [imageResult] = await pool.query(imageQuery, ImageValues);
        } catch (error) {
            throw { message: `imageQuery: ${error}` }
        }

        let Card = cardResult[0];
        Card.elements = elementResult.map(e => e.name);
        Card.jobs = jobResult.map(j => j.name);
        Card.categories = categoryResult.map(c => c.name);
        Card.ilustrations = imageResult.map(i => {
            const obj = Object.assign({}, i);
            obj.src = constants.imageURL + i.src;
            return obj;
        });

        res.json(Card);
    } catch (error) {
        console.log(error);
        res.status(error.code || 500).send(`cardController.js -> getCardByCode -> ${error.message}`);
    }
};

const getCard = async (req, res) => {
    try {
        const queryString = req.query;
        let url = req.url;

        let itemLimit, offset, currentPage;
        let arrayJoins = [];
        let arrayConditions = [];
        let queryValues = [];
        let result = {};

        let cardQuery = "select distinct card.name, code, src from card " +
            "join (select card_id, src from image where image.image_type_id = (select id from image_type where name = 'Regular')) as subImage " +
            "on subImage.card_id = card.id " +
            "$joinString$" +
            "$whereString$" +
            "order by code asc " +
            "limit ? " +
            "offset ? ;";

        if (queryString.hasOwnProperty('limit'))
            itemLimit = Number.isNaN(parseInt(queryString.limit)) ? 10 : Math.trunc(Math.abs(queryString.limit)); // check if the limit value is not a NaN
        else
            itemLimit = 10

        if (queryString.hasOwnProperty('page')) {
            const pageValue = parseInt(queryString.page);
            currentPage = Number.isNaN(pageValue) ? 1 : Math.trunc(clamp(pageValue, 1, Number.MAX_SAFE_INTEGER)); // check if the page value is not a NaN
            offset = (currentPage - 1) * itemLimit;
        } else {
            currentPage = 1;
            offset = 0;
        }

        // where conditions

        if (queryString.hasOwnProperty('exburst')) {
            const string = String(queryString.exburst).toLowerCase();
            const value = (string === 'true' || string === '1');
            arrayConditions.push("card.exburst = ?");
            queryValues.push(value);
        }

        if (queryString.hasOwnProperty('multiplayable')) {
            const string = String(queryString.multiplayable).toLowerCase();
            const value = (string === 'true' || string === '1');
            arrayConditions.push("card.multiplayable = ?");
            queryValues.push(value);
        }

        if (queryString.hasOwnProperty('power')) {
            const value = queryString.power[1];
            const power = Number.isNaN(parseInt(value)) ? null : Math.trunc(Math.abs(value));
            if (power != null)
                arrayConditions.push(`card.power ${getOperator(queryString.power[0])} ${power}`);
        }

        if (queryString.hasOwnProperty('abilities')) {
            arrayConditions.push(`card.abilities like ?`);
            queryValues.push(`%${queryString.abilities}%`);
        }

        if (queryString.hasOwnProperty('cost')) {
            if (Array.isArray(queryString.cost)) {
                let costString = [];
                queryString.cost.forEach(element => {
                    costString.push("card.cost = ?");
                    queryValues.push(element);
                });
                arrayConditions.push(`(${costString.join(" or ")})`);
            } else {
                arrayConditions.push("card.cost = ?");
                queryValues.push(queryString.cost);
            }
        }

        if (queryString.hasOwnProperty('name')) {
            arrayConditions.push(`card.name like ?`);
            queryValues.push(`%${queryString.name}%`);
        }

        // conditions that need joins

        if (queryString.hasOwnProperty('rarity')) {
            arrayJoins.push("join rarity on card.rarity_id = rarity.id");
            if (Array.isArray(queryString.rarity)) {
                let rarityString = [];
                queryString.rarity.forEach(element => {
                    rarityString.push("rarity.name = ?");
                    queryValues.push(stringToCapitalize(element));
                });
                arrayConditions.push(`(${rarityString.join(" or ")})`);
            } else {
                arrayConditions.push("rarity.name = ?");
                queryValues.push(stringToCapitalize(queryString.rarity));
            }
        }

        if (queryString.hasOwnProperty('opus')) {
            arrayJoins.push("join opus on card.opus_id = opus.id");
            if (Array.isArray(queryString.opus)) {
                let opusString = [];
                queryString.opus.forEach(element => {
                    opusString.push("opus.opus_code = ?");
                    queryValues.push(element);
                });
                arrayConditions.push(`(${opusString.join(" or ")})`);
            } else {
                arrayConditions.push("opus.opus_code = ?");
                queryValues.push(queryString.opus);
            }
        }

        if (queryString.hasOwnProperty('card_type')) {
            arrayJoins.push("join card_type on card.card_type_id = card_type.id");
            if (Array.isArray(queryString.card_type)) {
                let card_typeString = [];
                queryString.card_type.forEach(element => {
                    card_typeString.push("card_type.name = ?");
                    queryValues.push(stringToCapitalize(element));
                });
                arrayConditions.push(`(${card_typeString.join(" or ")})`);
            } else {
                arrayConditions.push("card_type.name = ?");
                queryValues.push(stringToCapitalize(queryString.card_type));
            }
        }

        if (queryString.hasOwnProperty('element')) {
            arrayJoins.push("join card_element on card.id = card_element.card_id join element on card_element.element_id = element.id");
            if (Array.isArray(queryString.element)) {
                let elementString = [];
                queryString.element.forEach(element => {
                    elementString.push("element.name = ?");
                    queryValues.push(stringToCapitalize(qelement));
                });
                arrayConditions.push(`(${elementString.join(" or ")})`);
            } else {
                arrayConditions.push("element.name = ?");
                queryValues.push(stringToCapitalize(queryString.element));
            }
        }

        if (queryString.hasOwnProperty('category')) {
            arrayJoins.push("join card_category on card.id = card_category.card_id join category on card_category.category_id = category.id");
            if (Array.isArray(queryString.category)) {
                let categoryString = [];
                queryString.category.forEach(element => {
                    categoryString.push("category.name = ?");
                    queryValues.push(element);
                });
                arrayConditions.push(`(${categoryString.join(" or ")})`);
            } else {
                arrayConditions.push("category.name = ?");
                queryValues.push(queryString.category);
            }
        }

        if (queryString.hasOwnProperty('job')) {
            arrayJoins.push("join card_job on card.id = card_job.card_id join job on card_job.job_id = job.id");
            if (Array.isArray(queryString.job)) {
                let jobString = [];
                queryString.job.forEach(element => {
                    jobString.push("job.name = ?");
                    queryValues.push(element);
                });
                arrayConditions.push(`(${jobString.join(" or ")})`);
            } else {
                arrayConditions.push("job.name = ?");
                queryValues.push(queryString.job);
            }
        }

        // preparing statement

        if (arrayConditions.length > 0) {
            const whereString = `where ${arrayConditions.join(" and ")} `;
            cardQuery = cardQuery.replace("$whereString$", whereString);
        } else
            cardQuery = cardQuery.replace("$whereString$", "");

        if (arrayJoins.length > 0) {
            const joinString = `${arrayJoins.join(" ")} `;
            cardQuery = cardQuery.replace("$joinString$", joinString);
        } else
            cardQuery = cardQuery.replace("$joinString$", "");

        // query to know how many row are
        let countQuery = cardQuery.replace('limit ?', "").replace('offset ?', "").replace("card.name, code, src", "count(code) as 'count'");

        queryValues.push(itemLimit, offset)

        //console.log("cardQuery :" + cardQuery);
        //console.log("queryValues :" + queryValues);

        let cardResult;
        try {
            [cardResult] = await pool.query(cardQuery, queryValues);
            [countResult] = await pool.query(countQuery, queryValues);
        } catch (error) {
            throw { message: `cardQuery: ${error}` }
        }

        cardResult.map(card => {
            card.src = constants.imageURL + card.src;
            card.link = `${process.env.LOCAL_PATH}/api/v1/card/${card.code}`
        });

        result.totalElements = countResult[0].count;
        result.showing = cardResult.length;
        result.totalPage = Math.trunc(countResult[0].count / itemLimit) + 1;
        result.currentPage = currentPage;
        result.previous = currentPage - 1 <= 0 ? null : `${process.env.LOCAL_PATH}${url.replace(`page=${queryString.page}`, `page=${currentPage - 1}`)}`;
        result.next = currentPage < result.totalPage ? `${process.env.LOCAL_PATH}${url.replace(`page=${queryString.page}`, `page=${currentPage + 1}`)}` : null;
        result.cards = cardResult;

        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(error.code || 500).send(`cardController.js -> getCard -> ${error.message}`);
    }
};

const deleteImageFromDisc = async (card_id) => {
    // deleting currents images
    let srcImage;
    const getImageQuery = 'select src from image where card_id = UUID_TO_BIN(?);';
    const getImageValue = [card_id];
    try {
        srcImage = await pool.query(getImageQuery, getImageValue);
    } catch (error) {
        console.log(error);
        throw { message: `connection.js -> deleteImageFromDisc -> getImageQuery: ${error}` }
    }

    for (const image of srcImage[0]) {
        try {
            fs.unlinkSync(image.src);
            console.log("Images deleted");
        } catch (error) {
            console.log(error);
            throw { message: `connection.js -> deleteImageFromDisc -> fs.unlinkSync: ${error}` }
        }
    };
};

const addArrayOfImage = async (arrayOfImage, card_id) => {
    for (const image of arrayOfImage) {
        const image_id = uuidv4();
        const base64Image = image.base64String.split(';base64,').pop(); // Remove header
        const path = `${constants.imagePath}${image_id}.jpeg`;

        try {
            fs.writeFile(path, base64Image, { encoding: 'base64' }, function (err) { });
        } catch (error) {
            console.log(error);
            throw { message: `connection.js -> addArrayOfImage -> fs.writeFile: ${error}` }
        }

        const imageQuery = 'insert into `image` values (UUID_TO_BIN(?), UUID_TO_BIN(?), UUID_TO_BIN(?), ?);';
        const imageValues = [image_id, card_id, image.image_type_id, path];
        try {
            await pool.query(imageQuery, imageValues);
        } catch (error) {
            console.log(error);
            throw { message: `connection.js -> addArrayOfImage -> imageQuery: ${error}` }
        };
    };
    return { message: "images added" };
}


module.exports = { addCard, editCard, deleteCard, getRandomCard, getCardByCode, getCard };