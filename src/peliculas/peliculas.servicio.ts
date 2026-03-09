import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pelicula } from './entidades/pelicula.entidad';
import { FiltrarPeliculaDto } from './dto/filtrar-pelicula.dto';

@Injectable()
export class PeliculasServicio implements OnModuleInit {
  constructor(
    @InjectRepository(Pelicula)
    private peliculaRepo: Repository<Pelicula>,
  ) {}

  async onModuleInit() {
    const count = await this.peliculaRepo.count();
    if (count === 0) {
      await this.peliculaRepo.save([
        { title: 'La La Land', director: 'Steve McQueen', year: 2010, length_minutes: 81 },
        { title: 'Zootopia', director: 'Steve McQueen', year: 2014, length_minutes: 95 },
        { title: 'Deadpool', director: 'Steve McQueen', year: 2016, length_minutes: 93 },
        { title: 'Monsters, Inc.', director: 'Pete Docter', year: 2015, length_minutes: 92 },
        { title: 'Finding Nemo', director: 'Andrew Stanton', year: 2013, length_minutes: 107 },
        { title: 'The Nice Guys', director: 'Richard Linklater', year: 1996, length_minutes: 116 },
        { title: 'Bee Movie', director: 'Steve McQueen', year: 2016, length_minutes: 117 },
        { title: 'Begin Again', director: 'Richard Linklater', year: 2017, length_minutes: 115 },
        { title: 'WALL-E', director: 'Andrew Stanton', year: 1999, length_minutes: 104 },
        { title: 'Up', director: 'Joel Coen', year: 2009, length_minutes: 101 },
        { title: 'Boss Baby', director: 'Lee Unkrich', year: 2010, length_minutes: 103 },
        { title: 'X-Men Apocalypse', director: 'Steve McQueen', year: 1998, length_minutes: 120 },
        { title: 'Moana', director: 'Brenda Chapman', year: 2012, length_minutes: 102 },
        { title: 'Frozen', director: 'Dan Scanion', year: 2013, length_minutes: 110 },
      ]);
    }
  }

  findAll(): Promise<Pelicula[]> {
    return this.peliculaRepo.find();
  }

  filtrar(dto: FiltrarPeliculaDto): Promise<Pelicula[]> {
    const query = this.peliculaRepo.createQueryBuilder('pelicula');

    if (dto.title) {
      query.andWhere('pelicula.title LIKE :title', { title: `%${dto.title}%` });
    }
    if (dto.yearFrom !== undefined) {
      query.andWhere('pelicula.year >= :yearFrom', { yearFrom: dto.yearFrom });
    }
    if (dto.yearTo !== undefined) {
      query.andWhere('pelicula.year <= :yearTo', { yearTo: dto.yearTo });
    }

    return query.getMany();
  }
}
