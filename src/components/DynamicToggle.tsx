import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Field, ValidationError} from '../types/form';

interface Props {
  field: Field;
  value: any;
  onChange: (fieldId: string, value: any) => void;
  errors: ValidationError[];
}

export function DynamicToggle({field, value, onChange, errors}: Props) {
  const fieldError = errors.find(e => e.fieldId === field.id);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {field.label}
        {field.required ? ' *' : ''}
      </Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.button,
            styles.yesButton,
            value === 'yes' && styles.buttonActive,
          ]}
          onPress={() => onChange(field.id, 'yes')}
          activeOpacity={0.7}>
          <Text
            style={[
              styles.buttonText,
              value === 'yes' && styles.buttonTextActive,
            ]}>
            Yes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            styles.noButton,
            value === 'no' && styles.buttonActiveNo,
          ]}
          onPress={() => onChange(field.id, 'no')}
          activeOpacity={0.7}>
          <Text
            style={[
              styles.buttonText,
              value === 'no' && styles.buttonTextActiveNo,
            ]}>
            No
          </Text>
        </TouchableOpacity>
      </View>
      {fieldError ? (
        <Text style={styles.error}>{fieldError.message}</Text>
      ) : null}
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
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  yesButton: {},
  noButton: {},
  buttonActive: {
    backgroundColor: '#4caf50',
    borderColor: '#4caf50',
  },
  buttonActiveNo: {
    backgroundColor: '#e53935',
    borderColor: '#e53935',
  },
  buttonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  buttonTextActive: {
    color: '#fff',
  },
  buttonTextActiveNo: {
    color: '#fff',
  },
  error: {
    color: '#e53935',
    fontSize: 13,
    marginTop: 4,
  },
});
