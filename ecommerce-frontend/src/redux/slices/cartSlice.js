import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCart, addToCart, updateCartItem, removeCartItem } from "../../api/cartApi";

export const fetchCart = createAsyncThunk("cart/fetchCart", async (_, { rejectWithValue }) => {
  try {
    const res = await getCart();
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

export const addItemToCart = createAsyncThunk("cart/addItem", async (data, { rejectWithValue }) => {
  try {
    await addToCart(data);
    const res = await getCart();
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

export const updateItemQuantity = createAsyncThunk("cart/updateItem", async ({ id, quantity }, { rejectWithValue }) => {
  try {
    await updateCartItem(id, { quantity });
    const res = await getCart();
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

export const removeItemFromCart = createAsyncThunk("cart/removeItem", async (id, { rejectWithValue }) => {
  try {
    await removeCartItem(id);
    const res = await getCart();
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

const initialState = {
  items: [],
  total_price: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => action.type.startsWith("cart/") && action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("cart/") && action.type.endsWith("/fulfilled"),
        (state, action) => {
          state.loading = false;
          state.items = action.payload.items;
          state.total_price = action.payload.total_price;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("cart/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export default cartSlice.reducer;