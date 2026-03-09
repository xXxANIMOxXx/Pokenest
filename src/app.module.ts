import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { Pelicula } from './peliculas/entidades/pelicula.entidad';
import { Pokemon } from './pokemon/entidades/pokemon.entidad';
import { PeliculasModulo } from './peliculas/peliculas.modulo';
import { PokemonModulo } from './pokemon/pokemon.modulo';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: 'pokenest.db',
        entities: [Pelicula, Pokemon],
        synchronize: true,
      }),
    }),
    PeliculasModulo,
    PokemonModulo,
  ],
})
export class AppModule { }
