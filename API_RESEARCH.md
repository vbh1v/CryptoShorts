# Crypto News API Research

Research into free/freemium APIs for crypto news, to supplement or replace the current CoinGecko news endpoint used in CryptoShorts.

## Comparison Table

| API | Auth Required | Free Tier | Rate Limit (Free) | News Fields | Image Support | Pagination | Best For |
|-----|---------------|-----------|-------------------|-------------|---------------|------------|----------|
| **CoinGecko** (current) | No | Yes | 5-15 calls/min | title, description, image, source, date, url | Yes (thumb_2x) | `?page=N` | Already integrated |
| **CryptoPanic** | API key (free) | Yes | ~Limited/day | title, url, domain, published_at, votes, currencies | No (no description/body) | `?page=N` | Sentiment & trending |
| **CryptoCompare** | API key (free) | Yes | ~100K calls/month | title, body, imageurl, source, url, published_on, categories | Yes | Feed-based | Rich article content |
| **Free Crypto News** | No | Yes | 1 req/sec | title, description, image, source, url, date | Yes | `?limit=N` | Zero-config, full featured |
| **NewsData.io** | API key (free) | Yes (limited) | 200 credits/day | title, description, image_url, source, pubDate, link, sentiment, coin | Yes | cursor-based | Sentiment analysis |
| **CryptoNews API** | API key (free trial) | Trial only | Unknown | title, description, image_url, source, date, url, sentiment, tickers | Yes | `?items=N` | Ticker-based filtering |
| **Messari** | API key (free) | Yes (limited) | Unknown | title, author, published_at, url | No images/body | Page-based | Asset-specific research |

### Recommendation Summary

**Top pick for CryptoShorts: Free Crypto News API** -- no key required, has all needed fields (title, description, image, source, date, url), generous rate limits, and good documentation. **CryptoCompare** is the strongest key-based alternative with rich content fields. **CryptoPanic** is good for trending/sentiment but lacks article descriptions on the free tier.

---

## 1. CoinGecko News API (Current)

**Website:** https://www.coingecko.com/en/api
**Base URL:** `https://api.coingecko.com/api/v3`
**Docs:** https://docs.coingecko.com/reference/introduction

### Authentication
- No API key required for the public plan
- Optional: Free "Demo" plan API key provides more stable rate limits

### Endpoint
```
GET https://api.coingecko.com/api/v3/news?page=1
```

### Response Format
```json
{
  "data": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "url": "string",
      "thumb_2x": "string (image URL)",
      "news_site": "string (source name)",
      "created_at": 1234567890
    }
  ]
}
```

**Fields:** id, title, description, url, thumb_2x (image), news_site (source), created_at (unix timestamp)

### Rate Limits
- **Public (no key):** 5-15 calls/min depending on global usage
- **Demo (free key):** 30 calls/min, 10,000 calls/month

### Pagination
- Query parameter: `?page=1`, `?page=2`, etc.

### Pros
- Already integrated in the app
- No API key needed
- Includes images
- Has description/summary text

### Cons
- Aggressive rate limiting on free tier (5-15/min)
- News endpoint not prominently documented (may be unstable)
- No sentiment data
- No filtering by coin/ticker

---

## 2. CryptoPanic API

**Website:** https://cryptopanic.com
**Base URL:** `https://cryptopanic.com/api/v1`
**Docs:** https://cryptopanic.com/developers/api/

### Authentication
- **Required:** Free API key (auth_token)
- **How to get:** Register at https://cryptopanic.com/developers/api/keys
- Free tier is available immediately after registration

### Endpoint
```
GET https://cryptopanic.com/api/v1/posts/?auth_token=YOUR_KEY&filter=hot&currencies=BTC,ETH
```

### Query Parameters
| Param | Values | Description |
|-------|--------|-------------|
| `auth_token` | string | Required API key |
| `filter` | hot, rising, bullish, bearish, important | Filter by trending/sentiment |
| `currencies` | BTC,ETH,SOL... | Filter by coin symbols |
| `regions` | en, de, es... | Language filter |
| `kind` | news, media | Content type |
| `public` | true | Public posts only |
| `page` | integer | Pagination |

### Response Format
```json
{
  "count": 200,
  "results": [
    {
      "id": 12345,
      "title": "Bitcoin breaks $100k",
      "published_at": "2025-01-15T10:30:00Z",
      "url": "https://cryptopanic.com/news/...",
      "source": {
        "title": "CoinDesk",
        "domain": "coindesk.com"
      },
      "currencies": [
        {
          "code": "BTC",
          "title": "Bitcoin"
        }
      ],
      "votes": { "positive": 5, "negative": 1 },
      "kind": "news"
    }
  ]
}
```

