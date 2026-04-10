import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: '#ffffff' },
        headerShadowVisible: false,
        headerTintColor: '#184a57',
        headerTitleStyle: { fontWeight: '700' },
      }}>
      <Stack.Screen name="settings" options={{ title: 'Profile Settings' }} />
      <Stack.Screen name="bookings" options={{ title: 'Bookings' }} />
      <Stack.Screen name="reviews" options={{ title: 'My Reviews' }} />
      <Stack.Screen name="change-password" options={{ title: 'Change Password' }} />
      <Stack.Screen name="notifications" options={{ title: 'Notifications' }} />
    </Stack>
  );
}
