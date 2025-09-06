import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userDetailsApi } from '../../api/userDetailsApi'; 
const dummyProfile =  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLMI5YxZE03Vnj-s-sth2_JxlPd30Zy7yEGg&s";
 
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { getState }) => {
    const state = getState();
    const currentProfile = state.profile.profile;

    // Skip if already loaded (avoid unnecessary fetch)
    if (currentProfile && currentProfile.user_profile_pic !== undefined) {
      return currentProfile; // or return early if you prefer
    }

    const response = await userDetailsApi.getMiniUserDetails();
    const user = response.user;

    
    return {
      user_profile_pic: user.user_profile_pic,
      about_us: user.about_us,
      career_objective: user.career_objective,
      // Add more later:
      // followersCount: user.followersCount || 0,
      // followingCount: user.followingCount || 0,
    };
  }
);

// ============ SLICE ============

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    profile: {
      user_profile_pic: dummyProfile,
      about_us: null,
      career_objective: null,
      // followersCount: 0,
      // followingCount: 0,
    },
    loading: false,
    error: null,
    lastFetched: null, // optional: for cache control
  },
  reducers: {
    // Optional: for optimistic/local updates (e.g., after upload)
    updateProfileLocally: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    // Optional: reset profile (e.g., on logout)
    clearProfile: (state) => {
      state.profile = {
        user_profile_pic: null,
        about_us: null,
        career_objective: null,
        // followersCount: 0,
        // followingCount: 0,
      };
      state.loading = false;
      state.error = null;
      state.lastFetched = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profile = { ...state.profile, ...action.payload }; // Merge new data
        state.loading = false;
        state.lastFetched = Date.now();
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load profile';
      });
  },
});

// Export actions
export const { updateProfileLocally, clearProfile } = profileSlice.actions;

// Export reducer
export default profileSlice.reducer;