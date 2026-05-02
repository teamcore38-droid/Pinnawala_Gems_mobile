import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { capitalize, design, formatCurrency } from '@/constants/design';

type Order = {
  id: string;
  total: number;
  status: string;
  date: string;
  items: { _id: string; name: string; quantity: number }[];
};

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    void loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const ordersData = JSON.parse((await AsyncStorage.getItem('orders')) ?? '[]') as Order[];
    setOrders(ordersData);
    setLoading(false);
  };

  const renderOrder = ({ item }: { item: Order }) => (
    <Pressable style={styles.orderCard} onPress={() => router.push(`/order-tracking?id=${item.id}`)}>
      <View style={styles.orderTopRow}>
        <View>
          <Text style={styles.orderLabel}>Order</Text>
          <Text style={styles.orderId}>{item.id}</Text>
        </View>
        <View style={styles.statusChip}>
          <Text style={styles.statusChipText}>{capitalize(item.status)}</Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="calendar-outline" size={14} color={design.colors.muted} />
          <Text style={styles.metaText}>{new Date(item.date).toLocaleDateString()}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="pricetag-outline" size={14} color={design.colors.muted} />
          <Text style={styles.metaText}>{formatCurrency(item.total)}</Text>
        </View>
      </View>

      <View style={styles.summaryBar}>
        <Text style={styles.summaryText}>{item.items.length} item(s)</Text>
        <Ionicons name="chevron-forward" size={16} color={design.colors.accentDark} />
      </View>
    </Pressable>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.hero}>
        <Text style={styles.kicker}>Purchase history</Text>
        <Text style={styles.title}>Your orders, beautifully organized</Text>
        <Text style={styles.subtitle}>
          Review every order in a clean timeline and open any order for detailed tracking.
        </Text>
      </View>

      {loading ? (
        <View style={styles.loadingState}>
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="receipt-outline" size={26} color={design.colors.accent} />
          </View>
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptyText}>Your completed purchases will appear here once you checkout.</Text>
          <Pressable style={styles.primaryButton} onPress={() => router.push('/user-dashboard')}>
            <Text style={styles.primaryButtonText}>Start shopping</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrder}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      )}
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
  loadingState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: design.colors.muted,
  },
  list: {
    paddingBottom: 12,
  },
  orderCard: {
    backgroundColor: design.colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: design.colors.border,
    padding: 16,
    shadowColor: '#1F2937',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  orderTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  orderLabel: {
    color: design.colors.muted,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '700',
  },
  orderId: {
    marginTop: 4,
    color: design.colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  statusChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: design.colors.accentSoft,
    alignSelf: 'flex-start',
  },
  statusChipText: {
    color: design.colors.accentDark,
    fontSize: 12,
    fontWeight: '800',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    color: design.colors.muted,
    fontSize: 13,
  },
  summaryBar: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: design.colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryText: {
    color: design.colors.text,
    fontWeight: '700',
  },
  emptyState: {
    flex: 1,
    backgroundColor: design.colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: design.colors.border,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: design.colors.accentSoft,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: design.colors.text,
  },
  emptyText: {
    marginTop: 8,
    color: design.colors.muted,
    textAlign: 'center',
    lineHeight: 20,
  },
  primaryButton: {
    marginTop: 18,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: design.colors.accent,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '800',
  },
});
