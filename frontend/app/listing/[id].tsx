import { useMemo } from 'react';

import { Stack, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ImageBackground, Pressable, ScrollView, Text, View } from 'react-native';

const listingMap = {
  'paris-escape': {
    city: 'Paris',
    title: 'Riverside Atelier Stay',
    price: '$240',
    rating: '4.9',
    tag: 'Featured',
    image:
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1400&q=80',
    description: 'A bright, design-led apartment near the Seine with skyline views and luxury finishes.',
    subtitle: '7th arrondissement • 3 guests',
    host: 'Hosted by Camille',
    stayType: 'Boutique guesthouse',
    exterior: [
      {
        title: 'Street Facade',
        image:
          'https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Courtyard Entry',
        image:
          'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    interior: [
      {
        title: 'Living Room',
        image:
          'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Bedroom Suite',
        image:
          'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Kitchen Nook',
        image:
          'https://images.unsplash.com/photo-1556911220-bda9f7f7597e?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    gallery: [
      {
        title: 'Cafe Street',
        image:
          'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Seine Walk',
        image:
          'https://images.unsplash.com/photo-1431274172761-fca41d930114?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Market Corner',
        image:
          'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    activities: [
      { name: 'Sunset Seine Cruise', duration: '2h', price: '$38', type: 'Waterfront' },
      { name: 'Louvre Fast Pass', duration: '3h', price: '$42', type: 'Culture' },
      { name: 'Evening Food Tour', duration: '2.5h', price: '$55', type: 'Food' },
    ],
    neighborhood: {
      vibe: 'Elegant and lively, with classic architecture, cafe terraces, and easy walking access to landmarks.',
      highlights: ['Quiet side streets at night', 'Great bakeries within 5 minutes', 'Safe and walkable'],
      nearby: [
        { name: 'Metro Station', distance: '4 min walk' },
        { name: 'Grocery & Pharmacy', distance: '6 min walk' },
        { name: 'Riverfront Path', distance: '3 min walk' },
      ],
    },
  },
  'bali-sunrise': {
    city: 'Bali',
    title: 'Cliffside Ocean Villa',
    price: '$310',
    rating: '5.0',
    tag: 'Trending',
    image:
      'https://images.unsplash.com/photo-1501117716987-c8e1ecb2100a?auto=format&fit=crop&w=1400&q=80',
    description: 'A calm tropical villa with a private pool, wellness deck, and curated local experiences.',
    subtitle: 'Uluwatu • 6 guests',
    host: 'Hosted by Nyoman',
    stayType: 'Luxury villa hotel',
    exterior: [
      {
        title: 'Cliffside View',
        image:
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Pool Deck',
        image:
          'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    interior: [
      {
        title: 'Open Lounge',
        image:
          'https://images.unsplash.com/photo-1616594039964-3f1c1d6820f7?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Master Bedroom',
        image:
          'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Spa Bathroom',
        image:
          'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    gallery: [
      {
        title: 'Ocean Cliffs',
        image:
          'https://images.unsplash.com/photo-1518544866330-4e4e8adcc6d5?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Temple Steps',
        image:
          'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Beach Sunset',
        image:
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    activities: [
      { name: 'Surf Lesson Session', duration: '2h', price: '$32', type: 'Adventure' },
      { name: 'Cliff Temple Tour', duration: '3h', price: '$27', type: 'Culture' },
      { name: 'Private Yoga Deck', duration: '1h', price: '$25', type: 'Wellness' },
    ],
    neighborhood: {
      vibe: 'Relaxed and coastal with dramatic cliffs, surf culture, and sunset viewpoints all around.',
      highlights: ['Excellent ocean viewpoints', 'Popular wellness studios nearby', 'Great mix of cafes and beach clubs'],
      nearby: [
        { name: 'Balangan Beach', distance: '9 min drive' },
        { name: 'Local Market', distance: '7 min drive' },
        { name: 'Uluwatu Temple', distance: '12 min drive' },
      ],
    },
  },
  'tokyo-nights': {
    city: 'Tokyo',
    title: 'Skyline Minimal Loft',
    price: '$190',
    rating: '4.8',
    tag: 'New',
    image:
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80',
    description: 'A sleek modern loft close to the best restaurants, transit, and nightlife in the city.',
    subtitle: 'Shibuya • 2 guests',
    host: 'Hosted by Haru',
    stayType: 'Modern city hotel loft',
    exterior: [
      {
        title: 'Building Exterior',
        image:
          'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Night Entry',
        image:
          'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    interior: [
      {
        title: 'Minimal Lounge',
        image:
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Compact Kitchen',
        image:
          'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Bedroom Corner',
        image:
          'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    gallery: [
      {
        title: 'Neon District',
        image:
          'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Train Access',
        image:
          'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Rooftop Scene',
        image:
          'https://images.unsplash.com/photo-1505764706515-aa95265c5abc?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    activities: [
      { name: 'Shibuya Night Walk', duration: '2h', price: '$22', type: 'City' },
      { name: 'Sushi Counter Tasting', duration: '1.5h', price: '$46', type: 'Food' },
      { name: 'Design District Tour', duration: '2.5h', price: '$34', type: 'Culture' },
    ],
    neighborhood: {
      vibe: 'Dynamic and connected with late-night dining, boutique shopping, and fast transit links.',
      highlights: ['High safety and convenience', 'Dense restaurant options', 'Direct train connections'],
      nearby: [
        { name: 'Shibuya Crossing', distance: '8 min walk' },
        { name: 'JR Station', distance: '5 min walk' },
        { name: 'Convenience Store', distance: '2 min walk' },
      ],
    },
  },
} as const;

export default function ListingDetails() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  const listing = useMemo(() => {
    if (typeof id !== 'string') return undefined;
    return listingMap[id as keyof typeof listingMap];
  }, [id]);

  return (
    <>
      <Stack.Screen options={{ title: listing?.title ?? 'Listing detail' }} />

      <ScrollView className="flex-1 bg-white" contentContainerClassName="pb-8" showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-4">
          <View className="overflow-hidden rounded-[36px] bg-[#184a57] shadow-lg shadow-black/10">
            <ImageBackground source={{ uri: listing?.image }} className="min-h-[420px] justify-end" imageStyle={{ borderRadius: 36 }}>
              <View className="absolute inset-0 bg-black/30" />

              <View className="p-5">
                <View className="rounded-[30px] border border-white/25 bg-white/80 p-5">
                  <View className="mb-5 flex-row items-center justify-between">
                    <View className="rounded-full bg-[#184a57] px-3 py-1.5">
                      <Text className="text-xs font-bold uppercase tracking-[2px] text-white">{listing?.tag ?? 'Listing'}</Text>
                    </View>
                    <View className="flex-row items-center rounded-full bg-white px-3 py-1.5">
                      <Ionicons name="star" size={14} color="#f78d00" />
                      <Text className="ml-1 text-xs font-bold text-black">{listing?.rating ?? '—'}</Text>
                    </View>
                  </View>

                  <Text className="text-xs font-bold uppercase tracking-[4px] text-[#184a57]">{listing?.city ?? 'Destination'}</Text>
                  <Text className="mt-3 text-4xl font-black leading-tight text-black">{listing?.title ?? 'Listing not found'}</Text>
                  <Text className="mt-2 text-sm font-semibold text-black/55">{listing?.subtitle ?? 'This listing will be populated dynamically using the route id.'}</Text>
                  <Text className="mt-1 text-sm font-semibold text-[#184a57]">{listing?.host ?? 'Hosted locally'}</Text>
                  <Text className="mt-1 text-sm font-semibold text-black/50">{listing?.stayType ?? 'Stay type available on booking'}</Text>
                  <Text className="mt-4 text-base leading-6 text-black/70">
                    {listing?.description ?? 'This listing will be populated dynamically using the route id.'}
                  </Text>

                  <View className="mt-5 flex-row gap-3">
                    <View className="flex-1 rounded-[24px] bg-white px-4 py-4 shadow-sm">
                      <Text className="text-xs font-bold uppercase tracking-[2px] text-black/40">Price</Text>
                      <Text className="mt-1 text-2xl font-black text-[#184a57]">
                        {listing?.price ?? '--'} <Text className="text-sm font-semibold text-black/50">/night</Text>
                      </Text>
                    </View>
                    <View className="flex-1 rounded-[24px] bg-[#f78d00] px-4 py-4 shadow-sm">
                      <Text className="text-xs font-bold uppercase tracking-[2px] text-white/80">Availability</Text>
                      <Text className="mt-1 text-2xl font-black text-white">Live</Text>
                    </View>
                  </View>
                </View>
              </View>
            </ImageBackground>
          </View>
        </View>

        <View className="px-5 pt-5">
          <View className="rounded-[34px] bg-[#f8fbfc] p-5 shadow-sm">
            <Text className="text-lg font-black text-black">Exterior</Text>
            <Text className="mt-1 text-sm leading-6 text-black/60">How the property and surroundings look from the outside.</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4">
              {listing?.exterior?.map((photo) => (
                <View key={photo.title} className="mr-3 w-64 overflow-hidden rounded-[24px] bg-white">
                  <ImageBackground source={{ uri: photo.image }} className="h-40 w-full justify-end" imageStyle={{ borderRadius: 24 }}>
                    <View className="absolute inset-0 bg-black/25" />
                    <View className="px-3 py-3">
                      <Text className="text-sm font-bold text-white">{photo.title}</Text>
                    </View>
                  </ImageBackground>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>

        <View className="px-5 pt-5">
          <View className="rounded-[34px] bg-white p-5 shadow-sm">
            <Text className="text-lg font-black text-black">Interior</Text>
            <Text className="mt-1 text-sm leading-6 text-black/60">Inside views of rooms, comfort, and design style.</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4">
              {listing?.interior?.map((photo) => (
                <View key={photo.title} className="mr-3 w-64 overflow-hidden rounded-[24px] bg-[#f8f8f8]">
                  <ImageBackground source={{ uri: photo.image }} className="h-40 w-full justify-end" imageStyle={{ borderRadius: 24 }}>
                    <View className="absolute inset-0 bg-black/30" />
                    <View className="px-3 py-3">
                      <Text className="text-sm font-bold text-white">{photo.title}</Text>
                    </View>
                  </ImageBackground>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>

        <View className="px-5 pt-5">
          <View className="rounded-[34px] bg-[#f8fbfc] p-5 shadow-sm">
            <Text className="text-lg font-black text-black">Area preview</Text>
            <Text className="mt-1 text-sm leading-6 text-black/60">Scenes around your stay so you can quickly understand the vibe.</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4">
              {listing?.gallery?.map((photo) => (
                <View key={photo.title} className="mr-3 w-52 overflow-hidden rounded-[24px] bg-white">
                  <ImageBackground source={{ uri: photo.image }} className="h-36 w-full justify-end" imageStyle={{ borderRadius: 24 }}>
                    <View className="absolute inset-0 bg-black/25" />
                    <View className="px-3 py-3">
                      <Text className="text-sm font-bold text-white">{photo.title}</Text>
                    </View>
                  </ImageBackground>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>

        <View className="px-5 pt-5">
          <View className="rounded-[34px] bg-white p-5 shadow-sm">
            <Text className="text-lg font-black text-black">Things to do nearby</Text>
            <View className="mt-4 gap-3">
              {listing?.activities?.map((activity) => (
                <View key={activity.name} className="rounded-[22px] border border-black/8 bg-[#f8f8f8] p-4">
                  <View className="flex-row items-center justify-between">
                    <Text className="flex-1 pr-3 text-base font-bold text-black">{activity.name}</Text>
                    <View className="rounded-full bg-[#184a57] px-3 py-1">
                      <Text className="text-xs font-bold text-white">{activity.type}</Text>
                    </View>
                  </View>
                  <View className="mt-3 flex-row items-center justify-between">
                    <Text className="text-sm font-medium text-black/60">Duration: {activity.duration}</Text>
                    <Text className="text-sm font-bold text-[#184a57]">From {activity.price}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View className="px-5 pt-5">
          <View className="rounded-[34px] bg-[#f8fbfc] p-5 shadow-sm">
            <Text className="text-lg font-black text-black">Neighborhood</Text>
            <Text className="mt-2 text-sm leading-6 text-black/70">
              {listing?.neighborhood.vibe ?? 'Detailed neighborhood information will be shown here.'}
            </Text>

            <View className="mt-4 gap-2">
              {listing?.neighborhood.highlights?.map((point) => (
                <View key={point} className="flex-row items-center rounded-[18px] bg-white px-3 py-3">
                  <Ionicons name="checkmark-circle" size={16} color="#184a57" />
                  <Text className="ml-2 flex-1 text-sm font-medium text-black/70">{point}</Text>
                </View>
              ))}
            </View>

            <View className="mt-5 rounded-[22px] bg-white p-4">
              <Text className="text-sm font-black uppercase tracking-[2px] text-black/55">Nearby essentials</Text>
              <View className="mt-3 gap-2">
                {listing?.neighborhood.nearby?.map((spot) => (
                  <View key={spot.name} className="flex-row items-center justify-between rounded-[16px] bg-[#f8f8f8] px-3 py-3">
                    <Text className="text-sm font-semibold text-black/80">{spot.name}</Text>
                    <Text className="text-sm font-bold text-[#184a57]">{spot.distance}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        <View className="px-5 pt-5">
          <View className="rounded-[34px] bg-[#f8fbfc] p-5 shadow-sm">
            <Text className="text-lg font-black text-black">What makes it special</Text>
            <View className="mt-4 gap-3">
              {[
                'Private concierge and smooth self check-in',
                'Curated local recommendations and transport support',
                'Designed interiors with premium comfort and style',
              ].map((item) => (
                <View key={item} className="flex-row items-start gap-3 rounded-[22px] bg-[#f8f8f8] p-4">
                  <View className="mt-0.5 h-6 w-6 items-center justify-center rounded-full bg-[#184a57]">
                    <Ionicons name="checkmark" size={14} color="#ffffff" />
                  </View>
                  <Text className="flex-1 text-sm leading-6 text-black/70">{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View className="px-5 pt-5">
          <View className="rounded-[34px] bg-white p-5 shadow-sm">
            <Text className="text-lg font-black text-black">Quick actions</Text>
            <View className="mt-4 flex-row gap-3">
              <Pressable className="flex-1 items-center rounded-[22px] bg-[#184a57] py-4">
                <Text className="text-sm font-bold text-white">Reserve</Text>
              </Pressable>
              <Pressable className="flex-1 items-center rounded-[22px] border border-black/10 bg-[#f8f8f8] py-4">
                <Text className="text-sm font-bold text-black">Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}