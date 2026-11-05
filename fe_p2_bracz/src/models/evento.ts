import type { Recinto } from './recinto'

export type EstadoEvento = 'Programado' | 'Agotado' | 'Cancelado'

export const ESTADOS_EVENTO: EstadoEvento[] = ['Programado', 'Agotado', 'Cancelado']

export type CategoriaEvento = 'Concierto' | 'Teatro' | 'Danza' | 'Festival'

export const CATEGORIAS_EVENTO: CategoriaEvento[] = ['Concierto', 'Teatro', 'Danza', 'Festival']

export interface Evento {
  id: number
  idRecinto: number
  titulo: string
  artistaPrincipal: string
  duracionMinutos: number
  precioEntrada: number
  fechaEvento: string
  estado: EstadoEvento
  recinto: Recinto
  categoria: CategoriaEvento
}
