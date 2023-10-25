import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API } from './API'
import swal from 'sweetalert'
import './ClientInBooking.css'
import moment from 'moment'
import { findDuration } from '../../utls'
import { HistoryOutlined } from '@mui/icons-material'
//or
 function ClientInBookingView({
  onChangeClientSearch,
  inputValue,
  submitForm,
  submitByCheckOutExpress,
  bookingId,
  isClientDetial = false,
  customerObj,
  Total,
  isFromListing,
  customerAppointment,
  cleintSelectionError,
  FormErrorMessage,
  loading,
  date,
  customerImg,
  submitloading,
  appointmentData
}) {
  const [popup, showPopup] = useState(false)
  const [state, setState] = useState({})

  console.log(isClientDetial, 'isClientDetial')
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gender: 'male',
    phone: '',
  })

  const loaderProps = {
    loading,
    size: 25,
    duration: 1,
    colors: ['#5e22f0', '#f6b93b'],
  }
  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }))
  }
  const history = useNavigate()
  const onTogglePopperAction = () => {}
  const onToggleModal = (e) => {
    e.preventDefault()
    setState({
      [e.currentTarget.id]: !this.state[e.currentTarget.id],
    })
  }
  const cancelAppointment = (e) => {
    e.preventDefault()
    API({
      method: 'put',
      url: `partner/appointment/updateStatus/${bookingId}`,
      payload: JSON.stringify({ status: 'Cancelled' }),
    }).then((res) => {
      history(`/calendar?bookingId=${bookingId}&selectedDate=${date}`)
    })
  }
  const noShowAppointment = (e) => {
    e.preventDefault()
    API({
      method: 'put',
      url: `partner/appointment/updateStatus/${bookingId}`,
      payload: JSON.stringify({ status: 'Unattended' }),
    }).then((res) => {
      history(`/calendar?bookingId=${bookingId}&selectedDate=${date}`)
    })
  }
  
  const startTiming = appointmentData?.starttime?.split(':');
  const endTiming = appointmentData?.endtime?.split(':');
  
  const startTime = new Date(0, 0, 0, startTiming[0], startTiming[1]);
  const endTime = new Date(0, 0, 0, endTiming[0], endTiming[1]);

