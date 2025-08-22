import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../theme';

const ServicesScreen = ({ onBack }) => {
  const { colors } = useTheme();
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={onBack}
      >
        <Text style={[styles.backButtonText, { color: colors.primary }]}>← Back</Text>
      </TouchableOpacity>
      
      <View style={styles.header}>
        <Text style={[styles.logo, { color: colors.text }]}>✂️ MyBarber</Text>
        <Text style={[styles.tagline, { color: colors.textSecondary }]}>Our Services</Text>
      </View>

      <View style={styles.servicesContainer}>
        <View style={[styles.serviceCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={styles.serviceIcon}>💇‍♂️</Text>
          <Text style={[styles.serviceTitle, { color: colors.text }]}>Haircut</Text>
          <Text style={[styles.servicePrice, { color: colors.primary }]}>$25</Text>
          <Text style={[styles.serviceDescription, { color: colors.textSecondary }]}>Professional haircut and styling</Text>
        </View>

        <View style={[styles.serviceCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={styles.serviceIcon}>🧔</Text>
          <Text style={[styles.serviceTitle, { color: colors.text }]}>Beard Trim</Text>
          <Text style={[styles.servicePrice, { color: colors.primary }]}>$15</Text>
          <Text style={[styles.serviceDescription, { color: colors.textSecondary }]}>Beard trimming and shaping</Text>
        </View>

        <View style={[styles.serviceCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={styles.serviceIcon}>💈</Text>
          <Text style={[styles.serviceTitle, { color: colors.text }]}>Hair & Beard</Text>
          <Text style={[styles.servicePrice, { color: colors.primary }]}>$35</Text>
          <Text style={[styles.serviceDescription, { color: colors.textSecondary }]}>Complete hair and beard service</Text>
        </View>

        <View style={[styles.serviceCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={styles.serviceIcon}>🧴</Text>
          <Text style={[styles.serviceTitle, { color: colors.text }]}>Hair Treatment</Text>
          <Text style={[styles.servicePrice, { color: colors.primary }]}>$20</Text>
          <Text style={[styles.serviceDescription, { color: colors.textSecondary }]}>Hair treatment and conditioning</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    padding: 20,
    paddingBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 30,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  tagline: {
    fontSize: 16,
    fontWeight: '500',
  },
  servicesContainer: {
    padding: 20,
  },
  serviceCard: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  serviceIcon: {
    fontSize: 40,
    textAlign: 'center',
    marginBottom: 10,
  },
  serviceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  servicePrice: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  serviceDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default ServicesScreen;
