import {validateForm} from '../src/engine/validation';
import {evaluateFormula} from '../src/engine/calculation';
import {isVisible} from '../src/engine/visibility';
import {FormDefinition} from '../src/types/form';

const def: FormDefinition = {
  id: 'test',
  version: '1.0.0',
  title: 'Test',
  sections: [
    {
      id: 's1',
      title: 'S1',
      fields: [
        {
          id: 'dateA',
          type: 'date',
          label: 'Date A',
          required: true,
          validation: [{type: 'noFuture', message: 'Date cannot be in the future'}],
        },
        {
          id: 'dateB',
          type: 'date',
          label: 'Date B',
          required: true,
          validation: [
            {type: 'noFuture', message: 'Date cannot be in the future'},
            {type: 'gte', field: 'dateA', message: 'B cannot be earlier than A'},
          ],
        },
        {id: 'toggle', type: 'toggle', label: 'Toggle', required: true},
        {
          id: 'child',
          type: 'text',
          label: 'Child',
          required: true,
          visibleWhen: {field: 'toggle', equals: 'yes'},
        },
      ],
    },
  ],
};

function iso(d: Date): string {
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

describe('validation: noFuture', () => {
  it('accepts today', () => {
    const errors = validateForm(def, {
      dateA: iso(new Date()),
      dateB: iso(new Date()),
      toggle: 'yes',
      child: 'x',
    });
    expect(errors).toHaveLength(0);
  });

  it('accepts today even with time-of-day attached (regression)', () => {
    const now = new Date();
    const errors = validateForm(def, {
      dateA: now.toISOString(),
      dateB: now.toISOString(),
      toggle: 'yes',
      child: 'x',
    });
    expect(errors).toHaveLength(0);
  });

  it('rejects tomorrow', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const errors = validateForm(def, {
      dateA: iso(tomorrow),
      dateB: iso(tomorrow),
      toggle: 'yes',
      child: 'x',
    });
    expect(errors.map(e => e.fieldId)).toContain('dateA');
    expect(errors.map(e => e.fieldId)).toContain('dateB');
  });

  it('rejects dateB earlier than dateA', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const errors = validateForm(def, {
      dateA: iso(new Date()),
      dateB: iso(yesterday),
      toggle: 'yes',
      child: 'x',
    });
    expect(errors.map(e => e.message)).toContain('B cannot be earlier than A');
  });

  it('required fields produce errors', () => {
    const errors = validateForm(def, {toggle: ''});
    expect(errors.map(e => e.fieldId)).toEqual(
      expect.arrayContaining(['dateA', 'dateB', 'toggle']),
    );
  });
});

describe('visibility', () => {
  it('hides child when toggle is not yes', () => {
    expect(isVisible({field: 'toggle', equals: 'yes'}, {toggle: 'no'})).toBe(false);
    expect(isVisible({field: 'toggle', equals: 'yes'}, {toggle: 'yes'})).toBe(true);
    expect(isVisible(undefined, {})).toBe(true);
  });
});

describe('calculation', () => {
  it('600 * 20 / 1000 = 12.00', () => {
    expect(
      evaluateFormula('panelCapacity * numberOfPanels / 1000', {
        panelCapacity: '600',
        numberOfPanels: '20',
      }),
    ).toBe(12);
  });

  it('applies two-decimal precision', () => {
    expect(
      evaluateFormula('panelCapacity * numberOfPanels / 1000', {
        panelCapacity: '575',
        numberOfPanels: '33',
      }),
    ).toBe(18.98);
  });
});
