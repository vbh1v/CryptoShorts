// CryptoShorts Web Version
(function() {
  'use strict';
  
  // Fallback news data
  const fallbackNews = [
    {
      id: '1',
      title: 'Bitcoin Surges Past $45,000 as Market Sentiment Improves',
      description: 'The world\'s largest cryptocurrency gains momentum following positive regulatory developments and increased institutional interest in digital assets.',
      url: 'https://coingecko.com',
      source: 'CoinGecko',
      coins: ['bitcoin']
    },
    {
      id: '2',
      title: 'Ethereum Upgrade Shows Promise for Scalability',
      description: 'Latest network improvements demonstrate significant reduction in gas fees, making DeFi applications more accessible to mainstream users worldwide.',
      url: 'https://ethereum.org',
      source: 'Ethereum Foundation',
      coins: ['ethereum']
    },
    {
      id: '3',
      title: 'Solana Network Processes Record Transaction Volume',
      description: 'High-performance blockchain achieves new milestone with over 65,000 transactions per second, showcasing its potential for mass adoption.',
      url: 'https://solana.com',
      source: 'Solana Labs',
      coins: ['solana']
    }
  ];
  
  // Get gradient based on coin type
  function getGradientClass(coins) {
    if (!coins || coins.length === 0) return 'default-gradient';
    const coin = coins[0].toLowerCase();
    switch (coin) {
      case 'bitcoin':
      case 'btc':
        return 'bitcoin-gradient';
      case 'ethereum':
      case 'eth':
        return 'ethereum-gradient';
      default:
        return 'default-gradient';
    }
  }
  
  // Fetch news from CoinGecko API
  async function fetchNews() {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/news?page=1');
      if (!response.ok) throw new Error('API error');
      
      const data = await response.json();
      const items = data.data || [];
      
      if (items.length === 0) return fallbackNews;
      
      return items.slice(0, 10).map(item => {
        // Handle missing or short descriptions
        let description = item.description || '';
        
        // If description is too short or empty, create one from the title
        if (description.length < 50) {
          description = `Read the full story about ${item.title.toLowerCase()} on ${item.news_site}. Stay updated with the latest cryptocurrency news and market insights.`;
        }
        
        return {
          id: String(item.id),
          title: item.title,
          description: truncateToWords(description, 60),
          url: item.url,
          source: item.news_site,
          coins: extractCoins(item.title, item.description || '')
        };
      });
    } catch (error) {
      console.warn('Using fallback news:', error);
      return fallbackNews;
    }
  }
  
  // Extract coin names from text
  function extractCoins(title, description) {
    const coinKeywords = [
      'bitcoin', 'btc', 'ethereum', 'eth', 'solana', 'sol',
      'cardano', 'ada', 'ripple', 'xrp', 'dogecoin', 'doge',
      'polkadot', 'dot', 'avalanche', 'avax', 'polygon', 'matic'
    ];
    
    const text = `${title} ${description}`.toLowerCase();
    return coinKeywords.filter(coin => text.includes(coin));
  }
  
  // Truncate text to word count
  function truncateToWords(text, maxWords) {
    const words = text.split(/\s+/);
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '...';
  }
  
  // Create news card HTML
  function createNewsCard(article) {
    const gradientClass = getGradientClass(article.coins);
    
    return `
      <div class="news-card">
        <div class="gradient-bg ${gradientClass}"></div>
        <div class="content">
          <h2 class="headline" data-url="${article.url || '#'}">${article.title}</h2>
          <p class="summary">${article.description}</p>
          <p class="source">${article.source}</p>
        </div>
        <button class="share-button" onclick="navigator.share({title: '${article.title.replace(/'/g, "\\'")}', text: '${article.description.replace(/'/g, "\\'")}', url: '${article.url || ''}'}).catch(() => {})">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M21 12L14 5V9C7 10 4 15 3 20C5.5 16.5 9 14.9 14 14.9V19L21 12Z" fill="white"/>
          </svg>
        </button>
      </div>
    `;
  }
  
  // Initialize the app
  async function init() {
    const container = document.getElementById('container');
    if (!container) return;
    
    // Show loading state
    container.innerHTML = '<div class="news-card"><div class="content"><h2 class="headline">Loading crypto news...</h2></div></div>';
    
    // Fetch and render news
    const news = await fetchNews();
    container.innerHTML = news.map(article => createNewsCard(article)).join('');
    
    // Add click handlers to headlines
    document.querySelectorAll('.headline').forEach(headline => {
      headline.style.cursor = 'pointer';
      headline.addEventListener('click', function() {
        const url = this.getAttribute('data-url');
        if (url && url !== '#') {
          // Open in iframe overlay for in-app browsing
          openInAppBrowser(url);
        }
      });
    });
  }
  
  // Open URL in in-app browser (iframe overlay)
  function openInAppBrowser(url) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: #000;
      z-index: 9999;
      display: flex;
      flex-direction: column;
    `;
    
    // Create header with close button
    const header = document.createElement('div');
    header.style.cssText = `
      height: 60px;
      background: #111;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      border-bottom: 1px solid #333;
    `;
    
    const urlDisplay = document.createElement('div');
    urlDisplay.textContent = new URL(url).hostname;
    urlDisplay.style.cssText = `
      color: #fff;
      font-size: 14px;
      opacity: 0.8;
    `;
    
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '✕';
    closeButton.style.cssText = `
      background: none;
      border: none;
      color: #fff;
      font-size: 24px;
      cursor: pointer;
      padding: 10px;
    `;
    closeButton.onclick = () => document.body.removeChild(overlay);
    
    header.appendChild(urlDisplay);
    header.appendChild(closeButton);
    
    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.style.cssText = `
      flex: 1;
      width: 100%;
      border: none;
      background: #fff;
    `;
    
    overlay.appendChild(header);
    overlay.appendChild(iframe);
    document.body.appendChild(overlay);
  }
  
  // Wait for DOM and initialize
  if (document.readyState !== 'loading') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();