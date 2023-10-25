import React, { useEffect, useState } from "react";
import "./client.css";
import swal from "sweetalert";
import axios from "axios";
import configData from "../../utils/constants/config.json";
import ImageResize from "../../components/ImageCropper/imageupload";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { BiEdit } from 'react-icons/bi';
import { findDuration } from "../../utls";
import { API } from "../../Pages/AddAppointment/API";

export default function ClientDetail() {
  const location = useLocation();
  const [popup, showPopup] = useState(false);
  const [popup2, showPopup2] = useState(false);

  const [isupdate, setUpdate] = useState(false);

  const client = location.state;
   const [state, setState] = useState({
    imageResizer: null,
    loader: false,
    voucherImage: null,
    uplodedImag: client.image,
  });
  
 const history  = useNavigate()
  const imageModalClose = (e) => {
    setState({ ...state, imageResizer: false });
  };
  const [customerAppointment, setCustomerAppointment] = useState({})

  useEffect(() => {
    if (client?.id) {
      API({
        method: 'get',
        url: `partner/clients/customer-appointments/7/${client.id}?count=10&page=1`,
      }).then((res) => {
        setCustomerAppointment(res?.appointments)
      })
    }
  }, [client])


  const changeImage = (file) => {
    var url = URL.createObjectURL(file);
    setState({
      ...state,
      voucherImage: file,
      // profileSrc : url
    });
  };

  const uploadImage = () => {
    setState({ ...state, loader: true });
    var bodyFormData = new FormData();
    bodyFormData.append("image", state.voucherImage);
    axios({
      method: "post",
      url: configData.SERVER_URL + "partner/vouchers/voucher-image",
      data: bodyFormData,
      headers: {
        "Content-Type": "multipart/form-data",
        accesstoken: configData.ACCESSTOKEN,
        logintoken: localStorage.getItem("loginToken"),
      },
    })
      .then((resp) => {
        setState({ ...state, loader: false });
        setUpdate(!isupdate)
        setState({
          ...state,
          imageResizer: false,
          uplodedImag: resp.data.data.url[0],
        });
      })
      .catch((err) => {
        swal({
          title: "Server Not Responding",
          text: "Please try again later",
          icon: "warning",
          button: "ok",
        });
        console.log(err);
      });
  };

  const [formData, setFormData] = useState({
    customerId: client.id,
    firstName: client.firstname,
    lastName: client.lastname,
    email: client.email,
    gender: client.gender,
    phone: client.phone,
    customerNotificationId: client.customerNotificationId,
    isemail: client.isemail,
    ismessage: client.ismessage,
    isapp: client.isapp,
    image: client.image || undefined 
  });

  const [addressData, setAddressData] = useState({
    id: 0,
    name : "",
    address: "",
    appartement: "0",
    district: "",
    city: "",
    region: "",
    postcode: 0,
    country: "",
    status: 0
  });
  const [notificationsettings, setnotificationsettings] = useState({
    isemail: client.isemail,
    ismessage: client.ismessage,
    isapp: client.isapp,
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormData({ ...formData, image:state.uplodedImag})
    console.log(formData, 'formData')




    
    API({
      method: "POST",
      url: "partner/clients/update-customer-details",
      contentType: "application/json",
      payload: JSON.stringify({ 
         customerId : client.id,
         firstName : formData.firstName ,
         lastName :formData.lastName  ,
         email :formData.email   ,
         gender :formData.gender,
         phone :formData.phone, 
         image : state.uplodedImag,
         customerNotificationId :client.customerNotificationSettings.id,
         isemail : notificationsettings.isemail  , //email notification 0 for false 1 for true
         ismessage  :notificationsettings.ismessage, //message notification 0 for false 1 for true
         isapp :notificationsettings.isapp, //app notification 0 for false 1 for true
       })
      })
      .then((response) => {
        setFormData({
          customerId: response.customer.id,
          firstName: response.customer.firstname,
          lastName: response.customer.lastname,
          email: response.customer.email,
          gender: response.customer.gender,
          phone: response.customer.phone,
          customerNotificationId: response.customer.customerNotificationId,
          isemail: response.customer.isemail,
          ismessage: response.customer.ismessage,
          isapp: response.customer.isapp,
          image: response.customer.image || undefined
        })

        setUpdate(!isupdate)
        showPopup(!popup)
        // Handle response
        swal({
          title: "Client details updated successfully",
          icon: "success",
          button: "Ok",
        });
      })
      .catch((error) => {
        console.log(error);
        // Handle error
        swal({
          title: "Error updating client details",
          text: "Please try again later",
          icon: "error",
          button: "Ok",
        });
      });
  };


 
  const handleSubmitAddress = (e) => {
    e.preventDefault();
    setFormData({ ...formData, image:state.uplodedImag})
    console.log(formData, 'formData')
 
    API({
      method: "POST",
      url: "partner/clients/update-customer-details",
      contentType: "application/json",
      payload: JSON.stringify({ 
         ...addressData
        }) 
      })
      .then((response) => {
         
        setUpdate(!isupdate)
        showPopup(!popup)
        // Handle response
        swal({
          title: "Client details updated successfully",
          icon: "success",
          button: "Ok",
        });
      })
      .catch((error) => {
        console.log(error);
        // Handle error
        swal({
          title: "Error updating client details",
          text: "Please try again later",
          icon: "error",
          button: "Ok",
        });
      });
  };


  return (
    <main class="main-content px-[var(--margin-x)] pb-8">
      <div class="flex items-center space-x-4 py-5 lg:py-6">
        <h2 class="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">
          Client
        </h2>
        <div class="hidden h-full py-1 sm:flex">
          <div class="h-full w-px bg-slate-300 dark:bg-navy-600"></div>
        </div>
        <ul class="hidden flex-wrap items-center space-x-2 sm:flex">
          <li class="flex items-center space-x-2">
            <a
              class="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent"
              href="/account/locations"
            >
              Client Details
            </a>
            <svg
              x-ignore
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </li>
          <li>Client</li>
        </ul>
      </div>
      <div class="flex grid-cols-3 gap-4 sm:gap-5 lg:gap-3 text-center">
        <div class="">
          
          <ul style={{ listStyle: "none",textAlign: 'center' }} className="card dr-client-Info">
            <li className="ml-auto">
              <button
                  style={{ color: "blue", textAlign:"center", margin: "auto",
                  display: "block", textDecoration: "" }}
                  onClick={() => showPopup(!popup)}
                  className="underline text-center base-btn dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
                >
                <BiEdit size={22}/>
              </button></li>
            <li>
              <div>
                <div class="avatar h-36 w-36">
                  <img
                    class="rounded-full bg-slate-200"
                    src={state.profileSrc ? state.profileSrc : formData.image}
                    alt="avatar"
                    onClick={() => {
                      // document.getElementById("profile").click()
                      setState({ ...state, imageResizer: true });
                    }}
                  />
                </div>{" "}
                
                <p style={{ color: "blue", textDecoration: "", paddingTop: '10px' }}>
                  {formData.email}
                </p>
              </div>
            </li>
            {/* <li className="text-center">
              <p>Total Sales (AED)</p>
            </li>  */}
            <li style={{cursor:"pointer"}} onClick={()=>history("/team/provider-reviews", {state:formData.firstName})}>
              <p>
                <i class="fas fa-star fa-3x" style={{ color: "yellow" }}></i>
              </p>
              <p style={{fontWeight:"bold"}}>
              {formData?.serviceProviderReviews?.length > 0
                  ? formData?.serviceProviderReviews?.length
                  : "0"} Reviews
              </p>
            </li>
            
            <li>
              {/* <p className="py-1">{customerAppointment?.appointments?.length}</p> */}
              <p className="" style={{fontWeight:"bold",marginBottom:"-16px", marginTop:"-1px"}}><span >{client?.bookings?.length} </span> Bookings</p>
              {/* <p className="font-bold py-1">Appointments List</p> */}
            </li>
            {client?.bookings?.map(
                ({
                  date,
                  price,
                  starttime,
                  endtime,
                  status,
                  service,
                  pricingDetails,
                  bill,
                }) => {
                  return (
                    <div
                      className="flex pt-3 br-1"
                      style={{ borderBottom: "1px solid #dddddd" }}
                    >
                      <div className="flex-none w-12 h-14">
                        <strong>{moment(date).format("MMMM Do")}</strong>
                      </div>
                      <div
                        style={{ paddingLeft: "10px" }}
                        className="flex-initial pl-3 text-left w-70 "
                      >
                        Service:{" "}
                        <strong>{pricingDetails?.serviceName}</strong>
                        <p>
                          Duration:{" "}
                          <strong>{findDuration(starttime, endtime)}</strong>
                        </p>
                      </div>
                      <div className="flex-initial pt-4 w-28">
                        AED <strong>{price}</strong>
                      </div>
                    </div>
                  );
                }
              )}
              {client?.bookings?.length ==0 &&
              <div className="py-1 text-center">
                Not Found
                </div>}
          </ul>



 



        </div>
        <div class=" w-full ml-4 text-left pl-4">
          <div className="card text-left w-full px-4 py-4 sm:px-5">
            <div className="m-2">
              <h2 className="text-lg font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">
                Basic info
              </h2>
            </div>
            <div className="m-2">
              {/* BranchReview: []
bookings: []  
serviceProviderReviews : []  */}
            </div>
            <div className="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>

            <div className="m-2 text-left">
              <h2 className="text-lg font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">
                Name
              </h2>
              <p className="pb-4">{formData?.firstName + " " + formData?.lastName}</p>
              <h2 className="text-lg font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">
                Gender
              </h2>
              <p className="pb-4">{formData?.gender}</p>
              <h2 className="text-lg font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">
                Phone #
              </h2>
              <p className="pb-4">{formData?.phone}</p>
              {/* <h2 className="text-lg font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">
                Date Of Birth
              </h2>
              <p className="pb-4">{formData?.dateofbirth}</p> */}
            </div>
          </div>

          <div className="card text-left mt-5 w-full px-4 py-4 sm:px-5">
            <div className="m-2">
              <h2 className="text-lg font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">
                Address
              </h2>
              {/* <button
                  style={{ color: "blue", textAlign:"center", margin: "auto",
                  display: "block", textDecoration: "" }}
                  onClick={() => showPopup2(!popup2)}
                  className="underline text-center base-btn dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
                >
                <BiEdit size={22}/>
              </button> */}
            </div>
            <div className="m-2"></div>
            <div className="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>

            <div className="m-2">
              <h2 className="text-lg font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">
                {" "}
              </h2>
              {client?.customeraddress?.length == 0 ?
              <p className="pb-4 text-center"> Not Found</p>
              : "Data"
              }
            </div>
          </div>
        </div>
        {/* <div class="card px-4 py-4 shadow-none  sm:px-5">

       two
     </div>
     <div class="card px-4 py-4 shadow-none  sm:px-5">

        three
     </div> */}
      </div>
      {state.imageResizer ? (
        <ImageResize
          loader={state.loader}
          aspectRatio={1.0}
          imageModalClose={imageModalClose}
          changeImage={changeImage}
          saveImageAdded={uploadImage}
        />
      ) : (
        <></>
      )}

      {popup && (
        <div className="col-md-9 mx-auto p-8 drop-shadow-2xl popup-box">
          <span className="popup-close-icon" onClick={() => showPopup(false)}>
            x
          </span>
          <form className="space-x-6 p-6 text-left">
            <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-12 lg:gap-12">
              <div className="relative flex flex-col overflow-hidden rounded-lg bg-gradient-to-br   p-3.5">
                <label className="block">
                  <div class="avatar h-12 w-12">
                    <img
                      class="rounded-full bg-slate-200"
                      src={
                        state.uplodedImag
                          ? state.uplodedImag
                          : "/images/upload-image.png"
                      }
                      alt="avatar"
                      onClick={() => {
                        // document.getElementById("profile").click()
                        setState({ ...state, imageResizer: true });
                      }}
                    />
                  </div>{" "}
                  <span className="after:content-['*'] after:ml-0.5 after:text-red-500   text-sm font-medium text-slate-700">
                    Profile image
                  </span>
                </label>
                <label className="block" style={{ marginTop: "20px" }}>
                  <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
                    First Name
                  </span>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                    placeholder="Exampel John"
                  />
                </label>
                <label className="" style={{ marginTop: "20px" }}>
                  <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
                    Last Name
                  </span>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                    placeholder="Example Doe"
                  />
                </label>
                <label
                  className="block"
                  style={{ marginLeft: "0px", marginTop: "20px" }}
                >
                  <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
                    Email
                  </span>
                  <input
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    name="email"
                    className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                    placeholder="you@example.com"
                  />
                </label>
                <label
                  className="block"
                  style={{ marginLeft: "0px", marginTop: "20px" }}
                >
                  <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
                    Phone Number*
                  </span>
                  <input
                    value={formData.phone}
                    onChange={handleChange}
                    name="phone"
                    type="tel"
                    id="phone"
                    className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                    placeholder="+112345678998"
                  />
                </label>
                <div
                  style={{
                    marginLeft: "4px",
                    marginTop: "20px",
                    marginBottom: "8px",
                    color: "black",
                  }}
                >
                  <legend>Gender</legend>

                  <input
                    id="draft"
                    className="appearance-none border border-gray-300 rounded-full w-5 h-5 checked:bg-blue-600 checked:border-transparent focus:outline-none"
                    type="radio"
                    style={{ position: "relative", top: "4px", right: "3px" }}
                    name="gender"
                    value={"female"}
                    checked={formData.gender === "female"}
                    onChange={handleChange}
                  />
                  <label
                    for="draft"
                    className="peer-checked/draft:text-sky-500"
                  >
                    Female
                  </label>

                  <input
                    name="gender"
                    value={"male"}
                    style={{
                      marginLeft: "10px",
                      position: "relative",
                      top: "4px",
                      right: "3px",
                    }}
                    className="appearance-none border border-gray-300 rounded-full w-5 h-5 checked:bg-blue-600 checked:border-transparent focus:outline-none"
                    checked={formData.gender === "male"}
                    onChange={handleChange}
                    id="published"
                    type="radio"
                  />
                  <label
                    for="published"
                    className="peer-checked/published:text-sky-500"
                  >
                    Male
                  </label>
                </div>
                <div>
                  <h2 class="text-lg font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">
                    Add Notification
                  </h2>
                </div>
                <div class="pt-2">
                  <p>Automatically Notification sends to clients. </p>
                  <div class="inline-space mt-4 pt-2">
                    <label class="inline-flex items-center space-x-2">
                      <input
                        class="form-checkbox is-outline h-5 w-5 rounded-full border-slate-400/70 before:bg-primary checked:border-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:before:bg-accent dark:checked:border-accent dark:hover:border-accent dark:focus:border-accent"
                        type="checkbox"
                        checked={notificationsettings.isemail}
                        onChange={() => {
                          setnotificationsettings({
                            ...notificationsettings,
                            isemail: !notificationsettings.isemail,
                          });
                        }}
                      />
                      <p>Email</p>
                    </label>

                    <label class="inline-flex items-center space-x-2">
                      <input
                        class="form-checkbox is-outline h-5 w-5 rounded-full border-slate-400/70 before:bg-primary checked:border-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:before:bg-accent dark:checked:border-accent dark:hover:border-accent dark:focus:border-accent"
                        type="checkbox"
                        checked={notificationsettings.ismessage}
                        onChange={() => {
                          setnotificationsettings({
                            ...notificationsettings,
                            ismessage: !notificationsettings.ismessage,
                          });
                        }}
                      />
                      <p>Message</p>
                    </label>

                    <label class="inline-flex items-center space-x-2">
                      <input
                        class="form-checkbox is-outline h-5 w-5 rounded-full border-slate-400/70 before:bg-primary checked:border-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:before:bg-accent dark:checked:border-accent dark:hover:border-accent dark:focus:border-accent"
                        type="checkbox"
                        checked={notificationsettings.isapp}
                        onChange={() => {
                          setnotificationsettings({
                            ...notificationsettings,
                            isapp: !notificationsettings.isapp,
                          });
                        }}
                      />
                      <p>App</p>
                    </label>
                  </div>
                </div>
                <button
                      onClick={handleSubmit}
                      className="btn text-white base-btn bg-primary hover:bg-primary-focus focus:bg-primary-focus
                    active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
                      style={{
                        float: "right",
                        marginTop: "5px",
                        marginBottom: "16px",
                      }}
                    >
                      Update Client Detail
                    </button>
              </div>
              {console.log(notificationsettings, "notificationsettings")}
              {/* column two  */}
              {/* <div className="relative flex flex-col overflow-hidden rounded-lg bg-gradient-to-br   p-3.5">
                <div class="">
                  <div class=" ">
                    <div class="m-2">
                      <h2 class="text-lg font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">
                        Add Address
                      </h2>
                    </div>
                    <label className="block" style={{ marginTop: "20px" }}>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                        placeholder="Address Name"
                      />
                    </label>

                    <label className="block" style={{ marginTop: "20px" }}>
                      <input
                        type="text"
                        name="address"
                        id="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                        placeholder="address"
                      />
                    </label>

                    <label className="block" style={{ marginTop: "20px" }}>
                      <input
                        type="text"
                        name="appartement"
                        id="appartement"
                        value={formData.appartement}
                        onChange={handleChange}
                        className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                        placeholder="appartement "
                      />
                    </label>

                    <label className="block" style={{ marginTop: "20px" }}>
                      <input
                        type="text"
                        name="district"
                        id="district"
                        value={formData.district}
                        onChange={handleChange}
                        className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                        placeholder="district"
                      />
                    </label>

                    <label className="block" style={{ marginTop: "20px" }}>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                        placeholder="city"
                      />
                    </label>

                    <label className="block" style={{ marginTop: "20px" }}>
                      <input
                        type="text"
                        name="region"
                        id="region"
                        value={formData.region}
                        onChange={handleChange}
                        className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                        placeholder="region"
                      />
                    </label>

                    <label className="block" style={{ marginTop: "20px" }}>
                      <input
                        type="text"
                        name="postcode"
                        id="postcode"
                        value={formData.postcode}
                        onChange={handleChange}
                        className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                        placeholder="postcode"
                      />
                    </label>
                    <label className="block" style={{ marginTop: "20px" }}>
                      <input
                        type="text"
                        name="country"
                        id="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                        placeholder="Country"
                      />
                    </label>

                    <button
                      onClick={handleSubmit}
                      className="btn text-white base-btn bg-primary hover:bg-primary-focus focus:bg-primary-focus
                    active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
                      style={{
                        float: "right",
                        marginTop: "5px",
                        marginBottom: "16px",
                      }}
                    >
                      Save Client Detail
                    </button>
                  </div>
                </div>
              </div> */}
            </div>
          </form>
        </div>
      )}



{popup2 && (
        <div className="col-md-9 mx-auto p-8 drop-shadow-2xl popup-box">
          <span className="popup-close-icon" onClick={() => showPopup2(false)}>
            x
          </span>
          <form className="space-x-6 p-6 text-left">
            <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-12 lg:gap-12">
               
              {/* column two  */}
              <div className="relative flex flex-col overflow-hidden rounded-lg bg-gradient-to-br   p-3.5">
                <div class="">
                  <div class=" ">
                    <div class="m-2">
                      <h2 class="text-lg font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">
                        Add Address
                      </h2>
                    </div>
                    <label className="block" style={{ marginTop: "20px" }}>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                        placeholder="Address Name"
                      />
                    </label>

                    <label className="block" style={{ marginTop: "20px" }}>
                      <input
                        type="text"
                        name="address"
                        id="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                        placeholder="address"
                      />
                    </label>

                    <label className="block" style={{ marginTop: "20px" }}>
                      <input
                        type="text"
                        name="appartement"
                        id="appartement"
                        value={formData.appartement}
                        onChange={handleChange}
                        className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                        placeholder="appartement "
                      />
                    </label>

                    <label className="block" style={{ marginTop: "20px" }}>
                      <input
                        type="text"
                        name="district"
                        id="district"
                        value={formData.district}
                        onChange={handleChange}
                        className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                        placeholder="district"
                      />
                    </label>

                    <label className="block" style={{ marginTop: "20px" }}>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                        placeholder="city"
                      />
                    </label>

                    <label className="block" style={{ marginTop: "20px" }}>
                      <input
                        type="text"
                        name="region"
                        id="region"
                        value={formData.region}
                        onChange={handleChange}
                        className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                        placeholder="region"
                      />
                    </label>

                    <label className="block" style={{ marginTop: "20px" }}>
                      <input
                        type="text"
                        name="postcode"
                        id="postcode"
                        value={formData.postcode}
                        onChange={handleChange}
                        className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                        placeholder="postcode"
                      />
                    </label>
                    <label className="block" style={{ marginTop: "20px" }}>
                      <input
                        type="text"
                        name="country"
                        id="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                        placeholder="Country"
                      />
                    </label>

                    <button
                      onClick={handleSubmit}
                      className="btn text-white base-btn bg-primary hover:bg-primary-focus focus:bg-primary-focus
                    active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
                      style={{
                        float: "right",
                        marginTop: "5px",
                        marginBottom: "16px",
                      }}
                    >
                      Save Client Detail
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

    </main>
  );
}

// import React, { useState } from "react";
// import "./formcss";
// import swal from "sweetalert";
// import axios from "axios";
// import configData from "../../utils/constants/config.json";
// import ImageResize from "../../components/ImageCropper/imageupload";
// import { useLocation } from "react-router-dom";

// export default function ClientDetail() {
//   const [state, setState] = useState({
//     imageResizer: null,
//     loader: false,
//     voucherImage: null,
//     uplodedImag: null,
//   });
//   const location = useLocation();
//   const client = location.state;
//   const imageModalClose = (e) => {
//     setState({ ...state, imageResizer: false });
//   };

//   const changeImage = (file) => {
//     var url = URL.createObjectURL(file);
//     setState({
//       ...state,
//       voucherImage: file,
//       // profileSrc : url
//     });
//   };

//   const uploadImage = () => {
//     setState({ ...state, loader: true });
//     var bodyFormData = new FormData();
//     bodyFormData.append("image", state.voucherImage);
//     axios({
//       method: "post",
//       url: configData.SERVER_URL + "partner/vouchers/voucher-image",
//       data: bodyFormData,
//       headers: {
//         "Content-Type": "multipart/form-data",
//         accesstoken: configData.ACCESSTOKEN,
//         logintoken: localStorage.getItem("loginToken"),
//       },
//     })
//       .then((resp) => {
//         setState({ ...state, loader: false });
//         console.log(resp.data);
//         setState({
//           ...state,
//           imageResizer: false,
//           uplodedImag: resp.data.data.url,
//         });
//       })
//       .catch((err) => {
//         swal({
//           title: "Server Not Responding",
//           text: "Please try again later",
//           icon: "warning",
//           button: "ok",
//         });
//         console.log(err);
//       });
//   };

//   return (
//     <main class="main-content px-[var(--margin-x)] pb-8">
//       <div class="flex items-center space-x-4 py-5 lg:py-6">
//         <h2 class="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">
//           Client
//         </h2>
//         <div class="hidden h-full py-1 sm:flex">
//           <div class="h-full w-px bg-slate-300 dark:bg-navy-600"></div>
//         </div>
//         <ul class="hidden flex-wrap items-center space-x-2 sm:flex">
//           <li class="flex items-center space-x-2">
//             <a
//               class="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent"
//               href="/account/locations"
//             >
//               Client Details
//             </a>
//             <svg
//               x-ignore
//               xmlns="http://www.w3.org/2000/svg"
//               class="h-4 w-4"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 stroke-linecap="round"
//                 stroke-linejoin="round"
//                 stroke-width="2"
//                 d="M9 5l7 7-7 7"
//               />
//             </svg>
//           </li>
//           <li>Client</li>
//         </ul>
//       </div>
//       <div class="flex grid-cols-3 gap-4 sm:gap-5 lg:gap-3 text-left p-4">
//         <div class=" ml-4 pl-4">
//           <ul style={{ listStyle: "none" }} className="card dr-client-Info">
//             <li>
//               <div>
//                 <div class="avatar h-36 w-36">
//                   <img
//                     class="rounded-full bg-slate-200"
//                     src={state.profileSrc ? state.profileSrc : client.image}
//                     alt="avatar"
//                     onClick={() => {
//                       // document.getElementById("profile").click()
//                       setState({ ...state, imageResizer: true });
//                     }}
//                   />
//                 </div>{" "}
//                 <p style={{ color: "blue", textDecoration: "" }}>
//                   {client.email}
//                 </p>
//               </div>

//             </li>
//             <li>

//               <p>Total Sales (AED)</p>
//             </li>
//             <li>
//               <h3> {formData?.bookings?.length}</h3>
//               <p>Booking</p>
//             </li>
//             <li>
//               <h3>
//                 <i class="fas fa-star fa-6x" style={{ color: "yellow" }}></i>
//               </h3>
//               <p>Reviews ( {formData?.serviceProviderReviews?.length > 0
//                           ? formData?.serviceProviderReviews?.length
//                           : "-"})</p>
//             </li>
//           </ul>
//         </div>
//         <div class=" w-full ml-4 pl-4">
//           <div className="card w-full px-4 py-4 sm:px-5">
//             <div className="m-2">
//               <h2 className="text-lg font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">
//                 Basic info
//               </h2>
//             </div>
//             <div className="m-2">
//               {/* BranchReview: []
// bookings: []
// serviceProviderReviews : []  */}
//             </div>
//             <div className="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>

//             <div className="m-2">
//               <h2 className="text-lg font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">Name</h2>
//               <p className="pb-4">{client.firstname + " " + client.lastname}</p>
//               <h2 className="text-lg font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">Gender</h2>
//               <p className="pb-4">{client.gender}</p>
//               <h2 className="text-lg font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">Phone #</h2>
//               <p className="pb-4">{client.phone}</p>
//               <h2 className="text-lg font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">Date Of Birth</h2>
//               <p className="pb-4">{client.dateofbirth}</p>
//             </div>
//           </div>

//           <div className="card mt-5 w-full px-4 py-4 sm:px-5">
//             <div className="m-2">
//               <h2 className="text-lg font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">
//                Adress
//               </h2>
//             </div>
//             <div className="m-2">
//             </div>
//             <div className="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>

//             <div className="m-2">
//               <h2 className="text-lg font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100"> </h2>
//               <p className="pb-4"> </p>

//             </div>
//           </div>
//         </div>
//         {/* <div class="card px-4 py-4 shadow-none  sm:px-5">

//        two
//      </div>
//      <div class="card px-4 py-4 shadow-none  sm:px-5">

//         three
//      </div> */}
//       </div>
//       {state.imageResizer ? (
//         <ImageResize
//           loader={state.loader}
//           aspectRatio={1.0}
//           imageModalClose={imageModalClose}
//           changeImage={changeImage}
//           saveImageAdded={uploadImage}
//         />
//       ) : (
//         <></>
//       )}
//     </main>
//   );
// }
