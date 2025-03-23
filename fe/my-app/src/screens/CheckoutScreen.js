import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
  Image,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { clearCart } from "../redux/slices/cartSlice";
import Icon from "react-native-vector-icons/MaterialIcons";
import axios from "axios";

const CheckoutScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const auth = useSelector((state) => state.auth);
  const [user, setUser] = useState(auth?.user || null);

  useEffect(() => {
    setUser(auth?.user || null);
  }, [auth]);

  const [fullName, setFullName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressID, setSelectedAddressID] = useState("");
  const status = "pendding";

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        if (!user) {
          navigation.navigate("LoginScreen");
          return;
        }
        const res = await axios.get(
          `http://10.33.50.64:9999/api/address/all/${user._id}`
        );
        setSavedAddresses(res.data.data);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (!fullName || !phone || !address) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin giao hàng!");
      return;
    }

    const order = {
      orderId: `ORD-${Date.now()}`,
      userId: user._id,
      items: cartItems,
      totalAmount,
      fullName,
      phone,
      address,
      paymentMethod,
      createdAt: new Date().toISOString(),
      status: "pending",
    };

    if (paymentMethod === "COD") {
      try {
        const existingOrders = await AsyncStorage.getItem(`orders_${user._id}`);
        const orders = existingOrders ? JSON.parse(existingOrders) : [];

        orders.push(order);

        await AsyncStorage.setItem(
          `orders_${user._id}`,
          JSON.stringify(orders)
        );

        dispatch(clearCart(user._id));

        setTimeout(() => {
          Alert.alert("Thành công", "Đơn hàng của bạn đã được đặt!", [
            {
              text: "OK",
              onPress: () =>
                navigation.navigate("MainScreen", { screen: "Cart" }),
            },
          ]);
        }, 100);
      } catch (error) {
        console.error("Lỗi khi lưu đơn hàng:", error);
        Alert.alert("Lỗi", "Không thể lưu đơn hàng, vui lòng thử lại!");
      }
    } else {
      navigation.navigate("PaymentScreen", { orderInfo: order });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Thông tin giao hàng</Text>
      <TextInput
        style={styles.input}
        placeholder="Họ và tên"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      {savedAddresses.length > 0 && (
        <>
          <Text style={styles.title}>Chọn địa chỉ đã lưu:</Text>
          <FlatList
            data={savedAddresses}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.addressItem}
                onPress={() => {
                  setAddress(
                    `${item.streetAddress}, ${item.ward}, ${item.district}`
                  );
                  setFullName(item.recipient);
                  setPhone(item.phoneNumber);
                  setSelectedAddressID(item._id);
                }}
              >
                <Text
                  style={styles.addressText}
                >{`${item.streetAddress}, ${item.ward}, ${item.district}`}</Text>
              </TouchableOpacity>
            )}
          />
        </>
      )}
      <TextInput
        style={styles.input}
        placeholder="Địa chỉ nhận hàng"
        value={address}
        onChangeText={setAddress}
      />

      <Text style={styles.title}>Phương thức thanh toán</Text>
      <TouchableOpacity
        style={[
          styles.paymentButton,
          paymentMethod === "COD" && styles.selected,
        ]}
        onPress={() => setPaymentMethod("COD")}
      >
        <Text>💰 Thanh toán khi nhận hàng (COD)</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.paymentButton,
          paymentMethod === "Card" && styles.selected,
        ]}
        onPress={() => setPaymentMethod("Card")}
      >
        <Text>💳 Thẻ tín dụng</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.paymentButton,
          paymentMethod === "VNPay" && styles.selected,
        ]}
        onPress={() => setPaymentMethod("VNPay")}
      >
        <Text>Thanh toán qua VNPAY</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Đơn hàng</Text>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>
              {item.name} × {item.quantity}
            </Text>
            <Text>{(item.price * item.quantity).toLocaleString()}đ</Text>
          </View>
        )}
      />

      <Text style={styles.total}>
        Tổng tiền: {totalAmount.toLocaleString()}đ
      </Text>

      <TouchableOpacity style={styles.orderButton} onPress={handlePlaceOrder}>
        <Text style={styles.orderButtonText}>Xác nhận đặt hàng</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginVertical: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  addressItem: {
    backgroundColor: "#f8f9fa", // Màu nền nhẹ nhàng
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addressText: {
    fontSize: 15,
    color: "#333",
    marginVertical: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {},
  paymentButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  selected: { backgroundColor: "#cce5ff" },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
    marginVertical: 10,
  },
  orderButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  orderButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
