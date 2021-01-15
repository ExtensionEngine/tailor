import get from 'lodash/get';
import { role } from 'shared';

export const isAdmin = ({ user }) => get(user, 'role') === role.user.ADMIN;

export const isOidcActive = ({ strategy }) => strategy === 'oidc';
