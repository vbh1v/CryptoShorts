import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NewsArticle } from '../types/news';

const STORAGE_KEY = 'bookmarked_articles';

export function useBookmarks() {
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [bookmarkedArticles, setBookmarkedArticles] = useState<NewsArticle[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const articles: NewsArticle[] = JSON.parse(stored);
          setBookmarkedArticles(articles);
          setBookmarkedIds(new Set(articles.map(a => a.id)));
        }
      } catch (err) {
        console.error('Failed to load bookmarks:', err);
      }
    };
    load();
  }, []);

  const toggleBookmark = useCallback(async (article: NewsArticle) => {
    try {
      setBookmarkedIds(prev => {
        const next = new Set(prev);
        if (next.has(article.id)) {
          next.delete(article.id);
        } else {
          next.add(article.id);
        }
        return next;
      });

      setBookmarkedArticles(prev => {
        let next: NewsArticle[];
        if (prev.some(a => a.id === article.id)) {
          next = prev.filter(a => a.id !== article.id);
        } else {
          next = [article, ...prev];
        }
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  }, []);

  const isBookmarked = useCallback((id: string) => {
    return bookmarkedIds.has(id);
  }, [bookmarkedIds]);

  return { bookmarkedArticles, toggleBookmark, isBookmarked };
}
