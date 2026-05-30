import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuration CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Versioning des endpoints (/v1/...)
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Validation globale des DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Configuration Swagger (OpenAPI 3.0)
  const config = new DocumentBuilder()
    .setTitle('Aller-Retour Panafrican Mobility API')
    .setDescription("Documentation officielle de l'API SaaS et Marketplace de transport inter-urbain")
    .setVersion('1.0')
    .addBearerAuth()
    .addGlobalParameters({
      in: 'header',
      required: false,
      name: 'x-tenant-id',
      description: 'Identifiant du Transporteur (Company ID) pour le contexte multi-tenant',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Aller-Retour API démarrée avec succès sur le port ${port}`);
  console.log(`📚 Documentation OpenAPI disponible sur: http://localhost:${port}/docs`);
}
bootstrap();
