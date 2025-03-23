import React, { useState, useEffect, useRef } from "react";
import { View, Text, Alert, Button, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import CryptoJS from "crypto-js";
import dateFormat from "dateformat";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../redux/slices/cartSlice";

const PaymentScreen = ({ route, navigation }) => {
  const orderInfo = route?.params?.orderInfo || {};
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasHandledNavigation = useRef(false);
  const auth = useSelector((state) => state.auth);
  const [user, setUser] = useState(auth?.user || null);

  useEffect(() => {
    setUser(auth?.user || null);
  }, [auth]);
  const dispatch = useDispatch();

  const createVNPayUrl = async (
    amount,
    orderDescription = "Thanh toán hóa đơn",
    phone = "",
    email = "",
    firstName = "",
    lastName = "",
    address = "",
    city = "",
    country = "VN"
  ) => {
    try {
      const validAmount = Number(amount);
      if (validAmount < 5000 || validAmount >= 1000000000) {
        throw new Error(
          "Số tiền không hợp lệ. Số tiền phải từ 5,000 đến dưới 1 tỷ VND."
        );
      }

      const ipAddr = "10.33.50.64";
      const tmnCode = "DFWOLLMP";
      const secretKey = "B9AQNIL1UVLYV4OB5JF2XXSSMX85AQM7";
      const vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
      const returnUrl = "http://10.33.50.64:9999/login";

      const generateRandomRef = () => {
        let result = "";
        const characters = "0123456789";
        for (let i = 0; i < 8; i++) {
          result += characters.charAt(
            Math.floor(Math.random() * characters.length)
          );
        }
        return result;
      };

      const txnRef = generateRandomRef();

      const now = new Date();
      const gmt7Time = new Date(now.getTime() + 7 * 60 * 60 * 1000);

      const createDate = dateFormat(gmt7Time, "yyyymmddHHMMss");
      const orderType = "other";
      const locale = "vn";
      const currCode = "VND";
      const bankCode = "";

      const expireDate = new Date(gmt7Time.getTime() + 7 * 60 * 1000);
      const vnp_ExpireDate = dateFormat(expireDate, "yyyymmddHHMMss");

      let vnp_Params = {
        vnp_Version: "2.1.0",
        vnp_Command: "pay",
        vnp_TmnCode: tmnCode,
        vnp_Locale: locale,
        vnp_CurrCode: currCode,
        vnp_TxnRef: txnRef,
        vnp_OrderInfo: "Thanh toan don hang:" + txnRef,
        vnp_OrderType: orderType,
        vnp_Amount: validAmount * 100,
        vnp_ReturnUrl: returnUrl,
        vnp_IpAddr: ipAddr,
        vnp_CreateDate: createDate,
        vnp_ExpireDate: vnp_ExpireDate,
      };

      if (bankCode) {
        vnp_Params["vnp_BankCode"] = bankCode;
      }

      const fieldNames = Object.keys(vnp_Params).sort();

      let hashData = "";
      let query = "";

      fieldNames.forEach((fieldName, index) => {
        const fieldValue = vnp_Params[fieldName];
        if (
          fieldValue !== null &&
          fieldValue !== undefined &&
          fieldValue !== ""
        ) {
          const encodedValue = encodeURIComponent(fieldValue).replace(
            /%20/g,
            "+"
          );

          hashData += fieldName + "=" + encodedValue;

          query +=
            encodeURIComponent(fieldName) +
            "=" +
            encodeURIComponent(fieldValue);

          if (index < fieldNames.length - 1) {
            hashData += "&";
            query += "&";
          }
        }
      });

      const hmac = CryptoJS.HmacSHA512(hashData, secretKey).toString(
        CryptoJS.enc.Hex
      );

      query += "&vnp_SecureHash=" + hmac;

      const finalUrl = `${vnpUrl}?${query}`;

      return finalUrl;
    } catch (error) {
      console.error("Error creating VNPay URL:", error);
      throw error;
    }
  };

  const initPayment = async () => {
    try {
      setIsLoading(true);
      hasHandledNavigation.current = false;

      const url = await createVNPayUrl(
        orderInfo.amount || "15000",
        orderInfo.description || "Thanh toán hóa đơn",
        orderInfo.phone || "",
        orderInfo.email || "",
        orderInfo.firstName || "",
        orderInfo.lastName || "",
        orderInfo.address || "",
        orderInfo.city || "",
        orderInfo.country || "VN"
      );

      setPaymentUrl(url);
      setIsLoading(false);
    } catch (err) {
      console.error("Lỗi tạo URL thanh toán:", err);
      setError(err.message || "Có lỗi xảy ra khi tạo URL thanh toán");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initPayment();

    // Xử lý trường hợp người dùng nhấn nút back của thiết bị
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (isLoading && !hasHandledNavigation.current) {
        // Ngăn không cho quay lại khi đang loading
        e.preventDefault();
        Alert.alert(
          "Hủy thanh toán",
          "Bạn có chắc chắn muốn hủy quá trình thanh toán?",
          [
            { text: "Tiếp tục thanh toán", style: "cancel" },
            {
              text: "Hủy thanh toán",
              style: "destructive",
              onPress: () => navigation.dispatch(e.data.action),
            },
          ]
        );
      }
    });

    return unsubscribe;
  }, [navigation, isLoading]);

  const handleNavigationStateChange = (navState) => {
    const RETURN_URL = "http://10.33.50.64:9999/login";

    if (navState.url.includes(RETURN_URL) && !hasHandledNavigation.current) {
      // Đánh dấu đã xử lý để tránh xử lý nhiều lần
      hasHandledNavigation.current = true;

      const url = new URL(navState.url);
      const vnp_ResponseCode = url.searchParams.get("vnp_ResponseCode");

      let message = "";
      let isSuccess = false;

      switch (vnp_ResponseCode) {
        case "00":
          message = "Thanh toán thành công!";
          isSuccess = true;
          break;
        case "07":
          message = "Giao dịch bị nghi ngờ gian lận";
          break;
        case "09":
          message = "Thẻ/Tài khoản chưa đăng ký dịch vụ";
          break;
        case "10":
          message = "Thông tin thẻ/tài khoản không hợp lệ";
          break;
        case "11":
          message = "Chưa qua kiểm tra bảo mật";
          break;
        case "12":
          message = "Thẻ/Tài khoản bị khóa";
          break;
        case "13":
          message = "Giao dịch đã vượt quá thời gian cho phép";
          break;
        case "24":
          message = "Giao dịch bị hủy";
          break;
        case "91":
          message = "Chữ ký không hợp lệ";
          break;
        default:
          message = `Giao dịch thất bại. Mã lỗi: ${
            vnp_ResponseCode || "Không xác định"
          }`;
      }

      if (message) {
        Alert.alert(
          isSuccess ? "Thành công" : "Thông báo",
          message,
          [
            {
              text: "OK",
              onPress: () => {
                if (isSuccess) {
                  dispatch(clearCart(user._id));
                  console.log(message, " Xoa cart!!!!");

                  navigation.replace("MainScreen", { screen: "Cart" });
                } else if (vnp_ResponseCode === "13") {
                  // Trường hợp timeout, tạo lại URL thanh toán
                  setTimeout(() => {
                    initPayment();
                  }, 300);
                } else {
                  navigation.goBack();
                }
              },
            },
          ],
          { cancelable: false }
        );
      }
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Đang khởi tạo cổng thanh toán...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Lỗi: {error}</Text>
        <Button
          title="Thử lại"
          onPress={() => {
            initPayment();
          }}
        />
        <Button
          title="Quay lại"
          onPress={() => {
            navigation.goBack();
          }}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {paymentUrl && (
        <WebView
          source={{ uri: paymentUrl }}
          onNavigationStateChange={handleNavigationStateChange}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          style={{ flex: 1 }}
          renderError={(errorDomain, errorCode, errorDesc) => (
            <View style={styles.container}>
              <Text>Lỗi tải trang thanh toán: {errorDesc}</Text>
              <Button
                title="Thử lại"
                onPress={() => {
                  initPayment();
                }}
              />
              <Button
                title="Quay lại"
                onPress={() => {
                  navigation.goBack();
                }}
              />
            </View>
          )}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error("WebView error: ", nativeEvent);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    marginBottom: 20,
  },
});

export default PaymentScreen;
