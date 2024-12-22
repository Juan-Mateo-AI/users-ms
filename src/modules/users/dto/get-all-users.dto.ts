import { IsDefined, IsNumber, IsUUID } from "class-validator";

export class GetAllUsersDto {
  @IsDefined()
  @IsUUID()
  companyId: string;

  @IsDefined()
  @IsNumber()
  page: number;

  @IsDefined()
  @IsNumber()
  pageSize: number;
}
