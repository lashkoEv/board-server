import { diskStorage } from 'multer';
import * as path from 'path';
import { FilesInterceptor } from '@nestjs/platform-express';

export const taskUploadDiskStorage = diskStorage({
    destination: './uploads/tasks',
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
});

export const AttachmentsDiskInterceptor = () =>
    FilesInterceptor('attachments', 10, {
        storage: taskUploadDiskStorage,
    });
