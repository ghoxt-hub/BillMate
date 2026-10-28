import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { TYPOGRAPHY } from '../theme/typography';
import { useBills } from '../context/BillContext'; // Import the brain

export default function HomeScreen({ navigation }: any) {
  const { bills } = useBills(); // Get the bills from the context
  // Filter out bills that are marked as "Paid"
  const activeBills = bills.filter(bill => bill.status !== 'Paid');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <MaterialCommunityIcons name="account" size={28} color={COLORS.surface} />
            </View>
            <View>
              <Text style={styles.greeting}>Good Morning,</Text>
              <Text style={styles.userName}>User</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.bellIcon} onPress={() => navigation.navigate('Notifications')}>
            <MaterialCommunityIcons name="bell-outline" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Dynamic Next Due Card */}
{activeBills.length > 0 ? (
  <View style={styles.nextDueCard}>
    <Text style={styles.nextDueLabel}>Next Due</Text>
    <Text style={styles.nextDueTitle}>{activeBills[0].name}</Text>
    <View style={styles.nextDueRow}>
      <Text style={styles.nextDueDate}>{activeBills[0].date}</Text>
      <View style={styles.amountContainer}>
        <Text style={styles.amountText}>{activeBills[0].amount}</Text>
        <TouchableOpacity 
          style={styles.payButton}
          onPress={() => navigation.navigate('BillDetails', { billId: bills[0].id })}
        >
          <Text style={styles.payButtonText}>Pay Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
) : (
  <View style={[styles.nextDueCard, { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border }]}>
    <Text style={[styles.nextDueLabel, { color: COLORS.textSecondary }]}>All caught up!</Text>
    <Text style={[styles.nextDueTitle, { color: COLORS.textPrimary }]}>No upcoming bills</Text>
  </View>
)}

        {/* Upcoming Bills Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Bills</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Bills')}>
            <Text style={styles.viewAllText}>View All &gt;</Text>
          </TouchableOpacity>
        </View>

        {/* Bills List - Now reading from Context! */}
        <View style={styles.billsList}>
          {activeBills.map((bill) => (
            <TouchableOpacity 
              key={bill.id} 
              style={styles.billCard}
              onPress={() => navigation.navigate('BillDetails')} 
            >
              <View style={styles.billLeft}>
                <View style={[styles.iconWrapper, { backgroundColor: bill.bg }]}>
                  <MaterialCommunityIcons name={bill.icon as any} size={22} color={bill.color} />
                </View>
                <View>
                  <Text style={styles.billName}>{bill.name}</Text>
                  {/* Using the date instead of 'Due in X days' */}
                  <Text style={styles.billSub}>{bill.date}</Text>
                </View>
              </View>
              <Text style={styles.billAmount}>{bill.amount}</Text>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.secondary },
  container: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 40, marginBottom: 24 },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  greeting: { ...TYPOGRAPHY.body, color: COLORS.textSecondary, fontSize: 13 },
  userName: { ...TYPOGRAPHY.h2, color: COLORS.textPrimary, fontSize: 18 },
  bellIcon: { padding: 8, backgroundColor: COLORS.surface, borderRadius: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  
  nextDueCard: { backgroundColor: COLORS.primary, borderRadius: 20, padding: 20, marginBottom: 24, elevation: 3 },
  nextDueLabel: { ...TYPOGRAPHY.caption, color: '#D1FAE5', marginBottom: 4 },
  nextDueTitle: { ...TYPOGRAPHY.h2, color: COLORS.surface, marginBottom: 16 },
  nextDueRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  nextDueDate: { ...TYPOGRAPHY.body, color: '#D1FAE5', fontSize: 14 },
  amountContainer: { alignItems: 'flex-end' },
  amountText: { ...TYPOGRAPHY.h2, color: COLORS.surface, marginBottom: 8 },
  payButton: { backgroundColor: COLORS.surface, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  payButtonText: { ...TYPOGRAPHY.button, color: COLORS.primary, fontSize: 13 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { ...TYPOGRAPHY.h2, color: COLORS.textPrimary, fontSize: 18 },
  viewAllText: { ...TYPOGRAPHY.body, color: COLORS.textSecondary, fontSize: 14 },

  billsList: { gap: 12 },
  billCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.surface, padding: 16, borderRadius: 16, elevation: 1, shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 4 },
  billLeft: { flexDirection: 'row', alignItems: 'center' },
  iconWrapper: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  billName: { ...TYPOGRAPHY.button, color: COLORS.textPrimary, marginBottom: 2 },
  billSub: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  billAmount: { ...TYPOGRAPHY.button, color: COLORS.textPrimary },
});