import { NewsArticle } from '../types/news';

const MESSARI_API = 'https://data.messari.io/api/v1';

interface MessariAuthor {
  name: string;
}

interface MessariReference {
  name: string;
  slug: string;
}

interface MessariNewsItem {
  id: string;
  title: string;
  author: MessariAuthor;
  published_at: string;
  url: string;
  references: MessariReference[];
}

interface MessariNewsResponse {
  status: { elapsed: number; timestamp: string };
  data: MessariNewsItem[];
}

function transformMessariItem(item: MessariNewsItem): NewsArticle {
  const source = item.author?.name || 'Messari';
  return {
    id: `messari-${item.id}`,
    title: item.title,
    description: `Read the full article at ${source}`,
    url: item.url,
    imageUrl: null,
    publishedAt: item.published_at,
    source,
    coins: (item.references || []).map(ref => ref.name),
  };
}

export async function fetchMessariNews(assetKey?: string): Promise<NewsArticle[]> {
  try {
    const url = assetKey
      ? `${MESSARI_API}/news/${encodeURIComponent(assetKey)}`
      : `${MESSARI_API}/news`;

    const response = await fetch(url);

    if (!response.ok) {
      console.warn(`Messari API returned ${response.status}`);
      return [];
    }

    const json: MessariNewsResponse = await response.json();
    const items = json.data || [];

    if (!items || items.length === 0) {
      return [];
    }

    return items.map(transformMessariItem);
  } catch (error) {
    console.error('Failed to fetch Messari news:', error);
    return [];
  }
}
