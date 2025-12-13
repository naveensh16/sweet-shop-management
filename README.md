# 🍬 Sweet Shop Management System

A full-stack application for managing a sweet shop with inventory, user authentication, and role-based access control.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Screenshots](#screenshots)
- [My AI Usage](#my-ai-usage)

## ✨ Features

### User Management
- 🔐 User registration and login with JWT authentication
- 👤 Role-based access control (Admin/User)
- 🔒 Protected API endpoints

### Sweet Management
- ➕ Add new sweets (Admin only)
- 📋 View all available sweets
- 🔍 Search sweets by name, category, or price range
- ✏️ Update sweet details (Admin only)
- 🗑️ Delete sweets (Admin only)

### Inventory Management
- 🛒 Purchase sweets (decreases quantity)
- 📦 Restock sweets (Admin only)
- 📊 Real-time quantity tracking

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Testing**: pytest, pytest-cov
- **Validation**: Pydantic

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Testing**: Jest, React Testing Library

## 📦 Prerequisites

- Python 3.11 or higher
- Node.js 18 or higher
- PostgreSQL 14 or higher
- Git

## 🚀 Setup Instructions

### Backend Setup

1. **Navigate to backend directory**
```powershell
cd "c:\Users\Naveen\OneDrive\Desktop\Assignment\Sweet Shop\backend"
```

2. **Create virtual environment**
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

3. **Install dependencies**
```powershell
pip install -r requirements.txt
```

4. **Setup database**
```powershell
# Create PostgreSQL database
# Update .env file with your database credentials
cp .env.example .env
```

5. **Run migrations**
```powershell
python -m alembic upgrade head
```

6. **Create admin user (optional)**
```powershell
python create_admin.py
```

7. **Start backend server**
```powershell
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: http://localhost:8000
API Documentation: http://localhost:8000/docs

### Frontend Setup

1. **Navigate to frontend directory**
```powershell
cd "c:\Users\Naveen\OneDrive\Desktop\Assignment\Sweet Shop\frontend"
```

2. **Install dependencies**
```powershell
npm install
```

3. **Configure environment**
```powershell
cp .env.example .env
# Update REACT_APP_API_URL if needed
```

4. **Start development server**
```powershell
npm start
```

Frontend will be available at: http://localhost:3000

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

### Sweet Endpoints (Protected)

#### Get All Sweets
```http
GET /api/sweets
Authorization: Bearer {token}
```

#### Search Sweets
```http
GET /api/sweets/search?name=chocolate&category=candy&min_price=1&max_price=10
Authorization: Bearer {token}
```

#### Add Sweet (Admin Only)
```http
POST /api/sweets
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Chocolate Bar",
  "category": "candy",
  "price": 2.99,
  "quantity": 100,
  "description": "Delicious milk chocolate"
}
```

#### Update Sweet (Admin Only)
```http
PUT /api/sweets/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Name",
  "price": 3.99
}
```

#### Delete Sweet (Admin Only)
```http
DELETE /api/sweets/{id}
Authorization: Bearer {token}
```

### Inventory Endpoints (Protected)

#### Purchase Sweet
```http
POST /api/sweets/{id}/purchase
Authorization: Bearer {token}
Content-Type: application/json

{
  "quantity": 2
}
```

#### Restock Sweet (Admin Only)
```http
POST /api/sweets/{id}/restock
Authorization: Bearer {token}
Content-Type: application/json

{
  "quantity": 50
}
```

## 🧪 Testing

### Backend Tests

```powershell
# Run all tests with coverage
cd backend
pytest --cov=app --cov-report=html --cov-report=term

# Run specific test file
pytest tests/test_auth.py -v

# Run with specific markers
pytest -m "auth" -v
```

Test coverage report will be generated in `backend/htmlcov/index.html`

### Frontend Tests

```powershell
# Run all tests
cd frontend
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

## 📸 Screenshots

*(Screenshots will be added after implementation)*

### Landing Page
![Landing Page](docs/screenshots/landing.png)

### Login Page
![Login](docs/screenshots/login.png)

### Sweet Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### Admin Panel
![Admin Panel](docs/screenshots/admin.png)

## 🤖 My AI Usage

### AI Tools Used

I used **GitHub Copilot Chat** as my primary AI assistant throughout this project development.

### How I Used AI

#### 1. **Project Architecture & Planning** (15% of development time)
- **Task**: Brainstorming the overall project structure
- **AI Help**: Asked Copilot to suggest best practices for structuring a FastAPI + React application
- **My Input**: Evaluated suggestions and chose the architecture that best fit TDD principles
- **Example Prompt**: "What's the best folder structure for a FastAPI project with TDD approach?"

#### 2. **Test Generation** (30% of development time)
- **Task**: Writing comprehensive unit and integration tests
- **AI Help**: Used Copilot to generate test boilerplate and edge cases
- **My Input**: Reviewed each test, added domain-specific test cases, and ensured proper assertions
- **Example**: Copilot suggested pytest fixtures for database setup; I customized them for our Sweet model
- **Commits**: All test-related commits include AI co-authorship

#### 3. **Boilerplate Code** (20% of development time)
- **Task**: Creating CRUD operations and API endpoints
- **AI Help**: Generated initial controller and service layer code
- **My Input**: Added custom validation logic, error handling, and business rules
- **Example**: Copilot created the basic `/api/sweets` endpoint; I added role-based access control and inventory validation

#### 4. **Database Models & Relationships** (10% of development time)
- **Task**: Designing SQLAlchemy models with proper relationships
- **AI Help**: Suggested model structure and relationships
- **My Input**: Refined constraints, indexes, and added custom validators

#### 5. **Frontend Components** (25% of development time)
- **Task**: Building React components with TypeScript
- **AI Help**: Generated component structure and TypeScript interfaces
- **My Input**: Implemented custom hooks, state management, and UX enhancements
- **Example**: Copilot created basic form components; I added form validation and error states

#### 6. **Debugging & Troubleshooting** (10% of development time)
- **Task**: Fixing bugs and test failures
- **AI Help**: Asked Copilot to explain error messages and suggest fixes
- **My Input**: Analyzed root causes and implemented proper solutions

### Reflection on AI Impact

#### Positive Impacts
- **Speed**: AI accelerated boilerplate generation by ~40%, allowing more time for business logic
- **Best Practices**: Copilot suggested patterns I wasn't familiar with (e.g., pytest parametrize)
- **Test Coverage**: AI helped identify edge cases I might have missed
- **Documentation**: Generated initial API documentation structure

#### Challenges
- **Context Understanding**: AI sometimes suggested generic solutions that didn't fit our specific requirements
- **Over-reliance Risk**: Had to consciously review every suggestion to avoid blindly accepting code
- **Test Quality**: AI-generated tests sometimes lacked domain-specific assertions

#### What I Learned
- AI is excellent for **accelerating known patterns** but requires **human judgment** for architecture decisions
- **TDD discipline** is crucial - AI can generate tests, but understanding "why" remains human
- **Code review** of AI suggestions is as important as reviewing peer code
- AI works best when given **clear, specific prompts** with context

### AI Transparency Commitment

Every commit where AI tools contributed includes proper co-authorship attribution:
```
Co-authored-by: GitHub Copilot <copilot@github.com>
```

I'm prepared to discuss any part of this codebase in detail and explain the reasoning behind architectural decisions, whether AI-assisted or not.

## 📝 License

MIT License - See LICENSE file for details

## 👨‍💻 Author

**Naveen**
- GitHub: [@naveensh16](https://github.com/naveensh16)
