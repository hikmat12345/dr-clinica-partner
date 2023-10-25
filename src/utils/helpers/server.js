import axios from 'axios'
import swal from 'sweetalert'
import configData from '../constants/config.json'

const axiosClient = axios.create({
  baseURL: configData.SERVER_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    accesstoken: configData.ACCESSTOKEN,
    logintoken: localStorage.getItem('loginToken'),
    // logintoken:
    //   'xVVp63j6I_7QZ9PlViUb-M7tASTHui_2fKdfaZOvgPgb7d1Bokn9DUVcCKOSDS_a1xB5G9kZemTjMIINd6Kn-K1PDXMzI8jVA4BAlmTplsp6V0rSTH6W0U3VkRLiCjeL2O4H_Du4DKYC2QHMPd9MyG',
    // logintoken: "qR25HMyTU9DEVzmACDaM2GNyj8HjYNigIL_bsSweabOMrnZfGrO2LS_bR3XtfiKEBYSOmeDLM_WaOlT-WFIZt5NR5cLRkdIQuhzQCM1JAVEkPwhipXDtScpXaVqAOI_qrYspkz2HgrYHjtySHHW-Jo",
  },
})

axiosClient.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    swal({
      title: 'Server Not Responding',
      text: 'Please try again later',
      icon: 'warning',
      button: 'ok',
    })
    console.log(error)
    return Promise.reject(error)
  },
)

export default axiosClient
