import {
  formatCurrency,
  formatDate,
  palette,
  ScreenHeader,
  ScreenShell,
  SearchBox,
  StateBlock,
  StatusBadge,
} from '@/components/admin-ui';
import { AdminOrder, fetchOrders, ORDER_STATUSES, OrderStatus, updateOrderStatus } from '@/lib/admin-data';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { Href } from 'expo-router';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function OrdersScreen() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState('');
  const [toast, setToast] = useState('');

  const loadOrders = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError('');

    try {
      setOrders(await fetchOrders());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load orders.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const filteredOrders = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return orders;
    }

    return orders.filter((order) =>
      [order.customerName, order.phone, order.pickup, order.drop, order.material, order.status]
        .join(' ')
        .toLowerCase()
        .includes(needle)
    );
  }, [orders, query]);

  const handleStatusUpdate = async (order: AdminOrder, status: OrderStatus) => {
    setUpdatingId(order.id);

    try {
      setOrders((current) => current.map((item) => (item.id === order.id ? { ...item, status } : item)));
      const updatedOrder = await updateOrderStatus(order, status);
      setOrders((current) => current.map((item) => (item.id === order.id ? updatedOrder : item)));
      showToast(setToast, `Order marked ${status}`);
      await loadOrders(true);
    } catch (updateError) {
      await loadOrders(true);
      showToast(setToast, updateError instanceof Error ? updateError.message : 'Status update failed.');
    } finally {
      setUpdatingId('');
    }
  };

  return (
    <ScreenShell>
      <ScreenHeader title="Orders" subtitle="Search, dispatch, and close live transport orders." />
      <SearchBox value={query} onChangeText={setQuery} placeholder="Search orders, customer, route..." />
      {toast ? (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      ) : null}

      {loading ? (
        <StateBlock loading title="Loading orders" message="Fetching order rows from Supabase." />
      ) : error ? (
        <StateBlock title="Orders unavailable" message={error} onRetry={() => loadOrders()} />
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              tintColor={palette.orange}
              refreshing={refreshing}
              onRefresh={() => loadOrders(true)}
            />
          }
          ListEmptyComponent={
            <StateBlock
              title={query ? 'No matching orders' : 'No orders found'}
              message={query ? 'Try a different customer, route, phone, or status.' : 'Supabase returned no order rows.'}
            />
          }
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              updating={updatingId === item.id}
              onOpen={() => router.push(`/order/${encodeURIComponent(item.id)}` as Href)}
              onStatusUpdate={(status) => handleStatusUpdate(item, status)}
            />
          )}
        />
      )}
    </ScreenShell>
  );
}

function showToast(setToast: (message: string) => void, message: string) {
  setToast(message);
  setTimeout(() => setToast(''), 2600);
}

function OrderCard({
  order,
  updating,
  onOpen,
  onStatusUpdate,
}: {
  order: AdminOrder;
  updating: boolean;
  onOpen: () => void;
  onStatusUpdate: (status: OrderStatus) => void;
}) {
  return (
    <Pressable onPress={onOpen} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.cardTop}>
        <View style={styles.customerBlock}>
          <Text style={styles.customerName} numberOfLines={1}>
            {order.customerName}
          </Text>
          <Text style={styles.phone}>{order.phone}</Text>
        </View>
        <StatusBadge status={order.status} />
      </View>

      <View style={styles.routeBox}>
        <MaterialCommunityIcons name="map-marker-path" size={20} color={palette.orange} />
        <Text style={styles.routeText} numberOfLines={2}>
          {order.pickup} to {order.drop}
        </Text>
      </View>

      <View style={styles.metaGrid}>
        <Meta label="Material" value={order.material} />
        <Meta label="Amount" value={formatCurrency(order.amount)} />
        <Meta label="Vehicle" value={order.vehicle} />
        <Meta label="Created" value={formatDate(order.createdAt)} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statusStrip}>
        {ORDER_STATUSES.map((status) => (
          <Pressable
            key={status}
            disabled={updating || status === order.status}
            onPress={() => onStatusUpdate(status)}
            style={[
              styles.statusChip,
              status === order.status && styles.activeStatusChip,
              updating && styles.disabledChip,
            ]}>
            <Text style={[styles.statusChipText, status === order.status && styles.activeStatusText]}>
              {status}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </Pressable>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaItem}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
    paddingBottom: 30,
    paddingTop: 14,
  },
  toast: {
    backgroundColor: palette.orangeSoft,
    borderColor: palette.orange,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 12,
    padding: 12,
  },
  toastText: {
    color: palette.orange,
    fontSize: 13,
    fontWeight: '900',
  },
  card: {
    backgroundColor: palette.panel,
    borderColor: palette.line,
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
  },
  pressed: {
    opacity: 0.88,
  },
  cardTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  customerBlock: {
    flex: 1,
  },
  customerName: {
    color: palette.text,
    fontSize: 17,
    fontWeight: '900',
  },
  phone: {
    color: palette.muted,
    fontSize: 13,
    marginTop: 3,
  },
  routeBox: {
    alignItems: 'center',
    backgroundColor: palette.orangeSoft,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    padding: 12,
  },
  routeText: {
    color: palette.text,
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 14,
  },
  metaItem: {
    minWidth: '47%',
  },
  metaLabel: {
    color: '#737b89',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  metaValue: {
    color: palette.text,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  statusStrip: {
    gap: 8,
    paddingTop: 16,
  },
  statusChip: {
    backgroundColor: palette.panel2,
    borderColor: palette.line,
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 36,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  activeStatusChip: {
    backgroundColor: palette.orange,
    borderColor: palette.orange,
  },
  disabledChip: {
    opacity: 0.55,
  },
  statusChipText: {
    color: palette.muted,
    fontSize: 12,
    fontWeight: '900',
  },
  activeStatusText: {
    color: palette.bg,
  },
});
