import { Link, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ImageBackground, FlatList, Pressable, Text, View } from 'react-native';

const listings = [
    {
        id: 'paris-escape',
        city: 'Paris',
        title: 'Riverside Atelier Stay',
        price: '$240',
        rating: '4.9',
        badge: 'Featured',
        image:
            'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
        description: 'A bright, design-led apartment near the Seine with skyline views and luxury finishes.',
        location: '7th arrondissement • 3 guests',
        amenities: ['Wi-Fi', 'Balcony', 'Kitchen'],
    },
    {
        id: 'bali-sunrise',
        city: 'Bali',
        title: 'Cliffside Ocean Villa',
        price: '$310',
        rating: '5.0',
        badge: 'Trending',
        image:
            'https://images.unsplash.com/photo-1501117716987-c8e1ecb2100a?auto=format&fit=crop&w=1200&q=80',
        description: 'A calm tropical villa with a private pool, wellness deck, and curated local experiences.',
        location: 'Uluwatu • 6 guests',
        amenities: ['Pool', 'Spa', 'Breakfast'],
    },
    {
        id: 'tokyo-nights',
        city: 'Tokyo',
        title: 'Skyline Minimal Loft',
        price: '$190',
        rating: '4.8',
        badge: 'New',
        image:
            'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
        description: 'A sleek modern loft close to the best restaurants, transit, and nightlife in the city.',
        location: 'Shibuya • 2 guests',
        amenities: ['Metro', 'Workspace', 'City view'],
    },
];

export default function Listing() {
    return (
        <>
            <Stack.Screen options={{ title: 'Listings' }} />
            <View className="flex-1 bg-white">
                

                <FlatList
                    data={listings}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 28 }}
                    ItemSeparatorComponent={() => <View className="h-4" />}
                    renderItem={({ item }) => (
                        <Link href={`/listing/${item.id}`} asChild>
                            <Pressable className="overflow-hidden rounded-[32px] bg-white shadow-lg shadow-black/10 active:opacity-90">
                                <ImageBackground
                                    source={{ uri: item.image }}
                                    className="min-h-[200px] w-full justify-end"
                                    imageStyle={{ borderRadius: 32 }}>
                                    <View className="absolute inset-0 bg-black/25" />

                                    <View className="p-2">
                                        <View className="rounded-[28px] border border-white/30 bg-black/45 p-4">
                                            <View className="mb-3 flex-row items-center justify-between">
                                                <View className="flex-row items-center gap-2">
                                                    <View className="rounded-full bg-white/20 px-3 py-1">
                                                        <Text className="text-xs font-bold text-white">{item.badge}</Text>
                                                    </View>
                                                    <Text className="text-xs font-semibold uppercase tracking-[2px] text-white/85">{item.city}</Text>
                                                </View>

                                                <View className="flex-row items-center rounded-full bg-white/20 px-3 py-1">
                                                    <Ionicons name="star" size={14} color="#f78d00" />
                                                    <Text className="ml-1 text-sm font-bold text-white">{item.rating}</Text>
                                                </View>
                                            </View>

                                            <Text className="text-2xl font-black text-white" numberOfLines={2}>
                                                {item.title}
                                            </Text>
                                            <Text className="mt-1 text-sm font-medium text-white/80" numberOfLines={1}>
                                                {item.location}
                                            </Text>
                                            <Text className="mt-3 text-sm leading-6 text-white/85" numberOfLines={3}>
                                                {item.description}
                                            </Text>

                                            <View className="mt-4 flex-row flex-wrap gap-2">
                                                {item.amenities.map((amenity) => (
                                                    <View key={amenity} className="rounded-full bg-white/20 px-3 py-1.5">
                                                        <Text className="text-xs font-bold text-white">{amenity}</Text>
                                                    </View>
                                                ))}
                                            </View>

                                            <View className="mt-5 flex-row items-center justify-between">
                                                <View>
                                                    <Text className="text-xs uppercase tracking-[2px] text-white/75">Starting from</Text>
                                                    <Text className="mt-1 text-xl font-black text-white">
                                                        {item.price} <Text className="text-sm font-semibold text-white/75">/night</Text>
                                                    </Text>
                                                </View>

                                                <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#f78d00]">
                                                    <Ionicons name="arrow-forward" size={22} color="#ffffff" />
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </ImageBackground>
                            </Pressable>
                        </Link>
                    )}
                />
            </View>
        </>
    );
}

