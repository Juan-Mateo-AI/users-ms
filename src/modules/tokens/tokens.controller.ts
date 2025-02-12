import { Body, Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { TokensService } from "./tokens.service";
import { ExpireTokenControllerDto, ValidateTokenControllerDto } from "./dto";

@Controller()
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @MessagePattern("tokens.validate")
  validateToken(@Payload() payload: ValidateTokenControllerDto) {
    return this.tokensService.validateToken(payload);
  }

  @MessagePattern("tokens.expireAndGetUser")
  expireTokenAndGetUser(@Payload() { token }: ExpireTokenControllerDto) {
    return this.tokensService.expireTokenAndGetUser(token);
  }
}
