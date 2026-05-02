import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { loginUser } from '@/services/auth';
import { design } from '@/constants/design';
import { ThemedText } from '@/components/themed-text';

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export default function UserLoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      await loginUser({ email, password });
      router.replace('/user-dashboard');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.heroGlowTop} />
      <View style={styles.heroGlowBottom} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inner}>
        <View style={styles.hero}>
          <Text style={styles.kicker}>Customer access</Text>
          <ThemedText type="title" style={styles.title}>
            Sign in to shop with ease
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Access your saved cart, order history, and a streamlined checkout experience.
          </ThemedText>
        </View>

        <View style={styles.card}>
          <View style={styles.field}>
            <Text style={styles.label}>Email address</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="mail-outline" size={18} color={design.colors.muted} />
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={18} color={design.colors.muted} />
              <TextInput
                style={styles.input}
                placeholder="Your password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                autoCapitalize="none"
                value={password}
                onChangeText={setPassword}
              />
            </View>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable style={styles.primaryButton} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Login as User</Text>}
          </Pressable>

          <Pressable style={styles.secondaryButton} onPress={() => router.push('/role-select')} disabled={loading}>
            <Text style={styles.secondaryButtonText}>Choose another role</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: design.colors.bg,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 20,
    overflow: 'hidden',
  },
  heroGlowTop: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 170,
    backgroundColor: 'rgba(140, 91, 46, 0.1)',
    top: -50,
    right: -50,
  },
  heroGlowBottom: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 220,
    backgroundColor: 'rgba(91, 58, 26, 0.08)',
    bottom: -110,
    left: -100,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
  },
  hero: {
    marginBottom: 18,
    padding: 20,
    borderRadius: 28,
    backgroundColor: design.colors.accentDark,
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
  },
  subtitle: {
    color: 'rgba(255, 248, 241, 0.84)',
    marginTop: 12,
    lineHeight: 22,
  },
  card: {
    backgroundColor: design.colors.surface,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: design.colors.border,
    padding: 18,
    shadowColor: '#1F2937',
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
  },
  field: {
    marginBottom: 14,
  },
  label: {
    marginBottom: 8,
    color: design.colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    height: 54,
    borderRadius: 16,
    backgroundColor: design.colors.surfaceMuted,
    borderWidth: 1,
    borderColor: design.colors.border,
  },
  input: {
    flex: 1,
    color: design.colors.text,
    fontSize: 15,
  },
  error: {
    color: design.colors.danger,
    marginBottom: 12,
    fontWeight: '600',
  },
  primaryButton: {
    marginTop: 6,
    backgroundColor: design.colors.accent,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryButton: {
    marginTop: 10,
    alignItems: 'center',
    paddingVertical: 10,
  },
  secondaryButtonText: {
    color: design.colors.accentDark,
    fontSize: 15,
    fontWeight: '700',
  },
});
