import Big from 'big.js';
import {
  ValidateBy,
  ValidationOptions,
  isValidationOptions,
} from 'class-validator';

export function IsKfc(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  const message = validationOptions?.message ?? `値が正しくありません。`;
  return ValidateBy(
    {
      name: 'Kfc',
      validator: {
        validate(value): boolean {
          if (value < new Big(0)) {
            return false;
          }
          return true;
        },
      },
    },
    { ...isValidationOptions, message },
  );
}
