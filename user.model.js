const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
 /* name:{
      frist:String,
      last:String

      
  },*/
   name:{type:String,required:true},
  email:{type:String, required: true},
  password:{type: String, required:true},
  age:{ type:Number, min:[18," minimum allowed age"]}
},{
 timestamps:true,
 toJSON:{virtuals:true}
});
 userSchema.virtual('fullName').get(function(){
   
   return `${this.name.frist} ${this.name.last}`
 });

 userSchema.pre('save',function(next){
   const user= this;
   if(!user.isModified('password')){
    return next();
   }
  bcrypt.hash(user.password,10, function(err,hash){
    if(err) return next(err);
    user.password = hash;
    next();
  })
 })

 userSchema.methods.comparePassword = function(clientPassword,cb){
   bcrypt.compare(clientPassword, this.password,function(err,result){
     //cb mane callback
    if(err) return cb(err);

     cb(null,result);
   });
 };
module.exports = mongoose.model('User',userSchema);