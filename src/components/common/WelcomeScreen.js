import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../theme';

const WelcomeScreen = ({ onGetStarted, onViewServices }) => {
  const { colors, isDarkMode, toggleTheme } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.logo, { color: colors.text }]}>✂️ MyBarber</Text>
        <Text style={[styles.tagline, { color: colors.textSecondary }]}>Professional Barber Services</Text>
        <Text style={[styles.themeIndicator, { color: colors.textSecondary }]}>
          {isDarkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </Text>
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.welcomeText, { color: colors.text }]}>Welcome to MyBarber</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Choose your role to get started
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.primaryButton, { backgroundColor: colors.primary }]}
          onPress={onGetStarted}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.secondaryButton, { borderColor: colors.primary }]}
          onPress={onViewServices}
        >
          <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>View Services</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.themeButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={toggleTheme}
        >
          <Text style={[styles.themeButtonText, { color: colors.text }]}>
            {isDarkMode ? '🌙 Switch to Light' : '☀️ Switch to Dark'}
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
  themeIndicator: {
    fontSize: 14,
    marginTop: 5,
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
  buttonContainer: {
    padding: 30,
    paddingTop: 20,
  },
  primaryButton: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
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
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: '600',
  },
  themeButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
  },
  themeButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default WelcomeScreen;
