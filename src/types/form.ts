export type FieldType = 'date' | 'text' | 'number' | 'select' | 'toggle' | 'computed' | 'repeat';

export interface VisibleWhen {
  field: string;
  equals: string | number | boolean;
}

export interface ValidationRule {
  type: 'noFuture' | 'gte' | 'lte' | 'required';
  field?: string;
  message: string;
}

export interface Field {
  id: string;
  type: FieldType;
  label: string;
  required?: boolean;
  options?: (string | number)[];
  validation?: ValidationRule[];
  visibleWhen?: VisibleWhen;
  formula?: string;
  precision?: number;
  countField?: string;
  itemLabel?: string;
  fields?: Field[];
}

export interface PhotoGroup {
  group: string;
  slots?: string[];
  dynamicFrom?: string;
  slotPrefix?: string;
  visibleWhen?: VisibleWhen;
}

export interface Section {
  id: string;
  title: string;
  fields: Field[];
  photos?: PhotoGroup[];
}

export interface FormDefinition {
  id: string;
  version: string;
  title: string;
  sections: Section[];
}

export interface FormValues {
  [key: string]: any;
}

export interface PhotoState {
  [key: string]: boolean;
}

export interface ValidationError {
  fieldId: string;
  message: string;
}

export interface DraftData {
  formId: string;
  formVersion: string;
  values: FormValues;
  photos: PhotoState;
  status: 'draft' | 'complete';
  updatedAt: string;
}
