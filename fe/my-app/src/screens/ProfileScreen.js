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
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: "https://via.placeholder.com/150" }}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.name}>{profile?.username || "Người dùng"}</Text>
          <Text style={styles.role}>{profile?.role || "customer"}</Text>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditing(!isEditing)}
        >
          <Icon name={isEditing ? "close" : "edit"} size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>

        {isEditing ? (
          <>
            <CustomInput
              label="Tên người dùng"
              value={username}
              onChangeText={setUsername}
              icon="person"
            />
            <CustomInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              icon="email"
            />
            <CustomButton
              title="Lưu thông tin"
              onPress={handleSaveProfile}
              style={styles.saveButton}
            />
          </>
        ) : (
          <>
            <View style={styles.infoRow}>
              <Icon name="person" size={20} color="#555" />
              <Text style={styles.infoLabel}>Tên người dùng:</Text>
              <Text style={styles.infoValue}>{profile?.username}</Text>
            </View>

            <View style={styles.infoRow}>
              <Icon name="email" size={20} color="#555" />
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{profile?.email}</Text>
            </View>

            <View style={styles.infoRow}>
              <Icon name="verified-user" size={20} color="#555" />
              <Text style={styles.infoLabel}>Vai trò:</Text>
              <Text style={styles.infoValue}>{profile?.role}</Text>
            </View>

            <View style={styles.infoRow}>
              <Icon name="date-range" size={20} color="#555" />
              <Text style={styles.infoLabel}>Ngày tạo:</Text>
              <Text style={styles.infoValue}>
                {new Date(profile?.createdAt).toLocaleDateString("vi-VN")}
              </Text>
            </View>
          </>
        )}
      </View>

      <View style={styles.actionsSection}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("ChangePassword")}
        >
          <Icon name="lock" size={24} color="#0066cc" />
          <Text style={styles.actionText}>Đổi mật khẩu</Text>
          <Icon name="chevron-right" size={24} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("OrderHistory")}
        >
          <Icon name="shopping-bag" size={24} color="#0066cc" />
          <Text style={styles.actionText}>Lịch sử đơn hàng</Text>
          <Icon name="chevron-right" size={24} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("Addresses")}
        >
          <Icon name="location-on" size={24} color="#0066cc" />
          <Text style={styles.actionText}>Địa chỉ của tôi</Text>
          <Icon name="chevron-right" size={24} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("Settings")}
        >
          <Icon name="settings" size={24} color="#0066cc" />
          <Text style={styles.actionText}>Cài đặt</Text>
          <Icon name="chevron-right" size={24} color="#999" />
        </TouchableOpacity>
      </View>

      {user ? (
        <>
          <CustomButton
            title="Đăng xuất"
            onPress={handleLogout}
            style={styles.logoutButton}
            textStyle={styles.logoutText}
            icon="logout"
          />
        </>
      ) : (
        <>
          <CustomButton
            title="Đăng Nhập"
            onPress={handleLogin}
            style={styles.loginButton}
            textStyle={styles.logoutText}
            icon="login"
          />
        </>
      )}

      <View style={styles.version}>
        <Text style={styles.versionText}>Phiên bản 1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    marginVertical: 35,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#0066cc",
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    margin: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#fff",
  },
  userInfo: {
    marginLeft: 20,
    flex: 1,
  },
  name: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  role: {
    color: "#eee",
    fontSize: 14,
    marginTop: 4,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  infoSection: {
    backgroundColor: "#fff",
    margin: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  infoLabel: {
    width: 120,
    marginLeft: 10,
    fontSize: 16,
    color: "#555",
  },
  infoValue: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: "#0066cc",
  },
  actionsSection: {
    backgroundColor: "#fff",
    margin: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  actionText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: "#333",
  },
  logoutButton: {
    margin: 10,
    backgroundColor: "#f44336",
  },
  loginButton: {
    margin: 10,
    backgroundColor: "#4CAF50",
  },
  logoutText: {
    color: "#fff",
  },
  version: {
    alignItems: "center",
    padding: 20,
  },
  versionText: {
    color: "#999",
    fontSize: 14,
  },
});

export default ProfileScreen;
