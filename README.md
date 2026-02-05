# CryptoShorts

A TikTok-style crypto news app that lets you swipe through the latest cryptocurrency news.

🚀 **Live Demo**: [https://cryptoshorts.vercel.app](https://cryptoshorts.vercel.app)

## Features

- 📱 **TikTok-style Interface**: Swipe up/down to navigate between news articles
- 🎯 **Snap Scrolling**: Each swipe takes you exactly to the next news card
- 🌙 **Dark Mode**: Optimized for comfortable reading
- 📰 **Real-time News**: Fetches latest crypto news from CoinGecko API
- 🎨 **Beautiful Gradients**: Each coin type has its own color scheme
- 📱 **Mobile Optimized**: Works perfectly on all devices

## Tech Stack

- **Framework**: React Native / Expo
- **Platform**: Web (React Native Web)
- **Styling**: React Native StyleSheet
- **API**: CoinGecko News API
- **Deployment**: Vercel

## Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/vbh1v/CryptoShorts.git
cd CryptoShorts

# Install dependencies
npm install
```

### Running Locally

```bash
# Start the development server
npm start

# Open web version
# Press 'w' in the terminal or visit http://localhost:8081
```

### Building for Production

```bash
# Build web version
npx expo export --platform web --output-dir web-build

# The built files will be in web-build/
```

## Deployment

The app is configured for easy deployment on Vercel:

1. Fork this repository
2. Import it on [Vercel](https://vercel.com)
3. Deploy with default settings

## Features Implemented

- ✅ Full-screen news cards with gradients
- ✅ Vertical snap scrolling (TikTok-style)
- ✅ Pull-to-refresh for latest news
- ✅ Infinite scroll (auto-loads more content)
- ✅ Clickable headlines to read full articles
- ✅ In-app browser for seamless reading
- ✅ Bottom navigation bar
- ✅ Share functionality on each card
- ✅ Fallback news data for reliability
- ✅ Error handling and loading states
- ✅ Responsive design for all devices

## Contributing

Feel free to open issues or submit pull requests!

## License

MIT