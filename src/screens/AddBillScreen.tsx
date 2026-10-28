import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, SafeAreaView, StatusBar, Alert, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker'; // <-- Import Date Picker
import { COLORS } from '../theme/colors';
import { TYPOGRAPHY } from '../theme/typography';
import { useBills } from '../context/BillContext';

const categories = [
  { id: '1', name: 'Electricity', icon: 'lightning-bolt', color: '#F59E0B', bg: '#FEF3C7' },
  { id: '2', name: 'Gas', icon: 'fire', color: '#EF4444', bg: '#FEE2E2' },
  { id: '3', name: 'Water', icon: 'water', color: '#3B82F6', bg: '#DBEAFE' },
  { id: '4', name: 'Internet', icon: 'wifi', color: '#3B82F6', bg: '#DBEAFE' },
  { id: '5', name: 'Rent', icon: 'home', color: '#10B981', bg: '#D1FAE5' },
  { id: '6', name: 'Mobile', icon: 'cellphone', color: '#6366F1', bg: '#E0E7FF' },
  { id: '7', name: 'TV', icon: 'television', color: '#EC4899', bg: '#FCE7F3' },
  { id: '8', name: 'Others', icon: 'dots-horizontal', color: '#64748B', bg: '#F1F5F9' },
];

export default function AddBillScreen({ navigation }: any) {
  const { addBill } = useBills(); 

  const [billName, setBillName] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  // NEW: Date Picker States
  const [date, setDate] = useState(new Date()); // Holds the actual date object
  const [showPicker, setShowPicker] = useState(false); // Toggles the popup

  // Format the date to look like "20 Oct 2025"
  const formatDate = (rawDate: Date) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = rawDate.getDate();
    const month = months[rawDate.getMonth()];
    const year = rawDate.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Handle date selection
  const onChangeDate = (event: any, selectedDate?: Date) => {
    // On Android, the picker closes automatically
    setShowPicker(Platform.OS === 'ios'); 
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleSave = () => {
    if (!billName || !amount) {
      Alert.alert("Missing Info", "Please fill out the bill name and amount.");
      return;
    }

    const newBill = {
      id: Date.now().toString(),
      name: billName,
      amount: `Rs. ${amount}`,
      date: formatDate(date), // Use our formatted date string
      category: selectedCategory.name,
      icon: selectedCategory.icon,
      color: selectedCategory.color,
      bg: selectedCategory.bg,
      status: 'Unpaid'
    };

    addBill(newBill); 

    // Clear the form
    setBillName('');
    setAmount('');
    setDate(new Date()); // Reset date to today
    setSelectedCategory(categories[0]); 

    navigation.goBack(); 
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
        
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Bill / Payment</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.toggleContainer}>
          <TouchableOpacity style={styles.activeToggle}>
            <Text style={styles.activeToggleText}>Bill</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.inactiveToggle}>
            <Text style={styles.inactiveToggleText}>Other Payment</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Select Category</Text>
        <View style={styles.categoryGrid}>
          {categories.map((cat) => {
            const isSelected = selectedCategory.id === cat.id;
            return (
              <TouchableOpacity 
                key={cat.id} 
                style={styles.categoryItem}
                onPress={() => setSelectedCategory(cat)}
              >
                <View style={[styles.iconWrapper, { backgroundColor: cat.bg, borderWidth: isSelected ? 2 : 0, borderColor: COLORS.primary }]}>
                  <MaterialCommunityIcons name={cat.icon as any} size={24} color={cat.color} />
                </View>
                <Text style={[styles.categoryText, isSelected && { color: COLORS.primary, fontWeight: 'bold' }]}>{cat.name}</Text>
              </TouchableOpacity>
            )
          })}
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Bill Name</Text>
          <TextInput 
            style={styles.input} 
            placeholder="e.g. Sui Gas, PTCL, etc." 
            placeholderTextColor={COLORS.textSecondary}
            value={billName}
            onChangeText={setBillName}
          />

          <Text style={styles.label}>Amount (Numbers Only)</Text>
          <TextInput 
            style={styles.input} 
            placeholder="e.g. 4850" 
            placeholderTextColor={COLORS.textSecondary}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          <Text style={styles.label}>Due Date</Text>
          {/* NEW: Replaced TextInput with a Touchable button to open the calendar */}
          <TouchableOpacity style={styles.dateInput} onPress={() => setShowPicker(true)}>
            <MaterialCommunityIcons name="calendar-blank-outline" size={20} color={COLORS.textSecondary} />
            <Text style={[styles.dateText, { color: COLORS.textPrimary }]}>
              {formatDate(date)}
            </Text>
          </TouchableOpacity>

          {/* The actual native calendar popup */}
          {showPicker && (
            <View style={Platform.OS === 'ios' ? styles.iosDatePicker : {}}>
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={onChangeDate}
                minimumDate={new Date()} // Prevent picking past dates
              />
              {/* iOS needs a done button to close the inline picker */}
              {Platform.OS === 'ios' && (
                <TouchableOpacity style={styles.iosDoneButton} onPress={() => setShowPicker(false)}>
                  <Text style={styles.iosDoneText}>Done</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Bill</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.surface },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  backButton: { padding: 8, marginLeft: -8 },
  headerTitle: { ...TYPOGRAPHY.h2, fontSize: 18 },
  toggleContainer: { flexDirection: 'row', backgroundColor: COLORS.background, borderRadius: 12, padding: 4, marginBottom: 24 },
  activeToggle: { flex: 1, backgroundColor: COLORS.primary, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  activeToggleText: { ...TYPOGRAPHY.button, color: COLORS.surface, fontSize: 14 },
  inactiveToggle: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  inactiveToggleText: { ...TYPOGRAPHY.button, color: COLORS.textSecondary, fontSize: 14 },
  sectionTitle: { ...TYPOGRAPHY.h2, fontSize: 16, marginBottom: 16 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24 },
  categoryItem: { width: '22%', alignItems: 'center', marginBottom: 16 },
  iconWrapper: { width: 60, height: 60, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  categoryText: { ...TYPOGRAPHY.caption, color: COLORS.textPrimary, textAlign: 'center' },
  formContainer: { marginBottom: 30 },
  label: { ...TYPOGRAPHY.button, color: COLORS.textPrimary, marginBottom: 8, fontSize: 14 },
  input: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, ...TYPOGRAPHY.body, marginBottom: 20 },
  
  // New Styles for Date Picker
  dateInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 16 },
  dateText: { ...TYPOGRAPHY.body, marginLeft: 10 },
  iosDatePicker: { backgroundColor: COLORS.surface, borderRadius: 16, marginTop: 10, padding: 10 },
  iosDoneButton: { backgroundColor: COLORS.primary, paddingVertical: 10, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  iosDoneText: { ...TYPOGRAPHY.button, color: COLORS.surface },

  saveButton: { backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  saveButtonText: { ...TYPOGRAPHY.button, color: COLORS.surface },
});