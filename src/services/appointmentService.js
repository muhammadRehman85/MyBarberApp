import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Import notification service with error handling
let notificationService;
try {
  // Try the safe service first (guaranteed to work)
  notificationService = require('./safeNotificationService').default;
  console.log('Using safe notification service');
} catch (error) {
  console.log('Safe notification service not available:', error);
  try {
    // Fallback to full service
    notificationService = require('./notificationService').default;
    console.log('Using full notification service');
  } catch (fullError) {
    console.log('Full notification service not available:', fullError);
    try {
      // Final fallback to simple service
      notificationService = require('./simpleNotificationService').default;
      console.log('Using simple notification service');
    } catch (simpleError) {
      console.log('All notification services failed:', simpleError);
      notificationService = null;
    }
  }
}

class AppointmentService {
  constructor() {
    this.collectionName = 'appointments';
  }

    // Create a new appointment
  async createAppointment(appointmentData) {
    try {
      // Check availability before creating appointment
      const availabilityService = require('./availabilityService').default;
      const availabilityResult = await availabilityService.checkTimeSlotAvailability(
        appointmentData.barberId,
        appointmentData.date,
        appointmentData.time
      );
      
      if (!availabilityResult.success) {
        return {
          success: false,
          error: 'Failed to check availability'
        };
      }
      
      if (!availabilityResult.isAvailable) {
        return {
          success: false,
          error: availabilityResult.reason || 'Time slot is not available'
        };
      }
      
      const appointmentRef = await addDoc(collection(db, this.collectionName), {
        ...appointmentData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: appointmentData.status || 'pending'
      });
      
      const createdAppointment = { id: appointmentRef.id, ...appointmentData };
      
      // Send notification to barber for new appointment request
      if (appointmentData.status === 'pending' && notificationService) {
        try {
          notificationService.sendAppointmentRequestNotification(createdAppointment);
        } catch (notificationError) {
          console.log('Error sending notification:', notificationError);
        }
      }
      
      return {
        success: true,
        appointmentId: appointmentRef.id,
        appointment: createdAppointment
      };
    } catch (error) {
      console.error('Error creating appointment:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get appointments for a specific barber
  async getBarberAppointments(barberId, status = null) {
    try {
      let q = query(
        collection(db, this.collectionName),
        where('barberId', '==', barberId)
      );

      if (status && status !== 'all') {
        q = query(
          collection(db, this.collectionName),
          where('barberId', '==', barberId),
          where('status', '==', status)
        );
      }

      const querySnapshot = await getDocs(q);
      const appointments = [];
      
      querySnapshot.forEach((doc) => {
        appointments.push({
          id: doc.id,
          ...doc.data()
        });
      });

      // Sort appointments by date and time (newest first)
      appointments.sort((a, b) => {
        const dateA = new Date(a.date + ' ' + a.time);
        const dateB = new Date(b.date + ' ' + b.time);
        return dateB - dateA;
      });

      return {
        success: true,
        appointments
      };
    } catch (error) {
      console.error('Error getting barber appointments:', error);
      return {
        success: false,
        error: error.message,
        appointments: []
      };
    }
  }

  // Get appointments for a specific client
  async getClientAppointments(clientId, status = null) {
    try {
      let q = query(
        collection(db, this.collectionName),
        where('clientId', '==', clientId)
      );

      if (status && status !== 'all') {
        q = query(
          collection(db, this.collectionName),
          where('clientId', '==', clientId),
          where('status', '==', status)
        );
      }

      const querySnapshot = await getDocs(q);
      const appointments = [];
      
      querySnapshot.forEach((doc) => {
        appointments.push({
          id: doc.id,
          ...doc.data()
        });
      });

      // Sort appointments by date and time (newest first)
      appointments.sort((a, b) => {
        const dateA = new Date(a.date + ' ' + a.time);
        const dateB = new Date(b.date + ' ' + b.time);
        return dateB - dateA;
      });

      return {
        success: true,
        appointments
      };
    } catch (error) {
      console.error('Error getting client appointments:', error);
      return {
        success: false,
        error: error.message,
        appointments: []
      };
    }
  }

  // Get a specific appointment by ID
  async getAppointmentById(appointmentId) {
    try {
      const appointmentRef = doc(db, this.collectionName, appointmentId);
      const appointmentSnap = await getDoc(appointmentRef);
      
      if (appointmentSnap.exists()) {
        return {
          success: true,
          appointment: {
            id: appointmentSnap.id,
            ...appointmentSnap.data()
          }
        };
      } else {
        return {
          success: false,
          error: 'Appointment not found'
        };
      }
    } catch (error) {
      console.error('Error getting appointment:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update appointment status
  async updateAppointmentStatus(appointmentId, newStatus) {
    try {
      const appointmentRef = doc(db, this.collectionName, appointmentId);
      await updateDoc(appointmentRef, {
        status: newStatus,
        updatedAt: serverTimestamp()
      });

      // Get the updated appointment data to send notification
      const appointmentSnap = await getDoc(appointmentRef);
      if (appointmentSnap.exists()) {
        const appointmentData = {
          id: appointmentSnap.id,
          ...appointmentSnap.data()
        };

                 // Send notification for status update
         if (notificationService) {
           try {
             notificationService.sendAppointmentUpdateNotification(appointmentData, newStatus);
           } catch (notificationError) {
             console.log('Error sending status update notification:', notificationError);
           }
         }
      }

      return {
        success: true,
        message: 'Appointment status updated successfully'
      };
    } catch (error) {
      console.error('Error updating appointment status:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update appointment details
  async updateAppointment(appointmentId, updateData) {
    try {
      const appointmentRef = doc(db, this.collectionName, appointmentId);
      await updateDoc(appointmentRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });

      return {
        success: true,
        message: 'Appointment updated successfully'
      };
    } catch (error) {
      console.error('Error updating appointment:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Delete appointment
  async deleteAppointment(appointmentId) {
    try {
      await deleteDoc(doc(db, this.collectionName, appointmentId));
      
      return {
        success: true,
        message: 'Appointment deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting appointment:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get appointments by date range
  async getAppointmentsByDateRange(barberId, startDate, endDate) {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('barberId', '==', barberId),
        where('date', '>=', startDate),
        where('date', '<=', endDate),
        orderBy('date', 'asc'),
        orderBy('time', 'asc')
      );

      const querySnapshot = await getDocs(q);
      const appointments = [];
      
      querySnapshot.forEach((doc) => {
        appointments.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return {
        success: true,
        appointments
      };
    } catch (error) {
      console.error('Error getting appointments by date range:', error);
      return {
        success: false,
        error: error.message,
        appointments: []
      };
    }
  }

  // Get today's appointments for a barber
  async getTodayAppointments(barberId) {
    try {
      const today = new Date().toISOString().split('T')[0];
      const q = query(
        collection(db, this.collectionName),
        where('barberId', '==', barberId),
        where('date', '==', today),
        orderBy('time', 'asc')
      );

      const querySnapshot = await getDocs(q);
      const appointments = [];
      
      querySnapshot.forEach((doc) => {
        appointments.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return {
        success: true,
        appointments
      };
    } catch (error) {
      console.error('Error getting today\'s appointments:', error);
      return {
        success: false,
        error: error.message,
        appointments: []
      };
    }
  }

  // Check if a time slot is available
  async checkTimeSlotAvailability(barberId, date, time, duration = 60) {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('barberId', '==', barberId),
        where('date', '==', date),
        where('status', 'in', ['pending', 'confirmed'])
      );

      const querySnapshot = await getDocs(q);
      const conflictingAppointments = [];
      
      querySnapshot.forEach((doc) => {
        const appointment = doc.data();
        // Simple time conflict check - can be enhanced with more sophisticated logic
        if (appointment.time === time) {
          conflictingAppointments.push(appointment);
        }
      });

      return {
        success: true,
        isAvailable: conflictingAppointments.length === 0,
        conflictingAppointments
      };
    } catch (error) {
      console.error('Error checking time slot availability:', error);
      return {
        success: false,
        error: error.message,
        isAvailable: false
      };
    }
  }

  // Get appointment statistics for a barber
  async getBarberAppointmentStats(barberId) {
    try {
      const allAppointments = await this.getBarberAppointments(barberId);
      
      if (!allAppointments.success) {
        return allAppointments;
      }

      const appointments = allAppointments.appointments;
      const stats = {
        total: appointments.length,
        pending: appointments.filter(apt => apt.status === 'pending').length,
        confirmed: appointments.filter(apt => apt.status === 'confirmed').length,
        completed: appointments.filter(apt => apt.status === 'completed').length,
        cancelled: appointments.filter(apt => apt.status === 'cancelled').length,
        today: appointments.filter(apt => apt.date === new Date().toISOString().split('T')[0]).length
      };

      return {
        success: true,
        stats
      };
    } catch (error) {
      console.error('Error getting appointment statistics:', error);
      return {
        success: false,
        error: error.message,
        stats: {
          total: 0,
          pending: 0,
          confirmed: 0,
          completed: 0,
          cancelled: 0,
          today: 0
        }
      };
    }
  }

  // Add sample appointments for testing
  async addSampleAppointments(barberId) {
    try {
      const sampleAppointments = [
        {
          barberId,
          clientId: 'sample-client-1',
          clientName: 'John Smith',
          clientPhone: '+1234567890',
          clientEmail: 'john@example.com',
          service: 'Haircut & Beard Trim',
          date: new Date().toISOString().split('T')[0],
          time: '10:00 AM',
          price: '$25',
          status: 'confirmed',
          notes: 'Regular customer, prefers short sides'
        },
        {
          barberId,
          clientId: 'sample-client-2',
          clientName: 'Mike Johnson',
          clientPhone: '+1234567891',
          clientEmail: 'mike@example.com',
          service: 'Haircut',
          date: new Date().toISOString().split('T')[0],
          time: '11:30 AM',
          price: '$20',
          status: 'pending',
          notes: 'First time customer'
        },
        {
          barberId,
          clientId: 'sample-client-3',
          clientName: 'David Wilson',
          clientPhone: '+1234567892',
          clientEmail: 'david@example.com',
          service: 'Beard Trim',
          date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
          time: '2:00 PM',
          price: '$15',
          status: 'confirmed',
          notes: 'Just beard trim, no haircut'
        }
      ];

      const results = [];
      for (const appointmentData of sampleAppointments) {
        const result = await this.createAppointment(appointmentData);
        results.push(result);
      }

      return {
        success: true,
        message: 'Sample appointments added successfully',
        results
      };
    } catch (error) {
      console.error('Error adding sample appointments:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new AppointmentService();
