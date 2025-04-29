import { IsEnum, IsNumber } from "class-validator";
import { StatusDepoyment } from "../../generated/prisma";
import { DBBase } from "../database.model";

export class DepoymentModel extends DBBase {
  @IsEnum(StatusDepoyment)
  status!: string;

  @IsNumber()
  project_id!: number;

  @IsNumber()
  user_id!: number;
}
