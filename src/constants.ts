export const SALT = 10;

export const OK = 200; // Запрос прошёл успешно.
export const CREATED = 201; // Ресурс был создан на сервере.
export const ACCEPTED = 202; // Сервер начал работу по удовлетворению запроса, но ещё не закончил.
export const BAD_REQUEST = 400; //  Ошибка на стороне клиента.
export const UNAUTHORIZED = 401; // Запрос требует авторизации.
export const NOT_FOUND = 404; //  Ресурс не найден.
export const CONFLICT = 409; // Данный email уже используется.
export const INTERNAL_SERVER_ERROR = 500; //  Общий статус для ошибок на стороне сервера.
export const IM_A_KETTLE = 418; //  418 — «я чайник!»

// eslint-disable-next-line no-useless-escape
export const regexLink = /^https?:\/\/[a-z,0-9,\-\._~:\/?#\[\]@!$&'\(\)*\+,;=]+\.[a-z,0-9,\-\._~:\/?#\[\]@!$&'\(\)*\+,;=]+#?/i;

export const nameServer = 'mongodb://127.0.0.1:27017/mestodb';
