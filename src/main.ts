import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TranslatorFilter } from 'nestjs-translator';
import { translatorService } from './common/translator/translator.provider';
import { ConfigService } from './common/config/config.service';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors();

    const config = new DocumentBuilder()
        .setTitle('Board API')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);

    const configService = app.get(ConfigService);

    app.useGlobalFilters(
        new TranslatorFilter(
            translatorService(configService.get('FALLBACK_LANGUAGE')),
        ),
    );

    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
