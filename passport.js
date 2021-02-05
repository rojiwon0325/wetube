import passport from "passport";
import GitHubStrategy from "passport-github2";
import { githubLoginCallback } from "./controllers/userController";
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

passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
    await User.findById(id, (err, user) => {
        done(err, user);
    });
});