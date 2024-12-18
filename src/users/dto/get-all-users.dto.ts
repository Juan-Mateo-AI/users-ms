import { IsDefined, IsNumber, IsUUID } from "class-validator";

export class CompanyIdDto {
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
