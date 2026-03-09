import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Monstruo } from './entidades/monstruo.entidad';
import { MonstruosServicio } from './monstruos.servicio';
import { MonstruosControlador } from './monstruos.controlador';

@Module({
  imports: [TypeOrmModule.forFeature([Monstruo])],
  providers: [MonstruosServicio],
  controllers: [MonstruosControlador],
})
export class MonstruosModulo {}
