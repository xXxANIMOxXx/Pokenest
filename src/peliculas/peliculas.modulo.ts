import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pelicula } from './entidades/pelicula.entidad';
import { PeliculasServicio } from './peliculas.servicio';
import { PeliculasControlador } from './peliculas.controlador';

@Module({
  imports: [TypeOrmModule.forFeature([Pelicula])],
  providers: [PeliculasServicio],
  controllers: [PeliculasControlador],
})
export class PeliculasModulo {}
