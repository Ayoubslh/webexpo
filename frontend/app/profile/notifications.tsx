import { useState } from 'react';

import { Stack } from 'expo-router';
import { Alert, Pressable, ScrollView, Switch, Text, View } from 'react-native';

const items = [
  { title: 'Booking confirmations', description: 'Get notified when a reservation is confirmed' },
  { title: 'Price updates', description: 'Receive alerts when saved listings change price' },
  { title: 'Review reminders', description: 'Reminder to review places after checkout' },
  { title: 'Travel tips', description: 'Destination suggestions and planning tips' },
];

export default function NotificationsScreen() {
  const [toggles, setToggles] = useState({
    'Booking confirmations': true,
    'Price updates': true,
    'Review reminders': false,
    'Travel tips': false,
  });

  const toggleItem = (title: keyof typeof toggles) => {
    setToggles((current) => ({ ...current, [title]: !current[title] }));
  };

  const onSavePreferences = () => {
    Alert.alert('Preferences saved', 'Your notification preferences were updated.');
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Notifications', headerShadowVisible: false }} />
      <ScrollView className="flex-1 bg-white" contentContainerClassName="px-5 pb-8 pt-4" showsVerticalScrollIndicator={false}>
        <View className="gap-3">
          {items.map((item) => (
            <View key={item.title} className="rounded-[22px] border border-black/8 bg-[#f8fbfc] p-4">
              <View className="flex-row items-center justify-between">
                <Text className="flex-1 pr-3 text-base font-black text-black">{item.title}</Text>
                <Switch
                  value={toggles[item.title as keyof typeof toggles]}
                  onValueChange={() => toggleItem(item.title as keyof typeof toggles)}
                  trackColor={{ false: '#d1d5db', true: '#184a57' }}
                  thumbColor="#ffffff"
                />
              </View>
              <Text className="mt-1 text-sm leading-6 text-black/65">{item.description}</Text>
            </View>
          ))}
        </View>

        <Pressable onPress={onSavePreferences} className="mt-5 items-center rounded-[22px] bg-[#184a57] py-4">
          <Text className="text-base font-bold text-white">Save Notification Preferences</Text>
        </Pressable>
      </ScrollView>
    </>
  );
}
