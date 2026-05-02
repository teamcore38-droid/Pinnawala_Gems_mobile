import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter, type Href } from 'expo-router';

import { design } from '@/constants/design';

type ActionCardProps = {
  href: Href;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
};

function ActionCard({ href, icon, title, description }: ActionCardProps) {
  return (
    <Link href={href} asChild>
      <Pressable style={styles.actionCard}>
        <View style={styles.actionIcon}>
          <Ionicons name={icon} size={22} color={design.colors.accentDark} />
        </View>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionDescription}>{description}</Text>
      </Pressable>
    </Link>
  );
}

export default function AdminDashboard() {
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
        <Text style={styles.kicker}>Admin dashboard</Text>
        <Text style={styles.title}>Manage the store from one elegant control center</Text>
        <Text style={styles.subtitle}>
          Monitor products, coordinate orders, and keep the storefront experience polished from a
          refined workspace.
        </Text>

        <View style={styles.metricRow}>
          <View style={styles.metricCard}>
            <Ionicons name="cube-outline" size={18} color="#fff" />
            <Text style={styles.metricValue}>Catalog</Text>
            <Text style={styles.metricLabel}>Product flow</Text>
          </View>
          <View style={styles.metricCard}>
            <Ionicons name="receipt-outline" size={18} color="#fff" />
            <Text style={styles.metricValue}>Orders</Text>
            <Text style={styles.metricLabel}>Status tracking</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick actions</Text>
          <Text style={styles.sectionHint}>Everything important in reach</Text>
        </View>

        <View style={styles.actionGrid}>
          <ActionCard
            href="/product-management"
            icon="pricetags-outline"
            title="Product Management"
            description="Create, update, and curate your catalog."
          />
          <ActionCard
            href="/order-management"
            icon="layers-outline"
            title="Order Management"
            description="Track status changes and keep customers informed."
          />
          <ActionCard
            href="/(tabs)"
            icon="storefront-outline"
            title="Open the App Home"
            description="Preview the customer experience and storefront flow."
          />
        </View>

        <Pressable style={styles.logoutButton} onPress={() => router.replace('/admin-login')}>
          <Ionicons name="log-out-outline" size={18} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
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
    paddingTop: 34,
    paddingBottom: 28,
  },
  heroGlowTop: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 180,
    backgroundColor: 'rgba(140, 91, 46, 0.08)',
    top: -60,
    right: -60,
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
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
  },
  subtitle: {
    color: 'rgba(255, 248, 241, 0.84)',
    marginTop: 12,
    lineHeight: 22,
  },
  metricRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
  },
  metricCard: {
    flex: 1,
    borderRadius: 20,
    padding: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  metricValue: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 18,
    marginTop: 10,
  },
  metricLabel: {
    color: 'rgba(255,255,255,0.74)',
    marginTop: 4,
    fontSize: 12,
  },
  section: {
    marginTop: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: design.colors.text,
  },
  sectionHint: {
    color: design.colors.muted,
    fontSize: 12,
  },
  actionGrid: {
    gap: 12,
  },
  actionCard: {
    backgroundColor: design.colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: design.colors.border,
    padding: 18,
    shadowColor: '#1F2937',
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
  },
  actionIcon: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF3E7',
    marginBottom: 12,
  },
  actionTitle: {
    color: design.colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  actionDescription: {
    marginTop: 6,
    color: design.colors.muted,
    lineHeight: 20,
  },
  logoutButton: {
    marginTop: 16,
    borderRadius: 18,
    backgroundColor: design.colors.danger,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
});
