import NetInfo from '@react-native-community/netinfo';

// Check if device is connected to internet
export const isConnected = async () => {
  try {
    const state = await NetInfo.fetch();
    return state.isConnected && state.isInternetReachable;
  } catch (error) {
    console.error('Error checking internet connection:', error);
    return false;
  }
};

// Get connection type
export const getConnectionType = async () => {
  try {
    const state = await NetInfo.fetch();
    return state.type;
  } catch (error) {
    console.error('Error getting connection type:', error);
    return 'unknown';
  }
};

// Check if connection is WiFi
export const isWifi = async () => {
  try {
    const state = await NetInfo.fetch();
    return state.type === 'wifi';
  } catch (error) {
    console.error('Error checking WiFi connection:', error);
    return false;
  }
};

// Check if connection is cellular
export const isCellular = async () => {
  try {
    const state = await NetInfo.fetch();
    return state.type === 'cellular';
  } catch (error) {
    console.error('Error checking cellular connection:', error);
    return false;
  }
};

// Listen to network state changes
export const addNetworkListener = (callback) => {
  return NetInfo.addEventListener(state => {
    callback({
      isConnected: state.isConnected,
      isInternetReachable: state.isInternetReachable,
      type: state.type,
      isWifi: state.type === 'wifi',
      isCellular: state.type === 'cellular',
    });
  });
};

// Remove network listener
export const removeNetworkListener = (unsubscribe) => {
  if (unsubscribe) {
    unsubscribe();
  }
};

// Network state object
export const getNetworkState = async () => {
  try {
    const state = await NetInfo.fetch();
    return {
      isConnected: state.isConnected,
      isInternetReachable: state.isInternetReachable,
      type: state.type,
      isWifi: state.type === 'wifi',
      isCellular: state.type === 'cellular',
      details: state.details,
    };
  } catch (error) {
    console.error('Error getting network state:', error);
    return {
      isConnected: false,
      isInternetReachable: false,
      type: 'unknown',
      isWifi: false,
      isCellular: false,
      details: null,
    };
  }
};

// Network utilities
export const networkUtils = {
  isConnected,
  getConnectionType,
  isWifi,
  isCellular,
  addNetworkListener,
  removeNetworkListener,
  getNetworkState,
};
