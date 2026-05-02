import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import API from '@/services/api';

type Product = {
  _id: string;
  imageUrl: string;
  name: string;
  price: number;
  carat: number;
  description: string;
  stockCount: number;
};

const ACCENT = '#8C5B2E';
const ACCENT_DARK = '#5B3A1A';
const BG = '#F6F1EA';
const CARD = '#FFFFFF';
const TEXT = '#1F2937';
const MUTED = '#6B7280';
const BORDER = '#E5DED4';

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const router = useRouter();
  const productId = Array.isArray(id) ? id[0] : id;
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const fetchProduct = useCallback(async () => {
    if (!productId) {
      Alert.alert('Error', 'Missing product ID');
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await API.get(`/api/products/${productId}`);
      setProduct(response.data);
      setQuantity(1);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch product');
      console.error('Product detail error:', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    void fetchProduct();
  }, [fetchProduct]);

  const addToCart = async () => {
    if (!product) {
      return;
    }

    setAdding(true);

    try {
      const cart = JSON.parse((await AsyncStorage.getItem('cart')) || '[]');
      const existingItem = cart.find((item: Product & { quantity: number }) => item._id === product._id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push({ ...product, quantity });
      }

      await AsyncStorage.setItem('cart', JSON.stringify(cart));
      Alert.alert('Added to cart', `${product.name} was added to your cart.`);
      router.push('/cart');
    } catch (error) {
      Alert.alert('Error', 'Failed to add to cart');
      console.error('Add to cart error:', getErrorMessage(error));
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={ACCENT} />
        <Text style={styles.loadingText}>Loading product details...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centered}>
        <View style={styles.emptyIcon}>
          <Ionicons name="sad-outline" size={28} color={ACCENT} />
        </View>
        <Text style={styles.emptyTitle}>Product not found</Text>
        <Text style={styles.emptyText}>
          We could not load this product. Please try again or return to the catalog.
        </Text>
        <Pressable style={styles.primaryButton} onPress={() => void fetchProduct()}>
          <Text style={styles.primaryButtonText}>Try again</Text>
        </Pressable>
      </View>
    );
  }

  const stockLabel =
    product.stockCount > 0 ? `${product.stockCount} available` : 'Currently out of stock';

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Image source={{ uri: product.imageUrl }} style={styles.image} />
        <View style={styles.overlay} />
        <View style={styles.heroTopRow}>
          <Pressable style={styles.iconButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={18} color="#fff" />
          </Pressable>
          <View style={styles.priceBadge}>
            <Ionicons name="pricetag-outline" size={14} color={ACCENT_DARK} />
            <Text style={styles.priceBadgeText}>${Number(product.price).toFixed(2)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.nameRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.carat}>{product.carat} carat fine finish</Text>
          </View>
          <View style={styles.stockPill}>
            <Ionicons
              name={product.stockCount > 0 ? 'cube-outline' : 'alert-circle-outline'}
              size={14}
              color={product.stockCount > 0 ? ACCENT : '#B42318'}
            />
            <Text
              style={[
                styles.stockPillText,
                product.stockCount === 0 && styles.stockPillTextDanger,
              ]}
            >
              {stockLabel}
            </Text>
          </View>
        </View>

        <View style={styles.specRow}>
          <View style={styles.specCard}>
            <Ionicons name="diamond-outline" size={18} color={ACCENT} />
            <Text style={styles.specValue}>{product.carat}</Text>
            <Text style={styles.specLabel}>Carat</Text>
          </View>
          <View style={styles.specCard}>
            <Ionicons name="bar-chart-outline" size={18} color={ACCENT} />
            <Text style={styles.specValue}>{product.stockCount}</Text>
            <Text style={styles.specLabel}>Stock</Text>
          </View>
          <View style={styles.specCard}>
            <Ionicons name="wallet-outline" size={18} color={ACCENT} />
            <Text style={styles.specValue}>${Number(product.price).toFixed(0)}</Text>
            <Text style={styles.specLabel}>Price</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quantity</Text>
          <View style={styles.quantityRow}>
            <Pressable
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
              style={styles.quantityButton}
            >
              <Ionicons name="remove" size={18} color={TEXT} />
            </Pressable>
            <View style={styles.quantityValueWrap}>
              <Text style={styles.quantityValue}>{quantity}</Text>
            </View>
            <Pressable
              onPress={() => setQuantity(Math.min(Math.max(product.stockCount, 1), quantity + 1))}
              style={styles.quantityButton}
            >
              <Ionicons name="add" size={18} color={TEXT} />
            </Pressable>
          </View>
        </View>

        <Pressable
          onPress={addToCart}
          style={[styles.primaryButton, adding && styles.primaryButtonDisabled]}
          disabled={adding || product.stockCount === 0}
        >
          {adding ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="bag-add-outline" size={18} color="#fff" />
              <Text style={styles.primaryButtonText}>
                {product.stockCount === 0 ? 'Out of stock' : 'Add to cart'}
              </Text>
            </>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
  },
  content: {
    paddingBottom: 24,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BG,
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    color: MUTED,
    fontSize: 15,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF6EB',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: TEXT,
  },
  emptyText: {
    marginTop: 8,
    textAlign: 'center',
    color: MUTED,
    lineHeight: 20,
  },
  hero: {
    margin: 16,
    height: 320,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#EDE7DF',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(17,24,39,0.18)',
  },
  heroTopRow: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(31,41,55,0.34)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  priceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  priceBadgeText: {
    color: ACCENT_DARK,
    fontWeight: '800',
  },
  card: {
    marginHorizontal: 16,
    marginTop: -12,
    marginBottom: 8,
    padding: 18,
    borderRadius: 28,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: '#1F2937',
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  name: {
    fontSize: 26,
    fontWeight: '800',
    color: TEXT,
    lineHeight: 32,
  },
  carat: {
    marginTop: 6,
    color: MUTED,
    fontSize: 14,
  },
  stockPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#F8F5F0',
    borderWidth: 1,
    borderColor: '#ECE3D8',
    maxWidth: 150,
  },
  stockPillText: {
    color: TEXT,
    fontSize: 12,
    fontWeight: '700',
    flexShrink: 1,
  },
  stockPillTextDanger: {
    color: '#B42318',
  },
  specRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  specCard: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#FBF8F4',
    borderWidth: 1,
    borderColor: '#EEE6DA',
    gap: 4,
  },
  specValue: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: '800',
    color: TEXT,
  },
  specLabel: {
    color: MUTED,
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: TEXT,
    marginBottom: 8,
  },
  description: {
    color: MUTED,
    lineHeight: 22,
    fontSize: 14,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3EEE7',
    borderWidth: 1,
    borderColor: '#E7DED2',
  },
  quantityValueWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 16,
    backgroundColor: '#FBF8F4',
    borderWidth: 1,
    borderColor: '#EEE6DA',
  },
  quantityValue: {
    fontSize: 18,
    fontWeight: '800',
    color: TEXT,
  },
  primaryButton: {
    marginTop: 22,
    paddingVertical: 15,
    borderRadius: 18,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
});
