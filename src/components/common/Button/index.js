import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../../theme';
import { typography, spacing, shadows } from '../../../theme';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  ...props
}) => {
  const { colors } = useTheme();
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size]];
    
    switch (variant) {
      case 'primary':
        baseStyle.push([styles.primary, { backgroundColor: colors.primary }]);
        break;
      case 'secondary':
        baseStyle.push([styles.secondary, { backgroundColor: colors.secondary }]);
        break;
      case 'outline':
        baseStyle.push([styles.outline, { borderColor: colors.primary }]);
        break;
      case 'ghost':
        baseStyle.push(styles.ghost);
        break;
      default:
        baseStyle.push([styles.primary, { backgroundColor: colors.primary }]);
    }
    
    if (disabled) {
      baseStyle.push([styles.disabled, { backgroundColor: colors.border, borderColor: colors.border }]);
    }
    
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseTextStyle = [styles.text, styles[`${size}Text`]];
    
    switch (variant) {
      case 'outline':
        baseTextStyle.push([styles.outlineText, { color: colors.primary }]);
        break;
      case 'ghost':
        baseTextStyle.push([styles.ghostText, { color: colors.primary }]);
        break;
      default:
        baseTextStyle.push([styles.primaryText, { color: colors.white }]);
    }
    
    if (disabled) {
      baseTextStyle.push([styles.disabledText, { color: colors.textSecondary }]);
    }
    
    return baseTextStyle;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? colors.white : colors.primary}
        />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.component.button,
  },
  
  // Size variants
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 36,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 48,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    minHeight: 56,
  },
  
  // Variant styles
  primary: {
    // backgroundColor will be set dynamically
  },
  secondary: {
    // backgroundColor will be set dynamically
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    // borderColor will be set dynamically
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  
  // Disabled state
  disabled: {
    // backgroundColor and borderColor will be set dynamically
  },
  
  // Text styles
  text: {
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'center',
  },
  smallText: {
    fontSize: typography.fontSize.sm,
  },
  mediumText: {
    fontSize: typography.fontSize.base,
  },
  largeText: {
    fontSize: typography.fontSize.lg,
  },
  
  // Text variants
  primaryText: {
    // color will be set dynamically
  },
  secondaryText: {
    color: 'white',
  },
  outlineText: {
    // color will be set dynamically
  },
  ghostText: {
    // color will be set dynamically
  },
  disabledText: {
    // color will be set dynamically
  },
});

export default Button;
