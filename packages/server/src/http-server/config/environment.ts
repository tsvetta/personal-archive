import 'dotenv/config';

export const isProduction = process.env.NODE_ENV === 'production';
export const base = process.env.BASE || '/';
export const port = process.env.PORT || 5173;
