import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { TYPOGRAPHY } from '../theme/typography';

// Menu Items Data
const menuItems = [
  { id: '1', title: 'All Bills', icon: 'file-document-outline' },
  { id: '2', title: 'Calendar', icon: 'calendar-blank-outline' },
  { id: '3', title: 'Payment History', icon: 'history' },
  { id: '4', title: 'Settings', icon: 'cog-outline' },
  { id: '5', title: 'Help & Support', icon: 'help-circle-outline' },
  { id: '6', title: 'About', icon: 'information-outline' },
];

export default function MoreScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Profile Header */}
        <View style={styles.profileSection}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="account" size={40} color={COLORS.textSecondary} />
          </View>
          <Text style={styles.userName}>User</Text>
          <Text style={styles.userEmail}>user@example.com</Text>
        </View>

        {/* Menu List */}
        <View style={styles.menuList}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <MaterialCommunityIcons name={item.icon as any} size={22} color={COLORS.textPrimary} style={styles.menuIcon} />
                <Text style={styles.menuTitle}>{item.title}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton}>
          <MaterialCommunityIcons name="logout" size={22} color={COLORS.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <View style={{ height: 120 }} /> {/* Padding for bottom tabs */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.secondary }, // Dark top background
  container: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: 20 },
  
  profileSection: { alignItems: 'center', marginTop: 40, marginBottom: 30 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  userName: { ...TYPOGRAPHY.h2, color: COLORS.textPrimary, marginBottom: 4 },
  userEmail: { ...TYPOGRAPHY.body, color: COLORS.textSecondary, fontSize: 14 },

  menuList: { backgroundColor: COLORS.surface, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, marginBottom: 24, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center' },
  menuIcon: { marginRight: 16 },
  menuTitle: { ...TYPOGRAPHY.button, color: COLORS.textPrimary, fontSize: 15 },

  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.surface, paddingVertical: 16, borderRadius: 16, borderWidth: 1, borderColor: COLORS.error },
  logoutText: { ...TYPOGRAPHY.button, color: COLORS.error, marginLeft: 8 },
});