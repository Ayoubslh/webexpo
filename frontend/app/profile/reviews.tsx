import { useState } from 'react';

import { Stack } from 'expo-router';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

const initialReviews = [
  { place: 'Riverside Atelier Stay', rating: '5.0', text: 'Perfect location and very smooth check-in. Highly recommended.' },
  { place: 'Skyline Minimal Loft', rating: '4.8', text: 'Great host, spotless room, and easy access to metro lines.' },
];

export default function ReviewsScreen() {
  const [reviews, setReviews] = useState(initialReviews);
  const [editingPlace, setEditingPlace] = useState<string | null>(null);

  const updateText = (place: string, text: string) => {
    setReviews((current) => current.map((review) => (review.place === place ? { ...review, text } : review)));
  };

  const saveReview = () => {
    setEditingPlace(null);
    Alert.alert('Review saved', 'Your review changes were updated.');
  };

  return (
    <>
      <Stack.Screen options={{ title: 'My Reviews', headerShadowVisible: false }} />
      <ScrollView className="flex-1 bg-white" contentContainerClassName="px-5 pb-8 pt-4" showsVerticalScrollIndicator={false}>
        <View className="gap-3">
          {reviews.map((review) => (
            <View key={review.place} className="rounded-[24px] bg-[#f8fbfc] p-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-base font-black text-black">{review.place}</Text>
                <Text className="text-sm font-bold text-[#184a57]">{review.rating}</Text>
              </View>

              {editingPlace === review.place ? (
                <TextInput
                  multiline
                  value={review.text}
                  onChangeText={(text) => updateText(review.place, text)}
                  className="mt-3 min-h-[90px] rounded-2xl border border-black/10 bg-white px-3 py-3 text-sm leading-6 text-black"
                />
              ) : (
                <Text className="mt-3 text-sm leading-6 text-black/70">{review.text}</Text>
              )}

              <View className="mt-4 flex-row gap-2">
                {editingPlace === review.place ? (
                  <Pressable onPress={saveReview} className="flex-1 items-center rounded-[14px] bg-[#184a57] py-2.5">
                    <Text className="text-sm font-bold text-white">Save</Text>
                  </Pressable>
                ) : (
                  <Pressable onPress={() => setEditingPlace(review.place)} className="flex-1 items-center rounded-[14px] border border-[#184a57]/25 bg-white py-2.5">
                    <Text className="text-sm font-bold text-[#184a57]">Edit review</Text>
                  </Pressable>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </>
  );
}
