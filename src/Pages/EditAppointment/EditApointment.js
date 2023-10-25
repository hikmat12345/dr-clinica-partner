import React, { useEffect, useState } from 'react'
import './EditApointment.css'
import configData from '../../utils/constants/config.json'
import { dates, durations } from './static'
import axios from 'axios'
import swal from 'sweetalert'

import { useLocation, useNavigate } from 'react-router-dom'
import { CustomPriceInput } from '../../components/inputs/priceListInput'
import ClientInBooking, { errorMessage } from './ClientInBooking'
import { API } from './API'
import moment from 'moment'
import { useCallback } from 'react'
import axiosClient from '../../utils/helpers/server'
  
export default function EditApointment() {
  //************************************ */ Hooks  **************************************************88
  const [toggleState, setToggleState] = useState({
    toggle1: false,
    toggle2: false,
    toggle3: false,
    toggle4: false,
  })
  const [popup, showPopup] = useState(false);

  const location = useLocation()
  console.log(location, 'location')
  const previusPageData = location.state || {}
  const [result, setResult] = useState()
  const [discountList, setDiscountList] = useState([])
  const [getserviceDetail, setServiceDetail] = useState({serviceName:previusPageData.serviceName , serviceId:previusPageData?.serviceId})
  const [errorText, showError] = useState('')
  const [cleintError, showClientSeError] = useState('')
  const [branchList, setBranchList] = useState([])
  const [loader, setLoader] = useState(false)
  
  const [pickDate, setPickerData] = useState()

  const [selectTeamMember, setselectTeamMember] = useState(
    previusPageData.id || '',
  )
  const [changeCategory, setChangeCategory] = useState(previusPageData?.category?.name)
  const [subcategoryValue, setSubCategoryValue] = useState(previusPageData?.subCategory?.name)
  const [branchSelectValue, setBranchSelectValue] = useState()
  const [subcategory, setSubCategories] = useState([])
  const [Service, setService] = useState([])
  const [durationValue, setDuration] = useState()
  const [checkoutDetail, setCheckoutDetail] = useState()
  const [additionalCharges, setAdditionCharges]=useState([])
  const [selectedButtons, setSelectedButtons] = useState([]);

 
  const [durationError, setDurationError] = useState('')
  const [categoryError, setcategoryError] = useState('') 
  const [subCategoryError, setsubCategoryError] = useState('') 
  const [serviceError, setserviceError] = useState('')
  const [priceOptionError, setpriceOptionError] = useState('')

  const [voucherData, setVoucherData] = useState()
  const [selectedPrice, setSelectedPrice] = useState({
    priceOptionName: previusPageData?.priceOption?.name,
    priceOptionValue: previusPageData?.priceOption?.pricefrom,
     min:Math.floor(previusPageData?.priceOption?.duration / 60),
    hours:Math.floor(previusPageData?.priceOption?.duration % 60),
    duration:previusPageData?.priceOption?.duration,
    servicePrice: previusPageData?.priceOption?.pricefrom, 
    priceId:previusPageData?.priceOption?.id,  
  })
  console.log(selectedPrice, 'selectedPrice')
  const [pricesList, setPricesList] = useState([])
  const [priceValue, setPrice] = useState()
  const [preLoadData, setPreloadData] = useState([])
  const [discountValue, setdiscountValue] = useState(previusPageData?.discountId)
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
  const [textareaText, setTextArea] = useState(previusPageData.description)
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
  setTimeout(()=>{
    //  document.getElementById("selecteddate").value=dateStart

  }, 2000)
  const [startTime, setstartTime] = useState(
    previusPageData?.startDate == undefined
      ? ''
      : starthours + ':' + startminutes,
  )

  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%client right section code %%%%%%%%%%%%%%%%%%%%%%%%%%%%5
  const [inputValue, setInputValue] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [customerList, setcustomerList] = useState([])
  const [isClientDetial, setIsclientDetail] = useState(previusPageData?.customerId?true: false)
  const [customerObj, setCustomerObj] = useState({image:previusPageData?.image, name:previusPageData?.name, email:previusPageData?.email})
  const [customerAppointment, setCustomerAppointment] = useState({})
  const onChangeClientSearch = (e) => {
    setInputValue(e.target.value)
  }
  const selectClient = useCallback((clientObj) => {
    setCustomerObj(clientObj)
    setIsSearching(false)
    setIsclientDetail(true)
  }, [])
  useEffect(() => {
    API({
      method: 'get',
      url: `partner/clients/list-customers?count=5&page=1&searchText=${inputValue}`,
    }).then((res) => {
      setcustomerList(res?.customers)
    })
  }, [inputValue])

  useEffect(() => {
    if (previusPageData.customerId) {
      API({
        method: 'get',
        url: `partner/clients/customer-appointments/${
          previusPageData?.branchId
            ? previusPageData?.branchId
            : branchSelectValue
        }/${previusPageData.customerId}?count=10&page=1`,
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
        date: document.getElementById("selecteddate").value,
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
      (obj) => obj.id == event.target.value, )
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
        date: document.getElementById("selecteddate").value,
        branch:previusPageData?.branchId,
        starttime:hasTwoColons(setTimeOut) ? (setTimeOut?.split(":")[0]+":"+setTimeOut?.split(":")[1]):setTimeOut,
        duration: Number(event.target.value),
      }),
    }).then((res) => {
      if (res?.status) {
        // setDuration(
        //   durations.filter((obj) => Number(obj.value) == event.target.value)[0],
        // )
      } else {
        setDurationError('Provider has another booking in this duration.')
      }
    })
  }

  
