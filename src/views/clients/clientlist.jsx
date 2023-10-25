import { useEffect, useState } from "react";
import axios from "axios";
import swal from "sweetalert";
import {
  HiBarsArrowDown,
  HiAdjustmentsVertical,
  HiMagnifyingGlass,
  HiChevronDown,
} from "react-icons/hi2";
import ImageResize from "../../components/ImageCropper/imageupload";
import "./client.css";
import userAvatar from "../../assets/images/png/user-avatar.png";
import configData from "../../utils/constants/config.json";
// import { StyledDataGrid } from "../../styles/index.style";
import { API } from "../../Pages/AddAppointment/API";
import moment from "moment";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [page, setpage] = useState(1);
  const [customerCount, setCustomerCount] = useState(1);
  const [pageRecordCount, setPageRecordCount] = useState(8);
  const [popup, showPopup] = useState(false);
  const [state, setState] = useState({
    imageResizer: null,
    loader: false,
    voucherImage: null,
    uplodedImag: null,
  });
  const [notificationsettings, setnotificationsettings] = useState({
    isapp: false,
    ismessage: false,
    isemail: false,
  });
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "male",
    phone: "",
    isemail: notificationsettings?.isemail == false ? 0 : 1, //email notification 0 for false 1 for true
    ismessage: notificationsettings?.ismessage == false ? 0 : 1, //message notification 0 for false 1 for true
    isapp: notificationsettings?.isapp == false ? 0 : 1,
    name: "",
    address: "",
    appartement: "",
    district: "",
    city: "",
    region: "",
    postcode: "",
    country: "",
    status: 0,
  });
  const [clientUpdate, setClientUpdate]=useState(false)

  const gridColumns = [
    {
      field: "clientName",
      headerName: "Client name",
      flex: 0.8,
      renderHeader: (params) => {
        return (
          <span className="font-bold dark:text-navy-50 text-base">
            {params?.colDef?.headerName}
          </span>
        );
      },
      renderCell: (params) => {
        return (
          <div className="flex items-center gap-3 font-medium text-base">
            <img
              className="h-16 w-16"
              src={params.row.imageUrl || userAvatar}
              alt="avatar"
            />
            <span className="dark:text-navy-50">{params.row.clientName}</span>
          </div>
        );
      },
    },
    {
      field: "mobileNumber",
      headerName: "Mobile number",
      flex: 0.8,
      renderHeader: (params) => {
        return (
          <span className="font-bold dark:text-navy-50 text-base">
            {params?.colDef?.headerName}
          </span>
        );
      },
      renderCell: (params) => {
        return (
          <div className="dark:text-navy-50 text-base">
            {params.row.mobileNumber}
          </div>
        );
      },
    },
  ];
 const history = useNavigate()
  const [customerList, setcustomerList] = useState([]);
  useEffect(() => {
    document.body.classList.add("is-sidebar-open")
    API({
      method: "get",
       url: `partner/clients/list-customers?count=${pageRecordCount}&page=${page}&searchText=${searchText}`,
    }).then((response) => {
      setcustomerList(response.customers.map((client, index) => client));
      const fields = Object.keys(response.customers[0]).map((client, index) => {
        return {
          id: index,
          field: client,
          headerName: "Column " + index,
          width: 150,
        };
      });
      setClients(fields);
      setTotalPages(Number(response?.totalPages));
      setPageRecordCount(Number(response?.pageRecordCount));
      setCustomerCount(response?.customersCount);
      setpage(Number(response?.page));
    });
  }, [searchText, clientUpdate]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    API({
      method: "POST",
      url: "partner/clients/create-customer",
      contentType: "application/json",
      payload: JSON.stringify({
        firstName: formValues?.firstName,
        lastName: formValues?.lastName,
        email: formValues?.email,
        gender: formValues?.gender,
        phone: formValues?.phone,
        isemail: notificationsettings?.isemail == false ? 0 : 1, //email notification 0 for false 1 for true
        ismessage: notificationsettings?.ismessage == false ? 0 : 1, //message notification 0 for false 1 for true
        isapp: notificationsettings?.isapp == false ? 0 : 1,
        image:state.uplodedImag,
        addresses: [
          {
            name: formValues.name,
            address: formValues.address,
            appartement: formValues.appartement,
            district: formValues.district,
            city: formValues.city,
            region: formValues.region,
            postcode: formValues.postcode,
            country: formValues.country,
            status: 0,
          },
        ],
      }),
    }).then((res) => {
      setClientUpdate(!clientUpdate)
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
  };

  const onViewe = (client) => {
     history(`/clients/detail`, {state:client})
  };

  const handlePageChange = (e) => {
    e.preventDefault();
    API({
      method: "get",
      url: `partner/clients/list-customers?count=${pageRecordCount}&page=${e.currentTarget.getAttribute(
        "data-page"
      )}&searchText=${searchText}`,
    }).then((response) => {
      setcustomerList(response.customers.map((client, index) => client));
      setTotalPages(Number(response?.totalPages));
      setCustomerCount(response?.customersCount);
      setPageRecordCount(Number(response?.pageRecordCount));
      setpage(Number(response?.page));
    });
  };
  const pagination = () => {
    if (page == 1) {
      return (
        <ol class="pagination">
          <li class="bg-slate-150 dark:bg-navy-500">
            <button
              data-page="1"
              onClick={handlePageChange}
              class="flex h-8 min-w-[2rem] items-center justify-center rounded-lg bg-primary px-3 leading-tight text-white transition-colors hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
            >
              1
            </button>
          </li>
          {totalPages > 1 ? (
            <li class="bg-slate-150 dark:bg-navy-500">
              <button
                data-page="2"
                onClick={handlePageChange}
                class="flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-3 leading-tight transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
              >
                2
              </button>
            </li>
          ) : null}
          <li class="rounded-r-lg bg-slate-150 dark:bg-navy-500">
            <button
              data-page={totalPages}
              onClick={handlePageChange}
              class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:text-navy-200 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
            >
              <svg
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
            </button>
          </li>
        </ol>
      );
    } else {
      if (page == totalPages) {
        return (
          <ol class="pagination">
            <li class="rounded-l-lg bg-slate-150 dark:bg-navy-500">
              <button
                data-page="1"
                onClick={handlePageChange}
                class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:text-navy-200 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            </li>
            <li class="bg-slate-150 dark:bg-navy-500">
              <button
                data-page={parseInt(page) - 1}
                onClick={handlePageChange}
                class="flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-3 leading-tight transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
              >
                {parseInt(page) - 1}
              </button>
            </li>
            <li class="bg-slate-150 dark:bg-navy-500">
              <button
                data-page={page}
                onClick={handlePageChange}
                class="flex h-8 min-w-[2rem] items-center justify-center rounded-lg bg-primary px-3 leading-tight text-white transition-colors hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
              >
                {page}
              </button>
            </li>
          </ol>
        );
      } else {
        return (
          <ol class="pagination">
            <li class="rounded-l-lg bg-slate-150 dark:bg-navy-500">
              <button
                data-page="1"
                onClick={handlePageChange}
                class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:text-navy-200 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            </li>
            <li class="bg-slate-150 dark:bg-navy-500">
              <button
                data-page={parseInt(page) - 1}
                onClick={handlePageChange}
                class="flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-3 leading-tight transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
              >
                {parseInt(page) - 1}
              </button>
            </li>
            <li class="bg-slate-150 dark:bg-navy-500">
              <button
                data-page={page}
                onClick={handlePageChange}
                class="flex h-8 min-w-[2rem] items-center justify-center rounded-lg bg-primary px-3 leading-tight text-white transition-colors hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
              >
                {page}
              </button>
            </li>
            <li class="bg-slate-150 dark:bg-navy-500">
              <button
                data-page={parseInt(page) + 1}
                onClick={handlePageChange}
                class="flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-3 leading-tight transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
              >
                {parseInt(page) + 1}
              </button>
            </li>
            <li class="rounded-r-lg bg-slate-150 dark:bg-navy-500">
              <button
                data-page={totalPages}
                onClick={handlePageChange}
                class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:text-navy-200 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
              >
                <svg
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
              </button>
            </li>
          </ol>
        );
      }
    }
  };

  const handleRecordCountChange = (e) => {
    e.preventDefault();
    API({
      method: "get",
      url: `partner/clients/list-customers?count=${e.currentTarget.value}&page=${page}&searchText=${searchText}`,
    }).then((response) => {
      setcustomerList(response.customers.map((client, index) => client));
      setTotalPages(Number(response?.totalPages));
      setCustomerCount(response?.customersCount);
      setPageRecordCount(Number(response?.pageRecordCount));
      setpage(Number(response?.page));
    });
  };

  const imageModalClose = (e) => {
    setState({ ...state, imageResizer: false });
  };
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
      url: configData.SERVER_URL + "partner/account/upload-profile-image",
      data: bodyFormData,
      headers: {
        "Content-Type": "multipart/form-data",
        accesstoken: configData.ACCESSTOKEN,
        logintoken: localStorage.getItem("loginToken"),
      },
    })
      .then((resp) => {
        setState({ ...state, loader: false });
        console.log(resp.data);
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


  return (
    <div className="main-content px-[var(--margin-x)] pb-8">
      <div className="flex items-center justify-between mt-5">
        <div className="flex items-start flex-col text-slate-800 dark:text-navy-50">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold lg:text-2xl">Clients list</h2>
            <div className="border-2 border-gray-300 font-semibold px-[8px] rounded-full">
              <span className=" text-xs"></span>
            </div>
          </div>
          <div className="mt-2 hidden md:inline-flex items-center gap-1 font-medium text-base">
            <span>View your client's details.</span>
            {/* <span className="cursor-pointer text-sky-500">Learn more</span> */}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          {/* <div className="text-right">
            <a
              href="#"
              className="btn border-[1px] border-gray-400 flex item-center gap-2 base-btn bg-white hover:bg-gray-200 dark:text-navy-50"
            >
              <span className="text-black font-bold">Options</span>
              <HiChevronDown className="mt-1 text-black font-bolder" />
            </a>
          </div> */}

          <div className="text-right">
            <button
              onClick={() => showPopup(!popup)}
              className="btn text-white base-btn bg-primary hover:bg-primary-focus focus:bg-primary-focus
               active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
            >
              Add Client
            </button>
          </div>
        </div>
      </div>

      {/* Data Grid and Search Element */}
      <div className="bg-slate-200 mt-6 p-4 lg:p-5 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex flex-auto items-center gap-3 w-[320px] lg:w-[380px] px-3 py-2 border-[1px]
             border-gray-400 rounded-full bg-white"
            >
              <HiMagnifyingGlass className="text-black font-bold h-4 w-4 lg:w-5 lg:h-5 cursor-pointer" />
              <input
                className="outline-none text-sm lg:text-base bg-transparent flex-auto"
                type="text"
                placeholder="Search by name, email or mobile number"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>

            {/* <button className="icon-btn px-5 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90">
              <span className="hidden md:inline-flex text-slate-800 dark:text-navy-50 font-bold text-sm lg:text-base">
                Filters
              </span>
              <HiAdjustmentsVertical className="text-black dark:text-navy-50 lg:h-6 lg:w-6 w-5 h-5" />
            </button> */}
          </div>

          {/* <button className="icon-btn dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90">
            <span className=" hidden md:inline-flex text-slate-800 dark:text-navy-50 font-bold text-sm lg:text-base">
              Created at
            </span>
            <HiBarsArrowDown className="text-black dark:text-navy-50 lg:h-6 lg:w-6 h-5 w-5" />
          </button> */}
        </div>
      </div>

      {/* Actual Data Grid */}
      {console.log(customerList, "customerList")}
      <Box className="dark:text-navy-50">
        {/* <StyledDataGrid className="customClass"> */}
        <div class="grid grid-cols-1 gap-4 sm:gap-5 mb-5 lg:grid-cols-1 lg:gap-6">
          <div class="card mt-3" style={{ marginBottom: "6rem" }}>
            <div
              class="is-scrollbar-hidden min-w-full overflow-x-auto"
              x-data="pages.tables.initExample1"
            >
              <table class="is-hoverable w-full text-left">
                <thead>
                  <tr>
                    <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      Id#
                    </th>
                    <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      Profile Image
                    </th>
                    <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      Name
                    </th>
                    <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      Email
                    </th>
                    <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      Phone#
                    </th>
                    <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      Gender
                    </th>
                    <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      Reviews
                    </th>
                    <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      Registered Date
                    </th>
                    <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      Bookings
                    </th>
                    <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {customerList?.map((client) => (
                    <tr class="border-y border-transparent border-b-slate-200 dark:border-b-navy-500">
                      <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                        {client?.id}
                      </td>
                      <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                        <div class="flex items-center space-x-4">
                          <div class="flex-shrink-0">
                            <img
                              class="w-8 h-8 rounded-full"
                              src={client?.image}
                              alt="Neil image"
                            />
                          </div>
                        </div>
                      </td>

                      <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                        {client?.firstname + client?.lastname}
                      </td>
                      <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                        {client?.email}
                      </td>
                      <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                        {client?.phone}
                      </td>
                      <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                        {client?.gender}
                      </td>
                      <td class="whitespace-nowrap px-4 py-3 sm:px-5 text-center">
                        {client?.serviceProviderReviews?.length > 0
                          ? client?.serviceProviderReviews?.length
                          : "-"}
                      </td>
                      <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                        {moment(client?.registedon).format("MMMM DD, YYYY")}
                      </td>
                      <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                        {client?.bookings?.length}
                      </td>

                      <td class="whitespace-nowrap px-4 py-3 sm:px-5">
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
                                  .getElementById("pooper-" + client?.id)
                                  .classList.contains("show")
                              ) {
                                document
                                  .getElementById("pooper-" + client?.id)
                                  .classList.remove("show");
                              } else {
                                document
                                  .getElementById("pooper-" + client?.id)
                                  .classList.add("show");
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
                            id={"pooper-" + client?.id}
                            x-ref="popperRoot"
                            class="popper-root"
                          >
                            <div class="popper-box rounded-md border border-slate-150 bg-white py-1.5 font-inter dark:border-navy-500 dark:bg-navy-700">
                              <ul>
                                <li>
                                  <button
                                    onClick={() => onViewe(client)}
                                    class="flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-none transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                                    id="editClosingDateModal"
                                  >
                                    View
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {customerList?.length !== 0 && (
                <div class="flex flex-col justify-between space-y-4 px-4 py-4 sm:flex-row sm:items-center sm:space-y-0 sm:px-5">
                  <div class="flex items-center space-x-2 text-xs+">
                    <span>Show</span>
                    <label class="block">
                      <select
                        onChange={handleRecordCountChange}
                        class="form-select rounded-full border border-slate-300 bg-white px-2 py-1 pr-6 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
                      >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                      </select>
                    </label>
                    <span>entries</span>
                  </div>
                  {pagination()}
                  <div class="text-xs+">
                    {(page - 1) * pageRecordCount} - {page * pageRecordCount} of{" "}
                    {customerCount} entries
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* </StyledDataGrid> */}
      </Box>

      {/* popups  */}

      {popup && (
        <div className="col-md-9 mx-auto p-8 drop-shadow-2xl popup-box">
          <span className="popup-close-icon" onClick={() => showPopup(false)}>
            x
          </span>
          <form className="space-x-6 p-6 text-left">
            <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2 lg:gap-6">
              <div className="relative flex flex-col overflow-hidden rounded-lg bg-gradient-to-br   p-3.5">
              <label className="block">
              <div class="avatar h-12 w-12">
                  <img
                    class="rounded-full bg-slate-200"
                    src={state.uplodedImag ? state.uplodedImag : "/images/upload-image.png"}
                    alt="avatar"
                    onClick={() => {
                      // document.getElementById("profile").click()
                      setState({ ...state, imageResizer: true });
                    }}
                  /> 
                </div> <span className="after:content-['*'] after:ml-0.5 after:text-red-500   text-sm font-medium text-slate-700">
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
                    value={formValues.firstName}
                    onChange={handleInputChange}
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
                    value={formValues.lastName}
                    onChange={handleInputChange}
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
                    value={formValues.email}
                    onChange={handleInputChange}
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
                    value={formValues.phone}
                    onChange={handleInputChange}
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
                    marginBottom:"8px",
                    color: "black",
                  }}
                >
                  <legend>Gender</legend>

                  <input
                    id="draft"
                    className="appearance-none border border-gray-300 rounded-full w-5 h-5 checked:bg-blue-600 checked:border-transparent focus:outline-none"
                    type="radio"
                    style={{  position: "relative", top: "4px", right: "3px"  }}

                    name="gender"
                    value={"female"}
                    checked={formValues.gender === "female"}
                    onChange={handleInputChange}
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
                      position: "relative", top: "4px", right: "3px" }} 
                    className="appearance-none border border-gray-300 rounded-full w-5 h-5 checked:bg-blue-600 checked:border-transparent focus:outline-none"
                    checked={formValues.gender === "male"}
                    onChange={handleInputChange}
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
              </div>
              {console.log(notificationsettings, "notificationsettings")}
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
                        value={formValues.name}
                        onChange={handleInputChange}
                        className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                        placeholder="Address Name"
                      />
 
                    </label>

                    <label className="block" style={{ marginTop: "20px" }}>
                     
                      <input
                        type="text"
                        name="address"
                        id="address"
                        value={formValues.address}
                        onChange={handleInputChange}
                        className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                        placeholder="address"
                      />
                    </label>

                    <label className="block" style={{ marginTop: "20px" }}>
                      
                      <input
                        type="text"
                        name="appartement"
                        id="appartement" 
                        value={formValues.appartement}
                        onChange={handleInputChange}
                        className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                        placeholder="appartement "
                      />
                    </label>

                    <label className="block" style={{ marginTop: "20px" }}>
                      
                      <input
                        type="text"
                        name="district"
                        id="district"
                        value={formValues.district}
                        onChange={handleInputChange}
                        className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                        placeholder="district"
                      />
                    </label>

                    <label className="block" style={{ marginTop: "20px" }}>
                      
                      <input
                        type="text"
                        name="city"
                        value={formValues.city}
                        onChange={handleInputChange}
                        className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                        placeholder="city"
                      />
                    </label>

                    <label className="block" style={{ marginTop: "20px" }}>
                      
                      <input
                        type="text"
                        name="region"
                        id="region"
                        value={formValues.region}
                        onChange={handleInputChange}
                        className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                        placeholder="region"
                      />
                    </label>

                    <label className="block" style={{ marginTop: "20px" }}>
                      
                      <input
                        type="text"
                        name="postcode"
                        id="postcode"
                        value={formValues.postcode}
                        onChange={handleInputChange}
                        className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                        placeholder="postcode"
                      />
                    </label>
                    <label className="block" style={{ marginTop: "20px" }}>
                      
                      <input
                        type="text"
                        name="country"
                        id="country"
                        value={formValues.country}
                        onChange={handleInputChange}
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
                        marginTop:"5px",
                        marginBottom: "16px",
                      }}
                    >
                      Save Client
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
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
    </div>
  );
};

export default ClientList;
