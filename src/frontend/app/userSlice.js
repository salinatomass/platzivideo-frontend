import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { getMovies } from './moviesSlice'
import { toast } from 'react-hot-toast'

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (user, thunkAPI) => {
    try {
      const { data } = await axios.post('/auth/sign-up', user)

      toast.success('User created successfuly!')

      return data
    } catch (err) {
      toast.error(err.response.data.message)
      return thunkAPI.rejectWithValue(err.response.data.message)
    }
  }
)

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password, rememberMe }, thunkAPI) => {
    try {
      const { data: user } = await axios({
        url: '/auth/sign-in',
        method: 'post',
        auth: {
          username: email,
          password
        },
        data: { rememberMe }
      })

      document.cookie = `id=${user?.id}`
      document.cookie = `name=${user?.name}`
      document.cookie = `email=${user?.email}`

      thunkAPI.dispatch(getMovies())

      return user
    } catch (err) {
      toast.error('Incorrect user or password')
      return thunkAPI.rejectWithValue(err.response.data.message)
    }
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState: {},
  reducers: {
    logoutRequest: (state) => {
      state.id = ''
      state.name = ''
      state.email = ''
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state, action) => {
        state.loading = true
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        const { name } = action.payload

        state.name = name
        state.loading = false
        state.error = ''
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const { id, name, email } = action.payload
        state.id = id
        state.name = name
        state.email = email
        state.loading = false
        state.error = ''
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const getUser = (state) => state.user
export const getUserIsLoading = (state) => state.user.loading
export const getUserError = (state) => state.user.error

export const { logoutRequest } = userSlice.actions

export default userSlice.reducer
