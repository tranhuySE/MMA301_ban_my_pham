import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Hàm lưu giỏ hàng vào AsyncStorage
const saveCartToStorage = async (userId, cart) => {
  try {
    await AsyncStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
  } catch (error) {
    console.error("Lỗi khi lưu giỏ hàng:", error);
  }
};

// Hàm lấy giỏ hàng từ AsyncStorage
const loadCartFromStorage = async (userId) => {
  try {
    const storedCart = await AsyncStorage.getItem(`cart_${userId}`);
    return storedCart ? JSON.parse(storedCart) : [];
  } catch (error) {
    console.error("Lỗi khi tải giỏ hàng:", error);
    return [];
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
  },
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload;
    },
    addToCart: (state, action) => {
      const { product, userId } = action.payload;
      const existingItem = state.items.find((item) => item._id === product._id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }
      saveCartToStorage(userId, state.items);
    },
    removeFromCart: (state, action) => {
      const { id, userId } = action.payload;
      state.items = state.items.filter((item) => item._id !== id);
      saveCartToStorage(userId, state.items);
    },
    updateQuantity: (state, action) => {
      const { id, quantity, userId } = action.payload;
      const existingItem = state.items.find((item) => item._id === id);
      if (existingItem) {
        existingItem.quantity = quantity;
      }
      saveCartToStorage(userId, state.items);
    },
    clearCart: (state, action) => {
      const userId = action.payload;
      state.items = [];
      saveCartToStorage(userId, state.items);
    },
    decrementQuantity: (state, action) => {
      const { id, userId } = action.payload;
      const existingItem = state.items.find((item) => item._id === id);
      if (existingItem) {
        existingItem.quantity -= 1;
        if (existingItem.quantity <= 0) {
          state.items = state.items.filter((item) => item._id !== id);
        }
      }
      saveCartToStorage(userId, state.items);
    },
    incrementQuantity: (state, action) => {
      const { id, userId } = action.payload;
      const existingItem = state.items.find((item) => item._id === id);
      if (existingItem) {
        existingItem.quantity += 1;
      }
      saveCartToStorage(userId, state.items);
    },
  },
});

export const {
  setCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  decrementQuantity,
  incrementQuantity,
} = cartSlice.actions;

// Thunk để tải giỏ hàng từ AsyncStorage
export const loadCart = (userId) => async (dispatch) => {
  const cart = await loadCartFromStorage(userId);
  dispatch(setCart(cart));
};

export default cartSlice.reducer;
