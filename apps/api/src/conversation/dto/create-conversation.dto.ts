import { IsOptional, IsString, MaxLength , MinLength } from "class-validator";

export class CreateConversationDto {
  @IsOptional()
  @IsString()
  @MaxLength(32)
  emotion?: string;
}
export class CreateMessageDto {
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  content!: string;
}
