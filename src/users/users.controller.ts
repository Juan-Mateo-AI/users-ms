import { Controller, ParseUUIDPipe } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { UsersService } from "./users.service";
import { EmailDto, UpdateUserDto, UserToCreateDto } from "./dto";
import { IdDto } from "./dto/id";

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern("users.create")
  create(@Payload() userToCreate: UserToCreateDto) {
    return this.usersService.create(userToCreate);
  }

  @MessagePattern("users.update")
  update(@Payload() user: UpdateUserDto) {
    return this.usersService.update(user);
  }

  @MessagePattern("users.findOne")
  findOne(@Payload() { email }: EmailDto) {
    return this.usersService.findOne(email);
  }

  @MessagePattern("users.findOneById")
  findOneById(@Payload() { id }: IdDto) {
    return this.usersService.findOneById(id);
  }
}