// all team member 
useEffect(()=>{
  axiosClient
      .get(
        configData.SERVER_URL +
          `partner/team/teammember-by-branch-id/${
            previusPageData?.branchId
          }?page=1&count=100`
      )
      .then((resp) => {
        const allteammeber= resp.data?.teammember?.map((obj) => ({
          id:obj.id,
          name: obj.firstname +" "+ obj.lastname, 
        }))
        setTeamMember(allteammeber)
         
      });
      

      API({
        method: 'GET',
        url: 'partner/businesssetup/get-service-charges',
        contentType: 'application/json',
       }).then((res) => {
          setAdditionCharges(res?.branserviceChargesches)  
      })
},[])
const  handlesavecharges= (id) => {
  setServiceChanges(...serviceCharges,selectedButtons )
  showPopup(false)
};
const handleButtonClick = (id) => {
  if (selectedButtons.includes(id)) {
    // Button is already selected, remove it from the array
    setSelectedButtons(selectedButtons.filter((buttonId) => buttonId !== id));
  } else {
    // Button is not selected, add it to the array
    setSelectedButtons([...selectedButtons, id]);
  }
};
console.log(additionalCharges, serviceCharges,selectedButtons, 'additionalChargesadditionalChargesadditionalCharges')
  const OnSubmitBooking = (isCheckoutDesign) => {
    setLoader(true)
    showClientSeError('')
    showError('')
    if (
      previusPageData?.id &&
      previusPageData?.customerId
      // selectedPrice?.duration &&
      // startTime &&
      // getserviceDetail?.serviceId &&  
      // durationError =='' 
    ) {
      // durationError
      console.log(selectedPrice, 'selectedPrice')
      try {
        var payload = JSON.stringify({ 
          id: previusPageData?.appointmentId,
          // branch: previusPageData?.branchId
          // ? previusPageData?.branchId
          // : branchSelectValue,
          // service: getserviceDetail?.serviceId,
            serviceprovider:  Number(selectTeamMember),
          // price: selectedPrice?.priceId,
          // tax:5,
          // bill:previusPageData?.bill,
          // date: document.getElementById("selecteddate").value,
          // starttime: startTime,
          // duration: selectedPrice?.duration,
          // mop: "onBranch",
          // customerId: customerObj?.id?customerObj?.id: previusPageData?.customerId,
          servicecharges:serviceCharges,
          // description: textareaText,
          // discountId: Number(discountValue),
          // voucherId: 0,
          // servicePrice: selectedPrice?.servicePrice,
          // amountCollected: Number(priceValue)?Number(priceValue):selectedPrice?.servicePrice
        })

         
        API({
          method: 'POST',
          url: 'partner/appointment/update-appointment-by-sp',
          contentType: 'application/json',
          payload:payload,
        }).then((res) => {
          console.log(res, 'res')
          setLoader(false)
          if (parseInt(Object.keys(res)[0]) === 200) {
            setResult(res?.date)
            swal({
              title: 'Thanks',
              text: res[Object.keys(res)[0]],
              icon: 'success',
              button: 'ok',
            })
              // isCheckoutDesign ? (window.location.href =  '/calendar/Appointment?bookingId=' + res.data?.booking?.id)
              //   : (window.location.href = '/calendar?selectedDate=' + madeDate)
          } else {
            swal({
              title: 'We are sorry.',
              text: res[Object.keys(res)[0]],
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
  
  // pre loaded api
  useEffect(() => {
    setLoader(true)
    // search services by service provider 
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
     // if provider id is already come from calender do call the detail api of provider
    // if (previusPageData?.id && previusPageData?.branchId) {
    //   axios({
    //     method: 'get',
    //     url: `${configData.SERVER_URL}partner/team/getTeamMemberDetails?memberid=${previusPageData?.id}`,
    //     headers: {
    //       'Content-Type': 'application/x-www-form-urlencoded',
    //       accesstoken: configData.ACCESSTOKEN,
    //       logintoken: localStorage.getItem('loginToken'),
    //     },
    //   })
    //     .then((resp) => {
    //       setLoader(false)
    //       setTeamMember([
    //         {
    //           name:
    //             resp.data.teamMember.firstname +
    //             ' ' +
    //             resp.data.teamMember.lastname,
    //           id: resp.data.teamMember?.id,
    //         },
    //       ])
    //     })
    //     .catch(() => {})
    // }

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
  console.log(teamMember, 'teamMember')
  return (
    <div
      className="min-h-screen pt-2 font-mono mb-5 my-16"
      id="appointment-page" >
      <div className="container  mx-auto grid grid-flow-row-dense p-4 grid-cols-3 grid-rows-3  ">
        <div
          className="inputs w-full mt-5 col-span-2  py-6 mx-auto"
          style={{
            marginLeft: '20px',
          }}
        >
          <h2  className="text-2xl text-black"
               style={{ color: 'black', fontWeight: 'bold' }}  >
            Edit Appointment
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
                }} >
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
                <div
                  style={{ border: '1px solid rgb(234 229 229)' }}
                  className="border-gray-400 focus:border-blue-500 p-5 rounded" >
                    {/* <label className="relative flex">
                      <input x-init="$el._x_flatpickr = flatpickr($el)"   disabled={  'disabled'} className="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Date." onChange={(e)=>setPickerData(e.target.value)} type="text" id="selecteddate"  value={moment(dateStart).format('MMMM DD, YYYY')}/>
                        <span style={{marginTop: "-5px"}} className="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                        </span>
                    </label> */}
                 <div className="flex mt-4">
                    <div
                      style={{ width: '50%' }}
                      className="columns w-1/3 px-3 mb-6" > 
                      <select
                       disabled={  'disabled'}
                        value={changeCategory}
                        onChange={onChangeCategory}
                        className="block appearance-none text-gray-600 w-full bg-white border border-gray-400 shadow-inner px-4 py-2 pr-8 rounded" >
                         {changeCategory? <option id={0} value={previusPageData?.categoryId}>
                           {changeCategory}
                        </option>:
                        <option id={0} value={0}>
                           select category
                         </option>}
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
                        disabled={  'disabled'}
                        value={subcategoryValue}
                        onChange={onChangeSubCategory}
                        className="block appearance-none text-gray-600 w-full bg-white border border-gray-400 shadow-inner px-4 py-2 pr-8 rounded"
                      >
                        {subcategoryValue? 
                          <option id={0} value={previusPageData?.categoryId}>
                            {subcategoryValue}
                          </option>:
                          <option id={0} value={0}>
                            Select Sub Category
                          </option>} 
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
                        disabled={  'disabled'}
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
                        disabled={  'disabled'}
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
                          <button data-modal-target="defaultModal" data-modal-toggle="defaultModal"  id="dropdownHelperButton"
                              data-dropdown-toggle="dropdownHelper"
                              className="text-left block appearance-none text-gray-600 w-full bg-white border border-gray-400 shadow-inner px-4 py-2 pr-8 rounded"
                              type="button"
                              onClick={() => showPopup(!popup)}
                              style={{ paddingTop: '15px', paddingBottom: '15px' }} >
                                 Edit Service Charges
                              </button> 
                              <div id="defaultModal" tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
                                  <div class="relative w-full max-w-2xl max-h-full">
                                      <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                          <div class="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                                              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                                                  Terms of Service
                                              </h3>
                                              <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal">
                                                  <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                                  <span class="sr-only">Close modal</span>
                                              </button>
                                          </div>
                                          
                                          <div class="p-6 space-y-6">
                                              <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                                  With less than a month to go before the European Union enacts new consumer privacy laws for its citizens, companies around the world are updating their terms of service agreements to comply.
                                              </p>
                                              <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                                  The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant to ensure a common set of data rights in the European Union. It requires organizations to notify users as soon as possible of high-risk data breaches that could personally affect them.
                                              </p>
                                          </div>
                                          <div class="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                                              <button data-modal-hide="defaultModal" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">I accept</button>
                                              <button data-modal-hide="defaultModal" type="button" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Decline</button>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                        {/* <div className="grid grid-cols-1 gap-4">
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
                        </div>*/}
                      </>
                    </div> 
                  </div> 
                  {/* duration and time slot  */}
                  <div className="flex mt-8">
                    <div style={{ width: '50%' }} className=" w-1/4 px-3 mb-6"> 
                      <select
                        // value={startTime}
                        onChange={startTimeChange}
                        className="block appearance-none text-gray-600 w-full bg-white border border-gray-400 shadow-inner px-4 py-2 pr-8 rounded"
                      >  
                        {previusPageData?.endDate ? (
                          <option id={0} value={startTime}>
                            {(starthours % 12 || 12) + ':' + startminutes + timeIndication}
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
                      {/* <select
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
                      </select> */} 
                      {/* {durationError && errorMessage(durationError)} */}
                      <label className="relative flex">
                      <input x-init="$el._x_flatpickr = flatpickr($el)"   disabled={  'disabled'} className="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Date." onChange={(e)=>setPickerData(e.target.value)} type="text" id="selecteddate"  value={moment(dateStart).format('MMMM DD, YYYY')}/>
                        <span style={{marginTop: "-5px"}} className="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                        </span>
                    </label>
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
                            {discountList?.map((discount) => {
                            return (
                              <button  disabled={  'disabled'} style={{backgroundColor:discount.id ==discountValue?"#000000":"#ffffff"}} className={`${discount.id ==discountValue} flex-initial w-64 py-2 mr-1 my-3 space-x-2  font-medium ${discount.id ==discountValue?"text-white":"text-slate-700"}	 hover:bg-primary-focus     dark:bg-accent dark:hover:bg-accent-focus     text-lg  font-semibold  rounded-full shadow-lg`} id={discount.id}  
                              onClick={(e)=>{e.preventDefault();OnchangeDiscount(discount.id)}}>
                                { 
                                  (discount?.isPercentage ? discount?.value+'%' : 'AED '+discount?.value)}
                              </button>
                            )
                          })}
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
                        value={textareaText}
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
          />
        </div>
      </div>



      {popup && (
        <div className="max-w-lg  mt-20 mx-auto p-8 drop-shadow-2xl popup-box">
          <span className="popup-close-icon" onClick={() => showPopup(false)}>
            x
          </span>
          <form className="space-x-6 p-6 text-left ">
            {additionalCharges?.map((charge, key)=>(<button
               onClick={(e) =>{ e.preventDefault(); handleButtonClick(charge.id)}}
            style={{ backgroundColor: selectedButtons.includes(charge.id) ? '#000000' : '#ffffff' }}

              id={key}
               className={` ${selectedButtons.includes(charge.id)?"text-white":"text-slate-700"} flex-initial xy-2 px-3 py-2 mr-1 my-1 space-x-2  font-medium text-slate-700	 hover:bg-primary-focus dark:bg-accent dark:hover:bg-accent-focus font-semibold  rounded-full shadow-lg`} 
              >
            {charge?.name}
            </button>))}

            <button
               type="button"
              className="btn  px-3 py-3 space-x-2 bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
              style={{
                float: "right",
                marginBottom: "16px",
              }}
              onClick={() => handlesavecharges()}
            >
              Select
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
