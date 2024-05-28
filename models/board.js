"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const boardSchema = new Schema({
    name: { type: String, required: true },
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "users", required: true }
}, {
    collection: "board"
});
const Model = mongoose_1.default.model("board", boardSchema);
exports.default = Model;
//# sourceMappingURL=board.js.map