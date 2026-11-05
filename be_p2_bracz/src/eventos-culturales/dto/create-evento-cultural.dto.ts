import { ApiProperty } from '@nestjs/swagger';
import { CategoriaEvento } from '../enums/categoria-evento.enum';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsDefined,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { EstadoEvento } from '../enums/estado-evento.enum';

export class CreateEventoCulturalDto {
  @ApiProperty({ example: 1 })
  @IsDefined({ message: 'El id del recinto es obligatorio' })
  @IsInt({ message: 'El id del recinto debe ser un número entero' })
  readonly idRecinto: number;

  @ApiProperty({ example: 'Gala Folklórica de Aniversario' })
  @IsNotEmpty({ message: 'El título es obligatorio' })
  @IsString({ message: 'El título debe ser de tipo cadena' })
  @MaxLength(150, { message: 'El título no puede tener más de 150 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value == 'string' ? value.trim() : value))
  readonly titulo: string;

  @ApiProperty({ example: 'Los Kjarkas' })
  @IsNotEmpty({ message: 'El artista principal es obligatorio' })
  @IsString({ message: 'El artista principal debe ser de tipo cadena' })
  @MaxLength(100, { message: 'El artista principal no puede tener más de 100 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value == 'string' ? value.trim() : value))
  readonly artistaPrincipal: string;

  @ApiProperty({ example: 120 })
  @IsDefined({ message: 'La duración en minutos es obligatoria' })
  @IsInt({ message: 'La duración en minutos debe ser un número entero' })
  @Min(1, { message: 'La duración en minutos debe ser mayor a 0' })
  readonly duracionMinutos: number;

  @ApiProperty({ example: 150.5 })
  @IsDefined({ message: 'El precio de entrada es obligatorio' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio de entrada debe ser decimal (máx. 2 decimales)' })
  @Min(0, { message: 'El precio de entrada no puede ser negativo' })
  readonly precioEntrada: number;

  @ApiProperty({ example: '2026-12-15', description: 'Formato AAAA-MM-DD' })
  @IsNotEmpty({ message: 'La fecha del evento es obligatoria' })
  @IsDateString({}, { message: 'La fecha del evento debe tener el formato AAAA-MM-DD' })
  readonly fechaEvento: string;

  @ApiProperty({ enum: EstadoEvento, example: EstadoEvento.PROGRAMADO })
  @IsNotEmpty({ message: 'El estado es obligatorio' })
  @IsEnum(EstadoEvento, { message: 'El estado debe ser Programado, Agotado o Cancelado' })
  readonly estado: EstadoEvento;
  
  @ApiProperty({ enum: CategoriaEvento, example: CategoriaEvento.CONCIERTO })
  @IsNotEmpty({ message: 'La categoría es obligatoria' })
  @IsEnum(CategoriaEvento, {
  message: 'La categoría debe ser Concierto, Teatro, Danza o Festival',
})
readonly categoria: CategoriaEvento;
}
