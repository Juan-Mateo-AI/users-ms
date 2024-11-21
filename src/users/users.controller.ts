import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { UsersService } from "./users.service";
import { EmailDto, UserToCreateDto } from "./dto";

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern("users.create")
  create(@Payload() userToCreate: UserToCreateDto) {
    return this.usersService.create(userToCreate);
  }

  @MessagePattern("users.findOne")
  findOne(@Payload() { email }: EmailDto) {
    return this.usersService.findOne(email);
  }
}
