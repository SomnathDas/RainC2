import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreateResultDto {

    task_id : string;
    contents : string;
    success : string;

}