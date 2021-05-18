'use strict'

const mongoose = require('mongoose')
const express = require('express')
const hbs = require('express-hbs')
const path = require('path')
const dotenv = require('dotenv')
const morgan = require('morgan')


const session = require('express-session')
const createError = require('http-errors')
dotenv.config({ path: 'config.env' })


mongoose.connect(process.env.DB_CONNECTION,{ useNewUrlParser: true, useUnifiedTopology: true })
const con= mongoose.connection;
con.on('open', () =>{
  console.log('Connected')
})

const PORT = process.env.PORT || 3000

const app = express()

app.engine(
  'hbs',
  hbs.express4({
    defaultLayout: path.join(__dirname, 'views', 'layouts', 'default'),
    partialsDir: path.join(__dirname, 'views', 'partials')
  })
)
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))

// Middleware
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

app.use(
  session({
    name: 'CRUD',
    secret: 'KAT',
    saveUninitialized: false, // do not create session until something stored
    resave: false, // do not save session if unmodified
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 60 * 60 * 24 * 1000 // 24h
    }
  })
)

app.use((req, res, next) => {
  if (req.session.flash) {
    res.locals.flash = req.session.flash
    delete req.session.flash
  }

  next()
})

app.use((req, res, next) => {
  app.locals.expreq = req.session.userName
  next()
})

// Mounting application's routes
app.use('/', require('./routers/homeRouter'))
app.use('/snippets', require('./routers/snippetsRouter'))
app.use('/login', require('./routers/loginRouter'))
app.use('/register', require('./routers/registerRouter'))
app.use('/logout', require('./routers/logoutRouter'))
app.use('*', (req, res, next) => next(createError(404)))

app.use((err, req, res, next) => {
  if (err.statusCode === 404) {
    return res
      .status(404)
      .sendFile(path.join(__dirname, 'views', 'errors', '404.html'))
  }

  if (req.app.get('env') !== 'development') {
    return res
      .status(500)
      .sendFile(path.join(__dirname, 'views', 'errors', '500.html'))
  }

  res.status(err.statusCode || 500).render('errors/error', { error: err })
})

// Listening to port
const server = app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
)

// Handel unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red)
  // Close Server & exit
  server.close(() => process.exit(1))
})