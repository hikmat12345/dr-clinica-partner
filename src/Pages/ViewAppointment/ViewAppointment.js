import React, { useEffect, useState } from 'react'
import './AddAppointment.css'
import configData from '../../utils/constants/config.json'
import axios from 'axios'
import swal from 'sweetalert'
import axiosClient from '../../utils/helpers/server'
import { useLocation, useNavigate } from 'react-router-dom'
import { API } from './API'
import ClientInBookingView, { errorMessage } from './ClientInBookingView'
import moment from 'moment'

export default function ViewAppointment() {
  //************************************ */ Hooks  **************************************************88

  const location = useLocation()
  const isFromListing = new URLSearchParams(window?.location?.search)?.get('isFromListing')

  const calculateServiceCharge = (serviceCharges, bill) => {
    let serviceChargeAmount = 0.0
    serviceCharges.forEach((serviceCharge) => {
      if (
        serviceCharge.servicecharge_bookingservicechargesToservicecharge
          .ratetype == 0
      ) {
        serviceChargeAmount +=
          serviceCharge.servicecharge_bookingservicechargesToservicecharge.rate
      } else {
        serviceChargeAmount += parseFloat(
          (bill / 100) *
            serviceCharge.servicecharge_bookingservicechargesToservicecharge
              .rate,
        )
      }
    })
    return serviceChargeAmount
  }
  const [appointment, setAppointment] = useState()
  const [serviceCharge, setServiceCharge] = useState()
  const [amountPaid, setAmountPaid] = useState(0.0)
  const [loader, setLoader]= useState()
  const serviceId = useLocation()
  console.log(serviceId, 'serviceId')
  useEffect(() => {
    let path = window.location.pathname.split('/')
    setLoader(true)
    axiosClient
      .get(
        `customer/bookings/getBookingDetailForPartner?id=${
          path[path.length - 1]
        }`,
      )
      .then((resp) => {
        setLoader(false)
        console.log(resp.data.appointment, 'resp.data.appointment')
        setAppointment(resp.data.appointment)
        setServiceCharge(
          calculateServiceCharge(
            resp.data.appointment?.bookingservicecharges,
            resp.data.appointment?.price_bookingsToprice?.pricefrom,
          ),
        )
        setAmountPaid(
          resp.data.payment.length > 0 ? resp.data.payment[0]._sum.amount : 0.0,
        )
      })
  }, [])
  const customerObj = {
    name:
      appointment?.customer_bookingsTocustomer.firstname +
      ' ' +
      appointment?.customer_bookingsTocustomer.lastname,
  }
 const submitForm = ()=>{
  window.location.href = `/calendar/appointment?bookingId=${appointment?.id}`
 }
  return (
    <>
      <div className="border px-4 py-6 mt-12 text-xl font-bold bg-white text-dark text-center">
        <h3 className="textblck">View Appointment</h3>
      </div>

      {loader==false ?<div className="grid lg:grid-cols-3 lg:ps-16 sm:px-0 ">
        <div className="lg:col-span-2 md:col-span-2 sm:col-span-3 py-6 sm:px-0 containerpadding">
          <h1 className="text-xl font-bold text-dark-600 dark:text-gray-400 text-left textblck">
            {moment(appointment?.date).format('MMMM DD, YYYY')}
          </h1>
          <div className="flex lg:w-12/12 sm:w-12/12 border-b pt-6 pb-2  justify-between">
            <div className="flex-initial w-2/12 text-sm font-bold text-left textblck">
              {appointment?.starttime} {appointment?.endtime}
            </div>
            <div className="flex-initial text-left w-3/12">
              <h1 className="text-sm font-bold textblck">
                {appointment?.service_bookingsToservice.name}
              </h1>
              <span className="text-sm text-slate-500">
                {(Math.floor(
                  appointment?.price_bookingsToprice?.duration / 60,
                ) > 0
                  ? Math.floor(
                      appointment?.price_bookingsToprice?.duration / 60,
                    ) + 'h-'
                  : '') +
                  (appointment?.price_bookingsToprice?.duration % 60) +
                  'm'}{' '}
                with{' '}
                {appointment?.teammember == null ? (
                  <></>
                ) : (
                  <p className="text-xs+ text-slate-400 dark:text-navy-300 line-clamp-1">
                    {appointment?.teammember.firstname}{' '}
                    {appointment?.teammember.lastname}
                  </p>
                )}
              </span>
            </div>
            <div className="flex-initial flex-none w-5/12"></div>
            <div className="flex-initial w-2/12 text-sm font-bold text-right justify-right textblck priceusd">
              AED {appointment?.bill.toFixed(2)}
            </div>
          </div>
          <div className="flex pt-2 pb-4 justify-between">
            <div className="flex-initial w-1/12"></div>
            <div className="flex-initial w-4/5">
              <span className="text-sm textblck">
                {' '}
                {(Math.floor(
                  appointment?.price_bookingsToprice?.duration / 60,
                ) > 0
                  ? Math.floor(
                      appointment?.price_bookingsToprice?.duration / 60,
                    ) + 'h-'
                  : '') +
                  (appointment?.price_bookingsToprice?.duration % 60) +
                  'm'}{' '}
              </span>
            </div>
            <div className="flex-initial w-6/12"></div>
            <div  className="flex-initial mr-2 w-1/12 text-lg font-bold text-right justify-end textblck">
              AED {appointment?.bill}
            </div>
          </div>

          <div className="pt-6 text-left ">
            <h2 className="text-xl font-bold pb-3 textblck">
              Appointment history
            </h2>
            <h4 className="text-sm textblck">
              Booked by {customerObj?.name}, appointemnt id {appointment?.id} on{' '}
              {moment(appointment?.date).format('MMMM DD, YYYY')} (
              {appointment?.starttime} - {appointment?.endtime})
            </h4>
          </div>
        </div>
        <div className="bg-orange-300 lg:col-span-1 md:col-span-1 sm:col-span-3">
          <div className="inputs lg:w-9/12  md:w-3/12  pb-6 sm:w-12/12 mx-auto">
            <ClientInBookingView
              Total={
                'AED ' +
                appointment?.bill.toFixed(2) +
                ' -  Duration  ' +
                (Math.floor(appointment?.price_bookingsToprice?.duration / 60) >
                0
                  ? Math.floor(
                      appointment?.price_bookingsToprice?.duration / 60,
                    ) + 'h-'
                  : '') +
                (appointment?.price_bookingsToprice?.duration % 60) +
                'm'
              }
              date={moment(appointment?.date).format('MMMM DD YYYY')}
              customerObj={customerObj}
              appointmentData={appointment}
              bookingId={appointment?.id}
              submitForm={submitForm}
              customerImg={appointment?.customer_bookingsTocustomer?.image}
              isFromListing={isFromListing}
            />
          </div>
        </div>
      </div>:""}

      {/* client search and creation  */}
    </>
  )
}
