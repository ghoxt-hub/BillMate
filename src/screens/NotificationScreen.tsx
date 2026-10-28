import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { TYPOGRAPHY } from '../theme/typography';

export default function NotificationScreen({ navigation }: any) {
  return (
    <LinearGradient
      colors={['#1e1b4b', '#312e81', '#1e1b4b']} // Dark blue/purple gradient
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      
      <SafeAreaView style={styles.safeArea}>
        
        {/* Clock Section */}
        <View style={styles.clockContainer}>
          <Text style={styles.time}>9:41</Text>
          <Text style={styles.date}>Sun, 17 Oct</Text>
        </View>

        {/* Notification Card */}
        <View style={styles.notificationWrapper}>
          <View style={styles.notificationCard}>
            <View style={styles.notificationHeader}>
              <View style={styles.appIcon}>
                <MaterialCommunityIcons name="calendar-check" size={16} color={COLORS.primary} />
              </View>
              <Text style={styles.appName}>BillMate</Text>
              <Text style={styles.timeAgo}>9:41 AM</Text>
            </View>
            
            <Text style={styles.notificationTitle}>Bill Reminder</Text>
            <Text style={styles.notificationBody}>
              Your Electricity bill is due in 3 days (20 Oct 2025). Amount: Rs. 4,850.
            </Text>
          </View>
        </View>

        {/* Bottom Area */}
        <View style={styles.bottomArea}>
          <Text style={styles.swipeText}>Swipe up to unlock</Text>
          <View style={styles.homeIndicator} />
          
          {/* A temporary back button so you can return to the app */}
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Go Back to App</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, justifyContent: 'space-between' },
  
  clockContainer: { alignItems: 'center', marginTop: 60 },
  time: { fontSize: 80, fontFamily: 'Poppins_500Medium', color: COLORS.surface, lineHeight: 90 },
  date: { ...TYPOGRAPHY.h2, color: '#CBD5E1', fontSize: 20, fontWeight: '400' },

  notificationWrapper: { paddingHorizontal: 16 },
  notificationCard: { backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: 20, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
  notificationHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  appIcon: { width: 24, height: 24, borderRadius: 6, backgroundColor: '#D1FAE5', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  appName: { ...TYPOGRAPHY.button, color: COLORS.textSecondary, fontSize: 13, flex: 1 },
  timeAgo: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  notificationTitle: { ...TYPOGRAPHY.button, color: COLORS.textPrimary, marginBottom: 4 },
  notificationBody: { ...TYPOGRAPHY.body, color: COLORS.textPrimary, fontSize: 14, lineHeight: 20 },

  bottomArea: { alignItems: 'center', marginBottom: 40 },
  swipeText: { ...TYPOGRAPHY.caption, color: '#94A3B8', marginBottom: 20 },
  homeIndicator: { width: 140, height: 5, borderRadius: 3, backgroundColor: COLORS.surface, marginBottom: 20 },
  
  backButton: { paddingVertical: 10, paddingHorizontal: 20, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20 },
  backButtonText: { ...TYPOGRAPHY.button, color: COLORS.surface, fontSize: 14 }
});