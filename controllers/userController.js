const User = require('../models/User');

// Get user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Người dùng không tìm thấy'
      });
    }
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy hồ sơ'
    });
  }
};

// Update profile
const updateProfile = async (req, res) => {
  try {
    const { fullName, phone, avatar, class: className } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        fullName: fullName || undefined,
        phone: phone || undefined,
        avatar: avatar || undefined,
        class: className || undefined
      },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json({
      success: true,
      message: 'Cập nhật hồ sơ thành công',
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật hồ sơ',
      error: error.message
    });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, passwordConfirm } = req.body;
    
    if (!oldPassword || !newPassword || !passwordConfirm) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin'
      });
    }
    
    if (newPassword !== passwordConfirm) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu mới không khớp'
      });
    }
    
    const user = await User.findById(req.userId).select('+password');
    
    const isPasswordMatch = await user.matchPassword(oldPassword);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Mật khẩu cũ không chính xác'
      });
    }
    
    user.password = newPassword;
    await user.save();
    
    res.json({
      success: true,
      message: 'Đổi mật khẩu thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi đổi mật khẩu'
    });
  }
};

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const { role, search, limit = 50, skip = 0 } = req.query;
    
    let query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const users = await User.find(query)
      .select('-password')
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .sort({ createdAt: -1 });
    
    const total = await User.countDocuments(query);
    
    res.json({
      success: true,
      users,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách người dùng'
    });
  }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findByIdAndDelete(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Người dùng không tìm thấy'
      });
    }
    
    res.json({
      success: true,
      message: 'Xóa người dùng thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa người dùng'
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  deleteUser
};
