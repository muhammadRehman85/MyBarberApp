import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { colors } from '../theme';

const ScreenWrapper = ({
  children,
  style,
  safeArea = true,
  statusBarStyle = 'dark-content',
  backgroundColor = colors.background,
  ...props
}) => {
  const Container = safeArea ? SafeAreaView : View;

  return (
    <>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={backgroundColor}
        translucent={Platform.OS === 'android'}
      />
      <Container
        style={[
          styles.container,
          { backgroundColor },
          style,
        ]}
        {...props}
      >
        {children}
      </Container>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ScreenWrapper;
