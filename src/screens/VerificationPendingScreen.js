import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useTheme } from '../theme';

const VerificationPendingScreen = ({ onBack, onLogout, currentUser }) => {
  const { colors } = useTheme();

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'Please email us at support@mybarber.com with your business details for faster verification.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK' }
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={onBack}
        >
          <Text style={[styles.backButtonText, { color: colors.primary }]}>← Back</Text>
        </TouchableOpacity>
        
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>⏳</Text>
        </View>
        
        <Text style={[styles.title, { color: colors.text }]}>Verification Pending</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Your barber account is under review
        </Text>
      </View>

      <View style={styles.content}>
        <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>What happens next?</Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            Our team will review your application and verify your business details. This usually takes 1-3 business days.
          </Text>
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>What we verify:</Text>
          <View style={styles.verificationList}>
            <Text style={[styles.verificationItem, { color: colors.textSecondary }]}>• Business license and permits</Text>
            <Text style={[styles.verificationItem, { color: colors.textSecondary }]}>• Professional experience</Text>
            <Text style={[styles.verificationItem, { color: colors.textSecondary }]}>• Business location</Text>
            <Text style={[styles.verificationItem, { color: colors.textSecondary }]}>• Contact information</Text>
          </View>
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>Account Details:</Text>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Name:</Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>{currentUser?.name || 'N/A'}</Text>
          
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Business:</Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>{currentUser?.businessName || 'N/A'}</Text>
          
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Location:</Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>{currentUser?.location?.city || 'N/A'}</Text>
        </View>

        <TouchableOpacity
          style={[styles.contactButton, { backgroundColor: colors.primary }]}
          onPress={handleContactSupport}
        >
          <Text style={[styles.contactButtonText, { color: colors.white }]}>Contact Support</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={onLogout}
        >
          <Text style={[styles.logoutButtonText, { color: colors.primary }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  iconContainer: {
    marginBottom: 20,
  },
  icon: {
    fontSize: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  content: {
    padding: 20,
  },
  infoCard: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    lineHeight: 24,
  },
  verificationList: {
    marginTop: 10,
  },
  verificationItem: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 15,
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  contactButton: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  contactButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  logoutButton: {
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 10,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default VerificationPendingScreen;
