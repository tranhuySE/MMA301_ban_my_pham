import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const OrderHistoryScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading orders from an API
    setTimeout(() => {
      setOrders([
        {
          id: "ORD001",
          date: "15/03/2025",
          total: 1250000,
          status: "Đã giao hàng",
          items: [
            {
              id: 1,
              name: "Áo sơ mi nam",
              quantity: 1,
              price: 450000,
              image: "https://placeholder.com/image1",
            },
            {
              id: 2,
              name: "Quần jean",
              quantity: 1,
              price: 800000,
              image: "https://placeholder.com/image2",
            },
          ],
        },
        {
          id: "ORD002",
          date: "02/03/2025",
          total: 560000,
          status: "Đang giao hàng",
          items: [
            {
              id: 3,
              name: "Áo thun nữ",
              quantity: 2,
              price: 280000,
              image: "https://placeholder.com/image3",
            },
          ],
        },
        {
          id: "ORD003",
          date: "20/02/2025",
          total: 1750000,
          status: "Đã giao hàng",
          items: [
            {
              id: 4,
              name: "Giày thể thao",
              quantity: 1,
              price: 1200000,
              image: "https://placeholder.com/image4",
            },
            {
              id: 5,
              name: "Tất nam",
              quantity: 5,
              price: 110000,
              image: "https://placeholder.com/image5",
            },
          ],
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleBack = () => {
    navigation.navigate("MainScreen", { screen: "Profile" });
  };

  const handleOrderDetails = (order) => {
    navigation.navigate("OrderDetails", { order });
  };

  const renderOrder = ({ item }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => handleOrderDetails(item)}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Đơn hàng: {item.id}</Text>
        <Text style={styles.orderDate}>{item.date}</Text>
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
        <View style={styles.orderStatus}>
          <Text
            style={[
              styles.statusText,
              item.status === "Đã giao hàng"
                ? styles.statusCompleted
                : styles.statusPending,
            ]}
          >
            {item.status}
          </Text>
        </View>
        <View style={styles.orderTotal}>
          <Text style={styles.totalLabel}>Tổng tiền:</Text>
          <Text style={styles.totalAmount}>
            {item.total.toLocaleString()} VND
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
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
          keyExtractor={(item) => item.id}
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginTop: 16,
  },
  listContainer: {
    padding: 16,
  },
  orderCard: {
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
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  orderId: {
    fontSize: 16,
    fontWeight: "600",
  },
  orderDate: {
    fontSize: 14,
    color: "#666",
  },
  orderItems: {
    marginBottom: 12,
  },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  imagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 15,
    fontWeight: "500",
  },
  productQuantity: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: "500",
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  orderStatus: {},
  statusText: {
    fontSize: 14,
    fontWeight: "500",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  statusCompleted: {
    backgroundColor: "#e6f7ed",
    color: "#34c759",
  },
  statusPending: {
    backgroundColor: "#fff9e6",
    color: "#ff9500",
  },
  orderTotal: {
    flexDirection: "row",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 14,
    color: "#666",
    marginRight: 6,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0066cc",
  },
});

export default OrderHistoryScreen;
