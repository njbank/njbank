import Big from 'big.js';

export class ColumnNumericTransformer {
  to(data: number): number {
    return data;
  }
  from(data: string): Big {
    return new Big(data);
  }
}
