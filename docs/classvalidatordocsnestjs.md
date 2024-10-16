Class validator#
Warning
The techniques in this section require TypeScript and are not available if your app is written using vanilla JavaScript.
Let's look at an alternate implementation for our validation technique.

Nest works well with the class-validator library. This powerful library allows you to use decorator-based validation. Decorator-based validation is extremely powerful, especially when combined with Nest's Pipe capabilities since we have access to the metatype of the processed property. Before we start, we need to install the required packages:

$ npm i --save class-validator class-transformer
Once these are installed, we can add a few decorators to the CreateCatDto class. Here we see a significant advantage of this technique: the CreateCatDto class remains the single source of truth for our Post body object (rather than having to create a separate validation class).

create-cat.dto.tsJS

import { IsString, IsInt } from 'class-validator';

export class CreateCatDto {
@IsString()
name: string;

@IsInt()
age: number;

@IsString()
breed: string;
}
Hint
Read more about the class-validator decorators here.
Now we can create a ValidationPipe class that uses these annotations.

validation.pipe.tsJS

import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
async transform(value: any, { metatype }: ArgumentMetadata) {
if (!metatype || !this.toValidate(metatype)) {
return value;
}
const object = plainToInstance(metatype, value);
const errors = await validate(object);
if (errors.length > 0) {
throw new BadRequestException('Validation failed');
}
return value;
}

private toValidate(metatype: Function): boolean {
const types: Function[] = [String, Boolean, Number, Array, Object];
return !types.includes(metatype);
}
}
Hint
As a reminder, you don't have to build a generic validation pipe on your own since the ValidationPipe is provided by Nest out-of-the-box. The built-in ValidationPipe offers more options than the sample we built in this chapter, which has been kept basic for the sake of illustrating the mechanics of a custom-built pipe. You can find full details, along with lots of examples here.
Notice
We used the class-transformer library above which is made by the same author as the class-validator library, and as a result, they play very well together.
Let's go through this code. First, note that the transform() method is marked as async. This is possible because Nest supports both synchronous and asynchronous pipes. We make this method async because some of the class-validator validations can be async (utilize Promises).

Next note that we are using destructuring to extract the metatype field (extracting just this member from an ArgumentMetadata) into our metatype parameter. This is just shorthand for getting the full ArgumentMetadata and then having an additional statement to assign the metatype variable.

Next, note the helper function toValidate(). It's responsible for bypassing the validation step when the current argument being processed is a native JavaScript type (these can't have validation decorators attached, so there's no reason to run them through the validation step).

Next, we use the class-transformer function plainToInstance() to transform our plain JavaScript argument object into a typed object so that we can apply validation. The reason we must do this is that the incoming post body object, when deserialized from the network request, does not have any type information (this is the way the underlying platform, such as Express, works). Class-validator needs to use the validation decorators we defined for our DTO earlier, so we need to perform this transformation to treat the incoming body as an appropriately decorated object, not just a plain vanilla object.

Finally, as noted earlier, since this is a validation pipe it either returns the value unchanged, or throws an exception.

The last step is to bind the ValidationPipe. Pipes can be parameter-scoped, method-scoped, controller-scoped, or global-scoped. Earlier, with our Zod-based validation pipe, we saw an example of binding the pipe at the method level. In the example below, we'll bind the pipe instance to the route handler @Body() decorator so that our pipe is called to validate the post body.

cats.controller.tsJS

@Post()
async create(
@Body(new ValidationPipe()) createCatDto: CreateCatDto,
) {
this.catsService.create(createCatDto);
}
Parameter-scoped pipes are useful when the validation logic concerns only one specified parameter.

Global scoped pipes#
Since the ValidationPipe was created to be as generic as possible, we can realize its full utility by setting it up as a global-scoped pipe so that it is applied to every route handler across the entire application.

main.tsJS

async function bootstrap() {
const app = await NestFactory.create(AppModule);
app.useGlobalPipes(new ValidationPipe());
await app.listen(3000);
}
bootstrap();
Notice
In the case of hybrid apps the useGlobalPipes() method doesn't set up pipes for gateways and microservices. For "standard" (non-hybrid) microservice apps, useGlobalPipes() does mount pipes globally.
Global pipes are used across the whole application, for every controller and every route handler.

Note that in terms of dependency injection, global pipes registered from outside of any module (with useGlobalPipes() as in the example above) cannot inject dependencies since the binding has been done outside the context of any module. In order to solve this issue, you can set up a global pipe directly from any module using the following construction:

app.module.tsJS

import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

@Module({
providers: [
{
provide: APP_PIPE,
useClass: ValidationPipe,
},
],
})
export class AppModule {}
Hint
When using this approach to perform dependency injection for the pipe, note that regardless of the module where this construction is employed, the pipe is, in fact, global. Where should this be done? Choose the module where the pipe (ValidationPipe in the example above) is defined. Also, useClass is not the only way of dealing with custom provider registration. Learn more here.
The built-in ValidationPipe#
As a reminder, you don't have to build a generic validation pipe on your own since the ValidationPipe is provided by Nest out-of-the-box. The built-in ValidationPipe offers more options than the sample we built in this chapter, which has been kept basic for the sake of illustrating the mechanics of a custom-built pipe. You can find full details, along with lots of examples here.

Transformation use case#
Validation isn't the only use case for custom pipes. At the beginning of this chapter, we mentioned that a pipe can also transform the input data to the desired format. This is possible because the value returned from the transform function completely overrides the previous value of the argument.

When is this useful? Consider that sometimes the data passed from the client needs to undergo some change - for example converting a string to an integer - before it can be properly handled by the route handler method. Furthermore, some required data fields may be missing, and we would like to apply default values. Transformation pipes can perform these functions by interposing a processing function between the client request and the request handler.

Here's a simple ParseIntPipe which is responsible for parsing a string into an integer value. (As noted above, Nest has a built-in ParseIntPipe that is more sophisticated; we include this as a simple example of a custom transformation pipe).

parse-int.pipe.tsJS

import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
transform(value: string, metadata: ArgumentMetadata): number {
const val = parseInt(value, 10);
if (isNaN(val)) {
throw new BadRequestException('Validation failed');
}
return val;
}
}
We can then bind this pipe to the selected param as shown below:

JS

@Get(':id')
async findOne(@Param('id', new ParseIntPipe()) id) {
return this.catsService.findOne(id);
}
Another useful transformation case would be to select an existing user entity from the database using an id supplied in the request:

JS

@Get(':id')
findOne(@Param('id', UserByIdPipe) userEntity: UserEntity) {
return userEntity;
}
We leave the implementation of this pipe to the reader, but note that like all other transformation pipes, it receives an input value (an id) and returns an output value (a UserEntity object). This can make your code more declarative and DRY by abstracting boilerplate code out of your handler and into a common pipe.

Providing defaults#
Parse* pipes expect a parameter's value to be defined. They throw an exception upon receiving null or undefined values. To allow an endpoint to handle missing querystring parameter values, we have to provide a default value to be injected before the Parse* pipes operate on these values. The DefaultValuePipe serves that purpose. Simply instantiate a DefaultValuePipe in the @Query() decorator before the relevant Parse\* pipe, as shown below:

JS

@Get()
async findAll(
@Query('activeOnly', new DefaultValuePipe(false), ParseBoolPipe) activeOnly: boolean,
@Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
) {
return this.catsService.findAll({ activeOnly, page });
}