const durationInMs = endTime - startTime; 
// duration in milliseconds
console.log(appointmentData, 'appointmentData')
const durationInMinutes = durationInMs/ 60000;
  return (
    <div
      className="client-selection-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '34.3rem',
        marginBottom: '26px',
        borderRight: 'none',
        borderTop: 'none',
        borderBottom: 'none',
      }}
    >
      <ul
        data-qa="customer-list"
        className="p-6 divide-y divide-slate-200 divide-solid"
        style={{ padding: '5px', margin: '0px' }}
      >
        <li className="flex py-4 first:pt-0 last:pb-0"
        //  style={{cursor:"pointer"}}
        //  onClick={() =>
        //   history.push(`/clients/detail`,{state:cust})
        //  }
         >
          <img
           className=" providerimage shadow rounded-full max-w-full h-auto align-middle border-solid border-4 border-indigo-600"
            src={
              customerImg?customerImg: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr1bUmKKii0o6miVz1u54dco7zuViHzACGzcvh0s66sA&s'
            }            alt=""
          />
          <div
            style={{ paddingLeft: '10px' }}
            className="ml-3 block pl4 overflow-hidden"
          >
            <p style={{marginTop: "25px"}} className="text-sm font-medium text-slate-900">
              {customerObj?.name}
            </p>
          </div>
        </li>
      </ul>
      <hr className="w-full" />
      <div className="_06c69e4b1 _6baf104b1 _1d13464b1 _4d73ce790 _8046d4790 _854a71790 _48c254790">
        <div className="_06c69e4b1 _6baf104b1 _7774974b1 _8046d4790 _854a71790 _48c254790">
          <div className="_06c6af61c" data-qa="placeholder-container">
            <div className="ed70f361c">
              <div className="not-found" data-qa="placeholder-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 64 64"
                  style={{ width: '6rem', margin: 'auto' }}
                >
                  <g fill="none" fill-rule="evenodd">
                    <circle fill="#FBD74C" cx="28.5" cy="23.5" r="9.5"></circle>
                    <path
                      d="M28.5 4C42.031 4 53 14.969 53 28.5a24.413 24.413 0 01-6.508 16.63c.041.022.082.05.12.08l.095.083 14 14a1 1 0 01-1.32 1.497l-.094-.083-14-14a1 1 0 01-.164-.216A24.404 24.404 0 0128.5 53C14.969 53 4 42.031 4 28.5S14.969 4 28.5 4zm0 2C16.074 6 6 16.074 6 28.5S16.074 51 28.5 51 51 40.926 51 28.5 40.926 6 28.5 6zM28 32c3.856 0 7.096.928 9.689 2.392 1.362.77 2.226 2.143 2.305 3.66l.006.229V40a1 1 0 01-.883.993L39 41H17a1 1 0 01-.993-.883L16 40v-1.739c0-1.599.871-3.067 2.29-3.877C20.856 32.924 24.095 32 28 32zm0 2c-3.545 0-6.446.827-8.719 2.122-.748.426-1.216 1.16-1.275 1.966L18 38.26V39h20v-.72c0-.76-.364-1.472-.989-1.945l-.148-.105-.158-.097C34.401 34.832 31.495 34 28 34zm.5-17a6.5 6.5 0 110 13 6.5 6.5 0 010-13zm0 2a4.5 4.5 0 100 9 4.5 4.5 0 000-9z"
                      fill="#101928"
                      fill-rule="nonzero"
                    ></path>
                  </g>
                </svg>
                <p
                  className="_06c6c54ba _19f6f04ba _982dc861c"
                  data-qa="placeholder-body"
                >
                  No sale receipt issued yet
                </p>
              </div>
            </div>
            <div className="_1091c961c"></div>
          </div>
          <div style={{ flexGrow: 1 }}></div>
        </div>
      </div>

      <div className="bottom-secion-clients">
        <div style={{ marginTop: '20px' }}>
          {Total && (
            <p
              style={{ fontWeight: 'bold', color: 'black' }}
              className="_06c6c54ba _4ebb474ba d59a424ba pb-2"
            >
              Total: <span>{Total}</span>
            </p>
          )}

           <div
              className="flex"
              style={{justifyContent: "center", marginBottom: '3px'}}
            >
              {isFromListing ?"":<button
                 x-ref="popperRef"
                onClick={() => {
                  if (
                    document
                      .getElementById('pooper-aa')
                      .classList.contains('show')
                  ) {
                    document
                      .getElementById('pooper-aa')
                      .classList.remove('show')
                  } else {
                    document
                      .getElementById('pooper-aa')
                      .classList.add('show')
                  }
                }}
                className="btn morebtn  mr-1  space-x-2 bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
              >
                More Options
              </button>}
               <div
                  id={'pooper-aa'}
                  x-ref="popperRoot"
                  className="popper-root"
                >
                <div style={{
                  position: "absolute",
                  zIndex: 999,
                   marginTop: "-10.7rem",
                  right: "20%"}} 
                 className="popper-box rounded-md border border-slate-150 bg-white py-1.5 font-inter dark:border-navy-500 dark:bg-navy-700">
                    <ul>
                      <li>
                        <button
                          id="dateTimeChangeModal"
                          className="flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-none transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                          onClick={(e) => {
                            window.location.href=`/calendar?bookingId=${bookingId}&selectedDate=${date}&durvalue=${durationInMinutes}&customerId=${appointmentData?.customer_bookingsTocustomer?.id}&teammemeber=${appointmentData?.teammember?.id}`
                            onToggleModal(e)
                          }}
                        >
                          Reschedule
                        </button>
                      </li>
                    </ul>
                    <div className="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>
                    <ul>
                      <li>
                        <button
                          id="dateTimeChangeModal"
                          className="flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-none transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                          onClick={(e) => {
                            history('/viewappointment/editappointment', {
                              state: { 
                                  appointmentId:appointmentData?.id,
                                  id: appointmentData?.serviceprovider,
                                  startDate: appointmentData?.date,
                                  endDate: appointmentData?.date,
                                  branchId: appointmentData?.branch,
                                  customerId: appointmentData?.customer,
                                  description:appointmentData?.description,
                                  discountId:appointmentData?.discountId,
                                  serviceName: appointmentData?.service_bookingsToservice.name,
                                  serviceId: appointmentData?.service_bookingsToservice.id,
                                  category:appointmentData?.service_bookingsToservice.category_categoryToservice,
                                  subCategory:appointmentData?.service_bookingsToservice.subcategory_serviceTosubcategory,
                                  priceOption:appointmentData?.price_bookingsToprice,
                                  serviceCharges: appointmentData?.bookingservicecharges,
                                  bill:appointmentData?.bll,
                                  image:appointmentData?.customer_bookingsTocustomer?.image,
                                  name:appointmentData?.customer_bookingsTocustomer?.firstname,
                                  email:appointmentData?.customer_bookingsTocustomer?.email,
                                  categoryId:appointmentData?.service_bookingsToservice?.category,
                                  subcategoryId: appointmentData?.service_bookingsToservice?.subcategory
                                },
                            })
                            // onToggleModal(e)
                          }}
                        >
                          Edit
                        </button>
                      </li>
                    </ul>
                    <div className="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>
                    <ul>
                      <li>
                        <a
                          href=""
                          className="flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-none transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                          onClick={cancelAppointment}
                        >
                          Cancel
                        </a>
                      </li>
                    </ul>
                    <div className="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>
                    <ul>
                      <li>
                        <a
                          href=""
                          className="flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-none transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                          onClick={noShowAppointment}
                        >
                          No Show
                        </a>
                      </li>
                    </ul>
                </div>
             </div>
          <button
              style={
                {
                  // margin: 'auto',
                  // display: 'block',
                }
              }
              onClick={submitForm}
              className="btn   space-x-2 bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
            >
              Express checkout
            </button>
            </div> 
          {errorMessage(FormErrorMessage)}
        </div>
      </div>

      {/* popup  */}
      {popup && (
        <div className="max-w-lg mx-auto p-8 drop-shadow-2xl popup-box">
          <span className="popup-close-icon" onClick={() => showPopup(false)}>
            x
          </span>
        </div>
      )}
    </div>
  )
}

export default ClientInBookingView

export const errorMessage = (errorText) => {
  return (
    <>
      {errorText && (
        <span className="text-left pl-4" style={{ color: 'red' }}>
          {errorText}
        </span>
      )}
    </>
  )
}
