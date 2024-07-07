// import 'dotenv/config';
// import passport from 'passport';
// import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
// import { User } from '@archive/server/models.js';

// const secretKey = process.env.SECRET_KEY || '';

// const jwtOptions = {
//   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//   secretOrKey: secretKey,
// };

// passport.use(
//   new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
//     console.log('1 jwtPayload', jwtPayload);
//     try {
//       const user = await User.findById(jwtPayload.userId);
//       console.log('222 user', user);

//       if (user) {
//         return done(null, user);
//       } else {
//         return done(null, false);
//       }
//     } catch (error) {
//       return done(error, false);
//     }
//   })
// );

// export { passport };
