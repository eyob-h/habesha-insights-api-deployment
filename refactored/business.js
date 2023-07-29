const router = require("express").Router();
const Business = require("../models/Business");
const User = require("../models/User");

//create a business

router.post("/", async (req, res) => {
  // if user is not business owner, then it'll no create business
  const newBusiness = new Business(req.body);
  try {
    const savedBusiness = await newBusiness.save();
    res.status(200).json(savedBusiness);
  } catch (err) {
    res.status(500).json(err);
  }
});


//update your business

router.put("/:id", async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    // if (business.userId === req.body.userId) {
    if (req.body.userId) {
      await business.updateOne({ $set: req.body });
      res.status(200).json("Business information has been updated");
    } else {
      res.status(403).json("Not allowed");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});


//delete your business

router.delete("/:id", async (req, res) => {
  try {
    const business= await Business.findById(req.params.id);
    // if (business.userId === req.body.userId) {
    // Allow deleting only if the user is a business owner
    if (business.userId === req.body.userId) {
      await business.deleteOne();
      res.status(200).json("the business has been deleted");
    } else {
      res.status(403).json("you can delete only your businesses");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
// //like / dislike a business

router.put("/:id/like", async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    const currentUser = await User.findById(req.body.userId);

    if (!business.likes.includes(req.body.userId)) {

      await business.updateOne({ $push: { likes: req.body.userId } })
      await currentUser.updateOne({ $push: { likedBusinesses: req.params.id } })
      res.status(200).json("You've successfully liked the business");
    } else {
        await business.updateOne({ $pull: { likes: req.body.userId } });
        await currentUser.updateOne({ $pull: { likedBusinesses: req.params.id } })
      res.status(200).json("You've successfully disliked the business");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});


//get business
router.get("/:id", async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    res.status(200).json(business);
} catch (err) {
    res.status(500).json(err);
}
});


router.get("/timeline/all", async (req, res) => {
    try {
        const business = await Business.find()
        .limit(20)
        .sort({ timestamp: 1 });
        
        res.json(business);
    } catch (err) {
        res.status(500).json(err);
      }
    });
    
//Search
// router.get("/search", async (req, res) => {
//     const { query } = req.query;
//     const businesses = await Business.find({
  //         $text: { $search: query } 
  //     });
  //     res.json(businesses);
  //   })
  
  
  //   //filter
  //   router.get("/filter", async (req, res) => {
    //       const { category } = req.query;  
    //       const filter = { category };
    
    //       const businesses = await Business.find(filter);
    //       res.json(businesses);
    //     })
    // export const getBusinesses = async (req, res, next) => {

router.get("/biz", async (req, res) => {
  const q = req.query;
  const filters = {
    ...(q.userId && { userId: q.userId }),
    ...(q.category && { category: q.category }),
    ...(q.description && { description: q.description }),

...(q.search && { name: { $regex: q.search, $options: "i" } }),
};
  try {
    const businesses = await Business.find(filters).sort({ [q.sort]: -1 });
    res.status(200).send(buinesses);
  } catch (err) {
    res.status(500).json(err);
    // next(err);
  }
});



module.exports = router;