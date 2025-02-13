export enum Queries {
    INSERT_USER = 'INSERT INTO users (name, email, tg_id, mysteries_id) VALUES ($1, $2, $3, $4);',
    GET_ALL_USERS = 'SELECT * FROM users;',
    DELETE_USER = 'DELETE FROM users WHERE tg_id = $1;',
    GET_USER_BY_TG = 'SELECT * FROM users WHERE tg_id = $1;',
    UPDATE_USER = 'UPDATE users SET name = $1, email = $2, mysteries_id = $3 WHERE tg_id = $4;',
    GET_MYSTERIES = 'SELECT m.mysteries_id, m.text, c.comment_text FROM mysteries AS m JOIN mysteries_comments AS c ON m.mysteries_id = c.comment_id;',
    GET_MYSTERIA = 'SELECT * FROM mysteries WHERE mysteries_id = $1;',
    GET_MYSTERIA_BY_TEXT = 'SELECT * FROM mysteries WHERE text = $1;',
    UPDATE_MYSTERIES = `
        UPDATE users
        SET mysteries_id = 
            CASE
                WHEN mysteries_id + 1 > 20 THEN 1
                ELSE mysteries_id + 1
            END;`,

    GET_DAILY_MESSAGE = 'SELECT * FROM daily_messages WHERE sent_date IS NULL ORDER BY message_id ASC;',
    UPDATE_DAILY_MESSAGE = 'UPDATE messages SET sent_date = NOW() WHERE id = $1;',
    RESET_DAULY_MESSAGES = 'UPDATE messages SET sent_date = NULL;'
}