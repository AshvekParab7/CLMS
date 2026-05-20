import { ActionButton, palette, ScreenHeader, ScreenShell, StateBlock } from '@/components/admin-ui';
import { checkSupabaseConnection } from '@/lib/admin-data';
import { supabase } from '@/lib/supabase';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  const [email, setEmail] = useState('Admin');
  const [connection, setConnection] = useState({ ok: false, message: 'Checking...' });
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const loadProfile = useCallback(async () => {
    setLoading(true);

    const [{ data }, nextConnection] = await Promise.all([
      supabase.auth.getUser(),
      checkSupabaseConnection(),
    ]);

    setEmail(data.user?.email ?? 'Admin');
    setConnection(nextConnection);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const logout = async () => {
    setLoggingOut(true);
    const { error } = await supabase.auth.signOut();
    setLoggingOut(false);

    if (error) {
      Alert.alert('Logout failed', error.message);
      return;
    }

    Alert.alert('Logged out', 'The Supabase session has been cleared on this device.');
  };

  return (
    <ScreenShell>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <ScreenHeader title="Profile" subtitle="Admin session and backend health." />

        {loading ? (
          <StateBlock loading title="Checking backend" message="Validating Supabase and session state." />
        ) : (
          <>
            <View style={styles.profileCard}>
              <View style={styles.avatar}>
                <MaterialCommunityIcons name="account-hard-hat" color={palette.orange} size={34} />
              </View>
              <View style={styles.profileCopy}>
                <Text style={styles.name}>Transport Admin</Text>
                <Text style={styles.email}>{email}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <InfoRow
                icon="server-network"
                label="Backend status"
                value={connection.ok ? 'Online' : 'Needs attention'}
                good={connection.ok}
              />
              <InfoRow
                icon="database-check"
                label="Supabase connection"
                value={connection.message}
                good={connection.ok}
              />
              <InfoRow
                icon="cellphone-cog"
                label="App version"
                value={Constants.expoConfig?.version ?? '1.0.0'}
                good
              />
              <InfoRow icon="shield-account" label="Role" value="Operations administrator" good />
            </View>

            <ActionButton
              label={loggingOut ? 'Logging out...' : 'Logout'}
              icon="logout"
              onPress={logout}
              disabled={loggingOut}
            />
          </>
        )}
      </ScrollView>
    </ScreenShell>
  );
}

function InfoRow({
  icon,
  label,
  value,
  good,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: string;
  good: boolean;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={[styles.infoIcon, { backgroundColor: good ? '#163326' : '#3b1d1d' }]}>
        <MaterialCommunityIcons name={icon} size={20} color={good ? palette.green : palette.red} />
      </View>
      <View style={styles.infoCopy}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 30,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: palette.panel,
    borderColor: palette.line,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    padding: 16,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: palette.orangeSoft,
    borderRadius: 8,
    height: 58,
    justifyContent: 'center',
    width: 58,
  },
  profileCopy: {
    flex: 1,
  },
  name: {
    color: palette.text,
    fontSize: 20,
    fontWeight: '900',
  },
  email: {
    color: palette.muted,
    fontSize: 14,
    marginTop: 4,
  },
  section: {
    backgroundColor: palette.panel,
    borderColor: palette.line,
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: 16,
  },
  infoRow: {
    alignItems: 'center',
    borderBottomColor: palette.line,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 14,
  },
  infoIcon: {
    alignItems: 'center',
    borderRadius: 8,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  infoCopy: {
    flex: 1,
  },
  infoLabel: {
    color: '#737b89',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  infoValue: {
    color: palette.text,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
});
