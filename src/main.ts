import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule, {
    cors: true,
    bodyParser: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle("NorthGate E-Invoice API")
    .setDescription("NorthGate System Integrator — FIRS E-Invoicing Platform")
    .setVersion("1.0")
    .addTag("NorthGate")
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, documentFactory);

  await app.listen(process.env.PORT ?? 3000, "0.0.0.0");
}
bootstrap();
