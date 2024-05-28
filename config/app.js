"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = __importDefault(require("passport-local"));
const connect_flash_1 = __importDefault(require("connect-flash"));
const express_session_1 = __importDefault(require("express-session"));
const users_1 = __importDefault(require("../models/users"));
const routes_1 = __importDefault(require("../routes"));
let localStrategy = passport_local_1.default.Strategy;
const app = (0, express_1.default)();
mongoose_1.default.connect("mongodb://localhost/pinterestMain");
const db = mongoose_1.default.connection;
db.on('error', function () {
    console.error("Connection Error");
});
db.once("open", function () {
    console.log(`Connected to MongoDB at Localhost`);
});
app.set('view engine', 'ejs');
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
app.use(express_1.default.static(path_1.default.join(__dirname, "../node_modules")));
app.use((0, connect_flash_1.default)());
app.use((0, express_session_1.default)({
    resave: false,
    saveUninitialized: false,
    secret: "Its me Baby"
}));
app.use(passport_1.default.initialize());
passport_1.default.use(new localStrategy({ usernameField: "username", passwordField: "password" }, users_1.default.authenticate()));
app.use(passport_1.default.session());
passport_1.default.serializeUser(users_1.default.serializeUser());
passport_1.default.deserializeUser(users_1.default.deserializeUser());
app.use('/', routes_1.default);
app.use(function (req, res, next) {
    next((0, http_errors_1.default)(404));
});
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});
exports.default = app;
//# sourceMappingURL=app.js.map