import { Controller, Get, Query } from '@nestjs/common';
import { PeliculasServicio } from './peliculas.servicio';
import { FiltrarPeliculaDto } from './dto/filtrar-pelicula.dto';
import { Pelicula } from './entidades/pelicula.entidad';

@Controller('peliculas')
export class PeliculasControlador {
  constructor(private readonly peliculasServicio: PeliculasServicio) {}

  // GET /peliculas  -> todas las películas
  @Get()
  findAll(): Promise<Pelicula[]> {
    return this.peliculasServicio.findAll();
  }

  // GET /peliculas/filtrar?title=Nemo&yearFrom=2010&yearTo=2015
  @Get('filtrar')
  filtrar(@Query() dto: FiltrarPeliculaDto): Promise<Pelicula[]> {
    return this.peliculasServicio.filtrar(dto);
  }
}
