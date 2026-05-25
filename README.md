# AI-Powered Test Case Generator

A full-stack platform that intelligently generates test cases using AI, repository context, and historical generation memory. Built with React, Node.js, Express, MongoDB, and Amazon Bedrock API.

## 🚀 Project Overview

TestCase is an intelligent testing assistant that:
- **Analyzes repositories** to understand project structure, frameworks, and architecture
- **Generates intelligent test cases** using AI with contextual awareness
- **Learns from history** through embedding-based semantic retrieval
- **Provides AI-assisted QA** with an interactive chat assistant
- **Exports in multiple formats** (Markdown, PDF, JSON)

## 🏗️ Tech Stack

### Frontend
- **React** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **Zustand** - State management

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Amazon Bedrock** - AI engine
- **AWS SDK** - AWS services integration

## ✨ Core Features

### 🔐 Authentication
- User signup and login
- JWT token-based authentication
- Protected routes and persistent sessions

### 📦 Project Management
- Create and manage projects
- Upload repositories as ZIP files
- Connect GitHub repositories
- View saved test generations
- Manage project workspaces

### 📂 Repository Analysis
- Scan and analyze repository files
- Auto-detect frontend frameworks
- Auto-detect backend frameworks
- Identify API routes and database models
- Generate architecture summaries

### 🤖 AI Test Generation
- Generate unit tests
- Generate integration tests
- Generate API tests
- Generate edge-case tests
- Validate test coverage
- Support for custom testing instructions

### 🧠 Memory & Embeddings
- Store all generated test cases
- Generate embeddings for semantic similarity
- Retrieve similar historical generations
- Continuously improve AI outputs through context

### 💬 AI Chat Assistant
- Explain generated tests
- Generate additional edge cases
- Improve assertions
- Identify missing tests
- Explain coverage gaps
- Project-aware context

### 📤 Export Options
- Markdown export
- PDF export
- JSON export
- Copy-to-clipboard functionality

## 📁 Project Structure

```
TestCase/
├── client/                    # Frontend (React + Vite)
│   ├── src/
│   │   ├── api/              # API integration
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── store/            # Zustand stores
│   │   ├── hooks/            # Custom hooks
│   │   ├── layouts/          # Layout components
│   │   ├── routes/           # Route configuration
│   │   └── utils/            # Utility functions
│   └── package.json
│
├── server/                    # Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/           # Configuration files
│   │   ├── routes/           # API routes
│   │   ├── controllers/      # Request handlers
│   │   ├── services/         # Business logic
│   │   ├── models/           # MongoDB schemas
│   │   ├── middleware/       # Express middleware
│   │   ├── utils/            # Utility functions
│   │   └── index.js          # Server entry point
│   └── package.json
│
├── spec.md                    # Project specification
└── README.md                  # This file
```

## 🗄️ Database Schema

### Users
```javascript
{
  name: String,
  email: String,
  password: String (hashed),
  createdAt: Date
}
```

### Projects
```javascript
{
  userId: ObjectId,
  projectName: String,
  repositoryUrl: String,
  repositorySummary: String,
  detectedTechnologies: [String],
  createdAt: Date
}
```

### Generations
```javascript
{
  projectId: ObjectId,
  generationType: String,
  generatedContent: String,
  qualityScore: Number,
  feedback: String,
  createdAt: Date
}
```

### Embeddings
```javascript
{
  projectId: ObjectId,
  embedding: [Number],
  content: String,
  metadata: Object
}
```

