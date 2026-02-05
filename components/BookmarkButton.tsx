import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NewsArticle } from '../types/news';

interface BookmarkButtonProps {
  article: NewsArticle;
  isBookmarked: boolean;
  onToggle: () => void;
}

export function BookmarkButton({ article, isBookmarked, onToggle }: BookmarkButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onToggle}>
      <Ionicons
        name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
        size={24}
        color={isBookmarked ? '#FFD700' : '#fff'}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
