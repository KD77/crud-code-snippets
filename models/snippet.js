const mongoose= require('mongoose');

 const snippetSchema= mongoose.Schema({
  username:{
    type: String,
    require: true
  },
  snippet:{
    type: String,
    require: true,
    trim: true
  }
},
  {
    timestamps:true,
  }
)
module.exports=mongoose.model('snippet', snippetSchema)