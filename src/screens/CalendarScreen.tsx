import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { TYPOGRAPHY } from '../theme/typography';
import { useBills } from '../context/BillContext';

// Configure the calendar to use English
LocaleConfig.locales['en'] = {
  monthNames: ['January','February','March','April','May','June','July','August','September','October','November','December'],
  monthNamesShort: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
  dayNames: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
  dayNamesShort: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
};
LocaleConfig.defaultLocale = 'en';

export default function CalendarScreen({ navigation }: any) {
  const { bills } = useBills();
  
  // Get today's date in YYYY-MM-DD format
  const today = new Date();
  const formattedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  const [selectedDate, setSelectedDate] = useState(formattedToday);

  // Helper function to convert our bill date (e.g., "20 Oct 2025") to "2025-10-20"
  const formatBillDateToCalendar = (dateString: string) => {
    const parts = dateString.split(' ');
    if (parts.length !== 3) return '';
    const day = parts[0].padStart(2, '0');
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = String(monthNames.indexOf(parts[1]) + 1).padStart(2, '0');
    const year = parts[2];
    return `${year}-${month}-${day}`;
  };

  // Create the dots for the calendar
  const markedDates: any = {};
  
  bills.forEach(bill => {
    if (bill.status !== 'Paid') {
      const dateString = formatBillDateToCalendar(bill.date);
      if (dateString) {
        markedDates[dateString] = { marked: true, dotColor: COLORS.primary };
      }
    }
  });

  // Highlight the selected date
  markedDates[selectedDate] = { 
    ...markedDates[selectedDate], 
    selected: true, 
    selectedColor: COLORS.primary 
  };

  // Filter bills for the selected day
  const billsForSelectedDate = bills.filter(bill => 
    bill.status !== 'Paid' &&
    formatBillDateToCalendar(bill.date) === selectedDate
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Calendar</Text>
        </View>

        {/* The Real Calendar */}
        <View style={styles.calendarContainer}>
          <Calendar
            current={formattedToday}
            onDayPress={(day: any) => setSelectedDate(day.dateString)}
            markedDates={markedDates}
            theme={{
              backgroundColor: COLORS.surface,
              calendarBackground: COLORS.surface,
              textSectionTitleColor: COLORS.textSecondary,
              selectedDayBackgroundColor: COLORS.primary,
              selectedDayTextColor: COLORS.surface,
              todayTextColor: COLORS.primary,
              dayTextColor: COLORS.textPrimary,
              textDisabledColor: '#d9e1e8',
              dotColor: COLORS.primary,
              selectedDotColor: COLORS.surface,
              arrowColor: COLORS.primary,
              monthTextColor: COLORS.textPrimary,
              indicatorColor: COLORS.primary,
              textDayFontFamily: 'Poppins_400Regular',
              textMonthFontFamily: 'Poppins_600SemiBold',
              textDayHeaderFontFamily: 'Poppins_500Medium',
              textDayFontSize: 14,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 12
            }}
          />
        </View>

        {/* Bills for selected day */}
        <Text style={styles.sectionTitle}>
          Bills on {selectedDate === formattedToday ? 'Today' : selectedDate}
        </Text>
        
        <View style={styles.billsList}>
          {billsForSelectedDate.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="calendar-check" size={40} color={COLORS.border} />
              <Text style={styles.emptyText}>No bills due on this day.</Text>
            </View>
          ) : (
            billsForSelectedDate.map((bill) => (
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
                    <Text style={styles.billSub}>{bill.amount}</Text>
                  </View>
                </View>
                
                <View style={[styles.statusBadge, { backgroundColor: bill.status === 'Paid' ? '#D1FAE5' : '#FEE2E2' }]}>
                  <Text style={[styles.statusText, { color: bill.status === 'Paid' ? COLORS.primary : COLORS.error }]}>
                    {bill.status}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.surface },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  
  header: { marginBottom: 20 },
  headerTitle: { ...TYPOGRAPHY.h2, fontSize: 18 },

  calendarContainer: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 20, overflow: 'hidden', marginBottom: 24 },
  
  sectionTitle: { ...TYPOGRAPHY.h2, fontSize: 16, marginBottom: 16 },
  
  billsList: { gap: 12 },
  billCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, padding: 16, borderRadius: 16 },
  billLeft: { flexDirection: 'row', alignItems: 'center' },
  iconWrapper: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  billName: { ...TYPOGRAPHY.button, color: COLORS.textPrimary, marginBottom: 2 },
  billSub: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { ...TYPOGRAPHY.caption, fontSize: 11 },

  emptyState: { alignItems: 'center', marginTop: 20, padding: 20, backgroundColor: COLORS.background, borderRadius: 16 },
  emptyText: { ...TYPOGRAPHY.body, color: COLORS.textSecondary, marginTop: 10 },
});