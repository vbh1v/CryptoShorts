const UNSPLASH_ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY';

const CRYPTO_GRADIENTS = [
  ['#f7931a', '#ffb347'], // Bitcoin orange
  ['#627eea', '#a8c0ff'], // Ethereum blue
  ['#00ffa3', '#03e1ff'], // Solana gradient
  ['#e84142', '#ff6b6b'], // Avalanche red
  ['#8247e5', '#b490ff'], // Polygon purple
];

export function getGradientForCoin(coinName: string): string[] {
  const coinGradients: Record<string, string[]> = {
    bitcoin: CRYPTO_GRADIENTS[0],
    btc: CRYPTO_GRADIENTS[0],
    ethereum: CRYPTO_GRADIENTS[1],
    eth: CRYPTO_GRADIENTS[1],
    solana: CRYPTO_GRADIENTS[2],
    sol: CRYPTO_GRADIENTS[2],
    avalanche: CRYPTO_GRADIENTS[3],
    avax: CRYPTO_GRADIENTS[3],
    polygon: CRYPTO_GRADIENTS[4],
    matic: CRYPTO_GRADIENTS[4],
  };

  const lowerCoin = coinName.toLowerCase();
  return coinGradients[lowerCoin] || CRYPTO_GRADIENTS[Math.floor(Math.random() * CRYPTO_GRADIENTS.length)];
}

export async function fetchUnsplashImage(query: string): Promise<string | null> {
  // For MVP, we'll use gradient fallbacks instead of Unsplash API
  // to avoid requiring API key setup
  // Uncomment below when ready to integrate Unsplash

  /*
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    return data.results?.[0]?.urls?.regular || null;
  } catch {
    return null;
  }
  */

  return null;
}
