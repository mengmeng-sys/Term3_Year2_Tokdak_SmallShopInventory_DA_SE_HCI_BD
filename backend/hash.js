import bcrypt from "bcrypt";

const password = "123456";
const hash = "$2b$10$bryvsvFwJ2VQRQWS7Frcou6woLbn6XzDg5sW98O5XMpnk5VY5hp36";

const result = await bcrypt.compare(password, hash);

console.log(result);