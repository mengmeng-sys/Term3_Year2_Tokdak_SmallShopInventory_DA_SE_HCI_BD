const app = require('./src/app');
require('dotenv').config();
const {sendEmail} = require('./src/config/mailer');

const PORT = process.env.PORT || 5000;
// const vid ={name:'vid'};
// sendEmail("sundabid13@gmail.com",'password_changed',vid);
app.listen(PORT, () => {
  console.log(`TOKDAK server running on port ${PORT} and URL:http://localhost:5000`);
});
