const express= require('express')
const mongoose= require('mongoose')
require('dotenv/config')

const app = express()

const PORT= 3000

mongoose.connect(process.env.DB_CONNECTION,{ useNewUrlParser: true, useUnifiedTopology: true })
const con= mongoose.connection;
con.on('open', () =>{
  console.log('Connected')
})



app.listen(PORT,()=>{
  console.log('Server started')
})