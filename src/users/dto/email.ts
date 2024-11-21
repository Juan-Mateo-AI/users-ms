import { IsEmail, IsOptional, IsString, IsUUID } from "class-validator";

export class EmailDto {
  @IsString()
  @IsEmail()
  email: string;
}
