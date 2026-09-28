import {VisibleWhen, FormValues} from '../types/form';

export function isVisible(
  condition: VisibleWhen | undefined,
  values: FormValues,
): boolean {
  if (!condition) {
    return true;
  }
  const fieldValue = values[condition.field];
  return String(fieldValue) === String(condition.equals);
}
