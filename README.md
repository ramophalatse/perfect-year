# Perfect Year

A web application built with Next.js to help you plan and track your perfect year.

## Features

- Set and track goals with deadlines
- Break down goals into manageable tasks
- Organize tasks with projects
- Take notes and attach resources
- Calendar view for time-based planning

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Database**: Prisma with SQLite (development) / PostgreSQL (production)
- **Authentication**: Email/password with bcrypt

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ramophalatse/perfect-year.git
   cd perfect-year
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up the database:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This application is configured for easy deployment on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Connect to your GitHub repository
4. Vercel will automatically detect Next.js and deploy your application

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL="file:./dev.db"
# For production with PostgreSQL:
# DATABASE_URL="postgresql://username:password@localhost:5432/perfect-year"
```

## License

This project is licensed under the MIT License. 