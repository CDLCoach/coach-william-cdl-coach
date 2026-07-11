import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { CdlNumbersProgressProvider } from "@/constants/cdl-numbers-progress";
import { ProAccessProvider } from "@/constants/pro-access";
import { theme } from "@/constants/theme";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.amber,
        headerTitleStyle: {
          color: theme.colors.text,
          fontWeight: "800",
          fontSize: 18,
        },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: theme.colors.background },
        headerBackTitle: "Back",
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="inspection/[id]" options={{ title: "Inspection" }} />
      <Stack.Screen name="air-brake" options={{ title: "Air Brake Test" }} />
      <Stack.Screen name="practice" options={{ title: "Practice Test" }} />
      <Stack.Screen name="pressure-challenge" options={{ title: "Pressure Challenge" }} />
      <Stack.Screen name="about" options={{ title: "About" }} />
      <Stack.Screen name="pro" options={{ title: "Coach William PRO" }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ProAccessProvider>
        <CdlNumbersProgressProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <RootLayoutNav />
          </GestureHandlerRootView>
        </CdlNumbersProgressProvider>
      </ProAccessProvider>
    </QueryClientProvider>
  );
}
