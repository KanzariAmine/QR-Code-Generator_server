import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import BoxSDK from 'box-node-sdk';

// @Injectable()
// export class BoxService {
//   private sdk: BoxSDK;
//   private client: any;

//   constructor() {
//     const sdkConfig = {
//       boxAppSettings: {
//         clientID: process.env.BOX_CLIENT_ID,
//         clientSecret: process.env.BOX_CLIENT_SECRET,
//         appAuth: {
//           publicKeyID: process.env.BOX_PUBLIC_KEY_ID,
//           privateKey: process.env.BOX_PRIVATE_KEY.replace(/\\n/g, '\n'),
//           passphrase: process.env.BOX_PASSPHRASE,
//         },
//       },
//       // enterpriseID: 0,
//       userID: process.env.BOX_USER_ID,
//     };

//     // Validate required environment variables
//     if (
//       !sdkConfig.boxAppSettings.clientID ||
//       !sdkConfig.boxAppSettings.clientSecret ||
//       !sdkConfig.boxAppSettings.appAuth.publicKeyID ||
//       !sdkConfig.boxAppSettings.appAuth.privateKey ||
//       !sdkConfig.boxAppSettings.appAuth.passphrase ||
//       !sdkConfig.userID
//     ) {
//       throw new Error('Missing required environment variables for Box SDK');
//     }

//     // Initialize SDK
//     this.sdk = BoxSDK.getPreconfiguredInstance(sdkConfig);
//     this.client = this.sdk.getAppAuthClient('user', process.env.BOX_USER_ID);

//     console.log(
//       '✅ Box SDK initialized successfully for User ID:',
//       sdkConfig.userID,
//     );
//   }

//   async uploadFile(folderId: string, file: Express.Multer.File) {
//     if (!file) {
//       throw new BadRequestException('No file uploaded');
//     }

//     try {
//       console.log('Uploading file:', file.originalname);

//       const fileUpload = await this.client.files.uploadFile(
//         folderId, // Corrected: Pass folderId
//         file.originalname, // Corrected: Pass file name
//         file.buffer, // Corrected: Pass file content as buffer
//       );

//       console.log('File uploaded successfully:', fileUpload.entries[0]);

//       return {
//         fileId: fileUpload.entries[0].id,
//         fileName: fileUpload.entries[0].name,
//       };
//     } catch (error) {
//       throw new Error(`Box upload failed: ${error.message}`);
//     }
//   }

//   async getUser() {
//     try {
//       const userId = process.env.BOX_USER_ID;

//       // Validate user ID
//       if (!userId || userId.trim() === '') {
//         throw new Error('User ID is not set in environment variables');
//       }

//       // Fetch user details
//       const user = await this.client.users.get(userId);
//       console.log('✅ User Details:', user);
//       return user;
//     } catch (error) {
//       console.error('❌ Box API Error fetching user details:', error.message);
//       throw new Error(`Box API Error: ${error.message}`);
//     }
//   }
// }

@Injectable()
export class BoxService {
  private sdk: any;
  private client: any;

  constructor(private readonly configService: ConfigService) {
    // Initialize the SDK with app credentials
    this.sdk = new BoxSDK({
      clientID: this.configService.get('BOX_CLIENT_ID'),
      clientSecret: this.configService.get('BOX_CLIENT_SECRET'),

      appAuth: {
        keyID: this.configService.get('BOX_PUBLIC_KEY_ID'), // Ensure this is set
        privateKey: this.configService
          .get('BOX_PRIVATE_KEY')
          .replace(/\\n/g, '\n'),
        passphrase: this.configService.get('BOX_PASSPHRASE'),
      },
    });

    // Create an authenticated client for the specified user
    this.client = this.sdk.getAppAuthClient('user', '238020673');
    // this.client = this.sdk.getAppAuthClient('enterprise', '0');

    console.log('✅ Box SDK initialized successfully.');
  }

  /**
   * Get the current user's details
   */
  async getCurrentUser(): Promise<any> {
    try {
      // Fetch the current user's details
      const user = await this.client.users.get(this.client.CURRENT_USER_ID);
      console.log('Hello', user.name, '!');
      return user;
    } catch (error) {
      console.error('❌ Got an error fetching user details:', error.message);
      throw error;
    }
  }

  async uploadFile(folderId: string, file: Express.Multer.File) {
    console.log('🚀 ~ BoxService ~ uploadFile ~ folderId:', folderId);
    // console.log('🚀 ~ BoxService ~ uploadFile ~ file:', file);

    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    try {
      console.log('Uploading file:', file.originalname);

      const fileUpload = await this.client.files.uploadFile(
        folderId, // Corrected: Pass folderId
        file.originalname, // Corrected: Pass file name
        file.buffer, // Corrected: Pass file content as buffer
      );

      console.log('File uploaded successfully:', fileUpload.entries[0]);

      return {
        fileId: fileUpload.entries[0].id,
        fileName: fileUpload.entries[0].name,
      };
    } catch (error) {
      console.error('❌ Box API Error fetching user details:', error.message);
      throw new Error(`Box API Error: ${error.message}`);
    }
  }
}
