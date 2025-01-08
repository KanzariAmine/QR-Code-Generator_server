"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const path = require("path");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        cors: true,
    });
    app.useStaticAssets(path.join(__dirname, '..', 'uploads'), {
        prefix: '/uploads',
    });
    await app.listen(3001);
}
bootstrap();
//# sourceMappingURL=main.js.map