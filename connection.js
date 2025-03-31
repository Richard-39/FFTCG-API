const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');
const { dateFormat } = require('./extension.js');

const fs = require('fs');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const addCard = async (name, code, rarity_id, opus_id, cost, cardType_id, exburst, multiplayable, power, abilities, elements_id, jobs_id, categories_id, imageType_id, base64String) => {
  const post = 'insert into `card` values (UUID_TO_BIN(?), ?, ?, UUID_TO_BIN(?), UUID_TO_BIN(?), ?, UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?);';
  const cardId = uuidv4();
  const values = [cardId, name, code, rarity_id, opus_id, cost, cardType_id, exburst, multiplayable, power, abilities, dateFormat(new Date()), dateFormat(new Date())];
  const result = await pool.query(post, values);
  console.log('Card added!');
  console.log(result);

  // Adding element
  elements_id.split(" ").forEach(async (element) => {
    const elementQuery = 'insert into `card_element` values (UUID_TO_BIN(?), UUID_TO_BIN(?));';
    const elementValues = [cardId, element];
    const elementResult = await pool.query(elementQuery, elementValues);
    console.log('element added!');
    console.log(elementResult);
  });

  // adding job
  jobs_id.split(" ").forEach(async (job) => {
    const jobQuery = 'insert into `card_job` values (UUID_TO_BIN(?), UUID_TO_BIN(?));';
    const jobValues = [cardId, job];
    const jobResult = await pool.query(jobQuery, jobValues);
    console.log('job added!');
    console.log(jobResult);
  });

  // adding category
  categories_id.split(" ").forEach(async (category) => {
    const categoryQuery = 'insert into `card_category` values (UUID_TO_BIN(?), UUID_TO_BIN(?));';
    const categoryValues = [cardId, category];
    const categoryResult = await pool.query(categoryQuery, categoryValues);
    console.log('category added!');
    console.log(categoryResult);
  });

  // Adding image

  const imageTypesNames = await getImageType();
  const imageType = imageTypesNames.find(r => r.id == imageType_id);

  let base64Image = base64String.split(';base64,').pop(); // Remove header
  const dir = "image/card/"
  const path = `${dir}${cardId}_${imageType.name}.jpeg`;
  fs.writeFile(path, base64Image, { encoding: 'base64' }, function (err) {
    console.log('File created');
  });

  const imageQuery = 'insert into `image` values (UUID_TO_BIN(?), UUID_TO_BIN(?), UUID_TO_BIN(?), ?);';
  const imageValues = [uuidv4(), cardId, imageType_id, path];
  const imageResult = await pool.query(imageQuery, imageValues);
  console.log('image added!');
  console.log(imageResult);

};

const getRandomCard = async () => {
  const cardQuery = 'SELECT BIN_TO_UUID(card.id) as `id`, card.name, code, rarity.name as `rarity`, opus.name as `opus`, cost, cardtype.name as `card type`, exburst, multiplayable, power, abilities, create_at, update_at from card join rarity on card.rarity_id = rarity.id join opus on card.opus_id = opus.id join cardType on card.cardType_id = cardType.id ORDER BY RAND() LIMIT 1;';
  const [cardResult] = await pool.query(cardQuery);

  const elementQuery = 'select element.name from card_element join element on card_element.element_id = element.id where card_element.card_id = UUID_TO_BIN(?);';
  const elementValues = [cardResult[0].id];
  const [elementResult] = await pool.query(elementQuery, elementValues);

  const jobQuery = 'select job.name from card_job join job on card_job.job_id = job.id where card_job.card_id = UUID_TO_BIN(?);';
  const jobValues = [cardResult[0].id];
  const [jobResult] = await pool.query(jobQuery, jobValues);

  const categoryQuery = 'select category.name from card_category join category on card_category.category_id = category.id where card_category.card_id = UUID_TO_BIN(?);';
  const categoryValues = [cardResult[0].id];
  const [categoryResult] = await pool.query(categoryQuery, categoryValues);

  const imageQuery = 'select imagetype.name as `ilustration`, src from image join imagetype on image.imageType_id = imagetype.id where image.card_id = UUID_TO_BIN(?);';
  const ImageValues = [cardResult[0].id];
  const [imageResult] = await pool.query(imageQuery, ImageValues);
  console.log(imageResult);

  const localPath = 'http://localhost:3000/'

  let randomCard = cardResult[0];
  randomCard.elements = elementResult.map(e => e.name);
  randomCard.jobs = jobResult.map(j => j.name);
  randomCard.categories = categoryResult.map(c => c.name);
  randomCard.ilustrations = imageResult.map(i => {
    const obj = Object.assign({}, i);
    obj.src = localPath + i.src;
    return obj;
  });
  console.log(randomCard);
  return randomCard;
};

/**    --------------------------    */

const addOpus = async (name) => {
  const post = 'insert into `opus` values (UUID_TO_BIN(?), ?);';
  const values = [uuidv4(), name];
  const result = await pool.query(post, values);
  console.log("opus added");
  console.log(result);
};

const getImageType = async () => {
  const imageTypeQuery = 'select BIN_TO_UUID(imageType.id) as "id", name from imageType;';
  const [imageTypeResult, imageTypefields] = await pool.query(imageTypeQuery);
  console.log(imageTypefields);
  console.log(imageTypeResult);
  return imageTypeResult;
};

const getProducts = async (orderBy = 'name', direction = 'asc') => {
  const query = 'select BIN_TO_UUID(product.id) as `id`, name, description, price, BIN_TO_UUID(category_id) as `category_id`, isActive, created_at, modified_at from `product` order by ' + orderBy + ' ' + direction + ';';
  const [results, fields] = await pool.query(query);
  console.log(fields);
  return results;
};

const editProduct = async (id, name, description, price, category_id, isActive) => {
  const queryString = 'update `product` set `name` = ?, `description` = ?, `price` = ?, `category_id` = UUID_TO_BIN(?), `isActive` = ?, `modified_at` = ? where `id` = UUID_TO_BIN(?);';
  const values = [name, description, price, category_id, isActive, dateFormat(new Date()), id];
  const [results] = await pool.query(queryString, values);
  console.log(results);
  return results;
};

const deleteProduct = async (id) => {
  const queryString = 'delete from `product` where `id` = UUID_TO_BIN(?);';
  const values = [id];
  const [results] = await pool.query(queryString, values);
  console.log(results);
  return results;
};

module.exports = { addOpus, addCard, getRandomCard, getImageType };