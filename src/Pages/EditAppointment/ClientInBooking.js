import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API } from "./API";
import swal from "sweetalert";
import "./ClientInBooking.css";
import moment from "moment";
import { findDuration } from "../../utls";
//or
function ClientInBooking({
  onChangeClientSearch,
  inputValue,
  submitForm,
  submitByCheckOutExpress,
  SearchClickHandler,
  isSearching = false,
  customerList = [],
  closeClickHandler,
  selectClient,
  isClientDetial = false,
  customerObj,
  Total,
  customerAppointment,
  cleintSelectionError,
  FormErrorMessage,
  loading,
  submitloading,
}) {
  const [popup, showPopup] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const history = useNavigate()
  console.log(isClientDetial, "isClientDetial");
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "male",
    phone: "",
  });

  const validateForm = () => {
    let errors = {};
    // First Name validation
    if (!formValues.firstName) {
      errors.firstName = "First Name is required";
    }
    // Last Name validation
    if (!formValues.lastName) {
      errors.lastName = "Last Name is required";
    }
    // Email validation
    if (!formValues.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      errors.email = "Email is invalid";
    }
    // Phone Number validation
    if (!formValues.phone) {
      errors.phone = "Phone Number is required";
    } else if (!/^\+(?:[0-9] ?){6,14}[0-9]$/.test(formValues.phone)) {
      errors.phone = "Phone Number is invalid";
    }
    // Gender validation
    if (!formValues.gender) {
      errors.gender = "Gender is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }; 
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      API({
        method: "POST",
        url: "partner/clients/create-customer",
        contentType: "application/json",
        payload: JSON.stringify(formValues),
      }).then((res) => {
        if (res?.message == "customer account created") {
          showPopup(false);
          swal({
            title: "Thanks",
            text: res?.message,
            icon: "success",
            button: "ok",
          });
          setFormValues({
            firstName: "",
            lastName: "",
            email: "",
            gender: "male",
            phone: "",
          });
        } else {
          swal({
            title: "We are sorry.",
            text: res?.message,
            icon: "warning",
            button: "ok",
          });
        }
      });
    }
  };
  return (
    <div
      className="client-selection-card"
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "34.3rem",
        marginBottom: "26px",
      }}
    >
      <div className="customer-input">
        <div className="_06c69fb22 _4f1b18436 _06c677577">
          <div className="_06c6b65c2 _0652f55c2 f3fab05c2 _2d8db85c2 _8ac1cf577">
            <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.78 22.722l-4.328-4.328c1.073-1.307 1.72-2.983 1.72-4.808C21.17 9.398 17.77 6 13.585 6 9.395 6 6 9.398 6 13.586c0 4.187 3.394 7.585 7.586 7.585 1.825 0 3.497-.64 4.805-1.712l4.33 4.324c.294.294.768.294 1.06 0 .295-.29.295-.767 0-1.057zm-10.194-3.06c-3.354 0-6.08-2.726-6.08-6.076 0-3.35 2.726-6.08 6.08-6.08 3.35 0 6.08 2.73 6.08 6.08s-2.73 6.076-6.08 6.076z"></path>
            </svg>
            <input
              className="client-search-input"
              placeholder="Search client"
              name="searchString"
              value={inputValue}
              onChange={onChangeClientSearch}
              onClick={SearchClickHandler}
            />
          </div>
        </div>
      </div>
      <hr
        aria-orientation="horizontal"
        className="ba82f0076 _082886076 _4a6db9076 a73dd3076"
      />
      {isSearching ? (
        <div className="search-list">
          <span className="cross-icon " onClick={closeClickHandler}>
            x
          </span>
          <div className="create-customer" onClick={() => showPopup(!popup)}>
            <span className="plus-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  style={{ fill: "#037aff" }}
                  fill-rule="evenodd"
                  d="M12 1a1 1 0 011 1v9h9a1 1 0 01.993.883L23 12a1 1 0 01-1 1h-9v9a1 1 0 01-.883.993L12 23a1 1 0 01-1-1v-9H2a1 1 0 01-.993-.883L1 12a1 1 0 011-1h9V2a1 1 0 01.883-.993z"
                ></path>
              </svg>
            </span>
            <span>Create Client</span>
          </div>
          <ul
            data-qa="customer-list"
            className="p-6 divide-y divide-slate-200"
            style={{ padding: "5px", borderBottom: "1px solid", margin: "0px" }}
          >
            {customerList?.length > 0 ? (
              customerList?.map((customer) => {
                return (
                  <li
                    className="flex cursor-pointer py-4 first:pt-0 last:pb-0"
                    onClick={() =>
                      selectClient({
                        customer,
                        id: customer.id,
                        name: customer.firstname,
                        email: customer.email,
                        image: customer.image,
                      })
                    }
                  >
                    <img
                      className="h-10 w-10 rounded-full"
                      src={
                        customer.image ? customer.image : "/images/100x100.png"
                      }
                      alt=""
                    />
                    <div
                      style={{ paddingLeft: "10px" }}
                      className="ml-3 pl4 overflow-hidden"
                    >
                      <p className="text-sm font-medium text-slate-900">
                        {customer.firstname}
                      </p>
                      <p className="text-sm text-slate-500 truncate">
                        {customer.email}
                      </p>
                    </div>
                  </li>
                );
              })
            ) : (
              <li
                className="flex cursor-pointer py-4 first:pt-0 last:pb-0"
                style={{ margin: "auto", display: "block" }}
              >
                <div className="ml-3 overflow-hidden">
                  <p className="text-sm text-center font-medium text-slate-900">
                    Not Found
                  </p>
                </div>
              </li>
            )}
          </ul>
        </div>
      ) : isClientDetial ? (
        <div
          style={{
            borderRadius: "4px",
            minHeight: "27rem",
            backgroundColor: "#fefefe",
            padding: "8px",
            position: "relative",
            top: "-3rem",
          }}
        >
         
          <ul
            data-qa="customer-list"
            className="p-6 divide-y divide-slate-200"
            style={{ padding: "5px", borderBottom: "1px solid", margin: "0px" }}
          >
            <li
              className="flex py-4 first:pt-0 last:pb-0"
              style={{cursor:"pointer"}}
              onClick={() =>
               history(`/clients/detail`,{state:customerObj})
              }
            >
              <img
                className="h-10 w-10 rounded-full"
                src={
                  customerObj.image ? customerObj.image : "/images/100x100.png"
                }
                alt=""
              />
              <div
                style={{ paddingLeft: "10px" }}
                className="ml-3 block pl4 overflow-hidden"
              >
                <p className="text-sm font-medium text-slate-900">
                  {customerObj.name}
                </p>
                <p className="text-sm text-slate-500 truncate">
                  {customerObj.email}
                </p>
              </div>
            </li>
          </ul>

          <ol
            style={{ justifyContent: "space-around", padding: "12px" }}
            className="items-center w-full space-y-4 sm:flex sm:space-x-8 sm:space-y-0"
          >
            <li className="flex items-center text-blue-600 dark:text-blue-500 space-x-2.5">
              <span>
                <h3 className="font-medium leading-tight">
                  {customerAppointment?.totalBookings}
                </h3>
                <p className="text-sm font-weight-bold">Total Bookings</p>
              </span>
            </li>
            {/* <li className="flex items-center text-gray-500 dark:text-gray-400 space-x-2.5">
              <span>
                <h3 className="font-medium leading-tight">0 AED</h3>
                <p className="text-sm">Total Sales</p>
              </span>
            </li> */}
          </ol>

          <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
            <ul
              className="flex flex-wrap -mb-px text-sm font-medium text-center"
              id="myTab"
              data-tabs-toggle="#myTabContent"
              role="tablist"
              style={{
                justifyContent: "center",
                color: "black",
                fontWeight: "bold",
              }}
            >
              <li className="mr-2 mr-auto" role="presentation">
                <button
                  className="font-weight-bold inline-block p-4 border-b-2 rounded-t-lg"
                  id="profile-tab"
                  data-tabs-target="#profile"
                  type="button"
                  role="tab"
                  aria-controls="profile"
                  aria-selected="false"
                >
                  Appointments
                </button>
              </li>
            </ul>
          </div>
          <div id="myTabContent">
            <div
              className="  p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
              id="profile"
              role="tabpanel"
              aria-labelledby="profile-tab"
            >
              {customerAppointment?.appointments?.map(
                ({
                  date,
                  price,
                  starttime,
                  endtime,
                  status,
                  service,
                  service_bookingsToservice,
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
                        <strong>{service_bookingsToservice.name}</strong>
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
              {customerAppointment?.appointments?.length < 1 && (
                <p
                  className="text-sm text-gray-500 dark:text-gray-400 pt-8"
                  style={{ marginTop: "3rem" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 64 64"
                    style={{ width: "6rem", margin: "auto" }}
                  >
                    <g fill="none" fill-rule="evenodd">
                      <circle
                        fill="#FBD74C"
                        cx="28.5"
                        cy="23.5"
                        r="9.5"
                      ></circle>
                      <path
                        d="M28.5 4C42.031 4 53 14.969 53 28.5a24.413 24.413 0 01-6.508 16.63c.041.022.082.05.12.08l.095.083 14 14a1 1 0 01-1.32 1.497l-.094-.083-14-14a1 1 0 01-.164-.216A24.404 24.404 0 0128.5 53C14.969 53 4 42.031 4 28.5S14.969 4 28.5 4zm0 2C16.074 6 6 16.074 6 28.5S16.074 51 28.5 51 51 40.926 51 28.5 40.926 6 28.5 6zM28 32c3.856 0 7.096.928 9.689 2.392 1.362.77 2.226 2.143 2.305 3.66l.006.229V40a1 1 0 01-.883.993L39 41H17a1 1 0 01-.993-.883L16 40v-1.739c0-1.599.871-3.067 2.29-3.877C20.856 32.924 24.095 32 28 32zm0 2c-3.545 0-6.446.827-8.719 2.122-.748.426-1.216 1.16-1.275 1.966L18 38.26V39h20v-.72c0-.76-.364-1.472-.989-1.945l-.148-.105-.158-.097C34.401 34.832 31.495 34 28 34zm.5-17a6.5 6.5 0 110 13 6.5 6.5 0 010-13zm0 2a4.5 4.5 0 100 9 4.5 4.5 0 000-9z"
                        fill="#101928"
                        fill-rule="nonzero"
                      ></path>
                    </g>
                  </svg>
                </p>
              )}
            </div>
            <div
              className="hidden p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
              id="dashboard"
              role="tabpanel"
              aria-labelledby="dashboard-tab"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This is some placeholder content the{" "}
                <strong className="font-medium text-gray-800 dark:text-white">
                  Dashboard tab's associated content
                </strong>
                . Clicking another tab will toggle the visibility of this one
                for the next. The tab JavaScript swaps classes to control the
                content visibility and styling.
              </p>
            </div>
            <div
              className="hidden p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
              id="settings"
              role="tabpanel"
              aria-labelledby="settings-tab"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This is some placeholder content the{" "}
                <strong className="font-medium text-gray-800 dark:text-white">
                  Settings tab's associated content
                </strong>
                . Clicking another tab will toggle the visibility of this one
                for the next. The tab JavaScript swaps classes to control the
                content visibility and styling.
              </p>
            </div>
            <div
              className="hidden p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
              id="contacts"
              role="tabpanel"
              aria-labelledby="contacts-tab"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This is some placeholder content the{" "}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="_06c69e4b1 _6baf104b1 _1d13464b1 _4d73ce790 _8046d4790 _854a71790 _48c254790">
          <div className="_06c69e4b1 _6baf104b1 _7774974b1 _8046d4790 _854a71790 _48c254790">
            <div className="_06c6af61c" data-qa="placeholder-container">
              <div className="ed70f361c">
                <div className="not-found" data-qa="placeholder-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 64 64"
                    style={{ width: "6rem", margin: "auto" }}
                  >
                    <g fill="none" fill-rule="evenodd">
                      <circle
                        fill="#FBD74C"
                        cx="28.5"
                        cy="23.5"
                        r="9.5"
                      ></circle>
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
                    Use the search to add or select a client.
                  </p>
                </div>
              </div>
              <div className="_1091c961c"></div>
            </div>
            <div style={{ flexGrow: 1 }}></div>
          </div>
        </div>
      )}
      <div className="bottom-secion-clients">
        <div>
          <div className="UQ5Ndy">
            {/* {Total && (
              <p
                style={{ fontWeight: 'bold', color: 'black' }}
                className="_06c6c54ba _4ebb474ba d59a424ba pb-2"
              >
                Total: <span>{Total}</span>
              </p>
            )} */}
          </div>

          <div style={{ marginTop: "87px" }}>
            {/* {errorMessage(cleintSelectionError)} */}

            {Total && (
              <p
                style={{ fontWeight: "bold", color: "black" }}
                className="_06c6c54ba _4ebb474ba d59a424ba pb-2"
              >
                Total: <span>{Total}</span>
              </p>
            )}
            <p
              style={{
                fontWeight: "bold",
                paddingLeft: "34px",
                color: "black",
              }}
              className="_06c6c54ba _4ebb474ba d59a424ba pb-2"
            >
              {cleintSelectionError && errorMessage(cleintSelectionError)}
            </p>
            
            {!submitloading ? (
              <button
                style={
                  {
                    // margin: 'auto',
                    // display: 'block',
                  }
                }
                onClick={submitForm}
                className="btn mb-10  px-3 py-3 space-x-2 bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
              >
                update appointment
              </button>
            ) : (
              <button
                onClick={submitForm}
                className="btn mb-10  px-3 py-3 space-x-2 bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
              >
                update appointment{" "}
                <img
                  style={{
                    width: "30px",
                    height: "22px",
                  }}
                  className="h-11 loader-img w-11 transition-transform duration-500 ease-in-out hover:rotate-[360deg]"
                  src="/images/icons/btn-loader.svg"
                  alt="Loader"
                />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* popup  */}
      {popup && (
        <div className="max-w-lg mx-auto p-8 drop-shadow-2xl popup-box">
          <span className="popup-close-icon" onClick={() => showPopup(false)}>
            x
          </span>
          <form className="space-x-6 p-6 text-left ">
            <label className="block">
              <span className="after:content-['*'] after:ml-0.5 after:text-red-error block text-sm font-medium text-slate-700">
                First Name
              </span>
              <input
                type="text"
                name="firstName"
                value={formValues.firstName}
                onChange={handleInputChange}
                className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                placeholder="Exampel John"
              />
              {formErrors.firstName && (
                <span className="text-red-error text-sm">{formErrors.firstName}</span>
              )}
            </label>
            <label className="">
              <span className="after:content-['*'] after:ml-0.5 after:text-red-error block text-sm font-medium text-slate-700">
                Last Name
              </span>
              <input
                type="text"
                name="lastName"
                value={formValues.lastName}
                onChange={handleInputChange}
                className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                placeholder="Example Doe"
              />
              {formErrors.lastName && (
                <span className="text-red-error text-sm">{formErrors.lastName}</span>
              )}
            </label>
            <label className="block" style={{ marginLeft: "0px" }}>
              <span className="after:content-['*'] after:ml-0.5 after:text-red-error block text-sm font-medium text-slate-700">
                Email
              </span>
              <input
                value={formValues.email}
                onChange={handleInputChange}
                type="email"
                name="email"
                className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                placeholder="you@example.com"
              />
              {formErrors.email && (
                <span className="text-red-error text-sm">{formErrors.email}</span>
              )}
            </label>
            <label className="block" style={{ marginLeft: "0px" }}>
              <span className="after:content-['*'] after:ml-0.5 after:text-red-error block text-sm font-medium text-slate-700">
                Phone Number*
              </span>
              <input
                value={formValues.phone}
                onChange={handleInputChange}
                name="phone"
                type="tel"
                id="phone"
                className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                placeholder="+112345678998"
              />
              {formErrors.phone && (
                <span className="text-red-error text-sm">{formErrors.phone}</span>
              )}
            </label>

            <div
              style={{ marginLeft: "4px", marginTop: "15px", color: "black" }}
            >
              <legend>Gender</legend>

              <input
                id="draft"
                className="appearance-none border border-gray-300 rounded-full w-5 h-5 checked:bg-blue-600 checked:border-transparent focus:outline-none"
                type="radio"
                name="gender"
                value={"female"}
                checked={formValues.gender === "female"}
                onChange={handleInputChange}
              />
              <label for="draft" className="peer-checked/draft:text-sky-500">
                Female
              </label>

              <input
                name="gender"
                value={"male"}
                style={{ marginLeft: "10px", position: "relative", top: "2px" }}
                className="appearance-none border border-gray-300 rounded-full w-5 h-5 checked:bg-blue-600 checked:border-transparent focus:outline-none"
                checked={formValues.gender === "male"}
                onChange={handleInputChange}
                id="published"
                type="radio"
              />
              {formErrors.gender && (
                <span className="text-red-error text-sm">{formErrors.gender}</span>
              )}
              <label
                for="published"
                className="peer-checked/published:text-sky-500"
              >
                Male
              </label>
            </div>
            {/* <label className=" pt-8 mt-5 ">
              <span className="sr-only">Choose profile photo</span>
              <input
                style={{ marginLeft: '4px' }}
                type="file"
                name="choose image"
                className="mt-5 w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-violet-50 file:text-violet-700
      hover:file:bg-violet-100
    "
              />
            </label> */}
            <button
              onClick={handleSubmit}
              type="button"
              className="btn  px-3 py-3 space-x-2 bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
              style={{
                float: "right",
                marginBottom: "16px",
              }}
            >
              Save Client
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ClientInBooking;

export const errorMessage = (errorText) => {
  return (
    <>
      {errorText && (
        <span className="text-left pl-4 error-message" style={{ color: "red" }}>
          {errorText}
        </span>
      )}
    </>
  );
};
