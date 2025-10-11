import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content!: string;


  //cocnlcude if it is uuid or number for id 
  @IsNumber()
  postId!: number;

  @IsOptional()
  @IsNumber()
  parentId?: number;
}