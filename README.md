<p align="center">
  <img src="docs/assets/logo.png" alt="Mini-Jira Logo" width="120" />
</p>

<h1 align="center">Mini-Jira on AWS</h1>

<p align="center">
  <b>A lightweight, event-driven team task-management platform built on AWS</b>
</p>

<p align="center">
  <a href="#architecture"><img src="https://img.shields.io/badge/AWS-Cloud%20Native-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white" /></a>
  <a href="#tech-stack"><img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" /></a>
  <a href="#tech-stack"><img src="https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=node.js&logoColor=white" /></a>
  <a href="#tech-stack"><img src="https://img.shields.io/badge/DynamoDB-NoSQL-4053D6?style=for-the-badge&logo=amazondynamodb&logoColor=white" /></a>
  <a href="#license"><img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" /></a>
</p>

<p align="center">
  <a href="#-live-demo">Live Demo</a> •
  <a href="#-features">Features</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-api-reference">API Reference</a> •
  <a href="#-team">Team</a>
</p>

---

## 🌐 Live Demo

> **Production URL:** [https://d1234abcdef.cloudfront.net](https://d1234abcdef.cloudfront.net)  
> *(CloudFront Distribution — replace with actual URL after deployment)*

### Demo Credentials

| Role | Email | Password | Team |
|------|-------|----------|------|
| Manager | ali@mini-jira.com | `Demo@1234` | — (All Teams) |
| Employee | sara@mini-jira.com | `Demo@1234` | Frontend |
| Employee | omar@mini-jira.com | `Demo@1234` | Backend |

### Demo Scenario

1. **Ali** (Manager) creates **Task A** → assigns to **Sara** on the **Frontend** team.
2. **Ali** creates **Task B** → assigns to **Omar** on the **Backend** team.
3. **Sara** logs in → sees **only Task A**.
4. **Omar** logs in → sees **only Task B**.
5. **Ali** logs back in → sees **both tasks**, can filter by team.

---

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Design](#-database-design)
- [API Reference](#-api-reference)
- [AWS Services](#-aws-services)
- [Deployment](#-deployment)
- [Monitoring & Observability](#-monitoring--observability)
- [Demo Video](#-demo-video)
- [Team](#-team)
- [License](#-license)

---

## ✨ Features

### Core Functionality
- ✅ **Multi-Team Task Management** — Create, assign, and track tasks across teams
- ✅ **Role-Based Access Control** — Manager, Employee, and Admin roles with server-side enforcement
- ✅ **Team Isolation** — Employees see only their team's tasks; enforced at API level via DynamoDB GSIs
- ✅ **Project Management** — Organize tasks under projects with full CRUD
- ✅ **Kanban Board** — Drag-and-drop interface (To Do → In Progress → In Review → Done)
- ✅ **Comments & Collaboration** — Threaded comments on each task
- ✅ **Image Attachments** — Upload, replace, and version task images via S3
- ✅ **Audit Log** — Full history of status changes with timestamps

### Event-Driven Architecture
- 📧 **Email Notifications** — Automatic email when a task is assigned (SNS)
- 📬 **Activity Logging** — SQS-backed worker Lambda writes activity logs
- ⏰ **Daily Digest** — EventBridge-triggered Lambda sends daily task reminders at 9:00 AM
- 📊 **Custom Metrics** — CloudWatch custom metrics (TasksAssignedPerTeam, etc.)

### Infrastructure & Reliability
- 🏗️ **High Availability** — Multi-AZ deployment with Auto Scaling Group
- ⚖️ **Load Balancing** — Application Load Balancer with health checks
- 🌍 **CDN** — CloudFront for low-latency global delivery
- 🖼️ **Image Pipeline** — Lambda auto-resizes uploaded images to thumbnails
- 🔐 **Authentication** — AWS Cognito with JWT validation on every request
- 📈 **Monitoring** — CloudWatch dashboards, alarms, and custom metrics

---

## 🏗 Architecture

<p align="center">
  <img src="docs/architecture/architecture-diagram.png" alt="AWS Architecture Diagram" width="100%" />
</p>

> The detailed architecture diagram is drawn using [AWS Architecture Icons](https://aws.amazon.com/architecture/icons/) and illustrates the full multi-AZ deployment.

### Architecture Overview

```
                         ┌──────────────┐
                         │  CloudFront  │
                         └──────┬───────┘
                                │
                     ┌──────────▼──────────┐
                     │   Application Load  │
                     │     Balancer (ALB)   │
                     └────┬───────────┬────┘
                          │           │
               ┌──────────▼──┐  ┌────▼──────────┐
               │  EC2 (AZ-a) │  │  EC2 (AZ-b)   │
               │  Node.js    │  │  Node.js       │
               └──────┬──────┘  └────┬───────────┘
                      │              │
         ┌────────────▼──────────────▼────────────┐
         │              DynamoDB                   │
         │  (Users, Teams, Projects, Tasks, etc.)  │
         └─────────────────────────────────────────┘
```

### Event Flow

```
Task Assigned ──► SNS Topic ──┬──► Email (Assignee Notification)
                              └──► SQS Queue ──► Lambda Worker
                                                    ├── Activity Log (DynamoDB)
                                                    └── CloudWatch Custom Metric

EventBridge (9AM daily) ──► Lambda Digest ──► SNS ──► Email (Due Today)

S3 PUT (Original Image) ──► Lambda Resize ──► S3 (Resized Bucket)
```

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS, shadcn/ui, React DnD |
| **Backend** | Node.js 20, Express.js, AWS SDK v3 |
| **Database** | Amazon DynamoDB (with GSIs) |
| **Auth** | Amazon Cognito (User Pools + JWT) |
| **Storage** | Amazon S3 (originals + resized buckets) |
| **Compute** | Amazon EC2 (Auto Scaling Group), AWS Lambda |
| **Messaging** | Amazon SNS, Amazon SQS, Amazon EventBridge |
| **CDN** | Amazon CloudFront |
| **Monitoring** | Amazon CloudWatch (Dashboards, Alarms, Custom Metrics) |
| **Networking** | VPC, Public/Private Subnets, NAT Gateway, ALB |
| **IAM** | Least-privilege roles per service |

---

## 📁 Project Structure

```
Cloud-Computing-Project/
│
├── frontend/                        # React Frontend (Vite)
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── assets/                  # Images, icons, fonts
│   │   ├── components/              # Reusable UI components
│   │   │   ├── common/              # Buttons, Modals, Toasts, etc.
│   │   │   ├── layout/              # Navbar, Sidebar, Footer
│   │   │   ├── kanban/              # Kanban board components
│   │   │   ├── tasks/               # Task cards, detail, forms
│   │   │   ├── projects/            # Project views
│   │   │   ├── comments/            # Comment thread components
│   │   │   └── dashboard/           # Dashboard widgets & charts
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── context/                 # Auth & App context providers
│   │   ├── pages/                   # Route-level page components
│   │   ├── services/                # API client & service layer
│   │   ├── utils/                   # Helper functions & constants
│   │   ├── styles/                  # Global styles & theme
│   │   ├── App.jsx                  # Root application component
│   │   └── main.jsx                 # Vite entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── backend/                         # Node.js Backend (Express)
│   ├── src/
│   │   ├── config/                  # AWS SDK & app configuration
│   │   ├── middleware/              # Auth, RBAC, error handling
│   │   ├── routes/                  # Express route definitions
│   │   ├── controllers/            # Request handlers
│   │   ├── services/               # Business logic layer
│   │   ├── models/                 # DynamoDB table schemas & helpers
│   │   ├── utils/                  # Helpers, validators, constants
│   │   └── app.js                  # Express app setup
│   ├── server.js                   # Entry point
│   └── package.json
│
├── lambdas/                         # AWS Lambda Functions
│   ├── image-resize/               # S3 trigger — resize uploaded images
│   │   ├── index.js
│   │   └── package.json
│   ├── assignment-worker/          # SQS trigger — activity log + metrics
│   │   ├── index.js
│   │   └── package.json
│   └── daily-digest/               # EventBridge trigger — due-today emails
│       ├── index.js
│       └── package.json
│
├── infra/                           # Infrastructure & AWS Config
│   ├── cloudformation/             # CloudFormation templates (optional)
│   ├── scripts/                    # Deployment & setup scripts
│   │   ├── setup-dynamodb.js       # Create DynamoDB tables & GSIs
│   │   ├── setup-cognito.js        # Configure Cognito user pool
│   │   ├── setup-s3.js             # Create S3 buckets
│   │   ├── setup-sns-sqs.js        # Create SNS topics & SQS queues
│   │   ├── deploy-lambdas.sh       # Package & deploy Lambda functions
│   │   └── seed-data.js            # Seed demo users & data
│   └── iam-policies/              # IAM policy documents
│
├── docs/                            # Documentation & Assets
│   ├── architecture/               # Architecture diagrams
│   │   └── architecture-diagram.png
│   ├── assets/                     # README images & logos
│   │   └── logo.png
│   ├── api/                        # API documentation
│   │   └── endpoints.md
│   ├── database/                   # Database schema docs
│   │   └── dynamodb-schema.md
│   └── demo/                       # Demo video & screenshots
│       └── demo-video.mp4
│
├── .github/                         # GitHub configuration
│   └── PULL_REQUEST_TEMPLATE.md
│
├── .env.example                     # Environment variable template
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20.x
- **npm** ≥ 10.x
- **AWS CLI** v2 configured with appropriate credentials
- **AWS Account** with free-tier eligibility

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/Cloud-Computing-Project.git
cd Cloud-Computing-Project

# 2. Install backend dependencies
cd backend
npm install

# 3. Install frontend dependencies
cd ../frontend
npm install

# 4. Configure environment variables
cd ..
cp .env.example .env
# Edit .env with your AWS credentials and resource ARNs
```

### AWS Infrastructure Setup

```bash
# 1. Create DynamoDB tables
node infra/scripts/setup-dynamodb.js

# 2. Create S3 buckets
node infra/scripts/setup-s3.js

# 3. Configure Cognito
node infra/scripts/setup-cognito.js

# 4. Set up SNS & SQS
node infra/scripts/setup-sns-sqs.js

# 5. Deploy Lambda functions
chmod +x infra/scripts/deploy-lambdas.sh
./infra/scripts/deploy-lambdas.sh

# 6. Seed demo data
node infra/scripts/seed-data.js
```

### Running Locally

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

> Frontend: `http://localhost:5173` | Backend: `http://localhost:3000`

---

## 🔐 Environment Variables

Create a `.env` file in the project root (see `.env.example`):

```env
# AWS General
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# Cognito
COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx

# DynamoDB
DYNAMODB_USERS_TABLE=MiniJira-Users
DYNAMODB_TEAMS_TABLE=MiniJira-Teams
DYNAMODB_PROJECTS_TABLE=MiniJira-Projects
DYNAMODB_TASKS_TABLE=MiniJira-Tasks
DYNAMODB_COMMENTS_TABLE=MiniJira-Comments
DYNAMODB_ACTIVITY_LOG_TABLE=MiniJira-ActivityLog

# S3
S3_ORIGINALS_BUCKET=mini-jira-originals
S3_RESIZED_BUCKET=mini-jira-resized

# SNS
SNS_TASK_ASSIGNMENT_TOPIC_ARN=arn:aws:sns:us-east-1:123456789:TaskAssignment
SNS_DAILY_DIGEST_TOPIC_ARN=arn:aws:sns:us-east-1:123456789:DailyDigest

# SQS
SQS_ASSIGNMENT_QUEUE_URL=https://sqs.us-east-1.amazonaws.com/123456789/assignment-queue

# App
PORT=3000
NODE_ENV=development
```

---

## 🗄 Database Design

### DynamoDB Tables

| Table | Partition Key | Sort Key | GSIs |
|-------|--------------|----------|------|
| `MiniJira-Users` | `userId` (S) | — | `TeamIndex` (teamId) |
| `MiniJira-Teams` | `teamId` (S) | — | — |
| `MiniJira-Projects` | `projectId` (S) | — | — |
| `MiniJira-Tasks` | `taskId` (S) | — | `TeamIndex` (teamId), `AssigneeIndex` (assigneeId) |
| `MiniJira-Comments` | `taskId` (S) | `commentId` (S) | — |
| `MiniJira-ActivityLog` | `logId` (S) | `timestamp` (S) | — |

> Full schema documentation: [`docs/database/dynamodb-schema.md`](docs/database/dynamodb-schema.md)

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/signin` | Sign in & receive tokens |
| POST | `/api/auth/refresh` | Refresh access token |

### Tasks
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/tasks` | List tasks (team-scoped) | Employee / Manager |
| GET | `/api/tasks/:id` | Get task details | Team member / Manager |
| POST | `/api/tasks` | Create a new task | Manager |
| PUT | `/api/tasks/:id` | Update a task | Assignee / Manager |
| DELETE | `/api/tasks/:id` | Delete a task | Manager |
| POST | `/api/tasks/:id/image` | Upload task image | Manager |
| PUT | `/api/tasks/:id/image` | Replace task image | Manager |
| DELETE | `/api/tasks/:id/image` | Delete task image | Manager |

### Projects
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/projects` | List all projects | All |
| GET | `/api/projects/:id` | Get project details | All |
| POST | `/api/projects` | Create a project | Manager |
| PUT | `/api/projects/:id` | Update a project | Manager |
| DELETE | `/api/projects/:id` | Delete a project | Manager |

### Comments
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/tasks/:id/comments` | List comments on a task | Team member / Manager |
| POST | `/api/tasks/:id/comments` | Add a comment | Team member / Manager |

### Teams & Users
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/teams` | List all teams | Manager |
| POST | `/api/teams` | Create a team | Admin / Manager |
| GET | `/api/users` | List all users | Manager |
| PUT | `/api/users/:id/team` | Assign user to team | Admin / Manager |

> Full API docs: [`docs/api/endpoints.md`](docs/api/endpoints.md)

---

## ☁️ AWS Services

| Service | Purpose |
|---------|---------|
| **EC2 + ASG** | Hosts Node.js backend across 2+ AZs |
| **ALB** | Distributes traffic, runs health checks |
| **CloudFront** | CDN for low-latency delivery |
| **DynamoDB** | All application data with GSIs |
| **S3** (originals) | Task image attachments with versioning |
| **S3** (resized) | Thumbnails from Lambda resize |
| **Lambda** — Image Resize | Triggered on S3 PUT, generates thumbnails |
| **Lambda** — Assignment Worker | Drains SQS, writes logs, publishes metrics |
| **Lambda** — Daily Digest | EventBridge cron at 9 AM, sends due-today emails |
| **SNS** | Fan-out for task assignment (email + SQS) |
| **SQS** | Buffers assignment events for async processing |
| **EventBridge** | Scheduled rule for daily digest |
| **Cognito** | User pool for auth, stores role & teamId |
| **CloudWatch** | Dashboards, alarms, custom metrics |
| **IAM** | Least-privilege roles per component |
| **VPC** | Public subnets (ALB), private subnets (EC2), NAT |

---

## 📊 Monitoring & Observability

### CloudWatch Dashboard Widgets

| Widget | Metric |
|--------|--------|
| Tasks Created Per Day | Custom metric from API |
| Tasks Closed Per Day Per Team | Custom metric from worker Lambda |
| Average Time-to-Close | Computed from task lifecycle timestamps |
| EC2 CPU Utilization | Standard EC2 metric |

### CloudWatch Alarms

| Alarm | Condition | Action |
|-------|-----------|--------|
| Overdue Tasks Threshold | Overdue tasks > 10 | SNS notification to Manager |
| High CPU | CPU > 80% for 5 min | SNS alert |

---

## 🎬 Demo Video

> 📹 [Watch the full demo video](docs/demo/demo-video.mp4)

The demo covers:
1. Manager login & dashboard overview
2. Creating projects and tasks with image attachments
3. Assigning tasks to team members
4. Team isolation verification (Sara vs Omar)
5. Kanban board drag-and-drop
6. Comments and file attachments
7. Email notification flow
8. CloudWatch dashboard walkthrough

---

## 👥 Team

| Name | Role |
|------|------|
| **Mohamed Abdelsatar** | Full-Stack Developer & AWS Architect |
| **Jessica Ehab** | Frontend Developer & UI/UX Design |
| **Donia Ali** | Backend Developer & Cloud Infrastructure |

**Course:** Software Cloud Computing 2026  
**Instructor:** Dr. John Zaki  
**Deadline:** May 22, 2026 at 11:59 PM

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <sub>Built with ❤️ for Cloud Computing 2026 — Cairo University</sub>
</p>
