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
const register = async (userData, shopData) => {
    // 1. Check if email already exists
    const emailExists = await authRepository.findEmailExists(userData.email);
    if (emailExists) {
        throw { status: 409, message: 'Email already registered' };
    }

    // 2. Hash the password before storing
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // 3. Create user + shop together
    const result = await authRepository.createUserWithShop(
        { ...userData, password: hashedPassword },
        shopData
    );

    return {
        message: 'Client account created successfully',
        user_id: result.user_id,
        shop_id: result.shop_id
    };
};
const getMe = async (userId) => {
    const user = await authRepository.findById(userId);
    if(!user) throw {status : 404, message:'User Not Found'};

    return user;
}
module.exports ={login,register,getMe};