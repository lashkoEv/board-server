import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'sequelize-typescript';
import { Attachment } from './models/attachment.entity';
import sequelize, { Op } from 'sequelize';

@Injectable()
export class AttachmentsService {
    constructor(
        @Inject('ATTACHMENT_MODEL')
        private readonly model: Repository<Attachment>,
    ) {}

    async bulkCreate(
        taskId: number,
        attachments: Express.Multer.File[],
        transaction?: sequelize.Transaction,
    ): Promise<Attachment[]> {
        const records = attachments.map((file) => ({
            taskId,
            storedName: file.filename,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            url: `/uploads/tasks/${file.filename}`,
        }));

        return this.model.bulkCreate(records, { transaction });
    }

    async deleteByTaskId(
        taskId: number,
        transaction?: sequelize.Transaction,
    ): Promise<void> {
        await this.model.destroy({ where: { taskId }, transaction });
    }

    async deleteExcept(
        taskId: number,
        keepIds: number[],
        transaction?: sequelize.Transaction,
    ) {
        const where: any = { taskId };

        if (keepIds?.length || typeof keepIds === 'number') {
            where.id = { [Op.notIn]: keepIds };
        } else {
            where.id = { [Op.not]: null };
        }

        await this.model.destroy({ where, transaction });
    }
}
