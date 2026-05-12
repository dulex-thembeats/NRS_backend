import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { INestApplication, ValidationPipe, ClassSerializerInterceptor } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AllExceptionsFilter } from "./common/filters/http-exception.filter";

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule, {
    cors: true,
    bodyParser: true,
  });

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  if (process.env.NODE_ENV !== "production") {
    const config = new DocumentBuilder()
      .setTitle("NorthGate E-Invoice API")
      .setDescription("NorthGate System Integrator — FIRS E-Invoicing Platform")
      .setVersion("1.0")
      .addTag("NorthGate")
      .addBearerAuth()
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, documentFactory);
  }

  await app.listen(process.env.PORT ?? 3000, "0.0.0.0");
}
bootstrap();