**Fields:** id, title, published_at, url, source (title + domain), currencies, votes, kind, slug

### Rate Limits
- Free tier allows a limited number of requests per day (exact number not publicly documented, reported ~100/day by community)
- Caching recommended (1 hour intervals)

### Pagination
- `?page=N` query parameter

### Pros
- Excellent filtering (hot, rising, bullish, bearish)
- Sentiment data via votes and filters
- Currency/ticker filtering
- Well-established aggregator with many sources
- Community-driven sentiment scoring

### Cons
- **No article description/body on free tier** -- only title and link
- No image URLs in the response
- Requires API key (though free)
- Rate limits not clearly documented
- Missing body text means we cannot show 60-word summaries without scraping the linked article

### Verdict for CryptoShorts
**Partial fit.** The lack of description/body text on the free tier is a significant limitation for our TikTok-style cards, which need a summary. Could be used for trending/sentiment signals but not as a primary content source.

---

## 3. CryptoCompare News API (now CCData/CoinDesk)

**Website:** https://www.cryptocompare.com
**Base URL:** `https://min-api.cryptocompare.com` (redirects to developers.coindesk.com)
**Docs:** https://developers.coindesk.com/documentation/legacy/News/

> **Note:** CryptoCompare has been acquired by CoinDesk/CCData. The legacy API still works but redirects to CoinDesk's developer portal.

### Authentication
- Works without an API key (with reduced limits)
- Free API key available at https://www.cryptocompare.com/cryptopian/api-keys
- Must attribute CryptoCompare if using free tier

### Endpoint
```
GET https://min-api.cryptocompare.com/data/v2/news/?lang=EN
GET https://min-api.cryptocompare.com/data/v2/news/?categories=BTC,ETH&feeds=cointelegraph,coindesk
```

### Query Parameters
| Param | Description |
|-------|-------------|
| `lang` | Language (EN, ES, PT, etc.) |
| `feeds` | Filter by source (cointelegraph, coindesk, etc.) |
| `categories` | Filter by coin/category |
| `sortOrder` | Sort: latest, popular |
| `extraParams` | Your app name (for attribution) |

### Response Format
```json
{
  "Type": 100,
  "Message": "News list successfully returned",
  "Data": [
    {
      "id": "7407988",
      "guid": "https://...",
      "published_on": 1635621851,
      "imageurl": "https://images.cryptocompare.com/news/...",
      "title": "Article title",
      "url": "https://full-article-url.com",
      "body": "Full article body text...",
      "tags": "BTC|ETH|Regulation",
      "categories": "BTC|Trading",
      "source": "CoinTelegraph",
      "source_info": {
        "name": "CoinTelegraph",
        "img": "https://...",
        "lang": "EN"
      }
    }
  ]
}
```

**Fields:** id, guid, published_on (unix timestamp), imageurl, title, url, body, tags, categories, source, source_info (name, img, lang)

### Rate Limits
- **Without key:** Gradually reduced over time (currently ~few thousand calls/day)
- **With free key:** ~100,000 calls/month (~3,300/day)
- Rate limits tracked per second, minute, hour, day, month

### Pagination
- Feed-based (returns latest batch, no explicit page parameter for news)
- Returns ~50 articles per request

### Pros
- **Rich content:** Full body text, images, tags, categories
- Works without API key
- Good image URLs for article thumbnails
- Source filtering (choose quality sources)
- Language filtering
- 100K free calls/month is very generous

### Cons
- API is in "legacy" status under CoinDesk -- future uncertain
- No explicit pagination (returns latest batch)
- Attribution required on free tier
- Body text may be very long (needs truncation)
- No sentiment data

### Verdict for CryptoShorts
**Strong fit.** Has all fields we need: title, body (for 60-word summary), images, source, date. The 100K monthly calls are more than enough. The main risk is the "legacy" API status under the CoinDesk transition.

---

## 4. Free Crypto News API

**Website:** https://github.com/nirholas/free-crypto-news
**Base URL:** `https://news-crypto.vercel.app`
**Docs:** GitHub README + OpenAPI spec at `/api/openapi.json`

### Authentication
**No API key required.** Completely free and open.

### Endpoints
| Endpoint | Description |
|----------|-------------|
| `/api/news` | Latest crypto news articles |
| `/api/news/international` | News from 75+ international sources with translation |
| `/api/archive` | Historical articles (662,000+ from 2017-2025) |
| `/api/search` | Full-text search across articles |
| `/api/ai/sentiment` | Sentiment analysis for specific assets |
| `/api/market/fear-greed` | Fear & Greed Index |
| `/api/summarize` | AI-powered news summaries |
| `/api/stream` | Real-time updates via Server-Sent Events |
| `/api/ask` | Ask questions about current crypto news |

