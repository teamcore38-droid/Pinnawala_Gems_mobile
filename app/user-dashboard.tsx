import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import API from '@/services/api';
import { design, formatCurrency } from '@/constants/design';

type Product = {
  _id: string;
  imageUrl: string;
  name: string;
  price: number;
  carat: number;
  description: string;
  stockCount: number;
};

const FILTERS = [
  { key: 'all', label: 'All items' },
  { key: 'low', label: 'Under $100' },
  { key: 'high', label: '$100 and up' },
] as const;

type FilterKey = (typeof FILTERS)[number]['key'];

export default function UserDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterKey>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (silent = false) => {
    if (!silent) {
      setLoading(true);
    }

    try {
      const response = await API.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase()),
    );

    if (filter === 'low') {
      filtered = filtered.filter((product) => product.price < 100);
    } else if (filter === 'high') {
      filtered = filtered.filter((product) => product.price >= 100);
    }

    return filtered;
  }, [products, search, filter]);

  const stats = useMemo(() => {
    const available = products.filter((product) => product.stockCount > 0).length;
    const featured = products.filter((product) => product.price >= 100).length;
    return { available, featured };
  }, [products]);

  const renderProduct = ({ item }: { item: Product }) => (
    <Pressable style={styles.productCard} onPress={() => router.push(`/product-detail?id=${item._id}`)}>
      <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
      <View style={styles.productBody}>
        <View style={styles.productTopRow}>
          <Text style={styles.productName} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.priceBadge}>
            <Text style={styles.priceBadgeText}>{formatCurrency(item.price)}</Text>
          </View>
        </View>
        <Text style={styles.productCarat}>{item.carat} carat</Text>
        <Text style={styles.productDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.stockChip}>
          <Ionicons
            name={item.stockCount > 0 ? 'cube-outline' : 'alert-circle-outline'}
            size={14}
            color={item.stockCount > 0 ? design.colors.accent : design.colors.danger}
          />
          <Text style={styles.stockChipText}>
            {item.stockCount > 0 ? `${item.stockCount} in stock` : 'Out of stock'}
          </Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.heroGlowTop} />
      <View style={styles.heroGlowBottom} />

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item._id}
        renderItem={renderProduct}
        numColumns={2}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.content}
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          void fetchProducts(true);
        }}
        ListHeaderComponent={
          <View>
            <View style={styles.hero}>
              <View style={styles.heroTopRow}>
                <View>
                  <Text style={styles.kicker}>Gem Store</Text>
                  <Text style={styles.title}>Find pieces with a refined, boutique feel</Text>
                  <Text style={styles.subtitle}>
                    Discover the collection, search by style, and open each product with a polished
                    shopping experience.
                  </Text>
                </View>
                <Pressable style={styles.logoutButton} onPress={() => router.replace('/login')}>
                  <Ionicons name="log-out-outline" size={16} color="#fff" />
                </Pressable>
              </View>

              <View style={styles.metricRow}>
                <View style={styles.metricCard}>
                  <Text style={styles.metricValue}>{products.length}</Text>
                  <Text style={styles.metricLabel}>Products</Text>
                </View>
                <View style={styles.metricCard}>
                  <Text style={styles.metricValue}>{stats.available}</Text>
                  <Text style={styles.metricLabel}>Available</Text>
                </View>
                <View style={styles.metricCard}>
                  <Text style={styles.metricValue}>{stats.featured}</Text>
                  <Text style={styles.metricLabel}>Premium</Text>
                </View>
              </View>
            </View>

            <View style={styles.searchWrap}>
              <Ionicons name="search-outline" size={18} color={design.colors.muted} />
              <TextInput
                placeholder="Search products..."
                placeholderTextColor="#9CA3AF"
                value={search}
                onChangeText={setSearch}
                style={styles.searchInput}
              />
            </View>

            <View style={styles.filterRow}>
              {FILTERS.map((item) => {
                const active = filter === item.key;
                return (
                  <Pressable
                    key={item.key}
                    onPress={() => setFilter(item.key)}
                    style={[styles.filterChip, active && styles.filterChipActive]}
                  >
                    <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.loadingState}>
              <ActivityIndicator size="large" color={design.colors.accent} />
              <Text style={styles.loadingText}>Loading collection...</Text>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Ionicons name="sparkles-outline" size={26} color={design.colors.accent} />
              </View>
              <Text style={styles.emptyTitle}>No products found</Text>
              <Text style={styles.emptyText}>
                Try a different search term or adjust the filter to reveal more items.
              </Text>
            </View>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: design.colors.bg,
    overflow: 'hidden',
  },
  heroGlowTop: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 200,
    backgroundColor: 'rgba(140, 91, 46, 0.08)',
    top: -60,
    right: -60,
  },
  heroGlowBottom: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 240,
    backgroundColor: 'rgba(91, 58, 26, 0.08)',
    bottom: -120,
    left: -90,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 24,
  },
  hero: {
    padding: 20,
    borderRadius: 28,
    backgroundColor: design.colors.accentDark,
    marginBottom: 16,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
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
    maxWidth: 300,
  },
  subtitle: {
    color: 'rgba(255, 248, 241, 0.84)',
    marginTop: 12,
    lineHeight: 22,
  },
  logoutButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
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
  searchWrap: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    height: 54,
    borderRadius: 18,
    backgroundColor: design.colors.surface,
    borderWidth: 1,
    borderColor: design.colors.border,
  },
  searchInput: {
    flex: 1,
    color: design.colors.text,
    fontSize: 15,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
    flexWrap: 'wrap',
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 999,
    backgroundColor: design.colors.surface,
    borderWidth: 1,
    borderColor: design.colors.border,
  },
  filterChipActive: {
    backgroundColor: design.colors.accent,
    borderColor: design.colors.accent,
  },
  filterChipText: {
    color: design.colors.accentDark,
    fontWeight: '700',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  column: {
    gap: 12,
  },
  productCard: {
    flex: 1,
    backgroundColor: design.colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: design.colors.border,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#1F2937',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#EDE7DF',
  },
  productBody: {
    padding: 14,
    gap: 8,
  },
  productTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  productName: {
    flex: 1,
    color: design.colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  priceBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: design.colors.accentSoft,
  },
  priceBadgeText: {
    color: design.colors.accentDark,
    fontWeight: '800',
    fontSize: 12,
  },
  productCarat: {
    color: design.colors.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  productDescription: {
    color: design.colors.muted,
    lineHeight: 18,
    fontSize: 13,
  },
  stockChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: design.colors.surfaceMuted,
    alignSelf: 'flex-start',
  },
  stockChipText: {
    color: design.colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  loadingState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  loadingText: {
    color: design.colors.muted,
    fontWeight: '600',
  },
  emptyState: {
    marginTop: 20,
    padding: 24,
    borderRadius: 24,
    backgroundColor: design.colors.surface,
    borderWidth: 1,
    borderColor: design.colors.border,
    alignItems: 'center',
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
    color: design.colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  emptyText: {
    marginTop: 8,
    color: design.colors.muted,
    textAlign: 'center',
    lineHeight: 20,
  },
});
