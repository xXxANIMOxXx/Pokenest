import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Monstruo } from './entidades/monstruo.entidad';
import { FiltrarMonstruoDto } from './dto/filtrar-monstruo.dto';

@Injectable()
export class MonstruosServicio implements OnModuleInit {
  constructor(
    @InjectRepository(Monstruo)
    private monstruoRepo: Repository<Monstruo>,
  ) {}

  async onModuleInit() {
    const count = await this.monstruoRepo.count();
    if (count === 0) {
      await this.monstruoRepo.save([
        { name: 'Rathalos', species: 'Flying Wyvern', element: 'Fire', weakness: 'Dragon' },
        { name: 'Zinogre', species: 'Fanged Wyvern', element: 'Thunder', weakness: 'Ice' },
        { name: 'Nargacuga', species: 'Flying Wyvern', element: 'None', weakness: 'Thunder' },
        { name: 'Tigrex', species: 'Flying Wyvern', element: 'None', weakness: 'Thunder' },
        { name: 'Rajang', species: 'Fanged Beast', element: 'Thunder', weakness: 'Ice' },
        { name: 'Diablos', species: 'Flying Wyvern', element: 'None', weakness: 'Ice' },
        { name: 'Magnamalo', species: 'Fanged Wyvern', element: 'Hellfire', weakness: 'Water' },
        { name: 'Mizutsune', species: 'Leviathan', element: 'Water', weakness: 'Thunder' },
        { name: 'Velkhana', species: 'Elder Dragon', element: 'Ice', weakness: 'Fire' },
        { name: 'Nergigante', species: 'Elder Dragon', element: 'None', weakness: 'Thunder' },
        { name: 'Gore Magala', species: 'Unknown', element: 'Frenzy', weakness: 'Fire' },
        { name: 'Fatalis', species: 'Elder Dragon', element: 'Fire', weakness: 'Dragon' },
        { name: 'Brachydios', species: 'Brute Wyvern', element: 'Blast', weakness: 'Water' },
        { name: 'Deviljho', species: 'Brute Wyvern', element: 'Dragon', weakness: 'Thunder' },
      ]);
    }
  }

  findAll(): Promise<Monstruo[]> {
    return this.monstruoRepo.find();
  }

  filtrar(dto: FiltrarMonstruoDto): Promise<Monstruo[]> {
    const query = this.monstruoRepo.createQueryBuilder('monstruo');

    if (dto.name) {
      query.andWhere('monstruo.name ILIKE :name', { name: `%${dto.name}%` });
    }
    if (dto.species) {
      query.andWhere('monstruo.species ILIKE :species', { species: `%${dto.species}%` });
    }
    if (dto.weakness) {
      query.andWhere('monstruo.weakness ILIKE :weakness', { weakness: `%${dto.weakness}%` });
    }

    return query.getMany();
  }
}
