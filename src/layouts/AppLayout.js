import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { colors, spacing } from '../theme';
import ScreenWrapper from './ScreenWrapper';

const AppLayout = ({
  children,
  style,
  scrollable = true,
  padding = true,
  ...props
}) => {
  const Container = scrollable ? ScrollView : View;

  const content = (
    <View style={[
      styles.content,
      padding && styles.padded,
      style,
    ]} {...props}>
      {children}
    </View>
  );

  if (scrollable) {
    return (
      <ScreenWrapper backgroundColor={colors.background}>
        <Container
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {content}
        </Container>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper backgroundColor={colors.background}>
      {content}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
  },
  padded: {
    padding: spacing.layout.screen.padding,
  },
});

export default AppLayout;
