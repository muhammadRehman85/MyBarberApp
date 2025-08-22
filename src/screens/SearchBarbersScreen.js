import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useTheme } from '../theme';
import { barberService } from '../services/barberService';

const SearchBarbersScreen = ({ 
  onBack,
  searchQuery,
  setSearchQuery,
  searchResults,
  searchLoading,
  searchPerformed,
  setSearchPerformed
}) => {
  const { colors } = useTheme();
  const [location, setLocation] = useState('');
  const [barbers, setBarbers] = useState([]);

  const popularCities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia'];

  const handleSearch = async () => {
    if (!location.trim()) {
      Alert.alert('Error', 'Please enter a location to search');
      return;
    }

    setSearchPerformed(true);

    try {
      const result = await barberService.searchBarbersByLocation(location.trim());
      
      if (result.success) {
        setBarbers(result.barbers);
        if (result.barbers.length === 0) {
          Alert.alert('No Results', `No barbers found in ${location}`);
        }
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      console.log('Search error:', error);
      Alert.alert('Error', 'Search failed. Please try again.');
    }
  };

  const handleCityPress = (city) => {
    setLocation(city);
    setSearchQuery(city);
  };

  // Temporary function to add sample barbers to database (remove after testing)
  const addSampleBarbers = async () => {
    try {
      const result = await barberService.addSampleBarbers();
      if (result.success) {
        Alert.alert('Success', 'Sample barbers added to database!');
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add sample barbers');
    }
  };

  const renderBarberCard = ({ item }) => (
    <TouchableOpacity
      style={[styles.barberCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => {
        // For now, just show an alert. You can implement navigation later
        Alert.alert('Barber Profile', `Viewing profile of ${item.businessName || item.name}`);
      }}
    >
              <View style={styles.barberHeader}>
          <View style={styles.barberInfo}>
            <Text style={[styles.barberName, { color: colors.text }]}>{item.businessName || item.name}</Text>
            <Text style={[styles.barberLocation, { color: colors.textSecondary }]}>{item.location?.city}</Text>
          </View>
          <View style={styles.ratingContainer}>
            <Text style={[styles.rating, { color: colors.text }]}>⭐ {item.rating || 0}</Text>
            <Text style={[styles.reviewCount, { color: colors.textSecondary }]}>({item.totalReviews || 0} reviews)</Text>
          </View>
        </View>

              <View style={styles.barberDetails}>
          {item.experience && (
            <Text style={[styles.detailText, { color: colors.textSecondary }]}>Experience: {item.experience}</Text>
          )}
          {item.specialties && (
            <Text style={[styles.detailText, { color: colors.textSecondary }]}>Specialties: {item.specialties}</Text>
          )}
          {item.location?.address && (
            <Text style={[styles.detailText, { color: colors.textSecondary }]}>📍 {item.location.address}</Text>
          )}
        </View>

              <View style={styles.barberActions}>
          <TouchableOpacity
            style={[styles.bookButton, { backgroundColor: colors.primary }]}
            onPress={() => {
              Alert.alert('Book Appointment', `Booking appointment with ${item.businessName || item.name}`);
            }}
          >
            <Text style={[styles.bookButtonText, { color: colors.white }]}>Book Appointment</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.viewButton, { borderColor: colors.primary }]}
            onPress={() => {
              Alert.alert('Barber Profile', `Viewing profile of ${item.businessName || item.name}`);
            }}
          >
            <Text style={[styles.viewButtonText, { color: colors.primary }]}>View Profile</Text>
          </TouchableOpacity>
        </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={onBack}
        >
          <Text style={[styles.backButtonText, { color: colors.primary }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Find Barbers</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Search for barbers in your area</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={[styles.searchInput, { 
              backgroundColor: colors.surface, 
              borderColor: colors.border,
              color: colors.text 
            }]}
            value={location}
            onChangeText={setLocation}
            placeholder="Enter city or location"
            placeholderTextColor={colors.textTertiary}
            autoCapitalize="words"
          />
          <TouchableOpacity
            style={[styles.searchButton, { backgroundColor: colors.primary }, searchLoading && styles.disabledButton]}
            onPress={handleSearch}
            disabled={searchLoading}
          >
            {searchLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={[styles.searchButtonText, { color: colors.white }]}>Search</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.popularCitiesContainer}>
          <Text style={[styles.popularCitiesTitle, { color: colors.text }]}>Popular Cities:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {popularCities.map((city, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.cityChip, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => handleCityPress(city)}
              >
                <Text style={[styles.cityChipText, { color: colors.text }]}>{city}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          {/* Temporary button to add sample barbers - REMOVE AFTER TESTING */}
          <TouchableOpacity
            style={[styles.sampleButton, { backgroundColor: colors.secondary, borderColor: colors.border }]}
            onPress={addSampleBarbers}
          >
            <Text style={[styles.sampleButtonText, { color: colors.white }]}>Add Sample Barbers to DB</Text>
          </TouchableOpacity>
        </View>
      </View>

      {searchPerformed && (
        <View style={styles.resultsContainer}>
          <Text style={[styles.resultsTitle, { color: colors.text }]}>
            {searchLoading ? 'Searching...' : `Found ${barbers.length} barber(s) in ${location}`}
          </Text>
          
          {!searchLoading && (
            <FlatList
              data={barbers}
              renderItem={renderBarberCard}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.barbersList}
            />
          )}
        </View>
      )}

      {!searchPerformed && (
        <View style={styles.placeholderContainer}>
          <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>
            Enter a location above to find barbers in your area
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  searchContainer: {
    padding: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchButton: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  disabledButton: {
    opacity: 0.6,
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  popularCitiesContainer: {
    marginBottom: 20,
  },
  popularCitiesTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  cityChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
  },
  cityChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  sampleButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
    borderWidth: 1,
    alignSelf: 'center',
  },
  sampleButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  barbersList: {
    paddingBottom: 20,
  },
  barberCard: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  barberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  barberInfo: {
    flex: 1,
  },
  barberName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  barberLocation: {
    fontSize: 14,
  },
  ratingContainer: {
    alignItems: 'flex-end',
  },
  rating: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviewCount: {
    fontSize: 12,
  },
  barberDetails: {
    marginBottom: 15,
  },
  detailText: {
    fontSize: 14,
    marginBottom: 5,
  },
  barberActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bookButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  bookButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  viewButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
    borderWidth: 1,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  placeholderText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default SearchBarbersScreen;
