const express = require('express');
const { auth, teacherOrAdmin } = require('../middleware/auth');
const {
  createAssignment,
  getAssignmentsByCourse,
  getAssignmentById,
  submitAssignment,
  gradeAssignment,
  deleteAssignment
} = require('../controllers/assignmentController');

const router = express.Router();

// Public routes
router.get('/course/:courseId', getAssignmentsByCourse);
router.get('/:assignmentId', getAssignmentById);

// Protected routes
router.post('/', auth, teacherOrAdmin, createAssignment);
router.post('/:assignmentId/submit', auth, submitAssignment);
router.put('/:assignmentId/submission/:submissionId/grade', auth, teacherOrAdmin, gradeAssignment);
router.delete('/:assignmentId', auth, teacherOrAdmin, deleteAssignment);

module.exports = router;
