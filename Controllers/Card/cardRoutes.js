const express = require('express');
const router = express.Router();

const { addCard, editCard, deleteCard, getRandomCard, getCardByCode, getCard } = require('./cardController');

router.post('/', addCard);  // Ruta para agrega carta
router.put('/', editCard);  // Ruta para editar carta
router.delete('/:id', deleteCard);  // Ruta para eliminar carta
router.get('/random', getRandomCard);  // Ruta para obtener carta random
router.get('/:code', getCardByCode);  // Ruta para obtener carta por código
router.get('/', getCard);  // Ruta para obtener todas las cartas

module.exports = router;  // Exportamos el router