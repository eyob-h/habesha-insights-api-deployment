import createError from "../utils/createError.js";
import Review from "../models/review.model.js";
import Business from "../models/business.model.js";
import User from "../models/user.model.js";
import math from "math"

export const createReview = async (req, res, next) => {
  if (req.isBusinessOwner)
    return next(createError(403, "Business owners can't create a review!"));

  const newReview = new Review({
    userId: req.userId,
    businessId: req.body.businessId,
    desc: req.body.desc,
    star: req.body.star,
  });

  try {
    const review = await Review.findOne({
      businessId: req.body.businessId,
      userId: req.userId,
    });

    if (review)
      return next(
        createError(403, "You have already created a review for this business!")
      );

    // Increase the totalStars and starNumber fields by the number of stars passed in the body
    const business = await Business.findByIdAndUpdate(
      req.body.businessId,
      {
        $inc: {
          totalStars: req.body.star,
          starNumber: 1,
        },
      },
      { new: true }
    );

    // Calculate the new average rating
    const averageRating = math.round(business.totalStars / business.starNumber,1)



    // Set the average rating field
    business.averageRating = averageRating;

    // Save the business
    await business.save();

    const savedReview = await newReview.save();

    res.status(201).send(savedReview);
  } catch (err) {
    next(err);
  }
};


export const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ businessId: req.params.businessId });
    res.status(200).send(reviews);
  } catch (err) {
    next(err);
  }
};


//Delete Review
export const deleteReview = async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  
//   console.log(req.isAuthenticated)
//   if (!req.isAuthenticated) {
//     return next(createError(401, "You must be logged in to delete a review"));
// }

        console.log("_=============_")
        console.log(req.params.id)
        console.log(req.userId)
        console.log(review.userId)
        if (req.userId !== review.userId) {
            return next(createError(403, "You can delete only your own reviews!"));
        }

        // Update the totalStars and starNumber fields
        const business = await Business.findById(review.businessId);
        business.totalStars -= review.star;
        business.starNumber -= 1;
        business.averageRating = business.totalStars / business.starNumber;
        await business.save();
        await Review.findByIdAndDelete(req.params.id);
        res.status(200).send("Review Deleted.");
        };


//UPDATE OUR REVIEW

export const updateReview = async(req, res, next)=>{
  const review = await Review.findById(req.params.id);
  if (req.userId !== review.userId) {
    return next(createError(403, "Come on man, you can't update somebody else's review."));
  }
  try{
      const review = await Review.findByIdAndUpdate(req.params.id, {
          $set: req.body,
      });
      res.status(200).json("Your review has been updated");
      } catch (err) {
      //  return res.status(500).json(err);
       return next(createError(500, "YOUR REVIEW IS NOT UPDATED"));
      }
}