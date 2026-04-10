import { Link, Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';

const profileLinks = [
  {
    href: '/profile/settings' as const,
    title: 'Profile Settings',
    subtitle: 'Manage your account details and preferences',
    icon: 'settings-outline' as const,
  },
  {
    href: '/profile/bookings' as const,
    title: 'Bookings',
    subtitle: 'Track upcoming and past reservations',
    icon: 'calendar-outline' as const,
  },
  {
    href: '/profile/reviews' as const,
    title: 'My Reviews',
    subtitle: 'View and edit your listing feedback',
    icon: 'chatbubble-ellipses-outline' as const,
  },
  {
    href: '/profile/change-password' as const,
    title: 'Change Password',
    subtitle: 'Update your password for account security',
    icon: 'lock-closed-outline' as const,
  },
  {
    href: '/profile/notifications' as const,
    title: 'Notifications',
    subtitle: 'Control travel alerts and update reminders',
    icon: 'notifications-outline' as const,
  },
];

export default function ProfileScreen() {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert('Logged out', 'You have been signed out.', [
      {
        text: 'OK',
        onPress: () => router.replace('/auth/login'),
      },
    ]);
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Profile', headerShadowVisible: false }} />

      <ScrollView className="flex-1 bg-white" contentContainerClassName="pb-10" showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-4">
          <View className="rounded-[34px] bg-[#184a57] p-5 shadow-lg shadow-black/10">
            <Text className="text-xs font-bold uppercase tracking-[4px] text-[#f78d00]">My account</Text>
            <Text className="mt-3 text-3xl font-black leading-tight text-white">Welcome back, traveler.</Text>
            <Text className="mt-2 text-sm leading-6 text-white/80">
              Keep your trips organized, secure your profile, and manage everything from one place.
            </Text>

            <View className="mt-5 rounded-[24px] bg-white/12 p-4">
              <Text className="text-sm font-semibold text-white">Alex Morgan</Text>
              <Text className="mt-1 text-xs font-medium text-white/70">alex.morgan@vyage.com</Text>
            </View>

            <View className="mt-4 flex-row gap-3">
              <View className="flex-1 rounded-[18px] bg-white/12 p-3">
                <Text className="text-xs uppercase tracking-[1px] text-white/65">Trips</Text>
                <Text className="mt-1 text-lg font-black text-white">12</Text>
              </View>
              <View className="flex-1 rounded-[18px] bg-white/12 p-3">
                <Text className="text-xs uppercase tracking-[1px] text-white/65">Reviews</Text>
                <Text className="mt-1 text-lg font-black text-white">8</Text>
              </View>
              <View className="flex-1 rounded-[18px] bg-white/12 p-3">
                <Text className="text-xs uppercase tracking-[1px] text-white/65">Saved</Text>
                <Text className="mt-1 text-lg font-black text-white">23</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="px-5 pt-5">
          <View className="gap-3">
            {profileLinks.map((item) => (
              <Link key={item.title} href={item.href} asChild>
                <Pressable className="flex-row items-center rounded-[24px] border border-black/8 bg-[#f8fbfc] p-4 active:opacity-90">
                  <View className="h-11 w-11 items-center justify-center rounded-2xl bg-[#184a57]/10">
                    <Ionicons name={item.icon} size={20} color="#184a57" />
                  </View>

                  <View className="ml-3 flex-1">
                    <Text className="text-base font-bold text-black">{item.title}</Text>
                    <Text className="mt-1 text-sm text-black/60">{item.subtitle}</Text>
                  </View>

                  <Ionicons name="chevron-forward" size={20} color="#184a57" />
                </Pressable>
              </Link>
            ))}
          </View>

          <Pressable onPress={handleLogout} className="mt-5 items-center rounded-[22px] border border-[#184a57]/20 bg-[#f8fbfc] py-4">
            <Text className="text-base font-bold text-[#184a57]">Log Out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </>
  );
}
