import passport from "passport";
import GitHubStrategy from "passport-github2";
import FacebookStrategy from "passport-facebook";
import { facebookLoginCallback, githubLoginCallback } from "./controllers/userController";
import User from "./models/User";
import routes from "./routes";


passport.use(User.createStrategy());

passport.use(
    new GitHubStrategy({
        clientID: process.env.GH_ID,
        clientSecret: process.env.GH_SECRET,
        callbackURL: `http://localhost:${process.env.PORT}${routes.githubCallback}`,
        scope: "user:email"
    }, githubLoginCallback
    ));

passport.use(new FacebookStrategy({
    clientID: process.env.FB_ID,
    clientSecret: process.env.FB_SECRET,
    callbackURL: `http://localhost:${process.env.PORT}${routes.facebookCallback}`
}, facebookLoginCallback
));



passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
    await User.findById(id, (err, user) => {
        done(err, user);
    });
});