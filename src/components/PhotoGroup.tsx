import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {PhotoGroup as PhotoGroupType, FormValues} from '../types/form';
import {isVisible} from '../engine/visibility';
import {PhotoSlot} from './PhotoSlot';

interface Props {
  group: PhotoGroupType;
  values: FormValues;
  onTogglePhoto: (slotId: string) => void;
  photos: {[key: string]: boolean};
}

export function PhotoGroup({group, values, onTogglePhoto, photos}: Props) {
  if (!isVisible(group.visibleWhen, values)) {
    return null;
  }

  let slotLabels: string[] = [];

  if (group.slots) {
    slotLabels = group.slots;
  } else if (group.dynamicFrom && group.slotPrefix) {
    const count = parseInt(String(values[group.dynamicFrom]), 10);
    if (!isNaN(count) && count > 0) {
      slotLabels = Array.from({length: count}, (_, i) => `${group.slotPrefix}${i + 1}`);
    }
  }

  if (slotLabels.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.groupTitle}>{group.group}</Text>
      {slotLabels.map(label => (
        <PhotoSlot
          key={label}
          label={label}
          captured={photos[label] || false}
          onToggle={() => onTogglePhoto(label)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {marginBottom: 12},
  groupTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
