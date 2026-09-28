import {FormDefinition, FormValues, ValidationError, Field} from '../types/form';

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function parseDate(value: any): Date | null {
  if (!value) {
    return null;
  }
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

function validateField(
  field: Field,
  values: FormValues,
): ValidationError[] {
  const errors: ValidationError[] = [];
  const value = values[field.id];

  if (field.required) {
    if (value === undefined || value === null || value === '') {
      errors.push({fieldId: field.id, message: `${field.label} is required`});
      return errors;
    }
  }

  if (value === undefined || value === null || value === '') {
    return errors;
  }

  if (!field.validation) {
    return errors;
  }

  for (const rule of field.validation) {
    if (rule.type === 'required') {
      if (value === undefined || value === null || value === '') {
        errors.push({fieldId: field.id, message: rule.message});
      }
    }

    if (rule.type === 'noFuture') {
      const dateValue = parseDate(value);
      if (dateValue) {
        const today = startOfDay(new Date());
        if (startOfDay(dateValue) > today) {
          errors.push({fieldId: field.id, message: rule.message});
        }
      }
    }

    if (rule.type === 'gte' && rule.field) {
      const dateValue = parseDate(value);
      const otherValue = parseDate(values[rule.field]);
      if (dateValue && otherValue && startOfDay(dateValue) < startOfDay(otherValue)) {
        errors.push({fieldId: field.id, message: rule.message});
      }
    }

    if (rule.type === 'lte' && rule.field) {
      const dateValue = parseDate(value);
      const otherValue = parseDate(values[rule.field]);
      if (dateValue && otherValue && startOfDay(dateValue) > startOfDay(otherValue)) {
        errors.push({fieldId: field.id, message: rule.message});
      }
    }
  }

  return errors;
}

function validateRepeatBlock(
  field: Field,
  values: FormValues,
): ValidationError[] {
  const errors: ValidationError[] = [];
  const count = parseInt(String(values[field.countField || '']), 10);

  if (isNaN(count) || count <= 0 || !field.fields) {
    return errors;
  }

  for (let i = 0; i < count; i++) {
    for (const subField of field.fields) {
      const subFieldWithId = {
        ...subField,
        id: `${field.id}_${i}_${subField.id}`,
      };
      errors.push(...validateField(subFieldWithId, values));
    }
  }

  return errors;
}

export function validateForm(
  def: FormDefinition,
  values: FormValues,
): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const section of def.sections) {
    for (const field of section.fields) {
      if (field.type === 'repeat') {
        errors.push(...validateRepeatBlock(field, values));
      } else {
        errors.push(...validateField(field, values));
      }
    }
  }

  return errors;
}
