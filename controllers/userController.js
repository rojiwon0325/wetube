import passport from "passport";
import routes from "../routes";
import User from "../models/User";

export const getJoin = (req, res) => {
    res.render("join", { pageTitle: "Join" });
}

export const postJoin = async (req, res, next) => {
    const {
        body: { name, email, password, verifiedpassword }
    } = req;
    if (password !== verifiedpassword) {
        res.status(400);
        res.render("join", { pageTitle: "Join" });
    } else {
        try {
            const user = await User({ name, email });
            await User.register(user, password);
            next();
        } catch (error) {
            console.log(error);
            res.redirect(routes.home);
        }
    }
}

export const getLogin = (req, res) => {
    res.render("login", { pageTitle: "Log In" });
}
export const postLogin = passport.authenticate("local", {
    failureRedirect: routes.login,
    successRedirect: routes.home
});

export const githubLogin = passport.authenticate("github");

export const postGithubLogin = (req, res) => {
    res.redirect(routes.home);
};

export const githubLoginCallback = async (_, __, profile, cb) => {
    const { _json: { id, avatar_url, name, email } } = profile;
    try {
        const user = await User.findOne({ email });
        if (user) {
            user.githubId = id;
            user.save();
            return cb(null, user);
        } else {
            const newUser = await User.create({
                email, name, githubId: id, avatarUrl: avatar_url
            });
            return cb(null, newUser);
        }
    } catch (error) {
        return cb(error);
    }
};

export const logout = (req, res) => {
    req.logout();
    res.redirect(routes.home);
};

export const users = (req, res) => res.render("users");
export const userDetail = (req, res) => res.render("userDetail");
export const editProfile = (req, res) => res.render("editProfile");
export const changePassword = (req, res) => res.render("changePassword");