# DajMiLed Quiz Platform

A cloud-native quiz platform that lets users create, share, and take quizzes with AI-powered question generation and semantic answer evaluation.

---

## Architecture

<!-- Add architecture diagram to docs/architecture.png -->

The platform follows a microservices architecture with four independent services:

| Service | Technology | Port |
|---|---|---|
| Frontend | Next.js 15 + TypeScript | 3000 |
| Backend API | Spring Boot 3.4 + Java 17 | 8080 |
| Evaluation Service | FastAPI + Python 3.11 | 8000 |
| Question Generation Service | FastAPI + Python 3.11 | 8001 |
| Database | PostgreSQL | 5432 |

The backend handles authentication and business logic, delegates answer evaluation to the evaluation service (semantic similarity via `sentence-transformers`), and delegates question generation to the question generation service (Hugging Face models). Secrets are managed via HashiCorp Vault.

---

## Getting Started

### Prerequisites

- Docker
- kubectl + Helm 3
- (Optional) Node.js 20, Java 17, Python 3.11 for local development

### 1. Clone the repository

```bash
git clone https://github.com/DajMiLed/Quiz_platform.git
cd Quiz_platform
```

### 2. Configure environment variables

Copy and fill in the `.env` file:

```bash
cp .env.example .env
```

Key variables:

```env
VAULT_TOKEN=your-vault-token
VAULT_HOST=http://localhost:8200
POSTGRES_USER=quizuser
POSTGRES_PASSWORD=quizpassword
POSTGRES_DB=quizdb
JWT_SECRET=your-jwt-secret
EXPIRATIONMS=86400000
ALLOWED_ORIGINS=http://localhost:3000
```

### 3. Deploy with Kubernetes + Helm

Run the setup script (Linux/macOS):

```bash
chmod +x setup.sh
./setup.sh
```

Or on Windows (PowerShell):

```powershell
.\setup.ps1
```

This script will:
1. Start a local HashiCorp Vault container
2. Create a Kubernetes secret with the Vault token
3. Deploy the full stack via the Helm chart

The application will be available at `http://quiz.localhost`.

### 4. Build Docker images manually (optional)

```bash
# Frontend
docker build -t dajmiled/quiz-frontend:latest ./frontend

# Backend
docker build -t dajmiled/quiz-server:latest ./server

# Evaluation service
docker build -t dajmiled/quiz-evaluation:latest ./evaluation-service

# Question generation service
docker build -t dajmiled/quiz-question-gen:latest ./question-generation-service
```

### 5. Local development (without Kubernetes)

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

**Backend:**

```bash
cd server
./mvnw spring-boot:run
```

**Evaluation service:**

```bash
cd evaluation-service
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Question generation service:**

```bash
cd question-generation-service
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

---

## Technologies & Versions

### Frontend

| Technology | Version |
|---|---|
| Next.js | 15 |
| React | 19.2.4 |
| TypeScript | 5 |
| Tailwind CSS | 4 |
| Node.js (container) | 20-slim |
| lucide-react | 0.511.0 |
| ESLint | 9 |

### Backend

| Technology | Version |
|---|---|
| Java | 17 |
| Spring Boot | 3.4.3 |
| Spring Cloud | 2024.0.0 |
| Maven | 3.9.9 |
| PostgreSQL driver | runtime |
| JJWT | 0.11.5 |
| Lombok | 1.18.30 |
| Eclipse Temurin JRE (container) | 21-alpine |

### Microservices

| Technology | Version |
|---|---|
| Python | 3.11 |
| FastAPI | latest |
| Uvicorn | latest |
| sentence-transformers | latest |
| torch | latest |
| huggingface-hub | latest |

### Infrastructure

| Technology | Version |
|---|---|
| PostgreSQL | latest (Helm) |
| HashiCorp Vault | 1.21.4 |
| Helm | v3 (Chart API v2) |
| Docker | — |

---

## API Endpoints

### Backend — `http://localhost:8080`

#### Authentication

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user account | No |
| `POST` | `/api/auth/login` | Login and receive JWT token | No |

#### Forms

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/forms` | Create a new quiz form | JWT |
| `GET` | `/api/forms` | List all public forms (paginated) | No |
| `GET` | `/api/forms/{id}` | Get a single form with questions and choices | No |
| `GET` | `/api/forms/me` | Get the current user's created forms (paginated) | JWT |

#### Questions

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/questions` | Create a question within a form | No |

#### Choices

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/choices` | Create answer choices for a question | No |

#### Correct Answers

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/correct-answers` | Assign a correct answer to a question | No |

#### Submissions

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/submissions` | Submit a form/quiz with user answers | JWT |

#### AI Form Generation

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/ai-form` | Generate quiz form with AI-powered questions from context | JWT |

---

### Evaluation Service — `http://localhost:8000`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check |
| `POST` | `/evaluate` | Evaluate an open-ended answer |

**`POST /evaluate` request body:**

```json
{
  "context": "string",
  "question": "string",
  "answer": "string"
}
```

**Response:**

```json
{
  "score": 0.87,
  "feedback": "string",
  "is_correct": true
}
```

---

### Question Generation Service — `http://localhost:8001`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check |
| `POST` | `/generate` | Generate quiz questions from context |

**`POST /generate` request body:**

```json
{
  "context": "string",
  "num_questions": 3,
  "difficulty": "intermediate"
}
```

**Response:**

```json
{
  "questions": [
    {
      "question_text": "string",
      "options": ["A", "B", "C", "D"],
      "correct_answer": "A",
      "explanation": "string"
    }
  ]
}
```

---

## Project Structure

```
DajMiLed-Quiz_platform/
│
├── frontend/                   # Next.js frontend
│   ├── src/
│   │   ├── app/                # Next.js App Router pages
│   │   │   ├── (auth)/         # Login & register pages
│   │   │   ├── dashboard/      # User dashboard
│   │   │   ├── quiz/           # Quiz taking page
│   │   │   └── lab/            # Lab/sandbox page
│   │   ├── components/         # Reusable UI components
│   │   └── services/           # API client services
│   └── Dockerfile
│
├── server/                     # Spring Boot backend
│   └── src/main/java/com/formus/server/
│       ├── auth/               # Registration & login controllers
│       ├── forms/              # Form CRUD
│       ├── questions/          # Question management
│       ├── choices/            # Answer choices
│       ├── jwt/                # JWT filter & utilities
│       └── config/             # Security, CORS, Vault config
│   └── Dockerfile
│
├── evaluation-service/         # FastAPI — semantic answer evaluation
│   ├── app/
│   │   └── main.py             # /evaluate endpoint
│   └── Dockerfile
│
├── question-generation-service/ # FastAPI — AI question generation
│   ├── app/
│   │   └── main.py             # /generate endpoint
│   └── Dockerfile
│
├── helm/                       # Kubernetes Helm chart
│   ├── Chart.yaml
│   ├── values.yaml             # Default values
│   ├── values-dev.yaml         # Dev environment overrides
│   └── templates/              # K8s manifests
│
├── .github/                    # CI/CD workflows
├── setup.sh                    # Linux/macOS cluster setup script
├── setup.ps1                   # Windows cluster setup script
└── docs/                       # Architecture diagrams and assets
```

---

## License

See [LICENSE](./LICENSE).
