import { ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import BannerCarousel from '../../src/components/home/BannerCarousel';
import CategoryGrid from '../../src/components/home/CategoryGrid';
import Header from '../../src/components/home/Header';
import ProductSection from '../../src/components/home/ProductSection';
import { TAB_BAR_BOTTOM_MARGIN, TAB_BAR_HEIGHT } from '../../src/constants/Layout';
import { useLoginPopup } from '../../src/hooks/useLoginPopup';

export default function HomeScreen() {
  //const [showLoginPopup, setShowLoginPopup] = useState(false);
  const { showLoginPopup } = useLoginPopup();
  const insets = useSafeAreaInsets();
  const tabBarClearance = insets.bottom + TAB_BAR_BOTTOM_MARGIN + TAB_BAR_HEIGHT;

  return (
    <SafeAreaView style={{ flex: 1 ,
      backgroundColor: '#FFFFFF',
    }}>
        <ScrollView
    style={{ backgroundColor: '#FFFFFF' }}
    contentContainerStyle={{
      paddingBottom: tabBarClearance + 16,
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