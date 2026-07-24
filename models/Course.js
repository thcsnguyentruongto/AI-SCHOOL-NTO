const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Vui lòng nhập tên bài học'],
      trim: true,
      maxlength: [200, 'Tên bài học không được vượt quá 200 ký tự']
    },
    description: {
      type: String,
      required: [true, 'Vui lòng nhập mô tả'],
      trim: true
    },
    subject: {
      type: String,
      enum: ['Toán', 'Văn', 'Tiếng Anh', 'Khoa học', 'Lịch sử', 'Địa lý', 'Sinh học', 'Vật lý', 'Hóa học', 'Công nghệ thông tin', 'Khác'],
      required: true
    },
    grade: {
      type: String,
      enum: ['6', '7', '8', '9'],
      required: true
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true
    },
    fileUrl: {
      type: String,
      default: null
    },
    duration: {
      type: Number,
      default: 60 // minutes
    },
    students: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    isPublished: {
      type: Boolean,
      default: false
    },
    views: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    }
  },
  {
    timestamps: true
  }
);

courseSchema.index({ teacher: 1, createdAt: -1 });
courseSchema.index({ subject: 1, grade: 1 });

module.exports = mongoose.model('Course', courseSchema);
