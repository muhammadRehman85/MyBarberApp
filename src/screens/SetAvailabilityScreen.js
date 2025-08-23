import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
  TextInput,
  Modal,
} from 'react-native';
import { useTheme } from '../theme';

const SetAvailabilityScreen = ({ onBack, currentUser }) => {
  const { colors } = useTheme();
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [editingDay, setEditingDay] = useState(null);
  const [editingBlockIndex, setEditingBlockIndex] = useState(null);
  const [manualStartTime, setManualStartTime] = useState('');
  const [manualEndTime, setManualEndTime] = useState('');

  const days = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' },
  ];

  const timeSlots = [
    '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
    '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM',
    '08:00 PM', '08:30 PM', '09:00 PM'
  ];

  const slotDurations = [
    { value: 30, label: '30 minutes' },
    { value: 45, label: '45 minutes' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1.5 hours' },
    { value: 120, label: '2 hours' },
  ];

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    try {
      const availabilityService = require('../services/availabilityService').default;
      const result = await availabilityService.getWeeklySchedule(currentUser.uid);
      
      if (result.success) {
        setSchedule(result.schedule);
      } else {
        Alert.alert('Error', 'Failed to load schedule');
      }
    } catch (error) {
      console.error('Error loading schedule:', error);
      Alert.alert('Error', 'Failed to load schedule');
    } finally {
      setLoading(false);
    }
  };

  const updateDaySchedule = (day, field, value) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const addTimeBlock = (day) => {
    const daySchedule = schedule[day] || { isAvailable: true, timeBlocks: [], slotDuration: 60 };
    const newBlock = {
      startTime: '09:00 AM',
      endTime: '10:00 AM'
    };
    
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...daySchedule,
        timeBlocks: [...(daySchedule.timeBlocks || []), newBlock]
      }
    }));
  };

  const removeTimeBlock = (day, blockIndex) => {
    const daySchedule = schedule[day];
    const newTimeBlocks = daySchedule.timeBlocks.filter((_, index) => index !== blockIndex);
    
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...daySchedule,
        timeBlocks: newTimeBlocks
      }
    }));
  };

  const updateTimeBlock = (day, blockIndex, field, value) => {
    const daySchedule = schedule[day];
    const newTimeBlocks = [...daySchedule.timeBlocks];
    newTimeBlocks[blockIndex] = {
      ...newTimeBlocks[blockIndex],
      [field]: value
    };
    
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...daySchedule,
        timeBlocks: newTimeBlocks
      }
    }));
  };

  const openTimeModal = (day, blockIndex = null) => {
    setEditingDay(day);
    setEditingBlockIndex(blockIndex);
    
    if (blockIndex !== null) {
      const block = schedule[day].timeBlocks[blockIndex];
      setManualStartTime(block.startTime);
      setManualEndTime(block.endTime);
    } else {
      setManualStartTime('09:00 AM');
      setManualEndTime('10:00 AM');
    }
    
    setShowTimeModal(true);
  };

  const saveManualTime = () => {
    const availabilityService = require('../services/availabilityService').default;
    
    // Validate time format
    if (!availabilityService.isValidTimeFormat(manualStartTime) || 
        !availabilityService.isValidTimeFormat(manualEndTime)) {
      Alert.alert('Invalid Time Format', 'Please use format: HH:MM AM/PM (e.g., 09:00 AM)');
      return;
    }
    
    // Validate that end time is after start time
    const startMinutes = availabilityService.timeToMinutes(manualStartTime);
    const endMinutes = availabilityService.timeToMinutes(manualEndTime);
    
    if (endMinutes <= startMinutes) {
      Alert.alert('Invalid Time Range', 'End time must be after start time');
      return;
    }
    
    if (editingBlockIndex !== null) {
      // Update existing block
      updateTimeBlock(editingDay, editingBlockIndex, 'startTime', manualStartTime);
      updateTimeBlock(editingDay, editingBlockIndex, 'endTime', manualEndTime);
    } else {
      // Add new block
      const daySchedule = schedule[editingDay] || { isAvailable: true, timeBlocks: [], slotDuration: 60 };
      const newBlock = {
        startTime: manualStartTime,
        endTime: manualEndTime
      };
      
      setSchedule(prev => ({
        ...prev,
        [editingDay]: {
          ...daySchedule,
          timeBlocks: [...(daySchedule.timeBlocks || []), newBlock]
        }
      }));
    }
    
    setShowTimeModal(false);
  };

  const saveSchedule = async () => {
    if (!currentUser) {
      Alert.alert('Error', 'No barber logged in');
      return;
    }

    // Validate schedule before saving
    const availabilityService = require('../services/availabilityService').default;
    
    for (const day of days) {
      const daySchedule = schedule[day.key];
      if (daySchedule && daySchedule.isAvailable && daySchedule.timeBlocks) {
        // Check for overlaps
        if (availabilityService.checkTimeBlockOverlap(daySchedule.timeBlocks)) {
          Alert.alert('Time Overlap', `There are overlapping time blocks on ${day.label}. Please fix this before saving.`);
          return;
        }
        
        // Sort time blocks
        const sortedBlocks = availabilityService.sortTimeBlocks(daySchedule.timeBlocks);
        setSchedule(prev => ({
          ...prev,
          [day.key]: {
            ...daySchedule,
            timeBlocks: sortedBlocks
          }
        }));
      }
    }

    setSaving(true);
    try {
      const availabilityService = require('../services/availabilityService').default;
      const result = await availabilityService.setWeeklySchedule(currentUser.uid, schedule);
      
      if (result.success) {
        Alert.alert('Success', 'Schedule saved successfully!');
      } else {
        Alert.alert('Error', result.error || 'Failed to save schedule');
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
      Alert.alert('Error', 'Failed to save schedule');
    } finally {
      setSaving(false);
    }
  };

  const renderTimeBlock = (day, block, blockIndex) => {
    return (
      <View key={blockIndex} style={[styles.timeBlock, { backgroundColor: colors.background, borderColor: colors.border }]}>
        <View style={styles.timeBlockHeader}>
          <Text style={[styles.timeBlockTitle, { color: colors.text }]}>
            Block {blockIndex + 1}
          </Text>
          <TouchableOpacity
            onPress={() => removeTimeBlock(day, blockIndex)}
            style={[styles.removeButton, { backgroundColor: colors.error }]}
          >
            <Text style={[styles.removeButtonText, { color: colors.surface }]}>×</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.timeBlockContent}>
          <TouchableOpacity
            style={[styles.timeDisplay, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => openTimeModal(day, blockIndex)}
          >
            <Text style={[styles.timeDisplayText, { color: colors.text }]}>
              {block.startTime} - {block.endTime}
            </Text>
            <Text style={[styles.editHint, { color: colors.textSecondary }]}>Tap to edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderDaySchedule = (day) => {
    const daySchedule = schedule[day.key] || {
      isAvailable: false,
      timeBlocks: [],
      slotDuration: 60
    };

    return (
      <View key={day.key} style={[styles.dayCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.dayHeader}>
          <Text style={[styles.dayTitle, { color: colors.text }]}>{day.label}</Text>
          <Switch
            value={daySchedule.isAvailable}
            onValueChange={(value) => updateDaySchedule(day.key, 'isAvailable', value)}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={daySchedule.isAvailable ? colors.surface : colors.textSecondary}
          />
        </View>

        {daySchedule.isAvailable && (
          <View style={styles.dayContent}>
            {/* Time Blocks */}
            <View style={styles.timeBlocksSection}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>Working Hours:</Text>
                <TouchableOpacity
                  style={[styles.addBlockButton, { backgroundColor: colors.primary }]}
                  onPress={() => openTimeModal(day.key)}
                >
                  <Text style={[styles.addBlockButtonText, { color: colors.surface }]}>+ Add Block</Text>
                </TouchableOpacity>
              </View>
              
              {daySchedule.timeBlocks && daySchedule.timeBlocks.length > 0 ? (
                <View style={styles.timeBlocksList}>
                  {daySchedule.timeBlocks.map((block, index) => 
                    renderTimeBlock(day.key, block, index)
                  )}
                </View>
              ) : (
                <View style={[styles.emptyBlocks, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <Text style={[styles.emptyBlocksText, { color: colors.textSecondary }]}>
                    No time blocks set. Tap "Add Block" to set your working hours.
                  </Text>
                </View>
              )}
            </View>

            {/* Slot Duration */}
            <View style={styles.durationSection}>
              <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>Appointment Duration:</Text>
              <View style={styles.durationPicker}>
                {slotDurations.map((duration) => (
                  <TouchableOpacity
                    key={duration.value}
                    style={[
                      styles.durationOption,
                      {
                        backgroundColor: daySchedule.slotDuration === duration.value ? colors.primary : colors.background,
                        borderColor: colors.border
                      }
                    ]}
                    onPress={() => updateDaySchedule(day.key, 'slotDuration', duration.value)}
                  >
                    <Text style={[
                      styles.durationOptionText,
                      { color: daySchedule.slotDuration === duration.value ? colors.surface : colors.text }
                    ]}>
                      {duration.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Preview */}
            <View style={[styles.previewSection, { backgroundColor: colors.background }]}>
              <Text style={[styles.previewTitle, { color: colors.text }]}>Working Hours:</Text>
              {daySchedule.timeBlocks && daySchedule.timeBlocks.length > 0 ? (
                daySchedule.timeBlocks.map((block, index) => (
                  <Text key={index} style={[styles.previewText, { color: colors.textSecondary }]}>
                    Block {index + 1}: {block.startTime} - {block.endTime}
                  </Text>
                ))
              ) : (
                <Text style={[styles.previewText, { color: colors.textSecondary }]}>
                  No working hours set
                </Text>
              )}
              <Text style={[styles.previewText, { color: colors.textSecondary }]}>
                Duration: {slotDurations.find(d => d.value === daySchedule.slotDuration)?.label}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={[styles.backButtonText, { color: colors.primary }]}>← Back</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Set Availability</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading schedule...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={[styles.backButtonText, { color: colors.primary }]}>← Back</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Set Availability</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Info Card */}
        <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>📅 Weekly Schedule</Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            • Toggle each day on/off to set your availability{'\n'}
            • Add multiple time blocks per day{'\n'}
            • Manually enter start and end times{'\n'}
            • Choose appointment duration (30 min - 2 hours){'\n'}
            • Clients will only see available time slots{'\n'}
            • Save your schedule to update your availability
          </Text>
        </View>

        {/* Days */}
        <View style={styles.daysContainer}>
          {days.map(renderDaySchedule)}
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={saveSchedule}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color={colors.surface} />
          ) : (
            <Text style={[styles.saveButtonText, { color: colors.surface }]}>
              💾 Save Schedule
            </Text>
          )}
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.quickActionButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => {
              const defaultSchedule = require('../services/availabilityService').default.getDefaultSchedule();
              setSchedule(defaultSchedule);
            }}
          >
            <Text style={[styles.quickActionText, { color: colors.text }]}>🔄 Reset to Default</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickActionButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => {
              const weekdaysOnly = {};
              days.forEach(day => {
                weekdaysOnly[day.key] = {
                  isAvailable: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].includes(day.key),
                  timeBlocks: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].includes(day.key) 
                    ? [{ startTime: '09:00 AM', endTime: '05:00 PM' }] 
                    : [],
                  slotDuration: 60
                };
              });
              setSchedule(weekdaysOnly);
            }}
          >
            <Text style={[styles.quickActionText, { color: colors.text }]}>📅 Weekdays Only</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Manual Time Input Modal */}
      <Modal
        visible={showTimeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTimeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {editingBlockIndex !== null ? 'Edit Time Block' : 'Add Time Block'}
            </Text>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Start Time:</Text>
              <TextInput
                style={[styles.timeInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                value={manualStartTime}
                onChangeText={setManualStartTime}
                placeholder="09:00 AM"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>End Time:</Text>
              <TextInput
                style={[styles.timeInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                value={manualEndTime}
                onChangeText={setManualEndTime}
                placeholder="05:00 PM"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
            
            <Text style={[styles.modalHint, { color: colors.textSecondary }]}>
              Format: HH:MM AM/PM (e.g., 09:00 AM, 02:30 PM)
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.border }]}
                onPress={() => setShowTimeModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={saveManualTime}
              >
                <Text style={[styles.modalButtonText, { color: colors.surface }]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  infoCard: {
    margin: 20,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  daysContainer: {
    paddingHorizontal: 20,
  },
  dayCard: {
    marginBottom: 20,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dayContent: {
    padding: 15,
  },
  timeBlocksSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  timeLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  addBlockButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addBlockButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  timeBlocksList: {
    gap: 10,
  },
  timeBlock: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
  },
  timeBlockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  timeBlockTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeBlockContent: {
    alignItems: 'center',
  },
  timeDisplay: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    minWidth: 200,
  },
  timeDisplayText: {
    fontSize: 16,
    fontWeight: '600',
  },
  editHint: {
    fontSize: 12,
    marginTop: 4,
  },
  emptyBlocks: {
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  emptyBlocksText: {
    fontSize: 14,
    textAlign: 'center',
  },
  durationSection: {
    marginBottom: 20,
  },
  durationPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  durationOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 100,
    alignItems: 'center',
  },
  durationOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  previewSection: {
    padding: 15,
    borderRadius: 8,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  previewText: {
    fontSize: 14,
    marginBottom: 4,
  },
  saveButton: {
    margin: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 30,
    gap: 10,
  },
  quickActionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  timeInput: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  modalHint: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SetAvailabilityScreen;
