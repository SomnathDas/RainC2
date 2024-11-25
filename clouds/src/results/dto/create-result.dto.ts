import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreateResultDto {

    @IsNotEmpty()
    @IsString()
    task_id : string;

    @IsNotEmpty()
    @IsString()
    contents : string;

    @IsBoolean()
    success : boolean;

}