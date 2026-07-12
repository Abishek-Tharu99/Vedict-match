import bcrypt from "bcrypt";

const password = "Vedicmatch@123";

bcrypt.hash(password, 10).then(console.log);

