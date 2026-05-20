import {
  ActionButton,
  formatCurrency,
  formatDate,
  palette,
  ScreenHeader,
  ScreenShell,
  StateBlock,
  StatusBadge,
} from '@/components/admin-ui';
import { AdminOrder, fetchOrders, ORDER_STATUSES, OrderStatus, updateOrderStatus } from '@/lib/admin-data';
import { useLocalSearchParams, router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  const loadOrder = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const orders = await fetchOrders();
      const match = orders.find((item) => item.id === id);

      if (!match) {
        throw new Error('This order was not found in the readable Supabase orders table.');
      }

      setOrder(match);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load order details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const changeStatus = async (status: OrderStatus) => {
    if (!order || status === order.status) {
      return;
    }

    setSaving(true);

    try {
      const updatedOrder = await updateOrderStatus(order, status);
      setOrder(updatedOrder);
      showToast(setToast, `Order marked ${status}`);
    } catch (statusError) {
      const message = statusError instanceof Error ? statusError.message : 'Please try again.';
      showToast(setToast, message);
      Alert.alert('Status update failed', message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenShell>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <ScreenHeader
          title="Order Details"
          subtitle="Review customer, route, and dispatch state."
          right={<ActionButton compact label="Back" icon="arrow-left" onPress={() => router.back()} />}
        />

        {loading ? (
          <StateBlock loading title="Loading order" message="Reading the current order from Supabase." />
        ) : error || !order ? (
          <StateBlock title="Order unavailable" message={error} onRetry={loadOrder} />
        ) : (
          <>
            {toast ? (
              <View style={styles.toast}>
                <Text style={styles.toastText}>{toast}</Text>
              </View>
            ) : null}
            <View style={styles.heroCard}>
              <View style={styles.heroTop}>
                <View style={styles.heroCopy}>
                  <Text style={styles.customer}>{order.customerName}</Text>
                  <Text style={styles.phone}>{order.phone}</Text>
                </View>
                <StatusBadge status={order.status} />
              </View>
              <Text style={styles.route}>{order.pickup} to {order.drop}</Text>
            </View>

            <View style={styles.grid}>
              <Detail label="Material" value={order.material} />
              <Detail label="Vehicle" value={order.vehicle} />
              <Detail label="Revenue" value={formatCurrency(order.amount)} />
              <Detail label="Created" value={formatDate(order.createdAt)} />
              <Detail label="Source table" value="orders" />
            </View>

            <View style={styles.statusPanel}>
              <Text style={styles.panelTitle}>Update status</Text>
              <View style={styles.statusGrid}>
                {ORDER_STATUSES.map((status) => (
                  <ActionButton
                    key={status}
                    compact
                    label={status}
                    icon={status === order.status ? 'check-circle' : 'circle-outline'}
                    onPress={() => changeStatus(status)}
                    disabled={saving || status === order.status}
                  />
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </ScreenShell>
  );
}

function showToast(setToast: (message: string) => void, message: string) {
  setToast(message);
  setTimeout(() => setToast(''), 2600);
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detail}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 30,
  },
  heroCard: {
    backgroundColor: palette.panel,
    borderColor: palette.line,
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  toast: {
    backgroundColor: palette.orangeSoft,
    borderColor: palette.orange,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    padding: 12,
  },
  toastText: {
    color: palette.orange,
    fontSize: 13,
    fontWeight: '900',
  },
  heroTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  heroCopy: {
    flex: 1,
  },
  customer: {
    color: palette.text,
    fontSize: 22,
    fontWeight: '900',
  },
  phone: {
    color: palette.muted,
    fontSize: 14,
    marginTop: 4,
  },
  route: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 23,
    marginTop: 18,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 14,
  },
  detail: {
    backgroundColor: palette.panel,
    borderColor: palette.line,
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 82,
    minWidth: '47%',
    padding: 12,
  },
  detailLabel: {
    color: '#737b89',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  detailValue: {
    color: palette.text,
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 20,
    marginTop: 8,
  },
  notes: {
    backgroundColor: palette.panel,
    borderColor: palette.line,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 14,
    padding: 14,
  },
  notesLabel: {
    color: '#737b89',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  notesText: {
    color: palette.text,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
  statusPanel: {
    gap: 10,
    marginTop: 18,
  },
  panelTitle: {
    color: palette.text,
    fontSize: 18,
    fontWeight: '900',
  },
  statusGrid: {
    gap: 8,
  },
});