### Example Request
```
GET https://news-crypto.vercel.app/api/news?limit=10
```

### Response Format
```json
[
  {
    "title": "Article headline",
    "description": "Article summary text",
    "source": "CoinDesk",
    "image": "https://image-url.com/...",
    "url": "https://full-article-url.com",
    "date": "2025-01-15T10:30:00Z"
  }
]
```

**Fields:** title, description, image, source, url, date

### Rate Limits
- "Unlimited" with rate-limiting at 1 request per second to respect upstream sources
- No API key = no account management overhead

### Pagination
- `?limit=N` parameter to control number of results
- Archive endpoint supports `?date=`, `?ticker=`, `?q=` filters

### Pros
- **No API key required** -- zero setup
- All fields we need: title, description, image, source, date, url
- AI-powered features (sentiment, summarization)
- International sources with translations
- Large historical archive
- SSE streaming for real-time updates
- SDKs in Python, TypeScript, Go, React, PHP
- Open source project

### Cons
- Hosted on Vercel free tier -- reliability/uptime concerns for production
- Relatively new/unproven project
- Depends on upstream news sources (could break if they change)
- Community-maintained, not a commercial API
- 1 req/sec limit means no burst fetching

### Verdict for CryptoShorts
**Excellent fit for MVP.** Has every field we need with zero configuration. The `/api/summarize` endpoint could even help with our 60-word truncation. Main concern is long-term reliability since it is a community project on Vercel, but perfect for development and early users.

---

## 5. NewsData.io

**Website:** https://newsdata.io
**Base URL:** `https://newsdata.io/api/1`
**Docs:** https://newsdata.io/documentation

### Authentication
- **Required:** API key
- **How to get:** Register at https://newsdata.io (up to 5 API keys)
- Free plan available

### Endpoint
```
GET https://newsdata.io/api/1/crypto?apikey=YOUR_KEY&coin=bitcoin,ethereum
```

Also has a general latest endpoint:
```
GET https://newsdata.io/api/1/latest?apikey=YOUR_KEY&category=business&q=crypto
```

### Query Parameters (Crypto Endpoint)
| Param | Description |
|-------|-------------|
| `apikey` | Required API key |
| `coin` | Coin names (up to 5 on free plan) |
| `language` | Language filter |
| `sentiment` | Filter by positive/negative/neutral |
| `tag` | Filter by tags |

### Response Format
```json
{
  "status": "success",
  "totalResults": 100,
  "results": [
    {
      "article_id": "unique-id",
      "title": "Article title",
      "description": "Article summary",
      "link": "https://full-article-url.com",
      "image_url": "https://image-url.com/...",
      "source_id": "coindesk",
      "source_name": "CoinDesk",
      "pubDate": "2025-01-15 10:30:00",
      "sentiment": "positive",
      "coin": ["BTC", "ETH"],
      "language": "english",
      "category": ["crypto"]
    }
  ],
  "nextPage": "cursor-string-for-pagination"
}
```

**Fields:** article_id, title, description, link, image_url, source_id, source_name, pubDate, sentiment, coin, language, category

### Rate Limits (Free Plan)
- **200 credits/day** (1 credit = 1 request = 10 articles)
- **30 credits per 15 minutes**
- Up to 5 coins per query
- **12-hour delay** on articles for free users (real-time for paid)

### Pagination
- Cursor-based: `nextPage` field in response, pass as `?page=cursor_value`

### Pros
- Dedicated crypto endpoint with coin filtering
- Built-in sentiment analysis
- Rich response fields (title, description, image, source, date, sentiment, coins)
- Clean, well-documented API
- Cursor-based pagination (reliable)

### Cons
- **12-hour delay on free tier** -- articles are not real-time
- Only 200 credits/day (2,000 articles/day max)
- Only 5 coins per query on free plan
- Requires registration and API key
- General news API (crypto is one category, not the focus)

### Verdict for CryptoShorts
**Moderate fit.** The 12-hour delay is a significant drawback for a "news" app. Good fields including sentiment, but the delay and limited free credits make it less suitable as a primary source. Could be useful as a supplementary source for sentiment-enriched content.

---

## 6. CryptoNews API

**Website:** https://cryptonews-api.com
**Base URL:** `https://cryptonews-api.com/api/v1`
**Docs:** https://cryptonews-api.com (on-site documentation)

### Authentication
- **Required:** API token
- **How to get:** Register at https://cryptonews-api.com/register
- Free trial available (demo token)

### Endpoint
```
GET https://cryptonews-api.com/api/v1?tickers=BTC,ETH&items=10&token=YOUR_TOKEN
```

