import React from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { colors, spacing } from '../theme';
import ScreenWrapper from './ScreenWrapper';

const AuthLayout = ({
  children,
  style,
  scrollable = true,
  keyboardAvoiding = true,
  ...props
}) => {
  const Container = scrollable ? ScrollView : View;

  const content = (
    <View style={[styles.content, style]} {...props}>
      {children}
    </View>
  );

  if (keyboardAvoiding) {
    return (
      <ScreenWrapper backgroundColor={colors.background}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <Container
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {content}
          </Container>
        </KeyboardAvoidingView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper backgroundColor={colors.background}>
      <Container
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {content}
      </Container>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: spacing.layout.screen.padding,
    justifyContent: 'center',
  },
});

export default AuthLayout;
