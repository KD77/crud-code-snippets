const mongoose= require('mongoose');

 const snippetSchema= mongoose.Schema({
  username:{
    type: String,
    require: true
  },
  snippets:{
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