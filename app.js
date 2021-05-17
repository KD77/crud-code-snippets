const express= require('express')
const mongoose= require('mongoose')
require('dotenv/config')
const session=require('express-session')

const app = express()

const PORT= 3000

mongoose.connect(process.env.DB_CONNECTION,{ useNewUrlParser: true, useUnifiedTopology: true })
const con= mongoose.connection;
con.on('open', () =>{
  console.log('Connected')
})

 app.use(express.json());
 app.use(express.urlencoded({
  extended: true
}));
app.use(
  session({
   // name: process.env.SESSION_NAME,
    secret: 'keyboard cat',
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
app.use('/',require('./routers/homeRouter'))
 app.use('/snippet',require('./routers/snippetRouter'))
 app.use('/login', require('./routers/loginRouter'))
 app.use('/register', require('./routers/registerRouter'))
 app.use('/logout', require('./routers/logoutRouter'))
 
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


app.listen(PORT,()=>{
  console.log('Server started')
})
// Handel unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red)
  // Close Server & exit
  server.close(() => process.exit(1))
})