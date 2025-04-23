const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');
const { dateFormat, clamp, getOperator } = require('./extension.js');
const { constants } = require('./constants.js');

const fs = require('fs');
const { type } = require('os');

const pool = mysql.createPool({
  connectionLimit: 5,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  port: process.env.DB_PORT,
  queueLimit: 0
});

const addCard = async (name, code, rarity_id, opus_id, cost, card_type_id, exburst, multiplayable, power, abilities, elements_id, jobs_id, categories_id, images) => {

  // Adding card
  const post = 'insert into `card` values (UUID_TO_BIN(?), ?, ?, UUID_TO_BIN(?), UUID_TO_BIN(?), ?, UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?);';
  const cardId = uuidv4();
  const values = [cardId, name, code, rarity_id, opus_id, cost, card_type_id, exburst, multiplayable, power, abilities, dateFormat(new Date()), dateFormat(new Date())];

  try {
    await pool.query(post, values);
  } catch (error) {
    console.log(error);
    throw { message: `connection.js -> addCard -> post: ${error}` }
  }

  // Adding element
  const arrayOfElements = elements_id.split(" ");
  for (const element of arrayOfElements) {
    const elementQuery = 'insert into `card_element` values (UUID_TO_BIN(?), UUID_TO_BIN(?));';
    const elementValues = [cardId, element];
    try {
      await pool.query(elementQuery, elementValues);
    } catch (error) {
      console.log(error);
      throw { message: `connection.js -> addCard -> elementQuery: ${error}` }
    }
  }

  // adding job
  for (const job of jobs_id.array) {
    const jobQuery = 'insert into `card_job` values (UUID_TO_BIN(?), UUID_TO_BIN(?));';
    const jobValues = [cardId, job];
    try {
      await pool.query(jobQuery, jobValues);
    } catch (error) {
      console.log(error);
      throw { message: `connection.js -> addCard -> jobQuery: ${error}` }
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
      throw { message: `connection.js -> addCard -> categoryQuery: ${error}` }
    }
  }

  // Adding image
  try {
    await addArrayOfImage(images.array, cardId);
  } catch (error) {
    throw error
  }
};

const getCardByCode = async (code) => {

  let cardResult, elementResult, jobResult, categoryResult, imageResult;

  const cardQuery = 'SELECT BIN_TO_UUID(card.id) as `id`, card.name, code, rarity.name as `rarity`, opus.name as `opus`, cost, card_type.name as `card type`, exburst, multiplayable, power, abilities, create_at, update_at from card join rarity on card.rarity_id = rarity.id join opus on card.opus_id = opus.id join card_type on card.card_type_id = card_type.id where code = ?;';
  const cardValue = [code];
  try {
    [cardResult] = await pool.query(cardQuery, cardValue);
  } catch (error) {
    console.log(error);
    throw { message: `connection.js -> getCardByCode -> cardQuery: ${error}` }
  }

  if (cardResult.length <= 0)
    throw { message: `connection.js -> getCardByCode -> cardQuery: no result for code given` }

  const elementQuery = 'select element.name from card_element join element on card_element.element_id = element.id where card_element.card_id = UUID_TO_BIN(?);';
  const elementValues = [cardResult[0].id];
  try {
    [elementResult] = await pool.query(elementQuery, elementValues);
  } catch (error) {
    console.log(error);
    throw { message: `connection.js -> getCardByCode -> elementQuery: ${error}` }
  }

  const jobQuery = 'select job.name from card_job join job on card_job.job_id = job.id where card_job.card_id = UUID_TO_BIN(?);';
  const jobValues = [cardResult[0].id];
  try {
    [jobResult] = await pool.query(jobQuery, jobValues);
  } catch (error) {
    console.log(error);
    throw { message: `connection.js -> getCardByCode -> jobQuery: ${error}` }
  }

  const categoryQuery = 'select category.name from card_category join category on card_category.category_id = category.id where card_category.card_id = UUID_TO_BIN(?);';
  const categoryValues = [cardResult[0].id];
  try {
    [categoryResult] = await pool.query(categoryQuery, categoryValues);
  } catch (error) {
    console.log(error);
    throw { message: `connection.js -> getCardByCode -> categoryQuery: ${error}` }
  }

  const imageQuery = 'select image_type.name as `ilustration`, src from image join image_type on image.image_type_id = image_type.id where image.card_id = UUID_TO_BIN(?);';
  const ImageValues = [cardResult[0].id];
  try {
    [imageResult] = await pool.query(imageQuery, ImageValues);
  } catch (error) {
    console.log(error);
    throw { message: `connection.js -> getCardByCode -> imageQuery: ${error}` }
  }

  let Card = cardResult[0];
  Card.elements = elementResult.map(e => e.name);
  Card.jobs = jobResult.map(j => j.name);
  Card.categories = categoryResult.map(c => c.name);
  Card.ilustrations = imageResult.map(i => {
    const obj = Object.assign({}, i);
    obj.src = process.env.LOCAL_PATH + i.src;
    return obj;
  });
  return Card;
};

