import { Injectable, OnModuleInit } from '@nestjs/common';
import { User } from './entities/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService implements OnModuleInit{
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private configService: ConfigService
    ) {

    }
    async onModuleInit() {
        const username = this.configService.get('USERNAME');
        const rootAdmin = await this.findOne(username);
        if (!rootAdmin) {
            const password = await bcrypt.hash(this.configService.get('PASSWORD'), 10);
            const rootUser = {
                username,
                password,
            }
            const user = await this.userRepository.create(rootUser);
            return await this.userRepository.save(user);
        }
    }

    async findOne(username: string): Promise<User | undefined> {
        return await this.userRepository.findOneBy({username});
    }
}
