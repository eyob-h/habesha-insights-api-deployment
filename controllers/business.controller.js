import Business from "../models/business.model.js";
import createError from "../utils/createError.js";

//create business
export const createBusiness = async (req, res, next) => {
    console.log(req.isBusinessOwner)
    if (!req.isBusinessOwner){

      return next(createError(403, "Only business owners can create a business!"));
    }

      // console.log(req.params.isBusinessOwner)
      // console.log(req.params.username)
      
      const newBusiness = new Business({
        userId: req.userId,
    ...req.body,
  });
    
    try {
      const savedBusiness = await newBusiness.save();
      res.status(201).json(savedBusiness);
    } catch (err) {
      next(err);
    }
}
;
//update business
export const updateBusiness = async(req, res, next)=>{
  // const biz = await Business.findById(req.params.id);
  const business = await Business.findById(req.params.id);
  
  if (business.userId !== req.userId){
    return next(createError(403, "Come on man, you can't update somebody else's profile."));
  }
  if(req.body.password){
        //fix the update password issue
        try{
          // const salt = await bcrypt.genSalt(10);
          
          const hash = await bcrypt.hashSync(req.body.password, 5);
          req.body.password = hash;
          console.log(hash)
          console.log("Mango")
          console.log(req.body.password)
          console.log("Mango")
          
            const new_password = bcrypt.hashSync(req.body.password, 5);
            const newUser = new User({
            ...req.body,
            password: hash,
            });
            req.body.password = new_password;   
            
            
        } catch (err) {
            
            console.log(req.body.password)
            return next(createError(403, "Password error!"));
          }
    }
    try{
        const business = await Business.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        });
        res.status(200).json("Account has been updated");
        } catch (err) {
        //  return res.status(500).json(err);
         return next(createError(500, "Account NOT UPDATED"));
        }
      }



//delete business
export const deleteBusiness = async (req, res, next) => {
  try {
    const business = await Business.findById(req.params.id);
    if (business.userId !== req.userId)
      return next(createError(403, "You can delete only your business!"));

    await Business.findByIdAndDelete(req.params.id);
    res.status(200).send("Business has been deleted!");
  } catch (err) {
    next(err);
  }
};

//view business
export const getBusiness = async (req, res, next) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) next(createError(404, "Business not found!"));
    res.status(200).send(business);
  } catch (err) {
    next(err);
  }
};

//FILTER AND SEARCH
export const getBusinesses = async (req, res, next) => {
    console.trace();
  const q = req.query;
  const filters = {
    ...(q.userId && { userId: q.userId }),
    ...(q.category && { category: q.category }),
    // ...((q.min || q.max) && {
    //   price: {
    //     ...(q.min && { $gt: q.min }),
    //     ...(q.max && { $lt: q.max }),
    //   },
    // }),
    // ...(q.search && { description: { $regex: q.search, $options: "i" } }),
    // ...(q.search && {
    //     name: { $regex: q.search, $options: "i" },
    //     description: { $regex: q.search, $options: "i" },
    //   }),
      //============== Searches both the business names and category
      $or: [
        { name: { $regex: q.search || "", $options: "i" } },
        { description: { $regex: q.search || "", $options: "i" } },
      ],
      
      //===================
    // ...(q.search && { description: { $regex: q.search, $options: "i" } }),
  };
  try {
    const biz = await Business.find(filters).sort({ [q.sort]: -1 });
    res.status(200).send(biz);
  } catch (err) {
    next(err);
  }
};