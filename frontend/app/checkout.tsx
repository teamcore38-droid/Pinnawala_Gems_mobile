import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { design, formatCurrency } from '@/constants/design';

type CartItem = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
};

type DeliveryInfo = {
  name: string;
  address: string;
  phone: string;
};

export default function Checkout() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    name: '',
    address: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    void loadCart();
  }, []);

  const loadCart = async () => {
    setLoading(true);
    const cartData = JSON.parse((await AsyncStorage.getItem('cart')) ?? '[]') as CartItem[];
    setCart(cartData);
    setLoading(false);
  };

  const total = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

  const placeOrder = async () => {
    if (!deliveryInfo.name || !deliveryInfo.address || !deliveryInfo.phone) {
      Alert.alert('Missing information', 'Please fill in all delivery details.');
      return;
    }

    const orderId = `ORD${Date.now()}`;
    const order = {
      id: orderId,
      items: cart,
      total,
      deliveryInfo,
      paymentMethod,
      status: 'placed',
      date: new Date().toISOString(),
    };

    const orders = JSON.parse((await AsyncStorage.getItem('orders')) ?? '[]');
    orders.push(order);
    await AsyncStorage.setItem('orders', JSON.stringify(orders));
    await AsyncStorage.setItem('cart', JSON.stringify([]));

    router.push(`/order-confirmation?id=${orderId}`);
  };

  const renderSummaryItem = ({ item }: { item: CartItem }) => (
    <View style={styles.summaryItem}>
      <Text style={styles.summaryName} numberOfLines={1}>
        {item.name} x{item.quantity}
      </Text>
      <Text style={styles.summaryPrice}>{formatCurrency(item.price * item.quantity)}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.kicker}>Secure checkout</Text>
        <Text style={styles.title}>Complete your order with a refined finish</Text>
        <Text style={styles.subtitle}>
          Enter delivery details, choose a payment method, and review the final summary before placing the order.
        </Text>
      </View>

      {loading ? (
        <View style={styles.loadingState}>
          <Text style={styles.loadingText}>Loading your order summary...</Text>
        </View>
      ) : (
        <>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Delivery information</Text>
            <View style={styles.field}>
              <Text style={styles.label}>Full name</Text>
              <TextInput
                placeholder="Enter your full name"
                placeholderTextColor="#9CA3AF"
                value={deliveryInfo.name}
                onChangeText={(text) => setDeliveryInfo({ ...deliveryInfo, name: text })}
                style={styles.input}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                placeholder="Delivery address"
                placeholderTextColor="#9CA3AF"
                value={deliveryInfo.address}
                onChangeText={(text) => setDeliveryInfo({ ...deliveryInfo, address: text })}
                style={[styles.input, styles.textArea]}
                multiline
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Phone number</Text>
              <TextInput
                placeholder="07X XXX XXXX"
                placeholderTextColor="#9CA3AF"
                value={deliveryInfo.phone}
                onChangeText={(text) => setDeliveryInfo({ ...deliveryInfo, phone: text })}
                style={styles.input}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Payment method</Text>
            <Pressable
              onPress={() => setPaymentMethod('card')}
              style={[styles.paymentOption, paymentMethod === 'card' && styles.paymentOptionActive]}
            >
              <Ionicons name="card-outline" size={18} color={design.colors.accentDark} />
              <View style={styles.paymentTextBlock}>
                <Text style={styles.paymentTitle}>Credit / Debit Card</Text>
                <Text style={styles.paymentSubtitle}>Fast and convenient payment.</Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => setPaymentMethod('cash')}
              style={[styles.paymentOption, paymentMethod === 'cash' && styles.paymentOptionActive]}
            >
              <Ionicons name="cash-outline" size={18} color={design.colors.accentDark} />
              <View style={styles.paymentTextBlock}>
                <Text style={styles.paymentTitle}>Cash on Delivery</Text>
                <Text style={styles.paymentSubtitle}>Pay when your order arrives.</Text>
              </View>
            </Pressable>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Order summary</Text>
            <FlatList
              data={cart}
              keyExtractor={(item) => item._id}
              renderItem={renderSummaryItem}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.divider} />}
            />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
            </View>
          </View>

          <Pressable style={styles.primaryButton} onPress={placeOrder}>
            <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
            <Text style={styles.primaryButtonText}>Place order</Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: design.colors.bg,
  },
  content: {
    padding: 16,
    paddingBottom: 24,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: design.colors.text,
    marginBottom: 14,
  },
  field: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 8,
    color: design.colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderColor: design.colors.border,
    backgroundColor: design.colors.surfaceMuted,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 16,
    color: design.colors.text,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: design.colors.border,
    backgroundColor: design.colors.surfaceMuted,
    marginBottom: 10,
  },
  paymentOptionActive: {
    borderColor: design.colors.accent,
    backgroundColor: design.colors.accentSoft,
  },
  paymentTextBlock: {
    flex: 1,
  },
  paymentTitle: {
    color: design.colors.text,
    fontWeight: '800',
    fontSize: 14,
  },
  paymentSubtitle: {
    marginTop: 3,
    color: design.colors.muted,
    fontSize: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  summaryName: {
    flex: 1,
    color: design.colors.text,
    fontWeight: '700',
  },
  summaryPrice: {
    color: design.colors.accentDark,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: design.colors.border,
    marginVertical: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: design.colors.text,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '800',
    color: design.colors.accentDark,
  },
  primaryButton: {
    marginTop: 6,
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
