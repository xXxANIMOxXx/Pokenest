import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pokemon } from './entidades/pokemon.entidad';
import { FiltrarPokemonDto } from './dto/filtrar-pokemon.dto';
import { CrearPokemonDto } from './dto/crear-pokemon.dto';

@Injectable()
export class PokemonServicio implements OnModuleInit {
  constructor(
    @InjectRepository(Pokemon)
    private pokemonRepo: Repository<Pokemon>,
  ) { }

  async onModuleInit() {
    const count = await this.pokemonRepo.count();
    if (count === 0) {
      await this.pokemonRepo.save([
        { name: 'Bulbasaur', type: 'Planta', hp: 45, attack: 49, defense: 49, sp_atk: 65, sp_def: 65, speed: 45 },
        { name: 'Charmander', type: 'Fuego', hp: 39, attack: 52, defense: 43, sp_atk: 60, sp_def: 50, speed: 65 },
        { name: 'Squirtle', type: 'Agua', hp: 44, attack: 48, defense: 65, sp_atk: 50, sp_def: 64, speed: 43 },
        { name: 'Pikachu', type: 'Eléctrico', hp: 35, attack: 55, defense: 40, sp_atk: 50, sp_def: 50, speed: 90 },
        { name: 'Gengar', type: 'Fantasma', hp: 60, attack: 65, defense: 60, sp_atk: 130, sp_def: 75, speed: 110 },
        { name: 'Arcanine', type: 'Fuego', hp: 90, attack: 110, defense: 80, sp_atk: 100, sp_def: 80, speed: 95 },
        { name: 'Snorlax', type: 'Normal', hp: 160, attack: 110, defense: 65, sp_atk: 65, sp_def: 110, speed: 30 },
        { name: 'Dragonite', type: 'Dragón', hp: 91, attack: 134, defense: 95, sp_atk: 100, sp_def: 100, speed: 80 },
        { name: 'Mewtwo', type: 'Psíquico', hp: 106, attack: 110, defense: 90, sp_atk: 154, sp_def: 90, speed: 130 },
        { name: 'Lucario', type: 'Lucha', hp: 70, attack: 110, defense: 70, sp_atk: 115, sp_def: 70, speed: 90 },
        { name: 'Garchomp', type: 'Dragón', hp: 108, attack: 130, defense: 95, sp_atk: 80, sp_def: 85, speed: 102 },
        { name: 'Umbreon', type: 'Siniestro', hp: 95, attack: 65, defense: 110, sp_atk: 60, sp_def: 130, speed: 65 },
        { name: 'Eevee', type: 'Normal', hp: 55, attack: 55, defense: 50, sp_atk: 45, sp_def: 65, speed: 55 },
        { name: 'Jolteon', type: 'Eléctrico', hp: 65, attack: 65, defense: 60, sp_atk: 110, sp_def: 95, speed: 130 },
        { name: 'Vaporeon', type: 'Agua', hp: 130, attack: 65, defense: 60, sp_atk: 110, sp_def: 95, speed: 65 },
      ]);
    }
  }

  findAll(): Promise<Pokemon[]> {
    return this.pokemonRepo.find();
  }

  filtrar(dto: FiltrarPokemonDto): Promise<Pokemon[]> {
    const query = this.pokemonRepo.createQueryBuilder('pokemon');

    if (dto.name) {
      query.andWhere('pokemon.name LIKE :name', { name: `%${dto.name}%` });
    }
    if (dto.type) {
      query.andWhere('pokemon.type = :type', { type: dto.type });
    }
    if (dto.hp !== undefined) {
      query.andWhere('pokemon.hp > :hp', { hp: dto.hp });
    }

    return query.getMany();
  }

  create(dto: CrearPokemonDto): Promise<Pokemon> {
    const pokemon = this.pokemonRepo.create(dto);
    return this.pokemonRepo.save(pokemon);
  }
}
