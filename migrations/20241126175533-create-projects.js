'use strict';

module.exports = {
    up(queryInterface) {
        return queryInterface.sequelize.query(
            `
            CREATE TABLE IF NOT EXISTS projects (
                id INTEGER AUTO_INCREMENT,
                
                title VARCHAR(255) NOT NULL,
                description TEXT NULL,
                ownerId INT NULL,
                
                createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
                
                PRIMARY KEY (id),
                CONSTRAINT projectsOwnerIdFk FOREIGN KEY (ownerId) REFERENCES users(id) ON DELETE SET NULL
            ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`
                .replace(/\s+/gi, ' ')
                .trim(),
        );
    },
    down(queryInterface) {
        return queryInterface.sequelize.query('DROP TABLE IF EXISTS projects;');
    },
};
