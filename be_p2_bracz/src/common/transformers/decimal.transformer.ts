import { ValueTransformer } from 'typeorm';

// PostgreSQL devuelve las columnas decimal como cadena; se convierten a número
export const decimalTransformer: ValueTransformer = {
  to: (value?: number | null) => value,
  from: (value?: string | null) =>
    value === null || value === undefined ? value : Number.parseFloat(value),
};
