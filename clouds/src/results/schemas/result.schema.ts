import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ResultDocument = HydratedDocument<Result>;

@Schema()
export class Result {
    @Prop({ required: true })
    result_id : string;

    @Prop({ required: true, unique: true })
    task_id : string;

    @Prop({ required: true })
    contents : string;

    @Prop({ required: true })
    success: boolean;
}

export const ResultSchema = SchemaFactory.createForClass(Result)