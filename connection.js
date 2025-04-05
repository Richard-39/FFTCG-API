const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');
const { dateFormat } = require('./extension.js');

const fs = require('fs');

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

  const post = 'insert into `card` values (UUID_TO_BIN(?), ?, ?, UUID_TO_BIN(?), UUID_TO_BIN(?), ?, UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?);';
  const cardId = uuidv4();
  const values = [cardId, name, code, rarity_id, opus_id, cost, card_type_id, exburst, multiplayable, power, abilities, dateFormat(new Date()), dateFormat(new Date())];
  const result = await pool.query(post, values);
  console.log('Card added!');

  // Adding element
  console.log("elements: " + elements_id);
  console.log("length: " + elements_id.split(" ").length);
  const arrayOfElements = elements_id.split(" ");
  for (const element of arrayOfElements) {
    const elementQuery = 'insert into `card_element` values (UUID_TO_BIN(?), UUID_TO_BIN(?));';
    const elementValues = [cardId, element];
    const elementResult = await pool.query(elementQuery, elementValues);
    console.log('element added!');
  }

  // adding job
  console.log("jobs: " + jobs_id.array);
  console.log("length: " + jobs_id.array.length);
  for (const job of jobs_id.array) {
    const jobQuery = 'insert into `card_job` values (UUID_TO_BIN(?), UUID_TO_BIN(?));';
    const jobValues = [cardId, job];
    const jobResult = await pool.query(jobQuery, jobValues);
    console.log('job added!');
  }

  // adding category
  console.log("categories: " + categories_id);
  console.log("length: " + categories_id.split(" ").length);
  const arrayOfCategories = categories_id.split(" ");
  for (const category of arrayOfCategories) {
    const categoryQuery = 'insert into `card_category` values (UUID_TO_BIN(?), UUID_TO_BIN(?));';
    const categoryValues = [cardId, category];
    const categoryResult = await pool.query(categoryQuery, categoryValues);
    console.log('category added!');
  }

  // Adding image
  await addArrayOfImage(images.array, cardId);
  
};

const getRandomCard = async () => {
  const cardQuery = 'SELECT BIN_TO_UUID(card.id) as `id`, card.name, code, rarity.name as `rarity`, opus.name as `opus`, cost, card_type.name as `card type`, exburst, multiplayable, power, abilities, create_at, update_at from card join rarity on card.rarity_id = rarity.id join opus on card.opus_id = opus.id join card_type on card.card_type_id = card_type.id ORDER BY RAND() LIMIT 1;';
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

  const imageQuery = 'select image_type.name as `ilustration`, src from image join image_type on image.image_type_id = image_type.id where image.card_id = UUID_TO_BIN(?);';
  const ImageValues = [cardResult[0].id];
  const [imageResult] = await pool.query(imageQuery, ImageValues);

  let Path = '';
  if (process.env.ENVIROMENT == 'development')
    Path = 'http://localhost:3000/';
  else if (process.env.ENVIROMENT == 'production')
    Path = 'https://fftcg-api.onrender.com/';

  let randomCard = cardResult[0];
  randomCard.elements = elementResult.map(e => e.name);
  randomCard.jobs = jobResult.map(j => j.name);
  randomCard.categories = categoryResult.map(c => c.name);
  randomCard.ilustrations = imageResult.map(i => {
    const obj = Object.assign({}, i);
    obj.src = Path + i.src;
    return obj;
  });
  console.log(randomCard);
  return randomCard;
};

