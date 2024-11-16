-- Удаляем таблицы, если они существуют
-- DROP TABLE IF EXISTS team_members;
-- DROP TABLE IF EXISTS members;
-- DROP TABLE IF EXISTS teams;
-- DROP TABLE IF EXISTS users;

-- Создаем таблицу пользователей
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    second_name VARCHAR(50) NOT NULL,
    company_name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at BIGINT DEFAULT (EXTRACT(EPOCH FROM now())::BIGINT)
);

-- Создаем таблицу команд с привязкой к пользователю
CREATE TABLE IF NOT EXISTS teams (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    created_at BIGINT DEFAULT (EXTRACT(EPOCH FROM now())::BIGINT)
);

-- Создаем таблицу участников с привязкой к пользователю
CREATE TABLE IF NOT EXISTS members (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,
    birthday_timestamp BIGINT NOT NULL,
    birthday_location VARCHAR(100) NOT NULL
);

-- Создаем таблицу связей участников и команд
CREATE TABLE IF NOT EXISTS team_members (
    team_id INT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    member_id INT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    PRIMARY KEY (team_id, member_id)
);
