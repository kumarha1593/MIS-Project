import axios from 'axios'

export const defaultInstance = axios.create({ baseURL: process.env.REACT_APP_BASE_URL });

defaultInstance.interceptors.request.use((req) => req, (err) => Promise.reject(err))
defaultInstance.interceptors.response.use((res) => res, (err) => Promise.reject(err))

export default defaultInstance
