export default {
  debug: {
    state: false
  },

  // TODO: should match user roles stored in db
  role: {
    STUDENT: {
      value: 'student',
      render: 'Student'
    },
    EDITOR: {
      value: 'editor',
      render: 'Editor'
    },
    COURSE_ADMIN: {
      value: 'course_admin',
      render: 'Course admin'
    },
    GLOBAL_ADMIN: {
      value: 'global_admin',
      render: 'Global admin'
    }
  }
};
