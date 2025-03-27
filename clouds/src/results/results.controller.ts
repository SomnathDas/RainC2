import { Body, Controller, Get, Post } from '@nestjs/common';
import { ResultsService } from './results.service';
import { Result } from './schemas/result.schema';
import { CreateResultDto } from './dto/create-result.dto';

@Controller('results')
export class ResultsController {
    constructor(private readonly resultsService : ResultsService) {}

    @Get()
    fetchResults() : Promise<Result[]> {
        return this.resultsService.fetchAll();
    }

    @Post()
    createResult(@Body() createResultDto : CreateResultDto) : Promise<any> {
        return this.resultsService.createResult(createResultDto); 
    }

}
