# School Management System

## Stack
- **Backend**: Laravel 13 + Sanctum (REST API) — `backend/`
- **Frontend**: React + Vite + Tailwind CSS — `frontend/`
- **Database**: MySQL

---

## Backend Setup

```bash
cd backend

# 1. Install dependencies (already done)
composer install

# 2. Configure .env — update DB credentials
#    DB_DATABASE=school_management
#    DB_USERNAME=your_user
#    DB_PASSWORD=your_password

# 3. Create the MySQL database
mysql -u root -p -e "CREATE DATABASE school_management;"

# 4. Run migrations and seeder
php artisan migrate 
php artisan db:seed

# 5. Start the API server
php artisan serve
# Runs at http://localhost:8000
```

Default admin login:
- Email: `admin@school.com`
- Password: `password`

---

## Frontend Setup

```bash
cd frontend

# Install dependencies (already done)
npm install

# Start dev server
npm run dev
# Runs at http://localhost:5173
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/login` | Login |
| POST | `/api/logout` | Logout |
| GET | `/api/me` | Current user |
| GET/POST | `/api/students` | Student CRUD |
| GET/POST | `/api/teachers` | Teacher CRUD |
| GET/POST | `/api/classes` | Class CRUD |
| GET/POST | `/api/sections` | Section CRUD |
| GET/POST | `/api/subjects` | Subject CRUD |
| GET/POST | `/api/attendance` | Attendance |
| GET | `/api/attendance/report` | Attendance report |
| GET/POST | `/api/exams` | Exam CRUD |
| GET/POST | `/api/marks` | Marks CRUD |
| GET/POST | `/api/fees` | Fee structures |
| GET/POST | `/api/fee-payments` | Fee payments |
| GET/POST | `/api/notices` | Notices |
| GET/POST | `/api/timetables` | Timetable |
| GET | `/api/report-card/{student}` | Report card JSON |
| GET | `/api/report-card/{student}/pdf` | Report card PDF |
| GET | `/api/dashboard/admin` | Admin dashboard stats |
| GET | `/api/dashboard/teacher` | Teacher dashboard |
| GET | `/api/dashboard/student` | Student dashboard |
| GET | `/api/dashboard/parent` | Parent dashboard |
