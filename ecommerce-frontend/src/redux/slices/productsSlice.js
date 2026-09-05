import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProducts, getCategories } from "../../api/productsApi";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params, { rejectWithValue }) => {
    try {
      const res = await getProducts(params);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch products");
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getCategories();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch categories");
    }
  }
);

const initialState = {
  list: [],
  count: 0,
  categories: [],
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.results || action.payload;
        state.count = action.payload.count || state.list.length;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload.results || action.payload;
      });
  },
});

export default productsSlice.reducer;