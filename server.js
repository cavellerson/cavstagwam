const express = require('express');
const app = express();
const methodOverride = require('method-override')
const PORT = 3000;
const cors = require("cors");
const pool = require("./db")
const session = require('express-session')
// const cookieParser = require("cookieParser")
//
// require('dotenv').config()
app.use(cors());
app.use(express.json()); // allows access to req.body
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
// app.use(
// 	session({
// 		secret: process.env.SECRET,
// 		resave: false,
// 		saveUninitialized: false,
// 	})
// )

// app.use(express.cookieParser(process.env.SECRET));
// app.use(express.session());

app.use(
	session({
		secret: process.env.SECRET,
		resave: false,
		saveUninitialized: false,
	})
)

const postsController = require('./controllers/posts_controller.js')
app.use('/posts', postsController)

const usersController = require('./controllers/users_controller.js')
app.use('/users', usersController)

const sessionsController = require('./controllers/sessions_controller.js')
app.use('/sessions', sessionsController)


app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})
