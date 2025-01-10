
export const INSERT_USER = 'INSERT INTO users (name, email, tg_id, mysteries_id) VALUES ($1, $2, $3, $4);';

export const GET_ALL_USERS = 'SELECT * FROM users'

export const DELETE_USER = 'DELETE FROM users WHERE tg_id = $1;';

export const GET_USER_BY_TG = 'SELECT * FROM users WHERE tg_id=$1'

export const UPDATE_USER = 'UPDATE users SET name=$1, email=$2, mysteries_id=$3 WHERE tg_id = $4'

export const GET_MYSTERIES = 'SELECT * FROM mysteries;';

export const GET_MYSTERIA = 'SELECT * FROM mysteries WHERE mysteries_id = $1;';

export const GET_MYSTERIA_BY_TEXT = 'SELECT * FROM mysteries WHERE text = $1;';

export const UPDATE_MYSTERIES = `
                                UPDATE users
                                SET mysteries_id = 
                                    CASE
                                        WHEN mysteries_id + 1 > 20 THEN 1
                                        ELSE mysteries_id + 1
                                    END;`