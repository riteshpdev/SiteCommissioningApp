import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Section, FormValues, PhotoState, ValidationError} from '../types/form';
import {isVisible} from '../engine/visibility';
import {DynamicField} from './DynamicField';
import {PhotoGroup} from './PhotoGroup';

interface Props {
  section: Section;
  values: FormValues;
  onChange: (fieldId: string, value: any) => void;
  onTogglePhoto: (slotId: string) => void;
  photos: PhotoState;
  errors: ValidationError[];
}

export function DynamicSection({
  section,
  values,
  onChange,
  onTogglePhoto,
  photos,
  errors,
}: Props) {
  const visibleFields = section.fields.filter(f =>
    isVisible(f.visibleWhen, values),
  );

  const visiblePhotos = section.photos || [];

  if (visibleFields.length === 0 && visiblePhotos.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{section.title}</Text>

      {visibleFields.map(field => (
        <DynamicField
          key={field.id}
          field={field}
          value={values[field.id]}
          values={values}
          onChange={onChange}
          errors={errors}
        />
      ))}

      {visiblePhotos.map((group, index) => (
        <PhotoGroup
          key={`${section.id}-photo-${index}`}
          group={group}
          values={values}
          onTogglePhoto={onTogglePhoto}
          photos={photos}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1565c0',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
});
