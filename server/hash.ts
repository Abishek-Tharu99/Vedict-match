import bcrypt from "bcrypt";

const password = "admin123";

bcrypt.hash(password, 10).then(console.log);

