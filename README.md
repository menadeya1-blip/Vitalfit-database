# VitalFit

VitalFit es una aplicación para gimnasios que une el entrenamiento en sala, el registro de series y el control nutricional, para mejorar la retención de socios y el progreso de los atletas.

## Equipo
- **Deyaneira Gutiérrez Mena:** Backend, base de datos y arquitectura. Scrum Master.
- **Wilkaris Castrillón:** Frontend (HTML, CSS y JavaScript).

## Tecnologías
- **Backend:** Java 21, Spring Boot 4.1.1, Spring Data JPA, Spring Security (BCrypt), Maven.
- **Base de datos:** MySQL / MariaDB (XAMPP).
- **Frontend:** HTML5, CSS3 y JavaScript (consume la API con `fetch`).
- **Control de versiones:** Git y GitHub.

## Cómo ejecutar el proyecto
1. Enciende **MySQL** en el panel de XAMPP.
2. Crea la base de datos ejecutando `01_schema.sql` en phpMyAdmin, y luego `02_seed_data.sql` si quieres datos de prueba.
3. Abre el backend desde IntelliJ (`VitalfitBackendApplication`) o con `./mvnw spring-boot:run`. Queda en `http://localhost:8080`.
4. Abre `Proyecto gimnasio/principal_index/index.html` en el navegador.

La contraseña de la base de datos se toma de la variable de entorno `DB_PASSWORD`. Por defecto está vacía, que es lo habitual en XAMPP.

## Estructura del repositorio
- `src/`: código del backend (controladores, servicios, repositorios y entidades).
- `Proyecto gimnasio/`: código del frontend.
  - `principal_index/`: páginas HTML.
  - `javascript/`: `api.js` (cliente de la API), `main.js` (registro) y `app.js` (inicio de sesión).
- `01_schema.sql`: creación de tablas.
- `02_seed_data.sql`: datos de prueba.
- `03_queries.sql`: consultas de ejemplo.

## Endpoints actuales (`/api/auth`)
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/register` | Registro de usuario (201) |
| POST | `/login` | Inicio de sesión |
| PUT | `/onboarding/{id}` | Peso, estatura y objetivo |
| POST | `/users/{id}/parental-consent` | Consentimiento de padre o tutor para menores |
| DELETE | `/users/{id}` | Eliminar cuenta (requiere email y contraseña en el cuerpo) |

Los errores responden `{"message": "..."}`.

## Organización del trabajo
- El backlog, las historias de usuario y los sprints se llevan en **Jira**: proyecto `PIV` (Proyecto integrador - Vitalfit).
- Cada rama lleva la clave de la tarea de Jira, por ejemplo `feature/PIV-27-formulario-series`.
- **No se hace push directo a `main`.** Todo cambio entra por una rama y un Pull Request, que revisa Deyaneira.

## Estado actual
- **Sprint 2 en curso** en Jira (PIV Sprint 2).
- **Versión:** v0.1.0-alpha
