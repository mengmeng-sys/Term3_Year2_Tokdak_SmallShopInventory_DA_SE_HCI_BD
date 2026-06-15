const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authRepository = require('../repositories/auth.repository');

//login 
const login = async ( email , password) =>{
 const user = await authRepository.findByEmail(email);
 if(!user){
  throw {status: 401 , message : 'Invalid email or password'};
 }
 const isMatch = await bcrypt.compare(password, user.password); // it would return true or false
 if(!isMatch){
  throw {status: 401 , message : 'Invalid email or password'};
 }

 const token = jwt.sign(
  {id :user.user_id, role:user.role},
  process.env.JWT_SECRET,
  {expiresIn:process.env.JWT_EXPIRES || '7d'}
 );

 return {
  token,
  user: {
    user_id: user.user_id,
    name: user.name,
    email: user.email,
    role: user.role
  }
 }

}
const register = async ()=>{
 return 'r';
}
module.exports ={login,register};