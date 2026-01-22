import jwt from "jsonwebtoken";

export const generateToken=(user)=>{
 const payLoad = {id:user._id, role:user.role, status:user.status, shop:user.shop || null};
 return jwt.sign(payLoad, process.env.JWT_SECRET, {expiresIn:'1d'});
}