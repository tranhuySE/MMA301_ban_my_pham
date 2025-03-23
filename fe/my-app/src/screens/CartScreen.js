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
import { Ionicons } from "@expo/vector-icons";

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
          <Icon name="trash-outline" size={24} color="#ff8da1" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Giỏ hàng của bạn</Text>
      {cartItems.length === 0 ? (
        <View style={styles.containerEmpty}>
          <Ionicons name="cart-outline" size={50} color="#999" />
          <Text style={styles.emptyText}>Giỏ hàng trống</Text>
        </View>
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
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.resetCartButton}
                onPress={() => dispatch(clearCart(user._id))}
              >
                <Icon name="trash-outline" size={20} color="#fff" />
                <Text style={styles.buttonText}>Xóa giỏ hàng</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.checkoutButton}
                onPress={handleCheckout}
              >
                <Icon name="cart-outline" size={20} color="#fff" />
                <Text style={styles.buttonText}>Thanh toán ngay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff5f7",
    padding: 10,
  },
  containerEmpty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 30,
    color: "#ff6b8b",
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
    borderLeftWidth: 4,
    borderLeftColor: "#ffc0cb",
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
    color: "#ff6b8b",
    marginBottom: 6,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  quantityButton: {
    backgroundColor: "#fff0f3",
    borderRadius: 6,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ff6b8b",
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
    color: "#ff6b8b",
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
    borderTopWidth: 3,
    borderTopColor: "#ffc0cb",
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
    color: "#ff6b8b",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  checkoutButton: {
    backgroundColor: "#ff8da1",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flex: 1,
    marginLeft: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  resetCartButton: {
    backgroundColor: "#ff8da1",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flex: 1,
    marginRight: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 18,
    marginTop: 40,
    color: "#ff6b8b",
  },
});

export default CartScreen;
