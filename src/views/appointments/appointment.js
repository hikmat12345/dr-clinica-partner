import React from 'react'
import axiosClient from '../../utils/helpers/server'
import swal from 'sweetalert'
import configData from '../../utils/constants/config.json'
import moment from 'moment'
import BusinessContext from '../../utils/helpers/businesscontext'
import Scanner from './scanner'
import Printer from './printer'
import Pagination from '../../components/Pagination/Pagination'
import BreadCrumb from '../../components/BreadCrumb/BreadCrumb'
import "./style.css"
const bookingId = new URLSearchParams(window?.location?.search)?.get(
  'bookingId',
)

export default class Appointmet extends React.Component {
  static contextType = BusinessContext

  constructor(props) {
    super(props)
    this.state = {
      business: null,
      PopperAction: 'popper-root',
      appointments: [],
      appointment: null,
      categories: [],
      services: [],
      serviceCharges: [],
      selectedServiceCharges: [],
      newServiceChargeAdded: [],
      availableSlots: [],
      categoryFilter: null,
      paymentMethod: 'Cash',
      totalPages: 1,
      selectNewServiceModal: false,
      selectNewService: null,
      selectAppointment: {},
      selectedPriceOption: null,
      selectServiceProviderOption: null,
      newServiceSlotsModal: false,
      dateTimeChangeModal: false,
      selectedSlots: [],
      pageRecordCount: 8,
      loader: false,
      page: 1,
      maxSlotCount: 1,
      selectedDate: '',
      serviceChargesModal: false,
      serviceChargeAmount: 0,
      paidAmount: 0.0,
      paymentModal: false,
      themeColor: localStorage.getItem('dark-mode'),
      scannedVoucher: null,
      paymentConfirm: false,
      selectedCardId: 0,
    }
    this.updateAppointment = this.updateAppointment?.bind(this)
  }

  componentDidMount() {
    const business = this.context
    this.setState({ loader: true })
    axiosClient
      .get(
        `partner/appointment/listingAppointmentApi/?count=${this.state.pageRecordCount}&page=${this.state.page}`,
      )
      .then((resp) => {
        this.setState({ loader: false })
        axiosClient
          .get(
            `customer/bookings/getBookingDetailForPartner?id=${
              resp.data?.appointment.filter(
                (obj) => obj.teammember !== null && obj.status !== 5,
              )[0]?.id
            }`,
          )
          .then((resp) => {
            this.setState({
              selectAppointment: resp.data?.appointment,
              selectedCardId: resp.data?.appointment?.id,
              selectedServiceCharges:
                 resp.data?.appointment?.bookingservicecharges,
              serviceChargeAmount: this.calculateServiceCharge(
                resp.data?.appointment?.bookingservicecharges,
                resp.data?.appointment?.price_bookingsToprice.pricefrom,
              ),
              paidAmount:
                resp.data?.appointment?.payment?.length > 0
                  ? resp.data?.appointment?.payment[0]?._sum?.amount
                  : 0.0,
            })
          })
        console.log(resp.data.appointment, 'resp.data.appointment')
        this.setState({
          business: business,
          appointments: resp.data.appointment?.filter(
            (obj) => obj.status !== 5,
          ),
          totalPages: resp.data.totalPages,

          // categories: resp.data.categories,
          // services: resp.data.services,
          // categoryFilter: resp.data.categories[0].id,
          // serviceCharges: resp.data.serviceCharges,
          // selectedServiceCharges: resp.data.selectedServiceCharges,
          // serviceChargeAmount: this.calculateServiceCharge(
          //   resp.data.bookingservicecharges,
          //   resp.data.appointment?.price_bookingsToprice.pricefrom,
          // ),
          // paidAmount:
          //   resp.data.payment.length > 0
          //     ? resp.data.payment[0]._sum.amount
          //     : 0.0,
        })
      })
  }

  calculateServiceCharge(serviceCharges, bill) {
    let serviceChargeAmount = 0.0
    // serviceCharges?.forEach((serviceCharge) => {
    //   if (serviceCharge.ratetype == 0) {
    //     serviceChargeAmount += serviceCharge.rate
    //   } else {
    //     serviceChargeAmount += parseFloat((bill / 100) * serviceCharge.rate)
    //   }
    // })
    serviceCharges?.forEach((serviceCharge) => { 
        serviceChargeAmount +=  serviceCharge.servicecharge
     
    })
    return serviceChargeAmount
  }

  onTogglePopperAction = (e) => {
    e.preventDefault()
    if (this.state.PopperAction == 'popper-root') {
      this.setState({
        PopperAction: 'popper-root show',
      })
    } else {
      this.setState({
        PopperAction: 'popper-root',
      })
    }
  }

  onToggleModal = (e) => {
    e.preventDefault()
    this.setState({
      [e.currentTarget.id]: !this.state[e.currentTarget.id],
    })
  }

