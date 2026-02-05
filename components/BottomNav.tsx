import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Platform-specific imports
let MagnifyingGlass: any, House: any, User: any;

if (Platform.OS === 'web') {
  // Use react-native-svg icons for web
  const Svg = require('react-native-svg').default;
  const { Path } = require('react-native-svg');
  
  MagnifyingGlass = ({ size = 24, color = '#fff', weight = 'regular' }: any) => (
    <Svg width={size} height={size} viewBox="0 0 256 256" fill="none">
      <Path
        d={weight === 'fill' 
          ? "M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"
          : "M232,232a8,8,0,0,1-5.66-2.34l-52.28-52.28a96,96,0,1,1,11.31-11.31l52.29,52.28A8,8,0,0,1,232,232ZM112,184a72,72,0,1,0-72-72A72.08,72.08,0,0,0,112,184Z"}
        fill={color}
        stroke={weight === 'regular' ? color : 'none'}
        strokeWidth={weight === 'regular' ? '16' : '0'}
      />
    </Svg>
  );
  
  House = ({ size = 24, color = '#fff', weight = 'regular' }: any) => (
    <Svg width={size} height={size} viewBox="0 0 256 256" fill="none">
      <Path
        d={weight === 'fill'
          ? "M224,115.54V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.54a16,16,0,0,1,5.17-11.78l80-75.48a16,16,0,0,1,21.66,0l80,75.48A16,16,0,0,1,224,115.54Z"
          : "M224,115.55V208a16,16,0,0,1-16,16H160a16,16,0,0,1-16-16V160H112v48a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48a16,16,0,0,1,21.66,0l80,75.48A16,16,0,0,1,224,115.55Z"}
        fill={color}
        stroke={weight === 'regular' ? color : 'none'}
        strokeWidth={weight === 'regular' ? '16' : '0'}
      />
    </Svg>
  );
  
  User = ({ size = 24, color = '#fff', weight = 'regular' }: any) => (
    <Svg width={size} height={size} viewBox="0 0 256 256" fill="none">
      <Path
        d={weight === 'fill'
          ? "M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"
          : "M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0c-27.39,8.94-50.86,27.82-66.09,54.16a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"}
        fill={color}
        stroke={weight === 'regular' ? color : 'none'}
        strokeWidth={weight === 'regular' ? '16' : '0'}
      />
    </Svg>
  );
} else {
  // Use phosphor-react-native for mobile
  const PhosphorIcons = require('phosphor-react-native');
  MagnifyingGlass = PhosphorIcons.MagnifyingGlass;
  House = PhosphorIcons.House;
  User = PhosphorIcons.User;
}

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
          <MagnifyingGlass 
            size={24} 
            weight={activeTab === 'search' ? 'fill' : 'regular'}
            color={activeTab === 'search' ? '#fff' : 'rgba(255, 255, 255, 0.5)'}
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => onTabPress?.('home')}
        >
          <House 
            size={24} 
            weight={activeTab === 'home' ? 'fill' : 'regular'}
            color={activeTab === 'home' ? '#fff' : 'rgba(255, 255, 255, 0.5)'}
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => onTabPress?.('profile')}
        >
          <User 
            size={24} 
            weight={activeTab === 'profile' ? 'fill' : 'regular'}
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