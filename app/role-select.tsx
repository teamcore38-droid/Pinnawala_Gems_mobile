import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { design } from '@/constants/design';
import { ThemedText } from '@/components/themed-text';

export default function RoleSelectScreen() {
  const router = useRouter();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.heroGlowTop} />
      <View style={styles.heroGlowBottom} />

      <View style={styles.hero}>
        <Text style={styles.kicker}>Welcome to Pinnawala</Text>
        <ThemedText type="title" style={styles.title}>
          Choose your access path
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Select the experience you want to enter. Customers can browse and order, while admins
          manage the storefront.
        </ThemedText>
      </View>

      <View style={styles.cardGrid}>
        <Pressable style={styles.choiceCard} onPress={() => router.push('/login')}>
          <View style={styles.choiceIcon}>
            <Ionicons name="bag-handle-outline" size={22} color={design.colors.accentDark} />
          </View>
          <Text style={styles.choiceTitle}>Shop as User</Text>
          <Text style={styles.choiceText}>
            Browse products, save your cart, and track your orders with a polished shopping flow.
          </Text>
          <View style={styles.choiceButton}>
            <Text style={styles.choiceButtonText}>Continue as User</Text>
          </View>
        </Pressable>

        <Pressable style={[styles.choiceCard, styles.adminCard]} onPress={() => router.push('/admin-login')}>
          <View style={[styles.choiceIcon, styles.adminIcon]}>
            <Ionicons name="shield-checkmark-outline" size={22} color="#fff" />
          </View>
          <Text style={[styles.choiceTitle, styles.adminTitle]}>Manage as Admin</Text>
          <Text style={[styles.choiceText, styles.adminText]}>
            Maintain the catalog, update orders, and keep the store experience refined.
          </Text>
          <View style={[styles.choiceButton, styles.adminButton]}>
            <Text style={styles.adminButtonText}>Continue as Admin</Text>
          </View>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: design.colors.bg,
    overflow: 'hidden',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 28,
  },
  heroGlowTop: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 180,
    backgroundColor: 'rgba(140, 91, 46, 0.08)',
    top: -50,
    right: -55,
  },
  heroGlowBottom: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 220,
    backgroundColor: 'rgba(91, 58, 26, 0.08)',
    bottom: -110,
    left: -90,
  },
  hero: {
    marginTop: 12,
    marginBottom: 22,
    padding: 20,
    borderRadius: 28,
    backgroundColor: design.colors.accentDark,
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
  },
  subtitle: {
    color: 'rgba(255, 248, 241, 0.84)',
    marginTop: 12,
    lineHeight: 22,
  },
  cardGrid: {
    gap: 14,
  },
  choiceCard: {
    backgroundColor: design.colors.surface,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: design.colors.border,
    padding: 18,
    shadowColor: '#1F2937',
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
  },
  adminCard: {
    backgroundColor: '#FCFAF7',
  },
  choiceIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF3E7',
    marginBottom: 14,
  },
  adminIcon: {
    backgroundColor: design.colors.accent,
  },
  choiceTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: design.colors.text,
  },
  adminTitle: {
    color: design.colors.accentDark,
  },
  choiceText: {
    marginTop: 8,
    color: design.colors.muted,
    lineHeight: 21,
  },
  adminText: {
    color: '#7C5C3C',
  },
  choiceButton: {
    marginTop: 16,
    paddingVertical: 13,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: design.colors.surfaceMuted,
    borderWidth: 1,
    borderColor: design.colors.border,
  },
  choiceButtonText: {
    color: design.colors.accentDark,
    fontWeight: '800',
  },
  adminButton: {
    backgroundColor: design.colors.accent,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  adminButtonText: {
    color: '#fff',
    fontWeight: '800',
  },
});
