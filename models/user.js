const mongoose= require('mongoose');

const userSchema= mongoose.Schema({
  username:{
    type: String,
    require: true,
    unique: true
  },
  password:{
    type: String,
    require: true,
    minlength:6,
  }
},
{
  timestamps:true
}

)
module.exports=mongoose.model('User',userSchema)