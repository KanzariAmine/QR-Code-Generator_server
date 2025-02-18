import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCanvas, loadImage } from 'canvas';
import * as path from 'path';
import * as QRCode from 'qrcode';
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
  async getUserInfo() {
    const url = `${this.dropboxApiUrl}/users/get_current_account`;
    const headers = {
      Authorization: `Bearer ${this.accessToken}`,
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
      // Step 1: Generate QR code as a canvas
      const canvas = createCanvas(500, 500);
      await QRCode.toCanvas(canvas, data, {
        errorCorrectionLevel: 'H',
        margin: 2,
      });

      // Step 2: Load the logo image
      const ctx = canvas.getContext('2d');
      const logo = await loadImage(logoPath);

      // Step 3: Draw the logo on the center of the QR code
      const logoSize = canvas.width * 0.2; // Logo size (20% of QR code width)
      const logoX = (canvas.width - logoSize) / 2; // Center horizontally
      const logoY = (canvas.height - logoSize) / 2; // Center vertically

      ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);

      // Step 4: Convert the canvas to a buffer and return it
      const buffer = canvas.toBuffer('image/png');
      const base64Image = `data:image/png;base64,${buffer.toString('base64')}`;
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
