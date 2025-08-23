// Simple notification service for testing
// This service uses React Native's built-in Alert instead of push notifications
// It's a fallback when the full notification system is not available

import { Alert } from 'react-native';

class SimpleNotificationService {
  constructor() {
    console.log('Simple notification service initialized');
  }

  // Send appointment request notification
  sendAppointmentRequestNotification = (appointmentData) => {
    const { clientName, service, date, time } = appointmentData;
    
    Alert.alert(
      'New Appointment Request! 🎉',
      `${clientName} wants to book ${service} on ${date} at ${time}`,
      [
        { text: 'View Details', onPress: () => console.log('View appointment details') },
        { text: 'OK', style: 'default' }
      ]
    );
  };

  // Send appointment update notification
  sendAppointmentUpdateNotification = (appointmentData, status) => {
    const { clientName, service, date, time } = appointmentData;
    const statusText = status === 'confirmed' ? 'confirmed' : 
                      status === 'rejected' ? 'declined' : 
                      status === 'completed' ? 'completed' : status;
    
    Alert.alert(
      `Appointment ${statusText.charAt(0).toUpperCase() + statusText.slice(1)}`,
      `${clientName}'s ${service} appointment has been ${statusText}`,
      [
        { text: 'OK', style: 'default' }
      ]
    );
  };

  // Play notification sound (placeholder)
  playNotificationSound = () => {
    console.log('Notification sound would play here');
  };

  // Cancel all notifications (placeholder)
  cancelAllNotifications = () => {
    console.log('All notifications would be cancelled here');
  };

  // Request permissions (placeholder)
  requestPermissions = () => {
    return Promise.resolve({ alert: true, badge: true, sound: true });
  };

  // Check permissions (placeholder)
  checkPermissions = () => {
    return Promise.resolve({ alert: true, badge: true, sound: true });
  };
}

export default new SimpleNotificationService();
