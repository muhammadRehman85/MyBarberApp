import PushNotification from 'react-native-push-notification';

class NotificationService {
  constructor() {
    this.configure();
    this.createDefaultChannels();
  }

  configure = () => {
    // Configure push notifications
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },

      // (required) Called when a remote or local notification is opened or received
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
        
        // Play notification sound
        this.playNotificationSound();
        
        // Process the notification
        this.processNotification(notification);
      },

      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function(err) {
        console.error(err.message, err);
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - false: it will not be called (only if `popInitialNotification` is true)
       * - true: it will be called every time a notification is opened
       */
      requestPermissions: true,
    });

    // Configure local notifications
    PushNotification.createChannel(
      {
        channelId: 'barber-appointments',
        channelName: 'Barber Appointments',
        channelDescription: 'Notifications for new appointment requests',
        playSound: true,
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      (created) => console.log(`Channel created: ${created}`)
    );
  };

  createDefaultChannels = () => {
    // Create notification channels for Android
    PushNotification.createChannel(
      {
        channelId: 'appointment-requests',
        channelName: 'Appointment Requests',
        channelDescription: 'New appointment requests from clients',
        playSound: true,
        soundName: 'notification_sound',
        importance: 4,
        vibrate: true,
        vibration: 1000,
      },
      (created) => console.log(`Appointment channel created: ${created}`)
    );

    PushNotification.createChannel(
      {
        channelId: 'appointment-updates',
        channelName: 'Appointment Updates',
        channelDescription: 'Updates to existing appointments',
        playSound: true,
        soundName: 'default',
        importance: 3,
        vibrate: true,
      },
      (created) => console.log(`Updates channel created: ${created}`)
    );
  };

  // Play notification sound (simplified version)
  playNotificationSound = () => {
    try {
      console.log('Playing notification sound');
      // The sound will be handled by the notification system itself
    } catch (error) {
      console.log('Error playing notification sound:', error);
    }
  };

  // Send local notification for new appointment request
  sendAppointmentRequestNotification = (appointmentData) => {
    const { clientName, service, date, time } = appointmentData;

    PushNotification.localNotification({
      channelId: 'appointment-requests',
      title: 'New Appointment Request! 🎉',
      message: `${clientName} wants to book ${service} on ${date} at ${time}`,
      playSound: true,
      soundName: 'notification_sound',
      importance: 'high',
      priority: 'high',
      vibrate: true,
      vibration: 1000,
      autoCancel: false,
      largeIcon: 'ic_launcher',
      smallIcon: 'ic_notification',
      bigText: `${clientName} has requested an appointment for ${service} on ${date} at ${time}. Tap to view details.`,
      subText: 'Tap to respond',
      color: '#4CAF50',
      number: 1,
      actions: ['Accept', 'Decline'],
      invokeApp: true,
      when: null,
      usesChronometer: false,
      timeoutAfter: null,
      category: 'appointment_request',
      userInfo: {
        appointmentId: appointmentData.id,
        type: 'appointment_request',
        data: appointmentData,
      },
    });

    // Also send a foreground notification using Notifee
    this.sendForegroundNotification(appointmentData);
  };

  // Send notification for appointment status updates
  sendAppointmentUpdateNotification = (appointmentData, status) => {
    const { clientName, service, date, time } = appointmentData;
    const statusText = status === 'confirmed' ? 'confirmed' : 
                      status === 'rejected' ? 'declined' : 
                      status === 'completed' ? 'completed' : status;

    PushNotification.localNotification({
      channelId: 'appointment-updates',
      title: `Appointment ${statusText.charAt(0).toUpperCase() + statusText.slice(1)}`,
      message: `${clientName}'s ${service} appointment has been ${statusText}`,
      playSound: true,
      soundName: 'default',
      importance: 'default',
      priority: 'default',
      vibrate: true,
      autoCancel: true,
      largeIcon: 'ic_launcher',
      smallIcon: 'ic_notification',
      color: status === 'confirmed' ? '#4CAF50' : 
             status === 'rejected' ? '#F44336' : '#2196F3',
      number: 1,
      invokeApp: true,
      when: null,
      usesChronometer: false,
      timeoutAfter: null,
      category: 'appointment_update',
      userInfo: {
        appointmentId: appointmentData.id,
        type: 'appointment_update',
        status: status,
        data: appointmentData,
      },
    });
  };

  // Send foreground notification (simplified version)
  sendForegroundNotification = async (appointmentData) => {
    try {
      const { clientName, service, date, time } = appointmentData;

      // Send a local notification that will show even when app is in foreground
      PushNotification.localNotification({
        channelId: 'appointment-requests',
        title: 'New Appointment Request! 🎉',
        message: `${clientName} wants to book ${service} on ${date} at ${time}`,
        playSound: true,
        soundName: 'notification_sound',
        importance: 'high',
        priority: 'high',
        vibrate: true,
        vibration: 1000,
        autoCancel: false,
        largeIcon: 'ic_launcher',
        smallIcon: 'ic_notification',
        bigText: `${clientName} has requested an appointment for ${service} on ${date} at ${time}. Tap to view details.`,
        subText: 'Tap to respond',
        color: '#4CAF50',
        number: 1,
        invokeApp: true,
        when: null,
        usesChronometer: false,
        timeoutAfter: null,
        category: 'appointment_request',
        userInfo: {
          appointmentId: appointmentData.id,
          type: 'appointment_request',
          data: appointmentData,
        },
      });
    } catch (error) {
      console.log('Error sending foreground notification:', error);
    }
  };

  // Cancel all notifications
  cancelAllNotifications = () => {
    PushNotification.cancelAllLocalNotifications();
  };

  // Cancel specific notification
  cancelNotification = (notificationId) => {
    PushNotification.cancelLocalNotification({ id: notificationId });
  };

  // Get scheduled notifications
  getScheduledNotifications = () => {
    return new Promise((resolve) => {
      PushNotification.getScheduledLocalNotifications((notifications) => {
        resolve(notifications);
      });
    });
  };

  // Get delivered notifications
  getDeliveredNotifications = () => {
    return new Promise((resolve) => {
      PushNotification.getDeliveredNotifications((notifications) => {
        resolve(notifications);
      });
    });
  };

  // Remove delivered notifications
  removeDeliveredNotifications = (notificationIds) => {
    PushNotification.removeDeliveredNotifications(notificationIds);
  };

  // Request notification permissions
  requestPermissions = () => {
    return new Promise((resolve) => {
      PushNotification.requestPermissions().then((permissions) => {
        resolve(permissions);
      });
    });
  };

  // Check if notifications are enabled
  checkPermissions = () => {
    return new Promise((resolve) => {
      PushNotification.checkPermissions((permissions) => {
        resolve(permissions);
      });
    });
  };

  // Process incoming notifications
  processNotification = (notification) => {
    const { userInfo, data } = notification;
    
    if (userInfo && userInfo.type === 'appointment_request') {
      // Handle appointment request notification
      console.log('Processing appointment request notification:', userInfo.data);
      // You can add custom logic here to handle the notification
    } else if (userInfo && userInfo.type === 'appointment_update') {
      // Handle appointment update notification
      console.log('Processing appointment update notification:', userInfo.data);
      // You can add custom logic here to handle the notification
    }
  };

  // Schedule reminder notification
  scheduleReminderNotification = (appointmentData, reminderTime) => {
    const { clientName, service, date, time } = appointmentData;
    
    PushNotification.localNotificationSchedule({
      channelId: 'appointment-reminders',
      title: 'Appointment Reminder ⏰',
      message: `You have an appointment with ${clientName} for ${service} in 30 minutes`,
      date: reminderTime,
      playSound: true,
      soundName: 'notification_sound',
      importance: 'high',
      priority: 'high',
      vibrate: true,
      vibration: 1000,
      autoCancel: true,
      largeIcon: 'ic_launcher',
      smallIcon: 'ic_notification',
      color: '#FF9800',
      number: 1,
      invokeApp: true,
      when: null,
      usesChronometer: false,
      timeoutAfter: null,
      category: 'appointment_reminder',
      userInfo: {
        appointmentId: appointmentData.id,
        type: 'appointment_reminder',
        data: appointmentData,
      },
    });
  };
}

export default new NotificationService();
