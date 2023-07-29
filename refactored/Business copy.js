const mongoose = require("mongoose");

const BusinessSchema = new mongoose.Schema(
  {
      // name, description,	location, phone_number,	website, workingHours, category, image, likes
    // userId: {
    //   type: String,
    //   required: true,
    // },  
    name: {
        type: String,
        max: 50,
    },
    description: {
        type: String,
        max: 500,
    },
    location: {
      type: String,
      max: 100,
    },
    phoneNumber: {
      type: String,
      max: 20,
    },
    website: {
      type: String,
      max: 20,
    },
    workingHours: {
      type: String,
      max: 10,
    },
    category: {
        type: Array,
        default: [],
    },
    
    img: {
      type: String,
    },
    likes: {
        type: Array,
        default: [],
      },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Business", BusinessSchema);
