import { useState, useEffect } from 'react';
import { NewsArticle } from '../types/news';
import { fetchNews } from '../services/coingecko';

export function useNews() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNews = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching news...');
      const news = await fetchNews();
      console.log(`Loaded ${news.length} news articles`);
      setArticles(news);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load news';
      console.error('Error loading news:', err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  return {
    articles,
    loading,
    error,
    refresh: loadNews,
  };
}