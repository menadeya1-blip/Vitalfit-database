-- =====================================================================
-- VitalFit - Consultas de prueba (ejecutar después de 02_seed_data.sql)
-- =====================================================================
USE fitvital_db;

-- INNER JOIN: rutinas con sus ejercicios (solo coincidencias)
SELECT r.title AS routine_title, r.location_type, r.target_muscle_group,
       e.name AS exercise_name, e.sets, e.reps, e.rest_seconds
FROM routines r
INNER JOIN exercises e ON r.id = e.routine_id
ORDER BY r.title;

-- LEFT JOIN: todos los usuarios, tengan o no membresía
SELECT u.id AS user_id, u.full_name, u.email,
       m.plan_type, m.status AS membership_status, m.expiration_date
FROM users u
LEFT JOIN memberships m ON u.id = m.user_id;

-- RIGHT JOIN: todas las rutinas, tengan o no ejercicios
SELECT e.name AS exercise_name, e.sets, e.reps, r.title AS routine_title, r.location_type
FROM exercises e
RIGHT JOIN routines r ON e.routine_id = r.id;

-- GROUP BY: ejercicios por rutina
SELECT r.title AS routine_title, r.location_type, COUNT(e.id) AS total_exercises
FROM routines r
LEFT JOIN exercises e ON r.id = e.routine_id
GROUP BY r.id, r.title, r.location_type;

-- Ingresos y promedio por tipo de membresía
SELECT plan_type, COUNT(id) AS total_subscriptions,
       SUM(amount_paid) AS total_revenue, AVG(amount_paid) AS average_price
FROM memberships
GROUP BY plan_type;

-- Consultas a la IA por usuario
SELECT u.full_name, u.email, COUNT(ai.id) AS total_ai_queries
FROM users u
INNER JOIN ai_chat_history ai ON u.id = ai.user_id
GROUP BY u.id, u.full_name, u.email;
