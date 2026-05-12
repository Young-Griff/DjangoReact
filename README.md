# Django-React Integration Example

A small school administration demo that pairs a Django REST API with a React single-page app. The backend models departments, employees, courses, and related school data; the frontend consumes the API for browsing and for authenticated employee CRUD.

## Table of Contents

- [Abstract](#abstract)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Logging In](#logging-in)
- [API Overview](#api-overview)
- [Contact](#contact)

### Abstract

This project presents a barebones example website for a hypothetical school. The app consists of a React-based frontend connected to a Django-based backend through a REST API built on the Django REST Framework library. Simple API views are implemented with corresponding frontend pages for each of the four key CRUD operations. Authentication is implemented using the rest framework SessionAuthentication. While additional security is provided through use of CORS limitations and CSRF token use on forms.

Frontend routes include home, department listings, employee management, and add-role flows. The API lives under `/api/` on the Django dev server (port 8000 by default).

## Tech Stack

| Layer    | Technologies                                                     |
| -------- | ---------------------------------------------------------------- |
| Backend  | Django 6, Django REST Framework, django-cors-headers, SQLite     |
| Frontend | React 19, TypeScript, Vite, React Router, Axios, React Hook Form |
| Auth     | Django session authentication with CSRF for unsafe requests      |

## Project Structure

```text
DjangoReact/
├── backend/          # Django project and school app
│   ├── backend/      # Settings, root URLs, WSGI/ASGI
│   ├── school/       # Models, serializers, API views, migrations
│   ├── scripts/      # Optional dev helpers (e.g. seed users)
│   ├── manage.py
│   └── requirements.txt
└── frontend/         # Vite + React SPA
    ├── src/
    └── package.json
```

## Prerequisites

- Python 3 with `venv` and `pip`
- Node.js and npm
- Two terminal sessions for local development (API + Vite dev server)

## Getting Started

From the repository root, create and activate a virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate          # Linux / macOS
# .\venv\Scripts\Activate.ps1     # Windows PowerShell
```

Install backend dependencies, apply migrations, and install frontend packages:

```bash
pip install -r backend/requirements.txt
cd backend && python manage.py migrate && cd ..
cd frontend && npm install
```

Run the API and the SPA in separate terminals:

```bash
# Terminal 1 — Django (default http://127.0.0.1:8000)
cd backend && python manage.py runserver

# Terminal 2 — Vite (default http://localhost:5173)
cd frontend && npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`). The app sets the API base URL from the page hostname so session cookies match Django (`localhost` vs `127.0.0.1`); use the same host for both servers during development.

## Logging In

The database (`backend/db.sqlite3`) is already populated with a set of users and employee roles. The base super user can be used for access with the following credentials:

```
username: super
password: pw
```

Additionally, non-super users can be used to login with their username and the password `Test_123!`. While all users currently have complete access, I am to implment group-based restrictions to what views certain classes of users can access.
Seeded accounts use password `Test_123!` (see `backend/scripts/_seed_test_users.py` for usernames).

## API Overview

Base path: `http://<host>:8000/api/`

| Endpoint                     | Methods   | Notes                          |
| ---------------------------- | --------- | ------------------------------ |
| `login/`                     | POST      | Session login (AllowAny)       |
| `logout/`                    | POST      | Session logout (authenticated) |
| `user-status/`               | GET       | Whether a session is active    |
| `get-csrf/`                  | GET       | Sets CSRF cookie for the SPA   |
| `departments/`               | GET       | List departments               |
| `department-courses/<dept>/` | GET       | Courses for a department       |
| `employees/`                 | GET       | Worker listings                |
| `users/`                     | GET       | School users                   |
| `get-roles/`                 | GET       | Worker role choices            |
| `add-employee/`              | POST, PUT | Add/Edit worker role           |
| `remove-role/<id>`           | DELETE    | Remove worker role             |

Django admin is available at `/admin/` when a staff user exists.

## Contact

Questions or suggestions:

- Thomas Fitzgerald
- tf350@scarletmail.rutgers.edu