### Chats
```javascript
{
  projectId: ObjectId,
  userMessage: String,
  assistantMessage: String,
  createdAt: Date
}
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Log in

### Projects
- `POST /api/projects` - Create a project
- `GET /api/projects` - List user's projects
- `GET /api/projects/:id` - Get project details

### Repository Management
- `POST /api/repositories/upload` - Upload ZIP repository
- `POST /api/repositories/github` - Import GitHub repository

### Test Generation
- `POST /api/generate/tests` - Generate test cases
- `POST /api/generate/regenerate` - Regenerate test cases

### AI Chat
- `POST /api/chat` - Project-aware AI assistant

### Export
- `GET /api/export/markdown/:projectId` - Export as Markdown
- `GET /api/export/pdf/:projectId` - Export as PDF
- `GET /api/export/json/:projectId` - Export as JSON

## 📋 Frontend Pages

- **Landing Page** - Hero section, product intro, feature showcase, auth buttons
- **Signup Page** - User registration
- **Login Page** - User authentication
- **Dashboard** - Project overview and management
- **Project Details** - Repository analysis and test generations
- **Test Editor** - View and edit generated tests
- **AI Chat** - Interact with the project-aware assistant
- **Export Page** - Download tests in multiple formats

## 📋 Development Phases

### Phase 1: Foundation
- [ ] Frontend and backend initialization
- [ ] MongoDB connection
- [ ] Authentication system

### Phase 2: Project Management
- [ ] Dashboard
- [ ] Project CRUD operations
- [ ] Repository upload

### Phase 3: Repository Analysis
- [ ] File scanning
- [ ] Technology detection
- [ ] Architecture summaries

### Phase 4: AI Integration
- [ ] Prompt system
- [ ] Amazon Bedrock integration
- [ ] Test generation and regeneration

### Phase 5: Memory System
- [ ] Embedding generation
- [ ] Semantic retrieval
- [ ] Historical context enhancement

### Phase 6: Advanced Features
- [ ] AI chat assistant
- [ ] Markdown/PDF/JSON export
- [ ] Polish and optimization

## 🛠️ Local Development Setup

### Prerequisites
- Node.js 16+ and npm/yarn
- MongoDB (local or Atlas account)
- AWS Account with Bedrock access
- AWS IAM Access Keys (Access Key ID and Secret Access Key)

### Step 1: Clone the Repository

```bash
git clone https://github.com/zodiac0149/TestCase.git
cd TestCase
```

### Step 2: AWS Setup (Amazon Bedrock)

#### Enable Amazon Bedrock in Your AWS Account

1. **Sign in to AWS Console**
   - Go to [AWS Console](https://console.aws.amazon.com)

2. **Request Model Access**
   - Navigate to **Amazon Bedrock** → **Model Access**
   - Request access to desired models (e.g., Claude 3, Titan, etc.)
   - Accept the license agreement
   - Wait for approval (usually instant)

3. **Create IAM User with Bedrock Permissions**
   - Go to **IAM** → **Users** → **Create user**
   - Enter username: `testcase-bedrock-user`
   - Create access key (do not use root account)

4. **Attach Bedrock Policy**
   - Attach the following inline policy to the user:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "bedrock:InvokeModel",
                "bedrock:InvokeModelWithResponseStream",
                "bedrock:GetFoundationModelAvailability"
            ],
            "Resource": "*"
        }
    ]
}
```

5. **Get Access Keys**
   - In the IAM user console, go to **Security credentials**
   - Create **Access Key**
   - Copy the **Access Key ID** and **Secret Access Key**
   - **⚠️ Store these securely - you won't see them again!**

6. **Set AWS Region**
   - Note your AWS region (e.g., `us-east-1`, `us-west-2`)
   - Bedrock is available in limited regions. Check availability in your desired region.

### Step 3: Backend Setup

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory with the following variables:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/testcase

# JWT
JWT_SECRET=your_jwt_secret_key_here

# AWS Bedrock Configuration
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=us-east-1
BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

**Important AWS Bedrock Settings:**
- **AWS_REGION**: Must be a region where Bedrock is available (us-east-1, us-west-2, eu-west-1, etc.)
- **BEDROCK_MODEL_ID**: Use one of these popular models:
  - `anthropic.claude-3-sonnet-20240229-v1:0` (Recommended - good balance)
  - `anthropic.claude-3-opus-20240229-v1:0` (Most capable)
  - `anthropic.claude-3-haiku-20240307-v1:0` (Fastest)
  - `amazon.titan-text-express-v1:0` (Titan model)

