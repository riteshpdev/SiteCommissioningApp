import React from 'react';
import {Field, FormValues, ValidationError} from '../types/form';
import {DynamicDate} from './DynamicDate';
import {DynamicText} from './DynamicText';
import {DynamicNumber} from './DynamicNumber';
import {DynamicSelect} from './DynamicSelect';
import {DynamicToggle} from './DynamicToggle';
import {DynamicCalculated} from './DynamicCalculated';
import {DynamicRepeat} from './DynamicRepeat';

interface Props {
  field: Field;
  value: any;
  values: FormValues;
  onChange: (fieldId: string, value: any) => void;
  errors: ValidationError[];
}

export function DynamicField({field, value, values, onChange, errors}: Props) {
  const commonProps = {field, value, onChange, errors};

  switch (field.type) {
    case 'date':
      return <DynamicDate {...commonProps} />;
    case 'text':
      return <DynamicText {...commonProps} />;
    case 'number':
      return <DynamicNumber {...commonProps} />;
    case 'select':
      return <DynamicSelect {...commonProps} />;
    case 'toggle':
      return <DynamicToggle {...commonProps} />;
    case 'computed':
      return <DynamicCalculated field={field} values={values} />;
    case 'repeat':
      return (
        <DynamicRepeat
          field={field}
          values={values}
          onChange={onChange}
          errors={errors}
        />
      );
    default:
      return <DynamicText {...commonProps} />;
  }
}
