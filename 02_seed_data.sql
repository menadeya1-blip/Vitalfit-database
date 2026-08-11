-- PRUEBAS CON INNER JOIN
-- Muestra solo los registros que coinciden en ambas tablas

SELECT 
    r.title AS routine_title,
    r.location_type,
    r.target_muscle_group,
    e.name AS exercise_name,
    e.sets,
    e.reps,
    e.rest_seconds
FROM routines r
INNER JOIN exercises e ON r.id = e.routine_id
ORDER BY r.title;

-- PRUEBAS CON LEFT JOIN
-- Muestra todos los registros de la primera tabla, incluso si no tienen rregistros asociados en la segunda tabla

SELECT 
    u.id AS user_id,
    u.full_name,
    u.email,
    m.plan_type,
    m.status AS membership_status,
    m.expiration_date
FROM users u
LEFT JOIN memberships m ON u.id = m.user_id;

-- RIGHT JOIN
-- Muestra todas las rutinas creadas, incluso si una no tiene ejercicios configurados

SELECT 
    e.name AS exercise_name,
    e.sets,
    e.reps,
    r.title AS routine_title,
    r.location_type
FROM
    exercises e
        RIGHT JOIN
    routines r ON e.routine_id = r.id;


-- GROUP BY
-- Contar cuantos ejercicios tiene cada rutina
SELECT 
    r.title AS routine_title,
    r.location_type,
    COUNT(e.id) AS total_exercises
FROM routines r
LEFT JOIN exercises e ON r.id = e.routine_id
GROUP BY r.id, r.title, r.location_type;

--  Calcular el total recaudado por tipo de membresia  y promedio cobrado

SELECT 
    plan_type,
    COUNT(id) AS total_subscriptions,
    SUM(amount_paid) AS total_revenue,
    AVG(amount_paid) AS average_price
FROM memberships
GROUP BY plan_type;

-- Contar cuantas consultas ha realizado cada usuario a la IA

SELECT 
    u.full_name,
    u.email,
    COUNT(ai.id) AS total_ai_queries
FROM users u
INNER JOIN ai_chat_history ai ON u.id = ai.user_id
GROUP BY u.id, u.full_name, u.email;






INSERT INTO routines (title, description, location_type, difficulty_level, target_muscle_group, duration_minutes) VALUES
('Tren Inferior en Máquinas (Glúteo y Pierna)', 'Rutina en máquinas guiadas para aislar cuadriceps, isquiotibiales y glúteos de forma segura.', 'GYM', 'BEGINNER', 'LEGS', 50),
('Torso y Espalda en Poleas y Máquinas', 'Enfoque en desarrollo de espalda, pecho y hombros utilizando sistemas de polea y palanca.', 'GYM', 'INTERMEDIATE', 'UPPER_BODY', 45),
('Aislamiento de Brazos en Máquina (Bíceps y Tríceps)', 'Rutina de bombeo muscular para brazos usando máquinas selectorizadas y poleas.', 'GYM', 'INTERMEDIATE', 'ARMS', 40);


INSERT INTO exercises (routine_id, name, sets, reps, rest_seconds) VALUES
((SELECT id FROM routines WHERE title = 'Tren Inferior en Máquinas (Glúteo y Pierna)'), 'Prensa de Piernas 45° (Leg Press)', 4, 12, 90),
((SELECT id FROM routines WHERE title = 'Tren Inferior en Máquinas (Glúteo y Pierna)'), 'Extensión de Cuádriceps en Máquina', 4, 15, 60),
((SELECT id FROM routines WHERE title = 'Tren Inferior en Máquinas (Glúteo y Pierna)'), 'Curl Femoral Tumbado/Sentado', 4, 12, 60),
((SELECT id FROM routines WHERE title = 'Tren Inferior en Máquinas (Glúteo y Pierna)'), 'Abductores en Máquina Sentado', 3, 20, 45),
((SELECT id FROM routines WHERE title = 'Tren Inferior en Máquinas (Glúteo y Pierna)'), 'Elevación de Talones/Pantorrilla en Máquina', 4, 15, 45);

INSERT INTO exercises (routine_id, name, sets, reps, rest_seconds) VALUES
((SELECT id FROM routines WHERE title = 'Torso y Espalda en Poleas y Máquinas'), 'Jalón al Pecho en Polea Alta (Lat Pulldown)', 4, 10, 75),
((SELECT id FROM routines WHERE title = 'Torso y Espalda en Poleas y Máquinas'), 'Remo Gironda / Remo en Polea Baja', 4, 12, 75),
((SELECT id FROM routines WHERE title = 'Torso y Espalda en Poleas y Máquinas'), 'Press de Pecho en Máquina Contractor/Pectoral Fly', 4, 12, 60),
((SELECT id FROM routines WHERE title = 'Torso y Espalda en Poleas y Máquinas'), 'Press de Hombros Sentado en Máquina (Shoulder Press)', 3, 12, 60);


INSERT INTO exercises (routine_id, name, sets, reps, rest_seconds) VALUES
((SELECT id FROM routines WHERE title = 'Aislamiento de Brazos en Máquina (Bíceps y Tríceps)'), 'Extensión de Tríceps en Polea Alta con Cuerda', 4, 12, 60),
((SELECT id FROM routines WHERE title = 'Aislamiento de Brazos en Máquina (Bíceps y Tríceps)'), 'Curl de Bíceps en Polea Baja con Barra Recta', 4, 12, 60),
((SELECT id FROM routines WHERE title = 'Aislamiento de Brazos en Máquina (Bíceps y Tríceps)'), 'Curl Scott / Predicador en Máquina', 3, 10, 60),
((SELECT id FROM routines WHERE title = 'Aislamiento de Brazos en Máquina (Bíceps y Tríceps)'), 'Press Francés en Máquina / Fondos Asistidos', 3, 12, 60);
   
   
   -- Datos de prueba
   
INSERT INTO users (full_name, email, password, weight_kg, height_cm, fitness_goal) VALUES
('Deyaneira Gutiérrez', 'deyaneira@gmail.com', 'hashed_pass_1', 60.50, 165, 'GAIN_MUSCLE'),
('Carlos Gómez', 'carlos@gmail.com', 'hashed_pass_2', 78.00, 178, 'LOSE_WEIGHT'),
('Mariana López', 'mariana@gmail.com', 'hashed_pass_3', 55.00, 160, 'MAINTAIN');

--  Para left join
INSERT INTO memberships (user_id, plan_type, start_date, expiration_date, amount_paid, status) VALUES
(1, 'FULL_PASS_GYM', '2026-08-01', '2026-08-31', 99900.00, 'ACTIVE'),
(2, 'DIGITAL_HOME_PLAN', '2026-07-15', '2026-08-15', 49900.00, 'ACTIVE');

-- Insertar interacciones de IA de prueba
INSERT INTO ai_chat_history (user_id, user_prompt, ai_response, category) VALUES
(1, '¿Cuánta proteína debo consumir para aumentar masa muscular?', 'Se recomienda entre 1.6g y 2.2g de proteína por kg de peso corporal.', 'NUTRITION'),
(1, '¿Cuál es la mejor máquina para glúteos?', 'La prensa de piernas 45° y la máquina de abductores son muy efectivas.', 'TRAINING'),
(2, '¿Cómo hacer un déficit calórico seguro?', 'Reduce entre 300 y 500 calorías de tu gasto energético total.', 'NUTRITION');
   
