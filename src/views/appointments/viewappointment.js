import React, { useEffect, useState } from 'react'
import axiosClient from '../../utils/helpers/server'
import swal from 'sweetalert'
import configData from '../../utils/constants/config.json'
import { useLocation } from 'react-router-dom'
var moment = require('moment')

function ViewAppointOld(props) {
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
  const serviceId = useLocation()
  console.log(serviceId, 'serviceId')
  useEffect(() => {
    document.querySelector(".header").style.display="none"
    document.querySelector(".footer").style.display="none"
    document.querySelector(".sidebar").style.display="none"
    let path = window.location.pathname.split('/')
    console.log(path[path.length - 1])
    axiosClient
      .get(
        `customer/bookings/getBookingDetailForPartner?id=${
          path[path.length - 1]
        }`,
      )
      .then((resp) => {
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
    return  ()=>{
      document.querySelector(".header").style.display="initial"
      document.querySelector(".footer").style.display="initial"
      document.querySelector(".sidebar").style.display="initial"
      }
  }, [])

  return (
    <>
      {appointment !== undefined ? (
        <div
          className="card shadow"
          style={{
            height: 'auto',
            width: '595px',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: '1rem',
          }}
        >
           
          {console.log(appointment, 'appointment')}
          <div className="grid grid-cols-2 gap-4">
            <div className="mx-auto">
              <a href="/" className="flex items-center space-x-2">
                <img
                  className="h-24"
                  src="/images/app-logo-main.png"
                  alt="Dr. Clinica"
                />
              </a>
            </div>
            <div className="m-auto">
              <div className="text-left">
                <p className="text-xs+">Reference No #{appointment?.id}</p>
                <p className="text-xs+">
                  {appointment?.customer_bookingsTocustomer.firstname}{' '}
                  {appointment?.customer_bookingsTocustomer.lastname}
                </p>
                <p className="text-xs+">
                  {appointment?.customer_bookingsTocustomer.email}
                </p>
                <p className="text-xs+">
                  {appointment?.customer_bookingsTocustomer.phone}
                </p>
              </div>
            </div>
          </div>
          <div className="mb-4 h-px  bg-slate-200 dark:bg-navy-500"></div>
          <div className="mt-4 m-2">
            <h6 className="text-sm text-error">
              {moment(appointment?.date).format('MMMM DD, YYYY')} (
              {appointment?.starttime} {appointment?.endtime})
            </h6>
            <small>
              Please visit the clinic 20 minutes prior to your appointment time.
            </small>
          </div>
          <div className="is-scrollbar-hidden min-w-full overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border border-transparent border-b-slate-200 dark:border-b-navy-500">
                  <th className="whitespace-nowrap px-3 py-3 font-semibold uppercase text-slate-800 dark:text-navy-100 lg:px-5">
                    #
                  </th>
                  <th className="whitespace-nowrap px-3 py-3 font-semibold uppercase text-slate-800 dark:text-navy-100 lg:px-5">
                    Description
                  </th>
                  <th className="whitespace-nowrap px-3 py-3 font-semibold uppercase text-slate-800 dark:text-navy-100 lg:px-5">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border border-transparent border-b-slate-200 dark:border-b-navy-500">
                  <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                    <div className="relative flex">
                      <img
                        src={
                          appointment?.service_bookingsToservice.serviceimages
                            .length > 0
                            ?  
                              appointment?.service_bookingsToservice
                                .serviceimages[0].image
                            : '/images/200x200.png'
                        }
                        className="mask is-star h-11 w-11 origin-center object-cover"
                        alt="image"
                      />
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                    <div className="text-left">
                      <div className="flex items-center space-x-1">
                        <p className="font-medium text-slate-700 line-clamp-1 dark:text-navy-100">
                          {appointment?.service_bookingsToservice.name}
                        </p>
                        <button className="btn h-6 w-6 rounded-full p-0 opacity-0 hover:bg-slate-300/20 focus:bg-slate-300/20 focus:opacity-100 active:bg-slate-300/25 group-hover:opacity-100 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3.5 w-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                      </div>
                      <p className="text-xs+ text-slate-400 dark:text-navy-300 line-clamp-1">
                        {appointment?.service_bookingsToservice.details && appointment?.service_bookingsToservice.details.slice(
                          0,
                          45,
                        ) + '...'}
                      </p>
                      {appointment?.teammember == null ? (
                        <></>
                      ) : (
                        <p className="text-xs+ text-slate-400 dark:text-navy-300 line-clamp-1">
                          Provider: {appointment?.teammember.firstname}{' '}
                          {appointment?.teammember.lastname}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                    <p className="font-inter font-semibold">
                      AED {appointment?.price_bookingsToprice.pricefrom}
                    </p>
                  </td>
                </tr>
                {appointment?.bookingservicecharges.map((serviceCharge) => (
                  <tr className="border border-transparent border-b-slate-200 dark:border-b-navy-500">
                    <td className="whitespace-nowrap px-4 py-3 sm:px-5"></td>
                    <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                      <div className="text-left">
                        <div className="flex items-center space-x-1">
                          <p className="font-medium text-slate-700 line-clamp-1 dark:text-navy-100">
                            {
                              serviceCharge
                                .servicecharge_bookingservicechargesToservicecharge
                                .name
                            }
                          </p>
                          <button className="btn h-6 w-6 rounded-full p-0 opacity-0 hover:bg-slate-300/20 focus:bg-slate-300/20 focus:opacity-100 active:bg-slate-300/25 group-hover:opacity-100 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3.5 w-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                        </div>
                        <p className="text-xs+ text-slate-400 dark:text-navy-300 line-clamp-1">
                          Service Charge
                        </p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                      <p className="font-inter font-semibold">
                        AED{' '}
                        {serviceCharge
                          .servicecharge_bookingservicechargesToservicecharge
                          .ratetype == 0
                          ? `${serviceCharge.servicecharge_bookingservicechargesToservicecharge.rate}`
                          : `${
                              (appointment?.price_bookingsToprice.pricefrom /
                                100) *
                              serviceCharge
                                .servicecharge_bookingservicechargesToservicecharge
                                .rate
                            } (% ${
                              serviceCharge
                                .servicecharge_bookingservicechargesToservicecharge
                                .rate
                            })`}
                      </p>
                    </td>
                  </tr>
                ))}
                <tr className="border border-transparent border-b-slate-200 dark:border-b-navy-500">
                  <td className="whitespace-nowrap px-4 py-3 sm:px-5"></td>
                  <td className="whitespace-nowrap px-4 py-3 sm:px-5 text-right">
                    <p className="font-medium text-slate-700 line-clamp-1 dark:text-navy-100">
                      Sub Total
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                    <p className="font-medium tracking-wide">
                      AED{' '}
                      {appointment?.price_bookingsToprice.pricefrom.toFixed(2)}
                    </p>
                  </td>
                </tr>
                <tr className="border border-transparent border-b-slate-200 dark:border-b-navy-500">
                  <td className="whitespace-nowrap px-4 py-3 sm:px-5"></td>
                  <td className="whitespace-nowrap px-4 py-3 sm:px-5 text-right">
                    <p className="font-medium text-slate-700 line-clamp-1 dark:text-navy-100">
                      Tax ({appointment?.tax_bookingsTotax.value}%)
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                    <p className="font-medium tracking-wide">
                      {' '}
                      AED{' '}
                      {(
                        (appointment?.price_bookingsToprice.pricefrom / 100) *
                        appointment?.tax_bookingsTotax.value
                      ).toFixed(2)}
                    </p>
                  </td>
                </tr>
                <tr className="border border-transparent border-b-slate-200 dark:border-b-navy-500">
                  <td className="whitespace-nowrap px-4 py-3 sm:px-5"></td>
                  <td className="whitespace-nowrap px-4 py-3 sm:px-5 text-right">
                    <p className="font-medium text-slate-700 line-clamp-1 dark:text-navy-100">
                      Service Charge
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                    <p className="font-medium tracking-wide">
                      {' '}
                      AED {serviceCharge}
                    </p>
                  </td>
                </tr>
                <tr className="border border-transparent border-b-slate-200 dark:border-b-navy-500">
                  <td className="whitespace-nowrap px-4 py-3 sm:px-5"></td>
                  <td className="whitespace-nowrap px-4 py-3 sm:px-5 text-right">
                    <p className="font-medium text-slate-700 line-clamp-1 dark:text-navy-100">
                      Total
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                    <p className="font-medium tracking-wide">
                      {' '}
                      AED {appointment?.bill.toFixed(2)}
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mb-4 h-px  bg-slate-200 dark:bg-navy-500"></div>
          <div className="mt-4 m-2 p-4">
            <small>
              Thank you for reserving an appointment with us. If you have any
              question don't hesitate to connect with us on info@drclinica.com
              <a className="underline" href="https://drclinica.com">
                drclinica.com
              </a>{' '}
              will never redirect you to enter any personal information anywhere
              other than in your{' '}
              <a className="underline" href="https://drclinica.com">
                drclinica.com
              </a>{' '}
              account. Your cooperation in this protects your privacy and
              maintains the integrity of your transactions.
            </small>
          </div>
          <div className="mb-4 h-px  bg-slate-200 dark:bg-navy-500"></div>
          <div className="bg-slate-150">
            <small>Copyright © 2023 all rights reserved by Dr. Clinica.</small>
          </div>
        </div>
      ) : (
        <div
          style={{
            position: 'absolute',
            zIndex: 9999,
            width: '62%',
            height: '100%',
            backgroundColor: '#ededed14',
          }}
        >
          <img
            style={{
              position: 'absolute',
              zIndex: '9999',
              top: 270,
              bottom: 0,
              right: 0,
              left: '50%',
            }}
            className="h-11 loader-img w-11 transition-transform duration-500 ease-in-out hover:rotate-[360deg]"
            src="/images/icons/loader.svg"
            alt="Loader"
          />
        </div>
      )}
    </>
  )
}
export default ViewAppointOld
