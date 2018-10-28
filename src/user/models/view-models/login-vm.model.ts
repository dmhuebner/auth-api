import { ApiModelProperty } from '@nestjs/swagger';

export class LoginVm {
  @ApiModelProperty()
  email: string;

  @ApiModelProperty()
  password: string;
}