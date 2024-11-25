import { IsNotEmpty, IsJSON, IsString, IsOptional, IsArray, IsEmpty } from "class-validator";

export class CreateTaskDto {

    @IsNotEmpty()
    @IsString()
    task_type: string;

    @IsOptional()
    @IsString({each: true})
    @IsJSON({each: true})
    task_options: string[];
    
}