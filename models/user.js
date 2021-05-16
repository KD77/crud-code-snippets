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
userSchema.static.authenticate = async(username, password)=>{
 const user= await this.findOne({username})
 if(!user || !(await bcrypt.compare(password,user.password))){
  throw new Error('Invalid Credintial.')
} 
return user

}
userSchema.pre('save',async()=>{
  this.password=await bcrypt.hash(this.password, 8)
})
module.exports=mongoose.model('User',userSchema)