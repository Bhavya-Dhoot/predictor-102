# Predictor 101: Financial Index Prediction Web App

Predictor 101 predicts end-of-day closes for financial indices using real-time data and Google Gemini ML. Built with Next.js (App Router), Tailwind CSS, and ready for Vercel deployment.

## Features
- Real-time market data & charts
- Google Gemini ML predictions with confidence ratings
- Clean, responsive UI (dark mode)
- Settings: API config, sensitivity, UI
- Extensible architecture for advanced features

## Getting Started

1. **Clone the repo**
    ```bash
    git clone <your-repo-url>
    cd predictor-101
    npm install
    ```
2. **Configure Environment Variables**
    - Copy `.env.example` to `.env.local` and fill in your API keys.
3. **Run Locally**
    ```bash
    npm run dev
    ```

## Scripts
- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm start` — Start production server

## Project Structure
- `/app` - Next.js pages (App Router)
- `/components` - UI components
- `/lib` - API clients, utilities, caching
- `/types` - TypeScript types
- `/tests` - Unit tests

## Environment Variables
See `.env.example` for required keys.

## API Reference
### Prediction
- `POST /api/predict` — Get a prediction for a given index symbol.
- `GET /api/export` — Download all predictions as CSV.
- `POST /api/notify/timer` — Set a timer and get notified by email.

### Market Data
- `GET /api/market?symbol=...` — Get current market data for a symbol.
- `GET /api/market/history?symbol=...` — Get historical data for a symbol.

## Deployment
- Deploy easily to [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/).
- Set environment variables in the deployment dashboard (never commit secrets).

## Code Quality & Best Practices
- **TypeScript strict mode** enabled
- Centralized fetch utility for all HTTP requests
- Robust error handling in API routes and client
- Unit tests for core logic and components (`/tests`)
- Environment variable validation at startup
- Accessible, reusable UI components (ARIA, keyboard nav)
- GitHub Actions CI for lint, test, and build
- Comments and docs for all complex logic

## Advanced Features Scaffolded
- Backtesting endpoint/page for prediction accuracy
- User account/auth integration ready (NextAuth.js)
- Notification & export utilities

## Contributing
Contributions are welcome! To contribute:
1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request
- See code comments and `/tests` for guidance
- PRs run full CI suite

## Testing
- Place tests in the `/tests` directory.
- Run tests with your preferred framework (e.g., Jest, Vitest).

## License
MIT

## Acknowledgments
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Google Gemini](https://ai.google.dev/gemini-api/docs)
- [Yahoo Finance API](https://finance.yahoo.com/)
