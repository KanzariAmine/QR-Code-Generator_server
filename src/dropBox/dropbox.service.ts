import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import fs from 'fs/promises';
import * as path from 'path';
import * as QRCode from 'qrcode';
import sharp from 'sharp';
@Injectable()
export class DropboxService {
  private readonly dropboxApiUrl = 'https://api.dropboxapi.com/2';
  private readonly accessToken: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.accessToken = this.configService.get<string>('DROPBOX_ACCESS_TOKEN');
  }
  async getUserInfo(authHeader: string) {
    const url = `${this.dropboxApiUrl}/users/get_current_account`;
    const headers = {
      Authorization: authHeader,
      'Content-Type': 'application/json',
    };

    try {
      const response = await this.httpService
        .post(url, null, { headers })
        .toPromise();
      return response?.data;
    } catch (error) {
      throw new Error(`Dropbox API error: ${error.message}`);
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    path: string,
    authHeader: string,
  ) {
    const url = `https://content.dropboxapi.com/2/files/upload`;
    const headers = {
      Authorization: authHeader,
      'Content-Type': 'application/octet-stream', // Required for file uploads
      'Dropbox-API-Arg': JSON.stringify({
        path: `${path}/${file.originalname}`,
        mode: 'add',
        autorename: true,
        mute: false,
      }),
    };

    try {
      const response = await this.httpService
        .post(url, file.buffer, { headers })
        .toPromise();
      return response?.data;
    } catch (error) {
      throw new Error(
        `Dropbox API error: ${error.response?.data || error.message}`,
      );
    }
  }

  async getSharedLink(filePath: string, authHeader: string) {
    const url = `${this.dropboxApiUrl}/sharing/create_shared_link_with_settings`;
    const headers = {
      Authorization: authHeader,
      'Content-Type': 'application/json',
    };

    try {
      // Step 1: Check if the file already has a shared link
      const listUrl = `${this.dropboxApiUrl}/sharing/list_shared_links`;
      const listResponse = await this.httpService
        .post(listUrl, { path: filePath }, { headers })
        .toPromise();

      const existingLink = listResponse?.data?.links?.[0]?.url;
      if (existingLink) {
        console.log('✅ Shared link already exists:', existingLink);
        return existingLink; // ✅ Return existing link
      }

      // Step 2: If no existing link, create a new one
      // const createUrl = `${this.dropboxApiUrl}/sharing/create_shared_link_with_settings`;
      const body = {
        path: filePath,
        settings: {
          requested_visibility: 'public',
          allow_download: true,
        },
      };

      const response = await this.httpService
        .post(url, body, { headers })
        .toPromise();

      return response?.data?.url;
    } catch (error) {
      throw new Error(`Dropbox API error: ${error}`);
    }
  }

  async generateQRCodeWithLogo(data: string): Promise<String> {
    // Path to your logo file
    const logoPath = path.join(__dirname, '../../assets/kanpower_logo.jpg');

    try {
      // Step 1: Generate QR code as a buffer
      const qrBuffer = await QRCode.toBuffer(data, {
        errorCorrectionLevel: 'H',
        margin: 2,
        width: 500,
      });

      // Step 2: Load the logo image as a buffer
      const logoBuffer = await fs.readFile(logoPath);

      // Get metadata of the QR code to calculate logo size and position
      const qrMetadata = await sharp(qrBuffer).metadata();
      const logoSize = Math.floor(qrMetadata.width * 0.2); // Logo size (20% of QR code width)
      console.log(
        '🚀 ~ DropboxService ~ generateQRCodeWithLogo ~ logoSize:',
        logoSize,
      );

      // Step 3: Resize the logo
      const resizedLogo = await sharp(logoBuffer)
        .resize(logoSize, logoSize)
        .toBuffer();

      // Step 4: Composite the QR code and the logo
      const qrWithLogo = await sharp(qrBuffer)
        .composite([
          {
            input: resizedLogo,
            top: Math.floor((qrMetadata.height - logoSize) / 2),
            left: Math.floor((qrMetadata.width - logoSize) / 2),
          },
        ])
        .png()
        .toBuffer();

      // Step 5: Convert to base64
      const base64Image = `data:image/png;base64,${qrWithLogo.toString('base64')}`;

      return base64Image;
    } catch (error) {
      throw new BadRequestException('Failed to generate QR Code with logo');
    }
  }

  async getFilesInFolder(path: string, authHeader) {
    const url = `${this.dropboxApiUrl}/files/list_folder`;
    const headers = {
      Authorization: authHeader,
      'Content-Type': 'application/json',
    };

    const body = {
      path: path,
      recursive: false,
    };

    try {
      const response = await this.httpService
        .post(url, body, { headers })
        .toPromise();
      return response?.data.entries;
    } catch (error) {
      console.error(
        '🚨 Dropbox API Error:',
        error.response?.data || error.message,
      );
      throw new Error(
        `Dropbox API error: ${error.response?.data?.error_summary || error.message}`,
      );
    }
  }

  async deleteFile(filePath: string, authHeader) {
    const url = `${this.dropboxApiUrl}/files/delete_v2`;
    const headers = {
      Authorization: authHeader,
      'Content-Type': 'application/json',
    };

    const body = {
      path: filePath,
    };
    try {
      const response = await this.httpService
        .post(url, body, { headers })
        .toPromise();
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  }
}
