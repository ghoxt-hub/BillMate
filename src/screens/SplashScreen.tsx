import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { TYPOGRAPHY, FONTS } from '../theme/typography';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Center Logo and Text */}
      <View style={styles.centerContent}>
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons name="calendar-check" size={80} color={COLORS.primary} />
        </View>
        <Text style={styles.title}>BillMate</Text>
        <Text style={styles.subtitle}>Never miss a payment</Text>
      </View>

      {/* Bottom Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Track  •  Remind  •  Stay Ahead</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary, // Dark blue background from your design
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 120, // Pushes the logo down from the top edge
    paddingBottom: 60, // Pushes the footer up from the bottom edge
  },
  centerContent: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 20,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.primary, // Teal green
    fontSize: 42, // Making it bigger for the splash screen
    marginBottom: 8,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: '#94A3B8', // Light grey for subtitle
  },
  footer: {
    marginTop: 'auto', // Pushes it to the bottom
  },
  footerText: {
    ...TYPOGRAPHY.caption,
    color: '#64748B',
    letterSpacing: 1,
  }
});