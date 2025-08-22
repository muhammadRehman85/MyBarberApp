import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

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
  onProfile
}) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>✂️ MyBarber</Text>
        <Text style={styles.tagline}>Barber Dashboard</Text>
      </View>

      <View style={styles.dashboardContent}>
        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{appointments.length}</Text>
            <Text style={styles.statLabel}>Total Appointments</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{clients.length}</Text>
            <Text style={styles.statLabel}>Total Clients</Text>
          </View>
        </View>

        {/* Quick Actions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={onSetAvailability}
          >
            <Text style={styles.actionButtonText}>📅 Set Availability</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={onManageAppointments}
          >
            <Text style={styles.actionButtonText}>📋 Manage Appointments</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={onCalendarView}
          >
            <Text style={styles.actionButtonText}>📊 Calendar View</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={onManageClients}
          >
            <Text style={styles.actionButtonText}>👥 Manage Clients</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={onViewEarnings}
          >
            <Text style={styles.actionButtonText}>💰 View Earnings</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={onManageServices}
          >
            <Text style={styles.actionButtonText}>✂️ Manage Services</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={onProfile}
          >
            <Text style={styles.actionButtonText}>👤 Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Appointments Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Appointments</Text>
          {appointments.slice(0, 3).map((appointment) => (
            <View key={appointment.id} style={styles.appointmentCard}>
              <View style={styles.appointmentHeader}>
                <Text style={styles.clientName}>{appointment.clientName}</Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: appointment.status === 'confirmed' ? '#4CAF50' : '#FF9800' }
                ]}>
                  <Text style={styles.statusText}>{appointment.status}</Text>
                </View>
              </View>
              <Text style={styles.appointmentDetails}>
                {appointment.service} • {appointment.date} • {appointment.time}
              </Text>
              <Text style={styles.appointmentPrice}>{appointment.price}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    flex: 0.48,
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
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
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
  appointmentCard: {
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
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  clientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
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
    color: '#7f8c8d',
    marginBottom: 5,
  },
  appointmentPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
});

export default BarberDashboard;
