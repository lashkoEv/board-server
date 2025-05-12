'use strict';

module.exports = {
    up(queryInterface) {
        return queryInterface.sequelize.query(
            `
            CREATE TABLE IF NOT EXISTS taskAttachments (
                id INTEGER AUTO_INCREMENT,

                taskId INT NOT NULL,
                storedName VARCHAR(255) NOT NULL,
                originalName VARCHAR(255) NOT NULL,
                mimeType VARCHAR(100) DEFAULT NULL,
                size INTEGER DEFAULT NULL,
                url TEXT DEFAULT NULL,

                createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,

                PRIMARY KEY (id),
                CONSTRAINT taskAttachmentsTaskIdFk FOREIGN KEY (taskId) REFERENCES tasks(id) ON DELETE CASCADE
            ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`
                .replace(/\s+/gi, ' ')
                .trim(),
        );
    },
    down(queryInterface) {
        return queryInterface.sequelize.query(
            'DROP TABLE IF EXISTS taskAttachments;',
        );
    },
};
