import { Injectable, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;
  private readonly logger = new Logger(SupabaseService.name);

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl) {
      this.logger.error('Missing required env: SUPABASE_URL');
      throw new Error('Missing required env: SUPABASE_URL');
    }

    if (!supabaseKey) {
      this.logger.error('Missing required env: SUPABASE_SERVICE_ROLE_KEY');
      throw new Error('Missing required env: SUPABASE_SERVICE_ROLE_KEY');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  async uploadFile(bucket: string, path: string, file: Express.Multer.File): Promise<string> {
    this.logger.log(`Starting Supabase upload: bucket=${bucket}, path=${path}, size=${file.size} bytes`);
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(path, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      this.logger.error(`Supabase upload error for ${path}: ${error.message}`);
      throw new Error(`Failed to upload file to Supabase: ${error.message}`);
    }

    this.logger.log(`Supabase upload successful: ${path}. Data: ${JSON.stringify(data)}`);
    return data.path;
  }

  async deleteFile(bucket: string, path: string): Promise<void> {
    const { error } = await this.supabase.storage.from(bucket).remove([path]);
    if (error) {
      this.logger.error(`Supabase delete error: ${error.message}`);
      throw new Error(`Failed to delete file from Supabase: ${error.message}`);
    }
  }

  async deleteFiles(bucket: string, paths: string[]): Promise<void> {
    if (!paths || paths.length === 0) return;
    const { error } = await this.supabase.storage.from(bucket).remove(paths);
    if (error) {
      this.logger.error(`Supabase deleteFiles error: ${error.message}`);
      throw new Error(`Failed to delete files from Supabase: ${error.message}`);
    }
  }

  async getSignedUrl(bucket: string, path: string, expiresIn: number = 3600): Promise<string | null> {
    if (!path) return null;
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) {
      this.logger.error(`Supabase signed URL error: ${error.message}`);
      return null;
    }

    return data.signedUrl;
  }
}
