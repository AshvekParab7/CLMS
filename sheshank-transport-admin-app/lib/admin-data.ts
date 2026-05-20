import { supabase } from "@/lib/supabase";

export const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Dispatched",
  "In Transit",
  "Delivered",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type AdminOrder = {
  id: string;
  idColumn: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  pickup: string;
  drop: string;
  material: string;
  vehicle: string;
  amount: number;
  status: OrderStatus;
  createdAt: string;
};

type SupabaseOrderRow = Record<string, unknown>;

type SupabaseOrderItemRow = {
  order_id: string;
  material_id?: string | null;
  material_name?: string | null;
  quantity?: number | string | null;
  price?: number | string | null;
  unit_price?: number | string | null;
  unit?: string | null;
};

export type MaterialItem = {
  id: string;
  idColumn: string;
  tableName: string;
  name: string;
  unit: string;
  price: number;
  stock: number;
  minimumStock: number;
  priceColumn: string;
  stockColumn: string;
  updatedAt: string;
  raw: Record<string, unknown>;
};

type CandidateResult<T> = {
  data: T[];
  tableName: string;
};

const ORDER_ID_COLUMNS = ["id", "order_id", "uuid", "order_uuid", "booking_id"];

const MATERIAL_TABLES = [
  "materials",
  "inventory",
  "products",
  "construction_materials",
  "material_inventory",
  "stock",
];

let materialTableCache: string | null = null;

const readString = (
  row: Record<string, unknown>,
  keys: string[],
  fallback = "",
) => {
  for (const key of keys) {
    const value = row[key];
    if (
      value !== null &&
      value !== undefined &&
      String(value).trim().length > 0
    ) {
      return String(value);
    }
  }
  return fallback;
};

const readNumber = (
  row: Record<string, unknown>,
  keys: string[],
  fallback = 0,
) => {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === "string") {
      const parsed = Number(value.replace(/[^0-9.-]/g, ""));
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }
  return fallback;
};

const firstExistingKey = (
  row: Record<string, unknown>,
  keys: string[],
  fallback: string,
) =>
  keys.find((key) => Object.prototype.hasOwnProperty.call(row, key)) ??
  fallback;

const normalizeStatus = (value: string): OrderStatus => {
  const cleaned = value.trim().toLowerCase().replace(/[_-]+/g, " ");
  const match = ORDER_STATUSES.find(
    (status) => status.toLowerCase() === cleaned,
  );
  return match ?? "Pending";
};

const getIdColumn = (row: Record<string, unknown>) =>
  firstExistingKey(row, ["id", "material_id", "uuid"], "id");

async function selectFromCandidates<T extends Record<string, unknown>>(
  candidates: string[],
  cachedTable: string | null,
  setCache: (tableName: string) => void,
): Promise<CandidateResult<T>> {
  const orderedCandidates = cachedTable
    ? [cachedTable, ...candidates.filter((table) => table !== cachedTable)]
    : candidates;

  const errors: string[] = [];

  for (const tableName of orderedCandidates) {
    const { data, error } = await supabase.from(tableName).select("*");

    if (!error) {
      setCache(tableName);
      return { data: (data ?? []) as T[], tableName };
    }

    errors.push(`${tableName}: ${error.message}`);
  }

  throw new Error(errors.join("\n"));
}

export async function fetchOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as SupabaseOrderRow[];
  const orderIds = rows
    .map((row) => readString(row, [getOrderIdColumn(row)], cryptoSafeId(row)))
    .filter(Boolean);
  const itemsByOrderId = await fetchOrderItems(orderIds);

  return rows.map((row) => {
    const idColumn = getOrderIdColumn(row);
    const orderId = readString(row, [idColumn], cryptoSafeId(row));
    return normalizeOrder(
      row,
      itemsByOrderId[orderId] ?? [],
      idColumn,
      orderId,
    );
  });
}

export async function fetchMaterials() {
  try {
    const { data, tableName } = await selectFromCandidates<
      Record<string, unknown>
    >(MATERIAL_TABLES, materialTableCache, (table) => {
      materialTableCache = table;
    });

    return data.map((row) => normalizeMaterial(row, tableName));
  } catch {
    return [];
  }
}

export async function updateOrderStatus(
  order: AdminOrder,
  status: OrderStatus,
) {
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq(order.idColumn, order.id)
    .select("*")
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error(
      "Supabase accepted the request but did not update a row. Check the orders.id value and the orders UPDATE RLS policy.",
    );
  }

  return normalizeOrder(data as SupabaseOrderRow, [], order.idColumn, order.id);
}

export async function updateMaterial(
  material: MaterialItem,
  values: { price: number; stock: number },
) {
  const { error } = await supabase
    .from(material.tableName)
    .update({
      [material.priceColumn]: values.price,
      [material.stockColumn]: values.stock,
    })
    .eq(material.idColumn, material.id);

  if (error) {
    throw error;
  }
}

