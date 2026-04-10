import { useState } from 'react';

import { Stack } from 'expo-router';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const onUpdatePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Missing fields', 'Please fill all password fields.');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Weak password', 'New password should be at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Mismatch', 'New password and confirmation do not match.');
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    Alert.alert('Password updated', 'Your password has been changed successfully.');
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Change Password', headerShadowVisible: false }} />
      <ScrollView className="flex-1 bg-white" contentContainerClassName="px-5 pb-8 pt-4" showsVerticalScrollIndicator={false}>
        <View className="rounded-[28px] bg-[#f8fbfc] p-5">
          <Text className="text-lg font-black text-black">Security update</Text>
          <Text className="mt-1 text-sm text-black/60">Use a strong password with letters, numbers, and symbols.</Text>

          <View className="mt-4 gap-3">
            <View>
              <Text className="mb-2 text-sm font-semibold text-black">Current password</Text>
              <TextInput
                secureTextEntry
                value={currentPassword}
                onChangeText={setCurrentPassword}
                className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-base text-black"
              />
            </View>
            <View>
              <Text className="mb-2 text-sm font-semibold text-black">New password</Text>
              <TextInput
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
                className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-base text-black"
              />
            </View>
            <View>
              <Text className="mb-2 text-sm font-semibold text-black">Confirm new password</Text>
              <TextInput
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-base text-black"
              />
            </View>
          </View>
        </View>

        <Pressable onPress={onUpdatePassword} className="mt-5 items-center rounded-[22px] bg-[#f78d00] py-4">
          <Text className="text-base font-bold text-white">Update Password</Text>
        </Pressable>
      </ScrollView>
    </>
  );
}
