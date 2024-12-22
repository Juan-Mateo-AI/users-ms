import { Body, Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CompaniesService } from "./companies.service";
import { CompanyIdDto } from "./dto/company-id.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";

@Controller()
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @MessagePattern("companies.update")
  update(@Body() { companyId, currentUser, company }: UpdateCompanyDto) {
    return this.companiesService.update(companyId, currentUser, company);
  }

  @MessagePattern("companies.find")
  findOneById(@Payload() { companyId }: CompanyIdDto) {
    return this.companiesService.findOneById(companyId);
  }
}
