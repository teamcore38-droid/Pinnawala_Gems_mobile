import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { capitalize, design, formatCurrency } from '@/constants/design';

const stages = ['placed', 'confirmed', 'processing', 'shipped', 'delivered'] as const;

type Order = {
  id: string;
  total: number;
  status: (typeof stages)[number] | string;
  secretCode?: string;
  date: string;
  items: { _id: string; name: string; quantity: number }[];
};

export default function OrderTracking() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const orderId = Array.isArray(id) ? id[0] : id;
  const [order, setOrder] = useState<Order | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadOrder = async () => {
      const orders = JSON.parse((await AsyncStorage.getItem('orders')) ?? '[]') as Order[];
      const foundOrder = orders.find((o) => o.id === orderId) ?? null;
      setOrder(foundOrder);
    };

    void loadOrder();
  }, [orderId]);

  const currentStageIndex = useMemo(() => {
    if (!order) {
      return 0;
    }
    const index = stages.indexOf(order.status as (typeof stages)[number]);
    return index >= 0 ? index : 0;
  }, [order]);

  if (!order) {
    return (
      <View style={styles.screen}>
        <View style={styles.hero}>
          <Text style={styles.kicker}>Tracking</Text>
          <Text style={styles.title}>Loading order details...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.hero}>
        <Text style={styles.kicker}>Order tracking</Text>
        <Text style={styles.title}>Follow your order from placement to delivery</Text>
        <Text style={styles.subtitle}>
          A simple, polished timeline gives you a quick view of where your package is right now.
        </Text>
        <View style={styles.orderPill}>
          <Ionicons name="receipt-outline" size={14} color={design.colors.accentDark} />
          <Text style={styles.orderPillText}>Order {order.id}</Text>
        </View>
      </View>

      <View style={styles.card}>
        {stages.map((stage, index) => {
          const active = index <= currentStageIndex;
          const isCurrent = index === currentStageIndex;
          return (
            <View key={stage} style={styles.stageRow}>
              <View style={styles.stageRail}>
                <View style={[styles.stageDot, active && styles.stageDotActive, isCurrent && styles.stageDotCurrent]} />
                {index < stages.length - 1 ? <View style={[styles.stageLine, active && styles.stageLineActive]} /> : null}
              </View>
              <View style={styles.stageContent}>
                <Text style={[styles.stageLabel, active && styles.stageLabelActive]}>
                  {capitalize(stage)}
                </Text>
                <Text style={styles.stageDescription}>
                  {stage === 'placed' && 'Your order has been received.'}
                  {stage === 'confirmed' && 'The order has been confirmed by the team.'}
                  {stage === 'processing' && 'Your items are being prepared with care.'}
                  {stage === 'shipped' && 'The package is on its way to you.'}
                  {stage === 'delivered' && 'Your order has arrived successfully.'}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.card}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Order total</Text>
          <Text style={styles.infoValue}>{formatCurrency(order.total)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Items</Text>
          <Text style={styles.infoValue}>{order.items.length}</Text>
        </View>
        {order.status === 'delivered' ? (
          <View style={styles.secretCard}>
            <Ionicons name="shield-checkmark-outline" size={18} color={design.colors.success} />
            <View style={{ flex: 1 }}>
              <Text style={styles.secretTitle}>Delivery code</Text>
              <Text style={styles.secretCode}>{order.secretCode || 'Not available'}</Text>
            </View>
          </View>
        ) : null}
      </View>

      {order.status === 'delivered' ? (
        <Pressable style={styles.primaryButton} onPress={() => router.push(`/review?id=${order.id}`)}>
          <Ionicons name="star-outline" size={18} color="#fff" />
          <Text style={styles.primaryButtonText}>Leave a review</Text>
        </Pressable>
      ) : null}
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
  orderPill: {
    marginTop: 16,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: design.colors.accentSoft,
  },
  orderPillText: {
    color: design.colors.accentDark,
    fontWeight: '800',
  },
  card: {
    backgroundColor: design.colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: design.colors.border,
    padding: 18,
    marginBottom: 12,
    shadowColor: '#1F2937',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  stageRow: {
    flexDirection: 'row',
    gap: 12,
  },
  stageRail: {
    width: 18,
    alignItems: 'center',
  },
  stageDot: {
    width: 12,
    height: 12,
    borderRadius: 12,
    backgroundColor: '#D8D0C6',
    marginTop: 3,
  },
  stageDotActive: {
    backgroundColor: design.colors.accent,
  },
  stageDotCurrent: {
    transform: [{ scale: 1.15 }],
  },
  stageLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E5DED4',
    marginTop: 4,
    marginBottom: 4,
  },
  stageLineActive: {
    backgroundColor: design.colors.accent,
  },
  stageContent: {
    flex: 1,
    paddingBottom: 18,
  },
  stageLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: design.colors.muted,
  },
  stageLabelActive: {
    color: design.colors.text,
  },
  stageDescription: {
    marginTop: 6,
    color: design.colors.muted,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoLabel: {
    color: design.colors.muted,
  },
  infoValue: {
    color: design.colors.text,
    fontWeight: '800',
  },
  secretCard: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 18,
    backgroundColor: '#ECFDF3',
  },
  secretTitle: {
    color: design.colors.success,
    fontWeight: '800',
    fontSize: 13,
  },
  secretCode: {
    marginTop: 2,
    color: design.colors.text,
    fontWeight: '700',
  },
  primaryButton: {
    backgroundColor: design.colors.accent,
    borderRadius: 18,
    paddingVertical: 15,
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
