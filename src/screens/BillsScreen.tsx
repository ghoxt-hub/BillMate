import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, SafeAreaView, StatusBar } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { TYPOGRAPHY } from '../theme/typography';
import { useBills } from '../context/BillContext';

export default function BillsScreen({ navigation }: any) {
  const { bills } = useBills();
  const [searchQuery, setSearchQuery] = useState('');
  
  // NEW: State to track which tab is selected ('All', 'Bills', or 'Payments')
  const [activeFilter, setActiveFilter] = useState('All');

  // NEW: Updated filter logic
  const filteredBills = bills.filter((bill) => {
    // 1. Check Search Query
    const matchesSearch = 
      bill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.category.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Check Active Tab
    let matchesTab = true;
    if (activeFilter === 'Bills') {
      matchesTab = bill.status !== 'Paid'; // Show only Unpaid
    } else if (activeFilter === 'Payments') {
      matchesTab = bill.status === 'Paid'; // Show only Paid
    }

    return matchesSearch && matchesTab;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />
      <View style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>All Bills</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={22} color={COLORS.textSecondary} style={styles.searchIcon} />
          <TextInput 
            placeholder="Search bills..." 
            placeholderTextColor={COLORS.textSecondary}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialCommunityIcons name="close-circle" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Tabs - Now Clickable! */}
        <View style={styles.filterRow}>
          <TouchableOpacity 
            style={activeFilter === 'All' ? styles.activeFilter : styles.inactiveFilter}
            onPress={() => setActiveFilter('All')}
          >
            <Text style={activeFilter === 'All' ? styles.activeFilterText : styles.inactiveFilterText}>All</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={activeFilter === 'Bills' ? styles.activeFilter : styles.inactiveFilter}
            onPress={() => setActiveFilter('Bills')}
          >
            <Text style={activeFilter === 'Bills' ? styles.activeFilterText : styles.inactiveFilterText}>Bills</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={activeFilter === 'Payments' ? styles.activeFilter : styles.inactiveFilter}
            onPress={() => setActiveFilter('Payments')}
          >
            <Text style={activeFilter === 'Payments' ? styles.activeFilterText : styles.inactiveFilterText}>Payments</Text>
          </TouchableOpacity>
        </View>

        {/* Scrollable List */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
          
          {filteredBills.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="receipt" size={60} color={COLORS.border} />
              <Text style={styles.emptyStateText}>
                {searchQuery ? "No results found" : `No ${activeFilter.toLowerCase()} yet.`}
              </Text>
              <Text style={styles.emptyStateSub}>
                {searchQuery ? "Try a different name." : "Tap the '+' button to add one!"}
              </Text>
            </View>
          ) : (
            filteredBills.map((bill) => (
              <TouchableOpacity 
                key={bill.id} 
                style={styles.billCard}
                onPress={() => navigation.navigate('BillDetails', { billId: bill.id })}
              >
                <View style={styles.billLeft}>
                  <View style={[styles.iconWrapper, { backgroundColor: bill.bg }]}>
                    <MaterialCommunityIcons name={bill.icon as any} size={24} color={bill.color} />
                  </View>
                  <View>
                    <Text style={styles.billName}>{bill.name}</Text>
                    <Text style={styles.billSub}>{bill.date}</Text>
                  </View>
                </View>
                <View style={styles.billRight}>
                  <Text style={styles.billAmount}>{bill.amount}</Text>
                  <Text style={[styles.billStatus, { color: bill.status === 'Paid' ? COLORS.primary : COLORS.error }]}>
                    {bill.status}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.surface },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { ...TYPOGRAPHY.h2, fontSize: 18 },
  
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: 12, paddingHorizontal: 16, height: 50, marginBottom: 20 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, ...TYPOGRAPHY.body, color: COLORS.textPrimary },
  
  filterRow: { flexDirection: 'row', marginBottom: 20 },
  activeFilter: { backgroundColor: COLORS.primary, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, marginRight: 10 },
  activeFilterText: { ...TYPOGRAPHY.button, color: COLORS.surface, fontSize: 13 },
  inactiveFilter: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, marginRight: 10 },
  inactiveFilterText: { ...TYPOGRAPHY.button, color: COLORS.textSecondary, fontSize: 13 },

  billCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  billLeft: { flexDirection: 'row', alignItems: 'center' },
  iconWrapper: { width: 50, height: 50, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  billName: { ...TYPOGRAPHY.button, color: COLORS.textPrimary, marginBottom: 2 },
  billSub: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  billRight: { alignItems: 'flex-end' },
  billAmount: { ...TYPOGRAPHY.button, color: COLORS.textPrimary, marginBottom: 2 },
  billStatus: { ...TYPOGRAPHY.caption, fontSize: 11 },

  emptyState: { alignItems: 'center', marginTop: 50 },
  emptyStateText: { ...TYPOGRAPHY.h2, color: COLORS.textSecondary, marginTop: 10 },
  emptyStateSub: { ...TYPOGRAPHY.body, color: COLORS.textSecondary, fontSize: 14, marginTop: 4 },
});
