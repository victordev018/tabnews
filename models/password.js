import bcrypt from "bcryptjs";

async function hash(password) {
  const rounds = getNumerOfRounds();
  return await bcrypt.hash(password, rounds);
}

function getNumerOfRounds() {
  return process.env.NODE_ENV === "production" ? 14 : 1;
}

async function compare(providedPassord, storedPassword) {
  return await bcrypt.compare(providedPassord, storedPassword);
}

const password = {
  hash,
  compare,
};

export default password;
