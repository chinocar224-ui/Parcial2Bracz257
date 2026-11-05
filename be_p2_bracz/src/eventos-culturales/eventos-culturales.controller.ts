import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EventosCulturalesService } from './eventos-culturales.service';
import { CreateEventoCulturalDto } from './dto/create-evento-cultural.dto';
import { UpdateEventoCulturalDto } from './dto/update-evento-cultural.dto';

@ApiTags('eventos-culturales')
@Controller('eventos-culturales')
export class EventosCulturalesController {
  constructor(private readonly eventosCulturalesService: EventosCulturalesService) {}

  @Post()
  create(@Body() createEventoDto: CreateEventoCulturalDto) {
    return this.eventosCulturalesService.create(createEventoDto);
  }

  @Get()
  findAll() {
    return this.eventosCulturalesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.eventosCulturalesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventoDto: UpdateEventoCulturalDto,
  ) {
    return this.eventosCulturalesService.update(id, updateEventoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.eventosCulturalesService.remove(id);
  }
}
