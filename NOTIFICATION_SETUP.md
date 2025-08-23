# 🔔 Notification System Setup Guide

## Overview
The MyBarber app now includes a comprehensive notification system that sends push notifications with sound to barbers when they receive appointment requests from clients.

## 🎯 Features

### For Barbers:
- **Appointment Request Notifications**: Get notified when clients request appointments
- **Appointment Status Updates**: Receive notifications when appointment status changes
- **Customizable Settings**: Control which notifications to receive
- **Sound & Vibration**: Custom notification sounds and vibration patterns
- **Test Notifications**: Test your notification settings

### For Clients:
- **Booking Confirmations**: Get notified when barbers accept/reject appointments
- **Appointment Reminders**: Receive reminders before appointments

## 📱 Setup Instructions

### 1. Install Dependencies
The following packages have been installed:
```bash
npm install @react-native-community/push-notification-ios react-native-push-notification @notifee/react-native react-native-sound
```

### 2. Android Permissions
The following permissions have been added to `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
<uses-permission android:name="android.permission.WAKE_LOCK" />
<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
```

### 3. Notification Sound Setup

#### Option A: Use Default Sound
The app will use the device's default notification sound if no custom sound is provided.

#### Option B: Add Custom Sound
1. **Find a notification sound file** (.mp3 or .wav format)
   - Recommended duration: 1-3 seconds
   - File size: < 1MB
   - Sources: [Freesound](https://freesound.org/), [Mixkit](https://mixkit.co/), [Zapsplat](https://www.zapsplat.com/)

2. **Add the sound file**:
   - Place your sound file in: `android/app/src/main/res/raw/`
   - Name it: `notification_sound.mp3` or `notification_sound.wav`

3. **Replace the placeholder**:
   - Delete: `android/app/src/main/res/raw/notification_sound.txt`
   - Add your actual sound file

### 4. iOS Setup (if needed)
For iOS, you'll need to:
1. Add the sound file to your iOS project
2. Configure push notification capabilities in Xcode
3. Add notification permissions to Info.plist

## 🔧 How It Works

### Notification Flow:
1. **Client books appointment** → Creates appointment with 'pending' status
2. **Notification sent to barber** → Push notification with sound
3. **Barber receives notification** → Can tap to view appointment details
4. **Barber responds** → Accepts/rejects appointment
5. **Client notified** → Receives status update notification

### Notification Types:
- **Appointment Requests**: New booking requests from clients
- **Appointment Updates**: Status changes (confirmed, rejected, completed)
- **Appointment Reminders**: Reminders before upcoming appointments

## 🎛️ Notification Settings

### Accessing Settings:
1. Login as a barber
2. Go to Barber Dashboard
3. Click "🔔 Notification Settings"

### Available Settings:
- **Appointment Requests**: Toggle notifications for new requests
- **Appointment Updates**: Toggle notifications for status changes
- **Appointment Reminders**: Toggle reminder notifications
- **Push Notifications**: Enable/disable all notifications
- **Sound**: Toggle notification sounds
- **Vibration**: Toggle vibration patterns

### Test Notifications:
- Use the "🧪 Test Notification" button to verify your settings
- This sends a sample notification to test sound and display

## 🚀 Usage

### For Barbers:
1. **Enable notifications** in your device settings
2. **Customize notification preferences** in the app
3. **Test notifications** to ensure everything works
4. **Receive real-time alerts** when clients book appointments

### For Clients:
1. **Book appointments** normally through the app
2. **Receive confirmations** when barbers respond
3. **Get reminders** before scheduled appointments

## 🔍 Troubleshooting

### Common Issues:

#### Notifications not appearing:
1. Check device notification settings
2. Verify app notification permissions
3. Test with the "Test Notification" button
4. Restart the app

#### No sound playing:
1. Check device volume settings
2. Verify notification sound is enabled in app settings
3. Ensure custom sound file is properly placed
4. Check if device is in silent mode

#### Notifications delayed:
1. Check device battery optimization settings
2. Verify internet connection
3. Check if app is backgrounded/closed

### Debug Steps:
1. Check console logs for notification errors
2. Verify Firebase configuration
3. Test on different devices
4. Check notification service initialization

## 📋 Files Modified

### New Files:
- `src/services/notificationService.js` - Main notification service
- `src/components/barber/NotificationSettings.js` - Settings UI
- `android/app/src/main/res/drawable/ic_notification.xml` - Notification icon
- `android/app/src/main/res/raw/notification_sound.txt` - Sound placeholder

### Modified Files:
- `App.js` - Added notification service initialization and handlers
- `src/services/appointmentService.js` - Integrated notifications
- `src/components/barber/BarberDashboard.js` - Added notification settings button
- `android/app/src/main/AndroidManifest.xml` - Added permissions

## 🎉 Success!

Once set up, barbers will receive:
- ✅ **Instant notifications** when clients book appointments
- ✅ **Custom notification sounds** for better visibility
- ✅ **Vibration alerts** for immediate attention
- ✅ **Customizable settings** for personal preferences
- ✅ **Test functionality** to verify everything works

The notification system is now fully integrated and ready to enhance the barber-client communication experience!
