import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

interface Props {
  label: string;
  captured: boolean;
  onToggle: (label: string) => void;
}

export function PhotoSlot({label, captured, onToggle}: Props) {
  return (
    <TouchableOpacity
      style={[styles.slot, captured ? styles.slotCaptured : styles.slotOutstanding]}
      onPress={() => onToggle(label)}
      activeOpacity={0.7}>
      <View style={[styles.indicator, captured ? styles.indicatorCaptured : styles.indicatorOutstanding]}>
        <Text style={styles.checkmark}>{captured ? '✓' : '○'}</Text>
      </View>
      <Text style={[styles.label, captured ? styles.labelCaptured : styles.labelOutstanding]}>
        {label}
      </Text>
      <Text style={[styles.status, captured ? styles.statusCaptured : styles.statusOutstanding]}>
        {captured ? 'Captured' : 'Outstanding'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  slot: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  slotCaptured: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4caf50',
  },
  slotOutstanding: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
  },
  indicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  indicatorCaptured: {
    backgroundColor: '#4caf50',
  },
  indicatorOutstanding: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ccc',
  },
  checkmark: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '700',
  },
  label: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  labelCaptured: {
    color: '#2e7d32',
  },
  labelOutstanding: {
    color: '#333',
  },
  status: {
    fontSize: 13,
    fontWeight: '600',
  },
  statusCaptured: {
    color: '#4caf50',
  },
  statusOutstanding: {
    color: '#e53935',
  },
});
