import { useState } from 'react';

import { Stack } from 'expo-router';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

export default function ProfileSettingsScreen() {
  const [name, setName] = useState('Alex Morgan');
  const [email, setEmail] = useState('alex.morgan@vyage.com');
  const [phone, setPhone] = useState('+1 408 555 2910');

  const onSave = () => {
    if (!name.trim() || !email.trim() || !phone.trim()) {
      Alert.alert('Missing information', 'Please complete all fields before saving.');
      return;
    }
    Alert.alert('Saved', 'Your profile settings were updated successfully.');
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Profile Settings', headerShadowVisible: false }} />
      <ScrollView className="flex-1 bg-white" contentContainerClassName="px-5 pb-8 pt-4" showsVerticalScrollIndicator={false}>
        <View className="rounded-[28px] bg-[#f8fbfc] p-5 shadow-sm">
          <Text className="text-lg font-black text-black">Personal information</Text>
          <Text className="mt-1 text-sm text-black/60">Keep your contact details up to date for booking updates.</Text>

          <View className="mt-4 gap-3">
            <View>
              <Text className="mb-2 text-sm font-semibold text-black">Full name</Text>
              <TextInput className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-base text-black" value={name} onChangeText={setName} />
            </View>
            <View>
              <Text className="mb-2 text-sm font-semibold text-black">Email</Text>
              <TextInput
                className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-base text-black"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
            <View>
              <Text className="mb-2 text-sm font-semibold text-black">Phone</Text>
              <TextInput className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-base text-black" value={phone} onChangeText={setPhone} />
            </View>
          </View>
        </View>

        <Pressable onPress={onSave} className="mt-5 items-center rounded-[22px] bg-[#f78d00] py-4">
          <Text className="text-base font-bold text-white">Save Changes</Text>
        </Pressable>
      </ScrollView>
    </>
  );
}
