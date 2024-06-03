CREATE DATABASE IF NOT EXISTS devthoughts;

USE devthoughts;

CREATE TABLE IF NOT EXISTS users (
    id INT auto_increment PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    surname VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(320) NOT NULL UNIQUE,
    nick VARCHAR(30) NOT NULL,
    unique_code VARCHAR(11) NOT NULL,
    description VARCHAR(255),
    image VARCHAR(50),
    register_date DATE NOT NULL
)ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS posts (
    id INT auto_increment PRIMARY KEY,
    user_id INT,
    post VARCHAR(255) NOT NULL,
    post_date DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)ENGINE=InnoDB;

-- Tabla de Likes
CREATE TABLE IF NOT EXISTS likes (
    id INT auto_increment PRIMARY KEY,
    user_id INT,
    post_id INT,
    like_date DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
)ENGINE=InnoDB;

-- Tabla de Comentarios
CREATE TABLE IF NOT EXISTS comments (
    id INT auto_increment PRIMARY KEY,
    user_id INT,
    post_id INT,
    comment VARCHAR(255) NOT NULL,
    comment_date DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
)ENGINE=InnoDB;

-- Relación de Seguidores
CREATE TABLE IF NOT EXISTS followers (
    id INT auto_increment PRIMARY KEY,
    user_id_follower INT,
    user_id_followed INT,
    following_date DATETIME NOT NULL,
    FOREIGN KEY (user_id_follower) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id_followed) REFERENCES users(id) ON DELETE CASCADE
)ENGINE=InnoDB;