  onSelectService = (appointment) => (e) => {
    e.preventDefault()
    axiosClient
      .get(`customer/bookings/getBookingDetailForPartner?id=${appointment?.id}`)
      .then((resp) => {
        this.setState({
          selectNewServiceModal: true,
          selectedCardId: appointment?.id,
          selectAppointment: resp.data.appointment,
          selectedServiceCharges: resp.data?.appointment?.bookingservicecharges,
          serviceChargeAmount: this.calculateServiceCharge(
            resp.data?.appointment?.bookingservicecharges,
            resp.data?.appointment?.price_bookingsToprice.pricefrom,
          ),
          paidAmount:
            resp.data?.payment?.length > 0
              ? resp.data?.payment?._sum?.amount
              : 0.0,
        })
      })
  }

  onSelectPrice = (price) => (e) => {
    e.preventDefault()
    this.setState({
      selectedPriceOption: price,
    })
  }

  onSelectServiceProvider = (serviceProvider) => (e) => {
    e.preventDefault()
    this.setState({
      selectServiceProviderOption: serviceProvider,
    })
  }

  onSelectNewService = (e) => {
    e.preventDefault()
    if (this.state.selectedSlots.length < 1) {
      swal({
        title: 'Appoitment Slots',
        text: 'Please select slots first',
        icon: 'warning',
        button: 'ok',
      })
      return
    }
    let bill = parseFloat(this.state.selectedPriceOption.pricefrom)
    let vat = (bill / 100) * this.state.selectNewService.tax_serviceTotax.value
    let serviceChargeAmount = 0.0
    this.state.selectedServiceCharges.forEach((serviceCharge) => {
      if (serviceCharge.ratetype == 0) {
        serviceChargeAmount += serviceCharge.rate
      } else {
        serviceChargeAmount += parseFloat((bill / 100) * serviceCharge.rate)
      }
    })
    bill = bill + vat + serviceChargeAmount
    let bodyFormData = new URLSearchParams()
    bodyFormData.append('id', this.state.appointment?.id)
    bodyFormData.append('branch', this.state.appointment?.branch)
    bodyFormData.append('service', this.state.selectNewService.id)
    bodyFormData.append(
      'serviceprovider',
      this.state.selectServiceProviderOption == null
        ? 0
        : this.state.selectServiceProviderOption.id,
    )
    bodyFormData.append('price', this.state.selectedPriceOption.id)
    bodyFormData.append('tax', this.state.selectNewService.tax_serviceTotax.id)
    bodyFormData.append('date', this.state.selectedDate)
    bodyFormData.append('starttime', this.state.selectedSlots[0].startSlot)
    bodyFormData.append(
      'duration',
      this.state.appointment?.price_bookingsToprice.duration,
    )
    bodyFormData.append('bill', bill)
    bodyFormData.append('mop', this.state.appointment?.mop)
    bodyFormData.append('paymentref', this.state.appointment?.paymentref)
    bodyFormData.append('ismodefied', true)
    bodyFormData.append('billdifference', this.state.appointment?.bill - bill)
    axiosClient
      .post(`partner/appointment/updateappointment`, bodyFormData)
      .then((resp) => {
        if (parseInt(Object.keys(resp.data)[0]) === 200) {
          this.setState({
            appointment: resp.data.appointment,
            newServiceSlotsModal: false,
            selectNewServiceModal: false,
          })
        } else {
          swal({
            title: 'Reschedule Appointment',
            text: resp.data[Object.keys(resp.data)[0]],
            icon: 'warning',
            button: 'ok',
          })
        }
      })
  }

  onCheckNewServiceAvailableSlots = (e) => {
    this.state.selectedDate = document.getElementById(
      'serviceChangeNewDate',
    ).value
    let bodyFormData = new URLSearchParams()
    bodyFormData.append('branch', this.state.appointment?.branch)
    bodyFormData.append('service', this.state.selectNewService.id)
    bodyFormData.append('business', this.state.business.id)
    bodyFormData.append('bookingdate', this.state.selectedDate)
    bodyFormData.append(
      'serviceprovider',
      this.state.selectServiceProviderOption == null
        ? 0
        : this.state.selectServiceProviderOption.id,
    )
    axiosClient
      .post(`customer/slots/getavailableslots`, bodyFormData)
      .then((resp) => {
        if (parseInt(Object.keys(resp.data)[0]) === 200) {
          let slots = []
          resp.data.slots.forEach((slot, index) => {
            let startSlot = new Date(
              this.state.selectedDate + ' ' + slot + ':00',
            )
            let endSlot = moment(startSlot)
              .add(resp.data.onlinebooking.timeslot, 'm')
              .toDate()
            slots.push({
              id: index,
              startSlot: `${startSlot.getHours()}:${
                startSlot.getMinutes() == 0
                  ? startSlot.getMinutes() + '0'
                  : startSlot.getMinutes()
              }`,
              endSlot: `${endSlot.getHours()}:${
                endSlot.getMinutes() == 0
                  ? endSlot.getMinutes() + '0'
                  : endSlot.getMinutes()
              }`,
            })
          })
          this.setState({
            availableSlots: slots,
            maxSlotCount: parseInt(
              this.state.selectedPriceOption.duration /
                resp.data.onlinebooking.timeslot,
            ),
          })
        } else {
          swal({
            title: 'Get Appoitment Slots',
            text: resp.data[Object.keys(resp.data)[0]],
            icon: 'warning',
            button: 'ok',
          })
        }
      })
  }

