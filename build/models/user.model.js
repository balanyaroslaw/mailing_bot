"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var User = /** @class */ (function () {
    function User(name, email, tg_id, mysteria, id, mysteries_id) {
        this.id = null;
        this.name = name;
        this.email = email;
        this.tg_id = tg_id;
        this.mysteria = mysteria;
        if (id) {
            this.id = id;
        }
        if (mysteries_id) {
            this.mysteries_id = mysteries_id;
        }
    }
    return User;
}());
exports.User = User;
