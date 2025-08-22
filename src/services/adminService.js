import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc,
  orderBy,
  limit 
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const adminService = {
  // Get all pending barber verifications
  async getPendingBarberVerifications() {
    try {
      const barbersRef = collection(db, 'barbers');
      const q = query(
        barbersRef,
        where('isVerified', '==', false),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const pendingBarbers = [];

      querySnapshot.forEach((doc) => {
        pendingBarbers.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return { success: true, barbers: pendingBarbers };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Verify a barber
  async verifyBarber(barberId, verificationData = {}) {
    try {
      const barberRef = doc(db, 'barbers', barberId);
      await updateDoc(barberRef, {
        isVerified: true,
        verifiedAt: new Date(),
        verifiedBy: verificationData.adminId || 'admin',
        verificationNotes: verificationData.notes || '',
        ...verificationData
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Reject a barber verification
  async rejectBarberVerification(barberId, rejectionReason) {
    try {
      const barberRef = doc(db, 'barbers', barberId);
      await updateDoc(barberRef, {
        isVerified: false,
        verificationRejected: true,
        rejectionReason: rejectionReason,
        rejectedAt: new Date()
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get all verified barbers
  async getVerifiedBarbers() {
    try {
      const barbersRef = collection(db, 'barbers');
      const q = query(
        barbersRef,
        where('isVerified', '==', true),
        orderBy('verifiedAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const verifiedBarbers = [];

      querySnapshot.forEach((doc) => {
        verifiedBarbers.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return { success: true, barbers: verifiedBarbers };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get barber verification statistics
  async getBarberVerificationStats() {
    try {
      const barbersRef = collection(db, 'barbers');
      
      // Get pending verifications
      const pendingQuery = query(
        barbersRef,
        where('isVerified', '==', false)
      );
      const pendingSnapshot = await getDocs(pendingQuery);
      const pendingCount = pendingSnapshot.size;

      // Get verified barbers
      const verifiedQuery = query(
        barbersRef,
        where('isVerified', '==', true)
      );
      const verifiedSnapshot = await getDocs(verifiedQuery);
      const verifiedCount = verifiedSnapshot.size;

      // Get rejected verifications
      const rejectedQuery = query(
        barbersRef,
        where('verificationRejected', '==', true)
      );
      const rejectedSnapshot = await getDocs(rejectedQuery);
      const rejectedCount = rejectedSnapshot.size;

      return {
        success: true,
        stats: {
          pending: pendingCount,
          verified: verifiedCount,
          rejected: rejectedCount,
          total: pendingCount + verifiedCount + rejectedCount
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get all users (for admin dashboard)
  async getAllUsers(limitCount = 50) {
    try {
      // Get barbers
      const barbersRef = collection(db, 'barbers');
      const barbersQuery = query(
        barbersRef,
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      const barbersSnapshot = await getDocs(barbersQuery);
      const barbers = [];
      barbersSnapshot.forEach((doc) => {
        barbers.push({
          id: doc.id,
          ...doc.data(),
          type: 'barber'
        });
      });

      // Get clients
      const clientsRef = collection(db, 'clients');
      const clientsQuery = query(
        clientsRef,
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      const clientsSnapshot = await getDocs(clientsQuery);
      const clients = [];
      clientsSnapshot.forEach((doc) => {
        clients.push({
          id: doc.id,
          ...doc.data(),
          type: 'client'
        });
      });

      // Combine and sort by creation date
      const allUsers = [...barbers, ...clients].sort((a, b) => 
        b.createdAt?.toDate() - a.createdAt?.toDate()
      );

      return { success: true, users: allUsers.slice(0, limitCount) };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};
