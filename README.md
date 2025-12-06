# Addrly - Dating App for the Chronically Online

A waitlist landing page for Addrly, a dating app that lets you create DateMeDocs and open boyfriend/girlfriend applications.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Authentication**: Clerk
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Clerk account (free tier available)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd addrly
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your Clerk keys to `.env.local`:
   - Go to [Clerk Dashboard](https://dashboard.clerk.com)
   - Create a new application or use an existing one
   - Copy your API keys

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
4. Deploy!

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key | Yes |
| `CLERK_SECRET_KEY` | Clerk secret key | Yes |

## Project Structure

```
src/
├── app/
│   ├── (marketing)/     # Landing page
│   ├── layout.tsx       # Root layout with Clerk provider
│   └── not-found.tsx    # 404 page
├── components/
│   ├── global/          # Shared components
│   ├── marketing/       # Landing page sections
│   └── ui/              # UI primitives
├── constants/           # App constants
├── lib/                 # Utilities
├── middleware.ts        # Clerk middleware
└── styles/              # Global styles
```

## Features

- 🎨 Modern, animated landing page
- 🔐 Clerk authentication (modal-based signup)
- 📱 Fully responsive design
- ⚡ Optimized for performance
- 🚀 Ready for Vercel deployment

## License

MIT
