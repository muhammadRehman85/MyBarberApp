import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../theme';
import Button from './Button';
import Input from './Input';

const ThemeDemoScreen = ({ navigation }) => {
  const { colors, isDarkMode, toggleTheme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={[styles.backButton, { color: colors.primary }]}>‹ Back</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Theme Demo</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Current Theme</Text>
          <View style={[styles.themeCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.themeText, { color: colors.text }]}>
              {isDarkMode ? '🌙 Dark Theme' : '☀️ Light Theme'}
            </Text>
            <Button 
              title={isDarkMode ? 'Switch to Light' : 'Switch to Dark'} 
              onPress={toggleTheme}
              variant="outline"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Color Palette</Text>
          <View style={[styles.colorGrid, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.colorItem, { backgroundColor: colors.primary }]}>
              <Text style={styles.colorLabel}>Primary</Text>
            </View>
            <View style={[styles.colorItem, { backgroundColor: colors.secondary }]}>
              <Text style={styles.colorLabel}>Secondary</Text>
            </View>
            <View style={[styles.colorItem, { backgroundColor: colors.success }]}>
              <Text style={styles.colorLabel}>Success</Text>
            </View>
            <View style={[styles.colorItem, { backgroundColor: colors.warning }]}>
              <Text style={styles.colorLabel}>Warning</Text>
            </View>
            <View style={[styles.colorItem, { backgroundColor: colors.error }]}>
              <Text style={styles.colorLabel}>Error</Text>
            </View>
            <View style={[styles.colorItem, { backgroundColor: colors.info }]}>
              <Text style={styles.colorLabel}>Info</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Components</Text>
          <View style={[styles.componentCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Input
              label="Sample Input"
              placeholder="Type something here..."
              value=""
              onChangeText={() => {}}
            />
            <View style={styles.buttonRow}>
              <Button title="Primary" variant="primary" onPress={() => {}} />
              <Button title="Secondary" variant="secondary" onPress={() => {}} />
            </View>
            <View style={styles.buttonRow}>
              <Button title="Outline" variant="outline" onPress={() => {}} />
              <Button title="Ghost" variant="ghost" onPress={() => {}} />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Text Styles</Text>
          <View style={[styles.textCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.textPrimary, { color: colors.text }]}>
              Primary Text - Main content and headings
            </Text>
            <Text style={[styles.textSecondary, { color: colors.textSecondary }]}>
              Secondary Text - Supporting content and descriptions
            </Text>
            <Text style={[styles.textTertiary, { color: colors.textTertiary }]}>
              Tertiary Text - Placeholder and less important content
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  backButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 50,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  themeCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  themeText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  colorGrid: {
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  colorItem: {
    width: '30%',
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  colorLabel: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  componentCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  textCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  textPrimary: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  textSecondary: {
    fontSize: 14,
    marginBottom: 10,
  },
  textTertiary: {
    fontSize: 12,
  },
});

export default ThemeDemoScreen;
