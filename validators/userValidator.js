import { body } from 'express-validator';

export const updateUserRoleValidator = [
    body('id')
        .notEmpty().withMessage('User id is required')
        .isUUID().withMessage('User id must be a valid UUID'),

    body('newRole')
        .notEmpty().withMessage('New role is required')
        .isIn(['viewer', 'editor', 'admin']).withMessage('Invalid role provided'),
];
