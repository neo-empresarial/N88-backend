import { registerAs } from '@nestjs/config';

export default registerAs('googleOAuth', () => ({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.BACKEND_URL
    ? `${process.env.BACKEND_URL}auth/google/callback`
    : `http://localhost:8000/auth/google/callback`,
}));
