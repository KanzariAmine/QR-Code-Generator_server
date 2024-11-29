import { BadRequestException, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as QRCode from 'qrcode';
@Injectable()
export class FileUploadService {
  handleFileUpload(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No File Uploaded');
    }
    //Validation file MappedType
    const allowedMimeTypes = ['application/pdf'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid File Type');
    }
    // validate file size (e.g., max 5mb)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('file is too large!');
    }

    // Generate QR Code for the PDF
    const serverUrl = 'http://192.168.1.3:3000';
    const fileUrl = `${serverUrl}/uploads/${file.filename}`;
    const qrCodeFilename = `${file.filename}-qrcode.png`;
    const qrCodePath = path.join(__dirname, '../../uploads', qrCodeFilename);

    return new Promise((resolve, reject) => {
      QRCode.toFile(
        qrCodePath,
        fileUrl, // Encode the file URL
        { width: 300 }, // Set QR code image size
        (err) => {
          if (err) {
            reject(new BadRequestException('Failed to generate QR Code'));
          } else {
            const qrCodeUrl = `${serverUrl}/uploads/${qrCodeFilename}`;
            resolve({
              message: 'File uploaded and QR Code generated successfully',
              filePath: file.path,
              qrCodeUrl,
            });
          }
        },
      );
    });
  }
}
