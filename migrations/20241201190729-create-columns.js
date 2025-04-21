'use strict';

module.exports = {
    up(queryInterface) {
        return queryInterface.sequelize.query(
            `
            CREATE TABLE IF NOT EXISTS columns (
                id INTEGER AUTO_INCREMENT,
                
                title VARCHAR(255) NOT NULL,
                projectId INT NOT NULL,
                status INT NOT NULL DEFAULT 4 COMMENT '1 - toDo, 2 - inProgress, 3 - done, 4 - custom',
        
                createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
                
                PRIMARY KEY (id),
                CONSTRAINT columnsProjectIdFk FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE
            ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`
                .replace(/\s+/gi, ' ')
                .trim(),
        );
    },
    down(queryInterface) {
        return queryInterface.sequelize.query('DROP TABLE IF EXISTS columns;');
    },
};
