import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { capitalize, design, formatCurrency } from '@/constants/design';

const statuses = ['placed', 'confirmed', 'processing', 'shipped', 'delivered'] as const;

type Order = {
  id: string;
  total: number;
  status: (typeof statuses)[number] | string;
  secretCode?: string;
  items: { _id: string; name: string; quantity: number }[];
  date: string;
};

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const ordersData = JSON.parse((await AsyncStorage.getItem('orders')) ?? '[]') as Order[];
    setOrders(ordersData);
    setLoading(false);
  };

  const stats = useMemo(() => {
    const placed = orders.filter((order) => order.status === 'placed').length;
    const shipped = orders.filter((order) => order.status === 'shipped').length;
    const delivered = orders.filter((order) => order.status === 'delivered').length;
    return { placed, shipped, delivered };
  }, [orders]);

  const updateStatus = async (orderId: string, newStatus: Order['status']) => {
    const updatedOrders = orders.map((order) => {
      if (order.id !== orderId) {
        return order;
      }

      const updatedOrder = { ...order, status: newStatus };
      if (newStatus === 'shipped') {
        updatedOrder.secretCode = Math.random().toString(36).slice(2, 10).toUpperCase();
      }
      return updatedOrder;
    });

    setOrders(updatedOrders);
    await AsyncStorage.setItem('orders', JSON.stringify(updatedOrders));
    Alert.alert('Updated', `Order status changed to ${newStatus}.`);
  };

  const renderOrder = ({ item }: { item: Order }) => (
    <View style={styles.orderCard}>
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
          <Ionicons name="pricetag-outline" size={14} color={design.colors.muted} />
          <Text style={styles.metaText}>{formatCurrency(item.total)}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="layers-outline" size={14} color={design.colors.muted} />
          <Text style={styles.metaText}>{item.items.length} item(s)</Text>
        </View>
      </View>

      {item.secretCode ? (
        <View style={styles.secretCard}>
          <Ionicons name="shield-checkmark-outline" size={16} color={design.colors.success} />
          <Text style={styles.secretText}>Secret code: {item.secretCode}</Text>
        </View>
      ) : null}

      <View style={styles.statusGrid}>
        {statuses.map((status) => (
          <Pressable
            key={status}
            onPress={() => updateStatus(item.id, status)}
            style={[styles.statusButton, item.status === status && styles.statusButtonActive]}
          >
            <Text style={[styles.statusButtonText, item.status === status && styles.statusButtonTextActive]}>
              {capitalize(status)}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.hero}>
        <Text style={styles.kicker}>Operations</Text>
        <Text style={styles.title}>Order management with a premium control surface</Text>
        <Text style={styles.subtitle}>
          Update order stages, generate delivery codes, and keep fulfillment status easy to scan.
        </Text>

        <View style={styles.metricRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{stats.placed}</Text>
            <Text style={styles.metricLabel}>Placed</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{stats.shipped}</Text>
            <Text style={styles.metricLabel}>Shipped</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{stats.delivered}</Text>
            <Text style={styles.metricLabel}>Delivered</Text>
          </View>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingState}>
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="layers-outline" size={26} color={design.colors.accent} />
          </View>
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptyText}>New orders will appear here once customers complete checkout.</Text>
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
    fontSize: 26,
    fontWeight: '800',
    lineHeight: 32,
  },
  subtitle: {
    color: 'rgba(255, 248, 241, 0.84)',
    marginTop: 10,
    lineHeight: 22,
  },
  metricRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
  },
  metricCard: {
    flex: 1,
    padding: 14,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  metricValue: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
  },
  metricLabel: {
    color: 'rgba(255,255,255,0.74)',
    marginTop: 4,
    fontSize: 12,
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
  secretCard: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#ECFDF3',
  },
  secretText: {
    color: design.colors.success,
    fontWeight: '700',
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: design.colors.surfaceMuted,
    borderWidth: 1,
    borderColor: design.colors.border,
  },
  statusButtonActive: {
    backgroundColor: design.colors.accent,
    borderColor: design.colors.accent,
  },
  statusButtonText: {
    color: design.colors.accentDark,
    fontSize: 12,
    fontWeight: '800',
  },
  statusButtonTextActive: {
    color: '#fff',
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
});
