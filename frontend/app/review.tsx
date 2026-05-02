import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { design } from '@/constants/design';

export default function Review() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const orderId = Array.isArray(id) ? id[0] : id;
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const router = useRouter();

  const submitReview = async () => {
    const review = {
      orderId,
      rating,
      comment,
      date: new Date().toISOString(),
    };

    const reviews = JSON.parse((await AsyncStorage.getItem('reviews')) ?? '[]');
    reviews.push(review);
    await AsyncStorage.setItem('reviews', JSON.stringify(reviews));

    Alert.alert('Success', 'Review submitted!');
    router.push('/my-orders');
  };

  return (
    <View style={styles.screen}>
      <View style={styles.hero}>
        <Text style={styles.kicker}>Feedback</Text>
        <Text style={styles.title}>Share how your order felt</Text>
        <Text style={styles.subtitle}>
          Tell us about the delivery, presentation, and overall experience so we can keep improving.
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.orderPill}>
          <Ionicons name="receipt-outline" size={14} color={design.colors.accentDark} />
          <Text style={styles.orderPillText}>Order {orderId}</Text>
        </View>

        <Text style={styles.label}>Rating</Text>
        <View style={styles.ratingRow}>
          {[1, 2, 3, 4, 5].map((star) => {
            const active = rating >= star;
            return (
              <Pressable
                key={star}
                onPress={() => setRating(star)}
                style={[styles.starButton, active && styles.starButtonActive]}
              >
                <Ionicons
                  name={active ? 'star' : 'star-outline'}
                  size={20}
                  color={active ? '#fff' : design.colors.accentDark}
                />
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>Comment</Text>
        <TextInput
          value={comment}
          onChangeText={setComment}
          style={styles.commentInput}
          multiline
          placeholder="Share your experience..."
          placeholderTextColor="#9CA3AF"
        />

        <Pressable style={styles.primaryButton} onPress={submitReview}>
          <Ionicons name="send-outline" size={18} color="#fff" />
          <Text style={styles.primaryButtonText}>Submit review</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: design.colors.bg,
    padding: 16,
  },
  hero: {
    padding: 20,
    borderRadius: 28,
    backgroundColor: design.colors.accentDark,
    marginBottom: 16,
  },
  kicker: {
    color: '#F6D7B2',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 10,
  },
  title: {
    color: '#FFF8F1',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
  },
  subtitle: {
    color: 'rgba(255, 248, 241, 0.84)',
    marginTop: 10,
    lineHeight: 22,
  },
  card: {
    backgroundColor: design.colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: design.colors.border,
    padding: 18,
    shadowColor: '#1F2937',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  orderPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: design.colors.accentSoft,
    marginBottom: 18,
  },
  orderPillText: {
    color: design.colors.accentDark,
    fontWeight: '800',
  },
  label: {
    marginBottom: 10,
    color: design.colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  starButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: design.colors.surfaceMuted,
    borderWidth: 1,
    borderColor: design.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starButtonActive: {
    backgroundColor: design.colors.accent,
    borderColor: design.colors.accent,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: design.colors.border,
    backgroundColor: design.colors.surfaceMuted,
    padding: 14,
    borderRadius: 18,
    minHeight: 130,
    textAlignVertical: 'top',
    color: design.colors.text,
    marginBottom: 18,
  },
  primaryButton: {
    backgroundColor: design.colors.accent,
    paddingVertical: 15,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
});
