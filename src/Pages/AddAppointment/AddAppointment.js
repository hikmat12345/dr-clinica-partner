import React, { useEffect, useState } from 'react'
import './AddAppointment.css'
import configData from '../../utils/constants/config.json'
import { dates, durations } from './static'
import axios from 'axios'
import swal from 'sweetalert'
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import { useLocation, useNavigate } from 'react-router-dom'
import { CustomPriceInput } from '../../components/inputs/priceListInput'
import ClientInBooking, { errorMessage } from './ClientInBooking'
import { API } from './API'

export default function AddAppointment() {
  //************************************ */ Hooks  **************************************************88
  const [toggleState, setToggleState] = useState({
    toggle1: false,
    toggle2: false,
    toggle3: false,
    toggle4: false,
  })

  const location = useLocation()
  console.log(location, 'previusPageData')
  const previusPageData = location.state
  const [result, setResult] = useState()
  const [discountList, setDiscountList] = useState([])
  const [getserviceDetail, setServiceDetail] = useState('')
  const [errorText, showError] = useState('')
  const [cleintError, showClientSeError] = useState('')
  const [branchList, setBranchList] = useState([])
  const [loader, setLoader] = useState(false)
  const [selectTeamMember, setselectTeamMember] = useState(
    previusPageData.id || '',
  )
  const [changeCategory, setChangeCategory] = useState('')
  const [subcategoryValue, setSubCategoryValue] = useState('')
  const [branchSelectValue, setBranchSelectValue] = useState()
  const [subcategory, setSubCategories] = useState([])
  const [Service, setService] = useState([])
  const [durationValue, setDuration] = useState()
  const [checkoutDetail, setCheckoutDetail] = useState()
  const [customerCreatedFlag, setCustomerCreatedFlag]=useState(false)
  const [durationError, setDurationError] = useState('')
  const [categoryError, setcategoryError] = useState('') 
  const [subCategoryError, setsubCategoryError] = useState('') 
  const [serviceError, setserviceError] = useState('')
  const [priceOptionError, setpriceOptionError] = useState('')

  const [voucherData, setVoucherData] = useState()
  const [selectedPrice, setSelectedPrice] = useState('')
  const [pricesList, setPricesList] = useState([])
  const [priceValue, setPrice] = useState()
  const [preLoadData, setPreloadData] = useState([])
  const [discountValue, setdiscountValue] = useState()
  const [teamMember, setTeamMember] = useState(
    previusPageData?.id !== undefined
      ? [
          {
            name: previusPageData?.text?.split('+')[1],
            id: previusPageData?.id,
          },
        ]
      : [],
  )
  const [paymentOption, setpaymentOption] = useState()
  const [textareaText, setTextArea] = useState()
  const [serviceCharges, setServiceChanges] = useState([])
  const history = useNavigate()

  const dateStart = new Date(previusPageData?.startDate)
  const dateEnd = new Date(previusPageData?.endDate)
  let starthour = dateStart?.getHours() // get the hours from the date object
  console.log(starthour, 'starthour')
  starthour = starthour 
  const [starthours, setstartHour] = useState(
    previusPageData?.id ? starthour : '9',
  )
  const startminute =
    dateStart?.getMinutes() == 0 ? '00' : dateStart?.getMinutes()
  const [startminutes, setstartMin] = useState(startminute)

  const madeDate = `${dateStart?.getFullYear()}-${
    (dateStart?.getMonth() + 1).toString()?.length == 1
      ? '0' + (dateStart?.getMonth() + 1)
      : dateStart?.getMonth()
  }-${
    (dateStart?.getDate() + 1).toString()?.length == 1
      ? '0' + dateStart?.getDate()
      : dateStart?.getDate()
  }`
  const [startTime, setstartTime] = useState(
    previusPageData?.startDate == undefined
      ? ''
      : starthours + ':' + startminutes,
  )

  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%client right section code %%%%%%%%%%%%%%%%%%%%%%%%%%%%5
  const [inputValue, setInputValue] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [customerList, setcustomerList] = useState([])
  const [isClientDetial, setIsclientDetail] = useState(false)
  const [customerObj, setCustomerObj] = useState({})
  const [customerAppointment, setCustomerAppointment] = useState({})
  const onChangeClientSearch = (e) => {
    setInputValue(e.target.value)
  }
  const selectClient = (clientObj) => {
    console.log(clientObj, 'clientObj')
    setCustomerObj(clientObj)
    setIsSearching(false)
    setIsclientDetail(true)
  }
  useEffect(() => {
    API({
      method: 'get',
      url: `partner/clients/list-customers?count=5&page=1&searchText=${inputValue}`,
    }).then((res) => {
      setcustomerList(res?.customers)
    })
  }, [inputValue, customerCreatedFlag])

  useEffect(() => {
    if (customerObj?.id) {
      API({
        method: 'get',
        url: `partner/clients/customer-appointments/${
          previusPageData?.branchId
            ? previusPageData?.branchId
            : branchSelectValue
        }/${customerObj.id}?count=10&page=1`,
      }).then((res) => {
        setCustomerAppointment(res?.appointments)
      })
    }
  }, [customerObj])
  //************************************ */ onChanges AND CLICKS FUN  **************************************************88

  const handleSelectPrice = (priceOptObj) => {

     setSelectedPrice(priceOptObj)
    setPrice(priceOptObj.priceOptionValue)
    setpriceOptionError("")

    setDurationError('')
    const sortDuration= durations.filter((obj) => obj.value == priceOptObj.duration)
    setDuration(sortDuration?.length>0?(sortDuration[0]):({value: priceOptObj.duration, display:  (Math.floor(Number( priceOptObj.duration / 60))>0?(Math.floor(Number( priceOptObj.duration) / 60 )+ 'h ') : '') + (Math.floor(Number( priceOptObj.duration % 60))>0 ?Math.floor(Number( priceOptObj.duration % 60))+"min":"")}))
    API({
      method: 'POST',
      url: 'customer/bookings/checkout-details',
      contentType: 'application/json',
      payload: JSON.stringify({ 
          branchId: previusPageData?.branchId,
          serviceId: getserviceDetail?.serviceId,
          priceId: priceOptObj?.priceId, 
          serviceChargeIds: serviceCharges,
          servicePrice: 0,
          customerVoucherId: 0
         })
      }).then((resp) => {
        setCheckoutDetail(resp)
        setPrice(resp?.data?.serviceAmount)
      })
    API({
      method: 'POST',
      url: 'partner/appointment/appointment-exists',
      contentType: 'application/json',
      payload: JSON.stringify({
        serviceProviderId: Number(selectTeamMember),
        date: madeDate,
        branch:previusPageData?.branchId,
        starttime: (String(starthours)?.length== 1?"0"+starthours: starthours)+':'+(String(startminutes)?.indexOf(':') == -1? startminutes : startminutes?.split(':')[0]),
        duration: isNaN(priceOptObj.duration)
          ? Number(priceOptObj.duration)
          : priceOptObj.duration,
      }),
    }).then((res) => {
      if (res?.status) { 
        return
      } else {
        if (Object.keys(res)[0]==400) {   
          swal({
            title: 'We are sorry.',
            text: res["400"],
            icon: 'warning',
            button: 'ok',
          })
          setDurationError(res["400"])
         } else {
          setDurationError('Provider has another booking in this duration.')
        }
      }
    })
  } 
  const startTimeChange = (event) => {
    setstartTime(
      event.target.value?.includes('a')
        ? event.target.value?.split('a')[0]
        : event.target.value?.split('p')[0],
    )
    setstartHour(
      event.target.value?.includes('a')
        ? event.target.value?.split('a')[0]
        : event.target.value?.split('p')[0],
    )
    setstartMin(
      event.target.value?.includes('a')
        ? event.target.value?.split('a')[0].split(':')[1]
        : event.target.value?.split('p')[0].split(':')[1],
    )
    console.log(
      event.target.value?.includes('a')
        ? event.target.value?.split('a')[0].split(':')[1]
        : event.target.value?.split('p')[0].split(':')[1],
      'start minutes',
    )
  }
  const OnchangeDiscount = (discountid) => {
    setdiscountValue(discountid)
  }
  const onchangePrice = (e) => {
    setPrice(e.target.value)
  }
  const onChangePayment = (e) => {
    setpaymentOption(e.target.value)
  }
  // onchange branch
  const onChangeBranch = (event) => {
    setBranchSelectValue(event.target.value)
  }
  const onChangeTextArea = (e) => {
    setTextArea(e.target.value)
  }
 

  const serviceHandler = (event) => {
    setServiceDetail(event)
    setserviceError("")
    const pricesToArray = event?.servicePrices.map((priceObj) => {
      return {
        price: priceObj.pricefrom,
        duration: priceObj.duration,
        priceName: priceObj.name,
        priceType: priceObj.pricetype,
        priceid: priceObj?.id,
        tax: event?.tax
      }
    })
    setPricesList(pricesToArray)
     
    if (previusPageData?.id == undefined || !previusPageData?.id) {
      setLoader(true)
      axios({
        method: 'get',
        url:
          configData.SERVER_URL +
          `partner/team/teammemberByServiceId/${event.serviceId}?count=30&page=1`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          accesstoken: configData.ACCESSTOKEN,
          logintoken: localStorage.getItem('loginToken'),
        },
      })
        .then((resp) => {
          setLoader(false)
          setTeamMember(resp?.data?.teammembers)
         })
        .catch(() => {})
    }
  }
  const teamMemberChange = (event) => {
    setselectTeamMember(event.target.value)
    // setService([])
    if (event.target.value !== 'Select Provider' && event.target.value) {
      showError('')
    }
   
  }
  const onChangeCategory = (event) => {
    setChangeCategory(event.target.value)
    setcategoryError("") 
    setService([])
    const serviceWithCategory = preLoadData?.filter(
      (obj) => obj.id == event.target.value,
    )
    setServiceDetail('')
    setSubCategories(serviceWithCategory[0])
  }
  const onChangeSubCategory = (event) => {
    setSubCategoryValue(event.target.value)
    setsubCategoryError("")
    
    setService([])
    setServiceDetail('')
    setLoader(true)
    axios({
      method: 'get',
      url:
        configData.SERVER_URL +
        `customer/catagories/services/${
          previusPageData?.branchId
            ? previusPageData?.branchId
            : branchSelectValue
        }/${event.target.value}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        accesstoken: configData.ACCESSTOKEN,
        logintoken: localStorage.getItem('loginToken'),
      },
    })
      .then((resp) => {
        setLoader(false)
        setService(resp?.data?.data)
      })
      .catch(() => {})
  }
  const handleToggle = (toggleName) => {
    setToggleState((prevState) => ({
      ...prevState,
      [toggleName]: !prevState[toggleName],
    }))
  }
  // check duration
  const onChangeDuration = (event) => {
    setDurationError('')
    const setTimeOut=(String(starthours)?.length== 1?"0"+starthours: starthours)+':'+(String(startminutes)?.indexOf(':') == -1? startminutes : startminutes?.split(':')[0])
    function hasTwoColons(str) {
      const count = str.split(":")?.length - 1;
      return count >= 2;
    }
    API({
      method: 'POST',
      url: 'partner/appointment/appointment-exists',
      contentType: 'application/json',
      payload: JSON.stringify({
        serviceProviderId: Number(selectTeamMember),
        date: madeDate,
        branch:previusPageData?.branchId,
        starttime:hasTwoColons(setTimeOut) ? (setTimeOut?.split(":")[0]+":"+setTimeOut?.split(":")[1]):setTimeOut,
        duration: Number(event.target.value),
      }),
    }).then((res) => {
      if (res?.status) {
        setDuration(
          durations.filter((obj) => Number(obj.value) == event.target.value)[0],
        )
      } else {
        setDurationError('Provider has another booking in this duration.')
      }
    })
  }
   console.log(serviceCharges,"  servicecharges  serviceCharges,")
  const OnSubmitBooking = (isCheckoutDesign) => {
    setLoader(true)
    showClientSeError('')
    showError('')
    if (
      selectTeamMember &&
      customerObj?.id &&
      selectedPrice?.duration &&
      startTime &&
      getserviceDetail?.serviceId &&  
      durationError =='' 
    ) {
      // durationError
      console.log(selectedPrice, 'selectedPrice')
      try {
        var payload = JSON.stringify({
          // voucherId: '0',
          branch: previusPageData?.branchId
            ? previusPageData?.branchId
            : branchSelectValue,
          service: getserviceDetail?.serviceId,
          serviceprovider: Number(selectTeamMember),
          price: selectedPrice?.priceId,
          tax: selectedPrice?.tax,
          // please add atleast 0 instead of nothing (Umer )
          bill: checkoutDetail?.data?.total,
          date: madeDate,
          starttime: startTime,
          duration: selectedPrice?.duration,
          mop: 'onBranch',
          customerId: customerObj?.id,
          servicecharges: serviceCharges,
          description: textareaText,
          editPrice: priceValue,
          discountId: Number(discountValue),
        })

        var config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: configData.SERVER_URL + 'partner/appointment/create-appointment',
          headers: {
            accesstoken: configData.ACCESSTOKEN,
            logintoken: localStorage.getItem('loginToken'),
            'Content-Type': 'application/json',
          },
          data: payload,
        }
        const response = axios(config)

        response.then((res) => {
          setLoader(false)
          if (parseInt(Object.keys(res?.data)[0]) === 200) {
            setResult(res?.date)
            isCheckoutDesign
              ? (window.location.href =
                  '/calendar/Appointment?bookingId=' + res.data?.booking?.id)
              : (
                window.location.href = '/calendar?selectedDate=' + madeDate
                )
          } else {
            swal({
              title: 'We are sorry.',
              text: res.data[Object.keys(res.data)[0]],
              icon: 'warning',
              button: 'ok',
            })
          }
        })
      } catch (error) {
        console.error(error, 'error')
      }
    } else {
      setLoader(false)
      showClientSeError(
        customerObj?.id ?"": 'Please select client',
      )
       setcategoryError(changeCategory?"":"Please select category")
      setsubCategoryError(subcategoryValue?"":"Please select subcategory")
       setserviceError(getserviceDetail?.serviceId?"":"Please select service")
      setpriceOptionError(selectedPrice?.priceId?"":"Please select price option")
    }
  }
  //************************************ */ uSE eFFECTS hOOKS  **************************************************88
  // useEffect(() => {
  //   toggleState.toggle1 &&
  //     document.addEventListener('click', () => handleToggle('toggle1'))
  //   return () => {
  //     document.removeEventListener('click', () => handleToggle('toggle1'), true)
  //   }
  // }, [toggleState.toggle1])
  // pre loaded api
  useEffect(() => {
    setLoader(true)
    // search services by service provider
    if (previusPageData?.id) {
      // API({
      //   method: 'get',
      //   url: `customer/searchBy/servicesByAServiceProvider/${
      //     previusPageData?.branchId
      //       ? previusPageData?.branchId
      //       : branchSelectValue
      //   }/${previusPageData?.id}`,
      // }).then((res) => {
      //   setService(res?.services)
      // })
    }
    console.log(previusPageData, 'previusPageData')
    if (previusPageData?.branchId) {
      axios({
        method: 'get',
        url: previusPageData?.id
          ? `${
              configData.SERVER_URL
            }customer/bookings/categoryAndSubCatForSP?serviceProviderId=${
              previusPageData?.id
            }&branchId=${
              previusPageData?.branchId
                ? previusPageData?.branchId
                : branchSelectValue
            }`
          : `${
              configData.SERVER_URL
            }partner/appointment/getAppointmentDetails/?branchId=${
              previusPageData?.branchId
                ? previusPageData?.branchId
                : branchSelectValue
            }`,
        headers: {
          'Content-Type': 'Content-Type", "application/json',
          accesstoken: configData.ACCESSTOKEN,
          logintoken: localStorage.getItem('loginToken'),
        },
      })
        .then((resp) => {
          setLoader(false)
          setBranchList(resp.data?.branchList)
          setPreloadData(
            previusPageData?.id ? resp.data?.category : resp.data?.categories,
          )
          const serviceChargesFilter = resp.data?.branch.business_branchTobusiness.servicecharge.map(
            (item) => {
              return item.id
            },
          )
          setServiceChanges(serviceChargesFilter)
        })
        .catch(() => {
          setLoader(false)
        })
    }
    //*************************8888 */ call api when dont have branchs
    // if (previusPageData?.branchId !== NaN) {
    //   axios({
    //     method: 'get',
    //     url:
    //       configData.SERVER_URL +
    //       `partner/appointment/getAppointmentDetails/?branchId=2`,
    //     headers: {
    //       'Content-Type': 'Content-Type", "application/json',
    //       accesstoken: configData.ACCESSTOKEN,
    //       logintoken: localStorage.getItem('loginToken'),
    //     },
    //   })
    //     .then((resp) => {
    //       setLoader(false)
    //       setBranchList(resp.data?.branchList)
    //     })
    //     .catch(() => {
    //       setLoader(false)
    //     })
    // }
    // if provider id is already come from calender do call the detail api of provider
    if (previusPageData?.id && previusPageData?.branchId) {
      axios({
        method: 'get',
        url: `${configData.SERVER_URL}partner/team/getTeamMemberDetails?memberid=${previusPageData?.id}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          accesstoken: configData.ACCESSTOKEN,
          logintoken: localStorage.getItem('loginToken'),
        },
      })
        .then((resp) => {
          setLoader(false)
          setTeamMember([
            {
              name:
                resp.data.teamMember.firstname +
                ' ' +
                resp.data.teamMember.lastname,
              id: resp.data.teamMember?.id,
            },
          ])
        })
        .catch(() => {})
    }

    axios({
      method: 'get',
      url:
        configData.SERVER_URL +
        `partner/discount/list-discount?branchId=${previusPageData?.branchId}&count=20&page=1&status=0`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        accesstoken: configData.ACCESSTOKEN,
        logintoken: localStorage.getItem('loginToken'),
      },
    })
      .then((resp) => {
        setDiscountList(resp?.data?.data?.discount)
      })
      .catch((err) => {
        swal({
          title: 'Server Not Responding',
          text: 'Please try again later',
          icon: 'warning',
          button: 'ok',
        })
        console.log(err)
      })
  }, [branchSelectValue])

  const hours = dateStart.getHours() // get the hours value from the date object
  let timeIndication
  if (hours >= 0 && hours < 12) {
    timeIndication = 'AM'
  } else {
    timeIndication = 'PM'
  }
  return (
    <div
      className="min-h-screen pt-2 font-mono mb-5 my-16"
      id="appointment-page"
    >
      <div className="container  mx-auto grid grid-flow-row-dense p-4 grid-cols-3 grid-rows-3  ">
        <div
          className="inputs w-full mt-5 col-span-2  py-6 mx-auto"
          style={{
            marginLeft: '20px',
          }}
        >
          <h2
            className="text-2xl text-black"
            style={{ color: 'black', fontWeight: 'bold' }}
          >
            Add Appointment
          </h2>
          <form className="position-relative  pt-4" style={{}}>
            {loader && (
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
            <ol className="steper-border relative text-gray-500 border-l    dark:text-gray-400">
              {/* secition one  */}
              <li className="mb-10 ml-6">
                {/* <span className="steper absolute flex items-center justify-center w-8 h-8 bg-green-200 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-green-900">
                  1
                </span> */} 
                <div
                  style={{ border: '1px solid rgb(234 229 229)' }}
                  className="border-gray-400 focus:border-blue-500 p-5 rounded"
                >
                 <div className="flex mt-4">
                    <div
                      style={{ width: '50%' }}
                      className="columns w-1/3 px-3 mb-6"
                    > 
                      <select
                        value={changeCategory}
                        onChange={onChangeCategory}
                        className="block appearance-none text-gray-600 w-full bg-white border border-gray-400 shadow-inner px-4 py-2 pr-8 rounded"
                      >
                        <option id={0} value={0}>
                          Select Category
                        </option>
                        {preLoadData?.map(({ id, name }, key) => {
                          return (
                            <option id={key} value={id}>
                              {name}
                            </option>
                          )
                        })}
                      </select>
                      {categoryError && errorMessage(categoryError)}

                    </div>

                    <div
                      style={{ width: '50%' }}
                      className="columns w-1/3 px-3 mb-6" > 
                      <select
                        value={subcategoryValue}
                        onChange={onChangeSubCategory}
                        className="block appearance-none text-gray-600 w-full bg-white border border-gray-400 shadow-inner px-4 py-2 pr-8 rounded"
                      >
                        <option id={0} value={0}>
                          Select Sub Category
                        </option>
                        {subcategory?.subcategory?.map(({ id, name }, key) => {
                          return (
                            <option id={key} value={id}>
                              {name}
                            </option>
                          )
                        })}
                      </select>
                      {subCategoryError && errorMessage(subCategoryError)}

                    </div>
                  </div> 
                  {/*  services  and team member*/}
                  <div className="flex mt-8">
                    <div style={{ width: '50%' }} className=" w-1/4 px-3 mb-6">
                   
                      <button
                        id="dropdownHelperButton"
                        data-dropdown-toggle="dropdownHelper"
                        className="text-left block appearance-none text-gray-600 w-full bg-white border border-gray-400 shadow-inner px-4 py-2 pr-8 rounded"
                        type="button"
                        style={{ paddingTop: '15px', paddingBottom: '15px' }}
                        onClick={() => handleToggle('toggle1')}
                      >
                        {getserviceDetail.serviceName
                          ? getserviceDetail.serviceName
                          : 'Choose a service'}
                      </button>
                      <div
                        id="dropdownHelper"
                        className={`z-10 ${
                          toggleState.toggle1 ? '' : 'hidden'
                        } bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600`}
                      >
                        <ul
                          className="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200 servcie-list"
                          aria-labelledby="dropdownHelperButton"
                        >
                          <h3>{Service?.name}</h3>
                          {Service?.length === 0 && (
                            <li>
                              <div className="mt-2">
                                <div className=" ">
                                  <div className="font-bold text-slate-700 leading-snug">
                                    <div className="text-xs text-center mr-auto d-block text-slate-600 uppercase font-bold tracking-wider">
                                      Service Not Found
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>
                          )}
                          {Service?.map((eachService, key) => {
                            return (
                              <>
                                <li
                                  style={{ cursor: 'pointer' }}
                                  id={key}
                                  onClick={() => {
                                    serviceHandler({
                                      serviceName: eachService?.name,
                                      serviceId: eachService?.id,
                                      serviceImages: '',
                                      servicePrices: eachService?.price_priceToservice,
                                      tax:eachService?.tax
                                    })
                                    handleToggle('toggle1')
                                  }}
                                >
                                  <div className="mt-2">
                                    <div
                                      className="flex justify-between "
                                      style={{
                                        padding: '4px 4px',
                                        borderLeft: '3px solid #8a8aff',
                                      }}
                                    >
                                      <div className="font-bold text-slate-700 leading-snug">
                                        <div className="text-xs pt-2 text-slate-600 uppercase font-bold tracking-wider">
                                          {eachService?.name}
                                        </div>
                                        {/* <div className="">45 min</div> */}
                                      </div>
                                      <div className="mt-2 text-sm text-slate-600">
                                        {/* USD 2500 */}
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              </>
                            )
                          })}
                        </ul>
                        {serviceError && errorMessage(serviceError)}

                      </div>
                      {serviceError && errorMessage(serviceError)}

                    </div>

                    <div
                      style={{ width: '50%' }}
                      className="columns w-1/3 px-3 mb-6 text-left"
                    >
                      <select
                        value={selectTeamMember}
                        onChange={teamMemberChange}
                        className="block appearance-none text-gray-600 w-full bg-white border border-gray-400 shadow-inner px-4 py-2 pr-8 rounded"
                      >
                        <option className="text-left pl-4">
                          Select Provider
                        </option>
                        {/* {teamMember?.length <= 0 ? (
                          <option value={previusPageData?.id}>
                            {previusPageData?.text?.split('+')[1]}
                          </option>
                        ) : ( */}
                        {teamMember?.map((member, key) => {
                          return (
                            <option id={key} value={member?.id}>
                              {member?.name
                                ? member?.name
                                : member?.firstname + ' ' + member?.lastname}
                            </option>
                          )
                        })}
                      </select>
                    </div>
                  </div>

                  {/* prces list  and time slots */}

                  <div className="flex mt-8">
                    <div
                      style={{ width: '50%' }}
                      className="columns w-1/3 px-3 mb-6"
                    > 
                      <button
                        id="dropdownHelperButton"
                        data-dropdown-toggle="dropdownHelper"
                        className="text-left block appearance-none text-gray-600 w-full bg-white border border-gray-400 shadow-inner px-4 py-2 pr-8 rounded"
                        type="button"
                        style={{ paddingTop: '15px', paddingBottom: '15px' }}
                        onClick={() => handleToggle('toggle2')}
                      >
                        {selectedPrice.priceOptionValue !== undefined
                          ? selectedPrice.priceOptionName +
                            ' - Duration ' +
                            ' (' +
                            (Math.floor(selectedPrice?.duration / 60) > 0
                              ? Math.floor(selectedPrice?.duration / 60) + 'h-'
                              : '') +
                            (selectedPrice?.duration % 60) +
                            'm)'
                          : ' Price Options & Duration'}
                      </button>
                      <div
                        id="dropdownHelper"
                        className={`z-10 ${
                          toggleState.toggle2 ? '' : 'hidden'
                        } bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600`}
                      >
                        <ul
                          className="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200 servcie-list"
                          aria-labelledby="dropdownHelperButton"
                        >
                          {/* <h3>{Service?.name}</h3> */}
                          {pricesList?.length === 0 && (
                            <li>
                              <div className="mt-2">
                                <div className=" ">
                                  <div className="font-bold text-slate-700 leading-snug">
                                    <div className="text-xs text-center mr-auto d-block text-slate-600 uppercase font-bold tracking-wider">
                                      Prices Options Not Found
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>
                          )}
                          {pricesList?.map((price, key) => {
                            console.log(price, "price")
                            return (
                              <>
                                <li
                                  style={{ cursor: 'pointer' }}
                                  id={key}
                                  onClick={() => {
                                    handleSelectPrice({
                                      priceOptionName: price?.priceName,
                                      priceOptionValue: price?.price,
                                      duration: price?.duration,
                                      priceId: price?.priceid,
                                      min:Math.floor(price?.duration / 60),
                                      hours:Math.floor(price?.duration % 60),
                                      tax:price?.tax
                                    })
                                    handleToggle('toggle2')
                                  }}
                                >
                                  <div className="mt-2">
                                    <div
                                      className="flex justify-between "
                                      style={{
                                        padding: '4px 4px',
                                        borderLeft: '3px solid #8a8aff',
                                      }}
                                    >
                                      <div className="text-slate-700 leading-snug">
                                        <div className=" font-bold  text-xs text-slate-600 uppercase font-bold tracking-wider">
                                          {price?.priceName}
                                        </div>
                                        <div className="">
                                          {(Math.floor(price?.duration / 60) > 0
                                            ? Math.floor(price?.duration / 60) +
                                              'h-'
                                            : '') +
                                            (price?.duration % 60) +
                                            'm'}{' '}
                                        </div>
                                      </div>
                                      <div className="mt-2 text-sm text-slate-600">
                                        AED{' '}
                                        {`${price?.price} (${
                                          price?.priceType == 1
                                            ? 'Free'
                                            : price?.priceType == 2
                                            ? 'From'
                                            : price?.priceType == 3
                                            ? 'Fixed'
                                            : ''
                                        })`}
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              </>
                            )
                          })}
                        </ul> 
                      </div>
                      {priceOptionError && errorMessage(priceOptionError)}
                    </div>
  
                    <div style={{ width: '50%' }} className=" w-1/4 px-3  mb-6">
                      <> 
                        <div className="grid grid-cols-1 gap-4">
                          <label className="flex -space-x-px">
                            <div
                              style={{
                                backgroundColor:
                                  selectedPrice.duration !== undefined
                                    ? ''
                                    : '#e7e8e9',
                              }}
                              className="flex items-center justify-center rounded-l-lg border   px-3.5   dark:border-navy-450"
                            >
                              <span>AED</span>
                            </div>
                            <CustomPriceInput
                              className=" border form-input w-full border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:z-10    dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                              placeholder="Edit Price"
                              onChange={onchangePrice}
                              type={'number'}
                              value={priceValue}
                              style={{
                                backgroundColor:
                                  selectedPrice.duration !== undefined
                                    ? ''
                                    : '#e7e8e9',
                              }}
                              readOnly={
                                selectedPrice.duration !== undefined
                                  ? false
                                  : true
                              }
                            /> 
                          </label>
                        </div>
                      </>
                    </div>
                  </div> 
                  {/* duration and time slot  */}
                  <div className="flex mt-8">
                    <div style={{ width: '50%' }} className=" w-1/4 px-3 mb-6">
                      {/* <label className="block mr-auto text-left mb-2">
                        Time Slot
                      </label> */}
                      <select
                        // value={startTime}
                        onChange={startTimeChange}
                        className="block appearance-none text-gray-600 w-full bg-white border border-gray-400 shadow-inner px-4 py-2 pr-8 rounded"
                      >
                        {/* <option id={0} value={''}>
                          Start Time
                        </option> */}

                        {previusPageData?.endDate ? (
                          <option id={0} value={startTime}>
                            {(starthours % 12 || 12) + ':' + startminutes + timeIndication}
                            {/* +
                              ' - ' +
                              endhours +
                              ':' +
                              endminutes */}
                          </option>
                        )
                        :(
                          dates?.map(({ value, displayTime }, key) => {
                            return (
                              <option id={key} value={displayTime}>
                                {(Number(displayTime.split(":")[0]) % 12 || 12)+(":")+displayTime.split(":")[1]}
                              </option>
                            )
                          })
                        )}
                      </select>
                    </div>
                    {/* duration  */}
                    <div style={{ width: '50%' }} className=" w-1/4 px-3 mb-6">
                      <select
                        style={{
                          backgroundColor:
                            selectedPrice.duration !== undefined
                              ? ''
                              : '#e7e8e9',
                        }}
                        disabled={
                          selectedPrice.duration !== undefined ? '' : 'disabled'
                        }
                        onChange={onChangeDuration}
                        className="block appearance-none text-gray-600 w-full bg-white border border-gray-400 shadow-inner px-4 py-2 pr-8 rounded"
                      > 
                        {durationValue?.display && (
                          <option
                            value={durationValue.value}
                            selected="selected"
                          >
                            {durationValue.display}
                          </option>
                        )}
                         {selectedPrice.duration == undefined ||
                        !selectedPrice.duration ? (
                          <option id={0}>Duration</option>
                        ) : 
                        // selectedPrice?.min ?
                        // <option id={0} value={selectedPrice?.duration}>
                        //     {selectedPrice?.hours + ':' + selectedPrice?.min + timeIndication}
                        //     </option> :
                        (
                          durations?.map(({ value, display }, key) => {
                            return (
                              <option id={key} value={Number(value)}>
                                {display}
                              </option>
                            )
                          })
                        )}
                      </select>
                      {durationError && errorMessage(durationError)}
                    </div> 
                  </div>
                   {/* discount  */}
                  {discountList?.length !==0 &&  <div className="flex mt-3">
                    <div style={{ width: '100%' }} className=" w-1/4 px-3 mb-6">
                       <div
                        className="text-left"
                        style={{
                          display: 'inherit',
                          paddingBottom: '0',
                          paddingTop: '0px',
                        }}
                      >
                        Select Discount
                      </div>
                         <div 
                        className=" flex overflow-x-auto whitespace-nowrap  "   >
                      {console.log(discountValue, 'discountValue')}
                          {/* <ArrowCircleLeftIcon className='my-5 mt-8 '/> */}
                           {discountList?.map((discount) => {
                            return (
                              <button style={{backgroundColor:discount.id ==discountValue?"#000000":"#ffffff"}} className={`${discount.id ==discountValue} flex-initial w-64 py-2 mr-1 my-3 space-x-2  font-medium ${discount.id ==discountValue?"text-white":"text-slate-700"}	 hover:bg-primary-focus     dark:bg-accent dark:hover:bg-accent-focus     text-lg  font-semibold  rounded-full shadow-lg`} id={discount.id}  
                              onClick={(e)=>{e.preventDefault();OnchangeDiscount(discount.id)}}>
                                { 
                                  (discount?.isPercentage ? discount?.value+'%' : 'AED '+discount?.value)}
                              </button>
                            )
                          })}
                         {/* <ArrowCircleRightIcon  className='my-5 mt-8'/> */} 
                        </div>
                      </div> 
                   </div>
                  }
                  {/* appointemnt notes  */}
                  <div className="flex mt-8">
                    <div
                      style={{ width: '100%' }}
                      className="columns w-1/3 px-3 mb-6"
                    >
                      <textarea
                        onChange={onChangeTextArea}
                        name="notes"
                        placeholder="Add appointment note"
                        type="textarea"
                        rows="1"
                        style={{
                          overflow: 'hidden',
                          width: '100%',
                          padding: '10px',
                          overflowWrap: 'break-word',
                          height: '54.6px',
                        }}
                      ></textarea>
                    </div>
                  </div>
                </div>
                {/* box end   */}
                 
              </li>
              {/* secition one  */}
            </ol>
          </form>
          <br />
        </div>
        {/* client search and creation  */}
        {console.log( checkoutDetail?.data?.total, 'checkoutDetail')}
        <div className="inputs w-9/12 mt-12  py-6 mx-auto">
          <ClientInBooking
            onChangeClientSearch={onChangeClientSearch}
            inutValue={inputValue}
            submitForm={(e) => {
              e.preventDefault()
              OnSubmitBooking(false)
            }}
            SearchClickHandler={() => setIsSearching(true)}
            closeClickHandler={() => setIsSearching(!isSearching)}
            isSearching={isSearching}
            customerList={customerList}
            selectClient={selectClient}
            isClientDetial={isClientDetial}
            customerObj={customerObj}
            cleintSelectionError={cleintError}
            submitByCheckOutExpress={(e) => {
              e.preventDefault()
              OnSubmitBooking(true)
            }}
            Total={
              checkoutDetail?.data?.total !== undefined
                ? 'AED ' +
                checkoutDetail?.data?.total +
                  ' - (' +
                  (Math.floor(selectedPrice?.duration / 60) > 0
                    ? Math.floor(selectedPrice?.duration / 60) + 'h-'
                    : '') +
                  (selectedPrice?.duration % 60) +
                  'm)'
                : ''
            }
            customerAppointment={customerAppointment}
            FormErrorMessage={cleintError}
            loader={loader}
            submitloading={loader}
            
            sendCustomerFlag= {(e)=>setCustomerCreatedFlag(e)}
          />
        </div>
      </div>
    </div>
  )
}
