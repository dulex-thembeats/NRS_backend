import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import {
  INestApplication,
  ValidationPipe,
  ClassSerializerInterceptor,
  Logger,
} from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AllExceptionsFilter } from "./common/filters/http-exception.filter";
import * as cookieParser from "cookie-parser";

function parseAllowedOrigins(value?: string): string[] {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
    .map((origin) => {
      try {
        return new URL(origin).origin;
      } catch {
        return origin.replace(/\/+$/, "");
      }
    });
}

async function bootstrap() {
  const logger = new Logger("Bootstrap");
  const app: INestApplication = await NestFactory.create(AppModule, {
    bodyParser: true,
  });

  const localOrigins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://localhost:5173",
  ];

  const allowedOrigins = Array.from(
    new Set([
      ...parseAllowedOrigins(process.env.FRONTEND_URL),
      ...parseAllowedOrigins(process.env.CORS_ORIGINS),
      ...localOrigins,
    ]),
  );

  if (
    process.env.NODE_ENV === "production" &&
    allowedOrigins.every((origin) => localOrigins.includes(origin))
  ) {
    logger.warn(
      "No production CORS origin is configured. Set FRONTEND_URL or CORS_ORIGINS to the deployed frontend origin.",
    );
  }

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: [
      "Content-Type",
      "Accept",
      "Authorization",
      "Cache-Control",
      "Pragma",
      "Expires",
      "x-requested-with", "x-tenant-key", "x-tenant-secret", "x-api-key", "x-api-secret",
    ],
  });



  app.use(cookieParser());
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
