const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
      title:{type:String, required:true},
      description:{type:String,required:true},
      publish:{type:Boolean,default:false},
      publishedDate:Date
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Blog", BlogSchema);
