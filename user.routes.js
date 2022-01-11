const express= require('express')
const router =express.Router();
const authenticate = require('../utils/authenticate')

const User = require('../models/user.model');

//Router-level middleware
  /*router.use((req,res,next)=>{
 req.currentTimeForRouter = new Date();
 next();
  }); */


 router.get('/search', async (req, res) => {
   try {
     const query = req.query.q;
     const expressionToSearch = new RegExp(query,'i');
     const filteredUsers = await User.find({
       //name:new RegExp(query,'i')
      $or:[ 
        {'name.first':expressionToSearch},
        {'name.last':expressionToSearch}
      ]
    });
     return res.send({
       message: "filtered Users",
       data: filteredUsers,
     });
   } catch (err) {
     return res.status(400).send({
       message: "Error in searching user.",
       data: err,
     });
   }
 });
  
/*router.get("/", (req, res) => {
  return res.send({
    Message: "User retrived successfully",
    data: users,
  });
});
*/

router.post("/", async (req, res) => {
  const {name,age,email,password } = req.body;
   //if (fristname && lastnme && age)
   const user =new User({
    name, //{first:firstName, last:lastName},
    email,
    password,
    age
   });
   try{
    const savedUser = await user.save();
    return res.status(201).send({
      message:'User created successfully',
      data:savedUser
    });
   }   catch(err){
  return res.status(400).send({
    Message: err.message,
    data:err
  });
}
})

router.get('/',async(req,res)=>{
  try{
    return res.send({
    Message:"User retrieved sucessfully",
      data: await User.find({},{password: false,_v:false})
    });
  } catch(err){
    return res.status(400).send({
    Message:"Error getting user.",
    data:err
    })
  }
})
 
router.post('/login',async(req,res)=>{
    const {email,password} = req.body;
    try{
    const user = await User.findOne({email});

    if(user){
      user.comparePassword(password, (err, isMatch)=>{
        if(isMatch){
     const token = jwt.sign({
      if:user._id
     }, process.env.SECRET,{expiresIn:'1hr'})
     return res.send({
      message:'login successful.',
      dada:{token}
    });
   } else{
       return res.send({
  message:'Invalid email or password.',
   data:null
    });
    }
  });
}else {
  return res.send({
    message:"Invalid email or password",
    data:null
  }); 
}
}
  catch(err){
    return res.status(500).send({
    message:'Some error occurred during login',
    data:err
    });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (user) {
      return res.send({
        Message: "User retrieved successfully",
        data: user,
      });
    }
    return res.status(404).send({
      Message: "User Not found",
    });
  } catch (err) {
    return res.status(400).send({
      message: "Error getting user.",
      data: err,
    });
  }
});
router.put("/:id",authenticate,async (req, res) => {
  try{
     const { name, age } = req.body;
     const id = req.params.id;
    const user = await User.findById(id,{password: false,_v:false});
  if (user) {
    if (name) user.name = name;
    if (age) user.age = age;
    
    await user.save();

    return res.send({
       message:'User updated successfully',
       data:user
    });
  }
   return res.status(404).send({
     message:'User not found'
   })
  } catch(err){
  return res.status(400).send({
    message:'Error updating user.',
    data:err
  })
  }
});
router.delete("/:id",authenticate,async (req, res) => {
try{  
  const id = req.params.id;
  const user = await User.findById(id);
  if (user) {
    await user.delete();
    return res.sendStatus(204);
  }
  return res.status(404).send({
    Message: "User Not found",
  });
} catch(err){
  return res.status(400).send({
  message:'Error deleting user.',
  data:err
  })
}
})

module.exports = router;
