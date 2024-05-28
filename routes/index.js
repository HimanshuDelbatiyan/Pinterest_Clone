"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const router = express_1.default.Router();
const users_1 = __importDefault(require("../models/users"));
const posts_1 = __importDefault(require("../models/posts"));
const multer_1 = __importDefault(require("./multer"));
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Login', nav: false });
});
router.post('/', function (req, res, next) {
    passport_1.default.authenticate("local", { successRedirect: "/profile", failureRedirect: "/", failureFlash: true })(req, res, next);
});
router.post('/register', function (req, res, next) {
    let { username, fullname, password, email, contact } = req.body;
    let newUser = new users_1.default({ username, fullname, email, profileImage: "", contact });
    users_1.default.register(newUser, password, (err) => {
        if (err) {
            if (err.name === "UserExistsError") {
                console.log("Error:User Already Exists with this email");
                req.flash("registerMessage", "Warning: User already exists");
                res.redirect("/register");
            }
            else {
                req.flash("registerMessage", "Server Error");
                res.redirect("/register");
            }
        }
        else {
            return passport_1.default.authenticate("local")(req, res, () => { res.redirect("/profile"); });
        }
    });
});
router.get('/register', function (req, res, next) {
    res.render('register', { title: 'Register', nav: false });
});
router.post('/edit', isLoggedIn, async function (req, res, next) {
    let { username, fullName, email, contact } = req.body;
    let updatedUser = await new users_1.default({
        _id: req.user._id,
        username,
        fullname: fullName,
        password: req.user.password,
        email,
        profileImage: req.user.profileImage,
        contact,
        posts: req.user.posts
    });
    await users_1.default.updateOne({ "_id": req.user._id }, updatedUser);
    res.redirect("/profile");
});
router.get('/feed', isLoggedIn, async function (req, res, next) {
    const currentUser = await users_1.default.findOne({ "_id": req.user._id }).populate("posts");
    const posts = await posts_1.default.find().populate("user");
    res.render("feed", { nav: true, title: "Feed", posts, user: currentUser });
});
router.get('/show/posts', isLoggedIn, async function (req, res, next) {
    const currentUser = await users_1.default.findOne({ "_id": req.user._id }).populate("posts");
    console.log(currentUser);
    res.render('show', { title: 'Posts', nav: true, user: currentUser });
});
router.get('/logout', function (req, res, next) {
    req.logout((err) => {
        if (err) {
            console.log(err);
            next(err);
        }
        res.redirect("/");
    });
});
router.get('/profile', isLoggedIn, async function (req, res, next) {
    const currentUser = await users_1.default.findOne({ "_id": req.user._id }).populate("posts");
    res.render('profile', { title: "Profile", userData: currentUser, nav: true });
});
router.post('/upload', isLoggedIn, multer_1.default.single("image"), async function (req, res, next) {
    const currentUser = await users_1.default.findOne({ "_id": req.user._id });
    currentUser.profileImage = req.file.filename;
    await currentUser.save();
    res.redirect("/profile");
});
router.post('/createPost', isLoggedIn, multer_1.default.single("postImage"), async function (req, res, next) {
    console.log(req.file.filename);
    const newPost = await posts_1.default.create({
        postTitle: req.body.postTitle,
        postDescription: req.body.postDescription,
        postImage: req.file.filename,
        user: req.user._id
    });
    console.log(newPost);
    const currentUser = await users_1.default.findOne({ "_id": req.user._id });
    currentUser.posts.push(newPost._id);
    await currentUser.save();
    res.redirect("/profile");
});
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect("/");
}
exports.default = router;
//# sourceMappingURL=index.js.map