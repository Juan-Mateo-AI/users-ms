import { IsDefined, IsNumber, IsUUID } from "class-validator";

export class DeleteUserDto {
  @IsDefined()
  @IsUUID()
  companyId: string;

  @IsDefined()
  @IsUUID()
  userId: string;
}
