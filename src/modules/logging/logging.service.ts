import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Log } from './tneities/log.entity';

@Injectable()
export class LoggingService {
  constructor(
    @InjectRepository(Log)
    private readonly logRepository: Repository<Log>,
  ) {}

  async log(log: Log) {
    await this.logRepository.save(log);
  }
}
