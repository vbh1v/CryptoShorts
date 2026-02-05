import { useState, useEffect, useCallback } from 'react';
import { NewsArticle } from '../types/news';
import { fetchNews } from '../services/coingecko';

interface UseNewsResult {
  articles: NewsArticle[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useNews(): UseNewsResult {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const news = await fetchNews();
      setArticles(news);
    } catch (err) {
      setError('Failed to load news. Pull down to retry.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  return {
    articles,
    loading,
    error,
    refresh: loadNews,
  };
}
