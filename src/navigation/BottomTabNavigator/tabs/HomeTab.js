import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../../../theme';

const HomeTab = ({ navigation }) => {
  const upcomingBookings = [
    {
      id: 1,
      service: 'Haircut & Beard Trim',
      date: 'Tomorrow',
      time: '2:00 PM',
      barber: 'Mike Johnson',
    },
    {
      id: 2,
      service: 'Haircut',
      date: 'Next Week',
      time: '10:00 AM',
      barber: 'John Smith',
    },
  ];

  const quickActions = [
    { title: 'Book Now', icon: '📅', action: () => {} },
    { title: 'View Services', icon: '✂️', action: () => {} },
    { title: 'Find Barbers', icon: '👨‍💼', action: () => {} },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning, John!</Text>
          <Text style={styles.subtitle}>Ready for your next haircut?</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionCard}
                onPress={action.action}
              >
                <Text style={styles.actionIcon}>{action.icon}</Text>
                <Text style={styles.actionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Bookings</Text>
          {upcomingBookings.map((booking) => (
            <View key={booking.id} style={styles.bookingCard}>
              <View style={styles.bookingHeader}>
                <Text style={styles.bookingService}>{booking.service}</Text>
                <Text style={styles.bookingDate}>{booking.date}</Text>
              </View>
              <View style={styles.bookingDetails}>
                <Text style={styles.bookingTime}>{booking.time}</Text>
                <Text style={styles.bookingBarber}>with {booking.barber}</Text>
              </View>
              <TouchableOpacity style={styles.rescheduleButton}>
                <Text style={styles.rescheduleText}>Reschedule</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Offers</Text>
          <View style={styles.offerCard}>
            <Text style={styles.offerTitle}>🎉 20% Off First Visit</Text>
            <Text style={styles.offerDescription}>
              New customers get 20% off their first haircut
            </Text>
            <TouchableOpacity style={styles.offerButton}>
              <Text style={styles.offerButtonText}>Book Now</Text>
            </TouchableOpacity>
          </View>
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
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 15,
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  bookingCard: {
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bookingService: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  bookingDate: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  bookingDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  bookingTime: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  bookingBarber: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  rescheduleButton: {
    alignSelf: 'flex-start',
  },
  rescheduleText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  offerCard: {
    backgroundColor: colors.primary,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 8,
  },
  offerDescription: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 15,
  },
  offerButton: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  offerButtonText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
});

export default HomeTab;
