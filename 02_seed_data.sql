-- =====================================================================
-- VitalFit - Datos de prueba (ejecutar DESPUÉS de 01_schema.sql)
-- Las consultas de prueba (JOIN, GROUP BY) están en 03_queries.sql
-- =====================================================================
USE fitvital_db;

-- Rutinas
INSERT INTO routines (title, description, location_type, difficulty_level, target_muscle_group, duration_minutes) VALUES
('Tren Inferior en Máquinas (Glúteo y Pierna)', 'Rutina en máquinas guiadas para aislar cuadriceps, isquiotibiales y glúteos de forma segura.', 'GYM', 'BEGINNER', 'LEGS', 50),
('Torso y Espalda en Poleas y Máquinas', 'Enfoque en desarrollo de espalda, pecho y hombros utilizando sistemas de polea y palanca.', 'GYM', 'INTERMEDIATE', 'UPPER_BODY', 45),
('Aislamiento de Brazos en Máquina (Bíceps y Tríceps)', 'Rutina de bombeo muscular para brazos usando máquinas selectorizadas y poleas.', 'GYM', 'INTERMEDIATE', 'ARMS', 40);

-- Ejercicios
INSERT INTO exercises (routine_id, name, sets, reps, rest_seconds) VALUES
((SELECT id FROM routines WHERE title = 'Tren Inferior en Máquinas (Glúteo y Pierna)'), 'Prensa de Piernas 45° (Leg Press)', 4, 12, 90),
((SELECT id FROM routines WHERE title = 'Tren Inferior en Máquinas (Glúteo y Pierna)'), 'Extensión de Cuádriceps en Máquina', 4, 15, 60),
((SELECT id FROM routines WHERE title = 'Tren Inferior en Máquinas (Glúteo y Pierna)'), 'Curl Femoral Tumbado/Sentado', 4, 12, 60),
((SELECT id FROM routines WHERE title = 'Tren Inferior en Máquinas (Glúteo y Pierna)'), 'Abductores en Máquina Sentado', 3, 20, 45),
((SELECT id FROM routines WHERE title = 'Tren Inferior en Máquinas (Glúteo y Pierna)'), 'Elevación de Talones/Pantorrilla en Máquina', 4, 15, 45),
((SELECT id FROM routines WHERE title = 'Torso y Espalda en Poleas y Máquinas'), 'Jalón al Pecho en Polea Alta (Lat Pulldown)', 4, 10, 75),
((SELECT id FROM routines WHERE title = 'Torso y Espalda en Poleas y Máquinas'), 'Remo Gironda / Remo en Polea Baja', 4, 12, 75),
((SELECT id FROM routines WHERE title = 'Torso y Espalda en Poleas y Máquinas'), 'Press de Pecho en Máquina Contractor/Pectoral Fly', 4, 12, 60),
((SELECT id FROM routines WHERE title = 'Torso y Espalda en Poleas y Máquinas'), 'Press de Hombros Sentado en Máquina (Shoulder Press)', 3, 12, 60),
((SELECT id FROM routines WHERE title = 'Aislamiento de Brazos en Máquina (Bíceps y Tríceps)'), 'Extensión de Tríceps en Polea Alta con Cuerda', 4, 12, 60),
((SELECT id FROM routines WHERE title = 'Aislamiento de Brazos en Máquina (Bíceps y Tríceps)'), 'Curl de Bíceps en Polea Baja con Barra Recta', 4, 12, 60),
((SELECT id FROM routines WHERE title = 'Aislamiento de Brazos en Máquina (Bíceps y Tríceps)'), 'Curl Scott / Predicador en Máquina', 3, 10, 60),
((SELECT id FROM routines WHERE title = 'Aislamiento de Brazos en Máquina (Bíceps y Tríceps)'), 'Press Francés en Máquina / Fondos Asistidos', 3, 12, 60);

-- Usuarios de prueba (contraseñas = hash BCrypt de ejemplo, NO son contraseñas reales)
INSERT INTO users (full_name, email, password, birth_date, weight_kg, height_cm, fitness_goal) VALUES
('Deyaneira Gutiérrez', 'deyaneira@test.com', '$2a$10$PLACEHOLDERhashDeEjemploNoUsar000000000000000000', '2000-01-01', 60.50, 165, 'GANANCIA_MUSCULAR'),
('Carlos Gómez',        'carlos@test.com',     '$2a$10$PLACEHOLDERhashDeEjemploNoUsar000000000000000000', '1995-05-10', 78.00, 178, 'PERDIDA_GRASA'),
('Mariana López',       'mariana@test.com',    '$2a$10$PLACEHOLDERhashDeEjemploNoUsar000000000000000000', '1990-09-20', 55.00, 160, 'RESISTENCIA');

-- Consentimientos de prueba (versión de documentos de ejemplo)
INSERT INTO consents (user_id, consent_type, document_version, accepted) VALUES
(1, 'TERMS', 'v1.0', TRUE), (1, 'PRIVACY', 'v1.0', TRUE),
(2, 'TERMS', 'v1.0', TRUE), (2, 'PRIVACY', 'v1.0', TRUE),
(3, 'TERMS', 'v1.0', TRUE), (3, 'PRIVACY', 'v1.0', TRUE);

-- Membresías (precios del código: MembershipHandler.java)
INSERT INTO memberships (user_id, plan_type, start_date, expiration_date, amount_paid, status) VALUES
(1, 'MENSUAL',    '2026-08-01', '2026-08-31',  80000.00, 'ACTIVE'),
(2, 'TRIMESTRAL', '2026-07-15', '2026-10-13', 210000.00, 'EXPIRED');

-- Historial de consultas a la IA de prueba
INSERT INTO ai_chat_history (user_id, user_prompt, ai_response, category) VALUES
(1, '¿Cuánta proteína debo consumir para aumentar masa muscular?', 'Se recomienda entre 1.6 g y 2.2 g de proteína por kg de peso corporal.', 'NUTRITION'),
(1, '¿Cuál es la mejor máquina para glúteos?', 'La prensa de piernas 45° y la máquina de abductores son opciones efectivas.', 'TRAINING'),
(2, '¿Cómo hacer un déficit calórico seguro?', 'Reduce entre 300 y 500 calorías de tu gasto energético total.', 'NUTRITION');
