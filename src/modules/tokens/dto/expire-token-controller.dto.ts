import { IsDefined, IsOptional, IsUUID } from "class-validator";
import { CurrentUser } from "../../users/interfaces";

export class ExpireTokenControllerDto {
  @IsUUID()
  @IsDefined()
  token: string;
}
