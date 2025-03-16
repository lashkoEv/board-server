'use strict';

module.exports = {
    up(queryInterface) {
        return queryInterface.sequelize.query(
            `
            CREATE TABLE IF NOT EXISTS projectMembers (
                id INTEGER AUTO_INCREMENT,
                
                projectId INT NOT NULL,
                memberId INT NOT NULL,
        
                createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
                
                PRIMARY KEY (id),
                CONSTRAINT projectMembersProjectIdFk FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE,
                CONSTRAINT projectMembersMemberIdFk FOREIGN KEY (memberId) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`
                .replace(/\s+/gi, ' ')
                .trim(),
        );
    },
    down(queryInterface) {
        return queryInterface.sequelize.query(
            'DROP TABLE IF EXISTS projectMembers;',
        );
    },
};
