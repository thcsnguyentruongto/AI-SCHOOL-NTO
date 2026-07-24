module.exports = {
  ROLES: {
    STUDENT: 'student',
    TEACHER: 'teacher',
    ADMIN: 'admin',
    PARENT: 'parent'
  },
  SUBJECTS: [
    'Toán',
    'Văn',
    'Tiếng Anh',
    'Khoa học',
    'Lịch sử',
    'Địa lý',
    'Sinh học',
    'Vật lý',
    'Hóa học',
    'Công nghệ thông tin',
    'Khác'
  ],
  GRADES: ['6', '7', '8', '9'],
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  TOKEN_EXPIRY: '7d',
  DEFAULT_LIMIT: 50,
  MAX_LIMIT: 100,
  MESSAGES: {
    SUCCESS: 'Thành công',
    ERROR: 'Lỗi',
    NOT_FOUND: 'Không tìm thấy',
    UNAUTHORIZED: 'Không được phép',
    FORBIDDEN: 'Bị từ chối'
  }
};
