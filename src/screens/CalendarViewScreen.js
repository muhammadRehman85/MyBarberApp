import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from '../theme';

const CalendarViewScreen = ({ 
  appointments = [], 
  onBack 
}) => {
  const { colors } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week'); // 'day', 'week', 'month'

  // Get appointments for the current view
  const getAppointmentsForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === dateString);
  };

  // Get week dates
  const getWeekDates = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  };

  // Get month dates
  const getMonthDates = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay());
    
    const monthDates = [];
    for (let i = 0; i < 42; i++) { // 6 weeks * 7 days
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      monthDates.push(date);
    }
    return monthDates;
  };

  // Navigate to previous period
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate.setDate(currentDate.getDate() - 1);
    } else if (viewMode === 'week') {
      newDate.setDate(currentDate.getDate() - 7);
    } else if (viewMode === 'month') {
      newDate.setMonth(currentDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  // Navigate to next period
  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate.setDate(currentDate.getDate() + 1);
    } else if (viewMode === 'week') {
      newDate.setDate(currentDate.getDate() + 7);
    } else if (viewMode === 'month') {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  // Go to today
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (timeString) => {
    return timeString;
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'completed': return '#2196F3';
      case 'cancelled': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  // Render day view
  const renderDayView = () => {
    const dayAppointments = getAppointmentsForDate(currentDate);
    
    return (
      <View style={styles.dayContainer}>
        <Text style={[styles.dayTitle, { color: colors.text }]}>
          {formatDate(currentDate)}
        </Text>
        {dayAppointments.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
              No appointments for this day
            </Text>
          </View>
        ) : (
          <ScrollView style={styles.appointmentsList}>
            {dayAppointments.map((appointment) => (
              <View key={appointment.id} style={[styles.appointmentCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.appointmentHeader}>
                  <Text style={[styles.appointmentTime, { color: colors.primary }]}>
                    {formatTime(appointment.time)}
                  </Text>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(appointment.status) }
                  ]}>
                    <Text style={styles.statusText}>{appointment.status}</Text>
                  </View>
                </View>
                <Text style={[styles.clientName, { color: colors.text }]}>
                  {appointment.clientName}
                </Text>
                <Text style={[styles.serviceName, { color: colors.textSecondary }]}>
                  {appointment.service}
                </Text>
                <Text style={[styles.price, { color: colors.primary }]}>
                  {appointment.price}
                </Text>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    );
  };

  // Render week view
  const renderWeekView = () => {
    const weekDates = getWeekDates();
    
    return (
      <View style={styles.weekContainer}>
        <View style={styles.weekHeader}>
          {weekDates.map((date, index) => (
            <View key={index} style={[styles.dayHeader, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.dayName, { color: colors.textSecondary }]}>
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
              </Text>
              <Text style={[styles.dayNumber, { color: colors.text }]}>
                {date.getDate()}
              </Text>
            </View>
          ))}
        </View>
        <ScrollView style={styles.weekContent}>
          {weekDates.map((date, index) => {
            const dayAppointments = getAppointmentsForDate(date);
            return (
              <View key={index} style={[styles.dayColumn, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                {dayAppointments.map((appointment) => (
                  <View key={appointment.id} style={[styles.weekAppointment, { backgroundColor: getStatusColor(appointment.status) }]}>
                    <Text style={styles.weekAppointmentTime}>
                      {formatTime(appointment.time)}
                    </Text>
                    <Text style={styles.weekAppointmentName}>
                      {appointment.clientName}
                    </Text>
                  </View>
                ))}
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  // Render month view
  const renderMonthView = () => {
    const monthDates = getMonthDates();
    const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    return (
      <View style={styles.monthContainer}>
        <Text style={[styles.monthTitle, { color: colors.text }]}>
          {monthName}
        </Text>
        <View style={styles.monthGrid}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
            <View key={index} style={[styles.monthDayHeader, { backgroundColor: colors.surface }]}>
              <Text style={[styles.monthDayName, { color: colors.textSecondary }]}>
                {day}
              </Text>
            </View>
          ))}
          {monthDates.map((date, index) => {
            const dayAppointments = getAppointmentsForDate(date);
            const isCurrentMonth = date.getMonth() === currentDate.getMonth();
            const isToday = date.toDateString() === new Date().toDateString();
            
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.monthDay,
                  { 
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    opacity: isCurrentMonth ? 1 : 0.3,
                    backgroundColor: isToday ? colors.primary : colors.surface
                  }
                ]}
                onPress={() => {
                  setCurrentDate(date);
                  setViewMode('day');
                }}
              >
                <Text style={[
                  styles.monthDayNumber,
                  { 
                    color: isToday ? colors.surface : colors.text,
                    fontWeight: isToday ? 'bold' : 'normal'
                  }
                ]}>
                  {date.getDate()}
                </Text>
                {dayAppointments.length > 0 && (
                  <View style={styles.appointmentIndicator}>
                    <Text style={styles.appointmentCount}>
                      {dayAppointments.length}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={[styles.backButtonText, { color: colors.primary }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Calendar View</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Navigation Controls */}
      <View style={styles.navigationControls}>
        <TouchableOpacity onPress={goToPrevious} style={[styles.navButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.navButtonText, { color: colors.text }]}>‹</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={goToToday} style={[styles.todayButton, { backgroundColor: colors.primary }]}>
          <Text style={[styles.todayButtonText, { color: colors.surface }]}>Today</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={goToNext} style={[styles.navButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.navButtonText, { color: colors.text }]}>›</Text>
        </TouchableOpacity>
      </View>

      {/* View Mode Tabs */}
      <View style={styles.viewModeTabs}>
        {['day', 'week', 'month'].map((mode) => (
          <TouchableOpacity
            key={mode}
            style={[
              styles.viewModeTab,
              { 
                backgroundColor: viewMode === mode ? colors.primary : colors.surface,
                borderColor: colors.border
              }
            ]}
            onPress={() => setViewMode(mode)}
          >
            <Text style={[
              styles.viewModeText,
              { color: viewMode === mode ? colors.surface : colors.text }
            ]}>
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Calendar Content */}
      <View style={styles.calendarContent}>
        {viewMode === 'day' && renderDayView()}
        {viewMode === 'week' && renderWeekView()}
        {viewMode === 'month' && renderMonthView()}
      </View>
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
  navigationControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  navButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  todayButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  todayButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  viewModeTabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 10,
  },
  viewModeTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  viewModeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  calendarContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  dayContainer: {
    flex: 1,
  },
  dayTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  appointmentsList: {
    flex: 1,
  },
  appointmentCard: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  appointmentTime: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 14,
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyState: {
    padding: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: 50,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
  },
  weekContainer: {
    flex: 1,
  },
  weekHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  dayHeader: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  dayName: {
    fontSize: 12,
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  weekContent: {
    flex: 1,
  },
  dayColumn: {
    flex: 1,
    minHeight: 100,
    borderWidth: 1,
    padding: 5,
  },
  weekAppointment: {
    padding: 5,
    borderRadius: 5,
    marginBottom: 5,
  },
  weekAppointmentTime: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  weekAppointmentName: {
    fontSize: 10,
    color: 'white',
  },
  monthContainer: {
    flex: 1,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  monthDayHeader: {
    width: '14.28%',
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  monthDayName: {
    fontSize: 12,
    fontWeight: '500',
  },
  monthDay: {
    width: '14.28%',
    height: 60,
    padding: 5,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthDayNumber: {
    fontSize: 14,
  },
  appointmentIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#FF5722',
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appointmentCount: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CalendarViewScreen;