  onClickAvailableSlots = (e) => {
    this.state.selectedDate = document.getElementById(
      'appointmentNewDate',
    ).value
    let bodyFormData = new URLSearchParams()
    bodyFormData.append('branch', this.state.appointment?.branch)
    bodyFormData.append('service', this.state.appointment?.service)
    bodyFormData.append('business', this.state.business.id)
    bodyFormData.append('bookingdate', this.state.selectedDate)
    bodyFormData.append(
      'serviceprovider',
      this.state.appointment?.serviceprovider,
    )
    axiosClient
      .post(`customer/slots/getavailableslots`, bodyFormData)
      .then((resp) => {
        if (parseInt(Object.keys(resp.data)[0]) === 200) {
          let slots = []
          resp.data.slots.forEach((slot, index) => {
            let startSlot = new Date(
              this.state.selectedDate + ' ' + slot + ':00',
            )
            let endSlot = moment(startSlot)
              .add(resp.data.onlinebooking.timeslot, 'm')
              .toDate()
            slots.push({
              id: index,
              startSlot: `${startSlot.getHours()}:${
                startSlot.getMinutes() == 0
                  ? startSlot.getMinutes() + '0'
                  : startSlot.getMinutes()
              }`,
              endSlot: `${endSlot.getHours()}:${
                endSlot.getMinutes() == 0
                  ? endSlot.getMinutes() + '0'
                  : endSlot.getMinutes()
              }`,
            })
          })
          this.setState({
            availableSlots: slots,
            maxSlotCount: parseInt(
              this.state.appointment?.price_bookingsToprice.duration /
                resp.data.onlinebooking.timeslot,
            ),
          })
        } else {
          swal({
            title: 'Get Appoitment Slots',
            text: resp.data[Object.keys(resp.data)[0]],
            icon: 'warning',
            button: 'ok',
          })
        }
      })
  }

  onSelectNewSlot = (slot) => (e) => {
    e.preventDefault()
    let slots = []
    let id = slot.id
    for (let i = 1; i <= this.state.maxSlotCount; i++) {
      slots.push(this.state.availableSlots[`${id}`])
      id += 1
    }
    if (!this.state.selectedSlots.includes(slot)) {
      this.setState({
        selectedSlots: slots,
      })
    }
    console.log(this.state.selectedSlots)
  }

  onRescheduleAppointment = (e) => {
    if (this.state.selectedSlots.length < 1) {
      swal({
        title: 'Appoitment Slots',
        text: 'Please select slots first',
        icon: 'warning',
        button: 'ok',
      })
      return
    }
    let bodyFormData = new URLSearchParams()
    bodyFormData.append('id', this.state.appointment?.id)
    bodyFormData.append('branch', this.state.appointment?.branch)
    bodyFormData.append('service', this.state.appointment?.service)
    bodyFormData.append(
      'serviceprovider',
      this.state.appointment?.serviceprovider,
    )
    bodyFormData.append('price', this.state.appointment?.price)
    bodyFormData.append('tax', this.state.appointment?.tax)
    bodyFormData.append('date', this.state.selectedDate)
    bodyFormData.append('starttime', this.state.selectedSlots[0].startSlot)
    bodyFormData.append(
      'duration',
      this.state.appointment?.price_bookingsToprice.duration,
    )
    bodyFormData.append('bill', this.state.appointment?.bill)
    bodyFormData.append('mop', this.state.appointment?.mop)
    bodyFormData.append('paymentref', this.state.appointment?.paymentref)
    bodyFormData.append('ismodefied', true)
    bodyFormData.append(
      'billdifference',
      this.state.appointment?.billdifference,
    )
    axiosClient
      .post(`partner/appointment/updateappointment`, bodyFormData)
      .then((resp) => {
        if (parseInt(Object.keys(resp.data)[0]) === 200) {
          this.setState({
            appointment: resp.data.appointment,
            dateTimeChangeModal: false,
          })
        } else {
          swal({
            title: 'Reschedule Appointment',
            text: resp.data[Object.keys(resp.data)[0]],
            icon: 'warning',
            button: 'ok',
          })
        }
      })
  }

