import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Field} from '../types/form';
import {evaluateFormula} from '../engine/calculation';
import {FormValues} from '../types/form';

interface Props {
  field: Field;
  values: FormValues;
}

export function DynamicCalculated({field, values}: Props) {
  const result = evaluateFormula(
    field.formula || '0',
    values,
    field.precision || 2,
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{field.label}</Text>
      <View style={styles.valueBox}>
        <Text style={styles.value}>{result.toFixed(field.precision || 2)}</Text>
      </View>
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
  valueBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f5f5f5',
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});
