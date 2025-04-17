# ORentit

A modern rental marketplace built with React, Supabase, and TailwindCSS.

## Features

- 🛠 Browse and search rental items
- 📱 Responsive design
- 🔐 User authentication
- 📝 Item listing and management
- 💳 Rental booking system

## Tech Stack

- React + TypeScript
- Vite
- TailwindCSS
- Supabase
- React Router

## Development

1. Clone the repository
```bash
git clone https://github.com/Fouad-Smaoui/ORentit.git
cd ORentit
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file based on `.env.example`
```bash
cp .env.example .env
```

4. Add your Supabase credentials to `.env`

5. Start the development server
```bash
npm run dev
```

## Deployment

### Vercel Deployment

1. Push your code to GitHub

2. Visit [Vercel](https://vercel.com) and create a new project

3. Import your GitHub repository

4. Configure the following environment variables in Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

5. Deploy!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.