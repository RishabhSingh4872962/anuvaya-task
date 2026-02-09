import { ActionSheetProvider } from "@/src/components/action-sheet/ActionSheetProvider";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  initialWindowMetrics,
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <SafeAreaView style={{ flex: 1 }}>
          <ActionSheetProvider>
            <Stack
              screenOptions={{ headerShown: false, statusBarHidden: false }}
            />
          </ActionSheetProvider>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
