import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {Field, ValidationError} from '../types/form';

interface Props {
  field: Field;
  value: any;
  onChange: (fieldId: string, value: any) => void;
  errors: ValidationError[];
}

export function DynamicDate({field, value, onChange, errors}: Props) {
  const [showPicker, setShowPicker] = useState(false);
  const fieldError = errors.find(e => e.fieldId === field.id);

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const dateValue = value ? new Date(value) : startOfToday;

  const handleChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (_event.type === 'dismissed') {
      setShowPicker(false);
      return;
    }
    if (selectedDate) {
      const picked = new Date(selectedDate);
      picked.setHours(0, 0, 0, 0);
      onChange(field.id, picked.toISOString());
    }
    setShowPicker(false);
  };

  const displayDate = value
    ? new Date(value).toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '';

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {field.label}
        {field.required ? ' *' : ''}
      </Text>
      <TouchableOpacity
        style={[styles.selector, fieldError ? styles.selectorError : null]}
        onPress={() => setShowPicker(true)}
        activeOpacity={0.7}>
        <Text style={value ? styles.selectorText : styles.selectorPlaceholder}>
          {displayDate || `Select ${field.label}`}
        </Text>
        <Text style={styles.calendarIcon}>📅</Text>
      </TouchableOpacity>
      {fieldError ? (
        <Text style={styles.error}>{fieldError.message}</Text>
      ) : null}

      {showPicker && (
        <DateTimePicker
          value={dateValue}
          mode="date"
          display="default"
          onChange={handleChange}
          maximumDate={new Date(
            startOfToday.getFullYear(),
            startOfToday.getMonth(),
            startOfToday.getDate() + 1,
            0,
            0,
            0,
            -1,
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {marginBottom: 12},
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  selector: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectorError: {
    borderColor: '#e53935',
  },
  selectorText: {
    fontSize: 16,
    color: '#000',
  },
  selectorPlaceholder: {
    fontSize: 16,
    color: '#999',
  },
  calendarIcon: {
    fontSize: 18,
  },
  error: {
    color: '#e53935',
    fontSize: 13,
    marginTop: 4,
  },
});
