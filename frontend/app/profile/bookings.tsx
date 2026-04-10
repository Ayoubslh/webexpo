import { useMemo, useState } from 'react';

import { Stack } from 'expo-router';
import { Alert, Pressable, Text, View, ScrollView } from 'react-native';

const initialBookings = [
  { id: 'BK-1032', title: 'Riverside Atelier Stay', date: 'Apr 24 - Apr 28', status: 'Upcoming' },
  { id: 'BK-0978', title: 'Cliffside Ocean Villa', date: 'Mar 11 - Mar 14', status: 'Completed' },
  { id: 'BK-0914', title: 'Skyline Minimal Loft', date: 'Feb 03 - Feb 07', status: 'Completed' },
];

export default function BookingsScreen() {
  const [bookings, setBookings] = useState(initialBookings);
  const [filter, setFilter] = useState<'All' | 'Upcoming' | 'Completed'>('All');

  const visibleBookings = useMemo(() => {
    if (filter === 'All') return bookings;
    return bookings.filter((booking) => booking.status === filter);
  }, [bookings, filter]);

  const cancelBooking = (id: string) => {
    setBookings((current) =>
      current.map((booking) => (booking.id === id ? { ...booking, status: 'Completed' } : booking)),
    );
    Alert.alert('Booking updated', 'Your booking was moved out of upcoming trips.');
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Bookings', headerShadowVisible: false }} />
      <ScrollView className="flex-1 bg-white" contentContainerClassName="px-5 pb-8 pt-4" showsVerticalScrollIndicator={false}>
        <View className="mb-4 flex-row rounded-[18px] bg-[#f8fbfc] p-1">
          {(['All', 'Upcoming', 'Completed'] as const).map((item) => (
            <Pressable
              key={item}
              onPress={() => setFilter(item)}
              className={`flex-1 rounded-[14px] py-2.5 ${filter === item ? 'bg-[#184a57]' : 'bg-transparent'}`}>
              <Text className={`text-center text-sm font-semibold ${filter === item ? 'text-white' : 'text-black/65'}`}>{item}</Text>
            </Pressable>
          ))}
        </View>

        <View className="gap-3">
          {visibleBookings.map((booking) => (
            <View key={booking.id} className="rounded-[24px] border border-black/8 bg-[#f8fbfc] p-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-base font-black text-black">{booking.title}</Text>
                <Text className="text-xs font-bold uppercase tracking-[1px] text-[#184a57]">{booking.status}</Text>
              </View>
              <Text className="mt-2 text-sm text-black/65">{booking.date}</Text>
              <Text className="mt-1 text-xs font-semibold text-black/45">Ref: {booking.id}</Text>

              {booking.status === 'Upcoming' ? (
                <Pressable onPress={() => cancelBooking(booking.id)} className="mt-4 items-center rounded-[16px] border border-[#f78d00]/50 bg-[#f78d00]/10 py-2.5">
                  <Text className="text-sm font-bold text-[#184a57]">Cancel booking</Text>
                </Pressable>
              ) : null}
            </View>
          ))}

          {visibleBookings.length === 0 ? (
            <View className="rounded-[24px] bg-[#f8fbfc] p-5">
              <Text className="text-center text-sm font-semibold text-black/55">No bookings found for this filter.</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </>
  );
}
