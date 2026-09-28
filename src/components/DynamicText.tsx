import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';
import {Field, ValidationError} from '../types/form';

interface Props {
  field: Field;
  value: any;
  onChange: (fieldId: string, value: any) => void;
  errors: ValidationError[];
}

export function DynamicText({field, value, onChange, errors}: Props) {
  const fieldError = errors.find(e => e.fieldId === field.id);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {field.label}
        {field.required ? ' *' : ''}
      </Text>
      <TextInput
        style={[styles.input, fieldError ? styles.inputError : null]}
        value={value ? String(value) : ''}
        onChangeText={text => onChange(field.id, text)}
        placeholder={`Enter ${field.label}`}
        placeholderTextColor="#999"
      />
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#000',
  },
  inputError: {
    borderColor: '#e53935',
  },
  error: {
    color: '#e53935',
    fontSize: 13,
    marginTop: 4,
  },
});
