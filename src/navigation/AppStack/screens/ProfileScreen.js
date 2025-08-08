import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { colors } from '../../../theme';

const ProfileScreen = ({ navigation }) => {
  const userProfile = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    memberSince: 'January 2024',
  };

  const menuItems = [
    { title: 'Edit Profile', icon: '👤', onPress: () => {} },
    { title: 'My Bookings', icon: '📅', onPress: () => {} },
    { title: 'Payment Methods', icon: '💳', onPress: () => {} },
    { title: 'Notifications', icon: '🔔', onPress: () => {} },
    { title: 'Settings', icon: '⚙️', onPress: () => navigation.navigate('Settings') },
    { title: 'Help & Support', icon: '❓', onPress: () => {} },
    { title: 'Logout', icon: '🚪', onPress: () => {} },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {userProfile.name.charAt(0)}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{userProfile.name}</Text>
              <Text style={styles.email}>{userProfile.email}</Text>
              <Text style={styles.memberSince}>
                Member since {userProfile.memberSince}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={styles.menuTitle}>{item.title}</Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  header: {
    backgroundColor: colors.primary,
    padding: 20,
    paddingTop: 40,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.9,
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.7,
  },
  menuSection: {
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 15,
    width: 30,
  },
  menuTitle: {
    fontSize: 16,
    color: colors.text,
  },
  menuArrow: {
    fontSize: 18,
    color: colors.textSecondary,
  },
});

export default ProfileScreen;
