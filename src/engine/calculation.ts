import {FormValues} from '../types/form';

type Token =
  | {type: 'number'; value: number}
  | {type: 'field'; name: string}
  | {type: 'op'; value: string};

function tokenize(formula: string, _values: FormValues): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < formula.length) {
    if (formula[i] === ' ') {
      i++;
      continue;
    }

    if ('+-*/'.includes(formula[i])) {
      tokens.push({type: 'op', value: formula[i]});
      i++;
      continue;
    }

    if (/[0-9.]/.test(formula[i])) {
      let num = '';
      while (i < formula.length && /[0-9.]/.test(formula[i])) {
        num += formula[i];
        i++;
      }
      tokens.push({type: 'number', value: parseFloat(num)});
      continue;
    }

    if (/[a-zA-Z_]/.test(formula[i])) {
      let name = '';
      while (i < formula.length && /[a-zA-Z_0-9]/.test(formula[i])) {
        name += formula[i];
        i++;
      }
      tokens.push({type: 'field', name});
      continue;
    }

    i++;
  }

  return tokens;
}

function evaluateTokens(tokens: Token[], values: FormValues): number {
  if (tokens.length === 0) {
    return 0;
  }

  // Resolve field references to numbers
  const resolved: (number | string)[] = tokens.map(t => {
    if (t.type === 'number') {
      return t.value;
    }
    if (t.type === 'field') {
      const val = values[t.name];
      const num = parseFloat(String(val));
      return isNaN(num) ? 0 : num;
    }
    return t.value;
  });

  // Evaluate multiplication and division first
  const simplified: number[] = [];
  let i = 0;

  while (i < resolved.length) {
    if (typeof resolved[i] === 'number') {
      let result = resolved[i] as number;

      while (
        i + 2 < resolved.length &&
        typeof resolved[i + 1] === 'string' &&
        typeof resolved[i + 2] === 'number'
      ) {
        const op = resolved[i + 1] as string;
        const next = resolved[i + 2] as number;

        if (op === '*') {
          result *= next;
          i += 2;
        } else if (op === '/') {
          result = next !== 0 ? result / next : 0;
          i += 2;
        } else {
          break;
        }
      }

      simplified.push(result);
      i++;
    } else {
      // operator: + or -
      simplified.push(resolved[i] as unknown as number);
      i++;
    }
  }

  // Evaluate addition and subtraction
  let result = typeof simplified[0] === 'number' ? simplified[0] : 0;
  let j = 1;

  while (j < simplified.length - 1) {
    const op = simplified[j] as unknown as string;
    const next = simplified[j + 1] as unknown as number;

    if (op === '+') {
      result += next;
    } else if (op === '-') {
      result -= next;
    }

    j += 2;
  }

  return result;
}

export function evaluateFormula(
  formula: string,
  values: FormValues,
  precision: number = 2,
): number {
  const tokens = tokenize(formula, values);
  const result = evaluateTokens(tokens, values);
  return parseFloat(result.toFixed(precision));
}
