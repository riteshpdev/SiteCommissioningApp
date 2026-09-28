import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import {Field, ValidationError} from '../types/form';

interface Props {
  field: Field;
  value: any;
  onChange: (fieldId: string, value: any) => void;
  errors: ValidationError[];
}

export function DynamicSelect({field, value, onChange, errors}: Props) {
  const [visible, setVisible] = useState(false);
  const fieldError = errors.find(e => e.fieldId === field.id);
  const options = field.options || [];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {field.label}
        {field.required ? ' *' : ''}
      </Text>
      <TouchableOpacity
        style={[styles.selector, fieldError ? styles.selectorError : null]}
        onPress={() => setVisible(true)}
        activeOpacity={0.7}>
        <Text style={value ? styles.selectorText : styles.selectorPlaceholder}>
          {value ? String(value) : `Select ${field.label}`}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>
      {fieldError ? (
        <Text style={styles.error}>{fieldError.message}</Text>
      ) : null}

      <Modal visible={visible} transparent animationType="slide">
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>{field.label}</Text>
            <FlatList
              data={options}
              keyExtractor={item => String(item)}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    String(item) === String(value) && styles.optionSelected,
                  ]}
                  onPress={() => {
                    onChange(field.id, item);
                    setVisible(false);
                  }}>
                  <Text
                    style={[
                      styles.optionText,
                      String(item) === String(value) && styles.optionTextSelected,
                    ]}>
                    {String(item)}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
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
  arrow: {
    fontSize: 12,
    color: '#666',
  },
  error: {
    color: '#e53935',
    fontSize: 13,
    marginTop: 4,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '60%',
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    color: '#333',
  },
  option: {
    padding: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  optionSelected: {
    backgroundColor: '#e3f2fd',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  optionTextSelected: {
    color: '#1565c0',
    fontWeight: '600',
  },
});
