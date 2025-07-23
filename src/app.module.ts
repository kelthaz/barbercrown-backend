// src/app.module.ts
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AppointmentsModule } from './appoitments/appointment.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
// Aquí agregarás más módulos luego

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AppointmentsModule,
    AuthModule,
    RolesModule
  ],
})
export class AppModule {}
