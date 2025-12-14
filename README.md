# 🍬 Sweet Shop Management System

A modern, full-stack application for managing a sweet shop with inventory, user authentication, and role-based access control. Built with contemporary design principles and beautiful UI/UX.

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
- 🔒 Protected API endpoints with secure token management

### Sweet Management
- ➕ Add new sweets with image upload (Admin only)
- 📋 View all available sweets in modern grid/list layouts
- 🔍 Advanced search with filters (name, category, price range, stock status)
- ✏️ Update sweet details with live preview (Admin only)
- 🗑️ Delete sweets with confirmation dialogs (Admin only)

### Inventory Management
- 🛒 Purchase sweets with quantity selection
- 📦 Restock sweets with admin controls
- 📊 Real-time quantity tracking with visual indicators
- ⚠️ Low stock warnings and out-of-stock badges
- 📈 Admin dashboard with inventory statistics

### Modern UI/UX
- 🎨 Beautiful gradient backgrounds and modern color schemes
- 🌓 Grid and list view toggles
- ✨ Smooth animations and transitions
- 📱 Fully responsive design for mobile and desktop
- 🎯 Interactive cards with hover effects
- 🔔 Toast notifications for user feedback

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI 0.109.0 (Python 3.11+)
- **Database**: SQLite 3 (Development) / PostgreSQL (Production)
- **ORM**: SQLAlchemy 2.0.25
- **Authentication**: JWT (JSON Web Tokens)
- **Testing**: pytest, pytest-cov
- **Validation**: Pydantic
- **CORS**: FastAPI CORS middleware

### Frontend
- **Framework**: React 18
- **Styling**: Tailwind CSS 3 (Modern utility-first CSS)
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Icons**: Emoji-based for better compatibility
- **Testing**: Jest, React Testing Library

## 📦 Prerequisites

- Python 3.11 or higher
- Node.js 18 or higher
- Git
- SQLite 3 (included with Python)

## 🚀 Setup Instructions

### Quick Start (Using Setup Script)

```powershell
cd "c:\Users\Naveen\OneDrive\Desktop\Assignment\Sweet Shop"
.\setup.ps1
```

The setup script will:
1. Install backend dependencies
2. Install frontend dependencies
3. Create SQLite database
4. Start both backend and frontend servers

### Manual Setup

#### Backend Setup

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

4. **Configure environment**
```powershell
# Create .env file or use existing one
# Default configuration uses SQLite: sqlite:///./sweetshop.db
# For PostgreSQL, update DATABASE_URL in .env
```

5. **Start backend server**
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

### 🏠 Landing Page
Modern hero section with gradient backgrounds and animated elements.

### 🔐 Authentication
Clean login/register forms with real-time validation and error feedback.

### 🍬 Sweet Dashboard
- Beautiful grid and list view options
- Advanced search and filtering
- Animated sweet cards with hover effects
- Real-time stock indicators
- Category-based emoji icons

### 👨‍💼 Admin Panel
- Comprehensive inventory management table
- Statistics dashboard with visual metrics
- Modal-based CRUD operations
- Image preview in forms
- Toast notifications for actions
- Color-coded stock status indicators

## 🤖 My AI Usage

### AI Tools Used

I used **GitHub Copilot** and **GitHub Copilot Chat** as my primary AI assistants throughout this project development and modernization.

### How I Used AI

#### 1. **Project Architecture & Planning** (15% of development time)
- **Task**: Brainstorming the overall project structure and modern UI patterns
- **AI Help**: Asked Copilot to suggest best practices for structuring a FastAPI + React application with modern design
- **My Input**: Evaluated suggestions and chose the architecture that best fit TDD principles and contemporary UX standards
- **Example Prompt**: "What's the best folder structure for a FastAPI project with TDD approach and React with Tailwind CSS?"

#### 2. **UI/UX Modernization** (35% of modernization time)
- **Task**: Transforming basic UI to modern, gradient-based design with animations
- **AI Help**: Generated Tailwind CSS classes for gradients, shadows, and animations
- **My Input**: Refined color schemes, adjusted animations, and ensured accessibility
- **Example**: AI suggested gradient combinations; I fine-tuned for brand consistency
- **Components Updated**: Dashboard, SweetCard, AdminPanel with modern card designs, hover effects, and responsive layouts

