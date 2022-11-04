import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { getManager } from 'typeorm';

@ValidatorConstraint({ async: true })
export class UniqueOnDatabaseExistConstraint
  implements ValidatorConstraintInterface
{
  async validate(value: any, args: ValidationArguments) {
    const req = args.object['__req__'];
    const entity = args.object[`__entity__${args.property}__`];
    let query = args.object[`__query__${args.property}__`](req) || {};
    query = { [args.property]: value, ...query };
    return getManager()
      .count(entity, query)
      .then((count) => count < 1);
  }
}

export function UniqueOnDatabase(
  entity: Function,
  validationOptions?: ValidationOptions,
  query = (req: any) => {},
) {
  validationOptions = {
    ...{ message: '$value already exists. Choose another.' },
    ...validationOptions,
  };
  return function (object: Object, propertyName: string) {
    object[`__entity__${propertyName}__`] = entity;
    object[`__query__${propertyName}__`] = query;
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: UniqueOnDatabaseExistConstraint,
    });
  };
}