### Query Parameters
| Param | Description |
|-------|-------------|
| `tickers` | Cryptocurrency symbols (required) |
| `items` | Number of results |
| `token` | API token (required) |
| `date` | Date filter |
| `page` | Page number |

### Response Format
```json
{
  "data": [
    {
      "title": "Article title",
      "text": "Article body/description",
      "image_url": "https://...",
      "source_name": "CoinTelegraph",
      "date": "2025-01-15T10:30:00Z",
      "news_url": "https://...",
      "tickers": ["BTC", "ETH"],
      "sentiment": "positive",
      "type": "Article"
    }
  ],
  "total_pages": 10
}
```

**Fields:** title, text, image_url, source_name, date, news_url, tickers, sentiment, type

### Rate Limits
- Demo/trial token with limited requests
- Specific rate limits not publicly documented
- 50+ news sources, 5000+ monthly articles

### Pagination
- `?items=N` for result count
- `?page=N` for pagination

### Pros
- Ticker-based filtering (BTC, ETH, etc.)
- Sentiment analysis included
- Full article text/description
- Image URLs
- 50+ news sources
- Historical data back to December 2020
- Specialized endpoints (trending, events, top mentions)

### Cons
- **Free tier is a trial only** -- paid plans required for production
- Rate limits not transparent
- Pricing not publicly listed
- Smaller company, unclear long-term stability

### Verdict for CryptoShorts
**Good features, but cost is a concern.** The response format is ideal for our use case with all needed fields plus sentiment. However, the trial-only free tier means this would require a paid subscription for production use.

---

## 7. Messari API

**Website:** https://messari.io/api
**Base URL:** `https://data.messari.io/api/v1`
**Docs:** https://docs.messari.io

### Authentication
- **Required:** API key
- **How to get:** Register at messari.io, generate key in Account Settings
- Free tier available for basic endpoints

### Endpoint
```
GET https://data.messari.io/api/v1/news
GET https://data.messari.io/api/v1/news/:assetKey
```

### Response Format
```json
{
  "status": {
    "elapsed": 10,
    "timestamp": "2025-01-15T10:30:00Z"
  },
  "data": [
    {
      "id": "unique-id",
      "title": "Article title",
      "author": {
        "name": "Author Name"
      },
      "published_at": "2025-01-15T10:30:00Z",
      "url": "https://full-article-url.com",
      "references": [
        { "name": "Bitcoin", "slug": "bitcoin" }
      ]
    }
  ]
}
```

**Fields:** id, title, author, published_at, url, references (asset tags)

### Rate Limits
- Free tier: limited (exact limits not publicly documented, estimated ~20 requests/min)
- For expanded access, contact sales@messari.io

### Pagination
- Page-based: `?page=N`

### Pros
- Asset-specific news filtering
- Professional/institutional quality sources
- Good for research-grade content
- Author attribution

### Cons
- **No images in response**
- **No article body/description** -- only title and URL
- Limited free tier (need to contact sales for more)
- Documentation is sparse for free users
- Focused more on data/research than news aggregation

### Verdict for CryptoShorts
**Poor fit.** Missing critical fields (no images, no descriptions). Would require scraping linked articles to get any content for our cards. Better suited for institutional research tools, not consumer news apps.

---

## Integration Recommendations

### Strategy: Multi-Source with Fallback Chain

For CryptoShorts, I recommend a **primary + fallback** approach:

#### Primary Source: Free Crypto News API
```
GET https://news-crypto.vercel.app/api/news?limit=20
```
- Zero config, all needed fields, no API key
- Risk: community project reliability

#### Fallback 1: CryptoCompare (Legacy)
```
GET https://min-api.cryptocompare.com/data/v2/news/?lang=EN
```
- Rich content with images and full body text
- Generous 100K calls/month free tier
- Risk: "legacy" API status

#### Fallback 2: CoinGecko (Current)
```
GET https://api.coingecko.com/api/v3/news?page=1
```
- Already integrated
- No key needed
- Risk: aggressive rate limiting

#### Supplementary: CryptoPanic (for trending signals)
```
GET https://cryptopanic.com/api/v1/posts/?auth_token=KEY&filter=hot
```
- Use for trending/sentiment indicators, not primary content

### Implementation Notes

1. **Fallback chain** should try sources in order, catching errors and falling back
2. **Cache responses** for at least 5-10 minutes to respect rate limits
3. **Normalize responses** to a common `NewsArticle` interface (already defined in `types/news.ts`)
4. **Truncate** all body/description text to 60 words using existing `truncateToWords()` function
5. **Extract coins** from any API's title/body using existing `extractCoins()` function for gradient fallbacks
