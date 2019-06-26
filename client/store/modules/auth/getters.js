import { role } from 'shared';

export const user = ({ user }) => user.email ? user : null;

export const isAdmin = ({ user }) => user.role === role.user.ADMIN;
