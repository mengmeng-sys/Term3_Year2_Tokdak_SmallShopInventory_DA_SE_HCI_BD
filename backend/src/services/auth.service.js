const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {sendEmail} = require('../config/mailer');
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
};
const changePassword = async (userId, oldPassword, newPassword) => {
    const user = await authRepository.findById(userId);
    if (!user) throw { status: 404, message: 'User Not Found' };
     // 2. We need the password hash, but findById doesn't return it
    // So fetch by email instead, or add a separate query
    const fullUser = await authRepository.findByEmail(user.email);

    // 3. Verify the old password matches
    const isMatch = await bcrypt.compare(oldPassword, fullUser.password);
    if (!isMatch) {
        throw { status: 401, message: 'Current password is incorrect' };
    }

    // 4. Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // 5. Update it in the database
    await authRepository.updatePassword(userId, hashedNewPassword);

    return { message: 'Password updated successfully' };
};

//otp section
const forgotPassword = async (email) =>{
    const user = await authRepository.findByEmail(email);
    if(!user){
        // Don't reveal whether the email exists, for security
        return { message: 'If this email exists, an OTP has been sent' };  
    }

    //Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random()*900000).toString();

    //set expiry for 10 mn from now or from when they ask for
    const expiresAt = new Date(Date.now()+10*60*1000);
    await authRepository.saveResetOtp(email,otp,expiresAt);
    await sendEmail(email, 'forgot_password', { otp });

    return {message: 'If this email exists, an OTP has been sent'}
};

const resetPasswordWithOtp = async (email, otp, newPassword)=>{
    const user = await authRepository.findByEmail(email);
    if(!user) throw {status:400 ,message:'Wrong Email no user found'};
    if(!user.reset_otp) throw {status:400, message:'Please request a new OTP'};
    if(user.reset_otp !== otp) throw {status:400 , message: 'Incorrect OTP'};
    if(new Date() > new Date(user.reset_otp_expires)) throw {status :400 , message:'OTP has expired. Please request a new one'};

    //if you pass all condition

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await authRepository.updatePassword(user.user_id, hashedPassword);
    await authRepository.clearResetOtp(user.user_id);
    await sendEmail(email, 'password_changed', user);
    return { message: 'Password reset successfully' };
}

module.exports ={login,register,getMe,changePassword,forgotPassword,resetPasswordWithOtp};