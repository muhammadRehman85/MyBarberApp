import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Alert,
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

const AppContent = () => {
  const { colors, isDarkMode } = useTheme();
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

  const [appointments, setAppointments] = useState([
    {
      id: 1,
      clientName: 'John Smith',
      service: 'Haircut & Beard',
      date: '2024-01-15',
      time: '10:00 AM',
      status: 'confirmed',
      phone: '+1234567890',
      price: '$35'
    },
    {
      id: 2,
      clientName: 'Mike Johnson',
      service: 'Haircut',
      date: '2024-01-15',
      time: '11:30 AM',
      status: 'pending',
      phone: '+1234567891',
      price: '$25'
    },
    {
      id: 3,
      clientName: 'David Wilson',
      service: 'Beard Trim',
      date: '2024-01-15',
      time: '02:00 PM',
      status: 'confirmed',
      phone: '+1234567892',
      price: '$15'
    },
    {
      id: 4,
      clientName: 'Alex Brown',
      service: 'Haircut',
      date: '2024-01-16',
      time: '09:00 AM',
      status: 'confirmed',
      phone: '+1234567893',
      price: '$25'
    },
    {
      id: 5,
      clientName: 'Tom Davis',
      service: 'Hair & Beard',
      date: '2024-01-16',
      time: '02:30 PM',
      status: 'pending',
      phone: '+1234567894',
      price: '$35'
    }
  ]);

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

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'clients', userCredential.user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setCurrentUser({ ...userData, uid: userCredential.user.uid });
        setUserRole('client');
        setCurrentScreen('client-dashboard');
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
    setCurrentScreen('set-availability');
  };

  const handleManageAppointments = () => {
    setCurrentScreen('manage-appointments');
  };

  const handleCalendarView = () => {
    setCurrentScreen('calendar-view');
  };

  const handleManageClients = () => {
    setCurrentScreen('manage-clients');
  };

  const handleViewEarnings = () => {
    setCurrentScreen('view-earnings');
  };

  const handleManageServices = () => {
    setCurrentScreen('manage-services');
  };

  const handleProfile = () => {
    setCurrentScreen('user-profile');
  };

  // Client dashboard handlers
  const handleSearchBarbers = () => {
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
            onProfile={handleProfile}
          />
        );

      case 'client-dashboard':
        return (
          <ClientDashboard 
            onSearchBarbers={handleSearchBarbers}
            onProfile={handleProfile}
            onViewServices={handleViewServices}
          />
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
