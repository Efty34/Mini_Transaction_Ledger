import { ValueTransformer } from 'typeorm';

// Postgres `numeric` columns come back from the driver as strings (to avoid
// silent float precision loss). This keeps storage exact while giving the
// application a plain JS number to work with.
export const decimalTransformer: ValueTransformer = {
  to: (value?: number) => value,
  from: (value?: string) =>
    value === null || value === undefined ? value : parseFloat(value),
};
