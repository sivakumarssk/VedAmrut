import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../src/components/home/Header';
import CategoryGrid from '../../src/components/home/CategoryGrid';
import BannerCarousel from '../../src/components/home/BannerCarousel';
import ProductSection from '../../src/components/home/ProductSection';
import { useState } from 'react';
import LoginPopup from '../../src/components/common/LoginPopup';
import {TouchableOpacity,Text} from 'react-native'
import { useLoginPopup } from '../../src/hooks/useLoginPopup';
import { Button } from 'react-native';
export default function HomeScreen() {
  //const [showLoginPopup, setShowLoginPopup] = useState(false);
  const { showLoginPopup } = useLoginPopup();
  return (
    <SafeAreaView style={{ flex: 1 ,
      backgroundColor: '#FFFFFF',
    }}>
        <ScrollView
    style={{ backgroundColor: '#FFFFFF' }}
    contentContainerStyle={{
      paddingBottom: 110, // space for floating tab
      backgroundColor: '#FFFFFF',
    }}
    showsVerticalScrollIndicator={false}
  >

  
        <Header />

        
         <CategoryGrid />
          <BannerCarousel />
          <ProductSection />

      </ScrollView>
    </SafeAreaView>
  );
}