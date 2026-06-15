const app = require('./src/app');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`TOKDAK server running on port ${PORT} and URL:http://localhost:5000`);
});
