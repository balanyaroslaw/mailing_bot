"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queries = void 0;
var Queries;
(function (Queries) {
    Queries["INSERT_USER"] = "INSERT INTO users (name, email, tg_id, mysteries_id) VALUES ($1, $2, $3, $4);";
    Queries["GET_ALL_USERS"] = "SELECT * FROM users;";
    Queries["DELETE_USER"] = "DELETE FROM users WHERE tg_id = $1;";
    Queries["GET_USER_BY_TG"] = "SELECT * FROM users WHERE tg_id = $1;";
    Queries["UPDATE_USER"] = "UPDATE users SET name = $1, email = $2, mysteries_id = $3 WHERE tg_id = $4;";
    Queries["GET_MYSTERIES"] = "SELECT * FROM mysteries ORDER BY mysteries_id ASC;";
    Queries["GET_MYSTERIA"] = "SELECT m.mysteries_id, m.text, c.comment_text FROM mysteries AS m JOIN mysteries_comments AS c ON m.mysteries_id = c.comment_id WHERE mysteries_id = $1;";
    Queries["GET_MYSTERIA_BY_TEXT"] = "SELECT * FROM mysteries WHERE text = $1;";
    Queries["UPDATE_MYSTERIES"] = "\n        UPDATE users\n        SET mysteries_id = \n            CASE\n                WHEN mysteries_id + 1 > 20 THEN 1\n                ELSE mysteries_id + 1\n            END;";
    Queries["GET_DAILY_MESSAGE"] = "SELECT * FROM daily_messages WHERE sent_date IS NULL ORDER BY message_id ASC;";
    Queries["UPDATE_DAILY_MESSAGE"] = "UPDATE daily_messages SET sent_date = NOW() WHERE message_id = $1;";
    Queries["RESET_DAULY_MESSAGES"] = "UPDATE daily_messages SET sent_date = NULL;";
})(Queries || (exports.Queries = Queries = {}));
