# Final Fantasy TCG API

Una API REST construida con Node.js y Express para gestionar cartas del juego Final Fantasy Trading Card Game (FFTCG).

## Funcionalidades

- 🔍 Listar todas las cartas (`GET /cards`)
- 🔎 Ver detalles de una carta (`GET /cards/:id`)
- ➕ Crear una nueva carta (`POST /cards`)
- ✏️ Editar una carta existente (`PUT /cards/:id`)
- ❌ Eliminar una carta (`DELETE /cards/:id`)

## Tecnologías

- Node.js
- Express.js
- MySql
- JWT para autenticar
- Thunder Client para pruebas

## Instalación

```bash
git clone https://github.com/tuusuario/fftcg-api.git
cd fftcg-api
npm install
npm run dev