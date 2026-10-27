-- =====================================================================
-- VitalFit - Esquema de base de datos (MySQL / MariaDB en XAMPP)
-- Ejecutar en phpMyAdmin (pestaña SQL) o con: mysql -u root < 01_schema.sql
-- Es re-ejecutable: borra las tablas en orden de dependencias.
-- Motor: InnoDB, charset utf8mb4.
-- =====================================================================

CREATE DATABASE IF NOT EXISTS fitvital_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE fitvital_db;

-- Borrar en orden inverso a las FK (las hijas primero)
DROP TABLE IF EXISTS consents;
DROP TABLE IF EXISTS ai_chat_history;
DROP TABLE IF EXISTS memberships;
DROP TABLE IF EXISTS exercises;
DROP TABLE IF EXISTS routines;
DROP TABLE IF EXISTS users;

-- ---------------------------------------------------------------------
-- users
-- Solo datos necesarios para el servicio (minimización de datos).
-- fitness_goal: valores del enum Java FitnessGoalEnum.
-- birth_date: solo para saber si el usuario es menor de edad.
-- ---------------------------------------------------------------------
CREATE TABLE users (
    id                        BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name                 VARCHAR(100) NOT NULL,
    email                     VARCHAR(100) NOT NULL,
    password                  VARCHAR(255) NOT NULL,      -- hash BCrypt, nunca texto plano
    birth_date                DATE NULL,
    weight_kg                 DECIMAL(5,2) NULL,
    height_cm                 INT NULL,
    fitness_goal              VARCHAR(30) NULL,
    dark_mode                 BOOLEAN NOT NULL DEFAULT FALSE,
    parental_consent_required BOOLEAN NOT NULL DEFAULT FALSE,  -- TRUE si es menor de 18
    parental_consent_at       TIMESTAMP NULL,                  -- fecha del consentimiento del padre/tutor
    created_at                TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_users_email UNIQUE (email),
    CONSTRAINT chk_weight_positive CHECK (weight_kg IS NULL OR weight_kg > 0),
    CONSTRAINT chk_height_positive CHECK (height_cm IS NULL OR height_cm > 0),
    CONSTRAINT chk_fitness_goal CHECK (
        fitness_goal IS NULL
        OR fitness_goal IN ('PERDIDA_GRASA', 'GANANCIA_MUSCULAR', 'RESISTENCIA')
    )
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- consents
-- Registro de aceptación de documentos legales y de consentimientos.
-- document_version permite saber qué versión del texto se aceptó.
-- ---------------------------------------------------------------------
CREATE TABLE consents (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id          BIGINT NOT NULL,
    consent_type     VARCHAR(30) NOT NULL,
    document_version VARCHAR(20) NOT NULL,
    accepted         BOOLEAN NOT NULL,
    accepted_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_consents_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT chk_consent_type CHECK (consent_type IN (
        'TERMS', 'PRIVACY', 'COOKIES', 'REFUND', 'MARKETING', 'PARENTAL'
    ))
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- routines
-- ---------------------------------------------------------------------
CREATE TABLE routines (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    title               VARCHAR(100) NOT NULL,
    description         TEXT NULL,
    location_type       VARCHAR(20) NOT NULL,
    difficulty_level    VARCHAR(20) NOT NULL,
    target_muscle_group VARCHAR(50) NOT NULL,
    duration_minutes    INT NOT NULL,

    CONSTRAINT uq_routines_title UNIQUE (title),
    CONSTRAINT chk_location_type CHECK (location_type IN ('GYM', 'HOME')),
    CONSTRAINT chk_difficulty_level CHECK (difficulty_level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')),
    CONSTRAINT chk_duration_positive CHECK (duration_minutes > 0)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- exercises
-- ---------------------------------------------------------------------
CREATE TABLE exercises (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    routine_id   BIGINT NOT NULL,
    name         VARCHAR(100) NOT NULL,
    sets         INT NOT NULL DEFAULT 3,
    reps         INT NOT NULL DEFAULT 12,
    rest_seconds INT NOT NULL DEFAULT 60,
    video_url    VARCHAR(255) NULL,

    CONSTRAINT fk_exercises_routine
        FOREIGN KEY (routine_id) REFERENCES routines(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT chk_sets_positive CHECK (sets > 0),
    CONSTRAINT chk_reps_positive CHECK (reps > 0)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- memberships
-- plan_type: MENSUAL, TRIMESTRAL, ANUAL (MembershipHandler.java e index.html)
-- amount_paid se calcula en el servidor; el precio no lo manda el cliente.
-- ---------------------------------------------------------------------
CREATE TABLE memberships (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    plan_type       VARCHAR(20) NOT NULL,
    start_date      DATE NOT NULL,
    expiration_date DATE NOT NULL,
    amount_paid     DECIMAL(10,2) NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT fk_memberships_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT chk_plan_type CHECK (plan_type IN ('MENSUAL', 'TRIMESTRAL', 'ANUAL')),
    CONSTRAINT chk_status CHECK (status IN ('ACTIVE', 'EXPIRED', 'CANCELLED')),
    CONSTRAINT chk_coherent_dates CHECK (expiration_date >= start_date),
    CONSTRAINT chk_amount_positive CHECK (amount_paid >= 0)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- ai_chat_history
-- ---------------------------------------------------------------------
CREATE TABLE ai_chat_history (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT NOT NULL,
    user_prompt TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    category    VARCHAR(30) NOT NULL DEFAULT 'NUTRITION',
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_ai_history_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT chk_category CHECK (category IN ('NUTRITION', 'TRAINING', 'GENERAL'))
) ENGINE=InnoDB;
