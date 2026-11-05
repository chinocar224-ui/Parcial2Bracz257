import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRecintoDto } from './dto/create-recinto.dto';
import { UpdateRecintoDto } from './dto/update-recinto.dto';
import { Recinto } from './entities/recinto.entity';
import { EventoCultural } from '../eventos-culturales/entities/evento-cultural.entity';

@Injectable()
export class RecintosService {
  constructor(@InjectRepository(Recinto) private recintosRepository: Repository<Recinto>) {}

  async create(createRecintoDto: CreateRecintoDto): Promise<Recinto> {
    let recinto = await this.recintosRepository.findOneBy({
      nombre: createRecintoDto.nombre,
      ciudad: createRecintoDto.ciudad,
    });
    if (recinto) throw new ConflictException('El recinto ya existe en esa ciudad');

    recinto = new Recinto();
    Object.assign(recinto, createRecintoDto);
    return this.recintosRepository.save(recinto);
  }

  async findAll(): Promise<Recinto[]> {
    return this.recintosRepository.find({ order: { nombre: 'ASC' } });
  }

  async findOne(id: number): Promise<Recinto> {
    const recinto = await this.recintosRepository.findOneBy({ id });
    if (!recinto) throw new NotFoundException(`El recinto con id ${id} no existe`);
    return recinto;
  }

  async update(id: number, updateRecintoDto: UpdateRecintoDto): Promise<Recinto> {
    const recinto = await this.findOne(id);
    Object.assign(recinto, updateRecintoDto);
    return this.recintosRepository.save(recinto);
  }

  async remove(id: number): Promise<Recinto> {
    const recinto = await this.findOne(id);
    const eventos = await this.recintosRepository.manager.countBy(EventoCultural, {
      idRecinto: id,
    });
    if (eventos > 0) {
      throw new ConflictException('No se puede eliminar el recinto porque tiene eventos asociados');
    }
    return this.recintosRepository.softRemove(recinto);
  }
}
