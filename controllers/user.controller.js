import User from "../models/user.model.js";
import createError from "../utils/createError.js";


//DELETE PROFILE
export const deleteUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  console.log(req.userId)
  console.log(user._id.toString())
  if (req.userId !== user._id.toString()) {
    return next(createError(403, "You can delete only your account!"));
  }
  await User.findByIdAndDelete(req.params.id);
  res.status(200).send("Profile Deleted.");
};

//VIEW PROFILE
export const getUser = async (req, res, next) => {
    
  const user = await User.findById(req.params.id);

  res.status(200).send(user);
};

//UPDATE PROFILE
export const updateProfile = async(req, res, next)=>{
    const user = await User.findById(req.params.id);

    if(req.userId !== user._id.toString()){
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
        const user = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        });
        res.status(200).json("Account has been updated");
        } catch (err) {
        //  return res.status(500).json(err);
         return next(createError(500, "Account NOT UPDATED"));
        }
}

 
// == if (req.body.userId === req.params.id) {
//     if (req.body.password) {
//       try {
//         const salt = await bcrypt.genSalt(10);
//         req.body.password = await bcrypt.hash(req.body.password, salt);
//       } catch (err) {
//         return res.status(500).json(err);
//       }
//     }
//     try {
//       const user = await User.findByIdAndUpdate(req.params.id, {
//         $set: req.body,
//       });
//       res.status(200).json("Account has been updated");
//     } catch (err) {
//       return res.status(500).json(err);
//     }
//   } else {
//     return res.status(403).json("You can update only your account!");
//   }