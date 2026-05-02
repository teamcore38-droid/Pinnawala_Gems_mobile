import { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
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
  imageUrl?: string;
  carat?: number;
};

export default function Cart() {
  const [cart, setCart] = useState<CartItem[]>([]);
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

  const updateQuantity = async (id: string, newQuantity: number) => {
    const updatedCart = cart
      .map((item) => (item._id === id ? { ...item, quantity: newQuantity } : item))
      .filter((item) => item.quantity > 0);
    setCart(updatedCart);
    await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = async (id: string) => {
    const updatedCart = cart.filter((item) => item._id !== id);
    setCart(updatedCart);
    await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const total = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      {item.imageUrl ? <Image source={{ uri: item.imageUrl }} style={styles.thumbnail} /> : <View style={styles.thumbnailPlaceholder} />}
      <View style={styles.itemBody}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
        </View>
        {item.carat ? <Text style={styles.itemMeta}>{item.carat} carat</Text> : null}

        <View style={styles.quantityRow}>
          <Pressable onPress={() => updateQuantity(item._id, item.quantity - 1)} style={styles.quantityButton}>
            <Ionicons name="remove" size={16} color={design.colors.text} />
          </Pressable>
          <View style={styles.quantityValue}>
            <Text style={styles.quantityValueText}>{item.quantity}</Text>
          </View>
          <Pressable onPress={() => updateQuantity(item._id, item.quantity + 1)} style={styles.quantityButton}>
            <Ionicons name="add" size={16} color={design.colors.text} />
          </Pressable>
        </View>

        <Pressable onPress={() => removeItem(item._id)} style={styles.removeButton}>
          <Ionicons name="trash-outline" size={16} color={design.colors.danger} />
          <Text style={styles.removeText}>Remove</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.hero}>
        <Text style={styles.kicker}>Shopping bag</Text>
        <Text style={styles.title}>Your cart, styled with clarity</Text>
        <Text style={styles.subtitle}>Review quantities, remove items, and proceed to checkout when you’re ready.</Text>
      </View>

      {loading ? (
        <View style={styles.loadingState}>
          <Text style={styles.loadingText}>Loading cart...</Text>
        </View>
      ) : cart.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="bag-outline" size={26} color={design.colors.accent} />
          </View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>Browse the collection and add the pieces you love.</Text>
          <Pressable style={styles.primaryButton} onPress={() => router.push('/user-dashboard')}>
            <Text style={styles.primaryButtonText}>Continue shopping</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          />

          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{formatCurrency(total)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery</Text>
              <Text style={styles.summaryValue}>Calculated at checkout</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
            </View>

            <Pressable style={styles.checkoutButton} onPress={() => router.push('/checkout')}>
              <Ionicons name="card-outline" size={18} color="#fff" />
              <Text style={styles.checkoutButtonText}>Proceed to checkout</Text>
            </Pressable>
          </View>
        </>
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: design.colors.muted,
  },
  emptyState: {
    flex: 1,
    marginTop: 24,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: design.colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: design.colors.border,
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
  list: {
    paddingBottom: 12,
  },
  cartItem: {
    flexDirection: 'row',
    gap: 12,
    padding: 14,
    borderRadius: 24,
    backgroundColor: design.colors.surface,
    borderWidth: 1,
    borderColor: design.colors.border,
    shadowColor: '#1F2937',
    shadowOpacity: 0.04,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 1,
  },
  thumbnail: {
    width: 86,
    height: 86,
    borderRadius: 18,
    backgroundColor: '#EDE7DF',
  },
  thumbnailPlaceholder: {
    width: 86,
    height: 86,
    borderRadius: 18,
    backgroundColor: '#EFE7DD',
  },
  itemBody: {
    flex: 1,
    gap: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  itemName: {
    flex: 1,
    color: design.colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  itemPrice: {
    color: design.colors.accentDark,
    fontWeight: '800',
  },
  itemMeta: {
    color: design.colors.muted,
    fontSize: 12,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  quantityButton: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: design.colors.surfaceMuted,
    borderWidth: 1,
    borderColor: design.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityValue: {
    minWidth: 44,
    height: 38,
    borderRadius: 14,
    backgroundColor: design.colors.surfaceMuted,
    borderWidth: 1,
    borderColor: design.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityValueText: {
    fontWeight: '800',
    color: design.colors.text,
  },
  removeButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#FDF2F2',
  },
  removeText: {
    color: design.colors.danger,
    fontWeight: '700',
    fontSize: 12,
  },
  summaryCard: {
    padding: 18,
    borderRadius: 24,
    backgroundColor: design.colors.surface,
    borderWidth: 1,
    borderColor: design.colors.border,
    marginTop: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    color: design.colors.muted,
  },
  summaryValue: {
    color: design.colors.text,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: design.colors.border,
    marginVertical: 10,
  },
  totalLabel: {
    color: design.colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  totalValue: {
    color: design.colors.accentDark,
    fontSize: 16,
    fontWeight: '800',
  },
  checkoutButton: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: design.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  checkoutButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
});
