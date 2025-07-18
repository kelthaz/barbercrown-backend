import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔧 Agrega esta línea para habilitar validaciones en DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina campos no definidos en el DTO
      forbidNonWhitelisted: true, // lanza error si hay campos desconocidos
      transform: true, // transforma los payloads a instancias de DTOs
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Servicios para la Barbería')
    .setDescription(
      'Documentación de los endpoints de la API para la barbería.',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log('Servidor corriendo en http://localhost:3000');
}
bootstrap();
