
export const INSERT_USER = 'INSERT INTO users (name, email, tg_id, mysteries_id) VALUES ($1, $2, $3, $4);';

export const DELETE_USER = 'DELETE FROM users WHERE tg_id = $1;';

export const GET_USER_BY_TG = 'SELECT * FROM users WHERE tg_id=$1'

export const GET_MYSTERIES = 'SELECT * FROM mysteries;';

export const GET_MYSTERIA = 'SELECT * FROM mysteries WHERE mysteries_id = $1;';

export const GET_MYSTERIA_BY_TEXT = 'SELECT * FROM mysteries WHERE text = $1;';