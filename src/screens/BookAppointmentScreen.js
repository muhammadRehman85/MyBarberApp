import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../theme';
import appointmentService from '../services/appointmentService';
import availabilityService from '../services/availabilityService';

const BookAppointmentScreen = ({ 
  barber, 
  currentUser, 
  onBack, 
  onBookingSuccess 
}) => {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);

  // Add null check for barber prop
  if (!barber) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>No barber selected</Text>
        <TouchableOpacity 
          style={[styles.backButton, { marginTop: 20 }]} 
          onPress={onBack}
        >
          <Text style={[styles.backButtonText, { color: colors.primary }]}>← Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Available services (this could come from barber's profile)
  const availableServices = [
    { id: 'haircut', name: 'Haircut', price: '$25', duration: 30 },
    { id: 'beard-trim', name: 'Beard Trim', price: '$15', duration: 20 },
    { id: 'haircut-beard', name: 'Haircut & Beard Trim', price: '$35', duration: 45 },
    { id: 'kids-haircut', name: 'Kids Haircut', price: '$20', duration: 25 },
    { id: 'hair-wash', name: 'Hair Wash & Style', price: '$30', duration: 35 },
  ];

  // Load available time slots when date is selected
  useEffect(() => {
    if (selectedDate && barber?.uid) {
      loadAvailableTimeSlots();
    }
  }, [selectedDate, barber?.uid]);

  const loadAvailableTimeSlots = async () => {
    if (!selectedDate || !barber?.uid) return;
    
    setLoadingTimeSlots(true);
    setSelectedTime(''); // Reset selected time when date changes
    
    try {
      const result = await availabilityService.getAvailableTimeSlots(barber.uid, selectedDate);
      
      if (result.success) {
        setAvailableTimeSlots(result.timeSlots);
      } else {
        console.error('Error loading time slots:', result.error);
        setAvailableTimeSlots([]);
      }
    } catch (error) {
      console.error('Error loading time slots:', error);
      setAvailableTimeSlots([]);
    } finally {
      setLoadingTimeSlots(false);
    }
  };

  // Generate next 14 days
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) { // Start from tomorrow, show next 14 days
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        date: date.toISOString().split('T')[0],
        display: date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        })
      });
    }
    return dates;
  };

  const availableDates = generateAvailableDates();

    const handleBookAppointment = async () => {
    if (!selectedService || !selectedDate || !selectedTime) {
      Alert.alert('Error', 'Please select a service, date, and time');
      return;
    }

    if (!barber?.uid || !currentUser?.uid) {
      Alert.alert('Error', 'Missing user information');
      return;
    }

    setLoading(true);

    try {
      const service = availableServices.find(s => s.id === selectedService);
      
      const appointmentData = {
        barberId: barber.uid,
        clientId: currentUser.uid,
        clientName: currentUser.name || 'Unknown',
        clientPhone: currentUser.phone || '',
        clientEmail: currentUser.email || '',
        service: service.name,
        date: selectedDate,
        time: selectedTime,
        price: service.price,
        duration: service.duration,
        status: 'pending', // Barber needs to approve
        notes: notes.trim() || '',
        barberName: barber.businessName || barber.name || 'Barber'
      };

      const result = await appointmentService.createAppointment(appointmentData);
      
      if (result.success) {
        Alert.alert(
          'Booking Request Sent!', 
          `Your appointment request has been sent to ${barber.businessName || barber.name}. They will review and confirm your booking.`,
          [
            {
              text: 'OK',
              onPress: () => {
                onBookingSuccess && onBookingSuccess();
                onBack();
              }
            }
          ]
        );
      } else {
        Alert.alert('Error', result.error || 'Failed to book appointment');
      }
    } catch (error) {
      console.error('Booking error:', error);
      Alert.alert('Error', 'Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={[styles.backButtonText, { color: colors.primary }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Book Appointment</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Barber Info */}
      <View style={[styles.barberCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.barberName, { color: colors.text }]}>
          {barber.businessName || barber.name}
        </Text>
        <Text style={[styles.barberLocation, { color: colors.textSecondary }]}>
          {barber.location?.city}
        </Text>
        {barber.experience && (
          <Text style={[styles.barberExperience, { color: colors.textSecondary }]}>
            Experience: {barber.experience}
          </Text>
        )}
      </View>

      {/* Service Selection */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Service</Text>
        {availableServices.map((service) => (
          <TouchableOpacity
            key={service.id}
            style={[
              styles.serviceCard,
              { 
                backgroundColor: selectedService === service.id ? colors.primary : colors.surface,
                borderColor: colors.border
              }
            ]}
            onPress={() => setSelectedService(service.id)}
          >
            <View style={styles.serviceInfo}>
              <Text style={[
                styles.serviceName,
                { color: selectedService === service.id ? colors.surface : colors.text }
              ]}>
                {service.name}
              </Text>
              <Text style={[
                styles.serviceDuration,
                { color: selectedService === service.id ? colors.surface : colors.textSecondary }
              ]}>
                {service.duration} minutes
              </Text>
            </View>
            <Text style={[
              styles.servicePrice,
              { color: selectedService === service.id ? colors.surface : colors.primary }
            ]}>
              {service.price}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Date Selection */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateContainer}>
          {availableDates.map((date) => (
            <TouchableOpacity
              key={date.date}
              style={[
                styles.dateCard,
                { 
                  backgroundColor: selectedDate === date.date ? colors.primary : colors.surface,
                  borderColor: colors.border
                }
              ]}
              onPress={() => setSelectedDate(date.date)}
            >
              <Text style={[
                styles.dateText,
                { color: selectedDate === date.date ? colors.surface : colors.text }
              ]}>
                {date.display}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Time Selection */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Time</Text>
        {loadingTimeSlots ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              Loading available times...
            </Text>
          </View>
        ) : availableTimeSlots.length > 0 ? (
          <View style={styles.timeGrid}>
            {availableTimeSlots.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeCard,
                  { 
                    backgroundColor: selectedTime === time ? colors.primary : colors.surface,
                    borderColor: colors.border
                  }
                ]}
                onPress={() => setSelectedTime(time)}
              >
                <Text style={[
                  styles.timeText,
                  { color: selectedTime === time ? colors.surface : colors.text }
                ]}>
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : selectedDate ? (
          <View style={styles.noSlotsContainer}>
            <Text style={[styles.noSlotsText, { color: colors.textSecondary }]}>
              No available time slots for this date
            </Text>
            <Text style={[styles.noSlotsSubtext, { color: colors.textSecondary }]}>
              Please select a different date
            </Text>
          </View>
        ) : (
          <Text style={[styles.selectDateText, { color: colors.textSecondary }]}>
            Please select a date first
          </Text>
        )}
      </View>

      {/* Notes */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Additional Notes (Optional)</Text>
        <TextInput
          style={[styles.notesInput, { 
            backgroundColor: colors.surface, 
            borderColor: colors.border,
            color: colors.text 
          }]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Any special requests or notes..."
          placeholderTextColor={colors.textSecondary}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>

      {/* Booking Summary */}
      {selectedService && selectedDate && selectedTime && (
        <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.summaryTitle, { color: colors.text }]}>Booking Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Service:</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {availableServices.find(s => s.id === selectedService)?.name}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Date:</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {availableDates.find(d => d.date === selectedDate)?.display}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Time:</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>{selectedTime}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Price:</Text>
            <Text style={[styles.summaryValue, { color: colors.primary, fontWeight: 'bold' }]}>
              {availableServices.find(s => s.id === selectedService)?.price}
            </Text>
          </View>
        </View>
      )}

      {/* Book Button */}
      <TouchableOpacity
        style={[
          styles.bookButton,
          { 
            backgroundColor: (selectedService && selectedDate && selectedTime) ? colors.primary : colors.textTertiary,
            opacity: (selectedService && selectedDate && selectedTime) ? 1 : 0.5
          }
        ]}
        onPress={handleBookAppointment}
        disabled={!selectedService || !selectedDate || !selectedTime || loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.surface} />
        ) : (
          <Text style={[styles.bookButtonText, { color: colors.surface }]}>
            Send Booking Request
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
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
  barberCard: {
    margin: 20,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
  },
  barberName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  barberLocation: {
    fontSize: 14,
    marginBottom: 5,
  },
  barberExperience: {
    fontSize: 14,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  serviceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  serviceDuration: {
    fontSize: 14,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateContainer: {
    marginBottom: 10,
  },
  dateCard: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 10,
    minWidth: 80,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeCard: {
    width: '30%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  notesInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
  },
  summaryCard: {
    margin: 20,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  bookButton: {
    margin: 20,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
  },
  noSlotsContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noSlotsText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  noSlotsSubtext: {
    fontSize: 14,
  },
  selectDateText: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 20,
  },
});

export default BookAppointmentScreen;
