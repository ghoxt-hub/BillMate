import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { TYPOGRAPHY } from '../theme/typography';

const { width } = Dimensions.get('window');

// Data for our 3 onboarding slides
const slides = [
  {
    id: '1',
    title: 'Keep Your Bills on Track',
    subtitle: 'Store your bills, set reminders, and never miss a payment again.',
    icon: 'calendar-check',
    color: COLORS.primary,
  },
  {
    id: '2',
    title: 'All Your Bills in One Place',
    subtitle: 'From electricity to rent, keep everything organized and easy to manage.',
    icon: 'home-lightning-bolt', // We'll use a combination of icons below
    color: '#3B82F6',
  },
  {
    id: '3',
    title: 'Smart Reminders for On-Time Payments',
    subtitle: 'Get notified before your due date and avoid late fees.',
    icon: 'bell-ring',
    color: '#8B5CF6',
  },
];

export default function OnboardingScreen({ navigation }: any) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  // Update the active dot when the user swipes
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    setCurrentIndex(roundIndex);
  };

  // Navigate to the main app
  const handleGetStarted = () => {
    navigation.replace('MainApp');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.scrollView}
      >
        {slides.map((slide, index) => (
          <View key={slide.id} style={styles.slide}>
            {/* Top Illustration Area */}
            <View style={styles.illustrationContainer}>
              <View style={[styles.iconWrapper, { backgroundColor: `${slide.color}15` }]}>
                
                {/* Custom logic for Slide 2 to show multiple icons like your design */}
                {index === 1 ? (
                  <View style={styles.multiIconGrid}>
                    <MaterialCommunityIcons name="lightning-bolt" size={40} color="#F59E0B" />
                    <MaterialCommunityIcons name="fire" size={40} color="#EF4444" />
                    <MaterialCommunityIcons name="water" size={40} color="#3B82F6" />
                    <MaterialCommunityIcons name="wifi" size={40} color="#8B5CF6" />
                  </View>
                ) : (
                  <MaterialCommunityIcons name={slide.icon as any} size={100} color={slide.color} />
                )}

              </View>
            </View>

            {/* Text Area */}
            <View style={styles.textContainer}>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.subtitle}>{slide.subtitle}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Fixed Bottom Area (Dots + Buttons) */}
      <View style={styles.bottomContainer}>
        
        {/* Dots Indicator */}
        <View style={styles.dotsContainer}>
          {slides.map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.dot, 
                currentIndex === index && styles.activeDot
              ]} 
            />
          ))}
        </View>

        {/* Buttons */}
        <TouchableOpacity style={styles.primaryButton} onPress={handleGetStarted}>
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={handleGetStarted}>
          <Text style={styles.secondaryButtonText}>I already have an account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  scrollView: { flex: 1 },
  slide: { width: width, paddingHorizontal: 24, paddingTop: 60 },
  
  illustrationContainer: { alignItems: 'center', marginTop: 20, marginBottom: 40 },
  iconWrapper: { width: 220, height: 220, borderRadius: 110, justifyContent: 'center', alignItems: 'center' },
  multiIconGrid: { flexDirection: 'row', flexWrap: 'wrap', width: 120, justifyContent: 'space-between', gap: 20 }, // For slide 2

  textContainer: { alignItems: 'center' },
  title: { ...TYPOGRAPHY.h1, textAlign: 'center', marginBottom: 16 },
  subtitle: { ...TYPOGRAPHY.body, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 24, paddingHorizontal: 10 },

  bottomContainer: { paddingHorizontal: 24, paddingBottom: 40 },
  dotsContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.border, marginHorizontal: 4 },
  activeDot: { width: 24, backgroundColor: COLORS.primary },

  primaryButton: { backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 16 },
  primaryButtonText: { ...TYPOGRAPHY.button, color: COLORS.surface },
  secondaryButton: { paddingVertical: 12, alignItems: 'center' },
  secondaryButtonText: { ...TYPOGRAPHY.button, color: COLORS.textSecondary, fontSize: 14 },
});