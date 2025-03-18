import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SettingsScreen = ({ navigation }) => {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [biometricLogin, setBiometricLogin] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc muốn đăng xuất khỏi tài khoản?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        onPress: () => {
          // Handle logout logic here
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Xóa tài khoản",
      "Bạn có chắc muốn xóa tài khoản? Hành động này không thể hoàn tác và tất cả dữ liệu của bạn sẽ bị mất.",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa tài khoản",
          onPress: () => {
            // Handle account deletion logic here
            Alert.alert(
              "Thông báo",
              "Tài khoản của bạn đã được xóa thành công."
            );
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cài đặt</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông báo</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#0066cc"
              />
              <Text style={styles.settingText}>Thông báo đẩy</Text>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: "#d1d1d6", true: "#4cd964" }}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="mail-outline" size={24} color="#0066cc" />
              <Text style={styles.settingText}>Thông báo qua email</Text>
            </View>
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              trackColor={{ false: "#d1d1d6", true: "#4cd964" }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Giao diện</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="moon-outline" size={24} color="#0066cc" />
              <Text style={styles.settingText}>Chế độ tối</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: "#d1d1d6", true: "#4cd964" }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bảo mật</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="finger-print-outline" size={24} color="#0066cc" />
              <Text style={styles.settingText}>
                Đăng nhập bằng sinh trắc học
              </Text>
            </View>
            <Switch
              value={biometricLogin}
              onValueChange={setBiometricLogin}
              trackColor={{ false: "#d1d1d6", true: "#4cd964" }}
            />
          </View>

          <TouchableOpacity
            style={styles.navigationItem}
            onPress={() => navigation.navigate("ChangePassword")}
          >
            <View style={styles.settingInfo}>
              <Ionicons name="key-outline" size={24} color="#0066cc" />
              <Text style={styles.settingText}>Đổi mật khẩu</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#c7c7cc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navigationItem}
            onPress={() => navigation.navigate("PrivacySettings")}
          >
            <View style={styles.settingInfo}>
              <Ionicons name="shield-outline" size={24} color="#0066cc" />
              <Text style={styles.settingText}>Quyền riêng tư</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#c7c7cc" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tài khoản</Text>

          <TouchableOpacity
            style={styles.navigationItem}
            onPress={() => navigation.navigate("ProfileEdit")}
          >
            <View style={styles.settingInfo}>
              <Ionicons name="person-outline" size={24} color="#0066cc" />
              <Text style={styles.settingText}>Chỉnh sửa hồ sơ</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#c7c7cc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navigationItem}
            onPress={() => navigation.navigate("Language")}
          >
            <View style={styles.settingInfo}>
              <Ionicons name="language-outline" size={24} color="#0066cc" />
              <Text style={styles.settingText}>Ngôn ngữ</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#c7c7cc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navigationItem, styles.dangerItem]}
            onPress={handleLogout}
          >
            <View style={styles.settingInfo}>
              <Ionicons name="log-out-outline" size={24} color="#ff3b30" />
              <Text style={[styles.settingText, styles.dangerText]}>
                Đăng xuất
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navigationItem, styles.dangerItem]}
            onPress={handleDeleteAccount}
          >
            <View style={styles.settingInfo}>
              <Ionicons name="trash-outline" size={24} color="#ff3b30" />
              <Text style={[styles.settingText, styles.dangerText]}>
                Xóa tài khoản
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Giới thiệu</Text>

          <TouchableOpacity
            style={styles.navigationItem}
            onPress={() => navigation.navigate("About")}
          >
            <View style={styles.settingInfo}>
              <Ionicons
                name="information-circle-outline"
                size={24}
                color="#0066cc"
              />
              <Text style={styles.settingText}>Về ứng dụng</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#c7c7cc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navigationItem}
            onPress={() => navigation.navigate("TermsAndConditions")}
          >
            <View style={styles.settingInfo}>
              <Ionicons
                name="document-text-outline"
                size={24}
                color="#0066cc"
              />
              <Text style={styles.settingText}>Điều khoản sử dụng</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#c7c7cc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navigationItem}
            onPress={() => navigation.navigate("PrivacyPolicy")}
          >
            <View style={styles.settingInfo}>
              <Ionicons name="lock-closed-outline" size={24} color="#0066cc" />
              <Text style={styles.settingText}>Chính sách quyền riêng tư</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#c7c7cc" />
          </TouchableOpacity>
        </View>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Phiên bản 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    marginLeft: 20,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 5,
    marginHorizontal: 15,
    marginTop: 15,
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
    marginHorizontal: 15,
    marginVertical: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  navigationItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  dangerItem: {
    borderBottomWidth: 0,
  },
  dangerText: {
    color: "#ff3b30",
  },
  versionContainer: {
    alignItems: "center",
    paddingVertical: 30,
  },
  versionText: {
    fontSize: 14,
    color: "#8e8e93",
  },
});

export default SettingsScreen;
