import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

export default function Register() {
	return (
		<SafeAreaView className="flex-1 bg-white">
			<ScrollView
				contentContainerClassName="flex-grow justify-between"
				keyboardShouldPersistTaps="handled"
				showsVerticalScrollIndicator={false}>
				<View className="flex-1 px-5 pt-10">
					<View className="absolute -right-12 top-8 h-40 w-40 rounded-full bg-[#184a57]/6" />
					<View className="absolute -left-10 top-36 h-24 w-24 rounded-full bg-[#f78d00]/10" />
					<View className="absolute right-10 bottom-80 h-28 w-28 rounded-full bg-[#184a57]/8" />

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
							<Text className="text-xs font-semibold text-[#184a57]">Join the journey</Text>
						</View>
					</View>

					<View className="mb-6 rounded-[34px] border border-black/5 bg-[#f8fbfc] p-5 shadow-sm">
						<Text className="text-xs font-bold uppercase tracking-[4px] text-[#f78d00]">Create momentum</Text>
						<Text className="mt-3 text-4xl font-black leading-tight text-black">Build your travel profile in a space that feels fresh and capable.</Text>
						<Text className="mt-4 text-base leading-6 text-black/65">
							Set up your account once, then move through bookings, curated stays, and destination planning with ease.
						</Text>

						<View className="mt-5 flex-row flex-wrap gap-2">
							<View className="rounded-full bg-white px-3 py-2 shadow-sm">
								<Text className="text-xs font-bold text-[#184a57]">Fast setup</Text>
							</View>
							<View className="rounded-full bg-white px-3 py-2 shadow-sm">
								<Text className="text-xs font-bold text-black/70">Personalized trips</Text>
							</View>
							<View className="rounded-full bg-[#f78d00] px-3 py-2">
								<Text className="text-xs font-bold text-white">Ready in minutes</Text>
							</View>
						</View>
					</View>

					<View className="rounded-[36px] border border-black/5 bg-white p-5 shadow-xl shadow-black/10">
						<View className="mb-5 flex-row items-center justify-between">
							<View>
								<Text className="text-2xl font-black text-black">Sign Up</Text>
								<Text className="mt-1 text-sm text-black/55">Create a sleek profile and get started.</Text>
							</View>
							<View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#184a57]/8">
								<Ionicons name="sparkles" size={20} color="#184a57" />
							</View>
						</View>

						<View className="gap-4">
							<View>
								<Text className="mb-2 text-sm font-semibold text-black">Full name</Text>
								<View className="flex-row items-center rounded-[22px] border border-black/10 bg-[#f8f8f8] px-4">
									<Ionicons name="person-outline" size={18} color="#184a57" />
									<TextInput
										className="ml-3 flex-1 py-4 text-base text-black"
										placeholder="Your full name"
										placeholderTextColor="#8a8a8a"
									/>
								</View>
							</View>

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
										placeholder="Create a strong password"
										placeholderTextColor="#8a8a8a"
										secureTextEntry
									/>
								</View>
							</View>

							<View>
								<Text className="mb-2 text-sm font-semibold text-black">Confirm password</Text>
								<View className="flex-row items-center rounded-[22px] border border-black/10 bg-[#f8f8f8] px-4">
									<Ionicons name="shield-checkmark-outline" size={18} color="#184a57" />
									<TextInput
										className="ml-3 flex-1 py-4 text-base text-black"
										placeholder="Repeat your password"
										placeholderTextColor="#8a8a8a"
										secureTextEntry
									/>
								</View>
							</View>

							<Pressable className="mt-2 items-center rounded-[22px] bg-[#f78d00] py-4 shadow-lg shadow-black/20">
								<Text className="text-base font-bold text-white">Create Account</Text>
							</Pressable>
						</View>

						<Text className="mt-4 text-center text-xs leading-5 text-black/45">
							By creating an account, you agree to the Vyage terms and privacy policy.
						</Text>
					</View>
				</View>

				<View className="px-5 pb-8 pt-5">
					<View className="overflow-hidden rounded-[30px] border border-black/5 bg-[#f8fbfc] px-4 py-4 shadow-sm">
						<View className="absolute left-0 top-0 h-16 w-16 rounded-full bg-[#f78d00]/10" />
						<View className="flex-row items-center justify-center">
							<Text className="text-sm text-black/65">Already have an account?</Text>
							<Link href="/auth/login" asChild>
								<Pressable>
									<Text className="ml-2 text-sm font-bold text-[#184a57]">Login</Text>
								</Pressable>
							</Link>
						</View>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
