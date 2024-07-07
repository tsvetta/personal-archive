import crypto from 'crypto';
import argon2 from 'argon2';

export const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString('hex');

  console.log('Generated secret key:', secretKey);

  return secretKey;
};

export const getHashedPassword = async (password: string) => {
  let hash = '';

  try {
    hash = await argon2.hash(password);

    console.log('Generated hash:', hash);
  } catch (err) {
    console.error(err);
  }

  return hash;
};

// getHashedPassword('136668119410ls_family');

export const verifyPassword = async (hash: string, password: string) => {
  let isMatched = undefined;

  try {
    if (await argon2.verify(hash, password)) {
      isMatched = true;
    } else {
      isMatched = false;
    }
  } catch (err) {
    console.error(err);
  }

  return isMatched;
};