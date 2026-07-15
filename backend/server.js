const app = require('./src/app');
require('dotenv').config();
const {sendEmail} = require('./src/config/mailer');

const PORT = process.env.PORT || 5000;

// sendEmail("mseang804@gmail.com",'forgot_password',{otp:"122312"});
//  sendEmail("mseang804@gmail.com",'email_verify',{name:"andre",otp:"122312"});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`TOKDAK server running on port ${PORT} and URL:http://localhost:5000`);
});
