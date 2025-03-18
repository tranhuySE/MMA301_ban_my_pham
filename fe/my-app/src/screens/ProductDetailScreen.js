import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { addToCart } from "../redux/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";

const ProductDetailScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [user, setUser] = useState(auth?.user || null);

  useEffect(() => {
    setUser(auth?.user || null);
  }, [auth]);

  const handleBack = () => {
    navigation.navigate("MainScreen");
  };

  const handleAddToCart = () => {
    if (!user) {
      alert("Bạn phải đăng nhập để xem giỏ hàng!");
      navigation.navigate("LoginScreen");
      return;
    }
    console.log(user._id);

    dispatch(addToCart({ product: product, userId: user._id }));
    alert(`Added ${product.name} to cart!`);
  };

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
      </View>

      <ScrollView style={styles.content}>
        <Image source={{ uri: `${product.image}` }} style={styles.image} />

        <View style={styles.infoContainer}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>{product.price.toLocaleString()} VND</Text>

          {/* Brand and Category */}
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Ionicons name="briefcase-outline" size={18} color="#666" />
              <Text style={styles.metaLabel}>Brand:</Text>
              <Text style={styles.metaValue}>{product.brand}</Text>
            </View>

            <View style={styles.metaItem}>
              <Ionicons name="apps-outline" size={18} color="#666" />
              <Text style={styles.metaLabel}>Category:</Text>
              <Text style={styles.metaValue}>{product.category_id.name}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>
      </ScrollView>

      {/* Add to cart button */}
      <TouchableOpacity
        style={styles.addToCartButton}
        onPress={handleAddToCart}
      >
        <Ionicons name="cart" size={24} color="#fff" />
        <Text style={styles.addToCartText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProductDetailScreen;

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
  content: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
    backgroundColor: "#fff",
  },
  infoContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 12,
    marginTop: -30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  price: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2e8b57",
    marginTop: 8,
  },
  metaContainer: {
    marginTop: 15,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  metaLabel: {
    fontSize: 15,
    color: "#666",
    marginLeft: 6,
    marginRight: 4,
  },
  metaValue: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 15,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#555",
  },
  addToCartButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2e8b57",
    padding: 16,
    margin: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  addToCartText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
});
