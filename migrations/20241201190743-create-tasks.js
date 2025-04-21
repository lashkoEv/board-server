'use strict';

module.exports = {
    up(queryInterface) {
        return queryInterface.sequelize.query(
            `
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER AUTO_INCREMENT,
                
                title VARCHAR(255) NOT NULL,
                description TEXT DEFAULT NULL,
                estimate INTEGER NOT NULL DEFAULT 0,
                projectId INT NOT NULL,
                columnId INT DEFAULT NULL,
                authorId INT DEFAULT NULL,
                assigneeId INT DEFAULT NULL,

                createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,

                PRIMARY KEY (id),
                CONSTRAINT tasksProjectIdFk FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE,
                CONSTRAINT tasksColumnIdFk FOREIGN KEY (columnId) REFERENCES columns(id) ON DELETE SET NULL,
                CONSTRAINT tasksAuthorIdFk FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE SET NULL,
                CONSTRAINT tasksAssigneeIdFk FOREIGN KEY (assigneeId) REFERENCES users(id) ON DELETE SET NULL
            ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`
                .replace(/\s+/gi, ' ')
                .trim(),
        );
    },
    down(queryInterface) {
        return queryInterface.sequelize.query('DROP TABLE IF EXISTS tasks;');
    },
};
