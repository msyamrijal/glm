# Academic Planner

A comprehensive academic planner web application built with Next.js, TypeScript, and Prisma. Manage your terms, courses, assignments, and events in one place.

## Features

- **Dashboard** - Overview of your academic progress with statistics
- **Terms Management** - Create and manage academic terms/semesters
- **Courses Management** - Add courses with details like instructor, credits, and descriptions
- **Assignments Management** - Track assignments with priorities, due dates, and status
- **Events Management** - Schedule events like exams, meetings, and holidays
- **Calendar View** - Visual calendar showing all your academic activities
- **Responsive Design** - Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 15 with TypeScript
- **UI Components**: shadcn/ui with Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Backend**: Next.js API routes
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/academic-planner.git
cd academic-planner
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npm run db:push
```

4. Generate Prisma client:
```bash
npm run db:generate
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env.local` file with the following variables:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

## Database Schema

The application uses the following main entities:

- **Users** - Application users
- **Terms** - Academic terms/semesters with start and end dates
- **Courses** - Courses within terms with instructor and credit information
- **Assignments** - Assignments with due dates, priorities, and status tracking
- **Events** - Events like exams, meetings, and holidays

## API Routes

The application provides REST API endpoints for all entities:

- `GET/POST /api/terms` - List and create terms
- `GET/PUT/DELETE /api/terms/[id]` - Manage individual terms
- `GET/POST /api/courses` - List and create courses
- `GET/PUT/DELETE /api/courses/[id]` - Manage individual courses
- `GET/POST /api/assignments` - List and create assignments
- `GET/PUT/DELETE /api/assignments/[id]` - Manage individual assignments
- `GET/POST /api/events` - List and create events
- `GET/PUT/DELETE /api/events/[id]` - Manage individual events

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL` - Use a production database URL
   - `NEXTAUTH_SECRET` - Generate a secure secret
   - `NEXTAUTH_URL` - Your Vercel deployment URL

### Production Database

For production, consider using a managed database service:

- **PostgreSQL**: Recommended for production
- **MySQL**: Good alternative
- **PlanetScale**: Serverless MySQL
- **Supabase**: PostgreSQL with additional features

Update your `DATABASE_URL` in production environment variables.

## Building for Production

```bash
npm run build
npm start
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push schema changes to database
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations

### Project Structure

```
src/
├── app/
│   ├── api/          # API endpoints
│   ├── page.tsx      # Main application
│   ├── layout.tsx    # Root layout
│   └── globals.css   # Global styles
├── components/
│   ├── ui/           # shadcn/ui components
│   ├── academic-planner-dashboard.tsx
│   ├── terms-manager.tsx
│   ├── courses-manager.tsx
│   ├── assignments-manager.tsx
│   ├── events-manager.tsx
│   └── calendar-view.tsx
├── lib/
│   ├── db.ts        # Database connection
│   └── utils.ts     # Utility functions
└── hooks/
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions, please open an issue on the GitHub repository.