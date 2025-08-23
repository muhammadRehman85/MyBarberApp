import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../theme';

const ClientDashboard = ({ 
  onSearchBarbers, 
  onProfile,
  onViewServices,
  onViewBookings,
  appointments = []
}) => {
  const { colors } = useTheme();

  // Calculate booking statistics
  const totalBookings = appointments.length;
  const pendingBookings = appointments.filter(apt => apt.status === 'pending').length;
  const confirmedBookings = appointments.filter(apt => apt.status === 'confirmed').length;
  const completedBookings = appointments.filter(apt => apt.status === 'completed').length;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.logo, { color: colors.text }]}>✂️ MyBarber</Text>
        <Text style={[styles.tagline, { color: colors.textSecondary }]}>Client Dashboard</Text>
      </View>

      <View style={styles.dashboardContent}>
        {/* Booking Statistics */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>My Bookings</Text>
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>{totalBookings}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Bookings</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>{pendingBookings}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Pending</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>{confirmedBookings}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Confirmed</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>{completedBookings}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Completed</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>What would you like to do?</Text>
          
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={onSearchBarbers}
          >
            <Text style={[styles.actionButtonText, { color: colors.text }]}>🔍 Search for Barbers</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={onViewBookings}
          >
            <Text style={[styles.actionButtonText, { color: colors.text }]}>📋 My Bookings</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={onViewServices}
          >
            <Text style={[styles.actionButtonText, { color: colors.text }]}>✂️ View Services</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={onProfile}
          >
            <Text style={[styles.actionButtonText, { color: colors.text }]}>👤 My Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Bookings Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Bookings</Text>
          {appointments.slice(0, 3).map((appointment) => (
            <View key={appointment.id} style={[styles.bookingCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.bookingHeader}>
                <Text style={[styles.barberName, { color: colors.text }]}>{appointment.barberName || 'Barber'}</Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: appointment.status === 'confirmed' ? '#4CAF50' : 
                    appointment.status === 'pending' ? '#FF9800' : 
                    appointment.status === 'completed' ? '#2196F3' : '#F44336' }
                ]}>
                  <Text style={styles.statusText}>{appointment.status}</Text>
                </View>
              </View>
              <Text style={[styles.bookingDetails, { color: colors.textSecondary }]}>
                {appointment.service} • {appointment.date} • {appointment.time}
              </Text>
              <Text style={[styles.bookingPrice, { color: colors.primary }]}>{appointment.price}</Text>
            </View>
          ))}
          {appointments.length === 0 && (
            <View style={[styles.emptyState, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>No bookings yet</Text>
              <Text style={[styles.emptyStateSubtext, { color: colors.textTertiary }]}>Your bookings will appear here</Text>
            </View>
          )}
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Features</Text>
          
          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>🔍</Text>
            <Text style={styles.featureTitle}>Find Barbers</Text>
            <Text style={styles.featureDescription}>
              Search for barbers by location or name
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>📅</Text>
            <Text style={styles.featureTitle}>Book Appointments</Text>
            <Text style={styles.featureDescription}>
              Schedule appointments with your preferred barber
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>⭐</Text>
            <Text style={styles.featureTitle}>Read Reviews</Text>
            <Text style={styles.featureDescription}>
              See ratings and reviews from other clients
            </Text>
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
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 30,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  tagline: {
    fontSize: 16,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  dashboardContent: {
    flex: 1,
    padding: 20,
  },
  welcomeSection: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 15,
    marginBottom: 30,
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
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 24,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  actionButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  featureCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
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
  featureIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    padding: 15,
    borderRadius: 10,
    flex: 0.48,
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  bookingCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  barberName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  bookingDetails: {
    fontSize: 14,
    marginBottom: 5,
  },
  bookingPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyState: {
    padding: 30,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ClientDashboard;
