"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const cookieParser = require("cookie-parser");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        cors: {
            origin: process.env.FRONTEND_URL || true,
            credentials: true,
        },
        bodyParser: true,
    });
    app.use(cookieParser());
    app.useGlobalFilters(new http_exception_filter_1.AllExceptionsFilter());
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.useGlobalInterceptors(new common_1.ClassSerializerInterceptor(app.get(core_1.Reflector)));
    if (process.env.NODE_ENV !== "production") {
        const config = new swagger_1.DocumentBuilder()
            .setTitle("NorthGate E-Invoice API")
            .setDescription("NorthGate System Integrator — FIRS E-Invoicing Platform")
            .setVersion("1.0")
            .addTag("NorthGate")
            .addBearerAuth()
            .build();
        const documentFactory = () => swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup("api", app, documentFactory);
    }
    await app.listen(process.env.PORT ?? 3000, "0.0.0.0");
}
bootstrap();
//# sourceMappingURL=main.js.map