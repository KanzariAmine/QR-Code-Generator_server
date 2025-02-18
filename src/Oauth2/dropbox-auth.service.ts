import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class DropboxAuthService {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  constructor(private configService: ConfigService) {
    this.clientId = this.configService.get<string>('DROPBOX_CLIENT_ID');
    this.clientSecret = this.configService.get<string>('DROPBOX_CLIENT_SECRET');
    this.redirectUri = this.configService.get<string>('DROPBOX_REDIRECT_URI');
  }

  getAuthUrl(): string {
    return `${this.configService.get<string>('DROPBOX_AUTH_URL')}?client_id=${this.clientId}&token_access_type=offline&response_type=code`;
  }

  async getAccessToken(code: string): Promise<string> {
    const data = {
      code,
      grant_type: 'authorization_code',
      client_id: this.clientId,
      client_secret: this.clientSecret,
    };

    try {
      const response = await axios.post(
        this.configService.get<string>('DROPBOX_TOKEN_URL'),
        data,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );
      console.log('✅ Access token response:', response.data);

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('❌ Axios Error:', error.message);

        if (error.response) {
          // Handle known HTTP errors from Dropbox
          const status = error.response.status;
          const errorMessage =
            status === 400
              ? 'Invalid request: Check client_id, secret, and redirect_uri.'
              : status === 401
                ? 'Unauthorized: Invalid credentials.'
                : status === 403
                  ? 'Forbidden: Access denied.'
                  : status === 500
                    ? 'Server error: Dropbox API might be down.'
                    : `Error: ${status} - ${JSON.stringify(error.response.data)}`;

          throw new HttpException(
            {
              success: false,
              statusCode: status,
              // message: errorMessage,
              data: error.response.data || null,
            },
            status,
          );
        } else if (error.request) {
          throw new HttpException(
            {
              success: false,
              message:
                'No response from Dropbox API. Please check your network.',
            },
            HttpStatus.SERVICE_UNAVAILABLE,
          );
        }
      }

      // Handle unexpected errors
      throw new HttpException(
        {
          success: false,
          message: 'An unknown error occurred.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
