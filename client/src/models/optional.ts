import { Validator, Configuration, Value, Context, getContext, success } from "validation.ts"

export class OptionalValidator<V> extends Validator<V | undefined> {
  constructor(private validator: Validator<V>) { super() }

  validate(v: Value, config: Configuration = {}, c: Context = getContext("root")) {
    if (v === undefined || v === null) { return success(v as undefined) }
    return this.validator.validate(v, config, c)
  }
}

export function optional<V>(validator: Validator<V>): Validator<V | undefined> {
  return new OptionalValidator(validator)
}