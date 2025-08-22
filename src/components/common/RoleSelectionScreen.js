import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../theme';

const RoleSelectionScreen = ({ onSelectRole, onBack }) => {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={onBack}
      >
        <Text style={[styles.backButtonText, { color: colors.primary }]}>← Back</Text>
      </TouchableOpacity>
      
      <View style={styles.header}>
        <Text style={[styles.logo, { color: colors.text }]}>✂️ MyBarber</Text>
        <Text style={[styles.tagline, { color: colors.textSecondary }]}>Choose Your Role</Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.welcomeText, { color: colors.text }]}>I am a...</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Select your role to access the right features
        </Text>
      </View>

      <View style={styles.roleContainer}>
        <TouchableOpacity 
          style={[styles.roleCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={() => onSelectRole('barber')}
        >
          <Text style={styles.roleIcon}>💇‍♂️</Text>
          <Text style={[styles.roleTitle, { color: colors.text }]}>Barber</Text>
          <Text style={[styles.roleDescription, { color: colors.textSecondary }]}>
            Manage appointments, clients, and your business
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.roleCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={() => onSelectRole('client')}
        >
          <Text style={styles.roleIcon}>👤</Text>
          <Text style={[styles.roleTitle, { color: colors.text }]}>Client</Text>
          <Text style={[styles.roleDescription, { color: colors.textSecondary }]}>
            Book appointments and find barbers
          </Text>
        </TouchableOpacity>
      </View>
    </View>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  roleContainer: {
    padding: 30,
    paddingTop: 20,
  },
  roleCard: {
    padding: 25,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  roleIcon: {
    fontSize: 50,
    marginBottom: 15,
  },
  roleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  roleDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default RoleSelectionScreen;
