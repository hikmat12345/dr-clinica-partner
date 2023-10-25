import { fetchAction } from '../utils'
import axios from 'axios'
import configData from '../../utils/constants/config.json'
const APP_BASE_URL = process.env.REACT_APP_BASE_URL

export const AddAppointmentPageActions = ({
  branch,
  service,
  price,
  tax,
  date,
  starttime,
  bill,
  mop,
  paymentref,
  duration,
  serviceprovider,
  servicecharges,
  voucherId,
}) => {
  // return fetchAction({
  //   type: "APPOINTMENT",
  //   verb: "GET",
  //   endpoint: `${APP_BASE_URL}/`,
  // });
  try {
    var data = JSON.stringify({
      branch: branch,
      service: service,
      price: price,
      tax: tax,
      date: date,
      starttime: starttime,
      bill: bill,
      mop: mop,
      paymentref: paymentref,
      duration: duration,
      serviceprovider: serviceprovider,
      servicecharges: servicecharges,
      voucherId: voucherId,
    })
    var config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: configData.SERVER_URL + 'customer/bookings/createBooking',
      headers: {
        accesstoken: configData.ACCESSTOKEN,
        logintoken: localStorage.getItem('loginToken'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: data,
    }

    const response = axios(config)
    return response.data
  } catch (error) {
    console.error(error, 'error')
    return error
  }

  // var urlencoded = new URLSearchParams();
  // urlencoded.append("branch", branch);
  // urlencoded.append("service", service);
  // urlencoded.append("price", price);
  // urlencoded.append("tax", tax);
  // urlencoded.append("date", date);
  // urlencoded.append("starttime", starttime);
  // urlencoded.append("bill", bill);
  // urlencoded.append("mop", mop);
  // urlencoded.append("paymentref", paymentref);
  // urlencoded.append("duration", duration);
  // urlencoded.append("serviceprovider", serviceprovider);
  // urlencoded.append("servicecharges", servicecharges);
  // urlencoded.append("voucherId", voucherId);
}
