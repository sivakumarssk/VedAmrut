// import { Stack } from 'expo-router';
// import AppProvider from '../src/providers/AppProvider';

// export default function RootLayout() {
//   return (
//     <AppProvider>
//       <Stack screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="index" />
//         <Stack.Screen name="(auth)" />
//         <Stack.Screen name="(home)" />
//       </Stack>
//     </AppProvider>
//   );
// }
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

import AppProvider from '../src/providers/AppProvider';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    InterRegular: Inter_400Regular,
    InterMedium: Inter_500Medium,
    InterSemiBold: Inter_600SemiBold,
    InterBold: Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AppProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(home)" />
      </Stack>
    </AppProvider>
  );
}