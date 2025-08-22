import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc,
  addDoc,
  orderBy,
  limit 
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const barberService = {
  // Search barbers by location
  async searchBarbersByLocation(location, limitCount = 20) {
    try {
      // Get all verified barbers from the barbers collection
      const barbersRef = collection(db, 'barbers');
      const q = query(
        barbersRef,
        where('isVerified', '==', true), // Only verified barbers
        limit(50) // Get more barbers to filter from
      );

      const querySnapshot = await getDocs(q);
      const barbers = [];

      querySnapshot.forEach((doc) => {
        const barberData = doc.data();
        
        // Check if the barber has location data and matches the search
        if (barberData.location && barberData.location.city) {
          const barberCity = barberData.location.city.toLowerCase();
          const searchLocation = location.toLowerCase();
          
          // Check if the city matches (partial match for better results)
          if (barberCity.includes(searchLocation) || searchLocation.includes(barberCity)) {
            barbers.push({
              id: doc.id,
              name: barberData.name || barberData.businessName || 'Unknown',
              businessName: barberData.businessName || barberData.name || 'Barbershop',
              location: barberData.location || { city: 'Unknown', address: 'Unknown' },
              rating: barberData.rating || 0,
              totalReviews: barberData.totalReviews || 0,
              experience: barberData.experience || 'Not specified',
              specialties: barberData.specialties || 'General Barber Services',
              phone: barberData.phone || '',
              email: barberData.email || ''
            });
          }
        }
      });

      // Sort by rating (highest first)
      barbers.sort((a, b) => b.rating - a.rating);

      // Limit results
      const limitedBarbers = barbers.slice(0, limitCount);

      return { success: true, barbers: limitedBarbers };
    } catch (error) {
      console.log('Search error:', error);
      return { success: false, error: error.message };
    }
  },

  // Get barber by ID
  async getBarberById(barberId) {
    try {
      const barberDoc = await getDoc(doc(db, 'barbers', barberId));
      
      if (barberDoc.exists()) {
        return { 
          success: true, 
          barber: { id: barberDoc.id, ...barberDoc.data() } 
        };
      } else {
        return { success: false, error: 'Barber not found' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get all barbers (for admin purposes)
  async getAllBarbers() {
    try {
      const barbersRef = collection(db, 'barbers');
      const q = query(
        barbersRef,
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const barbers = [];

      querySnapshot.forEach((doc) => {
        barbers.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return { success: true, barbers };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update barber profile
  async updateBarberProfile(barberId, updateData) {
    try {
      await updateDoc(doc(db, 'barbers', barberId), updateData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get barber services
  async getBarberServices(barberId) {
    try {
      const servicesRef = collection(db, 'services');
      const q = query(servicesRef, where('barberId', '==', barberId));
      
      const querySnapshot = await getDocs(q);
      const services = [];

      querySnapshot.forEach((doc) => {
        services.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return { success: true, services };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Add barber service
  async addBarberService(serviceData) {
    try {
      const docRef = await addDoc(collection(db, 'services'), {
        ...serviceData,
        createdAt: new Date()
      });
      return { success: true, serviceId: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Search barbers by multiple criteria
  async searchBarbers(criteria) {
    try {
      const { location, service, rating } = criteria;
      const barbersRef = collection(db, 'barbers');
      
      let q = query(
        barbersRef,
        where('isVerified', '==', true) // Only verified barbers
      );

      if (location) {
        q = query(q, where('location.city', '==', location));
      }

      if (rating) {
        q = query(q, where('rating', '>=', rating));
      }

      const querySnapshot = await getDocs(q);
      const barbers = [];

      querySnapshot.forEach((doc) => {
        const barberData = doc.data();
        
        // Filter by service if specified
        if (service && barberData.services) {
          const hasService = barberData.services.some(s => 
            s.name.toLowerCase().includes(service.toLowerCase())
          );
          if (hasService) {
            barbers.push({ id: doc.id, ...barberData });
          }
        } else {
          barbers.push({ id: doc.id, ...barberData });
        }
      });

      return { success: true, barbers };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Add sample barber data for testing (call this once to populate your database)
  async addSampleBarbers() {
    try {
      const sampleBarbers = [
        {
          role: 'barber',
          name: 'John Smith',
          businessName: 'Smith\'s Barbershop',
          email: 'john@smithbarbershop.com',
          phone: '+1234567890',
          location: { 
            city: 'New York', 
            address: '123 Main St, New York, NY 10001' 
          },
          rating: 4.8,
          totalReviews: 45,
          experience: '5 years',
          specialties: 'Fades, Beard Trims, Classic Cuts',
          services: [
            { name: 'Haircut', price: 25, duration: 30 },
            { name: 'Beard Trim', price: 15, duration: 20 },
            { name: 'Hair & Beard Combo', price: 35, duration: 45 }
          ]
        },
        {
          role: 'barber',
          name: 'Mike Johnson',
          businessName: 'Mike\'s Cuts',
          email: 'mike@mikescuts.com',
          phone: '+1234567891',
          location: { 
            city: 'Los Angeles', 
            address: '456 Oak Ave, Los Angeles, CA 90210' 
          },
          rating: 4.6,
          totalReviews: 32,
          experience: '3 years',
          specialties: 'Modern Styles, Hair Coloring',
          services: [
            { name: 'Haircut', price: 30, duration: 35 },
            { name: 'Hair Coloring', price: 50, duration: 60 },
            { name: 'Style Consultation', price: 20, duration: 15 }
          ]
        },
        {
          role: 'barber',
          name: 'David Wilson',
          businessName: 'Wilson\'s Grooming',
          email: 'david@wilsonsgrooming.com',
          phone: '+1234567892',
          location: { 
            city: 'Chicago', 
            address: '789 Pine St, Chicago, IL 60601' 
          },
          rating: 4.9,
          totalReviews: 67,
          experience: '8 years',
          specialties: 'Traditional Cuts, Hot Shaves',
          services: [
            { name: 'Traditional Haircut', price: 35, duration: 40 },
            { name: 'Hot Shave', price: 25, duration: 30 },
            { name: 'Beard Grooming', price: 20, duration: 25 }
          ]
        },
        {
          role: 'barber',
          name: 'Alex Rodriguez',
          businessName: 'Alex\'s Studio',
          email: 'alex@alexstudio.com',
          phone: '+1234567893',
          location: { 
            city: 'Houston', 
            address: '321 Elm St, Houston, TX 77001' 
          },
          rating: 4.7,
          totalReviews: 28,
          experience: '4 years',
          specialties: 'Fades, Line-ups, Kids Cuts',
          services: [
            { name: 'Fade Haircut', price: 25, duration: 30 },
            { name: 'Line-up', price: 10, duration: 15 },
            { name: 'Kids Haircut', price: 15, duration: 20 }
          ]
        }
      ];

             const results = [];
       for (const barberData of sampleBarbers) {
         try {
           const docRef = await addDoc(collection(db, 'barbers'), {
             ...barberData,
             isVerified: true, // Set as verified for sample data
             createdAt: new Date(),
             updatedAt: new Date()
           });
           results.push({ success: true, id: docRef.id, name: barberData.name });
         } catch (error) {
           results.push({ success: false, name: barberData.name, error: error.message });
         }
       }

      return { success: true, results };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};
