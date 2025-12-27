# AI Trading Platform

A full-stack cryptocurrency trading platform with AI-powered trading bots, real-time market data, and automated trade execution. Built with Next.js, Spring Boot, and Azure Functions.

## ✨ Key Features

### 🤖 AI Trading Bots

- Browse and subscribe to AI-powered trading bots with real-time performance metrics
- Track bot performance with PnL, ROI, and max drawdown analytics
- Automated trade execution based on Python bot signals
- Bot subscription management with VNPay payment integration

### 📊 Live Trading & Market Data

- Real-time TradingView charts with interactive widgets
- Live cryptocurrency market overview and ticker tape
- Multi-coin wallet management with transaction history
- Real-time WebSocket updates for market movements

### 💰 Wallet & Payments

- Multi-cryptocurrency wallet support
- Secure payment processing via VNPay integration
- Transaction history tracking
- Deposit and withdrawal management

### 🔐 Authentication & Security

- JWT-based authentication with refresh tokens
- Social OAuth integration (Google)
- Email verification system
- Role-based access control (User/Admin)

### 👨‍💼 Admin Dashboard

- Bot creation and management interface
- User management and monitoring
- System-wide analytics and metrics
- Performance tracking across all bots

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 15 (App Router) with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, shadcn/ui
- **State Management**: Zustand, TanStack Query
- **Charts**: TradingView Widgets, Recharts, ApexCharts
- **Forms**: React Hook Form + Zod validation
- **Authentication**: NextAuth v5

### Backend

- **Framework**: Spring Boot 3.5.6
- **Language**: Java 21
- **Database**: MySQL (local), Azure SQL (production)
- **Security**: Spring Security + OAuth2 Resource Server
- **ORM**: Spring Data JPA with MapStruct
- **API Documentation**: SpringDoc OpenAPI 3
- **Queue**: Azure Storage Queue

### Cloud & DevOps

- **Serverless**: Azure Functions (Java)
- **Database**: MySQL 8.0 (Docker), Azure SQL
- **File Storage**: Cloudinary
- **Payment Gateway**: VNPay
- **Build Tools**: Gradle (backend), Maven (Azure Functions), pnpm (frontend)

## 📦 Installation & Setup

### Prerequisites

- **Node.js** 20+ and pnpm
- **Java** 21 (JDK)
- **MySQL** 8.0
- **Docker** (optional, for MySQL container)
- **Azure Functions Core Tools** (for local function development)

### 1. Clone Repository

```bash
git clone <repository-url>
cd Trade_Web_App
```

### 2. Database Setup

**Option A: Using Docker**

```bash
cd server
docker-compose up -d
```

**Option B: Manual MySQL Setup**

```sql
CREATE DATABASE trade_app;
CREATE USER 'root'@'localhost' IDENTIFIED BY 'root';
GRANT ALL PRIVILEGES ON trade_app.* TO 'root'@'localhost';
```

### 3. Backend Setup (Spring Boot)

```bash
cd server

# Configure application.properties
# Create src/main/resources/application.properties with:
# - Database connection
# - JWT secret keys
# - Email server settings
# - Azure queue connection

# Build and run
./gradlew bootRun
```

Backend will run on `http://localhost:8080`

### 4. Frontend Setup (Next.js)

```bash
cd client
pnpm install

# Configure environment variables
# Create .env.local with:
# - NEXTAUTH_SECRET
# - NEXTAUTH_URL
# - API_BASE_URL

# Run development server
pnpm dev
```

Frontend will run on `http://localhost:3000`

### 5. Azure Functions Setup (Optional)

```bash
cd ingestion
mvn clean package

# Configure local.settings.json with:
# - AzureWebJobsStorage connection string

# Run locally
cd target/azure-functions/ingestion-function
func host start
```

## 🚀 Running the Application

1. **Start MySQL** (if using Docker):

   ```bash
   cd server && docker-compose up -d
   ```

2. **Start Backend**:

   ```bash
   cd server && ./gradlew bootRun
   ```

3. **Start Frontend**:

   ```bash
   cd client && pnpm dev
   ```

4. **Access the Application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - API Docs: http://localhost:8080/swagger-ui.html

## 📁 Project Structure

```
├── client/              # Next.js frontend application
│   ├── app/            # App router pages and layouts
│   ├── actions/        # Server actions
│   ├── backend/        # API client functions
│   ├── components/     # Reusable UI components
│   └── hooks/          # Custom React hooks
├── server/             # Spring Boot backend
│   └── src/main/java/  # Java source code
│       └── feature/    # Feature modules (auth, bots, wallet, etc.)
├── ingestion/          # Azure Functions for webhooks
└── docs/               # API documentation
```
