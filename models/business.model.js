import mongoose from "mongoose";
const { Schema } = mongoose;

const BusinessSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    // email: {
    //   type: String,
    //   required: true,
    //   max: 50,
    //   unique: true,
    // },
    // // password: {
    // //   type: String,
    // //   required: true,
    // //   min: 6,
    // // },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    totalStars: {
      type: Number,
      default: 0,
    },
    starNumber: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: true,
    },
    // price: {
    //   type: Number,
    //   required: true,
    // },
    cover: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: false,
    },
    userId: {
      type: String,
      required: true,
    },
    shortTitle: {
      type: String,
      required: true,
    },
    shortDesc: {
      type: String,
      required: true,
    },
    workingHours: {
      type: String,
      required: true,
    },
    // likes: {
    //   type: Array,
    //   default: [],
    // },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Business", BusinessSchema);

   