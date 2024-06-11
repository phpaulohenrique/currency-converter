import axios from 'axios'

export const api = axios.create({
    baseURL: `https://api.currencybeacon.com/v1/`,
})
