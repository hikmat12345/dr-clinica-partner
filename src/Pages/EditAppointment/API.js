import axios from 'axios'
import swal from 'sweetalert'
import configData from '../../utils/constants/config.json'

export const API = ({ method, url, payload, contentType }) => {
  return axios({
    method: method || 'get',
    url: configData.SERVER_URL + url,
    headers: {
      'Content-Type': contentType || 'application/json',
      accesstoken: configData.ACCESSTOKEN,
      logintoken: localStorage.getItem('loginToken'),
    },
    data: payload,
  })
    .then((resp) => {
      return resp.data
    })
    .catch((err) => {})
}
