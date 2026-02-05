# CryptoShorts MVP Design

A TikTok-style mobile app for consuming crypto news in under 60 words per article.

## Core Concept

Vertical snap-scroll feed where each swipe reveals a new crypto news story. Full-screen cards with eye-catching images, clickbait headlines, and bite-sized summaries.

## Technical Stack

- **Framework:** React Native with Expo
- **News API:** CoinGecko News (free tier)
- **Fallback Images:** Unsplash API
- **Navigation:** Expo Router (minimal)
- **Animations:** react-native-reanimated

## Project Structure

```
CryptoShorts/
├── app/
│   └── index.tsx           # Main feed screen
├── components/
│   ├── NewsCard.tsx        # Full-screen news item
│   ├── ShareButton.tsx     # Floating share action
│   └── SwipeHint.tsx       # First-time user indicator
├── services/
│   ├── coingecko.ts        # News API integration
│   └── unsplash.ts         # Fallback image fetching
├── hooks/
│   └── useNews.ts          # Data fetching & pagination
└── types/
    └── news.ts             # TypeScript interfaces
```

## Screen Layout

Each NewsCard occupies 100% viewport:

```
┌─────────────────────────────┐
│                             │
│         HEADER IMAGE        │
│          (40% height)       │
│                             │
├─────────────────────────────┤
│                             │
│  CLICKBAIT HEADLINE         │
│  Bold, 24-28px, max 3 lines │
│                             │
├─────────────────────────────┤
│                             │
│  News summary text here     │
│  in 60 words or less.       │
│  Clean, readable, 16-18px.  │
│                             │
│                       [↗]   │
└─────────────────────────────┘
```

## Data Flow

1. App launches → fetch first batch (10-15 articles) from CoinGecko
2. For articles missing images → async fetch from Unsplash using coin keywords
3. User scrolls → prefetch next batch when 3 articles from end
4. Share tapped → native share sheet with headline + link

## Image Fallback Logic

1. Use article's `thumb` or `image` field if available
2. Extract coin name → fetch from Unsplash with that keyword
3. Final fallback → gradient background with coin icon

## Visual Design

- Dark theme (easier on eyes, makes images pop)
- Gradient overlay on images for text legibility
- Sans-serif typography, white on dark, generous line height
- Share button: semi-transparent circle, bottom-right with safe area padding

## Error Handling

| Scenario | Response |
|----------|----------|
| Initial load fails | Full-screen retry state |
| Pagination fails | Silent retry, keep reading cached |
| Image fails | Fall to next fallback |
| No news available | "All caught up" with pull-to-refresh |
| API rate limited | Show cached articles |

## Edge Cases

- Headline > 3 lines → truncate with ellipsis
- Summary > 60 words → truncate at 60 words
- No coin reference → use generic "crypto" for Unsplash

## Performance

- Preload next 2 images while reading current
- FlatList `windowSize` limits rendered items
- Keep NewsCard render lightweight

## MVP Scope

### In Scope

- Full-screen snap scroll feed
- CoinGecko news integration
- Unsplash fallback images
- Native share functionality
- Dark theme UI
- Basic caching for offline
- Error states with retry
- First-time swipe hint

### Out of Scope

- User accounts / auth
- Bookmarks / saved articles
- Push notifications
- Likes / reactions
- Comments
- Search / filtering
- Light theme
- Analytics
- AI-generated headlines

## Success Criteria

1. Swipe through 20+ articles smoothly
2. Each article loads with image within 1 second
3. Share button opens native share sheet
4. Graceful offline/error handling

## Dependencies

```json
{
  "expo": "~50.x",
  "expo-router": "~3.x",
  "react-native-reanimated": "~3.x",
  "expo-sharing": "~11.x"
}
```
