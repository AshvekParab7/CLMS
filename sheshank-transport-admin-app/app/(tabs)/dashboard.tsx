import {
  formatCurrency,
  formatDate,
  MetricCard,
  palette,
  ScreenHeader,
  ScreenShell,
  StateBlock,
  StatusBadge,
} from "@/components/admin-ui";
import { fetchMaterials, fetchOrders } from "@/lib/admin-data";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function DashboardScreen() {
  const [orders, setOrders] = useState<Awaited<ReturnType<typeof fetchOrders>>>(
    [],
  );
  const [materials, setMaterials] = useState<
    Awaited<ReturnType<typeof fetchMaterials>>
  >([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError("");

    try {
      const [nextOrders, nextMaterials] = await Promise.all([
        fetchOrders(),
        fetchMaterials(),
      ]);
      setOrders(nextOrders);
      setMaterials(nextMaterials);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load dashboard.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const metrics = useMemo(() => {
    const pendingOrders = orders.filter(
      (order) => order.status === "Pending",
    ).length;
    const deliveredOrders = orders.filter(
      (order) => order.status === "Delivered",
    ).length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
    const lowStock = materials.filter(
      (material) => material.stock <= material.minimumStock,
    ).length;

    return { pendingOrders, deliveredOrders, totalRevenue, lowStock };
  }, [materials, orders]);

  return (
    <ScreenShell>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            tintColor={palette.orange}
            refreshing={refreshing}
            onRefresh={() => loadDashboard(true)}
          />
        }
      >
        <ScreenHeader
          title="Control Room"
          subtitle="Live admin overview for fleet and materials."
        />

        {loading ? (
          <StateBlock
            loading
            title="Loading operations"
            message="Reading orders and inventory from Supabase."
          />
        ) : error ? (
          <StateBlock
            title="Dashboard unavailable"
            message={error}
            onRetry={() => loadDashboard()}
          />
        ) : (
          <>
            <View style={styles.metricsGrid}>
              <MetricCard
                label="Total orders"
                value={`${orders.length}`}
                icon="clipboard-list-outline"
              />
              <MetricCard
                label="Pending orders"
                value={`${metrics.pendingOrders}`}
                icon="clock-alert-outline"
                tone="yellow"
              />
              <MetricCard
                label="Delivered"
                value={`${metrics.deliveredOrders}`}
                icon="check-decagram-outline"
                tone="green"
              />
              <MetricCard
                label="Revenue"
                value={formatCurrency(metrics.totalRevenue)}
                icon="cash-multiple"
                tone="blue"
              />
              <MetricCard
                label="Low stock"
                value={`${metrics.lowStock}`}
                icon="alert-box-outline"
                tone="red"
              />
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent activity</Text>
                <Text style={styles.sectionMeta}>
                  {orders.slice(0, 5).length} latest
                </Text>
              </View>

              {orders.length === 0 ? (
                <StateBlock
                  title="No orders yet"
                  message="Supabase returned an empty orders table."
                />
              ) : (
                orders.slice(0, 5).map((order) => (
                  <View key={order.id} style={styles.activityRow}>
                    <View style={styles.activityRail} />
                    <View style={styles.activityBody}>
                      <View style={styles.activityTop}>
                        <Text style={styles.activityTitle} numberOfLines={1}>
                          {order.customerName}
                        </Text>
                        <StatusBadge status={order.status} />
                      </View>
                      <Text style={styles.activityText} numberOfLines={2}>
                        {order.pickup} to {order.drop}
                      </Text>
                      <Text style={styles.activityMeta}>
                        {formatDate(order.createdAt)}
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          </>
        )}
      </ScrollView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 28,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  section: {
    marginTop: 22,
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    color: palette.text,
    fontSize: 19,
    fontWeight: "900",
  },
  sectionMeta: {
    color: palette.muted,
    fontSize: 13,
  },
  activityRow: {
    backgroundColor: palette.panel,
    borderColor: palette.line,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    marginBottom: 10,
    overflow: "hidden",
    padding: 14,
  },
  activityRail: {
    backgroundColor: palette.orange,
    borderRadius: 8,
    width: 4,
  },
  activityBody: {
    flex: 1,
    gap: 6,
  },
  activityTop: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
  },
  activityTitle: {
    color: palette.text,
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
  },
  activityText: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  activityMeta: {
    color: "#788190",
    fontSize: 12,
  },
});
