"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const passport_local_mongoose_1 = __importDefault(require("passport-local-mongoose"));
const Schema = mongoose_1.default.Schema;
const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    profileImage: { type: String },
    contact: { type: Number },
    boards: { type: [], default: [] },
    posts: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "posts"
        }
    ]
}, {
    collection: "users"
});
userSchema.plugin(passport_local_mongoose_1.default, { usernameField: "username", passwordField: "password" });
const Model = mongoose_1.default.model("users", userSchema);
exports.default = Model;
//# sourceMappingURL=users.js.map