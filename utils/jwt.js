import jwt from "jsonwebtoken";

export const setCookie = async (res, user, message, statuscode = 200) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  await res
    .status(statuscode)
    .cookie("token", token, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      sameSite: "none",
      secure: true,
    })
    .json({
      success: true,
      message,
    });
};