const getRandomCard = async () => {

  let codeResult;
  const codeQuery = 'SELECT code from card order by rand() limit 1;';
  try {
    [codeResult] = await pool.query(codeQuery);
  } catch (error) {
    console.log(error);
    throw { message: `connection.js -> getRandomCard -> codeQuery: ${error}` }
  }

  try {
    const card = await getCardByCode(codeResult[0].code);
    return card;
  } catch (error) {
    throw error;
  }
};

const getCard = async (body) => {

  let itemLimit, offset;
  let arrayJoins = [];
  let arrayConditions = [];
  let queryValues = [];

  let cardQuery = "select distinct card.name, code, src from card " +
    "join (select card_id, src from image where image.image_type_id = (select id from image_type where name = 'Regular')) as subImage " +
    "on subImage.card_id = card.id " +
    "$joinString$" +
    "$whereString$" +
    "order by code asc " +
    "limit ? " +
    "offset ?; ";

  if (body.hasOwnProperty('limit'))
    itemLimit = Number.isNaN(parseInt(body.limit)) ? 10 : Math.trunc(Math.abs(body.limit)); // check if the limit value is not a NaN
  else
    itemLimit = 10

  if (body.hasOwnProperty('page'))
    offset = Number.isNaN(parseInt(body.page)) ? 0 : Math.trunc(clamp(body.page - 1, 0, Number.MAX_SAFE_INTEGER)) * itemLimit; // check if the page value is not a NaN
  else
    offset = 0;

  // where conditions

  if (body.hasOwnProperty('exburst')) {
    arrayConditions.push("card.exburst = ?");
    queryValues.push(body.exburst);
  }

  if (body.hasOwnProperty('multiplayable')) {
    arrayConditions.push("card.multiplayable = ?");
    queryValues.push(body.multiplayable);
  }

  if (body.hasOwnProperty('power'))
    if (body.power.values.length == 1) {
      arrayConditions.push(`card.power ${getOperator(body.power.operator)} ?`);
      queryValues.push(body.power.values[0]);
    }

    else if (body.power.values.length == 2) {
      arrayConditions.push("card.power BETWEEN ? AND ?");
      queryValues.push(Math.min(body.power.values[0], body.power.values[1]), Math.max(body.power.values[0], body.power.values[1]));
    }

  if (body.hasOwnProperty('abilities')) {
    arrayConditions.push(`card.abilities like ?`);
    queryValues.push(`%${body.abilities}%`);
  }

  if (body.hasOwnProperty('cost') && body.cost.length > 0) {
    let costString = [];
    body.cost.forEach(element => {
      costString.push("card.cost = ?");
      queryValues.push(element);
    });
    arrayConditions.push(`(${costString.join(" or ")})`);
  }

  if (body.hasOwnProperty('name')) {
    arrayConditions.push(`card.name like ?`);
    queryValues.push(`%${body.name}%`);
  }

  if (body.hasOwnProperty('rarity_id') && body.rarity_id.length > 0) {
    let rarity_idString = [];
    body.rarity_id.forEach(element => {
      rarity_idString.push("card.rarity_id = UUID_TO_BIN(?)");
      queryValues.push(element);
    });
    arrayConditions.push(`(${rarity_idString.join(" or ")})`);
  }

  if (body.hasOwnProperty('opus_id') && body.opus_id.length > 0) {
    let opus_idString = [];
    body.opus_id.forEach(element => {
      opus_idString.push("card.opus_id = UUID_TO_BIN(?)");
      queryValues.push(element);
    });
    arrayConditions.push(`(${opus_idString.join(" or ")})`);
  }

  if (body.hasOwnProperty('card_type_id') && body.card_type_id.length > 0) {
    let card_type_idString = [];
    body.card_type_id.forEach(element => {
      card_type_idString.push("card.card_type_id = UUID_TO_BIN(?)");
      queryValues.push(element);
    });
    arrayConditions.push(`(${card_type_idString.join(" or ")})`);
  }

  // conditions that joins are required

  if (body.hasOwnProperty('element_id') && body.element_id.length > 0) {
    let element_idString = [];
    body.element_id.forEach(element => {
      element_idString.push("card_element.element_id = UUID_TO_BIN(?)");
      queryValues.push(element);
    });
    arrayConditions.push(`(${element_idString.join(" or ")})`);
    arrayJoins.push("join card_element on card.id = card_element.card_id");
  }

  if (body.hasOwnProperty('job_id') && body.job_id.length > 0) {
    let job_idString = [];
    body.job_id.forEach(element => {
      job_idString.push("card_job.job_id = UUID_TO_BIN(?)");
      queryValues.push(element);
    });
    arrayConditions.push(`(${job_idString.join(" or ")})`);
    arrayJoins.push("join card_job on card.id = card_job.card_id");
  }

  if (body.hasOwnProperty('category_id') && body.category_id.length > 0) {
    let category_idString = [];
    body.category_id.forEach(element => {
      category_idString.push("card_category.category_id = UUID_TO_BIN(?)");
      queryValues.push(element);
    });
    arrayConditions.push(`(${category_idString.join(" or ")})`);
    arrayJoins.push("join card_category on card.id = card_category.card_id");
  }

  // preparing statement

  if (arrayConditions.length > 0) {
    const whereString = `where ${arrayConditions.join(" and ")} `;
    console.log("whereString :" + whereString);
    console.log("queryValues :" + queryValues);
    cardQuery = cardQuery.replace("$whereString$", whereString);
  } else
    cardQuery = cardQuery.replace("$whereString$", "");

  if (arrayJoins.length > 0) {
    const joinString = `${arrayJoins.join(" ")} `;
    console.log("joinString :" + joinString);
    cardQuery = cardQuery.replace("$joinString$", joinString);
  } else
    cardQuery = cardQuery.replace("$joinString$", "");

  queryValues.push(itemLimit, offset)

  console.log("cardQuery :" + cardQuery);
  console.log("queryValues :" + queryValues);

  let cardResult;
  try {
    [cardResult] = await pool.query(cardQuery, queryValues);
  } catch (error) {
    console.log(error);
    throw { message: `connection.js -> getCard -> cardQuery: ${error}` }
  }

  cardResult.map(card => {
    card.src = `${process.env.LOCAL_PATH}${card.src}`;
    card.link = `${process.env.LOCAL_PATH}api/v1/card/${card.code}`
  });

  return cardResult;
};

