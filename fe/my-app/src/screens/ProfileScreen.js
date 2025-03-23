import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  StatusBar,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons";
import { logout } from "../redux/slices/authSlice";
import CustomButton from "../components/CustomButton.js";
import CustomInput from "../components/CustomInput";

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [user, setUser] = useState(auth?.user || null);

  useEffect(() => {
    setUser(auth?.user || null);
  }, [auth]);
  const [profile, setProfile] = useState(user);

  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(profile?.username || "");
  const [email, setEmail] = useState(profile?.email || "");

  // Khởi tạo giá trị ban đầu khi bắt đầu chỉnh sửa
  const handleStartEditing = () => {
    setUsername(profile?.username || "");
    setEmail(profile?.email || "");
    setIsEditing(true);
  };

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đồng ý",
        onPress: () => {
          dispatch(logout());
          navigation.navigate("LoginScreen");
        },
      },
    ]);
  };

  const handleLogin = () => {
    navigation.navigate("LoginScreen");
  };

  const handleSaveProfile = () => {
    const updatedProfile = {
      _id: user._id,
      username,
      email,
    };

    dispatch(updateUserProfile(updatedProfile))
      .unwrap()
      .then(() => {
        setIsEditing(false);
        Alert.alert("Thành công", "Thông tin cá nhân đã được cập nhật");
      })
      .catch((error) => {
        Alert.alert(
          "Lỗi",
          error.message || "Có lỗi xảy ra khi cập nhật thông tin"
        );
      });
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar backgroundColor="#ff80ab" barStyle="light-content" />
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: "https://via.placeholder.com/150" }}
              style={styles.avatar}
            />
            <TouchableOpacity
              style={styles.editAvatarButton}
              onPress={() =>
                Alert.alert("Thông báo", "Tính năng đang phát triển")
              }
            >
              <Icon name="camera-alt" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.name}>{profile?.username || "Người dùng"}</Text>
            <View style={styles.roleContainer}>
              <Icon name="verified" size={14} color="#fff" />
              <Text style={styles.role}>{profile?.role || "Khách hàng"}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={isEditing ? () => setIsEditing(false) : handleStartEditing}
          >
            <Icon name={isEditing ? "close" : "edit"} size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.contentContainer}>
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>

          {isEditing ? (
            <>
              <CustomInput
                label="Tên người dùng"
                value={username}
                onChangeText={setUsername}
                icon="person"
                style={styles.input}
              />
              <CustomInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                icon="email"
                style={styles.input}
              />
              <CustomButton
                title="Lưu thông tin"
                onPress={handleSaveProfile}
                style={styles.saveButton}
                textStyle={styles.saveButtonText}
              />
            </>
          ) : (
            <>
              <View style={styles.infoRow}>
                <View style={styles.iconContainer}>
                  <Icon name="person" size={18} color="#fff" />
                </View>
                <Text style={styles.infoLabel}>Tên người dùng:</Text>
                <Text style={styles.infoValue}>
                  {profile?.username || "Chưa cập nhật"}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.iconContainer}>
                  <Icon name="email" size={18} color="#fff" />
                </View>
                <Text style={styles.infoLabel}>Email:</Text>
                <Text style={styles.infoValue}>
                  {profile?.email || "Chưa cập nhật"}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.iconContainer}>
                  <Icon name="verified-user" size={18} color="#fff" />
                </View>
                <Text style={styles.infoLabel}>Vai trò:</Text>
                <Text style={styles.infoValue}>
                  {profile?.role || "Khách hàng"}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.iconContainer}>
                  <Icon name="date-range" size={18} color="#fff" />
                </View>
                <Text style={styles.infoLabel}>Ngày tạo:</Text>
                <Text style={styles.infoValue}>
                  {profile?.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString("vi-VN")
                    : "Chưa cập nhật"}
                </Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Tài khoản</Text>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("ChangePassword")}
          >
            <View style={styles.actionIconContainer}>
              <Icon name="lock" size={22} color="#fff" />
            </View>
            <Text style={styles.actionText}>Đổi mật khẩu</Text>
            <Icon name="chevron-right" size={22} color="#ff80ab" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("OrderHistory")}
          >
            <View style={styles.actionIconContainer}>
              <Icon name="shopping-bag" size={22} color="#fff" />
            </View>
            <Text style={styles.actionText}>Lịch sử đơn hàng</Text>
            <Icon name="chevron-right" size={22} color="#ff80ab" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("Addresses")}
          >
            <View style={styles.actionIconContainer}>
              <Icon name="location-on" size={22} color="#fff" />
            </View>
            <Text style={styles.actionText}>Địa chỉ của tôi</Text>
            <Icon name="chevron-right" size={22} color="#ff80ab" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("Settings")}
          >
            <View style={styles.actionIconContainer}>
              <Icon name="settings" size={22} color="#fff" />
            </View>
            <Text style={styles.actionText}>Cài đặt</Text>
            <Icon name="chevron-right" size={22} color="#ff80ab" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              Alert.alert("Thông báo", "Tính năng đang phát triển")
            }
          >
            <View style={styles.actionIconContainer}>
              <Icon name="help-outline" size={22} color="#fff" />
            </View>
            <Text style={styles.actionText}>Trợ giúp & Hỗ trợ</Text>
            <Icon name="chevron-right" size={22} color="#ff80ab" />
          </TouchableOpacity>
        </View>

        {user ? (
          <CustomButton
            title="Đăng xuất"
            onPress={handleLogout}
            style={styles.logoutButton}
            textStyle={styles.logoutText}
            icon="logout"
          />
        ) : (
          <CustomButton
            title="Đăng nhập"
            onPress={handleLogin}
            style={styles.loginButton}
            textStyle={styles.loginText}
            icon="login"
          />
        )}

        <View style={styles.version}>
          <Text style={styles.versionText}>Phiên bản 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    backgroundColor: "#ff80ab",
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#ffffff",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#ff4081",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  userInfo: {
    marginLeft: 15,
    flex: 1,
  },
  name: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
  },
  roleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  role: {
    color: "#ffffff",
    fontSize: 14,
    marginLeft: 5,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 15,
    marginTop: -20,
  },
  infoSection: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#ff4081",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#ff80ab",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  infoLabel: {
    width: 120,
    fontSize: 15,
    color: "#757575",
  },
  infoValue: {
    flex: 1,
    fontSize: 15,
    color: "#333333",
    fontWeight: "500",
  },
  input: {
    marginBottom: 15,
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: "#ff4081",
    borderRadius: 10,
    height: 50,
  },
  saveButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  actionsSection: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  actionIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#ff80ab",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    color: "#333333",
  },
  logoutButton: {
    marginBottom: 20,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    height: 50,
    elevation: 2,
  },
  logoutText: {
    color: "#ff4081",
    fontWeight: "bold",
    fontSize: 16,
  },
  loginButton: {
    marginBottom: 20,
    backgroundColor: "#ff4081",
    borderRadius: 10,
    height: 50,
  },
  loginText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  version: {
    alignItems: "center",
    paddingVertical: 20,
  },
  versionText: {
    color: "#ff80ab",
    fontSize: 14,
  },
});

export default ProfileScreen;
