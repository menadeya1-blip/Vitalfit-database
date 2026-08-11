CREATE DATABASE IF NOT EXISTS fitvital_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE fitvital_db;

DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    weight_kg DECIMAL(5,2) NULL,
    height_cm INT NULL,
    clothing_size VARCHAR(10) NULL,
    fitness_goal VARCHAR(50) NULL DEFAULT 'MAINTAIN',
    dark_mode BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT uq_users_email UNIQUE (email),
    CONSTRAINT chk_weight_positive CHECK (weight_kg IS NULL OR weight_kg > 0),
    CONSTRAINT chk_height_positive CHECK (height_cm IS NULL OR height_cm > 0)
);

CREATE TABLE IF NOT EXISTS routines (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NULL,
    location_type VARCHAR(20) NOT NULL,
    difficulty_level VARCHAR(20) NOT NULL,
    target_muscle_group VARCHAR(50) NOT NULL,
    duration_minutes INT NOT NULL,
    
    CONSTRAINT chk_location_type CHECK (location_type IN ('GYM', 'HOME')),
    CONSTRAINT chk_difficulty_level CHECK (difficulty_level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')),
    CONSTRAINT chk_duration_positive CHECK (duration_minutes > 0)
);

CREATE TABLE exercises (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    routine_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    sets INT NOT NULL DEFAULT 3,
    reps INT NOT NULL DEFAULT 12,
    rest_seconds INT NOT NULL DEFAULT 60,
    video_url VARCHAR(255) NULL,
    
    CONSTRAINT fk_exercises_routine 
        FOREIGN KEY (routine_id) 
        REFERENCES routines(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    CONSTRAINT chk_sets_positive CHECK (sets > 0),
    CONSTRAINT chk_reps_positive CHECK (reps > 0)
);

CREATE TABLE  memberships (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    plan_type VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    expiration_date DATE NOT NULL,
    amount_paid DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    
    CONSTRAINT fk_memberships_user 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
        
    CONSTRAINT chk_plan_type CHECK (plan_type IN ('FULL_PASS_GYM', 'DIGITAL_HOME_PLAN')),
    CONSTRAINT chk_status CHECK (status IN ('ACTIVE', 'EXPIRED', 'CANCELLED')),
    CONSTRAINT chk_coherent_dates CHECK (expiration_date >= start_date),
    CONSTRAINT chk_amount_positive CHECK (amount_paid >= 0)
);

CREATE TABLE ai_chat_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    user_prompt TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    category VARCHAR(30) NOT NULL DEFAULT 'NUTRITION',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_ai_history_user 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
        
    CONSTRAINT chk_category CHECK (category IN ('NUTRITION', 'TRAINING', 'GENERAL'))
);
