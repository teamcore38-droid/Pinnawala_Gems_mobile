import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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

type ProductForm = {
  imageUrl: string;
  name: string;
  price: string;
  carat: string;
  description: string;
  stockCount: string;
};

const EMPTY_FORM: ProductForm = {
  imageUrl: '',
  name: '',
  price: '',
  carat: '',
  description: '',
  stockCount: '',
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

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);

  useEffect(() => {
    fetchProducts();
  }, []);

  const stats = useMemo(() => {
    const total = products.length;
    const inStock = products.filter((product) => product.stockCount > 0).length;
    const lowStock = products.filter((product) => product.stockCount > 0 && product.stockCount <= 5)
      .length;
    return { total, inStock, lowStock };
  }, [products]);

  const fetchProducts = async (opts?: { silent?: boolean }) => {
    const isSilent = opts?.silent ?? false;
    if (!isSilent) {
      setLoading(true);
    }

    try {
      const response = await API.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch products');
      console.error('Product fetch error:', getErrorMessage(error));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingProduct(null);
  };

  const openModal = (product: Product | null = null) => {
    if (product) {
      setEditingProduct(product);
      setForm({
        imageUrl: product.imageUrl,
        name: product.name,
        price: String(product.price),
        carat: String(product.carat),
        description: product.description,
        stockCount: String(product.stockCount),
      });
    } else {
      resetForm();
    }

    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    resetForm();
  };

  const handleSave = async () => {
    const trimmedName = form.name.trim();
    const trimmedImageUrl = form.imageUrl.trim();
    const trimmedDescription = form.description.trim();

    if (!trimmedName || !trimmedImageUrl || !trimmedDescription) {
      Alert.alert('Missing details', 'Please fill in the name, image URL, and description.');
      return;
    }

    const payload = {
      imageUrl: trimmedImageUrl,
      name: trimmedName,
      price: Number(form.price),
      carat: Number(form.carat),
      description: trimmedDescription,
      stockCount: Number(form.stockCount),
    };

    if (
      Number.isNaN(payload.price) ||
      Number.isNaN(payload.carat) ||
      Number.isNaN(payload.stockCount)
    ) {
      Alert.alert('Invalid numbers', 'Please enter valid numeric values for price, carat, and stock.');
      return;
    }

    setSaving(true);

    try {
      if (editingProduct) {
        await API.put(`/api/products/${editingProduct._id}`, payload);
      } else {
        await API.post('/api/products', payload);
      }

      await fetchProducts({ silent: true });
      closeModal();
    } catch (error) {
      Alert.alert('Error', 'Failed to save product');
      console.error('Product save error:', getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (product: Product) => {
    Alert.alert(
      'Delete product',
      `Remove ${product.name} from the catalog? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await API.delete(`/api/products/${product._id}`);
              await fetchProducts({ silent: true });
            } catch (error) {
              Alert.alert('Error', 'Failed to delete product');
              console.error('Product delete error:', getErrorMessage(error));
            }
          },
        },
      ],
    );
  };

  const renderProduct = ({ item }: { item: Product }) => {
    const isLowStock = item.stockCount > 0 && item.stockCount <= 5;
    const isOutOfStock = item.stockCount === 0;

    return (
      <View style={styles.productCard}>
        <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
        <View style={styles.productCardBody}>
          <View style={styles.productCardTopRow}>
            <View style={styles.productTextBlock}>
              <Text style={styles.productName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.productDescription} numberOfLines={2}>
                {item.description}
              </Text>
            </View>
            <View style={styles.pricePill}>
              <Text style={styles.pricePillText}>${Number(item.price).toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaChip}>
              <Ionicons name="diamond-outline" size={14} color={ACCENT} />
              <Text style={styles.metaChipText}>{item.carat} ct</Text>
            </View>
            <View style={styles.metaChip}>
              <Ionicons
                name={isOutOfStock ? 'alert-circle-outline' : 'cube-outline'}
                size={14}
                color={isOutOfStock ? '#B42318' : ACCENT}
              />
              <Text style={styles.metaChipText}>
                {isOutOfStock ? 'Out of stock' : `${item.stockCount} in stock`}
              </Text>
            </View>
          </View>

          <View style={styles.cardActions}>
            <Pressable style={styles.secondaryAction} onPress={() => openModal(item)}>
              <Ionicons name="create-outline" size={16} color={ACCENT_DARK} />
              <Text style={styles.secondaryActionText}>Edit</Text>
            </Pressable>
            <Pressable style={styles.destructiveAction} onPress={() => handleDelete(item)}>
              <Ionicons name="trash-outline" size={16} color="#9B1C1C" />
              <Text style={styles.destructiveActionText}>Delete</Text>
            </Pressable>
          </View>

          {isLowStock ? (
            <View style={styles.lowStockBanner}>
              <Ionicons name="warning-outline" size={14} color="#A16207" />
              <Text style={styles.lowStockText}>Low stock: restock soon</Text>
            </View>
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchProducts({ silent: true });
            }}
            tintColor={ACCENT}
            colors={[ACCENT]}
          />
        }
      >
        <View style={styles.hero}>
          <View style={styles.heroGlowTop} />
          <View style={styles.heroGlowBottom} />
          <View style={styles.heroHeader}>
            <View>
              <Text style={styles.kicker}>Admin Catalog</Text>
              <Text style={styles.title}>Product Management</Text>
              <Text style={styles.subtitle}>
                Curate your collection, track stock, and keep the catalog polished.
              </Text>
            </View>
            <Pressable style={styles.addButton} onPress={() => openModal()}>
              <Ionicons name="add" size={18} color="#fff" />
              <Text style={styles.addButtonText}>Add Product</Text>
            </Pressable>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.total}</Text>
              <Text style={styles.statLabel}>Products</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.inStock}</Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.lowStock}</Text>
              <Text style={styles.statLabel}>Low stock</Text>
            </View>
          </View>
        </View>

        <View style={styles.contentSection}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Catalog overview</Text>
              <Text style={styles.sectionSubtitle}>Manage every item in one clean workspace.</Text>
            </View>
            {loading ? <ActivityIndicator color={ACCENT} /> : null}
          </View>

          {products.length === 0 && !loading ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconWrap}>
                <Ionicons name="layers-outline" size={28} color={ACCENT} />
              </View>
              <Text style={styles.emptyTitle}>No products yet</Text>
              <Text style={styles.emptyText}>
                Add your first product to start building a premium storefront catalog.
              </Text>
              <Pressable style={styles.emptyButton} onPress={() => openModal()}>
                <Text style={styles.emptyButtonText}>Create first product</Text>
              </Pressable>
            </View>
          ) : (
            <FlatList
              data={products}
              keyExtractor={(item) => item._id}
              renderItem={renderProduct}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
            />
          )}
        </View>
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalKicker}>Product editor</Text>
                <Text style={styles.modalTitle}>
                  {editingProduct ? 'Edit product' : 'Add new product'}
                </Text>
              </View>
              <Pressable onPress={closeModal} style={styles.closeButton}>
                <Ionicons name="close" size={18} color={TEXT} />
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.modalContent} keyboardShouldPersistTaps="handled">
              <Text style={styles.fieldLabel}>Image URL</Text>
              <TextInput
                placeholder="https://..."
                placeholderTextColor="#9CA3AF"
                value={form.imageUrl}
                onChangeText={(text) => setForm({ ...form, imageUrl: text })}
                style={styles.input}
                autoCapitalize="none"
              />

              <Text style={styles.fieldLabel}>Product name</Text>
              <TextInput
                placeholder="Elegant Gold Ring"
                placeholderTextColor="#9CA3AF"
                value={form.name}
                onChangeText={(text) => setForm({ ...form, name: text })}
                style={styles.input}
              />

              <View style={styles.row}>
                <View style={styles.rowField}>
                  <Text style={styles.fieldLabel}>Price</Text>
                  <TextInput
                    placeholder="125.00"
                    placeholderTextColor="#9CA3AF"
                    value={form.price}
                    onChangeText={(text) => setForm({ ...form, price: text })}
                    keyboardType="decimal-pad"
                    style={styles.input}
                  />
                </View>
                <View style={styles.rowField}>
                  <Text style={styles.fieldLabel}>Carat</Text>
                  <TextInput
                    placeholder="2.5"
                    placeholderTextColor="#9CA3AF"
                    value={form.carat}
                    onChangeText={(text) => setForm({ ...form, carat: text })}
                    keyboardType="decimal-pad"
                    style={styles.input}
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.rowField}>
                  <Text style={styles.fieldLabel}>Stock count</Text>
                  <TextInput
                    placeholder="12"
                    placeholderTextColor="#9CA3AF"
                    value={form.stockCount}
                    onChangeText={(text) => setForm({ ...form, stockCount: text })}
                    keyboardType="number-pad"
                    style={styles.input}
                  />
                </View>
                <View style={styles.rowField}>
                  <Text style={styles.fieldLabel}>Preview tip</Text>
                  <View style={styles.tipCard}>
                    <Ionicons name="sparkles-outline" size={16} color={ACCENT} />
                    <Text style={styles.tipText}>Use a clear product image with natural light.</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.fieldLabel}>Description</Text>
              <TextInput
                placeholder="Describe the craftsmanship, look, and feel..."
                placeholderTextColor="#9CA3AF"
                value={form.description}
                onChangeText={(text) => setForm({ ...form, description: text })}
                multiline
                style={[styles.input, styles.textArea]}
              />
            </ScrollView>

            <View style={styles.modalFooter}>
              <Pressable style={styles.cancelButton} onPress={closeModal} disabled={saving}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.saveButton} onPress={handleSave} disabled={saving}>
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>
                    {editingProduct ? 'Save changes' : 'Create product'}
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
  },
  scrollContent: {
    paddingTop: 12,
    paddingBottom: 32,
  },
  hero: {
    marginHorizontal: 16,
    marginTop: 28,
    marginBottom: 16,
    padding: 20,
    borderRadius: 28,
    backgroundColor: ACCENT_DARK,
    overflow: 'hidden',
  },
  heroGlowTop: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 180,
    backgroundColor: 'rgba(255, 214, 165, 0.14)',
    top: -60,
    right: -40,
  },
  heroGlowBottom: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 140,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    bottom: -50,
    left: -30,
  },
  heroHeader: {
    gap: 18,
  },
  kicker: {
    color: '#F6D7B2',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  title: {
    color: '#FFF8F1',
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
  },
  subtitle: {
    color: 'rgba(255, 248, 241, 0.84)',
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 340,
  },
  addButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: ACCENT,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
  },
  statCard: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  statValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.76)',
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
  },
  contentSection: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: TEXT,
  },
  sectionSubtitle: {
    marginTop: 4,
    color: MUTED,
    fontSize: 13,
  },
  emptyState: {
    marginTop: 10,
    backgroundColor: CARD,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 24,
    alignItems: 'center',
  },
  emptyIconWrap: {
    width: 58,
    height: 58,
    borderRadius: 58,
    backgroundColor: '#FFF6EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: TEXT,
  },
  emptyText: {
    marginTop: 8,
    textAlign: 'center',
    color: MUTED,
    lineHeight: 20,
  },
  emptyButton: {
    marginTop: 18,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: ACCENT,
  },
  emptyButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  productCard: {
    backgroundColor: CARD,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: 'hidden',
    shadowColor: '#1F2937',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 190,
    backgroundColor: '#EDE7DF',
  },
  productCardBody: {
    padding: 16,
    gap: 14,
  },
  productCardTopRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  productTextBlock: {
    flex: 1,
    gap: 6,
  },
  productName: {
    color: TEXT,
    fontSize: 18,
    fontWeight: '800',
  },
  productDescription: {
    color: MUTED,
    fontSize: 13,
    lineHeight: 18,
  },
  pricePill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#FFF3E7',
  },
  pricePillText: {
    color: ACCENT_DARK,
    fontWeight: '800',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#F8F5F0',
    borderWidth: 1,
    borderColor: '#ECE3D8',
  },
  metaChipText: {
    color: TEXT,
    fontSize: 12,
    fontWeight: '700',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#F6F1EA',
    borderWidth: 1,
    borderColor: '#E7DED2',
  },
  secondaryActionText: {
    color: ACCENT_DARK,
    fontWeight: '700',
  },
  destructiveAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#FDF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  destructiveActionText: {
    color: '#9B1C1C',
    fontWeight: '700',
  },
  lowStockBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#FFF8DB',
  },
  lowStockText: {
    color: '#A16207',
    fontWeight: '700',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(17, 24, 39, 0.52)',
  },
  modalSheet: {
    maxHeight: '92%',
    backgroundColor: '#FFFDF9',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  modalHandle: {
    alignSelf: 'center',
    width: 52,
    height: 5,
    borderRadius: 999,
    backgroundColor: '#D6C9BA',
    marginBottom: 12,
  },
  modalHeader: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalKicker: {
    color: ACCENT,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    fontSize: 11,
    fontWeight: '800',
  },
  modalTitle: {
    marginTop: 4,
    fontSize: 24,
    fontWeight: '800',
    color: TEXT,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3EEE7',
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 20,
  },
  fieldLabel: {
    marginBottom: 8,
    fontSize: 13,
    fontWeight: '700',
    color: TEXT,
  },
  input: {
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: TEXT,
    marginBottom: 14,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  rowField: {
    flex: 1,
  },
  tipCard: {
    minHeight: 52,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tipText: {
    flex: 1,
    color: '#9A3412',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 22,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: '#F3EEE7',
  },
  cancelButtonText: {
    color: TEXT,
    fontWeight: '800',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: ACCENT,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '800',
  },
});
