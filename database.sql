create TABLE users
(
    id      SERIAL PRIMARY KEY,
    username  VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    roles  TEXT[]
);

create TABLE meetups
(
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(255),
    description VARCHAR(1000),
    tags        VARCHAR(100),
    dateTime    date,
    location    VARCHAR(100),
    user_id     INTEGER,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

create TABLE tokens
(
    token_id VARCHAR(255),
    user_id VARCHAR(255)
);