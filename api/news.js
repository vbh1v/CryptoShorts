// Vercel serverless function to proxy CoinGecko API and avoid CORS
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/news?page=1');
    const data = await response.json();
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    // Return empty data structure on error
    res.status(200).json({ data: [] });
  }
}