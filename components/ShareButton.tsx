import { TouchableOpacity, StyleSheet, Share, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ShareButtonProps {
  title: string;
  url: string;
}

export function ShareButton({ title, url }: ShareButtonProps) {
  const handleShare = async () => {
    try {
      await Share.share({
        message: `${title}\n\nRead more: ${url}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share');
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleShare}>
      <Ionicons name="share-outline" size={24} color="#fff" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
