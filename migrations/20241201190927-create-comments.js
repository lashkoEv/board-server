'use strict';

module.exports = {
    up(queryInterface) {
        return queryInterface.sequelize.query(
            `
            CREATE TABLE IF NOT EXISTS comments (
                id INTEGER AUTO_INCREMENT,
                
                content TEXT NOT NULL,
                taskId INT NOT NULL,
                authorId INT NOT NULL,

                createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,

                PRIMARY KEY (id),
                CONSTRAINT commentsTaskIdFk FOREIGN KEY (taskId) REFERENCES tasks(id) ON DELETE CASCADE,
                CONSTRAINT commentsAuthorIdFk FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;
            `
                .replace(/\s+/gi, ' ')
                .trim(),
        );
    },
    down(queryInterface) {
        return queryInterface.sequelize.query('DROP TABLE IF EXISTS comments;');
    },
};
