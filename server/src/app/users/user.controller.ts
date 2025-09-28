import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly orderService: UserService) {}

  @Get('/users')
  async getUsers() {
    const result = await this.orderService.getUsers();

    return result;
  }
}
