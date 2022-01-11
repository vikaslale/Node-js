const express = require("express");
const router = express.Router();
const authenticate = require("../utils/authenticate");

const Blog = require('../models/blog.model');
//Router-level middleware
/*router.use((req, res, next) => {
  req.currentTimeForRouter = new Date();
  next();
});
*/

router.get("/search", async(req, res) => {
  try{
   const query = req.query.q;
   const expressionToSearch = new RegExp(query,'i');
   const filteredBlogs = await Blog.find({
    $or:[
     {'title':expressionSearch},
     {'description':expressionToSearch}
    ]
   },{_v:false});
  return res.send({
    message: "filtered Blogs",
    data: filteredBlogs,
  });
} catch(err){
return res.status(400).send({
  message:"error in searching Blogs",
  data:err
});
}
});

router.post("/", authenticate, async(req, res) => {
  const { title, description,publish,publishedDate } = req.body;
  const blog = new Blog({
    title,
    description,
    publish,
    publishedDate
  }); 
  try{
    const savedBlog = await blog.save();
    return res.status(201).send({
      message:'blog created suessfully.',
      data:savedBlog
    })
  } catch(err){
    return res.status(401).send({
      message:err.Message,
      data:err
    })
  }
});

router.get("/",async (req, res) => {
  try{
    return res.send({
    message:'blog retrived succssfully',
    data: await Blog.find({},{_V:false})
    })
  } catch(err){
    return res.status(400).send({
    message:'Error getting blogs.',
    data:err
    })
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const blog = await Blog.findById(id);
    if (blog) {
      return res.send({
        Message: "Blog retrieved successfully",
        data: blog,
      });
    }
    return res.status(404).send({
      Message: "Blog Not found",
    });
  } catch (err) {
    return res.status(400).send({
      message: "Error getting user.",
      data: err,
    });
  }
});

router.put('./:id', authenticate, async (req, res) => {
  try{
  const { title, description,publish,publishedDate } = req.body;
  const id = req.params.id;
  const blog =await Blog.findById(id);
  if (blog) {
    if (title) blog.title = title;
    if (description) blog.description = description;
  if(publish !== null || publish !== undefined) blog.publish =publish;
  if(publishedDate) blog.publishedDate = publishedDate;

  await blog.save();

    return res.send({
      Message: "Blog updated successfully",
      data: blog
    });
  }
    return res.status(404).send({
    Message: "Blog Not found",
  });
} catch (err){
  return res.status(400).send({
    message: 'Error updating blog.',
    data:err
  });
} 
});

router.delete("/:id", authenticate, async (req, res) => {
  try {
    const id = req.params.id;
    const blog = await Blog.findById(id);
    if (blog) {
      await blog.delete();
      return res.sendStatus(204);
    }
    return res.status(404).send({
      Message: "Blog Not found",
    });
  } catch (err) {
    return res.status(400).send({
      message: "Error deleting blog.",
      data: err,
    });
  }
});

module.exports = router;
