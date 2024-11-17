# TraceIQ - Modern Error Tracking System

TraceIQ is a powerful, open-source error tracking system designed to help developers monitor, track, and manage errors across their applications. With real-time error tracking, detailed error analytics, and a beautiful modern interface, TraceIQ makes error management a breeze.

![TraceIQ Dashboard](path-to-dashboard-screenshot.png)

## Features

- **Real-time Error Tracking**: Capture and monitor errors as they happen
- **Error Analytics**: Comprehensive error statistics and trends
- **Project-based Organization**: Manage errors across multiple projects
- **Secure Authentication**: Built-in authentication and API key management
- **Modern UI**: Beautiful and intuitive user interface
- **Responsive Design**: Works seamlessly across all devices
- **Real-time Updates**: Live error feed and notifications
- **Environment Support**: Track errors across different environments

## Tech Stack

- Frontend: React + TypeScript + Vite
- Backend: Express.js
- Database: Supabase (PostgreSQL)
- State Management: Zustand
- Styling: Tailwind CSS

## Prerequisites

- Node.js 16.x or later
- npm or yarn
- Supabase account

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/daviduche03/TraceIQ.git
cd TraceIQ
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../
npm install
```

3. Set up Supabase:
   - Create a new project in Supabase
   - Run the SQL migrations in `supabase/migrations/` to set up the database schema
   - Copy your project URL and service role key

4. Configure environment variables:

Create a `.env` file in the backend directory:
```env
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-service-role-key
PORT=3000
```

Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

5. Start the development servers:

```bash
# Start backend server
cd backend
npm run dev

# In another terminal, start frontend
cd ../
npm run dev
```

6. Visit `http://localhost:5173` to see TraceIQ in action!

## Project Structure

```
TraceIQ/
├── backend/               # Express.js backend
│   ├── server.js         # Main server file
│   └── package.json      # Backend dependencies
├── src/                  # Frontend source code
│   ├── components/       # React components
│   ├── lib/             # Utility functions and classes
│   ├── pages/           # Page components
│   └── stores/          # Zustand stores
├── supabase/            # Supabase migrations and types
└── package.json         # Frontend dependencies
```

## API Integration

To integrate TraceIQ into your application:

1. Create a new project in TraceIQ dashboard
2. Get your project ID and API key
3. Use the ErrorTracker client: (build your own client from code in lib/errorTracker.ts)

```typescript
import { ErrorTracker } from '@traceiq/client';

const errorTracker = new ErrorTracker({
  projectId: 'your-project-id',
  apiKey: 'your-api-key'
});

try {
  // Your code
} catch (error) {
  errorTracker.trackError(error);
}
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- [Documentation](docs/README.md)
- [Issue Tracker](https://github.com/daviduche03/TraceIQ/issues)
- [Discussions](https://github.com/daviduche03/TraceIQ/discussions)

## Acknowledgments

- [Supabase](https://supabase.io/) for the amazing backend infrastructure
- [Tailwind CSS](https://tailwindcss.com/) for the styling system
- All our contributors and supporters!
