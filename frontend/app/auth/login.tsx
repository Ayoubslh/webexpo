import { useState } from 'react';

import { Link ,useRouter} from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

export default function Login() {
    const [rememberMe, setRememberMe] = useState(true);
    const router=useRouter();
    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView
                contentContainerClassName="flex-grow justify-between"
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}>
                <View className="flex-1 px-5 pt-10">
                    <View className="absolute -left-14 top-8 h-44 w-44 rounded-full bg-[#184a57]/6" />
                    <View className="absolute right-0 top-28 h-28 w-28 rounded-full bg-[#f78d00]/10" />
                    <View className="absolute -right-10 bottom-72 h-24 w-24 rounded-full bg-[#184a57]/8" />

                    <View className="mb-6 flex-row items-center justify-between">
                        <View className="flex-row items-center gap-3">
                            <View className="h-12 w-12 items-center justify-center rounded-[18px] bg-[#184a57] shadow-lg shadow-black/10">
                                <Ionicons name="airplane" size={22} color="#ffffff" />
                            </View>
                            <View>
                                <Text className="text-lg font-extrabold tracking-[4px] text-[#184a57]">VYAGE</Text>
                                <Text className="text-xs uppercase tracking-[3px] text-black/45">Travel reimagined</Text>
                            </View>
                        </View>

                        <View className="rounded-full border border-[#184a57]/10 bg-white px-3 py-1">
                            <Text className="text-xs font-semibold text-[#184a57]">Premium access</Text>
                        </View>
                    </View>

                    <View className="mb-6 rounded-[34px] border border-black/5 bg-[#f8fbfc] p-5 shadow-sm">
                        <Text className="text-xs font-bold uppercase tracking-[4px] text-[#f78d00]">Your next move</Text>
                        <Text className="mt-3 text-4xl font-black leading-tight text-black">Welcome back to a cleaner, brighter travel experience.</Text>
                        <Text className="mt-4 text-base leading-6 text-black/65">
                            Pick up where you left off with bookings, wishlists, and itineraries designed for explorers who move fast.
                        </Text>

                        <View className="mt-5 flex-row flex-wrap gap-2">
                            <View className="rounded-full bg-white px-3 py-2 shadow-sm">
                                <Text className="text-xs font-bold text-[#184a57]">Smart trips</Text>
                            </View>
                            <View className="rounded-full bg-white px-3 py-2 shadow-sm">
                                <Text className="text-xs font-bold text-black/70">Saved places</Text>
                            </View>
                            <View className="rounded-full bg-[#f78d00] px-3 py-2 shadow-sm">
                                <Text className="text-xs font-bold text-white">Fast login</Text>
                            </View>
                        </View>
                    </View>

                    <View className="rounded-[36px] border border-black/5 bg-white p-5 shadow-xl shadow-black/10">
                        <View className="mb-5 flex-row items-center justify-between">
                            <View>
                                <Text className="text-2xl font-black text-black">Login</Text>
                                <Text className="mt-1 text-sm text-black/55">Access your account in seconds.</Text>
                            </View>
                            <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#184a57]/8">
                                <Ionicons name="lock-closed" size={20} color="#184a57" />
                            </View>
                        </View>

                        <View className="gap-4">
                            <View>
                                <Text className="mb-2 text-sm font-semibold text-black">Email</Text>
                                <View className="flex-row items-center rounded-[22px] border border-black/10 bg-[#f8f8f8] px-4">
                                    <Ionicons name="mail-outline" size={18} color="#184a57" />
                                    <TextInput
                                        className="ml-3 flex-1 py-4 text-base text-black"
                                        placeholder="you@example.com"
                                        placeholderTextColor="#8a8a8a"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                    />
                                </View>
                            </View>

                            <View>
                                <Text className="mb-2 text-sm font-semibold text-black">Password</Text>
                                <View className="flex-row items-center rounded-[22px] border border-black/10 bg-[#f8f8f8] px-4">
                                    <Ionicons name="lock-closed-outline" size={18} color="#184a57" />
                                    <TextInput
                                        className="ml-3 flex-1 py-4 text-base text-black"
                                        placeholder="Enter your password"
                                        placeholderTextColor="#8a8a8a"
                                        secureTextEntry
                                    />
                                </View>
                            </View>

                            <View className="flex-row items-center justify-between">
                                <Pressable onPress={() => setRememberMe((current) => !current)} className="flex-row items-center">
                                    <View
                                        className={`mr-2 h-5 w-5 items-center justify-center rounded-md border ${
                                            rememberMe ? 'border-[#f78d00] bg-[#f78d00]' : 'border-black/20 bg-white'
                                        }`}>
                                        {rememberMe ? <Ionicons name="checkmark" size={14} color="#ffffff" /> : null}
                                    </View>
                                    <Text className="text-sm text-black/70">Remember me</Text>
                                </Pressable>

                                <Pressable>
                                    <Text className="text-sm font-semibold text-[#184a57]">Forgot password?</Text>
                                </Pressable>
                            </View>
                                 <Pressable className="mt-2 items-center rounded-[22px] bg-[#f78d00] py-4 shadow-lg shadow-black/15" onPress={()=>router.push('/(tabs)/listing')}>
                                    <Text className="text-base font-bold text-white">Sign In</Text>
                                </Pressable>
                           
                        </View>

                        <View className="mt-6 flex-row items-center">
                            <View className="h-px flex-1 bg-black/10" />
                            <Text className="mx-3 text-[11px] font-bold uppercase tracking-[3px] text-black/35">Or continue with</Text>
                            <View className="h-px flex-1 bg-black/10" />
                        </View>

                        <View className="mt-4 flex-row gap-3">
                            <Pressable className="flex-1 flex-row items-center justify-center rounded-[20px] border border-black/10 bg-white py-3.5">
                                <Ionicons name="logo-google" size={18} color="#184a57" />
                                <Text className="ml-2 font-semibold text-black">Google</Text>
                            </Pressable>
                            <Pressable className="flex-1 flex-row items-center justify-center rounded-[20px] border border-black/10 bg-[#f8f8f8] py-3.5">
                                <Ionicons name="logo-apple" size={18} color="#000000" />
                                <Text className="ml-2 font-semibold text-black">Apple</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>

                <View className="px-5 pb-8 pt-5">
                    <View className="overflow-hidden rounded-[30px] border border-black/5 bg-[#f8fbfc] px-4 py-4 shadow-sm">
                        <View className="absolute right-0 top-0 h-16 w-16 rounded-full bg-[#f78d00]/10" />
                        <View className="flex-row items-center justify-center">
                            <Text className="text-sm text-black/65">New here?</Text>
                            <Link href="/auth/register" asChild>
                                <Pressable>
                                    <Text className="ml-2 text-sm font-bold text-[#184a57]">Create account</Text>
                                </Pressable>
                            </Link>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}