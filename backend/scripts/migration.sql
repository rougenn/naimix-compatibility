-- Таблица для пользователей сайта (users)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    second_name VARCHAR(50) NOT NULL,
    company_name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at BIGINT NOT NULL
);

-- Таблица для команд (teams)
CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at BIGINT NOT NULL
);

-- Таблица для участников команд (members)
CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    role VARCHAR(50) NOT NULL,
    birthday_timestamp BIGINT NOT NULL,
    birthday_location VARCHAR(100) NOT NULL
);

-- Промежуточная таблица для связи участников и команд
CREATE TABLE team_members (
    team_id INT REFERENCES teams(id) ON DELETE CASCADE,
    member_id INT REFERENCES members(id) ON DELETE CASCADE,
    PRIMARY KEY (team_id, member_id)
);
