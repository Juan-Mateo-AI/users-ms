import { Body, Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { UserRolesService } from "./userRoles.service";
import {
  CreateUserRoleControllerDto,
  GetUserRoleControllerDto,
  UpdateUserRoleControllerDto,
  DeleteUserRoleControllerDto,
  GetAllUserRolesControllerDto,
} from "./dto";

@Controller()
export class UserRolesController {
  constructor(private readonly userRolesService: UserRolesService) {}

  @MessagePattern("userRoles.create")
  create(@Payload() { userRole, currentUser }: CreateUserRoleControllerDto) {
    return this.userRolesService.create({
      ...userRole,
      companyId: currentUser.companyId,
    });
  }

  @MessagePattern("userRoles.update")
  update(@Body() { userRole, userRoleId }: UpdateUserRoleControllerDto) {
    return this.userRolesService.update(userRoleId, userRole);
  }

  @MessagePattern("userRoles.find")
  find(@Body() { userRoleId }: GetUserRoleControllerDto) {
    return this.userRolesService.find(userRoleId);
  }

  @MessagePattern("userRoles.findAll")
  findAll(
    @Payload() { companyId, page, pageSize }: GetAllUserRolesControllerDto
  ) {
    return this.userRolesService.findAll(companyId, page, pageSize);
  }

  @MessagePattern("userRoles.delete")
  deleteUser(
    @Body()
    { companyId, userRoleId }: DeleteUserRoleControllerDto
  ) {
    return this.userRolesService.delete(companyId, userRoleId);
  }
}
