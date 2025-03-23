import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";

const OrderHistoryScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = useSelector((state) => state.auth);
  const [user, setUser] = useState(auth?.user || null);

  useEffect(() => {
    setUser(auth?.user || null);
  }, [auth]);

  useEffect(() => {
    if (user) {
      const fetchOrders = async () => {
        try {
          const storedOrders = await AsyncStorage.getItem(`orders_${user._id}`);
          if (storedOrders) {
            setOrders(JSON.parse(storedOrders));
          }
        } catch (error) {
          console.error("Lỗi khi lấy đơn hàng:", error);
        } finally {
          setLoading(false);
        }
      };
      if (user?._id) fetchOrders();
    } else {
      Alert.alert("Xác nhận", "Bạn phải đăng nhập để xem lịch sử đơn hàng!", [
        { text: "Hủy", style: "cancel" },
        {
          text: "OK",
          onPress: () => navigation.navigate("LoginScreen"),
          style: "destructive",
        },
      ]);
    }
  }, [user]);

  const deleteOrder = async (orderId) => {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn xóa đơn hàng này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        onPress: async () => {
          const updatedOrders = orders.filter(
            (order) => order.orderId !== orderId
          );
          setOrders(updatedOrders);
          await AsyncStorage.setItem(
            `orders_${user._id}`,
            JSON.stringify(updatedOrders)
          );
        },
        style: "destructive",
      },
    ]);
  };

  const renderOrder = ({ item }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => handleOrderDetails(item)}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Đơn hàng: {item.orderId}</Text>
      </View>
      <View style={styles.orderHeader}>
        <Text style={styles.orderDate}>{item.createdAt}</Text>
      </View>

      <View style={styles.orderItems}>
        {item.items.map((product, index) => (
          <View key={index} style={styles.productItem}>
            <View style={styles.imagePlaceholder}>
              <Ionicons name="cube-outline" size={24} color="#999" />
            </View>
            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={1}>
                {product.name}
              </Text>
              <Text style={styles.productQuantity}>x{product.quantity}</Text>
            </View>
            <Text style={styles.productPrice}>
              {product.price.toLocaleString()} VND
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.orderFooter}>
        <Text
          style={[
            styles.statusText,
            item.status === "Đã giao hàng"
              ? styles.statusCompleted
              : styles.statusPending,
          ]}
        >
          {item.status === "pending" ? "Đang chờ giao hàng" : ""}
        </Text>
        <Text style={styles.totalAmount}>
          Tổng: {item.totalAmount.toLocaleString()} VND
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleEditOrder(item)}
        >
          <Ionicons name="pencil-outline" size={20} color="#007bff" />
          <Text style={styles.buttonText}>Chỉnh sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => deleteOrder(item.orderId)}
        >
          <Ionicons name="trash-outline" size={20} color="#ff4d4f" />
          <Text style={styles.buttonText}>
            {item.status === "pending" ? "Hủy đơn" : "Xóa đơn"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleOrderDetails(item)}
        >
          <Ionicons name="document-text-outline" size={20} color="#34c759" />
          <Text style={styles.buttonText}>Chi tiết</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("MainScreen", { screen: "Profile" })
          }
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch sử đơn hàng</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      ) : orders.length > 0 ? (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.orderId}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Bạn chưa có đơn hàng nào</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    marginVertical: 20,
  },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: "600", marginLeft: 16 },
  listContainer: { padding: 16 },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  orderId: { fontSize: 16, fontWeight: "600" },
  orderDate: { fontSize: 14, color: "#666" },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  totalAmount: {
    padding: 5,
  },
  imagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  productInfo: { flex: 1, marginLeft: 12 },
  productName: { fontSize: 15, fontWeight: "500" },
  statusText: { fontSize: 14, fontWeight: "500", padding: 4, borderRadius: 10 },
  statusCompleted: { backgroundColor: "#e6f7ed", color: "#34c759" },
  statusPending: {
    backgroundColor: "#fff9e6",
    color: "#ff9500",
    padding: 5,
    marginVertical: 5,
    marginBottom: 4,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff5f7",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: "#0066cc",
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    color: "#666",
    fontWeight: "400",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    backgroundColor: "#fff5f7",
    borderRadius: 10,
  },
  actionButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#fff5f7",
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default OrderHistoryScreen;
