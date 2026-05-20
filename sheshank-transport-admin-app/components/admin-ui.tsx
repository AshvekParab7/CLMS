import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const palette = {
  bg: '#0f1115',
  panel: '#181b22',
  panel2: '#20242d',
  line: '#2d333f',
  text: '#f6f7f9',
  muted: '#aeb6c4',
  orange: '#ff7a1a',
  orangeSoft: '#3a2518',
  green: '#2dd36f',
  yellow: '#f5c542',
  red: '#ff5d5d',
  blue: '#4da3ff',
};

export function ScreenShell({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();

  return <View style={[styles.shell, { paddingTop: insets.top + 16 }]}>{children}</View>;
}

export function ScreenHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <View style={styles.header}>
      <View style={styles.headerCopy}>
        <Text style={styles.eyebrow}>Sheshank Transport</Text>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

export function MetricCard({
  label,
  value,
  icon,
  tone = 'orange',
}: {
  label: string;
  value: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  tone?: 'orange' | 'green' | 'yellow' | 'blue' | 'red';
}) {
  return (
    <View style={styles.metricCard}>
      <View style={[styles.metricIcon, { backgroundColor: toneColor(tone, true) }]}>
        <MaterialCommunityIcons name={icon} color={toneColor(tone)} size={20} />
      </View>
      <Text style={styles.metricValue} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

export function StateBlock({
  title,
  message,
  loading,
  onRetry,
}: {
  title: string;
  message: string;
  loading?: boolean;
  onRetry?: () => void;
}) {
  return (
    <View style={styles.stateBlock}>
      {loading ? <ActivityIndicator color={palette.orange} /> : null}
      <Text style={styles.stateTitle}>{title}</Text>
      <Text style={styles.stateMessage}>{message}</Text>
      {onRetry ? <ActionButton label="Retry" icon="refresh" onPress={onRetry} compact /> : null}
    </View>
  );
}

export function SearchBox(props: TextInputProps) {
  return (
    <View style={styles.searchWrap}>
      <MaterialCommunityIcons name="magnify" size={20} color={palette.muted} />
      <TextInput
        {...props}
        placeholderTextColor="#737b89"
        style={styles.searchInput}
        selectionColor={palette.orange}
      />
    </View>
  );
}

export function ActionButton({
  label,
  icon,
  onPress,
  compact,
  disabled,
}: {
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  onPress: () => void;
  compact?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        compact && styles.compactButton,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}>
      <MaterialCommunityIcons name={icon} size={18} color={palette.bg} />
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const tone = status.toLowerCase().includes('delivered')
    ? 'green'
    : status.toLowerCase().includes('transit') || status.toLowerCase().includes('dispatch')
      ? 'blue'
      : status.toLowerCase().includes('confirm')
        ? 'yellow'
        : 'orange';

  return (
    <View style={[styles.badge, { backgroundColor: toneColor(tone, true) }]}>
      <Text style={[styles.badgeText, { color: toneColor(tone) }]}>{status}</Text>
    </View>
  );
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export function formatDate(value: string) {
  if (!value) {
    return 'Date not set';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function toneColor(tone: string, soft = false) {
  if (soft) {
    return {
      orange: palette.orangeSoft,
      green: '#163326',
      yellow: '#342d16',
      blue: '#172b40',
      red: '#3b1d1d',
    }[tone]!;
  }

  return {
    orange: palette.orange,
    green: palette.green,
    yellow: palette.yellow,
    blue: palette.blue,
    red: palette.red,
  }[tone]!;
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: palette.bg,
    paddingHorizontal: 18,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  headerCopy: {
    flex: 1,
  },
  eyebrow: {
    color: palette.orange,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  title: {
    color: palette.text,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0,
    marginTop: 3,
  },
  subtitle: {
    color: palette.muted,
    fontSize: 14,
    marginTop: 4,
  },
  metricCard: {
    backgroundColor: palette.panel,
    borderColor: palette.line,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    minHeight: 128,
    minWidth: '47%',
    padding: 14,
  },
  metricIcon: {
    alignItems: 'center',
    borderRadius: 8,
    height: 36,
    justifyContent: 'center',
    marginBottom: 14,
    width: 36,
  },
  metricValue: {
    color: palette.text,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0,
  },
  metricLabel: {
    color: palette.muted,
    fontSize: 13,
    marginTop: 6,
  },
  stateBlock: {
    alignItems: 'center',
    backgroundColor: palette.panel,
    borderColor: palette.line,
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
    marginTop: 16,
    padding: 22,
  },
  stateTitle: {
    color: palette.text,
    fontSize: 17,
    fontWeight: '800',
  },
  stateMessage: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  searchWrap: {
    alignItems: 'center',
    backgroundColor: palette.panel,
    borderColor: palette.line,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    height: 48,
    paddingHorizontal: 14,
  },
  searchInput: {
    color: palette.text,
    flex: 1,
    fontSize: 15,
  },
  button: {
    alignItems: 'center',
    backgroundColor: palette.orange,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 14,
  },
  compactButton: {
    minHeight: 38,
  },
  buttonText: {
    color: palette.bg,
    fontSize: 14,
    fontWeight: '900',
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '900',
  },
});
