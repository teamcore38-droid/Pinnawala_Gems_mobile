import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { design } from '@/constants/design';

export default function OrderConfirmation() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const router = useRouter();
  const orderId = Array.isArray(id) ? id[0] : id;

  return (
    <View style={styles.screen}>
      <View style={styles.heroGlowTop} />
      <View style={styles.heroGlowBottom} />

      <View style={styles.card}>
        <View style={styles.iconWrap}>
          <Ionicons name="checkmark-circle" size={40} color={design.colors.success} />
        </View>
        <Text style={styles.kicker}>Order confirmed</Text>
        <Text style={styles.title}>Your order has been placed successfully</Text>
        <Text style={styles.subtitle}>
          Thank you for your purchase. We’ve saved the details and will keep you updated as your
          order moves through the process.
        </Text>

        <View style={styles.orderIdChip}>
          <Ionicons name="receipt-outline" size={16} color={design.colors.accentDark} />
          <Text style={styles.orderIdText}>Order {orderId}</Text>
        </View>

        <View style={styles.buttonGroup}>
          <Pressable style={styles.primaryButton} onPress={() => router.push('/my-orders')}>
            <Text style={styles.primaryButtonText}>View my orders</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => router.push('/user-dashboard')}>
            <Text style={styles.secondaryButtonText}>Continue shopping</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: design.colors.bg,
    padding: 20,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  heroGlowTop: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 190,
    backgroundColor: 'rgba(140, 91, 46, 0.08)',
    top: -50,
    right: -70,
  },
  heroGlowBottom: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 240,
    backgroundColor: 'rgba(31, 122, 77, 0.06)',
    bottom: -120,
    left: -90,
  },
  card: {
    backgroundColor: design.colors.surface,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: design.colors.border,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#1F2937',
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
  },
  iconWrap: {
    width: 76,
    height: 76,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECFDF3',
    marginBottom: 14,
  },
  kicker: {
    color: design.colors.success,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontSize: 12,
    fontWeight: '800',
  },
  title: {
    marginTop: 10,
    fontSize: 26,
    fontWeight: '800',
    color: design.colors.text,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 12,
    color: design.colors.muted,
    textAlign: 'center',
    lineHeight: 22,
  },
  orderIdChip: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: design.colors.accentSoft,
  },
  orderIdText: {
    color: design.colors.accentDark,
    fontWeight: '800',
  },
  buttonGroup: {
    width: '100%',
    marginTop: 20,
    gap: 10,
  },
  primaryButton: {
    backgroundColor: design.colors.accent,
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
  secondaryButton: {
    backgroundColor: design.colors.surfaceMuted,
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: design.colors.border,
  },
  secondaryButtonText: {
    color: design.colors.accentDark,
    fontWeight: '800',
    fontSize: 15,
  },
});
