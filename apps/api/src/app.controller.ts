import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Health Check & Root')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Vérification du statut en direct du backend API' })
  getRoot() {
    return {
      service: "Aller-Retour API Panafricaine",
      status: "ONLINE",
      version: "1.0.0",
      region: "Sénégal / UEMOA",
      timestamp: new Date().toISOString(),
      documentationUrl: "/docs",
      message: "Le serveur d'orchestration et de séquestre financier fonctionne à la perfection."
    };
  }
}
