import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useSelector } from "react-redux";

const AddressesScreen = ({ navigation }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = useSelector((state) => state.auth);
  const [user, setUser] = useState(auth?.user || null);

  useEffect(() => {
    setUser(auth?.user || null);
  }, [auth]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        if (!user) {
          navigation.navigate("LoginScreen");
          return;
        }
        const res = await axios.get(
          `http://192.168.0.107:9999/api/address/all/${user._id}`
        );
        setAddresses(res.data.data);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleAddAddress = () => {
    navigation.navigate("AddAddress");
  };

  const handleEditAddress = (address) => {
    navigation.navigate("EditAddress", { address });
  };

  const handleDeleteAddress = (id) => {
    Alert.alert("Xác nhận xóa", "Bạn có chắc muốn xóa địa chỉ này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        onPress: () => {
          setAddresses(addresses.filter((item) => item.id !== id));
        },
        style: "destructive",
      },
    ]);
  };

  const handleSetAsDefault = (id) => {
    setAddresses(
      addresses.map((address) => ({
        ...address,
        isDefault: address._id === id,
      }))
    );
  };

  const renderAddress = ({ item }) => (
    <View style={styles.addressCard}>
      <View style={styles.addressHeader}>
        <View style={styles.namePhoneContainer}>
          <Text style={styles.name}>{item.recipient}</Text>
          <Text style={styles.phone}>{item.phoneNumber}</Text>
        </View>
        {item.isDefault && (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultText}>Mặc định</Text>
          </View>
        )}
      </View>

      <Text
        style={styles.addressText}
      >{`${item.streetAddress}, ${item.ward}, ${item.district}`}</Text>
      <Text style={styles.cityText}>{item.province}</Text>

      <View style={styles.addressActions}>
        {!item.isDefault && (
          <TouchableOpacity
            style={styles.setDefaultButton}
            onPress={() => handleSetAsDefault(item._id)}
          >
            <Text style={styles.setDefaultText}>Đặt làm mặc định</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditAddress(item)}
        >
          <Ionicons name="create-outline" size={18} color="#0066cc" />
          <Text style={styles.editButtonText}>Sửa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteAddress(item.id)}
        >
          <Ionicons name="trash-outline" size={18} color="#ff3b30" />
          <Text style={styles.deleteButtonText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Địa chỉ của tôi</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      ) : (
        <FlatList
          data={addresses}
          renderItem={renderAddress}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="location-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>Bạn chưa có địa chỉ nào</Text>
            </View>
          }
        />
      )}

      <TouchableOpacity style={styles.addButton} onPress={handleAddAddress}>
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Thêm địa chỉ mới</Text>
      </TouchableOpacity>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
    marginVertical: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    marginTop: 12,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80, // space for the add button
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginTop: 16,
  },
  addressCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  namePhoneContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  phone: {
    fontSize: 14,
    color: "#666",
  },
  defaultBadge: {
    backgroundColor: "#e6f2ff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  defaultText: {
    color: "#0066cc",
    fontSize: 12,
    fontWeight: "500",
  },
  addressText: {
    fontSize: 15,
    color: "#333",
    marginVertical: 4,
  },
  cityText: {
    fontSize: 15,
    color: "#333",
    marginBottom: 12,
  },
  addressActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  setDefaultButton: {
    marginRight: 16,
  },
  setDefaultText: {
    color: "#0066cc",
    fontSize: 14,
    fontWeight: "500",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  editButtonText: {
    color: "#0066cc",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#ff3b30",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
  addButton: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0066cc",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default AddressesScreen;
