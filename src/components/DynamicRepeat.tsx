import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Field, FormValues, ValidationError} from '../types/form';
import {DynamicText} from './DynamicText';
import {DynamicNumber} from './DynamicNumber';
import {DynamicDate} from './DynamicDate';
import {DynamicSelect} from './DynamicSelect';
import {DynamicToggle} from './DynamicToggle';

interface Props {
  field: Field;
  values: FormValues;
  onChange: (fieldId: string, value: any) => void;
  errors: ValidationError[];
}

export function DynamicRepeat({field, values, onChange, errors}: Props) {
  const count = parseInt(String(values[field.countField || '']), 10);
  const subFields = field.fields || [];

  if (isNaN(count) || count <= 0) {
    return null;
  }

  const renderSubField = (subField: Field, instanceIndex: number) => {
    const instanceId = `${field.id}_${instanceIndex}_${subField.id}`;
    const instanceField = {...subField, id: instanceId};

    const commonProps = {
      field: instanceField,
      value: values[instanceId],
      onChange,
      errors,
    };

    switch (subField.type) {
      case 'text':
        return <DynamicText {...commonProps} />;
      case 'number':
        return <DynamicNumber {...commonProps} />;
      case 'date':
        return <DynamicDate {...commonProps} />;
      case 'select':
        return <DynamicSelect {...commonProps} />;
      case 'toggle':
        return <DynamicToggle {...commonProps} />;
      default:
        return <DynamicText {...commonProps} />;
    }
  };

  return (
    <View style={styles.container}>
      {Array.from({length: count}, (_, i) => (
        <View key={i} style={styles.block}>
          <Text style={styles.blockTitle}>
            {field.itemLabel || 'Item'} {i + 1}
          </Text>
          {subFields.map(sub => renderSubField(sub, i))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {marginBottom: 12},
  block: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#fafafa',
  },
  blockTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1565c0',
    marginBottom: 8,
  },
});
