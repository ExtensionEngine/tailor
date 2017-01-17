import settings from '../../config/shared';

function formatRole(role) {
  return role
    .toLowerCase()
    .split('_')
    .map(r => `${r[0].toUpperCase()}${r.substr(1)}`)
    .join(' ');
}

// TODO(marko): Should be replaced with unique list of roles returned
// from server.
export function getAdministrativeRoles(user) {
  let showRoles = [];
  const { SYSTEM_ADMIN, ADMIN, CONTENT_AUTHOR } = settings.role;

  if (user.role === SYSTEM_ADMIN) {
    showRoles = [ADMIN, CONTENT_AUTHOR];
  } else if (user.role === ADMIN) {
    showRoles = [CONTENT_AUTHOR];
  }

  return showRoles.map(role => ({
    value: role,
    render: formatRole(role)
  }));
}