**MongoDB Local Setup:**
- Install MongoDB Community Edition or use MongoDB Atlas
- If using local MongoDB, ensure it's running on `localhost:27017`
- If using MongoDB Atlas, replace `MONGODB_URI` with your connection string:
  ```
  mongodb+srv://username:password@cluster.mongodb.net/testcase
  ```

Start the backend server:

```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Step 4: Frontend Setup

Open a new terminal and navigate to the client directory:

```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Start the development server:

```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

### Step 5: Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

You should see the landing page. Sign up for an account to get started!

## 🔧 Available Scripts

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run start` - Start production server
- `npm run test` - Run tests (if configured)

### Frontend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## 📝 Environment Variables Reference

### Backend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/testcase` |
| `JWT_SECRET` | JWT signing secret | `your_secret_key` |
| `AWS_ACCESS_KEY_ID` | AWS IAM Access Key | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM Secret Key | `wJalrXUtn...` |
| `AWS_REGION` | AWS Region for Bedrock | `us-east-1` |
| `BEDROCK_MODEL_ID` | Bedrock Model ID | `anthropic.claude-3-sonnet-20240229-v1:0` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

### Frontend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5000` |

## 🔐 Security Notes

### AWS IAM Access Keys
- **Never commit `.env` files** to version control
- Use `.gitignore` to exclude `.env` files
- Rotate access keys regularly
- Use minimal required permissions (principle of least privilege)
- Consider using AWS temporary credentials for production

### Create .gitignore Entry
```bash
# In server/.gitignore
.env
.env.local
.env.*.local
```

## 🚀 Quick Start Checklist

- [ ] Clone repository
- [ ] Install Node.js 16+
- [ ] Set up AWS Account and enable Bedrock
- [ ] Create IAM user with Bedrock permissions
- [ ] Get AWS Access Keys and note AWS Region
- [ ] Set up MongoDB locally or get MongoDB Atlas URI
- [ ] Create `.env` files in both server and client with AWS credentials
- [ ] Install backend dependencies: `cd server && npm install`
- [ ] Install frontend dependencies: `cd client && npm install`
- [ ] Start backend: `cd server && npm run dev`
- [ ] Start frontend (new terminal): `cd client && npm run dev`
- [ ] Open `http://localhost:5173` in browser
- [ ] Sign up and start creating test cases!

## 💡 Troubleshooting

### AWS Bedrock Access Denied
- Verify IAM user has Bedrock permissions
- Check access keys are correct
- Verify AWS region supports Bedrock
- Ensure model is available in your region
- Check that model access has been requested and approved

### MongoDB Connection Failed
- Check if MongoDB is running
- Verify `MONGODB_URI` in `.env`
- For local MongoDB: `mongodb://localhost:27017/testcase`
- For Atlas: Use full connection string from MongoDB Atlas dashboard

### Invalid Model ID Error
- Verify `BEDROCK_MODEL_ID` is correct
- Check the model is available in your AWS region
- Ensure model access has been requested in AWS Bedrock console

### CORS Issues
- Check `FRONTEND_URL` in backend `.env`
- Ensure it matches your frontend URL (usually `http://localhost:5173`)

### Port Already in Use
- Backend: Change `PORT` in `.env` or kill process using port 5000
- Frontend: Vite will suggest alternate port if 5173 is taken

### AWS Credentials Not Found
- Verify `.env` file exists in server directory
- Check all AWS variables are set correctly
- Ensure no typos in variable names
- Restart the server after updating `.env`

## 📚 AWS Bedrock Resources

- [AWS Bedrock Documentation](https://docs.aws.amazon.com/bedrock/)
- [Bedrock Model IDs](https://docs.aws.amazon.com/bedrock/latest/userguide/model-ids-supported.html)
- [Bedrock Pricing](https://aws.amazon.com/bedrock/pricing/)
- [IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/your-feature`)
2. Commit changes (`git commit -m 'Add your feature'`)
3. Push to branch (`git push origin feature/your-feature`)
4. Open a Pull Request

## 📧 Support

For issues or questions, please open a GitHub issue in the repository.

---

**Built with ❤️ for better software testing**
