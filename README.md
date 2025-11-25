# NexusOne Research Project Management Platform

## Backend Setup

### Prerequisites

- Java 21
- Maven
- MySQL 8.0+

### Database Setup

1. Create MySQL database:

```sql
CREATE DATABASE nexusone_db;
```

2. Update `backend/src/main/resources/application.properties` with your MySQL credentials:

```properties
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

### Running the Backend

1. Navigate to backend directory:

```bash
cd backend
```

2. Run with Maven:

```bash
./mvnw spring-boot:run
```

Or on Windows:

```bash
mvnw.cmd spring-boot:run
```

The backend will start on `http://localhost:8080`

### API Endpoints

#### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

#### Projects

- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `GET /api/projects/{id}` - Get project by ID
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project
- `POST /api/projects/{id}/researchers` - Assign researcher
- `GET /api/projects/{id}/versions` - Get version history

#### Evaluations

- `POST /api/evaluations` - Submit evaluation
- `GET /api/evaluations/project/{projectId}` - Get project evaluations
- `GET /api/evaluations/my` - Get my evaluations
- `GET /api/evaluations/results/{projectId}` - Get evaluation results

#### Dashboard

- `GET /api/dashboard/metrics` - Get dashboard metrics
- `GET /api/dashboard/activity` - Get recent activity
- `GET /api/dashboard/stats` - Get personal statistics

#### Reports

- `GET /api/reports/project/{projectId}` - Download project PDF
- `GET /api/reports/evaluation/{projectId}` - Download evaluation PDF

## Frontend Setup

### Running the Frontend

The Angular frontend is already configured to connect to the backend.

1. Make sure the backend is running on port 8080

2. Start the Angular dev server (already running):

```bash
ng serve
```

The frontend will be available at `http://localhost:4200`

### Features Implemented

✅ JWT Authentication with role-based access
✅ Project CRUD operations
✅ Researcher assignment to projects
✅ Project version history tracking
✅ Peer evaluation system
✅ Dashboard with metrics and statistics
✅ PDF report generation
✅ Activity audit logging
✅ Caffeine caching for performance

### Default Users

After starting the backend, you can register new users with the following roles:

- RESEARCHER
- EVALUATOR
- ADMIN

### Technology Stack

**Backend:**

- Spring Boot 3.2.0
- Spring Security with JWT
- Spring Data JPA
- MySQL
- Caffeine Cache
- iText PDF

**Frontend:**

- Angular 19
- TypeScript
- RxJS
- Standalone Components
