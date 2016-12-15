import settings from '../settings';

// TODO(marko): implement as plugin, inject current user?
/** Class for permission checking */
class Permissions {

  /**
   * @param  {type} roles - object with predefined roles
   * @example - inside component
   * // check if user is student or editor
   * computed: {
   *   const { isEditor, isStudent } = permissions;
   *   return permissions.checkPerms(user, [isEditor, isStudent]);
   * }
   */
  constructor(roles) {
    this.roles = roles;

    this.isGlobalAdmin = this.isGlobalAdmin.bind(this);
    this.isCourseAdmin = this.isCourseAdmin.bind(this);
    this.isEditor = this.isEditor.bind(this);
    this.isStudent = this.isStudent.bind(this);
  }

  /**
   * hasPermission - check if user has passed permission
   *
   * @param  {object} user - user data
   * @param  {string} role - role name
   * @return {boolean} check result
   */
  hasPermission(user, role) {
    return user.role === role;
  }

  /**
   * checkPerms - check if user has at least one permission
   *
   * @param  {object} user - user data
   * @param  {array} perms - array of permission checking functions
   * @return {boolean} allow or deny permission
   */
  checkPerms(user, perms) {
    let allow = false;
    perms.forEach(perm => { allow = allow || perm(user); });
    return allow;
  }

  /**
   * isGlobalAdmin - check if user is a global admin
   *
   * @param  {object} user - user data
   * @return {boolean} global admin role check
   */
  isGlobalAdmin(user) {
    const globalAdmin = this.roles.GLOBAL_ADMIN.value;
    return this.hasPermission(user, globalAdmin);
  }

  /**
   * isCourseAdmin - check if user is a course admin
   *
   * @param  {object} user - user data
   * @return {boolean} course admin role check
   */
  isCourseAdmin(user) {
    const courseAdmin = this.roles.COURSE_ADMIN.value;
    return this.hasPermission(user, courseAdmin);
  }

  /**
   * isEditor - check if user is an editor
   *
   * @param  {object} user - user data
   * @return {boolean} editor role check
   */
  isEditor(user) {
    const editor = this.roles.EDITOR.value;
    return this.hasPermission(user, editor);
  }

  /**
   * isStudent - check if user is a student
   *
   * @param  {object} user - user data
   * @return {boolean} student role check
   */
  isStudent(user) {
    const student = this.roles.STUDENT.value;
    return this.hasPermission(user, student);
  }

  isGlobalOrCourseAdmin(user) {
    return this.isGlobalAdmin(user) || this.isCourseAdmin(user);
  }
}

export default new Permissions(settings.role);
