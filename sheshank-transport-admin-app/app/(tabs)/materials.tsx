import {
  ActionButton,
  formatCurrency,
  palette,
  ScreenHeader,
  ScreenShell,
  StateBlock,
} from '@/components/admin-ui';
import { fetchMaterials, MaterialItem, updateMaterial } from '@/lib/admin-data';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function MaterialsScreen() {
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [drafts, setDrafts] = useState<Record<string, { price: string; stock: string }>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [savingId, setSavingId] = useState('');
  const [error, setError] = useState('');

  const loadMaterials = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError('');

    try {
      const nextMaterials = await fetchMaterials();
      setMaterials(nextMaterials);
      setDrafts(
        Object.fromEntries(
          nextMaterials.map((material) => [
            material.id,
            { price: String(material.price), stock: String(material.stock) },
          ])
        )
      );
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load materials.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadMaterials();
  }, [loadMaterials]);

  const updateDraft = (id: string, key: 'price' | 'stock', value: string) => {
    setDrafts((current) => ({
      ...current,
      [id]: {
        price: current[id]?.price ?? '',
        stock: current[id]?.stock ?? '',
        [key]: value,
      },
    }));
  };

  const saveMaterial = async (material: MaterialItem) => {
    const draft = drafts[material.id];
    const price = Number(draft?.price);
    const stock = Number(draft?.stock);

    if (!Number.isFinite(price) || !Number.isFinite(stock)) {
      Alert.alert('Invalid values', 'Enter numeric price and stock values.');
      return;
    }

    setSavingId(material.id);

    try {
      await updateMaterial(material, { price, stock });
      setMaterials((current) =>
        current.map((item) => (item.id === material.id ? { ...item, price, stock } : item))
      );
      Alert.alert('Material updated', `${material.name} inventory has been saved.`);
    } catch (saveError) {
      Alert.alert('Update failed', saveError instanceof Error ? saveError.message : 'Please try again.');
    } finally {
      setSavingId('');
    }
  };

  return (
    <ScreenShell>
      <ScreenHeader title="Materials" subtitle="Inventory, rates, and low-stock control." />

      {loading ? (
        <StateBlock loading title="Loading materials" message="Fetching inventory rows from Supabase." />
      ) : error ? (
        <StateBlock title="Materials unavailable" message={error} onRetry={() => loadMaterials()} />
      ) : (
        <FlatList
          data={materials}
          keyExtractor={(item) => `${item.tableName}-${item.id}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              tintColor={palette.orange}
              refreshing={refreshing}
              onRefresh={() => loadMaterials(true)}
            />
          }
          ListEmptyComponent={
            <StateBlock title="No materials found" message="Supabase returned an empty materials table." />
          }
          renderItem={({ item }) => {
            const isLowStock = item.stock <= item.minimumStock;
            const draft = drafts[item.id] ?? { price: String(item.price), stock: String(item.stock) };

            return (
              <View style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={styles.nameRow}>
                    <View style={[styles.iconWrap, isLowStock && styles.lowIconWrap]}>
                      <MaterialCommunityIcons
                        name={isLowStock ? 'alert-outline' : 'cube-outline'}
                        size={22}
                        color={isLowStock ? palette.red : palette.orange}
                      />
                    </View>
                    <View style={styles.nameBlock}>
                      <Text style={styles.materialName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text style={styles.materialUnit}>
                        {formatCurrency(item.price)} / {item.unit}
                      </Text>
                    </View>
                  </View>
                  {isLowStock ? (
                    <View style={styles.lowBadge}>
                      <Text style={styles.lowBadgeText}>Low stock</Text>
                    </View>
                  ) : null}
                </View>

                <View style={styles.stockBar}>
                  <Text style={styles.stockValue}>{item.stock}</Text>
                  <Text style={styles.stockLabel}>
                    in stock - reorder at {item.minimumStock}
                  </Text>
                </View>

                <View style={styles.editorGrid}>
                  <Field
                    label="Price"
                    value={draft.price}
                    onChangeText={(value) => updateDraft(item.id, 'price', value)}
                  />
                  <Field
                    label="Stock"
                    value={draft.stock}
                    onChangeText={(value) => updateDraft(item.id, 'stock', value)}
                  />
                </View>

                <ActionButton
                  label={savingId === item.id ? 'Updating...' : 'Update material'}
                  icon="content-save"
                  onPress={() => saveMaterial(item)}
                  disabled={savingId === item.id}
                />
              </View>
            );
          }}
        />
      )}
    </ScreenShell>
  );
}

function Field({
  label,
  value,
  onChangeText,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        keyboardType="numeric"
        value={value}
        onChangeText={onChangeText}
        placeholder="0"
        placeholderTextColor="#737b89"
        selectionColor={palette.orange}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: palette.panel,
    borderColor: palette.line,
    borderRadius: 8,
    borderWidth: 1,
    gap: 14,
    padding: 14,
  },
  cardTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  nameRow: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: palette.orangeSoft,
    borderRadius: 8,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  lowIconWrap: {
    backgroundColor: '#3b1d1d',
  },
  nameBlock: {
    flex: 1,
  },
  materialName: {
    color: palette.text,
    fontSize: 17,
    fontWeight: '900',
  },
  materialUnit: {
    color: palette.muted,
    fontSize: 13,
    marginTop: 3,
  },
  lowBadge: {
    backgroundColor: '#3b1d1d',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  lowBadgeText: {
    color: palette.red,
    fontSize: 12,
    fontWeight: '900',
  },
  stockBar: {
    backgroundColor: palette.panel2,
    borderRadius: 8,
    padding: 12,
  },
  stockValue: {
    color: palette.text,
    fontSize: 28,
    fontWeight: '900',
  },
  stockLabel: {
    color: palette.muted,
    fontSize: 13,
    marginTop: 3,
  },
  editorGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  field: {
    flex: 1,
  },
  fieldLabel: {
    color: '#737b89',
    fontSize: 11,
    fontWeight: '900',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: palette.bg,
    borderColor: palette.line,
    borderRadius: 8,
    borderWidth: 1,
    color: palette.text,
    fontSize: 16,
    fontWeight: '800',
    minHeight: 46,
    paddingHorizontal: 12,
  },
});
