import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../theme';

const BarberDashboard = ({ 
  appointments, 
  clients, 
  onNavigate, 
  onSetAvailability, 
  onManageAppointments,
  onCalendarView,
  onManageClients,
  onViewEarnings,
  onManageServices,
  onNotificationSettings,
  onProfile,
  onAddSampleAppointments
}) => {
  const { colors } = useTheme();

  // Calculate dashboard statistics
  const totalAppointments = appointments.length;
  const totalClients = clients.length;
  const todayAppointments = appointments.filter(apt => apt.date === new Date().toISOString().split('T')[0]).length;
  const confirmedAppointments = appointments.filter(apt => apt.status === 'confirmed').length;
  const pendingAppointments = appointments.filter(apt => apt.status === 'pending').length;
  
  // Calculate total earnings
  const totalEarnings = appointments
    .filter(apt => apt.status === 'confirmed')
    .reduce((sum, apt) => sum + parseFloat(apt.price.replace('$', '')), 0);
  
  const todayEarnings = appointments
    .filter(apt => apt.date === new Date().toISOString().split('T')[0] && apt.status === 'confirmed')
    .reduce((sum, apt) => sum + parseFloat(apt.price.replace('$', '')), 0);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.logo, { color: colors.text }]}>✂️ MyBarber</Text>
        <Text style={[styles.tagline, { color: colors.textSecondary }]}>Barber Dashboard</Text>
      </View>

      <View style={styles.dashboardContent}>
        {/* Stats Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Today's Overview</Text>
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>{todayAppointments}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Today's Appointments</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>${todayEarnings}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Today's Earnings</Text>
            </View>
          </View>
        </View>

        {/* Overall Stats Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Overall Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>{totalAppointments}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Appointments</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>{totalClients}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Clients</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>{confirmedAppointments}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Confirmed</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>{pendingAppointments}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Pending</Text>
            </View>
          </View>
        </View>

        {/* Earnings Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Earnings Overview</Text>
          <View style={[styles.earningsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.earningsRow}>
              <Text style={[styles.earningsLabel, { color: colors.textSecondary }]}>Total Earnings:</Text>
              <Text style={[styles.earningsAmount, { color: colors.text }]}>${totalEarnings}</Text>
            </View>
            <View style={styles.earningsRow}>
              <Text style={[styles.earningsLabel, { color: colors.textSecondary }]}>Today's Earnings:</Text>
              <Text style={[styles.earningsAmount, { color: colors.text }]}>${todayEarnings}</Text>
            </View>
            <View style={styles.earningsRow}>
              <Text style={[styles.earningsLabel, { color: colors.textSecondary }]}>Average per Appointment:</Text>
              <Text style={[styles.earningsAmount, { color: colors.text }]}>
                ${confirmedAppointments > 0 ? (totalEarnings / confirmedAppointments).toFixed(2) : '0.00'}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
          
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={onSetAvailability}
          >
            <Text style={[styles.actionButtonText, { color: colors.text }]}>📅 Set Availability</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={onManageAppointments}
          >
            <Text style={[styles.actionButtonText, { color: colors.text }]}>📋 Manage Appointments</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={onCalendarView}
          >
            <Text style={[styles.actionButtonText, { color: colors.text }]}>📊 Calendar View</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={onManageClients}
          >
            <Text style={[styles.actionButtonText, { color: colors.text }]}>👥 Manage Clients</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={onViewEarnings}
          >
            <Text style={[styles.actionButtonText, { color: colors.text }]}>💰 View Earnings</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={onManageServices}
          >
            <Text style={[styles.actionButtonText, { color: colors.text }]}>✂️ Manage Services</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={onNotificationSettings}
          >
            <Text style={[styles.actionButtonText, { color: colors.text }]}>🔔 Notification Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={onProfile}
          >
            <Text style={[styles.actionButtonText, { color: colors.text }]}>👤 Profile</Text>
          </TouchableOpacity>

          {onAddSampleAppointments && (
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: colors.primary, borderColor: colors.primary }]}
              onPress={onAddSampleAppointments}
            >
              <Text style={[styles.actionButtonText, { color: colors.surface }]}>➕ Add Sample Appointments</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Recent Appointments Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Appointments</Text>
          {appointments.slice(0, 3).map((appointment) => (
            <View key={appointment.id} style={[styles.appointmentCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.appointmentHeader}>
                <Text style={[styles.clientName, { color: colors.text }]}>{appointment.clientName}</Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: appointment.status === 'confirmed' ? '#4CAF50' : '#FF9800' }
                ]}>
                  <Text style={styles.statusText}>{appointment.status}</Text>
                </View>
              </View>
              <Text style={[styles.appointmentDetails, { color: colors.textSecondary }]}>
                {appointment.service} • {appointment.date} • {appointment.time}
              </Text>
              <Text style={[styles.appointmentPrice, { color: colors.primary }]}>{appointment.price}</Text>
            </View>
          ))}
          {appointments.length === 0 && (
            <View style={[styles.emptyState, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>No appointments yet</Text>
              <Text style={[styles.emptyStateSubtext, { color: colors.textTertiary }]}>Your appointments will appear here</Text>
            </View>
          )}
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
    marginBottom: 5,
  },
  tagline: {
    fontSize: 16,
    fontWeight: '500',
  },
  dashboardContent: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    padding: 20,
    borderRadius: 15,
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    textAlign: 'center',
  },
  earningsCard: {
    padding: 20,
    borderRadius: 15,
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
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  earningsLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  earningsAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionButton: {
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
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  appointmentCard: {
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
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  clientName: {
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
  appointmentDetails: {
    fontSize: 14,
    marginBottom: 5,
  },
  appointmentPrice: {
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

export default BarberDashboard;
