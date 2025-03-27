import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema()
export class Task {
    @Prop({ required: true })
    task_id : string;

    @Prop({ required: true })
    task_type : string;

    @Prop({type: "Object"})
    task_options : any;
}

export const TaskSchema = SchemaFactory.createForClass(Task)