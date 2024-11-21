import { IsEmail, IsString, IsUUID } from "class-validator";

export class UserToCreateDto {
  @IsString()
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsUUID()
  companyId: string;

  @IsUUID()
  userRoleId: string;
}
