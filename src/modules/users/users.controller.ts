import { Body, Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { UsersService } from "./users.service";
import {
  DeleteUserDto,
  EmailDto,
  ForgotPasswordDto,
  GetAllUsersDto,
  ResetPasswordDto,
  UserToCreateDto,
} from "./dto";
import { IdDto } from "./dto/id";
import { UpdateUserControllerDto } from "./dto/update-user-controller.dto";

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern("users.create")
  create(@Payload() userToCreate: UserToCreateDto) {
    return this.usersService.create(userToCreate);
  }

  @MessagePattern("users.update")
  update(
    @Body() { userId, currentUser, userToUpdate }: UpdateUserControllerDto
  ) {
    return this.usersService.update(userId, currentUser, userToUpdate);
  }

  @MessagePattern("users.findOne")
  findOne(@Payload() { email }: EmailDto) {
    return this.usersService.findOne(email);
  }

  @MessagePattern("users.findOneById")
  findOneById(@Payload() { id }: IdDto) {
    return this.usersService.findOneById(id);
  }

  @MessagePattern("users.findAllByCompanyId")
  findAllByCompanyId(@Payload() { companyId, page, pageSize }: GetAllUsersDto) {
    return this.usersService.findAllByCompanyId(companyId, page, pageSize);
  }

  @MessagePattern("users.delete")
  deleteUser(@Payload() { companyId, userId }: DeleteUserDto) {
    return this.usersService.deleteUser(companyId, userId);
  }

  @MessagePattern("users.invite")
  sendEmail(@Payload() { currentUser, userToInvite }) {
    return this.usersService.inviteUser(currentUser, userToInvite);
  }

  @MessagePattern("users.forgotPassword")
  forgotPassword(@Payload() { email }: ForgotPasswordDto) {
    return this.usersService.forgotPassword(email);
  }

  @MessagePattern("users.resetPassword")
  resetPassword(@Payload() { token, password }: ResetPasswordDto) {
    return this.usersService.resetPassword(token, password);
  }
}
