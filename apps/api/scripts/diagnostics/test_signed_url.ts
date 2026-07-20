import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../src/app.module';
import { SupabaseService } from '../../src/core/supabase/supabase.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const supabase = app.get(SupabaseService);
  
  const keys = [
    'AA380VN_d4fcbd7e-6867-4fef-80a0-1cf3159403cd/documents/registration-card/front.jpg',
    'AA380VN_d4fcbd7e-6867-4fef-80a0-1cf3159403cd/documents/insurance/file.jpg',
    'AA380VN_d4fcbd7e-6867-4fef-80a0-1cf3159403cd/documents/technical-inspection/file.jpg'
  ];

  for (const key of keys) {
    const url = await supabase.getSignedUrl('vehicles', key);
    console.log(key, '->', url ? 'URL GENERATED' : 'NULL');
    
    // Check if file actually exists
    const { data } = await supabase.getClient().storage.from('vehicles').list(key.split('/').slice(0, -1).join('/'));
    console.log('List data for', key, ':', data);
  }
  
  await app.close();
}
bootstrap();
