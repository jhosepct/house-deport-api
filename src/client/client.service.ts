import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './client.entity';
import { ClientDto } from '../utils/dto/client.dto';
import { CreateClientDto } from './dto/CreateClientDto';
import { UpdateClientDto } from './dto/UpdateCientDto';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async createClient(client: CreateClientDto): Promise<ClientDto> {
    const newClient = this.clientRepository.create(client);
    const savedClient = await this.clientRepository.save(newClient);
    return savedClient.ToJSON();
  }

  async getClients(): Promise<ClientDto[]> {
    const clients = await this.clientRepository.find();
    return clients.map((client) => client.ToJSON());
  }

  async getClientById(id: number): Promise<ClientDto> {
    const client = await this.clientRepository.findOneBy({ id });
    if (!client) {
      throw new HttpException('Client not found', HttpStatus.NOT_FOUND);
    }
    return client.ToJSON();
  }

  async deleteClient(id: number): Promise<void> {
    const result = await this.clientRepository.delete(id);
    if (result.affected === 0) {
      throw new HttpException('Client not found', HttpStatus.NOT_FOUND);
    }
  }

  async updateClient(
    id: number,
    clientData: UpdateClientDto,
  ): Promise<ClientDto> {
    const result = await this.clientRepository.update(id, clientData);
    if (result.affected === 0) {
      throw new HttpException('Client not found', HttpStatus.NOT_FOUND);
    }
    const updatedClient = await this.clientRepository.findOneBy({ id });
    return updatedClient.ToJSON();
  }
}
