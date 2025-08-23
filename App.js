import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Alert,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

// Import theme provider
import { ThemeProvider, useTheme } from './src/theme';

// Import all components
import {
  WelcomeScreen,
  RoleSelectionScreen,
  LoginScreen,
  UserProfile,
  ServicesScreen,
  BarberDashboard,
  ClientDashboard,
} from './src/components';

// Import SearchBarbersScreen separately since it's in screens folder
import SearchBarbersScreen from './src/screens/SearchBarbersScreen';
import ClientRegisterScreen from './src/screens/ClientRegisterScreen';
import BarberRegisterScreen from './src/screens/BarberRegisterScreen';
import VerificationPendingScreen from './src/screens/VerificationPendingScreen';
import AppointmentManagementScreen from './src/screens/AppointmentManagementScreen';
import CalendarViewScreen from './src/screens/CalendarViewScreen';
import BookAppointmentScreen from './src/screens/BookAppointmentScreen';
import NotificationSettings from './src/components/barber/NotificationSettings';
import SetAvailabilityScreen from './src/screens/SetAvailabilityScreen';

const AppContent = () => {
  const { colors, isDarkMode } = useTheme();
  
  // Initialize notification service with error handling
  React.useEffect(() => {
    try {
      // Try the safe service first (guaranteed to work)
      require('./src/services/safeNotificationService');
      console.log('Safe notification service initialized successfully');
    } catch (error) {
      console.log('Safe notification service failed:', error);
      try {
        // Fallback to full service
        require('./src/services/notificationService');
        console.log('Full notification service initialized successfully');
      } catch (fullError) {
        console.log('Full notification service failed:', fullError);
        try {
          // Final fallback to simple service
          require('./src/services/simpleNotificationService');
          console.log('Simple notification service initialized successfully');
        } catch (simpleError) {
          console.log('All notification services failed to initialize:', simpleError);
        }
      }
    }
  }, []);
  
  // Navigation state
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [userRole, setUserRole] = useState(null); // 'barber' or 'client'
  
  // User state
  const [currentUser, setCurrentUser] = useState(null);
  
  // Loading states
  const [barberLoginLoading, setBarberLoginLoading] = useState(false);
  const [clientLoginLoading, setClientLoginLoading] = useState(false);
  
  // Barber appointment management state
  const [availableSlots, setAvailableSlots] = useState([
    { id: 1, day: 'Monday', time: '09:00 AM - 05:00 PM', isAvailable: true },
    { id: 2, day: 'Tuesday', time: '09:00 AM - 05:00 PM', isAvailable: true },
    { id: 3, day: 'Wednesday', time: '09:00 AM - 05:00 PM', isAvailable: true },
    { id: 4, day: 'Thursday', time: '09:00 AM - 05:00 PM', isAvailable: true },
    { id: 5, day: 'Friday', time: '09:00 AM - 05:00 PM', isAvailable: true },
    { id: 6, day: 'Saturday', time: '10:00 AM - 04:00 PM', isAvailable: true },
    { id: 7, day: 'Sunday', time: 'Closed', isAvailable: false },
  ]);

  // Current screen state for barber navigation
  const [barberCurrentScreen, setBarberCurrentScreen] = useState('dashboard');

  const [appointments, setAppointments] = useState([]);
  const [clientAppointments, setClientAppointments] = useState([]);

  const [clients, setClients] = useState([
    {
      id: 1,
      name: 'John Smith',
      phone: '+1234567890',
      email: 'john@email.com',
      totalAppointments: 15,
      lastVisit: '2024-01-10',
      totalSpent: '$450'
    },
    {
      id: 2,
      name: 'Mike Johnson',
      phone: '+1234567891',
      email: 'mike@email.com',
      totalAppointments: 8,
      lastVisit: '2024-01-08',
      totalSpent: '$280'
    },
    {
      id: 3,
      name: 'David Wilson',
      phone: '+1234567892',
      email: 'david@email.com',
      totalAppointments: 12,
      lastVisit: '2024-01-12',
      totalSpent: '$380'
    }
  ]);

  // Registration form states
  const [barberFormData, setBarberFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    city: '',
    businessName: '',
    experience: '',
    specialties: '',
  });

  const [clientFormData, setClientFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    city: '',
  });

  const [barberLoading, setBarberLoading] = useState(false);
  const [clientLoading, setClientLoading] = useState(false);

  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  
  // Booking states
  const [selectedBarber, setSelectedBarber] = useState(null);

  // Navigation handlers
  const handleGetStarted = () => {
    setCurrentScreen('role-selection');
  };

  const handleViewServices = () => {
    setCurrentScreen('services');
  };

  const handleSelectRole = (role) => {
    setUserRole(role);
    setCurrentScreen(role === 'barber' ? 'barber-login' : 'client-login');
  };

  const handleBackToWelcome = () => {
    setCurrentScreen('welcome');
  };

  const handleBackToRoleSelection = () => {
    setCurrentScreen('role-selection');
  };

  const handleBackToDashboard = () => {
    setCurrentScreen(userRole === 'barber' ? 'barber-dashboard' : 'client-dashboard');
  };

  // Authentication handlers
  const handleBarberLogin = async (email, password) => {
    setBarberLoginLoading(true);
    try {
      const { auth, db } = require('./src/config/firebase');
      const { signInWithEmailAndPassword } = require('firebase/auth');
      const { doc, getDoc } = require('firebase/firestore');
      const appointmentService = require('./src/services/appointmentService').default;

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'barbers', userCredential.user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // Check verification status
        if (userData.isVerified === false) {
          setCurrentUser({ ...userData, uid: userCredential.user.uid });
          setUserRole('barber');
          setCurrentScreen('verification-pending');
        } else {
          setCurrentUser({ ...userData, uid: userCredential.user.uid });
          setUserRole('barber');
          setCurrentScreen('barber-dashboard');
          
          // Load barber's appointments
          const appointmentsResult = await appointmentService.getBarberAppointments(userCredential.user.uid);
          if (appointmentsResult.success) {
            setAppointments(appointmentsResult.appointments);
          }
        }
      } else {
        Alert.alert('Error', 'Barber account not found');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setBarberLoginLoading(false);
    }
  };

  const handleClientLogin = async (email, password) => {
    setClientLoginLoading(true);
    try {
      const { auth, db } = require('./src/config/firebase');
      const { signInWithEmailAndPassword } = require('firebase/auth');
      const { doc, getDoc } = require('firebase/firestore');
      const appointmentService = require('./src/services/appointmentService').default;

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'clients', userCredential.user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setCurrentUser({ ...userData, uid: userCredential.user.uid });
        setUserRole('client');
        setCurrentScreen('client-dashboard');
        
        // Load client's appointments
        const appointmentsResult = await appointmentService.getClientAppointments(userCredential.user.uid);
        if (appointmentsResult.success) {
          setClientAppointments(appointmentsResult.appointments);
        }
      } else {
        Alert.alert('Error', 'Client account not found');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setClientLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { auth } = require('./src/config/firebase');
      const { signOut } = require('firebase/auth');
      await signOut(auth);
      setCurrentUser(null);
      setUserRole(null);
      setCurrentScreen('welcome');
    } catch (error) {
      Alert.alert('Error', 'Failed to logout');
    }
  };

  const handleBackToWelcomeFromVerification = () => {
    setCurrentUser(null);
    setUserRole(null);
    setCurrentScreen('welcome');
  };

  // Appointment management handlers
  const handleBackToBarberDashboard = () => {
    setBarberCurrentScreen('dashboard');
  };

  const handleUpdateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      const appointmentService = require('./src/services/appointmentService').default;
      const result = await appointmentService.updateAppointmentStatus(appointmentId, newStatus);
      
      if (result.success) {
        // Update local state
        setAppointments(prevAppointments => 
          prevAppointments.map(appointment => 
            appointment.id === appointmentId 
              ? { ...appointment, status: newStatus }
              : appointment
          )
        );
      } else {
        Alert.alert('Error', result.error || 'Failed to update appointment status');
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
      Alert.alert('Error', 'Failed to update appointment status');
    }
  };

  // Add sample appointments for testing
  const handleAddSampleAppointments = async () => {
    if (!currentUser) {
      Alert.alert('Error', 'No barber logged in');
      return;
    }

    try {
      const appointmentService = require('./src/services/appointmentService').default;
      const result = await appointmentService.addSampleAppointments(currentUser.uid);
      
      if (result.success) {
        // Reload appointments
        const appointmentsResult = await appointmentService.getBarberAppointments(currentUser.uid);
        if (appointmentsResult.success) {
          setAppointments(appointmentsResult.appointments);
        }
        Alert.alert('Success', 'Sample appointments added!');
      } else {
        Alert.alert('Error', result.error || 'Failed to add sample appointments');
      }
    } catch (error) {
      console.error('Error adding sample appointments:', error);
      Alert.alert('Error', 'Failed to add sample appointments');
    }
  };

  const handleBarberRegister = () => {
    setCurrentScreen('barber-register');
  };

  const handleClientRegister = () => {
    setCurrentScreen('client-register');
  };

  const handleClientRegisterSuccess = (user) => {
    setCurrentUser(user);
    setUserRole('client');
    setCurrentScreen('client-dashboard');
  };

  const handleBarberRegisterSuccess = (user, status) => {
    setCurrentUser(user);
    setUserRole('barber');
    
    if (status === 'pending-verification') {
      setCurrentScreen('verification-pending');
    } else {
      setCurrentScreen('barber-dashboard');
    }
  };

  // Barber dashboard handlers
  const handleSetAvailability = () => {
    setBarberCurrentScreen('set-availability');
  };

  const handleManageAppointments = () => {
    setBarberCurrentScreen('appointment-management');
  };

  const handleCalendarView = () => {
    setBarberCurrentScreen('calendar-view');
  };

  const handleManageClients = () => {
    setBarberCurrentScreen('manage-clients');
  };

  const handleViewEarnings = () => {
    setBarberCurrentScreen('view-earnings');
  };

  const handleManageServices = () => {
    setBarberCurrentScreen('manage-services');
  };

  const handleNotificationSettings = () => {
    setBarberCurrentScreen('notification-settings');
  };

  const handleProfile = () => {
    setCurrentScreen('user-profile');
  };

  // Client dashboard handlers
  const handleSearchBarbers = () => {
    setCurrentScreen('search-barbers');
  };

  const handleViewBookings = () => {
    setCurrentScreen('client-bookings');
  };

  // Booking handlers
  const handleBookAppointment = (barber) => {
    console.log('Setting selected barber:', barber);
    if (!barber) {
      Alert.alert('Error', 'No barber selected');
      return;
    }
    setSelectedBarber(barber);
    setCurrentScreen('book-appointment');
  };

  const handleBookingSuccess = async () => {
    // Refresh client appointments
    if (currentUser && userRole === 'client') {
      try {
        const appointmentService = require('./src/services/appointmentService').default;
        const appointmentsResult = await appointmentService.getClientAppointments(currentUser.uid);
        if (appointmentsResult.success) {
          setClientAppointments(appointmentsResult.appointments);
        }
      } catch (error) {
        console.error('Error refreshing appointments:', error);
      }
    }
    Alert.alert('Success', 'Your booking request has been sent!');
  };

  const handleBackFromBooking = () => {
    setSelectedBarber(null);
    setCurrentScreen('search-barbers');
  };

  // Render screen based on current state
  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return (
          <WelcomeScreen 
            onGetStarted={handleGetStarted}
            onViewServices={handleViewServices}
          />
        );

      case 'role-selection':
        return (
          <RoleSelectionScreen 
            onSelectRole={handleSelectRole}
            onBack={handleBackToWelcome}
          />
        );

      case 'barber-login':
        return (
          <LoginScreen 
            userType="barber"
            onLogin={handleBarberLogin}
            onRegister={handleBarberRegister}
            onBack={handleBackToRoleSelection}
            loading={barberLoginLoading}
          />
        );

      case 'client-login':
        return (
          <LoginScreen 
            userType="client"
            onLogin={handleClientLogin}
            onRegister={handleClientRegister}
            onBack={handleBackToRoleSelection}
            loading={clientLoginLoading}
          />
        );

      case 'client-register':
        return (
          <ClientRegisterScreen 
            onBack={() => setCurrentScreen('client-login')}
            onRegisterSuccess={handleClientRegisterSuccess}
          />
        );

      case 'barber-register':
        return (
          <BarberRegisterScreen 
            onBack={() => setCurrentScreen('barber-login')}
            onRegisterSuccess={handleBarberRegisterSuccess}
          />
        );

      case 'verification-pending':
        return (
          <VerificationPendingScreen 
            onBack={handleBackToWelcomeFromVerification}
            onLogout={handleLogout}
            currentUser={currentUser}
          />
        );

      case 'barber-dashboard':
        if (barberCurrentScreen === 'appointment-management') {
          return (
            <AppointmentManagementScreen 
              appointments={appointments}
              onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
              onBack={handleBackToBarberDashboard}
            />
          );
        }
        if (barberCurrentScreen === 'calendar-view') {
          return (
            <CalendarViewScreen 
              appointments={appointments}
              onBack={handleBackToBarberDashboard}
            />
          );
        }
                 if (barberCurrentScreen === 'set-availability') {
           return (
             <SetAvailabilityScreen 
               onBack={handleBackToBarberDashboard}
               currentUser={currentUser}
             />
           );
         }
        if (barberCurrentScreen === 'manage-clients') {
          return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
              <Text style={{ color: colors.text, fontSize: 18 }}>Manage Clients Screen</Text>
              <TouchableOpacity 
                style={{ marginTop: 20, padding: 10, backgroundColor: colors.primary, borderRadius: 8 }}
                onPress={handleBackToBarberDashboard}
              >
                <Text style={{ color: colors.surface }}>Back to Dashboard</Text>
              </TouchableOpacity>
            </View>
          );
        }
        if (barberCurrentScreen === 'view-earnings') {
          return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
              <Text style={{ color: colors.text, fontSize: 18 }}>View Earnings Screen</Text>
              <TouchableOpacity 
                style={{ marginTop: 20, padding: 10, backgroundColor: colors.primary, borderRadius: 8 }}
                onPress={handleBackToBarberDashboard}
              >
                <Text style={{ color: colors.surface }}>Back to Dashboard</Text>
              </TouchableOpacity>
            </View>
          );
        }
                 if (barberCurrentScreen === 'manage-services') {
           return (
             <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
               <Text style={{ color: colors.text, fontSize: 18 }}>Manage Services Screen</Text>
               <TouchableOpacity 
                 style={{ marginTop: 20, padding: 10, backgroundColor: colors.primary, borderRadius: 8 }}
                 onPress={handleBackToBarberDashboard}
               >
                 <Text style={{ color: colors.surface }}>Back to Dashboard</Text>
               </TouchableOpacity>
             </View>
           );
         }
         if (barberCurrentScreen === 'notification-settings') {
           return (
             <NotificationSettings 
               onBack={handleBackToBarberDashboard}
             />
           );
         }
                 return (
           <BarberDashboard 
             appointments={appointments}
             clients={clients}
             onSetAvailability={handleSetAvailability}
             onManageAppointments={handleManageAppointments}
             onCalendarView={handleCalendarView}
             onManageClients={handleManageClients}
             onViewEarnings={handleViewEarnings}
             onManageServices={handleManageServices}
             onNotificationSettings={handleNotificationSettings}
             onProfile={handleProfile}
             onAddSampleAppointments={handleAddSampleAppointments}
           />
         );

             case 'client-dashboard':
         return (
           <ClientDashboard 
             onSearchBarbers={handleSearchBarbers}
             onProfile={handleProfile}
             onViewServices={handleViewServices}
             onViewBookings={handleViewBookings}
             appointments={clientAppointments}
           />
         );

       case 'client-bookings':
         return (
           <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
             <Text style={{ color: colors.text, fontSize: 18 }}>Client Bookings Screen</Text>
             <TouchableOpacity 
               style={{ marginTop: 20, padding: 10, backgroundColor: colors.primary, borderRadius: 8 }}
               onPress={() => setCurrentScreen('client-dashboard')}
             >
               <Text style={{ color: colors.surface }}>Back to Dashboard</Text>
             </TouchableOpacity>
           </View>
         );

      case 'user-profile':
        return (
          <UserProfile 
            currentUser={currentUser}
            userRole={userRole}
            onBack={handleBackToDashboard}
            onLogout={handleLogout}
          />
        );

      case 'services':
        return (
          <ServicesScreen 
            onBack={handleBackToWelcome}
          />
        );

             case 'search-barbers':
         return (
           <SearchBarbersScreen 
             onBack={handleBackToDashboard}
             searchQuery={searchQuery}
             setSearchQuery={setSearchQuery}
             searchResults={searchResults}
             searchLoading={searchLoading}
             searchPerformed={searchPerformed}
             setSearchPerformed={setSearchPerformed}
             onBookAppointment={handleBookAppointment}
             currentUser={currentUser}
           />
         );

       case 'book-appointment':
         if (!selectedBarber) {
           return (
             <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
               <Text style={{ color: colors.text, fontSize: 18 }}>No barber selected</Text>
               <TouchableOpacity 
                 style={{ marginTop: 20, padding: 10, backgroundColor: colors.primary, borderRadius: 8 }}
                 onPress={() => setCurrentScreen('search-barbers')}
               >
                 <Text style={{ color: colors.surface }}>Back to Search</Text>
               </TouchableOpacity>
             </View>
           );
         }
         return (
           <BookAppointmentScreen 
             barber={selectedBarber}
             currentUser={currentUser}
             onBack={handleBackFromBooking}
             onBookingSuccess={handleBookingSuccess}
           />
         );

      default:
        return (
          <WelcomeScreen 
            onGetStarted={handleGetStarted}
            onViewServices={handleViewServices}
          />
        );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={colors.background} 
      />
      {renderScreen()}
    </SafeAreaView>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
