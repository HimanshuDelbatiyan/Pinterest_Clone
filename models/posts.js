"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const postSchema = new Schema({
    postTitle: { type: String },
    postDescription: { type: String },
    postImage: { type: String },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "users"
    },
    createdAt: { type: Date, default: Date.now },
}, {
    collection: "posts"
});
const Model = mongoose_1.default.model("posts", postSchema);
exports.default = Model;
//# sourceMappingURL=posts.js.map