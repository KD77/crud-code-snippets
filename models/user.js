const mongoose= require('mongoose');
const bcrypt= require('bcrypt')

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
userSchema.statics.authenticate = async function(username, password){
 const user= await this.findOne({username})
 if(!user || !(await bcrypt.compare(password,user.password))){
  throw new Error('Invalid Credintial.')
} 
return user

}
userSchema.pre('save',async function(){
  this.password=await bcrypt.hash(this.password, 8)
  console.log(this.password)
})
module.exports=mongoose.model('User',userSchema)