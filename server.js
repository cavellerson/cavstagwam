const express = require('express');
const app = express();
const PORT = 3000;
const cors = require("cors");
const pool = require("./db")

app.use(cors());
app.use(express.json()); // allows access to req.body

const postsController = require('./controllers/posts_controller.js')
app.use('/posts', postsController)



app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})
