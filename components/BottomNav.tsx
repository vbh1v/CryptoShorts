import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface BottomNavProps {
  activeTab?: 'home' | 'search' | 'profile';
  onTabPress?: (tab: 'home' | 'search' | 'profile') => void;
}

export function BottomNav({ activeTab = 'home', onTabPress }: BottomNavProps) {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.nav}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => onTabPress?.('search')}
        >
          <Ionicons 
            name={activeTab === 'search' ? 'search' : 'search-outline'} 
            size={24} 
            color={activeTab === 'search' ? '#fff' : 'rgba(255, 255, 255, 0.5)'}
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => onTabPress?.('home')}
        >
          <Ionicons 
            name={activeTab === 'home' ? 'home' : 'home-outline'} 
            size={24} 
            color={activeTab === 'home' ? '#fff' : 'rgba(255, 255, 255, 0.5)'}
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => onTabPress?.('profile')}
        >
          <Ionicons 
            name={activeTab === 'profile' ? 'person' : 'person-outline'} 
            size={24} 
            color={activeTab === 'profile' ? '#fff' : 'rgba(255, 255, 255, 0.5)'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  button: {
    padding: 8,
    minWidth: 48,
    alignItems: 'center',
  },
});