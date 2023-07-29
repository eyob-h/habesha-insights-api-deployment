import Business from "../models/business.model.js";
import createError from "../utils/createError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  try {
    const hash = bcrypt.hashSync(req.body.password, 5);
    const newBusiness = new Business({
      ...req.body,
      password: hash,
    });

    await newBusiness.save();
    res.status(201).send("Business has been created.");
  } catch (err) {
    next(err);
  }
};
export const login = async (req, res, next) => {
  try {
    const business = await Business.findOne({ name: req.body.name });

    if (!business) return next(createError(404, "Business not found!"));

    const isCorrect = bcrypt.compareSync(req.body.password, business.password);
    if (!isCorrect)
      return next(createError(400, "Wrong password or businessname!"));

    const token = jwt.sign(
      {
        id: business._id,
        // isSeller: business.isSeller,
      },
      process.env.JWT_KEY
    );

    const { password, ...info } = business._doc;
    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .send(info);
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res) => {
  res
    .clearCookie("accessToken", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .send("Business has been logged out.");
};