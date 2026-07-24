const Assignment = require('../models/Assignment');

// Create assignment
const createAssignment = async (req, res) => {
  try {
    const { title, description, course, dueDate, content, fileUrl, maxScore } = req.body;
    
    if (!title || !description || !course || !dueDate || !content) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
      });
    }
    
    const assignment = await Assignment.create({
      title,
      description,
      course,
      teacher: req.userId,
      dueDate,
      content,
      fileUrl,
      maxScore
    });
    
    res.status(201).json({
      success: true,
      message: 'Tạo bài tập thành công',
      assignment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo bài tập',
      error: error.message
    });
  }
};

// Get assignments by course
const getAssignmentsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { limit = 50, skip = 0 } = req.query;
    
    const assignments = await Assignment.find({ course: courseId })
      .populate('teacher', 'fullName')
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .sort({ dueDate: 1 });
    
    const total = await Assignment.countDocuments({ course: courseId });
    
    res.json({
      success: true,
      assignments,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách bài tập'
    });
  }
};

// Get assignment by ID
const getAssignmentById = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    
    const assignment = await Assignment.findById(assignmentId)
      .populate('teacher', 'fullName email')
      .populate('submissions.student', 'fullName email');
    
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Bài tập không tìm thấy'
      });
    }
    
    res.json({
      success: true,
      assignment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy bài tập'
    });
  }
};

// Submit assignment
const submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { fileUrl } = req.body;
    
    const assignment = await Assignment.findById(assignmentId);
    
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Bài tập không tìm thấy'
      });
    }
    
    // Check if already submitted
    const existingSubmission = assignment.submissions.find(
      sub => sub.student.toString() === req.userId
    );
    
    if (existingSubmission) {
      existingSubmission.submittedAt = new Date();
      existingSubmission.fileUrl = fileUrl;
    } else {
      assignment.submissions.push({
        student: req.userId,
        submittedAt: new Date(),
        fileUrl
      });
    }
    
    await assignment.save();
    
    res.json({
      success: true,
      message: 'Nộp bài tập thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi nộp bài tập'
    });
  }
};

// Grade assignment
const gradeAssignment = async (req, res) => {
  try {
    const { assignmentId, submissionId } = req.params;
    const { grade, feedback } = req.body;
    
    const assignment = await Assignment.findById(assignmentId);
    
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Bài tập không tìm thấy'
      });
    }
    
    const submission = assignment.submissions.id(submissionId);
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Bài nộp không tìm thấy'
      });
    }
    
    submission.grade = grade;
    submission.feedback = feedback;
    
    await assignment.save();
    
    res.json({
      success: true,
      message: 'Chấm điểm thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi chấm điểm'
    });
  }
};

// Delete assignment
const deleteAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    
    const assignment = await Assignment.findById(assignmentId);
    
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Bài tập không tìm thấy'
      });
    }
    
    if (assignment.teacher.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xóa bài tập này'
      });
    }
    
    await Assignment.findByIdAndDelete(assignmentId);
    
    res.json({
      success: true,
      message: 'Xóa bài tập thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa bài tập'
    });
  }
};

module.exports = {
  createAssignment,
  getAssignmentsByCourse,
  getAssignmentById,
  submitAssignment,
  gradeAssignment,
  deleteAssignment
};
