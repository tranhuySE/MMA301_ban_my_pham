import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Dimensions,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice";
import { addToCart } from "../redux/slices/cartSlice";
import { logout } from "../redux/slices/authSlice";
import Icon from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const auth = useSelector((state) => state.auth);
  const [user, setUser] = useState(auth?.user || null);

  useEffect(() => {
    setUser(auth?.user || null);
  }, [auth]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("Tất cả");
  const carouselRef = useRef(null);

  const carouselItems = [
    {
      id: "1",
      image: require("../assets/images/banner1.jpg"),
      title: "Khuyến mãi mùa hè",
    },
    {
      id: "2",
      image: require("../assets/images/banner2.jpg"),
      title: "Sản phẩm mới",
    },
    {
      id: "3",
      image: require("../assets/images/banner3.jpg"),
      title: "Giảm giá 50%",
    },
  ];

  useEffect(() => {
    let interval;
    if (carouselRef.current) {
      let currentIndex = 0;
      interval = setInterval(() => {
        if (carouselRef.current) {
          if (currentIndex < carouselItems.length - 1) {
            currentIndex += 1;
          } else {
            currentIndex = 0;
          }
          carouselRef.current.scrollToIndex({
            animated: true,
            index: currentIndex,
          });
        }
      }, 3000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [carouselItems.length]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (products && products.length > 0) {
      const allBrands = [
        "Tất cả",
        ...new Set(products.map((item) => item.brand).filter(Boolean)),
      ];
      setBrands(allBrands);
      setFilteredProducts(products);
    }
  }, [products]);

  useEffect(() => {
    if (!products) return;

    let result = [...products];

    if (selectedBrand !== "Tất cả") {
      result = result.filter((item) => item.brand === selectedBrand);
    }

    if (searchQuery.trim() !== "") {
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(result);
  }, [searchQuery, selectedBrand, products]);

  const handleAddToCart = (item) => {
    if (user) {
      dispatch(addToCart({ product: item, userId: user._id }));
      alert("Đã thêm vào giỏ hàng!");
    } else {
      alert("Bạn phải đăng nhập để mua hàng!");
      navigation.navigate("LoginScreen");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    alert("Đã đăng xuất!");
  };

  const renderCarouselItem = ({ item }) => {
    return (
      <View style={styles.carouselItem}>
        <Image source={item.image} style={styles.carouselImage} />
        <View style={styles.carouselTitleContainer}>
          <Text style={styles.carouselTitle}>{item.title}</Text>
        </View>
      </View>
    );
  };

  const renderBrandItem = (brand) => {
    const isSelected = brand === selectedBrand;
    return (
      <TouchableOpacity
        key={brand}
        style={[styles.brandButton, isSelected && styles.selectedBrandButton]}
        onPress={() => setSelectedBrand(brand)}
      >
        <Text
          style={[styles.brandText, isSelected && styles.selectedBrandText]}
        >
          {brand}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => navigation.navigate("ProductDetail", { product: item })}
      >
        <Image source={{ uri: `${item.image}` }} style={styles.image} />
        {item.brand && (
          <View style={styles.brandBadge}>
            <Text style={styles.brandBadgeText}>{item.brand}</Text>
          </View>
        )}
      </TouchableOpacity>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.stock} numberOfLines={2}>
          {item.stock > 0 ? "Còn hàng" : "Hết hàng"}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{item.price.toLocaleString()} VND</Text>
        </View>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={() => handleAddToCart(item)}
        >
          <Icon name="cart-outline" size={20} color="white" />
          <Text style={styles.buttonText}>Mua</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text style={styles.error}>Lỗi: {error}</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>
            <Text style={styles.beautiText}>Beauti</Text>
            <Text style={styles.vineText}>vine</Text>
          </Text>
          <View style={styles.underline} />
        </View>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={
            user ? handleLogout : () => navigation.navigate("LoginScreen")
          }
        >
          <Text style={styles.headerUser}>{user ? user.username : ""}</Text>
          <Icon
            name={user ? "log-out-outline" : "log-in-outline"}
            size={27}
            color={user ? "#FF3B30" : "#4CAF50"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Icon
          name="search-outline"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm sản phẩm..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Icon name="close-circle-outline" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.carouselContainer}>
        <FlatList
          ref={carouselRef}
          data={carouselItems}
          renderItem={renderCarouselItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScrollToIndexFailed={(info) => {
            setTimeout(() => {
              carouselRef.current?.scrollToIndex({
                index: info.index,
                animated: true,
              });
            }, 500);
          }}
        />
      </View>

      {/* Brand filter */}
      <View style={styles.brandFilterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.brandFilterContent}
        >
          {brands.map(renderBrandItem)}
        </ScrollView>
      </View>

      <View style={styles.productsHeader}>
        <Text style={styles.sectionTitle}>Danh sách sản phẩm</Text>
        <Text style={styles.productsCount}>
          {filteredProducts.length} sản phẩm
        </Text>
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>
            Không tìm thấy sản phẩm phù hợp
          </Text>
        }
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff5f7",
    padding: 10,
    marginTop: 15,
  },
  logo: {
    flex: 1,
  },
  logoText: {
    fontSize: 35,
    fontWeight: "bold",
  },
  beautiText: {
    color: "#FF69B4",
    fontFamily: " cursive",
  },
  vineText: {
    color: "#32CD32",
    fontFamily: "sans-serif",
  },
  underline: {
    width: 100,
    height: 2,
    backgroundColor: "#FF69B4",
    borderRadius: 2,
    marginTop: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 5,
    marginVertical: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  logoutButton: {
    flexDirection: "row",
    padding: 5,
  },
  headerUser: {
    padding: 5,
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingLeft: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  carouselContainer: {
    marginVertical: 15,
    height: 180,
  },
  carouselItem: {
    width: width - 20,
    height: 180,
    borderRadius: 10,
    overflow: "hidden",
  },
  carouselImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  carouselTitleContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
  },
  carouselTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  brandFilterContainer: {
    marginBottom: 10,
    paddingLeft: 5,
    paddingRight: 5,
  },
  brandFilterContent: {
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  brandButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  selectedBrandButton: {
    backgroundColor: "#ffc0cb",
    borderColor: "#ffc0cb",
  },
  brandText: {
    fontSize: 14,
    color: "#333",
  },
  selectedBrandText: {
    color: "#fff",
    fontWeight: "bold",
  },
  productsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 5,
  },
  productsCount: {
    fontSize: 14,
    color: "#666",
    marginRight: 10,
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 6,
    borderRadius: 10,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  image: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  brandBadge: {
    position: "absolute",
    top: 5,
    left: 5,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  brandBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  info: {
    padding: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    height: 40,
    overflow: "hidden",
  },
  stock: {
    fontSize: 14,
    color: "red",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
  },
  price: {
    color: "green",
    fontWeight: "bold",
  },
  addToCartButton: {
    flexDirection: "row",
    backgroundColor: "#ffc0cb",
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 10,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  emptyMessage: {
    textAlign: "center",
    padding: 20,
    color: "#666",
  },
});
