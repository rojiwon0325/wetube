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
            res.redirect(routes.join);
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
    const { _json: { id, avatar_url, name } } = profile;
    const email = profile.emails[0].value;
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

export const facebookLogin = passport.authenticate("facebook");
export const facebookLoginCallback = (_, __, profile, cb) => {
    console.log(profile, cb);
}
export const postFacebookLogin = (req, res) => {
    res.redirect(routes.home);
}

export const logout = (req, res) => {
    req.logout();
    res.redirect(routes.home);
};

export const userDetail = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("videos");
        console.log(user);
        res.render("userDetail", { pageTitle: "Profile", user });
    } catch (error) {
        res.render(routes.home);
    }
}
export const getEditProfile = (req, res) => res.render("editProfile", { pageTitle: "Edit Profile" });
export const postEditProfile = async (req, res) => {
    const {
        body: { name, email },
        file
    } = req;
    try {
        await User.findByIdAndUpdate(req.user.id, {
            name, email, avatarUrl: file ? `/${file.path}` : req.user.avatarUrl
        });
        res.redirect(routes.users + routes.userDetail);
    } catch (error) {
        res.redirect(routes.users + routes.editProfile);
    }
}

export const getChangePassword = (req, res) => res.render("changePassword", { pageTitle: "Change Password" });

export const postChangePassword = async (req, res) => {
    const {
        body: {
            oldPassword, newPassword, verifiedPassword
        }
    } = req;
    try {
        if (newPassword !== verifiedPassword) {
            res.status(400);
            res.redirect(routes.changePassword);
            return;
        } else {
            await req.user.changePassword(oldPassword, newPassword);
            res.redirect(routes.users + routes.userDetail);
        }
    } catch (error) {
        res.status(400);
        res.redirect(routes.users + routes.changePassword);
    }
}