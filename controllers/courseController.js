const Course = require('../models/Course');
const Assignment = require('../models/Assignment');

// Create course
const createCourse = async (req, res) => {
  try {
    const { title, description, subject, grade, content, fileUrl, duration } = req.body;
    
    if (!title || !description || !subject || !grade || !content) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
      });
    }
    
    const course = await Course.create({
      title,
      description,
      subject,
      grade,
      content,
      fileUrl,
      duration,
      teacher: req.userId
    });
    
    res.status(201).json({
      success: true,
      message: 'Tạo bài học thành công',
      course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo bài học',
      error: error.message
    });
  }
};

// Get all courses
const getAllCourses = async (req, res) => {
  try {
    const { subject, grade, limit = 50, skip = 0 } = req.query;
    
    let query = { isPublished: true };
    if (subject) query.subject = subject;
    if (grade) query.grade = grade;
    
    const courses = await Course.find(query)
      .populate('teacher', 'fullName email')
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .sort({ createdAt: -1 });
    
    const total = await Course.countDocuments(query);
    
    res.json({
      success: true,
      courses,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách bài học'
    });
  }
};

// Get course by ID
const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const course = await Course.findByIdAndUpdate(
      courseId,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('teacher', 'fullName email');
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Bài học không tìm thấy'
      });
    }
    
    res.json({
      success: true,
      course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy bài học'
    });
  }
};

// Update course
const updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, subject, grade, content, fileUrl, duration, isPublished } = req.body;
    
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Bài học không tìm thấy'
      });
    }
    
    // Check if user is teacher of this course
    if (course.teacher.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền cập nhật bài học này'
      });
    }
    
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        title: title || course.title,
        description: description || course.description,
        subject: subject || course.subject,
        grade: grade || course.grade,
        content: content || course.content,
        fileUrl: fileUrl !== undefined ? fileUrl : course.fileUrl,
        duration: duration || course.duration,
        isPublished: isPublished !== undefined ? isPublished : course.isPublished
      },
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      message: 'Cập nhật bài học thành công',
      course: updatedCourse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật bài học',
      error: error.message
    });
  }
};

// Delete course
const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Bài học không tìm thấy'
      });
    }
    
    if (course.teacher.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xóa bài học này'
      });
    }
    
    await Course.findByIdAndDelete(courseId);
    await Assignment.deleteMany({ course: courseId });
    
    res.json({
      success: true,
      message: 'Xóa bài học thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa bài học'
    });
  }
};

// Get teacher courses
const getTeacherCourses = async (req, res) => {
  try {
    const { limit = 50, skip = 0 } = req.query;
    
    const courses = await Course.find({ teacher: req.userId })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .sort({ createdAt: -1 });
    
    const total = await Course.countDocuments({ teacher: req.userId });
    
    res.json({
      success: true,
      courses,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy bài học'
    });
  }
};

// Enroll student in course
const enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Bài học không tìm thấy'
      });
    }
    
    // Check if already enrolled
    if (course.students.includes(req.userId)) {
      return res.status(400).json({
        success: false,
        message: 'Bạn đã đăng ký bài học này'
      });
    }
    
    course.students.push(req.userId);
    await course.save();
    
    res.json({
      success: true,
      message: 'Đăng ký bài học thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi đăng ký bài học'
    });
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getTeacherCourses,
  enrollCourse
};
