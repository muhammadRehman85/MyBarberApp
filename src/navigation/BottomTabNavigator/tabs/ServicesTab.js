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

const ServicesTab = ({ navigation }) => {
  const services = [
    {
      id: 1,
      name: 'Haircut',
      description: 'Professional haircut with styling',
      duration: '30 min',
      price: '$25',
      icon: '✂️',
    },
    {
      id: 2,
      name: 'Beard Trim',
      description: 'Beard shaping and trimming',
      duration: '20 min',
      price: '$15',
      icon: '🧔',
    },
    {
      id: 3,
      name: 'Haircut & Beard Trim',
      description: 'Complete grooming package',
      duration: '45 min',
      price: '$35',
      icon: '👨‍💼',
    },
    {
      id: 4,
      name: 'Hair Coloring',
      description: 'Professional hair coloring service',
      duration: '60 min',
      price: '$45',
      icon: '🎨',
    },
    {
      id: 5,
      name: 'Hair Styling',
      description: 'Special occasion hair styling',
      duration: '30 min',
      price: '$20',
      icon: '💇‍♂️',
    },
    {
      id: 6,
      name: 'Kids Haircut',
      description: 'Haircut for children under 12',
      duration: '25 min',
      price: '$18',
      icon: '👶',
    },
  ];

  const barbers = [
    {
      id: 1,
      name: 'Mike Johnson',
      experience: '5 years',
      rating: 4.8,
      specialties: ['Haircut', 'Beard Trim'],
      image: '👨‍💼',
    },
    {
      id: 2,
      name: 'John Smith',
      experience: '8 years',
      rating: 4.9,
      specialties: ['Haircut', 'Hair Coloring'],
      image: '👨‍💼',
    },
    {
      id: 3,
      name: 'David Wilson',
      experience: '3 years',
      rating: 4.7,
      specialties: ['Beard Trim', 'Hair Styling'],
      image: '👨‍💼',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Services</Text>
          <Text style={styles.subtitle}>Choose from our professional services</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Services</Text>
          {services.map((service) => (
            <TouchableOpacity key={service.id} style={styles.serviceCard}>
              <View style={styles.serviceHeader}>
                <Text style={styles.serviceIcon}>{service.icon}</Text>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.serviceDescription}>{service.description}</Text>
                </View>
                <View style={styles.servicePrice}>
                  <Text style={styles.priceText}>{service.price}</Text>
                  <Text style={styles.durationText}>{service.duration}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Barbers</Text>
          {barbers.map((barber) => (
            <View key={barber.id} style={styles.barberCard}>
              <View style={styles.barberHeader}>
                <Text style={styles.barberImage}>{barber.image}</Text>
                <View style={styles.barberInfo}>
                  <Text style={styles.barberName}>{barber.name}</Text>
                  <Text style={styles.barberExperience}>{barber.experience} experience</Text>
                  <View style={styles.ratingContainer}>
                    <Text style={styles.ratingText}>⭐ {barber.rating}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.specialtiesContainer}>
                <Text style={styles.specialtiesTitle}>Specialties:</Text>
                <View style={styles.specialtiesList}>
                  {barber.specialties.map((specialty, index) => (
                    <View key={index} style={styles.specialtyTag}>
                      <Text style={styles.specialtyText}>{specialty}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Offers</Text>
          <View style={styles.offerCard}>
            <Text style={styles.offerTitle}>🎉 New Customer Discount</Text>
            <Text style={styles.offerDescription}>
              Get 20% off your first visit when you book online
            </Text>
            <TouchableOpacity style={styles.bookNowButton}>
              <Text style={styles.bookNowButtonText}>Book Now</Text>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
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
  serviceCard: {
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  servicePrice: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 2,
  },
  durationText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  barberCard: {
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  barberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  barberImage: {
    fontSize: 40,
    marginRight: 15,
  },
  barberInfo: {
    flex: 1,
  },
  barberName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  barberExperience: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  specialtiesContainer: {
    marginTop: 8,
  },
  specialtiesTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  specialtiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  specialtyTag: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  specialtyText: {
    fontSize: 12,
    color: colors.white,
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
  bookNowButton: {
    backgroundColor: colors.white,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  bookNowButtonText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ServicesTab;