export async function checkSupabaseConnection() {
  for (const tableName of ["orders", ...MATERIAL_TABLES]) {
    const { error } = await supabase
      .from(tableName)
      .select("*", { count: "exact", head: true });
    if (!error) {
      return { ok: true, message: `Connected to ${tableName}` };
    }
  }

  return {
    ok: false,
    message:
      "Connected to Supabase, but no admin tables are readable with this anon key.",
  };
}

async function fetchOrderItems(orderIds: string[]) {
  if (orderIds.length === 0) {
    return {};
  }

  const { data, error } = await supabase
    .from("order_items")
    .select("*")
    .in("order_id", orderIds);

  if (error) {
    return {};
  }

  return ((data ?? []) as SupabaseOrderItemRow[]).reduce<
    Record<string, SupabaseOrderItemRow[]>
  >((groups, item) => {
    groups[item.order_id] = [...(groups[item.order_id] ?? []), item];
    return groups;
  }, {});
}

function normalizeOrder(
  row: SupabaseOrderRow,
  items: SupabaseOrderItemRow[],
  idColumn: string,
  id: string,
): AdminOrder {
  const deliveryAddress = readObject(row, "delivery_address");
  const siteName = readString(deliveryAddress, ["siteName", "site_name"]);
  const street = readString(deliveryAddress, ["street", "address"]);
  const city = readString(deliveryAddress, ["city"]);
  const state = readString(deliveryAddress, ["state"]);
  const postalCode = readString(deliveryAddress, ["postalCode", "postal_code"]);
  const addressParts = [siteName, street, city, state, postalCode].filter(
    Boolean,
  );

  return {
    id,
    idColumn,
    orderNumber: readString(
      row,
      ["order_number"],
      readString(row, ["id"], "").slice(0, 8).toUpperCase(),
    ),
    customerName: readString(
      row,
      ["customer_name", "name", "full_name", "client_name"],
      siteName || "Guest customer",
    ),
    phone: readString(
      row,
      ["customer_phone", "phone", "mobile", "phone_number"],
      readString(deliveryAddress, ["phone"], "No phone"),
    ),
    pickup: readString(
      row,
      ["pickup_location", "pickup", "from_location"],
      "Sheshank Transport Yard",
    ),
    drop: readString(
      row,
      ["destination", "drop_location", "to_location"],
      addressParts.join(", ") || "Destination not provided",
    ),
    material: readString(
      row,
      ["material_name", "material", "goods_type"],
      summarizeItems(items),
    ),
    vehicle: readString(
      row,
      ["vehicle_type", "vehicle", "truck_type"],
      "Transport vehicle",
    ),
    amount: readNumber(row, [
      "total_amount",
      "amount",
      "total_price",
      "revenue",
    ]),
    status: normalizeStatus(readString(row, ["status"], "Pending")),
    createdAt: readString(row, ["created_at", "inserted_at", "order_date"], ""),
  };
}

function normalizeMaterial(
  row: Record<string, unknown>,
  tableName: string,
): MaterialItem {
  const idColumn = getIdColumn(row);
  const priceColumn = firstExistingKey(
    row,
    ["price", "unit_price", "selling_price", "rate"],
    "price",
  );
  const stockColumn = firstExistingKey(
    row,
    ["stock", "stock_quantity", "quantity", "available_quantity"],
    "stock",
  );

  return {
    id: readString(row, [idColumn], cryptoSafeId(row)),
    idColumn,
    tableName,
    name: readString(
      row,
      ["name", "material_name", "title", "product_name"],
      "Unnamed material",
    ),
    unit: readString(row, ["unit", "measurement_unit", "uom"], "unit"),
    price: readNumber(row, [priceColumn]),
    stock: readNumber(row, [stockColumn]),
    minimumStock: readNumber(
      row,
      ["minimum_stock", "min_stock", "low_stock_threshold"],
      10,
    ),
    priceColumn,
    stockColumn,
    updatedAt: readString(row, ["updated_at", "created_at", "inserted_at"], ""),
    raw: row,
  };
}

function cryptoSafeId(row: Record<string, unknown>) {
  return JSON.stringify(row).slice(0, 48);
}

function dateValue(value: string) {
  const time = new Date(value).getTime();
  return Number.isFinite(time) ? time : 0;
}

function getOrderIdColumn(row: Record<string, unknown>) {
  return firstExistingKey(row, ORDER_ID_COLUMNS, "id");
}

function readObject(row: Record<string, unknown>, key: string) {
  const value = row[key];
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function summarizeItems(items: SupabaseOrderItemRow[]) {
  if (items.length === 0) {
    return "Materials not listed";
  }

  return items
    .map((item) => {
      const name =
        item.material_name?.trim() || titleize(item.material_id ?? "Material");
      const quantity = item.quantity ? ` x ${item.quantity}` : "";
      return `${name}${quantity}`;
    })
    .join(", ");
}

function titleize(value: string) {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
