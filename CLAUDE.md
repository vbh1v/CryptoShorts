# CryptoShorts

TikTok-style mobile app for crypto news in under 60 words.

## Quick Start

```bash
npx expo start        # Start dev server
npx expo start --web  # Run in browser
npx expo start --ios  # iOS simulator (requires Xcode)
```

## Architecture

```
app/                  # Expo Router screens
├── _layout.tsx       # Root layout with SafeAreaProvider
└── index.tsx         # Main feed with FlatList snap scroll

components/
├── NewsCard.tsx      # Full-screen news card (image + headline + summary)
├── ShareButton.tsx   # Native share functionality
└── SwipeHint.tsx     # First-time user bounce animation

hooks/
└── useNews.ts        # Data fetching with loading/error states

services/
├── coingecko.ts      # CoinGecko API - fetches news, extracts coins, truncates to 60 words
└── unsplash.ts       # Gradient fallbacks by coin (Bitcoin orange, Ethereum blue, etc.)

types/
└── news.ts           # NewsArticle, CoinGeckoNewsItem interfaces
```

## Key Patterns

- **Snap scroll**: FlatList with `pagingEnabled` and `snapToInterval={screenHeight}`
- **60-word limit**: `truncateToWords()` in coingecko.ts
- **Coin detection**: Keyword matching for gradient fallbacks
- **Image fallback**: Article image → Unsplash → Gradient with coin icon

## APIs

**CoinGecko News** (free, no key required):
```
GET https://api.coingecko.com/api/v3/news?page=1
```

**Unsplash** (optional, needs API key):
- Currently using gradient fallbacks
- Uncomment code in `services/unsplash.ts` to enable

## Tech Stack

- Expo SDK 54
- Expo Router (file-based routing)
- TypeScript
- react-native-reanimated (animations)
- expo-linear-gradient (gradient backgrounds)

## Design Decisions

- **Dark theme only** - Better for images, modern feel
- **No authentication** - MVP focuses on content consumption
- **Share only** - No bookmarks/likes to keep it simple
- **Portrait locked** - Optimized for vertical scrolling

## Adding Features

**New news source**: Add service in `services/`, update `useNews` hook

**New card element**: Modify `NewsCard.tsx`, keep it within the snap scroll height

**Pagination**: Add page tracking to `useNews`, fetch on scroll near end
