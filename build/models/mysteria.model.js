"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mysteria = void 0;
var Mysteria = /** @class */ (function () {
    function Mysteria(text, mysteries_id, comment_text) {
        if (mysteries_id) {
            this.mysteries_id = mysteries_id;
        }
        if (comment_text) {
            this.comment_text = comment_text;
        }
        this.text = text;
    }
    return Mysteria;
}());
exports.Mysteria = Mysteria;
