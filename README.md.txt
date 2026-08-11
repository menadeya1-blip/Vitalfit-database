 VitalFit - Base de Datos Relacional

Este repositorio contiene la arquitectura de base de datos, el esquema SQL, los datos de prueba y las consultas para la plataforma **VitalFit**.

 Tecnologías Utilizadas
* Motor de BBDD: MySQL 8.0+
* IDE Recomendado: MySQL Workbench
* Codificación: UTF-8 (`utf8mb4_unicode_ci`)
* Idioma del código: Inglés técnico

 Tablas Principales
1. users: Gestión de perfiles de usuario, credenciales y métricas físicas.
2. routines: Sesiones de entrenamiento para gimnasio y casa.
3. exercises: Ejercicios individuales asignados a cada rutina.
4. memberships: Registro de suscripciones, pagos y estado del plan.
5. ai_chat_history: Historial de consultas y respuestas con la IA de entrenamiento.

 Cómo Usar Este Proyecto
1. Ejecuta el archivo `01_schema.sql` en MySQL Workbench para crear la base de datos y sus tablas.
2. Ejecuta el archivo `02_seed_data.sql` para cargar los datos de prueba iniciales.