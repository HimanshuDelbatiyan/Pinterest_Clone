"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const pinSchema = new Schema({
    imageURL: { type: String, required: true },
    description: { type: String },
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "users", required: true },
}, {
    collection: "pin"
});
const Model = mongoose_1.default.model("pin", pinSchema);
exports.default = Model;
//# sourceMappingURL=pin.js.map