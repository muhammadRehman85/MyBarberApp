# MyBarber App - Component Structure

## Overview
The MyBarber app has been reorganized into a clean, modular component structure for better maintainability and code organization.

## Directory Structure

```
src/
├── components/
│   ├── common/           # Shared components used across the app
│   │   ├── WelcomeScreen.js
│   │   ├── RoleSelectionScreen.js
│   │   ├── UserProfile.js
│   │   └── ServicesScreen.js
│   ├── auth/             # Authentication related components
│   │   └── LoginScreen.js
│   ├── barber/           # Barber-specific components
│   │   └── BarberDashboard.js
│   ├── client/           # Client-specific components
│   │   └── ClientDashboard.js
│   └── index.js          # Export all components
├── config/               # Configuration files
│   └── firebase.js
├── screens/              # Screen components (existing)
│   ├── BarberRegisterScreen.js
│   ├── ClientRegisterScreen.js
│   └── SearchBarbersScreen.js
└── ...
```

## Component Descriptions

### Common Components (`src/components/common/`)

#### WelcomeScreen
- **Purpose**: Initial welcome screen of the app
- **Props**: 
  - `onGetStarted`: Function to navigate to role selection
  - `onViewServices`: Function to view services

#### RoleSelectionScreen
- **Purpose**: Allows users to choose between barber and client roles
- **Props**:
  - `onSelectRole`: Function to handle role selection
  - `onBack`: Function to go back to welcome screen

#### UserProfile
- **Purpose**: Displays user information and logout functionality
- **Props**:
  - `currentUser`: Current user data
  - `userRole`: User role ('barber' or 'client')
  - `onBack`: Function to go back to dashboard
  - `onLogout`: Function to handle logout

#### ServicesScreen
- **Purpose**: Displays available barber services
- **Props**:
  - `onBack`: Function to go back to previous screen

### Authentication Components (`src/components/auth/`)

#### LoginScreen
- **Purpose**: Reusable login screen for both barbers and clients
- **Props**:
  - `userType`: 'barber' or 'client'
  - `onLogin`: Function to handle login
  - `onRegister`: Function to navigate to registration
  - `onBack`: Function to go back
  - `loading`: Loading state

### Barber Components (`src/components/barber/`)

#### BarberDashboard
- **Purpose**: Main dashboard for barbers with all management features
- **Props**:
  - `appointments`: Array of appointments
  - `clients`: Array of clients
  - `onSetAvailability`: Function to set availability
  - `onManageAppointments`: Function to manage appointments
  - `onCalendarView`: Function to view calendar
  - `onManageClients`: Function to manage clients
  - `onViewEarnings`: Function to view earnings
  - `onManageServices`: Function to manage services
  - `onProfile`: Function to view profile

### Client Components (`src/components/client/`)

#### ClientDashboard
- **Purpose**: Main dashboard for clients with search and booking features
- **Props**:
  - `onSearchBarbers`: Function to search for barbers
  - `onProfile`: Function to view profile
  - `onViewServices`: Function to view services

## Main App.js Structure

The main `App.js` file has been significantly simplified and now:

1. **Imports components** from the organized structure
2. **Manages state** for navigation, user data, and app data
3. **Handles navigation** through a clean `renderScreen()` function
4. **Provides handlers** for all component interactions
5. **Reduced from 2700+ lines to ~385 lines**

## Benefits of This Structure

1. **Modularity**: Each component has a single responsibility
2. **Reusability**: Components can be easily reused across different screens
3. **Maintainability**: Easier to find and modify specific functionality
4. **Scalability**: Easy to add new components and features
5. **Testing**: Components can be tested in isolation
6. **Code Organization**: Clear separation of concerns

## Usage Example

```javascript
import { BarberDashboard, ClientDashboard } from './src/components';

// Use components with props
<BarberDashboard 
  appointments={appointments}
  clients={clients}
  onSetAvailability={handleSetAvailability}
  // ... other props
/>
```

## Next Steps

To complete the reorganization, you may want to:

1. Move the remaining screen components (BarberRegisterScreen, ClientRegisterScreen, SearchBarbersScreen) to the appropriate directories
2. Create additional components for barber management features (SetAvailability, ManageAppointments, etc.)
3. Add proper TypeScript types for better type safety
4. Implement proper error boundaries and loading states
5. Add unit tests for each component

