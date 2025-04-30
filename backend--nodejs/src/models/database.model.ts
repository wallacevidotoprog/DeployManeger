import { IsDate, IsNumber, IsOptional } from "class-validator";

export interface DBBase {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export abstract class DBBaseValidator {
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
