import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { TYPOGRAPHY } from '../theme/typography';
import { useBills } from '../context/BillContext';

export default function BillDetailsScreen({ route, navigation }: any) {
  // 1. Grab deleteBill from the context
  const { bills, markAsPaid, deleteBill } = useBills();
  
  const { billId } = route.params || { billId: '1' }; 
  const bill = bills.find((b) => b.id === billId) || bills[0];

  // Safety check in case all bills are deleted
  if (!bill) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: COLORS.surface }}>Bill not found.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
          <Text style={{ color: COLORS.primary }}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const isPaid = bill.status === 'Paid';

  const handleMarkAsPaid = () => {
    markAsPaid(bill.id);
    navigation.goBack(); 
  };

  // 2. NEW: The delete confirmation popup
  const handleDelete = () => {
    Alert.alert(
      "Delete Bill",
      "Are you sure you want to delete this bill? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => {
            deleteBill(bill.id);
            navigation.goBack();
          } 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.secondary} />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 20 }}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.surface} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bill Details</Text>
          
          {/* 3. NEW: Replaced the pencil icon with a red Trash icon */}
          <TouchableOpacity style={styles.editButton} onPress={handleDelete}>
            <MaterialCommunityIcons name="trash-can-outline" size={24} color={COLORS.error} />
          </TouchableOpacity>
        </View>

        {/* Main Card */}
        <View style={styles.card}>
          
          <View style={styles.billHeader}>
            <View style={[styles.iconWrapper, { backgroundColor: bill.bg }]}>
              <MaterialCommunityIcons name={bill.icon as any} size={32} color={bill.color} />
            </View>
            <View style={styles.billTitleContainer}>
              <Text style={styles.billName}>{bill.name}</Text>
              <Text style={styles.billProvider}>{bill.category}</Text>
              
              <View style={[styles.statusBadge, isPaid ? styles.statusPaid : styles.statusUnpaid]}>
                <Text style={[styles.statusBadgeText, isPaid ? {color: COLORS.primary} : {color: '#F59E0B'}]}>
                  {isPaid ? 'Paid' : 'Unpaid'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailsList}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Amount</Text>
              <Text style={styles.detailValueBold}>{bill.amount}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Due Date</Text>
              <Text style={styles.detailValue}>{bill.date}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Bill No.</Text>
              <Text style={styles.detailValue}>123456789</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status</Text>
              <View style={[styles.badge, isPaid ? styles.badgePaid : styles.badgeUnpaid]}>
                <Text style={[styles.badgeText, isPaid ? {color: COLORS.primary} : {color: COLORS.error}]}>
                  {bill.status}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.infoBox}>
            <MaterialCommunityIcons name="clock-outline" size={20} color="#3B82F6" />
            <Text style={styles.infoText}>Keep your bill paid and avoid late fees.</Text>
          </View>

        </View>

        {!isPaid && (
          <TouchableOpacity style={styles.payButton} onPress={handleMarkAsPaid}>
            <Text style={styles.payButtonText}>Mark as Paid</Text>
          </TouchableOpacity>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.secondary },
  container: { flex: 1, paddingHorizontal: 20 },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 32 },
  backButton: { padding: 8, marginLeft: -8 },
  headerTitle: { ...TYPOGRAPHY.h2, color: COLORS.surface, fontSize: 18 },
  editButton: { padding: 8, marginRight: -8 },

  card: { backgroundColor: COLORS.surface, borderRadius: 24, padding: 24, marginBottom: 24, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  
  billHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  iconWrapper: { width: 64, height: 64, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  billTitleContainer: { flex: 1 },
  billName: { ...TYPOGRAPHY.h2, color: COLORS.textPrimary, marginBottom: 2 },
  billProvider: { ...TYPOGRAPHY.body, color: COLORS.textSecondary, marginBottom: 8 },
  
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start' },
  statusPaid: { backgroundColor: '#D1FAE5' },
  statusUnpaid: { backgroundColor: '#FEF3C7' },
  statusBadgeText: { ...TYPOGRAPHY.caption, fontSize: 11 },

  divider: { height: 1, backgroundColor: COLORS.border, marginBottom: 20 },

  detailsList: { marginBottom: 20 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  detailLabel: { ...TYPOGRAPHY.body, color: COLORS.textSecondary },
  detailValue: { ...TYPOGRAPHY.button, color: COLORS.textPrimary },
  detailValueBold: { ...TYPOGRAPHY.h2, color: COLORS.textPrimary, fontSize: 18 },
  
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  badgePaid: { backgroundColor: '#D1FAE5' },
  badgeUnpaid: { backgroundColor: '#FEE2E2' },
  badgeText: { ...TYPOGRAPHY.caption, fontSize: 12 },

  infoBox: { flexDirection: 'row', backgroundColor: '#EFF6FF', padding: 16, borderRadius: 16, alignItems: 'center' },
  infoText: { ...TYPOGRAPHY.body, color: '#3B82F6', fontSize: 13, marginLeft: 10, flex: 1 },

  payButton: { backgroundColor: COLORS.primary, paddingVertical: 18, borderRadius: 16, alignItems: 'center', marginBottom: 40 },
  payButtonText: { ...TYPOGRAPHY.button, color: COLORS.surface, fontSize: 16 },
});