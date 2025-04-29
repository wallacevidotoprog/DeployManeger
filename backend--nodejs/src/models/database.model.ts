import { IsDate, IsNumber, IsOptional } from "class-validator";

export abstract class DBBase {
  @IsNumber()
  @IsOptional()
  id!: number;

  @IsDate()
  @IsOptional()
  createdAt!: Date;

  @IsDate()
  @IsOptional()
  updatedAt!: Date;
}