  onSaveNewServiceCharge = (e) => {
    e.preventDefault()
    let bill = parseFloat(
      this.state.appointment?.price_bookingsToprice.pricefrom,
    )
    let vat = (bill / 100) * this.state.appointment?.tax_bookingsTotax.value
    let serviceChargeAmount = 0.0
    let serviceCharges = [
      ...this.state.selectedServiceCharges,
      ...this.state.newServiceChargeAdded,
    ]
    serviceCharges.forEach((serviceCharge) => {
      if (serviceCharge.ratetype == 0) {
        serviceChargeAmount += serviceCharge.rate
      } else {
        serviceChargeAmount += parseFloat((bill / 100) * serviceCharge.rate)
      }
    })
    bill = bill + vat + serviceChargeAmount
    let bodyFormData = new URLSearchParams()
    bodyFormData.append('id', this.state.appointment?.id)
    bodyFormData.append(
      'servicecharges',
      JSON.stringify([
        ...this.state.selectedServiceCharges,
        ...this.state.newServiceChargeAdded,
      ]),
    )
    bodyFormData.append('bill', bill)
    bodyFormData.append('billdifference', this.state.appointment?.bill - bill)
    axiosClient
      .post(
        `partner/appointment/updateappointmentwithservicecharge`,
        bodyFormData,
      )
      .then((resp) => {
        if (parseInt(Object.keys(resp.data)[0]) === 200) {
          console.log(resp.data)
          this.setState({
            appointment: resp.data.appointment,
            selectedServiceCharges: [
              ...this.state.selectedServiceCharges,
              ...this.state.newServiceChargeAdded,
            ],
            serviceChargeAmount: serviceChargeAmount,
            serviceChargesModal: false,
          })
        } else {
          swal({
            title: 'Reschedule Appointment',
            text: resp.data[Object.keys(resp.data)[0]],
            icon: 'warning',
            button: 'ok',
          })
        }
      })
  }

  onPaymentClicked = (e) => {
    e.preventDefault()
    this.setState({
      paymentConfirm: true,
    })
  }

  payment = (e) => {
    var bodyFormData = new URLSearchParams()
    bodyFormData.append('bookingId', this.state.selectAppointment?.id)
    bodyFormData.append('mop', this.state.paymentMethod)
    bodyFormData.append('bill', this.state.selectAppointment?.bill)
    axiosClient
      .post(`partner/appointment/appointmentpayment`, bodyFormData)
      .then((resp) => {
        if (parseInt(Object.keys(resp.data)[0]) === 200) {
          console.log(resp.data)
          this.updateAppointment(
            resp.data.appointment,
            resp.data.payment?.length > 0
              ? resp?.data.payment[0]?._sum?.amount
              : 0.0,
          )
          this.setState({
            paymentConfirm: false,
          })
          // swal({
          //   title: 'Completed ',
          //   text: resp.data[Object.keys(resp.data)[0]],
          //   icon: 'success',
          //   button: 'ok',
          // })
            window.location.href='/account/billingdetails'          
        } else {
          swal({
            title: 'Get Appoitment Data',
            text: resp.data[Object.keys(resp.data)[0]],
            icon: 'warning',
            button: 'ok',
          })
        }
      })
  }

  updateAppointment(appointmet, paidAmount) {
    console.log(appointmet, paidAmount)
    this.setState({
      appointmet: appointmet,
      paidAmount: paidAmount,
    })
  }

  generateInvoice = async (e) => {
    e.preventDefault()
    return
    var bodyFormData = new URLSearchParams()
    bodyFormData.append('bookingId', this.state.appointment?.id)
    axiosClient
      .post(`partner/invoice/createinvoice`, bodyFormData)
      .then((resp) => {
        if (parseInt(Object.keys(resp.data)[0]) === 200) {
          console.log(resp.data)
        } else {
          swal({
            title: 'Invoice',
            text: resp.data[Object.keys(resp.data)[0]],
            icon: 'warning',
            button: 'ok',
          })
        }
      })
  }

