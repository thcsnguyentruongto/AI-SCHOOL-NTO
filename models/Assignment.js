const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Vui lòng nhập tên bài tập'],
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    dueDate: {
      type: Date,
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
    submissions: [{
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      submittedAt: Date,
      fileUrl: String,
      grade: Number,
      feedback: String
    }],
    maxScore: {
      type: Number,
      default: 100
    },
    isPublished: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

assignmentSchema.index({ course: 1, dueDate: 1 });
assignmentSchema.index({ teacher: 1, createdAt: -1 });

module.exports = mongoose.model('Assignment', assignmentSchema);