#### 3. **Test Generation** (25% of development time)
- **Task**: Writing comprehensive unit and integration tests
- **AI Help**: Used Copilot to generate test boilerplate and edge cases
- **My Input**: Reviewed each test, added domain-specific test cases, and ensured proper assertions
- **Example**: Copilot suggested pytest fixtures for database setup; I customized them for our Sweet model
- **Commits**: All test-related commits include AI co-authorship

#### 4. **Component Refactoring** (20% of modernization time)
- **Task**: Refactoring components for better performance and maintainability
- **AI Help**: Suggested React hooks patterns and state management improvements
- **My Input**: Implemented custom logic for view modes, notifications, and loading states
- **Example**: AI generated notification toast component; I added auto-dismiss and animation

#### 5. **Boilerplate Code** (15% of development time)
- **Task**: Creating CRUD operations and API endpoints
- **AI Help**: Generated initial controller and service layer code
- **My Input**: Added custom validation logic, error handling, and business rules
- **Example**: Copilot created the basic `/api/sweets/search` endpoint; I added advanced filtering and pagination

#### 6. **Database Models & Relationships** (10% of development time)
- **Task**: Designing SQLAlchemy models with proper relationships
- **AI Help**: Suggested model structure and relationships
- **My Input**: Refined constraints, indexes, and added custom validators
- **Migration**: Converted from PostgreSQL to SQLite for easier development setup

#### 7. **Responsive Design Implementation** (15% of modernization time)
- **Task**: Making the application fully responsive across devices
- **AI Help**: Generated responsive Tailwind classes and breakpoints
- **My Input**: Tested on various screen sizes and adjusted layouts
- **Result**: Mobile-first design with optimized tablet and desktop views

#### 8. **Debugging & Troubleshooting** (10% of development time)
- **Task**: Fixing bugs, test failures, and deployment issues
- **AI Help**: Asked Copilot to explain error messages and suggest fixes
- **My Input**: Analyzed root causes and implemented proper solutions
- **Example**: Database migration from PostgreSQL to SQLite for development simplicity

### Reflection on AI Impact

#### Positive Impacts
- **Speed**: AI accelerated boilerplate generation and UI modernization by ~50%, allowing more time for business logic and UX refinement
- **Best Practices**: Copilot suggested modern patterns (CSS Grid, Flexbox, React hooks) I wasn't fully familiar with
- **Design Consistency**: AI helped maintain consistent styling across components with Tailwind utilities
- **Test Coverage**: AI helped identify edge cases I might have missed
- **Accessibility**: AI suggested ARIA labels and semantic HTML improvements

#### Challenges
- **Context Understanding**: AI sometimes suggested generic solutions that didn't fit our specific requirements
- **Over-reliance Risk**: Had to consciously review every suggestion to avoid blindly accepting code
- **Design Creativity**: AI excels at technical implementation but human creativity drives unique UX decisions
- **Test Quality**: AI-generated tests sometimes lacked domain-specific assertions

#### What I Learned
- AI is excellent for **accelerating known patterns** and **modernization tasks** but requires **human judgment** for architecture and UX decisions
- **TDD discipline** is crucial - AI can generate tests, but understanding "why" remains human
- **Code review** of AI suggestions is as important as reviewing peer code
- AI works best when given **clear, specific prompts** with context about design goals
- **Iterative refinement** - AI generates good starting points; humans perfect them

### AI Transparency Commitment

Every commit where AI tools contributed includes proper co-authorship attribution:
```
Co-authored-by: GitHub Copilot <copilot@github.com>
```

**Percentage Breakdown:**
- **Human-written code**: 40% (Business logic, architecture decisions, custom hooks)
- **AI-assisted code**: 45% (Component structure, Tailwind classes, CRUD boilerplate)
- **Pure AI suggestions (reviewed & refined)**: 15% (Test templates, utility functions)

I'm prepared to discuss any part of this codebase in detail and explain the reasoning behind architectural decisions, design choices, and implementation strategies - whether AI-assisted or not.

## 📝 License

MIT License - See LICENSE file for details

## 👨‍💻 Author

**Naveen**
- GitHub: [@naveensh16](https://github.com/naveensh16)
