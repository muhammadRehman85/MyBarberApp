import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { useTheme } from '../theme';

const AppointmentManagementScreen = ({ 
  appointments = [], 
  onUpdateAppointmentStatus,
  onBack 
}) => {
  const { colors } = useTheme();
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, completed, cancelled
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  const filteredAppointments = appointments.filter(appointment => {
    if (filter === 'all') return true;
    return appointment.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'completed': return '#2196F3';
      case 'cancelled': return '#F44336';
      case 'rejected': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return '✅';
      case 'pending': return '⏳';
      case 'completed': return '✅';
      case 'cancelled': return '❌';
      case 'rejected': return '❌';
      default: return '❓';
    }
  };

  const handleStatusUpdate = () => {
    if (selectedAppointment && newStatus) {
      onUpdateAppointmentStatus(selectedAppointment.id, newStatus);
      setShowStatusModal(false);
      setNewStatus('');
      setSelectedAppointment(null);
      Alert.alert('Success', 'Appointment status updated successfully!');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString; // Assuming time is already formatted
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={[styles.backButtonText, { color: colors.primary }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Appointment Management</Text>
        <View style={styles.placeholder} />
      </View>

             {/* Filter Tabs */}
       <View style={styles.filterContainer}>
         {['all', 'pending', 'confirmed', 'completed', 'cancelled', 'rejected'].map((filterOption) => (
          <TouchableOpacity
            key={filterOption}
            style={[
              styles.filterTab,
              { 
                backgroundColor: filter === filterOption ? colors.primary : colors.surface,
                borderColor: colors.border
              }
            ]}
            onPress={() => setFilter(filterOption)}
          >
            <Text style={[
              styles.filterText,
              { color: filter === filterOption ? colors.surface : colors.text }
            ]}>
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Appointments List */}
      <ScrollView style={styles.appointmentsList}>
        {filteredAppointments.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
              No {filter === 'all' ? '' : filter} appointments found
            </Text>
            <Text style={[styles.emptyStateSubtext, { color: colors.textTertiary }]}>
              {filter === 'all' ? 'Appointments will appear here' : `No ${filter} appointments at the moment`}
            </Text>
          </View>
        ) : (
          filteredAppointments.map((appointment) => (
            <TouchableOpacity
              key={appointment.id}
              style={[styles.appointmentCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => {
                setSelectedAppointment(appointment);
                setShowDetailsModal(true);
              }}
            >
              <View style={styles.appointmentHeader}>
                <View style={styles.clientInfo}>
                  <Text style={[styles.clientName, { color: colors.text }]}>
                    {appointment.clientName}
                  </Text>
                  <Text style={[styles.clientPhone, { color: colors.textSecondary }]}>
                    {appointment.clientPhone || 'No phone'}
                  </Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(appointment.status) }
                ]}>
                  <Text style={styles.statusText}>
                    {getStatusIcon(appointment.status)} {appointment.status}
                  </Text>
                </View>
              </View>

              <View style={styles.appointmentDetails}>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Service:</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>{appointment.service}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Date:</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>
                    {formatDate(appointment.date)}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Time:</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>
                    {formatTime(appointment.time)}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Price:</Text>
                  <Text style={[styles.detailValue, { color: colors.primary, fontWeight: 'bold' }]}>
                    {appointment.price}
                  </Text>
                </View>
              </View>

              <View style={styles.appointmentActions}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: colors.primary }]}
                  onPress={() => {
                    setSelectedAppointment(appointment);
                    setShowStatusModal(true);
                  }}
                >
                  <Text style={[styles.actionButtonText, { color: colors.surface }]}>
                    Update Status
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Appointment Details Modal */}
      <Modal
        visible={showDetailsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDetailsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {selectedAppointment && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, { color: colors.text }]}>Appointment Details</Text>
                  <TouchableOpacity onPress={() => setShowDetailsModal(false)}>
                    <Text style={[styles.closeButton, { color: colors.textSecondary }]}>✕</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalBody}>
                  <View style={styles.detailSection}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Client Information</Text>
                    <View style={styles.detailItem}>
                      <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Name:</Text>
                      <Text style={[styles.detailValue, { color: colors.text }]}>
                        {selectedAppointment.clientName}
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Phone:</Text>
                      <Text style={[styles.detailValue, { color: colors.text }]}>
                        {selectedAppointment.clientPhone || 'Not provided'}
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Email:</Text>
                      <Text style={[styles.detailValue, { color: colors.text }]}>
                        {selectedAppointment.clientEmail || 'Not provided'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Appointment Details</Text>
                    <View style={styles.detailItem}>
                      <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Service:</Text>
                      <Text style={[styles.detailValue, { color: colors.text }]}>
                        {selectedAppointment.service}
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Date:</Text>
                      <Text style={[styles.detailValue, { color: colors.text }]}>
                        {formatDate(selectedAppointment.date)}
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Time:</Text>
                      <Text style={[styles.detailValue, { color: colors.text }]}>
                        {formatTime(selectedAppointment.time)}
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Price:</Text>
                      <Text style={[styles.detailValue, { color: colors.primary, fontWeight: 'bold' }]}>
                        {selectedAppointment.price}
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Status:</Text>
                      <View style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(selectedAppointment.status) }
                      ]}>
                        <Text style={styles.statusText}>
                          {getStatusIcon(selectedAppointment.status)} {selectedAppointment.status}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {selectedAppointment.notes && (
                    <View style={styles.detailSection}>
                      <Text style={[styles.sectionTitle, { color: colors.text }]}>Notes</Text>
                      <Text style={[styles.notesText, { color: colors.textSecondary }]}>
                        {selectedAppointment.notes}
                      </Text>
                    </View>
                  )}
                </ScrollView>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: colors.primary }]}
                    onPress={() => {
                      setShowDetailsModal(false);
                      setShowStatusModal(true);
                    }}
                  >
                    <Text style={[styles.modalButtonText, { color: colors.surface }]}>
                      Update Status
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    onPress={() => setShowDetailsModal(false)}
                  >
                    <Text style={[styles.modalButtonText, { color: colors.text }]}>
                      Close
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Status Update Modal */}
      <Modal
        visible={showStatusModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowStatusModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Update Status</Text>
              <TouchableOpacity onPress={() => setShowStatusModal(false)}>
                <Text style={[styles.closeButton, { color: colors.textSecondary }]}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                Select new status for this appointment:
              </Text>
              
                             {['pending', 'confirmed', 'completed', 'cancelled', 'rejected'].map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.statusOption,
                    { 
                      backgroundColor: newStatus === status ? colors.primary : colors.background,
                      borderColor: colors.border
                    }
                  ]}
                  onPress={() => setNewStatus(status)}
                >
                  <Text style={[
                    styles.statusOptionText,
                    { color: newStatus === status ? colors.surface : colors.text }
                  ]}>
                    {getStatusIcon(status)} {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={handleStatusUpdate}
                disabled={!newStatus}
              >
                <Text style={[styles.modalButtonText, { color: colors.surface }]}>
                  Update Status
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => setShowStatusModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 50,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 10,
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  appointmentsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  appointmentCard: {
    marginBottom: 15,
    borderRadius: 12,
    borderWidth: 1,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  clientPhone: {
    fontSize: 14,
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
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
  },
  appointmentActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    padding: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: 50,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalBody: {
    padding: 20,
  },
  detailSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  notesText: {
    fontSize: 14,
    lineHeight: 20,
  },
  modalSubtitle: {
    fontSize: 16,
    marginBottom: 15,
  },
  statusOption: {
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
  },
  statusOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AppointmentManagementScreen;
