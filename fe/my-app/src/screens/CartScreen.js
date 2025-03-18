import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCart,
  loadCart,
  removeFromCart,
  updateQuantity,
} from "../redux/slices/cartSlice";
import Icon from "react-native-vector-icons/Ionicons";

const CartScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => [...state.cart.items]);
  const auth = useSelector((state) => state.auth);
  const [user, setUser] = useState(auth?.user || null);

  useEffect(() => {
    setUser(auth?.user || null);
  }, [auth]);

  useEffect(() => {
    if (!user) {
      alert("Bạn phải đăng nhập để xem giỏ hàng!");
      navigation.navigate("LoginScreen");
      return;
    }
    dispatch(loadCart(user._id));
  }, [dispatch]);

  const handleRemoveFromCart = (id) => {
    Alert.alert(
      "Xác nhận xóa sản phẩm",
      "Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xóa",
          onPress: () => dispatch(removeFromCart({ id, userId: user._id })),
          style: "destructive",
        },
      ]
    );
  };

  const handleQuantityChange = (id, currentQuantity, change, stock) => {
    const newQuantity = currentQuantity + change;

    if (change > 0 && newQuantity > stock) {
      Alert.alert(
        "Thông báo",
        `Không thể thêm sản phẩm. Số lượng tối đa có sẵn là ${stock}.`,
        [{ text: "Đã hiểu" }]
      );
      return;
    }

    if (newQuantity >= 1) {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    Alert.alert("Thông báo", "Bạn đang chuyển đến trang thanh toán");
    navigation.navigate("Checkout");
  };

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: `${item.image}` }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>{item.price.toLocaleString()} VND</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() =>
              handleQuantityChange(item._id, item.quantity, -1, item.stock)
            }
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() =>
              handleQuantityChange(item._id, item.quantity, 1, item.stock)
            }
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        {item.stock && (
          <Text style={styles.stockInfo}>Còn lại: {item.stock} sản phẩm</Text>
        )}
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.itemTotal}>
          {(item.price * item.quantity).toLocaleString()} VND
        </Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveFromCart(item._id)}
        >
          <Icon name="trash-outline" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Giỏ hàng của bạn</Text>
      {cartItems.length === 0 ? (
        <Text style={styles.emptyText}>Giỏ hàng trống</Text>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tổng số sản phẩm:</Text>
              <Text style={styles.summaryValue}>
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tổng tiền:</Text>
              <Text style={styles.summaryTotal}>
                {calculateTotal().toLocaleString()} VND
              </Text>
            </View>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={() => dispatch(clearCart(user._id))}
            >
              <Text style={styles.checkoutButtonText}>Reset Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutButtonText}>Thanh toán ngay</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 25,
    color: "#333",
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    marginVertical: 6,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
  },
  info: {
    flex: 1,
    justifyContent: "space-between",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  price: {
    fontSize: 15,
    color: "green",
    marginBottom: 6,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  quantityButton: {
    backgroundColor: "#f0f0f0",
    borderRadius: 6,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  quantity: {
    paddingHorizontal: 14,
    fontSize: 16,
  },
  stockInfo: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  rightSection: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 70,
  },
  itemTotal: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
  },
  removeButton: {
    padding: 5,
  },
  summaryContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginTop: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#555",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  summaryTotal: {
    fontSize: 18,
    fontWeight: "bold",
    color: "green",
  },
  checkoutButton: {
    backgroundColor: "#ff6600",
    borderRadius: 12,
    padding: 15,
    marginTop: 15,
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 18,
    marginTop: 40,
    color: "gray",
  },
});

export default CartScreen;
