import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { API_BASE_URL } from './src/lib/api';

export default function App() {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style='dark' />

      <View style={styles.header}>
        <Text style={styles.brand}>Carvia</Text>
        <Text style={styles.subtitle}>Luxury car marketplace</Text>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelLabel}>Mobile V1</Text>
        <Text style={styles.panelTitle}>Same backend. New client.</Text>
        <Text style={styles.panelBody}>
          This Expo app will consume the same Express API used by the web
          platform.
        </Text>
      </View>

      <View style={styles.apiBox}>
        <Text style={styles.apiLabel}>API</Text>
        <Text style={styles.apiUrl}>{API_BASE_URL}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f5f2ec',
    paddingHorizontal: 24,
    paddingTop: 72,
  },
  header: {
    marginBottom: 32,
  },
  brand: {
    color: '#171717',
    fontSize: 40,
    fontWeight: '700',
  },
  subtitle: {
    color: '#57534e',
    fontSize: 16,
    marginTop: 8,
  },
  panel: {
    backgroundColor: '#171717',
    borderRadius: 16,
    padding: 24,
  },
  panelLabel: {
    color: '#d6b25e',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  panelTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 30,
  },
  panelBody: {
    color: '#d4d4d4',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 12,
  },
  apiBox: {
    borderColor: '#d6d3d1',
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 20,
    padding: 16,
  },
  apiLabel: {
    color: '#78716c',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  apiUrl: {
    color: '#171717',
    fontSize: 14,
  },
});
