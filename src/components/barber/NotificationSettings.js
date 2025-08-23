import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useTheme } from '../../theme';

// Import notification service with error handling
let notificationService;
try {
  // Try the safe service first (guaranteed to work)
  notificationService = require('../../services/safeNotificationService').default;
  console.log('Using safe notification service');
} catch (error) {
  console.log('Safe notification service not available:', error);
  try {
    // Fallback to full service
    notificationService = require('../../services/notificationService').default;
    console.log('Using full notification service');
  } catch (fullError) {
    console.log('Full notification service not available:', fullError);
    try {
      // Final fallback to simple service
      notificationService = require('../../services/simpleNotificationService').default;
      console.log('Using simple notification service');
    } catch (simpleError) {
      console.log('All notification services failed:', simpleError);
      notificationService = null;
    }
  }
}

const NotificationSettings = ({ onBack }) => {
  const { colors } = useTheme();
  const [settings, setSettings] = useState({
    appointmentRequests: true,
    appointmentUpdates: true,
    appointmentReminders: true,
    soundEnabled: true,
    vibrationEnabled: true,
    pushNotifications: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNotificationSettings();
  }, []);

  const loadNotificationSettings = async () => {
    if (!notificationService) {
      console.log('Notification service not available for loading settings');
      return;
    }

    try {
      const permissions = await notificationService.checkPermissions();
      setSettings(prev => ({
        ...prev,
        pushNotifications: permissions.alert || false,
      }));
    } catch (error) {
      console.log('Error loading notification settings:', error);
    }
  };

  const handleToggleSetting = async (key) => {
    if (key === 'pushNotifications') {
      await requestNotificationPermissions();
      return;
    }

    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));

    // Save settings to AsyncStorage or local storage
    saveNotificationSettings();
  };

  const requestNotificationPermissions = async () => {
    if (!notificationService) {
      Alert.alert('Error', 'Notification service is not available');
      return;
    }

    try {
      setLoading(true);
      const permissions = await notificationService.requestPermissions();
      
      setSettings(prev => ({
        ...prev,
        pushNotifications: permissions.alert || false
      }));

      if (!permissions.alert) {
        Alert.alert(
          'Permission Required',
          'Please enable notifications in your device settings to receive appointment alerts.',
          [
            { text: 'OK' },
            { text: 'Open Settings', onPress: () => {
              // You can add logic to open device settings
            }}
          ]
        );
      }
    } catch (error) {
      console.log('Error requesting permissions:', error);
      Alert.alert('Error', 'Failed to request notification permissions');
    } finally {
      setLoading(false);
    }
  };

  const saveNotificationSettings = () => {
    // Save settings to AsyncStorage or local storage
    // This is a placeholder - you can implement actual storage logic
    console.log('Saving notification settings:', settings);
  };

  const testNotification = () => {
    if (!notificationService) {
      Alert.alert('Error', 'Notification service is not available');
      return;
    }

    try {
      const testAppointment = {
        id: 'test',
        clientName: 'Test Client',
        service: 'Haircut',
        date: '2024-01-15',
        time: '10:00 AM',
      };

      notificationService.sendAppointmentRequestNotification(testAppointment);
      
      // Check which service we're using
      if (notificationService.constructor.name === 'SafeNotificationService') {
        Alert.alert('Test Notification', 'A test alert has been shown! (Using safe notification service)');
      } else if (notificationService.constructor.name === 'SimpleNotificationService') {
        Alert.alert('Test Notification', 'A test alert has been shown! (Using simple notification service)');
      } else {
        Alert.alert('Test Notification', 'A test notification has been sent!');
      }
    } catch (error) {
      console.log('Error sending test notification:', error);
      Alert.alert('Error', 'Failed to send test notification. Please check notification permissions.');
    }
  };

  const clearAllNotifications = () => {
    if (!notificationService) {
      Alert.alert('Error', 'Notification service is not available');
      return;
    }

    Alert.alert(
      'Clear Notifications',
      'Are you sure you want to clear all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => {
            try {
              notificationService.cancelAllNotifications();
              Alert.alert('Success', 'All notifications have been cleared');
            } catch (error) {
              console.log('Error clearing notifications:', error);
              Alert.alert('Error', 'Failed to clear notifications');
            }
          }
        }
      ]
    );
  };

  const renderSettingItem = (title, subtitle, key, icon = null) => (
    <View style={[styles.settingItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.settingInfo}>
        {icon && <Text style={[styles.settingIcon, { color: colors.primary }]}>{icon}</Text>}
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
        </View>
      </View>
      <Switch
        value={settings[key]}
        onValueChange={() => handleToggleSetting(key)}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor={settings[key] ? colors.surface : colors.textSecondary}
        disabled={loading && key === 'pushNotifications'}
      />
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={[styles.backButtonText, { color: colors.primary }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Notification Settings</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Notification Types */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Notification Types</Text>
        
        {renderSettingItem(
          'Appointment Requests',
          'Get notified when clients request appointments',
          'appointmentRequests',
          '🎉'
        )}
        
        {renderSettingItem(
          'Appointment Updates',
          'Get notified when appointment status changes',
          'appointmentUpdates',
          '📝'
        )}
        
        {renderSettingItem(
          'Appointment Reminders',
          'Get reminded about upcoming appointments',
          'appointmentReminders',
          '⏰'
        )}
      </View>

      {/* Notification Preferences */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Notification Preferences</Text>
        
        {renderSettingItem(
          'Push Notifications',
          'Allow notifications from this app',
          'pushNotifications',
          '📱'
        )}
        
        {renderSettingItem(
          'Sound',
          'Play sound for notifications',
          'soundEnabled',
          '🔊'
        )}
        
        {renderSettingItem(
          'Vibration',
          'Vibrate for notifications',
          'vibrationEnabled',
          '📳'
        )}
      </View>

      {/* Test & Actions */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Actions</Text>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          onPress={testNotification}
        >
          <Text style={[styles.actionButtonText, { color: colors.surface }]}>
            🧪 Test Notification
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.error }]}
          onPress={clearAllNotifications}
        >
          <Text style={[styles.actionButtonText, { color: colors.surface }]}>
            🗑️ Clear All Notifications
          </Text>
        </TouchableOpacity>
      </View>

             {/* Info */}
       <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
         <Text style={[styles.infoTitle, { color: colors.text }]}>ℹ️ About Notifications</Text>
         <Text style={[styles.infoText, { color: colors.textSecondary }]}>
           • Notifications help you stay updated with appointment requests and updates{'\n'}
           • You can customize which types of notifications you want to receive{'\n'}
           • Sound and vibration can be toggled on/off independently{'\n'}
           • Test notifications help you verify your settings are working correctly{'\n'}
           {notificationService && notificationService.constructor.name === 'SafeNotificationService' && 
             '• Currently using safe notification service (alerts only)'}
           {notificationService && notificationService.constructor.name === 'SimpleNotificationService' && 
             '• Currently using simple notification service (alerts only)'}
         </Text>
       </View>
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
  section: {
    marginHorizontal: 20,
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
  },
  actionButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    margin: 20,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default NotificationSettings;
