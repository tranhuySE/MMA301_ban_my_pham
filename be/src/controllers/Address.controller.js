const Address = require("../models/Address");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

const addressController = {
  getAllAddresses: async (req, res) => {
    try {
      const { userId } = req.params;

      const addresses = await Address.find({ user_id: userId }).sort({
        isDefault: -1,
        createdAt: -1,
      });

      return res.status(200).json({
        success: true,
        data: addresses,
      });
    } catch (error) {
      console.error("Error getting addresses:", error);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi lấy danh sách địa chỉ",
        error: error.message,
      });
    }
  },

  // Lấy một địa chỉ cụ thể
  getAddressById: async (req, res) => {
    try {
      const userId = req.user.id;
      const addressId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(addressId)) {
        return res.status(400).json({
          success: false,
          message: "ID địa chỉ không hợp lệ",
        });
      }

      const address = await Address.findOne({
        _id: addressId,
        user_id: userId,
      });

      if (!address) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy địa chỉ",
        });
      }

      return res.status(200).json({
        success: true,
        data: address,
      });
    } catch (error) {
      console.error("Error getting address by ID:", error);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi lấy thông tin địa chỉ",
        error: error.message,
      });
    }
  },

  // Tạo địa chỉ mới
  createAddress: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const userId = req.user.id;
      const {
        recipient,
        phoneNumber,
        province,
        district,
        ward,
        streetAddress,
        isDefault,
      } = req.body;

      let defaultValue = isDefault;
      if (isDefault === undefined) {
        const addressCount = await Address.countDocuments({ user_id: userId });
        if (addressCount === 0) {
          defaultValue = true;
        } else {
          defaultValue = false;
        }
      }

      const newAddress = new Address({
        user_id: userId,
        recipient,
        phoneNumber,
        province,
        district,
        ward,
        streetAddress,
        isDefault: defaultValue,
      });

      await newAddress.save();

      return res.status(201).json({
        success: true,
        message: "Tạo địa chỉ mới thành công",
        data: newAddress,
      });
    } catch (error) {
      console.error("Error creating address:", error);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi tạo địa chỉ mới",
        error: error.message,
      });
    }
  },

  // Cập nhật địa chỉ
  updateAddress: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const userId = req.user.id;
      const addressId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(addressId)) {
        return res.status(400).json({
          success: false,
          message: "ID địa chỉ không hợp lệ",
        });
      }

      const {
        recipient,
        phoneNumber,
        province,
        district,
        ward,
        streetAddress,
        isDefault,
      } = req.body;

      const address = await Address.findOne({
        _id: addressId,
        user_id: userId,
      });

      if (!address) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy địa chỉ",
        });
      }

      address.recipient = recipient || address.recipient;
      address.phoneNumber = phoneNumber || address.phoneNumber;
      address.province = province || address.province;
      address.district = district || address.district;
      address.ward = ward || address.ward;
      address.streetAddress = streetAddress || address.streetAddress;

      if (isDefault !== undefined) {
        address.isDefault = isDefault;
      }

      await address.save();

      return res.status(200).json({
        success: true,
        message: "Cập nhật địa chỉ thành công",
        data: address,
      });
    } catch (error) {
      console.error("Error updating address:", error);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi cập nhật địa chỉ",
        error: error.message,
      });
    }
  },

  // Đặt địa chỉ mặc định
  setDefaultAddress: async (req, res) => {
    try {
      const userId = req.user.id;
      const addressId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(addressId)) {
        return res.status(400).json({
          success: false,
          message: "ID địa chỉ không hợp lệ",
        });
      }

      await Address.updateMany(
        { user_id: userId },
        { $set: { isDefault: false } }
      );

      // Đặt địa chỉ được chọn là mặc định
      const updatedAddress = await Address.findOneAndUpdate(
        { _id: addressId, user_id: userId },
        { $set: { isDefault: true } },
        { new: true }
      );

      if (!updatedAddress) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy địa chỉ",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Đặt địa chỉ mặc định thành công",
        data: updatedAddress,
      });
    } catch (error) {
      console.error("Error setting default address:", error);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi đặt địa chỉ mặc định",
        error: error.message,
      });
    }
  },

  // Xóa địa chỉ
  deleteAddress: async (req, res) => {
    try {
      const userId = req.user.id;
      const addressId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(addressId)) {
        return res.status(400).json({
          success: false,
          message: "ID địa chỉ không hợp lệ",
        });
      }

      const address = await Address.findOne({
        _id: addressId,
        user_id: userId,
      });

      if (!address) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy địa chỉ",
        });
      }

      const wasDefault = address.isDefault;

      await address.deleteOne();

      if (wasDefault) {
        const oldestAddress = await Address.findOne({ user_id: userId }).sort({
          createdAt: 1,
        });

        if (oldestAddress) {
          oldestAddress.isDefault = true;
          await oldestAddress.save();
        }
      }

      return res.status(200).json({
        success: true,
        message: "Xóa địa chỉ thành công",
      });
    } catch (error) {
      console.error("Error deleting address:", error);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi xóa địa chỉ",
        error: error.message,
      });
    }
  },
};

module.exports = addressController;
