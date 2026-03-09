import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { PokemonServicio } from './pokemon.servicio';
import { FiltrarPokemonDto } from './dto/filtrar-pokemon.dto';
import { CrearPokemonDto } from './dto/crear-pokemon.dto';
import { Pokemon } from './entidades/pokemon.entidad';

@Controller('pokemon')
export class PokemonControlador {
  constructor(private readonly pokemonServicio: PokemonServicio) { }

  // GET /pokemon  -> todos los pokemon
  @Get()
  findAll(): Promise<Pokemon[]> {
    return this.pokemonServicio.findAll();
  }

  // GET /pokemon/filtrar?name=char&type=Fuego&hp=50
  @Get('filtrar')
  filtrar(@Query() dto: FiltrarPokemonDto): Promise<Pokemon[]> {
    return this.pokemonServicio.filtrar(dto);
  }

  // POST /pokemon  -> crear un nuevo pokemon
  @Post()
  create(@Body() dto: CrearPokemonDto): Promise<Pokemon> {
    return this.pokemonServicio.create(dto);
  }
}
