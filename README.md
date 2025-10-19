# VoltEdge - Data Center Site Selection Platform

A professional Next.js application for analyzing and selecting optimal data center locations across India, featuring real-time parcel analysis, power infrastructure mapping, and financial projections.

## Features

- ⚡ **Modern Tech Stack**: Built with Next.js 15, React, and Tailwind CSS
- 🔐 **Firebase Authentication**: Secure email/password authentication with password reset
- 🗺️ **Interactive Maps**: Mapbox integration for visualizing parcels and infrastructure
- 📊 **Real-time Analytics**: Dashboard with comprehensive site analysis metrics
- 🏗️ **Power Infrastructure**: Detailed substation and transmission line data
- 💰 **Financial Projections**: NPV, IRR, and TCO calculations for data center sizing
- 🌐 **Serverless API**: Next.js API routes connected to Supabase PostgreSQL
- 📱 **Responsive Design**: Works seamlessly across all devices
- 🔒 **Protected Routes**: Dashboard accessible only to authenticated users

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: JavaScript
- **Styling**: Tailwind CSS
- **Database**: Supabase PostgreSQL
- **Authentication**: Firebase Authentication (Email/Password)
- **Maps**: Mapbox GL JS, React Map GL
- **Charts**: Recharts
- **Icons**: Lucide React
- **Deployment**: Vercel (serverless)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Firebase project with Authentication enabled
- A Supabase project with PostgreSQL database
- Mapbox account with access token
- npm or yarn package manager

### Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd voltedge-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Supabase**:
   - Create a Supabase project at [https://supabase.com](https://supabase.com)
   - Import your database schema and data
   - Copy your database connection string and API keys

4. **Set up Firebase**:
   - Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
   - Enable Email/Password authentication in Firebase Console
   - Copy your Firebase configuration

5. **Configure environment variables**:
   - Copy `.env.local.example` to `.env.local`:
     ```bash
     cp .env.local.example .env.local
     ```
   - Update `.env.local` with your credentials (see `.env.local.example` for all variables)

6. **Run the development server**:
   ```bash
   npm run dev
   # or use the convenience script
   ./start.sh
   ```

7. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
voltedge-app/
├── app/
│   ├── api/                   # Next.js API Routes (serverless)
│   │   ├── parcels/          # Parcel endpoints
│   │   ├── cities/           # City statistics
│   │   ├── consultants/      # Consultant data
│   │   └── dashboard/        # Dashboard stats
│   ├── dashboard/            # Dashboard pages
│   ├── parcels/              # Parcel pages
│   ├── projects/             # Project pages
│   ├── map/                  # Map visualization
│   ├── layout.js             # Root layout with AuthProvider
│   ├── page.js               # Login page
│   └── globals.css           # Global styles
├── components/               # React components
│   ├── auth/                 # Authentication components
│   ├── layout/               # Layout components
│   ├── ui/                   # Reusable UI components
│   └── map/                  # Map-related components
├── lib/
│   ├── db.js                 # Database connection (Supabase)
│   ├── firebase.js           # Firebase configuration
│   ├── auth.js               # Authentication utilities
│   ├── api-client.js         # API client
│   └── supabase-client.js    # Supabase client
├── context/
│   └── AuthContext.js        # Authentication context
├── services/                 # API service layer
│   ├── api.js                # API service functions
│   └── parcel.service.js     # Parcel-specific services
└── config/
    └── api.js                # API configuration
```

## Authentication

### User Management

**Important**: Users cannot create accounts through the UI. Account creation is admin-only and must be done through the Firebase Console.

### Available Features

- **Login**: Email and password authentication
- **Password Reset**: Send password reset email to registered users
- **Protected Routes**: Automatic redirection for unauthenticated users
- **Session Persistence**: Firebase handles session management

## Design System

The application follows Microsoft Office 365 design principles. For detailed design guidelines, see `WARP.md`.

### Key Design Features

- **Color Palette**: Microsoft Blue (#0078d4) as primary color
- **Typography**: Segoe UI font family with consistent type scale
- **Spacing**: 4px base unit for consistent spacing
- **Components**: Pre-built components following Office 365 patterns

## API Routes

The application provides the following API endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/parcels` | GET | Get all parcels with pagination |
| `/api/parcels/:id` | GET | Get single parcel with full details |
| `/api/parcels/:id/financials` | GET | Get financial projections |
| `/api/parcels/:id/power` | GET | Get power infrastructure |
| `/api/parcels/search` | GET | Search parcels with filters |
| `/api/cities` | GET | Get cities with aggregated stats |
| `/api/consultants` | GET | Get consultant firms |
| `/api/dashboard/stats` | GET | Get dashboard statistics |
| `/api/health` | GET | Health check endpoint |

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Or use the startup script
./start.sh

# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

See [.env.local.example](.env.local.example) for all required environment variables:

- **Supabase**: Database connection and API keys
- **Firebase**: Authentication configuration
- **Mapbox**: Map access token
- **Google Maps**: Maps API key

**Security Note**: Never commit `.env.local` to version control. It's already included in `.gitignore`.

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment instructions.

### Quick Deploy to Vercel

1. Push your code to a Git repository
2. Import the project in Vercel
3. Add all environment variables from `.env.local.example`
4. Deploy

The application will automatically use Next.js API routes (no separate backend needed).

## License

This project is for demonstration purposes.

## Support

For questions or issues, please refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
# voltedge-app
