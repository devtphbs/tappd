# Tappd - AI Receipt Scanner PWA

A mobile-first iOS PWA that lets users snap photos of receipts and price tags, uses AI to extract and understand the data, converts it to their home currency, and tracks spending intelligently.

## Features

### 📸 Smart Receipt Scanning
- **Camera Integration**: Take photos directly from your device camera
- **Gallery Upload**: Upload existing receipt images from your photo library
- **AI-Powered Extraction**: Uses Claude Vision to automatically extract:
  - Merchant name and location
  - Itemized list with prices
  - Subtotal, tax, and total amounts
  - Currency detection
  - Purchase date
  - Automatic categorization (food, travel, shopping, etc.)

### 💳 Intelligent Spending Tracking
- **Local Storage**: All data stored locally using IndexedDB - no login required
- **Advanced Filtering**: Filter by category, date range, currency, or search merchants/items
- **Detailed Views**: Expand receipts to see full itemized breakdowns
- **Swipe to Delete**: Quick deletion of unwanted entries

### 📊 Overview & Analytics
- **Monthly Summaries**: Track total spending with month-over-month comparisons
- **Category Breakdowns**: Visual spending breakdown by category with progress bars
- **Budget Tracking**: Set per-category budgets with color-coded warnings
- **Daily Spending Charts**: Sparkline graphs showing spending patterns throughout the month

### 🤖 AI Chat Assistant
- **"Ask Tappd"**: Floating chat button accessible from any tab
- **Natural Language Queries**: Ask questions like:
  - "How much did I spend on food this month?"
  - "What was my biggest purchase last week?"
  - "Am I over my budget?"
- **Context-Aware Responses**: Claude has full access to your spending history for personalized insights

### 💱 Currency Conversion
- **Auto-Detection**: Automatically detects receipt currency
- **Real-Time Conversion**: Converts to your home currency using ExchangeRate-API
- **Multi-Currency Support**: Support for USD, EUR, GBP, JPY, CAD, AUD, and more

### 📤 Data Export
- **CSV Export**: Export your complete spending history as CSV
- **Data Privacy**: All data stays on your device until you choose to export

### 📱 PWA Features
- **Offline Support**: Works without internet connection (except for AI analysis)
- **Installable**: Add to home screen for app-like experience
- **iOS Optimized**: Designed specifically for iOS with safe area insets and native feel
- **Responsive**: Works on all devices with mobile-first approach

## Tech Stack

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS with mobile-first design
- **Storage**: IndexedDB (via idb library)
- **AI**: Anthropic Claude Vision via Requesty API
- **Currency**: ExchangeRate-API for live rates
- **PWA**: Vite PWA plugin with Workbox
- **Deployment**: Vercel

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/devtphbs/tappd.git
cd tappd
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Requesty API key:
```
VITE_REQUESTY_API_KEY=your_requesty_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## API Keys Required

### Requesty API (for Claude Vision)
1. Sign up at [Requesty](https://requesty.ai)
2. Get your API key
3. Add it to your `.env` file as `VITE_REQUESTY_API_KEY`

### ExchangeRate-API (Free Tier)
- No API key required for free tier
- Automatically used for currency conversion

## Project Structure

```
src/
├── components/          # React components
│   ├── ScanTab.jsx     # Camera and receipt scanning
│   ├── LogTab.jsx      # Receipt history and filtering
│   ├── OverviewTab.jsx # Analytics and budget tracking
│   ├── ChatModal.jsx   # AI chat interface
│   └── ChatButton.jsx  # Floating chat button
├── db.js               # IndexedDB operations
├── api.js              # External API calls (Claude, exchange rates)
├── App.jsx             # Main app component
├── main.jsx            # App entry point
└── index.css           # Global styles
```

## Features Status

✅ **Completed**
- Core PWA setup with Vite + React
- Mobile-first iOS design with Tailwind CSS
- IndexedDB for local data storage
- Camera access and image upload
- Receipt scanning UI
- Spending log with filtering and search
- Overview with charts and budget tracking
- AI chat assistant interface
- CSV export functionality
- Claude Vision API integration
- Currency conversion setup

🚧 **In Progress**
- Advanced AI chat context optimization
- Budget alerts and notifications
- Dark mode support

🔮 **Planned**
- Receipt image thumbnails in storage
- Spending insights and recommendations
- Monthly reports
- Multiple currency home settings
- Data backup and sync

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Privacy & Security

- **Local First**: All data is stored locally on your device
- **No Tracking**: No analytics or tracking scripts
- **Privacy Focused**: Receipt images are only sent to AI for analysis and not stored elsewhere
- **Secure**: API calls are made over HTTPS with proper authentication

## Support

If you have any questions or run into issues, please:
1. Check the [Issues](https://github.com/devtphbs/tappd/issues) page
2. Create a new issue with detailed information
3. Join our discussions for feature requests

---

Made with ❤️ for smart spending tracking
