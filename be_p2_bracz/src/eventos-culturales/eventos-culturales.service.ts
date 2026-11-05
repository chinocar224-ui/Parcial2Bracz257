import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventoCulturalDto } from './dto/create-evento-cultural.dto';
import { UpdateEventoCulturalDto } from './dto/update-evento-cultural.dto';
import { EventoCultural } from './entities/evento-cultural.entity';
import { Recinto } from '../recintos/entities/recinto.entity';

@Injectable()
export class EventosCulturalesService {
  constructor(
    @InjectRepository(EventoCultural) private eventosRepository: Repository<EventoCultural>,
    @InjectRepository(Recinto) private recintosRepository: Repository<Recinto>,
  ) {}

  private async validarRecinto(idRecinto: number): Promise<void> {
    const recinto = await this.recintosRepository.findOneBy({ id: idRecinto });
    if (!recinto) throw new NotFoundException(`El recinto con id ${idRecinto} no existe`);
  }

  private validarFechaNoPasada(fecha: string): void {
    const hoy = new Date();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    const hoyTexto = `${hoy.getFullYear()}-${mes}-${dia}`;
    if (fecha.slice(0, 10) < hoyTexto) {
      throw new BadRequestException('La fecha del evento no puede ser anterior a hoy');
    }
  }

  async create(createEventoDto: CreateEventoCulturalDto): Promise<EventoCultural> {
    await this.validarRecinto(createEventoDto.idRecinto);
    this.validarFechaNoPasada(createEventoDto.fechaEvento);

    let evento = await this.eventosRepository.findOneBy({
      idRecinto: createEventoDto.idRecinto,
      titulo: createEventoDto.titulo,
      fechaEvento: createEventoDto.fechaEvento,
    });
    if (evento) throw new ConflictException('El evento ya existe en ese recinto y fecha');

    evento = new EventoCultural();
    Object.assign(evento, createEventoDto);
    return this.eventosRepository.save(evento);
  }

  async findAll(): Promise<EventoCultural[]> {
    return this.eventosRepository.find({
      relations: { recinto: true },
      order: { fechaEvento: 'ASC', titulo: 'ASC' },
    });
  }

  async findOne(id: number): Promise<EventoCultural> {
    const evento = await this.eventosRepository.findOne({
      where: { id },
      relations: { recinto: true },
    });
    if (!evento) throw new NotFoundException(`El evento cultural con id ${id} no existe`);
    return evento;
  }

  async update(id: number, updateEventoDto: UpdateEventoCulturalDto): Promise<EventoCultural> {
    const evento = await this.findOne(id);
    if (updateEventoDto.fechaEvento && updateEventoDto.fechaEvento !== evento.fechaEvento) {
      this.validarFechaNoPasada(updateEventoDto.fechaEvento);
    }
    if (updateEventoDto.idRecinto !== undefined) {
      await this.validarRecinto(updateEventoDto.idRecinto);
      // evita que la relación cargada pise el nuevo id_recinto al guardar
      evento.recinto = undefined as unknown as Recinto;
    }
    Object.assign(evento, updateEventoDto);
    return this.eventosRepository.save(evento);
  }

  async remove(id: number): Promise<EventoCultural> {
    const evento = await this.findOne(id);
    return this.eventosRepository.softRemove(evento);
  }
}