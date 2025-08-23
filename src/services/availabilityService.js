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
  setDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

class AvailabilityService {
  constructor() {
    this.collectionName = 'barber_availability';
  }

  // Set barber's weekly schedule
  async setWeeklySchedule(barberId, weeklySchedule) {
    try {
      const availabilityRef = doc(db, this.collectionName, barberId);
      
      await setDoc(availabilityRef, {
        barberId,
        weeklySchedule,
        updatedAt: serverTimestamp()
      });

      return {
        success: true,
        message: 'Weekly schedule updated successfully'
      };
    } catch (error) {
      console.error('Error setting weekly schedule:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get barber's weekly schedule
  async getWeeklySchedule(barberId) {
    try {
      const availabilityRef = doc(db, this.collectionName, barberId);
      const availabilitySnap = await getDoc(availabilityRef);
      
      if (availabilitySnap.exists()) {
        return {
          success: true,
          schedule: availabilitySnap.data().weeklySchedule
        };
      } else {
        // Return default schedule if none exists
        return {
          success: true,
          schedule: this.getDefaultSchedule()
        };
      }
    } catch (error) {
      console.error('Error getting weekly schedule:', error);
      return {
        success: false,
        error: error.message,
        schedule: this.getDefaultSchedule()
      };
    }
  }

  // Set specific day availability
  async setDayAvailability(barberId, day, availability) {
    try {
      const availabilityRef = doc(db, this.collectionName, barberId);
      const availabilitySnap = await getDoc(availabilityRef);
      
      let currentSchedule = this.getDefaultSchedule();
      
      if (availabilitySnap.exists()) {
        currentSchedule = availabilitySnap.data().weeklySchedule;
      }
      
      // Update the specific day
      currentSchedule[day] = availability;
      
      await setDoc(availabilityRef, {
        barberId,
        weeklySchedule: currentSchedule,
        updatedAt: serverTimestamp()
      });

      return {
        success: true,
        message: `${day} availability updated successfully`
      };
    } catch (error) {
      console.error('Error setting day availability:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Check if a specific time slot is available
  async checkTimeSlotAvailability(barberId, date, time) {
    try {
      // Get the day of week
      const dayOfWeek = this.getDayOfWeek(date);
      
      // Get barber's schedule
      const scheduleResult = await this.getWeeklySchedule(barberId);
      if (!scheduleResult.success) {
        return {
          success: false,
          error: scheduleResult.error,
          isAvailable: false
        };
      }
      
      const schedule = scheduleResult.schedule;
      const daySchedule = schedule[dayOfWeek];
      
      // Check if the day is available
      if (!daySchedule.isAvailable) {
        return {
          success: true,
          isAvailable: false,
          reason: 'Barber is not available on this day'
        };
      }
      
      // Check if the time is within any of the available time blocks
      const timeInMinutes = this.timeToMinutes(time);
      const isWithinWorkingHours = daySchedule.timeBlocks.some(block => {
        const startTimeInMinutes = this.timeToMinutes(block.startTime);
        const endTimeInMinutes = this.timeToMinutes(block.endTime);
        return timeInMinutes >= startTimeInMinutes && timeInMinutes < endTimeInMinutes;
      });
      
      if (!isWithinWorkingHours) {
        return {
          success: true,
          isAvailable: false,
          reason: 'Time is outside barber\'s working hours'
        };
      }
      
      // Check if the time slot conflicts with existing appointments
      const appointmentService = require('./appointmentService').default;
      const appointmentsResult = await appointmentService.getAppointmentsByDateRange(
        barberId, 
        date, 
        date
      );
      
      if (appointmentsResult.success) {
        const conflictingAppointments = appointmentsResult.appointments.filter(apt => {
          return apt.status === 'pending' || apt.status === 'confirmed';
        });
        
        // Check for time conflicts
        const hasConflict = conflictingAppointments.some(apt => {
          const aptTimeInMinutes = this.timeToMinutes(apt.time);
          const slotDuration = daySchedule.slotDuration || 60; // Default 60 minutes
          
          // Check if the requested time overlaps with existing appointment
          return Math.abs(aptTimeInMinutes - timeInMinutes) < slotDuration;
        });
        
        if (hasConflict) {
          return {
            success: true,
            isAvailable: false,
            reason: 'Time slot conflicts with existing appointment'
          };
        }
      }
      
      return {
        success: true,
        isAvailable: true
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

  // Get available time slots for a specific date
  async getAvailableTimeSlots(barberId, date) {
    try {
      const dayOfWeek = this.getDayOfWeek(date);
      const scheduleResult = await this.getWeeklySchedule(barberId);
      
      if (!scheduleResult.success) {
        return {
          success: false,
          error: scheduleResult.error,
          timeSlots: []
        };
      }
      
      const schedule = scheduleResult.schedule;
      const daySchedule = schedule[dayOfWeek];
      
      if (!daySchedule.isAvailable) {
        return {
          success: true,
          timeSlots: [],
          message: 'Barber is not available on this day'
        };
      }
      
      // Generate time slots from all time blocks
      let allTimeSlots = [];
      daySchedule.timeBlocks.forEach(block => {
        const blockSlots = this.generateTimeSlots(
          block.startTime,
          block.endTime,
          daySchedule.slotDuration || 60
        );
        allTimeSlots = [...allTimeSlots, ...blockSlots];
      });
      
      // Remove duplicates and sort
      allTimeSlots = [...new Set(allTimeSlots)].sort((a, b) => 
        this.timeToMinutes(a) - this.timeToMinutes(b)
      );
      
      // Filter out unavailable slots
      const appointmentService = require('./appointmentService').default;
      const appointmentsResult = await appointmentService.getAppointmentsByDateRange(
        barberId, 
        date, 
        date
      );
      
      let availableSlots = allTimeSlots;
      
      if (appointmentsResult.success) {
        const bookedTimes = appointmentsResult.appointments
          .filter(apt => apt.status === 'pending' || apt.status === 'confirmed')
          .map(apt => apt.time);
        
        availableSlots = allTimeSlots.filter(slot => !bookedTimes.includes(slot));
      }
      
      return {
        success: true,
        timeSlots: availableSlots
      };
    } catch (error) {
      console.error('Error getting available time slots:', error);
      return {
        success: false,
        error: error.message,
        timeSlots: []
      };
    }
  }

  // Helper methods
  getDefaultSchedule() {
    return {
      monday: {
        isAvailable: true,
        timeBlocks: [
          {
            startTime: '09:00 AM',
            endTime: '05:00 PM'
          }
        ],
        slotDuration: 60
      },
      tuesday: {
        isAvailable: true,
        timeBlocks: [
          {
            startTime: '09:00 AM',
            endTime: '05:00 PM'
          }
        ],
        slotDuration: 60
      },
      wednesday: {
        isAvailable: true,
        timeBlocks: [
          {
            startTime: '09:00 AM',
            endTime: '05:00 PM'
          }
        ],
        slotDuration: 60
      },
      thursday: {
        isAvailable: true,
        timeBlocks: [
          {
            startTime: '09:00 AM',
            endTime: '05:00 PM'
          }
        ],
        slotDuration: 60
      },
      friday: {
        isAvailable: true,
        timeBlocks: [
          {
            startTime: '09:00 AM',
            endTime: '05:00 PM'
          }
        ],
        slotDuration: 60
      },
      saturday: {
        isAvailable: true,
        timeBlocks: [
          {
            startTime: '10:00 AM',
            endTime: '04:00 PM'
          }
        ],
        slotDuration: 60
      },
      sunday: {
        isAvailable: false,
        timeBlocks: [
          {
            startTime: '09:00 AM',
            endTime: '05:00 PM'
          }
        ],
        slotDuration: 60
      }
    };
  }

  getDayOfWeek(dateString) {
    const date = new Date(dateString);
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[date.getDay()];
  }

  timeToMinutes(timeString) {
    const [time, period] = timeString.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    
    let totalMinutes = hours * 60 + minutes;
    
    if (period === 'PM' && hours !== 12) {
      totalMinutes += 12 * 60;
    } else if (period === 'AM' && hours === 12) {
      totalMinutes = minutes;
    }
    
    return totalMinutes;
  }

  minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    
    return `${displayHours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${period}`;
  }

  generateTimeSlots(startTime, endTime, slotDuration) {
    const slots = [];
    let currentTime = this.timeToMinutes(startTime);
    const endTimeMinutes = this.timeToMinutes(endTime);
    
    while (currentTime < endTimeMinutes) {
      slots.push(this.minutesToTime(currentTime));
      currentTime += slotDuration;
    }
    
    return slots;
  }

  // Get barber's working hours for display
  async getBarberWorkingHours(barberId) {
    try {
      const scheduleResult = await this.getWeeklySchedule(barberId);
      
      if (!scheduleResult.success) {
        return {
          success: false,
          error: scheduleResult.error,
          workingHours: {}
        };
      }
      
      const workingHours = {};
      Object.keys(scheduleResult.schedule).forEach(day => {
        const daySchedule = scheduleResult.schedule[day];
        workingHours[day] = {
          isAvailable: daySchedule.isAvailable,
          hours: daySchedule.isAvailable 
            ? daySchedule.timeBlocks.map(block => 
                `${block.startTime} - ${block.endTime}`
              ).join(', ')
            : 'Closed'
        };
      });
      
      return {
        success: true,
        workingHours
      };
    } catch (error) {
      console.error('Error getting working hours:', error);
      return {
        success: false,
        error: error.message,
        workingHours: {}
      };
    }
  }

  // Helper method to validate time format
  isValidTimeFormat(timeString) {
    const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;
    return timeRegex.test(timeString);
  }

  // Helper method to check if time blocks overlap
  checkTimeBlockOverlap(timeBlocks) {
    for (let i = 0; i < timeBlocks.length; i++) {
      for (let j = i + 1; j < timeBlocks.length; j++) {
        const block1 = timeBlocks[i];
        const block2 = timeBlocks[j];
        
        const start1 = this.timeToMinutes(block1.startTime);
        const end1 = this.timeToMinutes(block1.endTime);
        const start2 = this.timeToMinutes(block2.startTime);
        const end2 = this.timeToMinutes(block2.endTime);
        
        // Check for overlap
        if (start1 < end2 && start2 < end1) {
          return true; // Overlap found
        }
      }
    }
    return false; // No overlap
  }

  // Helper method to sort time blocks
  sortTimeBlocks(timeBlocks) {
    return timeBlocks.sort((a, b) => 
      this.timeToMinutes(a.startTime) - this.timeToMinutes(b.startTime)
    );
  }
}

export default new AvailabilityService();
