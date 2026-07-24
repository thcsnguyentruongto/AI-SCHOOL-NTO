const express = require('express');
const { auth, teacherOrAdmin } = require('../middleware/auth');
const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getTeacherCourses,
  enrollCourse
} = require('../controllers/courseController');

const router = express.Router();

// Public routes
router.get('/', getAllCourses);
router.get('/:courseId', getCourseById);

// Protected routes
router.post('/', auth, teacherOrAdmin, createCourse);
router.put('/:courseId', auth, teacherOrAdmin, updateCourse);
router.delete('/:courseId', auth, teacherOrAdmin, deleteCourse);
router.get('/teacher/my-courses', auth, getTeacherCourses);
router.post('/:courseId/enroll', auth, enrollCourse);

module.exports = router;
