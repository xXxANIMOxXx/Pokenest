import { Controller, Get, Query } from '@nestjs/common';
import { MonstruosServicio } from './monstruos.servicio';
import { FiltrarMonstruoDto } from './dto/filtrar-monstruo.dto';
import { Monstruo } from './entidades/monstruo.entidad';

@Controller('monstruos')
export class MonstruosControlador {
  constructor(private readonly monstruosServicio: MonstruosServicio) {}

  // GET /monstruos
  @Get()
  findAll(): Promise<Monstruo[]> {
    return this.monstruosServicio.findAll();
  }

  // GET /monstruos/filtrar?name=Rathalos
  @Get('filtrar')
  filtrar(@Query() dto: FiltrarMonstruoDto): Promise<Monstruo[]> {
    return this.monstruosServicio.filtrar(dto);
  }
}
