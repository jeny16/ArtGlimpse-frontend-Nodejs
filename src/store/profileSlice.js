import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../actions/userService';

// Thunk to fetch profile
export const fetchProfile = createAsyncThunk(
    'profile/fetchProfile',
    async ({ userId }, thunkAPI) => {
        try {
            const data = await userService.getProfile(userId);
            // console.log("data in fetchprofile", data);
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message || 'Failed to fetch profile'
            );
        }
    }
);

// Thunk to update profile
export const updateProfile = createAsyncThunk(
    'profile/updateProfile',
    async ({ userId, profileData }, thunkAPI) => {
        try {
            const data = await userService.updateProfile(userId, profileData);
            console.log("data in updateprofile", data);
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message || 'Failed to update profile'
            );
        }
    }
);

// Thunk to delete the user account and related data
export const deleteUserAccount = createAsyncThunk(
    'profile/deleteUserAccount',
    async ({ userId }, thunkAPI) => {
        try {
            const data = await userService.deleteUser(userId);
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message || 'Failed to delete account'
            );
        }
    }
);

const profileSlice = createSlice({
    name: 'profile',
    initialState: {
        profile: null,
        loading: false,
        error: null,
    },
    reducers: {
        resetProfileError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteUserAccount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUserAccount.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = null; // Clear profile on deletion
            })
            .addCase(deleteUserAccount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { resetProfileError } = profileSlice.actions;
export default profileSlice.reducer;
