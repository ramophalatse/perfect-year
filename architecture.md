# Perfect Year: Full-Stack Architecture

## System Overview

Perfect Year is a comprehensive goal achievement and life organization application built with a modern tech stack:

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Deployment**: Vercel

## Application Structure

The application is divided into two main categories:

### 1. Workflow
- Goal Planning
- Task Management  
- Progress Tracking
- Achievement Celebration

### 2. Workspace
- Projects
- Resources
- Notes/Journal
- Calendar/Scheduling

## Database Schema

```prisma
// User model
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?
  role          Role      @default(USER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  goals         Goal[]
  tasks         Task[]
  projects      Project[]
  notes         Note[]
  events        Event[]
  resources     Resource[]
}

enum Role {
  USER
  ADMIN
  TEAM_MEMBER
}

// Goals
model Goal {
  id          String   @id @default(cuid())
  title       String
  description String?
  startDate   DateTime
  endDate     DateTime?
  status      Status   @default(IN_PROGRESS)
  priority    Priority @default(MEDIUM)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  tasks       Task[]
  projects    Project[]
}

// Tasks
model Task {
  id          String   @id @default(cuid())
  title       String
  description String?
  dueDate     DateTime?
  status      Status   @default(TODO)
  priority    Priority @default(MEDIUM)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  goalId      String?
  goal        Goal?    @relation(fields: [goalId], references: [id], onDelete: SetNull)
  projectId   String?
  project     Project? @relation(fields: [projectId], references: [id], onDelete: SetNull)
}

// Projects
model Project {
  id          String   @id @default(cuid())
  title       String
  description String?
  startDate   DateTime
  endDate     DateTime?
  status      Status   @default(IN_PROGRESS)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  goalId      String?
  goal        Goal?    @relation(fields: [goalId], references: [id])
  tasks       Task[]
  notes       Note[]
  resources   Resource[]
  teamMembers TeamMember[]
}

// Team Members
model TeamMember {
  id        String   @id @default(cuid())
  role      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  projectId String
  project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([projectId, userId])
}

// Notes
model Note {
  id        String   @id @default(cuid())
  title     String
  content   String   @db.Text
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  projectId String?
  project   Project? @relation(fields: [projectId], references: [id], onDelete: SetNull)
}

// Calendar Events
model Event {
  id          String   @id @default(cuid())
  title       String
  description String?
  startTime   DateTime
  endTime     DateTime
  allDay      Boolean  @default(false)
  location    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// Resources
model Resource {
  id        String   @id @default(cuid())
  title     String
  type      String   // FILE, LINK, etc.
  url       String?
  content   String?  @db.Text
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  projectId String?
  project   Project? @relation(fields: [projectId], references: [id], onDelete: SetNull)
}

enum Status {
  TODO
  IN_PROGRESS
  COMPLETED
  CANCELED
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT
}
```

## Frontend Architecture

### Component Structure

```
components/
├── common/
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── Dropdown.tsx
│   ├── Switch.tsx
│   ├── Toast.tsx
│   └── ... 
├── layout/
│   ├── AppLayout.tsx
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── ...
├── workflow/
│   ├── goals/
│   │   ├── GoalCard.tsx
│   │   ├── GoalForm.tsx
│   │   ├── GoalList.tsx
│   │   └── ...
│   ├── tasks/
│   │   ├── TaskCard.tsx
│   │   ├── TaskForm.tsx
│   │   ├── TaskList.tsx
│   │   └── ...
│   └── ...
├── workspace/
│   ├── projects/
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectForm.tsx
│   │   ├── ProjectList.tsx
│   │   └── ...
│   ├── notes/
│   │   ├── NoteEditor.tsx
│   │   ├── NoteList.tsx
│   │   └── ...
│   ├── calendar/
│   │   ├── Calendar.tsx
│   │   ├── EventForm.tsx
│   │   └── ...
│   └── ...
└── auth/
    ├── LoginForm.tsx
    ├── RegisterForm.tsx
    ├── ProfileSettings.tsx
    └── ...
```

### Page Structure

```
app/
├── layout.tsx             # Root layout with theme provider
├── page.tsx               # Landing page
├── (auth)/
│   ├── login/
│   ├── register/
│   └── forgot-password/
├── dashboard/
│   ├── layout.tsx         # Dashboard layout with sidebar
│   ├── page.tsx           # Overview dashboard
│   ├── profile/
│   └── settings/
├── workflow/
│   ├── layout.tsx
│   ├── page.tsx           # Workflow overview
│   ├── goals/
│   │   ├── page.tsx       # Goals listing
│   │   └── [id]/          # Specific goal
│   └── tasks/
│       ├── page.tsx       # Tasks listing
│       └── [id]/          # Specific task
└── workspace/
    ├── layout.tsx  
    ├── page.tsx           # Workspace overview
    ├── projects/
    │   ├── page.tsx       # Projects listing
    │   └── [id]/          # Specific project
    ├── notes/
    │   ├── page.tsx       # Notes listing
    │   └── [id]/          # Specific note
    └── calendar/
        └── page.tsx       # Calendar view
```

## API Structure

```
app/api/
├── auth/
│   ├── [...nextauth]/
│   ├── register/
│   └── ...
├── users/
│   ├── route.ts
│   └── [id]/
│       └── route.ts
├── goals/
│   ├── route.ts
│   └── [id]/
│       └── route.ts
├── tasks/
│   ├── route.ts
│   └── [id]/
│       └── route.ts
├── projects/
│   ├── route.ts
│   └── [id]/
│       └── route.ts
├── notes/
│   ├── route.ts
│   └── [id]/
│       └── route.ts
├── events/
│   ├── route.ts
│   └── [id]/
│       └── route.ts
└── resources/
    ├── route.ts
    └── [id]/
        └── route.ts
```

## UI/UX Features

### Theme Support
- Dark and light mode using a ThemeProvider
- User preference saved in localStorage and/or user profile
- System preference detection

### Micro-animations and Interactions
- Subtle page transitions
- Loading state animations
- Button hover/click effects
- Form input focus states
- Success/error feedback animations
- List item enter/exit animations

### Responsive Design
- Mobile-first approach
- Adaptive layouts for tablet and desktop
- Touch-friendly interactions on mobile
- Keyboard shortcuts for desktop

## Authentication and Authorization

- JWT-based authentication with NextAuth.js
- Role-based access control (User, Admin, Team Member)
- Protected routes on both client and server
- Invitation system for team collaboration

## Data Flow Architecture

1. **State Management**
   - React Context for global state (theme, user data)
   - SWR for data fetching and caching
   - Local component state for UI interactions

2. **Server Actions/API Calls**
   - Next.js API routes for data operations
   - Server actions for form submissions
   - Data validation on both client and server

3. **Real-time Features**
   - WebSockets for collaborative features
   - Push notifications for task reminders and updates

## Deployment Architecture

- Vercel for frontend and serverless functions
- PostgreSQL database hosted on a managed service (e.g., Supabase, Neon)
- Content delivery network for static assets
- Environment-based configuration

## Performance Considerations

- Server-side rendering for initial page load
- Client-side navigation for subsequent interactions
- Image optimization with Next.js Image component
- Code splitting and lazy loading for larger components
- Database query optimization and indexing

## Security Measures

- HTTPS for all communications
- CSRF protection
- Input sanitization
- Rate limiting for API endpoints
- Regular security audits 