  // pagintation
  handlePageChange = (e) => {
    e.preventDefault()
    this.setState({ loader: true })

    axiosClient
      .get(
        `partner/appointment/listingAppointmentApi/?count=${
          this.state.pageRecordCount
        }&page=${e.currentTarget.getAttribute('data-page')}`,
      )
      .then((resp) => {
        this.setState({
          loader: false,
          appointments: resp.data?.appointment?.filter(
            (obj) => obj.status !== 5,
          ),
          totalPages: resp.data.totalPages,
        })
      })
      .catch((err) => {
        swal({
          title: 'Server Not Responding',
          text: 'Please try again later',
          icon: 'warning',
          button: 'ok',
        })
      })
  }
  render() {
    const {
      appointment,
      categories,
      services,
      serviceCharges,
      selectedServiceCharges,
      newServiceChargeAdded,
      availableSlots,
      categoryFilter,
      paymentMethod,
      selectNewService,
      selectNewServiceModal,
      selectServiceProviderOption,
      dateTimeChangeModal,
      newServiceSlotsModal,
      selectedSlots,
      selectAppointment,
      serviceChargesModal,
      serviceChargeAmount,
      paidAmount,
      paymentModal,
      themeColor,
      loader,
      paymentConfirm,
    } = this.state
    return (
      <React.Fragment>
        <main className="main-content px-[var(--margin-x)] pb-8">
          <BreadCrumb />
          {/* {this.state.appointment == null ? null : */}
          <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-1 lg:gap-6 text-center">
            <div className=" grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6">
              <div className="col-span-12 sm:col-span-6 lg:col-span-8">
                {loader ? (
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
                ) : (
                  <div className="mt-4 mb-6" style={{ marginBottom: '4rem' }}>
                    <>
                      {this.state.appointments?.map((appointment) => {
                        return (
                          appointment?.teammember !== null && (
                            <div
                              className="card my-3 p-6 cursor-pointer"
                              key={appointment?.id}
                              id="selectNewServiceModal"
                              onClick={this.onSelectService(appointment)}
                              style={{
                                border:
                                  appointment?.id == this.state.selectedCardId
                                    ? '1px solid black'
                                    : '',
                                    backgroundColor:appointment?.id == this.state.selectedCardId
                                    ? '#efefef94'
                                    : ''
                              }}
                            >
                              <div className="pt-2 flex justify-between">
                                <div className="pt-2 flex justify-between">
                                  {' '}
                                  <div>
                                    <p className="text-left font-medium text-slate-700 line-clamp-1 dark:text-navy-100">
                                      {appointment?.starttime +
                                        '-' +
                                        appointment?.endtime}
                                    </p>
                                    <p className="text-left font-medium text-slate-700 line-clamp-1 dark:text-navy-100">
                                      {moment(appointment?.date).format('dddd')}
                                    </p>
                                  </div>
                                  <div
                                    style={{
                                      paddingLeft: '3rem',
                                      paddingTop: '5px',
                                    }}
                                  >
                                    {' '}
                                    <p className="text-left text-xs text-slate-400 line-clamp-1 dark:text-navy-300">
                                      {appointment?.customer_bookingsTocustomer
                                        ?.firstname +
                                        ' ' +
                                        appointment?.customer_bookingsTocustomer
                                          ?.lastname}
                                    </p>
                                    <p className="text-left text-xs text-slate-400 line-clamp-1 dark:text-navy-300">
                                      with{' '}
                                      {appointment?.teammember?.firstname +
                                        ' ' +
                                        appointment?.teammember?.lastname}
                                      {' • ' +
                                        appointment?.service_bookingsToservice
                                          ?.name}
                                    </p>
                                  </div>
                                </div>

                                <div>
                                  <p
                                    style={{ paddingTop: '20px' }}
                                    className="text-right font-medium text-primary dark:text-accent-light"
                                  >
                                    {appointment?.bill} AED
                                  </p>
                                </div>
                              </div>
                            </div>
                          )
                        )
                      })}
                    </>
                    {console.log(
                      this.state.totalPages,
                      'this.state.totalPages',
                    )}
                    {Pagination({
                      handlePageChange: this.handlePageChange,
                      page: this.state.page,
                      totalPages: this.state.totalPages,
                    })}
                  </div>
                )}
              </div>

              <div
                className="hidden sm:col-span-6 sm:block lg:col-span-4"
                style={{
                  right: 0,
                  position: 'sticky',
                  top: 0,
                  position: 'fixed',
                  top: '120px',
                  width: '29%',
                }}
              >
                <div className="card mt-5 p-4 sm:p-5">
                  <div className="">
                    <p
                      className="space-x-1 "
                      style={{ width: '240px', float: 'left' }}
                    >
                      <span className="text-base font-medium text-slate-700 dark:text-navy-100">
                        Appointment
                      </span>
                      <span>#{selectAppointment?.id}</span>
                      <span>
                        ({moment(selectAppointment?.date).format('YYYY-MM-DD')}{' '}
                        )
                      </span>
                    </p>

                    {/* <div
                      className="flex space-x-1"
                      style={{
                        width: '64px',
                        float: 'left',
                        marginLeft: '106px',
                      }}
                    >
                      <button className="btn h-7 w-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4.5 w-4.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1.5"
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </button>
                      <button className="btn h-7 w-7 rounded-full p-0 hover:bg-slate-300/20 hover:text-error focus:bg-slate-300/20 focus:text-error active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4.5 w-4.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          stroke-width="1.5"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>

                      <div
                        x-data="usePopper({placement:'bottom-end',offset:4})"
                        className="inline-flex"
                      >
                        <button
                          x-ref="popperRef"
                          className="btn h-7 w-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                          onClick={this.onTogglePopperAction}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4.5 w-4.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="1.5"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                            />
                          </svg>
                        </button>

                        <div
                          x-ref="popperRoot"
                          className={this.state.PopperAction}
                        >
                          <div className="popper-box rounded-md border border-slate-150 bg-white py-1.5 font-inter dark:border-navy-500 dark:bg-navy-700">
                            <ul>
                              <li>
                                <button
                                  id="dateTimeChangeModal"
                                  className="flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-none transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                                  onClick={(e) => {
                                    this.setState({
                                      PopperAction: 'popper-root',
                                      availableSlots: [],
                                    })
                                    this.onToggleModal(e)
                                  }}
                                >
                                  Reschedule Appointment
                                </button>
                              </li>
                            </ul>
                            <div className="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>
                            <ul>
                              <li>
                                <a
                                  href=""
                                  className="flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-none transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                                  onClick={(e) => {}}
                                >
                                  Cancel Appointment
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div> */}
                  </div>

                  <div className="my-4 h-px bg-slate-200 dark:bg-navy-500"></div>

                  <div className="flex flex-col space-y-3.5">
                    <div className="group flex items-center justify-between space-x-3">
                      <div className="flex items-center space-x-4">
                        <div className="relative flex">
                          <img
                            src={
                              selectAppointment?.customer_bookingsTocustomer
                                ?.image
                                ? selectAppointment?.customer_bookingsTocustomer
                                    ?.image
                                : '/images/200x200.png'
                            }
                            className="mask is-star h-11 w-11 origin-center object-cover"
                            alt="image"
                          />
                          {/* <div className="absolute top-0 right-0 -m-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full border border-white bg-slate-200 px-1 text-tiny+ font-medium leading-none text-slate-800 dark:border-navy-700 dark:bg-navy-450 dark:text-white">
                            1
                          </div> */}
                        </div>

                        <div className="text-left">
                          <div className="flex items-center space-x-1">
                            <p className="font-medium text-slate-700 line-clamp-1 dark:text-navy-100">
                              {`${selectAppointment?.customer_bookingsTocustomer?.firstname} ${selectAppointment?.customer_bookingsTocustomer?.lastname}`}
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
                            {appointment?.service_bookingsToservice.details}
                          </p>
                          {appointment?.teammember ? (
                            <p className="text-xs+ text-slate-400 dark:text-navy-300 line-clamp-1">
                              Provider: {appointment?.teammember.firstname}{' '}
                              {appointment?.teammember.lastname}
                            </p>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                      <p className="font-inter font-semibold">
                        <div
                          x-data="usePopper({placement:'bottom-end',offset:4})"
                          class="inline-flex"
                        >
                          <button
                            x-ref="popperRef"
                            class="btn h-8 w-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                            onClick={() => {
                              if (
                                document
                                  .getElementById('pooper-client')
                                  .classList.contains('show')
                              ) {
                                document
                                  .getElementById('pooper-client')
                                  .classList.remove('show')
                              } else {
                                document
                                  .getElementById('pooper-client')
                                  .classList.add('show')
                              }
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              stroke-width="2"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                              />
                            </svg>
                          </button>

                          <div
                            id={'pooper-client'}
                            x-ref="popperRoot"
                            class="popper-root"
                          >
                            <div class="popper-box rounded-md border border-slate-150 bg-white py-1.5 font-inter dark:border-navy-500 dark:bg-navy-700">
                              <ul>
                                <li>
                                  <button
                                    class="flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-none transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                                    onClick={() => {}}
                                  >
                                    View Profile
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </p>
                    </div>
                  </div>

                  {/* <div className="my-4 h-px bg-slate-200 dark:bg-navy-500"></div> */}

                  {/* <div className="flex flex-col space-y-3.5">
                    <div className="group flex items-center justify-between space-x-3">
                      <h5 className="text-left text-base font-semibold">
                        Services Charges
                      </h5>
                      <div
                        className="badge bg-navy-700 text-white dark:bg-navy-900"
                        onClick={() => {
                          this.setState({
                            serviceChargesModal: true,
                          })
                        }}
                      >
                        +Add
                      </div>
                    </div>
                  </div> */}

                  {/* <div className="my-4 h-px bg-slate-200 dark:bg-navy-500"></div> */}

                  <div className="flex flex-col space-y-3.5">
                    {/* {selectedServiceCharges?.map((serviceCharge) => (
                      <div className="group flex items-center justify-between space-x-3">
                        <div className="flex items-center space-x-4">
                          <div>
                            <div className="flex items-center space-x-1">
                              <p className="font-medium text-slate-700 line-clamp-1 dark:text-navy-100">
                                {serviceCharge.name}
                              </p>
                            </div>
                            <p className="text-xs+ text-slate-400 dark:text-navy-300 line-clamp-1">
                              {serviceCharge.details}
                            </p>
                          </div>
                        </div>
                        <p className="text-left font-inter font-semibold">
                          {serviceCharge.ratetype == 0 ? 'AED' : '%'}{' '}
                          {serviceCharge.rate}
                        </p>
                      </div>
                    ))} */}
                  </div>

                  <div className="my-4 h-px bg-slate-200 dark:bg-navy-500 mb-20"></div>

                  <div className="space-y-2 font-inter " style={{marginTop:"35%"}}>
                    {/* <div className="flex justify-between text-slate-600 dark:text-navy-100">
                      <p>Subtotal</p>
                      <p className="font-medium tracking-wide">
                        AED{' '}
                        {appointment?.price_bookingsToprice?.pricefrom?.toFixed(
                          2,
                        )}
                      </p>
                    </div> */}
                    <div className="flex justify-between text-xs+">
                      <p>
                        Tax ({selectAppointment?.tax_bookingsTotax?.value}%)
                      </p>
                      <p className="font-medium tracking-wide">
                        {' '}
                        AED{' '}
                        {(
                          (selectAppointment?.price_bookingsToprice?.pricefrom /
                            100) *
                          selectAppointment?.tax_bookingsTotax?.value
                        )?.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex justify-between text-xs+">
                      <p>Service Charges</p>
                      <p className="font-medium tracking-wide">
                        {' '}
                        AED {serviceChargeAmount?.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex justify-between text-base font-medium text-primary dark:text-accent-light">
                      <p>Total</p>
                      <p>AED {selectAppointment?.bill?.toFixed(2)}</p>
                    </div>
                    {/* <div className="flex justify-between text-xs+">
                      <p>Amount Paid</p>
                      <p className="font-medium tracking-wide">
                        {' '}
                        AED {paidAmount}
                      </p>
                    </div>
                    <div className="flex justify-between text-base font-medium text-primary dark:text-accent-light">
                      <p>Amount Due</p>
                      <p>
                        AED{' '}
                        {console.log(
                          selectAppointment?.bill &&
                            Number.isInteger(selectAppointment?.bill),
                          selectAppointment?.bill,
                          paidAmount,
                          'Number.isInteger(selectAppointment?.bill)',
                        )}
                        {selectAppointment?.bill}
                      </p>
                    </div> */}
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-4 text-center">
                    <button
                      className={
                        paymentMethod == 'Cash'
                          ? 'rounded-lg border border-primary p-3 dark:border-navy-500'
                          : 'rounded-lg border border-slate-200 p-3 dark:border-navy-500'
                      }
                      style={
                        themeColor == 'dark' && paymentMethod == 'Cash'
                          ? { borderColor: '#ffffff' }
                          : {}
                      }
                      onClick={() => {
                        this.setState({ paymentMethod: 'Cash' })
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="inline h-9 w-9"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="1"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <span className="mt-1 font-medium text-primary dark:text-accent-light">
                        Cash
                      </span>
                    </button>

                    <button
                      className={
                        paymentMethod == 'Card'
                          ? 'rounded-lg border border-primary p-3 dark:border-navy-500'
                          : 'rounded-lg border border-slate-200 p-3 dark:border-navy-500'
                      }
                      style={
                        themeColor == 'dark' && paymentMethod == 'Card'
                          ? { borderColor: '#ffffff' }
                          : {}
                      }
                      onClick={() => {
                        this.setState({ paymentMethod: 'Card' })
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="inline h-9 w-9"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                      <span className="mt-1 font-medium text-primary dark:text-accent-light">
                        Card
                      </span>
                    </button>

                    <button
                      className={
                        paymentMethod == 'Scan'
                          ? 'rounded-lg border border-primary p-3 dark:border-navy-500'
                          : 'rounded-lg border border-slate-200 p-3 dark:border-navy-500'
                      }
                      style={
                        themeColor == 'dark' && paymentMethod == 'Scan'
                          ? { borderColor: '#ffffff' }
                          : {}
                      }
                      onClick={() => {
                        this.setState({ paymentMethod: 'Scan' })
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="inline h-9 w-9"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                        />
                      </svg>
                      <span className="mt-1 font-medium text-primary dark:text-accent-light">
                        Scan
                      </span>
                    </button>
                  </div>

                  <button
                    className="btn mt-5 h-11 justify-between bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
                    onClick={() => {
                      this.setState({
                        paymentModal: true,
                      })
                    }}
                  >
                    <span>Create Invoice</span>
                    <span>AED {selectAppointment?.bill}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* } */}
        </main>

        {serviceChargesModal ? (
          <div
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
            role="dialog"
          >
            <div
              className="absolute inset-0 bg-slate-900/60 backdrop-blur transition-opacity duration-300"
              id="serviceChargesModal"
              onClick={this.onToggleModal}
            ></div>
            <div className="relative w-full max-w-2xl origin-bottom rounded-lg bg-white pb-4 transition-all duration-300 dark:bg-navy-700">
              <div className="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
                <h3 className="text-base font-medium text-slate-700 dark:text-navy-100">
                  Service charges
                </h3>
                <button
                  className="btn -mr-1.5 h-7 w-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                  id="serviceChargesModal"
                  onClick={this.onToggleModal}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4.5 w-4.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
              <div
                className="is-scrollbar-hidden min-w-full overflow-x-auto text-left p-4"
                style={{ height: '450px', overFlowY: 'scroll' }}
              >
                {serviceCharges.length > 0 ? (
                  <div className="mt-2 grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-1 lg:gap-6">
                    {serviceCharges.map((serviceCharge) => (
                      <div className=" items-center justify-between alert flex rounded-lg border border-slate-300 px-4 py-4 text-slate-800 dark:border-navy-450 dark:text-navy-50 sm:px-5">
                        <div>
                          <p>{serviceCharge.name}</p>
                          <small>{serviceCharge.details}</small>
                        </div>
                        {selectedServiceCharges?.filter(
                          (e) => e.id === serviceCharge.id,
                        ).length > 0 ||
                        newServiceChargeAdded.filter(
                          (e) => e.id === serviceCharge.id,
                        ).length ? (
                          <div className="badge bg-slate-150 text-slate-800">
                            <i className="fa-solid fa-circle-check pr-1"></i>
                            Added
                          </div>
                        ) : (
                          <div
                            className="badge bg-slate-150 text-slate-800"
                            onClick={(e) => {
                              this.setState({
                                newServiceChargeAdded: [
                                  ...newServiceChargeAdded,
                                  serviceCharge,
                                ],
                              })
                            }}
                          >
                            <i
                              className="fa fa-plus-circle pr-1"
                              aria-hidden="true"
                            ></i>
                            Add
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="font-inter">
                    Please cretae service charge from the settings.
                  </p>
                )}
              </div>
              <div className="text-center mt-2">
                <button
                  className="btn bg-primary font-medium text-white m-2"
                  onClick={this.onSaveNewServiceCharge}
                >
                  Save
                </button>
                <button
                  className="btn bg-primary font-medium text-white m-2"
                  id="serviceChargesModal"
                  onClick={this.onToggleModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
        {paymentModal ? (
          <div
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
            role="dialog"
          >
            <div
              className="absolute inset-0 bg-slate-900/60 backdrop-blur transition-opacity duration-300"
              id="paymentModal"
              onClick={this.onToggleModal}
            ></div>
            <div className="relative w-full max-w-2xl origin-bottom rounded-lg bg-white pb-4 transition-all duration-300 dark:bg-navy-700">
              <div className="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
                <h3 className="text-base font-medium text-slate-700 dark:text-navy-100">
                  Payment
                </h3>
                <button
                  className="btn -mr-1.5 h-7 w-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                  id="paymentModal"
                  onClick={this.onToggleModal}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4.5 w-4.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
              <div
                className="is-scrollbar-hidden min-w-full overflow-x-auto text-left p-4"
                style={{ height: '450px', overFlowY: 'scroll' }}
              >
                {/* {appointment?.bookingpayment.length > 0 ? (
                  <div className="mt-2 grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-1 lg:gap-6">
                    {appointment?.bookingpayment.map((payment) => (
                      <div className="items-center justify-between alert flex rounded-lg border border-slate-300 px-4 py-4 text-slate-800 dark:border-navy-450 dark:text-navy-50 sm:px-5">
                        <div>
                          <p>{payment.paymenttype}</p>
                        </div>
                        <div className="badge bg-slate-150 text-slate-800">
                          <i className="fa-solid fa-circle-check pr-1"></i>AED{' '}
                          {payment.amount.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="font-inter">
                    Please cretae service charge from the settings.
                  </p>
                )} */}
                {/* {selectAppointment?.bill?.toFixed(2) - paidAmount?.toFixed(2) >
                0 ? (
                  <div className="mt-2 grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-1 lg:gap-6">
                    <div className="items-center justify-between alert flex rounded-lg border border-slate-300 px-4 py-4 text-slate-800 dark:border-navy-450 dark:text-navy-50 sm:px-5">
                      <div>
                        <p className='text-sm  font-semibold	'>Amount Due</p>
                        <span className='text-sm '>
                          Selected payment method is {paymentMethod},
                          {paymentMethod != 'Scan' ? (
                            <button
                              className="underline decoration-primary decoration-2"
                              onClick={this.onPaymentClicked}
                            >
                              click to pay
                            </button>
                          ) : (
                            <></>
                          )}
                        </span>
                      </div>
                      <div className="badge bg-warning text-white">
                        <i
                          className="fa fa-credit-card pr-1"
                          aria-hidden="true"
                        ></i>
                        AED{' '}
                        {selectAppointment?.bill?.toFixed(2) -
                          paidAmount?.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-1 lg:gap-6">
                    <div className="items-center justify-between alert flex rounded-lg border border-slate-300 px-4 py-4 text-slate-800 dark:border-navy-450 dark:text-navy-50 sm:px-5">
                      <div>
                        <p> Payment cleared</p>
                        <small>click to generate invoice</small>
                        <Printer />
                      </div>
                      <div
                        className="badge bg-success text-white"
                        onClick={this.generateInvoice}
                      >
                        <i className="fas fa-file-invoice pr-1"></i>AED{' '}
                        {selectAppointment?.bill?.toFixed(2)}
                      </div>
                    </div>
                  </div>
                )} */}
                {paymentMethod == 'Scan' &&
                selectAppointment?.bill?.toFixed(2) - paidAmount?.toFixed(2) >
                  0 ? (
                  <div className="mt-2 grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-1 lg:gap-6">
                    <Scanner
                      appointment={appointment}
                      updateAppointment={this.updateAppointment}
                    />
                  </div>
                ) : (
                  <></>
                )}
                {/* {paymentConfirm ? ( */}
                <div className="mt-2  items-center justify-between alert flex rounded-lg border border-slate-300 px-4 py-4 text-slate-800 dark:border-navy-450 dark:text-navy-50 sm:px-5">
                  <div>
                    <p className='text-sm  font-semibold	'>Confirm Payment:</p>
                    <span className='text-sm  	'>
                      Please collect AED{' '}
                      {selectAppointment?.bill?.toFixed(2) -
                        paidAmount?.toFixed(2)}{' '}
                      by {paymentMethod} and click okay after collection
                    </span>
                  </div>
                  <div
                    className="badge bg-warning text-white  cursor-pointer"
                    onClick={this.payment}
                  >
                    <i
                      className="fa fa-credit-card pr-1"
                      aria-hidden="true"
                    ></i>
                    Confirm
                  </div>
                </div>
                {/* // ) : (
                //   <></>
                // )} */}
              </div>
              <div className="text-center mt-2">
                <button
                  className="btn bg-primary font-medium text-white m-2"
                  id="paymentModal"
                  onClick={this.onToggleModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </React.Fragment>
    )
  }
}
