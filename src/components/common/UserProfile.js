import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../theme';

const UserProfile = ({ 
  currentUser, 
  userRole, 
  onBack, 
  onLogout 
}) => {
  const { colors } = useTheme();
  
  if (!currentUser) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={onBack}
      >
        <Text style={[styles.backButtonText, { color: colors.primary }]}>← Back</Text>
      </TouchableOpacity>
      
      <View style={styles.header}>
        <Text style={[styles.logo, { color: colors.text }]}>👤 Profile</Text>
        <Text style={[styles.tagline, { color: colors.textSecondary }]}>User Information</Text>
      </View>

      <View style={styles.profileContainer}>
        <View style={[styles.profileCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.profileHeader}>
            <Text style={[styles.profileName, { color: colors.text }]}>{currentUser.name || currentUser.email}</Text>
            <View style={[styles.roleBadge, { backgroundColor: colors.primary }]}>
              <Text style={[styles.roleBadgeText, { color: colors.white }]}>{userRole === 'barber' ? 'Barber' : 'Client'}</Text>
            </View>
          </View>

          <View style={styles.profileDetails}>
            <View style={styles.profileRow}>
              <Text style={[styles.profileLabel, { color: colors.textSecondary }]}>Email:</Text>
              <Text style={[styles.profileValue, { color: colors.text }]}>{currentUser.email}</Text>
            </View>
            
            {currentUser.phone && (
              <View style={styles.profileRow}>
                <Text style={[styles.profileLabel, { color: colors.textSecondary }]}>Phone:</Text>
                <Text style={[styles.profileValue, { color: colors.text }]}>{currentUser.phone}</Text>
              </View>
            )}
            
            {currentUser.city && (
              <View style={styles.profileRow}>
                <Text style={[styles.profileLabel, { color: colors.textSecondary }]}>City:</Text>
                <Text style={[styles.profileValue, { color: colors.text }]}>{currentUser.city}</Text>
              </View>
            )}
            
            {userRole === 'barber' && currentUser.businessName && (
              <View style={styles.profileRow}>
                <Text style={[styles.profileLabel, { color: colors.textSecondary }]}>Business:</Text>
                <Text style={[styles.profileValue, { color: colors.text }]}>{currentUser.businessName}</Text>
              </View>
            )}
            
            {userRole === 'barber' && currentUser.experience && (
              <View style={styles.profileRow}>
                <Text style={[styles.profileLabel, { color: colors.textSecondary }]}>Experience:</Text>
                <Text style={[styles.profileValue, { color: colors.text }]}>{currentUser.experience} years</Text>
              </View>
            )}
          </View>

          <View style={styles.profileActions}>
            <TouchableOpacity 
              style={[styles.logoutButton, { backgroundColor: colors.error }]}
              onPress={onLogout}
            >
              <Text style={[styles.logoutButtonText, { color: colors.white }]}>Logout</Text>
            </TouchableOpacity>
          </View>
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
  profileContainer: {
    padding: 20,
  },
  profileCard: {
    padding: 25,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  profileDetails: {
    marginBottom: 25,
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  profileLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  profileValue: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  profileActions: {
    marginTop: 10,
  },
  logoutButton: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export default UserProfile;
