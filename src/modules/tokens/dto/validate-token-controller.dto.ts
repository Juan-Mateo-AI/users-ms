import { IsDefined, IsOptional, IsUUID } from "class-validator";
import { CurrentUser } from "../../users/interfaces";

export class ValidateTokenControllerDto {
  @IsDefined()
  type: string;

  @IsUUID()
  @IsDefined()
  token: string;
}
