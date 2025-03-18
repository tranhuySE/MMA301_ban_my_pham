import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_API_MOBILE } from "@env";

const baseUrl = BASE_API_MOBILE;

export const fetchProducts = createAsyncThunk("products/fetch", async () => {
  // const response = await axios.get("http://10.0.2.2:9999/api/products");
  // const response = await axios.get(`${baseUrl}/api/products`);
  const response = await axios.get("http://192.168.0.107:9999/api/products");
  return response.data;
});

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default productSlice.reducer;
