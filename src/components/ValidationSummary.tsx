import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {ValidationError} from '../types/form';

interface Props {
  errors: ValidationError[];
}

export function ValidationSummary({errors}: Props) {
  if (errors.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {errors.length} issue{errors.length !== 1 ? 's' : ''} found:
      </Text>
      {errors.map((error, index) => (
        <Text key={index} style={styles.error}>
          • {error.message}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff3e0',
    borderWidth: 1,
    borderColor: '#ff9800',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#e65100',
    marginBottom: 4,
  },
  error: {
    fontSize: 13,
    color: '#bf360c',
    lineHeight: 20,
  },
});
