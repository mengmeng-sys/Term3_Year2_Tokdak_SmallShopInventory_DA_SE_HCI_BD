const authService = require('../services/auth.service')

const login = async (req, res, next) => {
 try {
  const { email, password } = req.body;
  if(!email || !password) return res.status(400).json({message:'Email and password are required'});
  const result = await authService.login(email, password);
  res.status(200).json({message:'Login successful', data : result});
 } catch(err) {
  if(err.status){
   return res.status(err.status).json({message: err.message});
   next(err);
  }
 }
};
module.exports = {login};