const editCard = async (body) => {

  let columCardNameArray = ["name", "code", "rarity_id", "opus_id", "cost", "card_type_id", "exburst", "multiplayable", "power", "abilities"];
  let cardKeyArray = [];
  let cardValueArray = [];

  for (const [key, value] of Object.entries(body)) {

    if (columCardNameArray.includes(key)){
      let columToSet = key;
      if (key.endsWith("id"))
        columToSet += " = UUID_TO_BIN(?)";
      else 
        columToSet += " = ?";
  
    cardKeyArray.push(columToSet);  
    cardValueArray.push(value);
    }

  }

  if (cardKeyArray.length > 0){
    cardValueArray.push(body.id);
    const columCardString = cardKeyArray.join(", ");
  
    console.log(columCardString);
    console.log(cardValueArray.toString());
  
    const initialCardString = 'update card set $ where id = UUID_TO_BIN(?);';
    const cardQuery = initialCardString.replace("$", columCardString);
    console.log(cardQuery);
  
    const cardResult = await pool.query(cardQuery, cardValueArray);
    console.log(cardResult);
  }

  /* --------- OTHERS TABLES ----------- */

  if (body.hasOwnProperty('elements_id')){
    const elementArray = body.elements_id.split(" ");
    if (elementArray.length > 0){
      const elementDeleteQuery = 'delete from card_element where card_id = UUID_TO_BIN(?);';
      const elementDeleteValue = [body.id];
      const deleteResult = await pool.query(elementDeleteQuery, elementDeleteValue);

      for (const element_id of elementArray) {
        const elementQuery = 'insert into `card_element` values (UUID_TO_BIN(?), UUID_TO_BIN(?));';
        const elementValues = [body.id, element_id];
        const elementResult = await pool.query(elementQuery, elementValues);
        console.log('element added!');
      }
    }
  }

  if (body.hasOwnProperty('jobs_id')){
    const jobArray = body.jobs_id.array;
    if (jobArray.length > 0){
      const jobDeleteQuery = 'delete from card_job where card_id = UUID_TO_BIN(?);';
      const jobDeleteValue = [body.id];
      const deleteResult = await pool.query(jobDeleteQuery, jobDeleteValue);

      for (const job_id of jobArray) {
        const jobQuery = 'insert into `card_job` values (UUID_TO_BIN(?), UUID_TO_BIN(?));';
        const jobValues = [body.id, job_id];
        const jobResult = await pool.query(jobQuery, jobValues);
        console.log('job added!');
      }
    }
  }

  if (body.hasOwnProperty('categories_id')){
    const categoryArray = body.categories_id.split(" ");
    if (categoryArray.length > 0){
      const categoryDeleteQuery = 'delete from card_category where card_id = UUID_TO_BIN(?);';
      const categoryDeleteValue = [body.id];
      const deleteResult = await pool.query(categoryDeleteQuery, categoryDeleteValue);

      for (const category_id of categoryArray) {
        const categoryQuery = 'insert into `card_category` values (UUID_TO_BIN(?), UUID_TO_BIN(?));';
        const categoryValues = [body.id, category_id];
        const categoryResult = await pool.query(categoryQuery, categoryValues);
        console.log('category added!');
      }
    }
  }

  if (body.hasOwnProperty('images')){
    const imageArray = body.images.array;
    if (imageArray.length > 0){

      // deleting currents images
      const getImageQuery = 'select src from image where card_id = UUID_TO_BIN(?);';
      const getImageValue = [body.id];
      const srcImage = await pool.query(getImageQuery, getImageValue);

      for (const image of srcImage[0]){
        fs.unlink(image.src, (err) => {
          if (err)
            console.log(err);
        });
      };

      const imageDeleteQuery = 'delete from image where card_id = UUID_TO_BIN(?);';
      const imageDeleteValue = [body.id];
      const deleteResult = await pool.query(imageDeleteQuery, imageDeleteValue);

      // Adding new image
      await addArrayOfImage(imageArray, body.id);
    }
  }

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
  const imageTypeQuery = 'select BIN_TO_UUID(image_type.id) as "id", name from image_type;';
  const [imageTypeResult, imageTypefields] = await pool.query(imageTypeQuery);
  console.log(imageTypefields);
  console.log(imageTypeResult);
  return imageTypeResult;
};

const addArrayOfImage = async (arrayOfImage, card_id) => {
  const dir = "image/card/"
  for (const image of arrayOfImage) {
    const image_id = uuidv4();
    const base64Image = image.base64String.split(';base64,').pop(); // Remove header
    const path = `${dir}${image_id}.jpeg`;

    fs.writeFile(path, base64Image, { encoding: 'base64' }, function (err) {
      console.log('Image created');
    });

    const imageQuery = 'insert into `image` values (UUID_TO_BIN(?), UUID_TO_BIN(?), UUID_TO_BIN(?), ?);';
    const imageValues = [image_id, card_id, image.image_type_id, path];
    const imageResult = await pool.query(imageQuery, imageValues);
    console.log('image added!');
  }
}

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

module.exports = { addOpus, addCard, editCard, getRandomCard, getImageType };