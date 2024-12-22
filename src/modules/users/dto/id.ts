import { IsDefined, IsUUID } from "class-validator";

export class IdDto {
  @IsDefined()
  @IsUUID()
  id: string;
}
