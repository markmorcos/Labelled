import { randomBytes, scryptSync } from "crypto";

export const toHash = (password: string) => {
  const salt = randomBytes(8).toString("hex");
  const buffer = scryptSync(password, salt, 64);

  return `${buffer.toString("hex")}.${salt}`;
};

export const compare = (storedPassword: string, suppliedPassword: string) => {
  const [hashedPassword, salt] = storedPassword.split(".");
  const buffer = scryptSync(suppliedPassword, salt, 64);

  return buffer.toString("hex") === hashedPassword;
};