const editCard = async (body) => {

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
      throw { message: `connection.js -> editCard -> cardQuery: ${error}` }
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
        console.log(error);
        throw { message: `connection.js -> editCard -> elementDeleteQuery: ${error}` }
      }

      for (const element_id of elementArray) {
        const elementQuery = 'insert into `card_element` values (UUID_TO_BIN(?), UUID_TO_BIN(?));';
        const elementValues = [body.id, element_id];
        try {
          await pool.query(elementQuery, elementValues);
        } catch (error) {
          console.log(error);
          throw { message: `connection.js -> editCard -> elementQuery: ${error}` }
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
        console.log(error);
        throw { message: `connection.js -> editCard -> jobDeleteQuery: ${error}` }
      }

      for (const job_id of jobArray) {
        const jobQuery = 'insert into `card_job` values (UUID_TO_BIN(?), UUID_TO_BIN(?));';
        const jobValues = [body.id, job_id];
        try {
          await pool.query(jobQuery, jobValues);
        } catch (error) {
          console.log(error);
          throw { message: `connection.js -> editCard -> jobQuery: ${error}` }
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
        console.log(error);
        throw { message: `connection.js -> editCard -> categoryDeleteQuery: ${error}` }
      }

      for (const category_id of categoryArray) {
        const categoryQuery = 'insert into `card_category` values (UUID_TO_BIN(?), UUID_TO_BIN(?));';
        const categoryValues = [body.id, category_id];
        try {
          await pool.query(categoryQuery, categoryValues);
        } catch (error) {
          console.log(error);
          throw { message: `connection.js -> editCard -> categoryQuery: ${error}` }
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
        console.log(error);
        throw { message: `connection.js -> editCard -> imageDeleteQuery: ${error}` }
      }

      // Adding new image
      try {
        await addArrayOfImage(imageArray, body.id);
      } catch (error) {
        throw error;
      }
    }
  }

};

const deleteCard = async (id) => {

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
    console.log(error);
    throw { message: `connection.js -> deleteCard: ${error}` }
  }

  console.log("Card deleted");
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

/**    --------------------------    */

const addOpus = async (name) => {
  const post = 'insert into `opus` values (UUID_TO_BIN(?), ?);';
  const values = [uuidv4(), name];
  const result = await pool.query(post, values);
  console.log("opus added");
  console.log(result);
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


module.exports = { addCard, editCard, deleteCard, getCardByCode, getRandomCard, getCard, addOpus };