import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useTheme } from '../../../theme';

const SettingsScreen = ({ navigation }) => {
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(true);

  const settingsSections = [
    {
      title: 'Notifications',
      items: [
        {
          title: 'Push Notifications',
          subtitle: 'Receive notifications about bookings',
          type: 'switch',
          value: notifications,
          onValueChange: setNotifications,
        },
        {
          title: 'Email Notifications',
          subtitle: 'Receive email updates',
          type: 'switch',
          value: true,
          onValueChange: () => {},
        },
      ],
    },
    {
      title: 'App Settings',
      items: [
        {
          title: 'Dark Mode',
          subtitle: 'Use dark theme',
          type: 'switch',
          value: isDarkMode,
          onValueChange: toggleTheme,
        },
        {
          title: 'Location Services',
          subtitle: 'Allow location access',
          type: 'switch',
          value: locationServices,
          onValueChange: setLocationServices,
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          title: 'Theme Demo',
          subtitle: 'Preview dark and light themes',
          type: 'link',
          onPress: () => navigation.navigate('ThemeDemo'),
        },
        {
          title: 'Change Password',
          subtitle: 'Update your password',
          type: 'link',
          onPress: () => {},
        },
        {
          title: 'Privacy Policy',
          subtitle: 'Read our privacy policy',
          type: 'link',
          onPress: () => {},
        },
        {
          title: 'Terms of Service',
          subtitle: 'Read our terms of service',
          type: 'link',
          onPress: () => {},
        },
      ],
    },
  ];

  const renderSettingItem = (item, index) => {
    return (
      <View key={index} style={[styles.settingItem, { borderBottomColor: colors.border }]}>
        <View style={styles.settingInfo}>
          <Text style={[styles.settingTitle, { color: colors.text }]}>{item.title}</Text>
          <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>{item.subtitle}</Text>
        </View>
        {item.type === 'switch' ? (
          <Switch
            value={item.value}
            onValueChange={item.onValueChange}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.white}
          />
        ) : (
          <TouchableOpacity onPress={item.onPress}>
            <Text style={[styles.linkText, { color: colors.textSecondary }]}>›</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backButton, { color: colors.primary }]}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content}>
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.title}</Text>
            <View style={[styles.sectionContent, { backgroundColor: colors.surface }]}>
              {section.items.map((item, itemIndex) =>
                renderSettingItem(item, itemIndex)
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
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
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  backButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 50,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  sectionContent: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
  },
  linkText: {
    fontSize: 18,
  },
});

export default SettingsScreen;
