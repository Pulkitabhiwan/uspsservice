/*
------------------------------------------------------------------------------ 
This code was generated by Amplication. 
 
Changes to this file will be lost if the code is regenerated. 

There are other ways to to customize your code, see this doc to learn more
https://docs.amplication.com/how-to/custom-code

------------------------------------------------------------------------------
  */
import { ArgsType, Field } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { TrackingWhereUniqueInput } from "./TrackingWhereUniqueInput";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { TrackingUpdateInput } from "./TrackingUpdateInput";

@ArgsType()
class UpdateTrackingArgs {
  @ApiProperty({
    required: true,
    type: () => TrackingWhereUniqueInput,
  })
  @ValidateNested()
  @Type(() => TrackingWhereUniqueInput)
  @Field(() => TrackingWhereUniqueInput, { nullable: false })
  where!: TrackingWhereUniqueInput;

  @ApiProperty({
    required: true,
    type: () => TrackingUpdateInput,
  })
  @ValidateNested()
  @Type(() => TrackingUpdateInput)
  @Field(() => TrackingUpdateInput, { nullable: false })
  data!: TrackingUpdateInput;
}

export { UpdateTrackingArgs as UpdateTrackingArgs };
