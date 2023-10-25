import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import axios from "axios";
import swal from "sweetalert";
import {
  HiBarsArrowDown,
  HiAdjustmentsVertical,
  HiMagnifyingGlass,
  HiChevronDown,
} from "react-icons/hi2";

import userAvatar from "../../assets/images/png/user-avatar.png";
import configData from "../../utils/constants/config.json";
// import { StyledDataGrid } from "../../styles/index.style";
import { API } from "../../Pages/AddAppointment/API";
import moment from "moment";
import ImageResize from "../../components/ImageCropper/imageupload";

const Offers = () => {

  const [imageResizer, setImageResizer] = useState(false);
  const [imageResizerMobile, setImageResizerMobile] = useState(false);
  const [loader, setLoader] = useState(false);
  const [voucherImage, setVoucherImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedImageMobile, setUploadedImageMobile] = useState(null);
  const [showMonthModal, setShowMonthModal] = useState(false);
  const [selectedMonth, setMonths] = useState(1);
  const [offerIdSelected, setOfferid]= useState(0)
  const [clients, setClients] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [page, setpage] = useState(1);
  const [customerCount, setCustomerCount] = useState(1);
  const [pageRecordCount, setPageRecordCount] = useState(5);
  const [popup, showPopup] = useState(false);
  const [pickDate, setPickerData] = useState(Date());
  const [pickendDate, setEndDate] = useState(Date());
  const [listUpdate, setListUpdate] = useState(false);
  const [updateServiceId, setUpdateServiceId] = useState();

  const [updatePreload, setForUpdate] = useState({});
  const [isUpdate, setisUpdate] = useState(false);
  const [countOffer, setAllOfferCount] = useState(0);

  const [services, fetchServices] = useState([]);
  const [initialServiceId, setInitialService] = useState();

  const [formValues, setFormValues] = useState({
    branchId: null,
    images:[],
    serviceId:   null,
    startDate: null,
    endDate: null, 
    percentage: null,
    name: null,
    description: "",
  });
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

  const [customerList, setcustomerList] = useState(gridColumns);
  const [branchList, setBranchList] = useState([]);
  const [branchSelectValue, srtBranchSelectValue] = useState();

  useEffect(() => {
    document.body.classList.add("is-sidebar-open")
    axios({
      method: "get",
      url: configData.SERVER_URL + `partner/businesssetup/getBranches`,
      headers: {
        "Content-Type": 'Content-Type", "application/json',
        accesstoken: configData.ACCESSTOKEN,
        logintoken: localStorage.getItem("loginToken"),
      },
    })
      .then((resp) => {
        setBranchList(resp.data?.branches);
        srtBranchSelectValue(resp.data?.branches[0].id);
      })
      .catch(() => {});
  }, []);

  const onChangeBranch = (event) => {
    srtBranchSelectValue(event.target.value);
  };

  useEffect(() => {
    // if (branchSelectValue) {
      API({
        method: "get",
        url: `partner/offers/fetch-services/${branchSelectValue}`,
      }).then((response) => {
        fetchServices(
          response?.data?.services?.map((services, index) => services)
        );
      });
    // }

    

  }, [branchSelectValue, popup]);

  useEffect(() => {
    if (branchSelectValue) {
      API({
        method: "get",
        url: `partner/offers/fetch-branch-offers/${branchSelectValue}?count=${pageRecordCount}&page=${page}&searchText=${searchText}`,
      }).then((response) => {
        setcustomerList(response?.data?.offers?.map((client, index) => client));
        setTotalPages(Number(response?.data?.totalPages));
        setPageRecordCount(Number(response?.data?.pageRecordCount));
        setCustomerCount(response?.data?.customersCount);
        setpage(Number(response?.data?.page));
        setAllOfferCount(response?.data?.totalRecords)
        setFormValues({...formValues, serviceId: services[0]?.id})
      });
    }
  }, [searchText, branchSelectValue, listUpdate]);
 
  const handleInputChange = (event) => {
     

    const { name, value } = event.target;
 
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formValues, 'values')
 if ( formValues?.name ==null) {
      document.getElementById("name").focus();
      return;
    } 
    if ( formValues?.percentage ==null) {
      document.getElementById("percentage").focus();
      return;
    }
   
    if ( formValues?.serviceId ==null) {
      document.getElementById("serviceId").focus();
      return;
    } 
    // if ( formValues?.startDate ==null) {
    //   document.getElementById("startDate").focus();
    //   return;
    // }
    // if ( formValues?.endDate  ==null) {
    //   document.getElementById("endDate").focus();
    //   return;
    // }
   
    API({
      method: "POST",
      url: "partner/offers/create-offer",
      contentType: "application/json",
      payload: JSON.stringify({
        ...formValues,
        serviceId: Number(formValues?.serviceId),
        branchId: Number(branchSelectValue),
        endDate: document.getElementById('endDate').value,
        startDate:document.getElementById('startDate').value,
        percentage: Number(formValues.percentage),
        images: [uploadedImage],
      }),
    }).then((res) => {
      setListUpdate(!listUpdate);
      if (parseInt(Object.keys(res)[0]) === 200) {
        showPopup(false);
        
        swal({
          title: "Thanks",
          text: res[Object.keys(res)[0]],
          icon: "success",
          button: "ok",
        });
        setFormValues({
          startDate: pickDate,
          endDate: pickendDate,
          percentage: 0,
          name: "",
          description: "",
          serviceId:null,
        });
      } else {
        swal({
          title: "We are sorry.",
          text: res[Object.keys(res)[0]],
          icon: "warning",
          button: "ok",
        });
      }
    });
  };
  const handleUpdate = (event) => {
    event.preventDefault();
    API({
      method: "put",
      url: `partner/offers/update-offer/${updatePreload?.branchId}/${updatePreload?.id}`,
      contentType: "application/json",
      payload: JSON.stringify({
        ...formValues,
        branchId: Number(branchSelectValue),
        endDate: document.getElementById('endDate').value,
        startDate:document.getElementById('startDate').value,
        percentage: Number(formValues.percentage),
        newImages: uploadedImage?[uploadedImage]:[formValues?.images[0]?.image] ,
        deletedImages:[formValues?.images[0].id]
      }),
    }).then((res) => {
      if (parseInt(Object.keys(res)[0]) === 200) {
        showPopup(false); 
        setListUpdate(!listUpdate);
        updatePreload({});
       
        swal({
          title: "Thanks",
          text: res[Object.keys(res)[0]],
          icon: "success",
          button: "ok",
        });
        setFormValues({
          startDate: null,
          endDate: null,
          percentage: null,
          name: null,
          description: "",
          serviceId: null,
        });
      } else {
        swal({
          title: "We are sorry.",
          text: res[Object.keys(res)[0]],
          icon: "warning",
          button: "ok",
        });
      }
    });
  };
  const handlePageChange = (e) => {
    e.preventDefault();
    API({
      method: "get",
      url: `partner/offers/fetch-branch-offers/${branchSelectValue}?count=${pageRecordCount}&page=${e.currentTarget.getAttribute(
        "data-page"
      )}&searchText=${searchText}`,
    }).then((response) => {
      setcustomerList(response?.data?.offers?.map((client, index) => client));
      setTotalPages(Number(response?.data?.totalPages));
      setPageRecordCount(Number(response?.data?.pageRecordCount));
      setCustomerCount(response?.data?.customersCount);
      setpage(Number(response?.data?.page));
    });
  };

// add images 

const imageModalClose = (e) => {
  e ? setImageResizerMobile(true) : setImageResizer(false);
};

const changeImage = (file) => {
  var url = URL.createObjectURL(file);
  setVoucherImage(file);
  // profileSrc : url
};

const uploadImage = (isMobile) => {
  setLoader(true);
  var bodyFormData = new FormData();
  bodyFormData.append('image', voucherImage);
  axios({
    method: "post",
    url: configData.SERVER_URL + 'partner/offers/add-image',
    data: bodyFormData,
    headers: { 
      "Content-Type": "multipart/form-data",
      "accesstoken": configData.ACCESSTOKEN,
      "logintoken": localStorage.getItem('loginToken')
    },
  })
    .then(resp => {
      setLoader(false);
         setImageResizer(false);
        setUploadedImage(resp?.data?.image); 
    })
    .catch(err => {
      swal({
        title: "Server Not Responding",
        text: "Please try again later",
        icon: "warning",
        button: "ok",
      });
      console.log(err);
    });
};

const modalShow = (e) => { 
  setShowMonthModal( true) 
};

const modalHide = (e) => {
e.preventDefault();
setShowMonthModal(false) 
};

const promote=()=>{
  
  const savedToken = localStorage.getItem('loginToken')
  const successURL = `https://partner.drclinica.com/payment-success?session_id={CHECKOUT_SESSION_ID}&offerId=${offerIdSelected}&noOfMonths=${selectedMonth}&indicator=offer`;
  const cancelled = `https://partner.drclinica.com/cancelled`;
  
  const paymentFor="FeaturedOffer"
  var urlencoded = new URLSearchParams() 
  urlencoded.append("successURL", successURL);
  urlencoded.append("cancelURL", cancelled);
  urlencoded.append("paymentFor", paymentFor);
  urlencoded.append("noOfMonths", selectedMonth);
  axios({
          method: "post",
          url: configData.SERVER_URL + `partner/promotion/create-stripe-session`,
          data: urlencoded,
          headers: { 
              "Content-Type": "application/x-www-form-urlencoded",
              "accesstoken" : configData.ACCESSTOKEN,
              "logintoken" : savedToken
          },
      }).then(resp => {
          if(parseInt(Object.keys(resp.data)[0]) === 200){
               window.location.href = resp.data.session.url
            }else{
              swal({
                text: resp.data[Object.keys(resp.data)[0]],
                title: "Server Not Responding",
                icon: "warning",
                button: "ok",
              });
            } 
      }).catch(err => {
          swal({
              title: "Server Not Responding",
              text: "Please try again later",
              icon: "warning",
              button: "ok",
          })
          console.log(err)
      }) 
} 

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
      url: `partner/offers/fetch-branch-offers/${branchSelectValue}?count=${e.currentTarget.value}&page=${page}&searchText=${searchText}`,
    }).then((response) => {
      setcustomerList(response?.data?.offers?.map((client, index) => client));
      setTotalPages(Number(response?.data?.totalPages));
      setCustomerCount(response?.data?.customersCount);
      setPageRecordCount(Number(response?.data?.pageRecordCount));
      setpage(Number(response?.data?.page));
    });
  };
   return (
    <div className="main-content px-[var(--margin-x)] pb-8">
      <div className="flex items-center justify-between mt-5">
        <div className="flex items-start flex-col text-slate-800 dark:text-navy-50">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold lg:text-2xl">Discounts List</h2>
            <div className="border-2 border-gray-300 font-semibold px-[8px] rounded-full">
              <span className=" text-xs"></span>
            </div>
          </div>
          <div className="mt-2 hidden md:inline-flex items-center gap-1 font-medium text-base">
            <span>View, Offers.</span>
            <span className="cursor-pointer text-sky-500">Learn more</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="text-right">
            <button
              onClick={() =>{ setForUpdate({}); setFormValues({branchId: null,
                images:[],
                serviceId:   null,
                startDate: null,
                endDate: null, 
                percentage: null,
                name: null,
                description: "",}); showPopup(!popup);}}
              className="btn text-white base-btn bg-primary hover:bg-primary-focus focus:bg-primary-focus
               active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
            >
              Add Discount
            </button>
          </div>
        </div>
      </div>

      {/* Data Grid and Search Element */}
      <div className="bg-slate-200 mt-6 p-4 lg:p-5 rounded-lg">
        <div class="flex items-center justify-between">
          <div
            className="flex flex-auto items-center gap-3 w-[320px] lg:w-[380px] px-3 py-2 border-[1px]
             border-gray-400 rounded-full bg-white"
          >
            <HiMagnifyingGlass className="text-black font-bold h-4 w-4 lg:w-5 lg:h-5 cursor-pointer" />
            <input
              className="outline-none text-sm lg:text-base bg-transparent flex-auto"
              type="text"
              placeholder="Search by name "
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <div className="flex icon-btn px-5 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90">
            <span className="w-60 mt-2  md:inline-flex text-slate-800 dark:text-navy-50 font-bold text-sm lg:text-base">
              Search by Branch
            </span>
            <select
              value={branchSelectValue}
              onChange={onChangeBranch}
              className="block appearance-none text-gray-600 w-full bg-white border border-gray-400 shadow-inner px-4 py-2 pr-8 rounded"
            >
               
              {branchList?.map(({ id, name }, key) => {
                return (
                  <option id={key} value={id}>
                    {name}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>

      {/* Actual Data Grid */}
      {console.log(listUpdate, "listUpdate")}
      <Box className="dark:text-navy-50">
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
                      No#
                    </th>
                    <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      {" "}
                      Name
                    </th>
                    <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      Start Date
                    </th>
                    <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      End Date
                    </th>
                    <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      Is Expired
                    </th>
                    <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      Created on
                    </th>
                    <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {customerList?.map((offerObj, index) => (
                    <tr class="border-y border-transparent border-b-slate-200 dark:border-b-navy-500">
                      <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                        {(pageRecordCount*(page-1))+index + 1}
                      </td>
                      <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                        {offerObj?.name}
                      </td>
                      <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                        {moment(offerObj?.startDate).format("MMMM DD, YYYY")}
                      </td>
                      <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                        {moment(offerObj?.endDate).format("MMMM DD, YYYY")}
                      </td>
                      <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                        {offerObj?.isExpired ? "Expired" : "Not Expired"}{" "}
                      </td>
                      <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                        {moment(offerObj?.createdAt).format("MMMM DD, YYYY")}
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
                                  .getElementById("pooper-" + offerObj.id)
                                  .classList.contains("show")
                              ) {
                                document
                                  .getElementById("pooper-" + offerObj.id)
                                  .classList.remove("show");
                              } else {
                                document
                                  .getElementById("pooper-" + offerObj.id)
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
                            id={"pooper-" + offerObj.id}
                            x-ref="popperRoot"
                            class="popper-root"
                          >
                            <div class="popper-box rounded-md border border-slate-150 bg-white py-1.5 font-inter dark:border-navy-500 dark:bg-navy-700">
                              <ul>
                                <li>
                                  <button
                                    class="flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-none transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                                    onClick={() => {
                                      API({
                                        method: "delete",
                                        url: `partner/offers/delete-offer/${offerObj?.branchId}/${offerObj?.id}`,
                                      })
                                        .then((resp) => {
                                         setListUpdate(!listUpdate);
                                          swal({
                                            title: "Thanks",
                                            text: resp[Object.keys(resp)[0]],
                                            icon: "success",
                                            button: "ok",
                                          });
                                          
                                          document
                                            .getElementById(
                                              "pooper-" + offerObj.id
                                            )
                                            .classList.remove("show");
                                        })
                                        .catch((err) => {
                                          document
                                            .getElementById(
                                              "pooper-" + offerObj.id
                                            )
                                            .classList.remove("show");
                                          swal({
                                            title: "Server Not Responding",
                                            text: "Please try again later",
                                            icon: "warning",
                                            button: "ok",
                                          });
                                        });
                                    }}
                                  >
                                    Delete
                                  </button>
                                </li>
                                <li>
                                  <button
                                    class="flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-none transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                                    onClick={() => {
                                         setisUpdate(true)
                                      setForUpdate(offerObj);
                                      setUpdateServiceId(offerObj?.serviceId)
                                      setFormValues({
                                        branchId: offerObj?.branchId,
                                        serviceId: offerObj?.serviceId,
                                        startDate: offerObj?.startDate,
                                        endDate: offerObj?.endDate,
                                        serviceName:offerObj?.service?.name,
                                        percentage: offerObj?.percentage,
                                        name: offerObj?.name,
                                        description: offerObj?.description,
                                        images:offerObj?.images
                                      });
                                      document
                                      .getElementById(
                                        "pooper-" + offerObj.id
                                      )
                                      .classList.remove("show");
                                      showPopup(true);
                                    }}
                                  >
                                    Edit
                                  </button>
                                </li>
                                <li>
                                  <button
                                    class="flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-none transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                                    onClick={()=>{
                                      document
                                      .getElementById(
                                        "pooper-" + offerObj.id
                                      )
                                      .classList.remove("show");
                                     modalShow();
                                     setOfferid(offerObj.id)
                                    }}  >
                                     Promote
                                  </button>
                                </li>
                              </ul>
                              <div class="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>
                            </div>
                           </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {customerList?.length == 0 && (
                <div class="m-2 text-center mt-4 pt-4">
                  <i class="fas fa-trophy fa-6x"></i>
                  <h2 class="text-2xl font-semibold">No Offers yet</h2>
                  <div class="m-2">
                    <p>Offers will appear here</p>
                  </div>
                </div>
              )}
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
                    {countOffer} entries
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
        <div className="max-w-lg mx-auto p-8 drop-shadow-2xl popup-box " style={{top:"9%"}}>
          <span
            className="popup-close-icon"
            onClick={() => {
              showPopup(false);
              setForUpdate({});
              setisUpdate(false)
            }}
          >
            x
          </span>
          <form className="space-x-6 p-6 text-left"  onSubmit={isUpdate ? handleUpdate : handleSubmit}>
            <label className="block" style={{ marginTop: "8px" }}>
              <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
                Name
              </span>
              <input
                required
                type="text"
                name="name"
                id="name"
                value={formValues.name}
                onChange={handleInputChange}
                className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                placeholder="Discount Name"
              />
            </label>
            <label className="" style={{ marginTop: "8px" }}>
              <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
                Percentage
              </span>
              <input
                required
                type="number"
                name="percentage"
                id="percentage"
                value={formValues.percentage}
                onChange={handleInputChange}
                className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                placeholder="Enter Percentage %"
              />
            </label>

            <label className="" style={{ marginTop: "8px" }}>
              <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
                Services
              </span>
              <select
                value={formValues.serviceId}
                onChange={handleInputChange}
                name="serviceId"
                className="block appearance-none text-gray-600 w-full bg-white border border-gray-400 shadow-inner px-4 py-2 pr-8 rounded">
                  <option className="block appearance-none text-gray-600 w-full" >
                      Select Service
                    </option> 
                  {(  formValues.serviceId !==0 && formValues?.serviceName) &&  <option selected="selected" id={99} value={formValues.serviceId}>
                 {formValues?.serviceName}
              </option>}
 
                {services?.map(({ id, name }, key) => {
                  return (
                    <>
                    {id==updateServiceId ?
                    <> 
                    <option className="block appearance-none text-gray-600 w-full" id={key} value={id}>
                      {name}
                    </option> </> :
                    <option  id={key} value={id}>
                    {name}
                  </option> 
                  }
                 </>) ;
                })}
              </select>
            </label>

            <label className="">
                <div className="mx-auto">
                  {uploadedImage ? (
                    <>
                      <div className="pb-2">Upload Image</div>
                      <img
                        className="border h-10 w-14 bg-slate-200"
                        src={uploadedImage}
                        alt="avatar"
                        onClick={() => setImageResizer(true)}
                      /> 
                    </>
                  ): formValues?.images[0]?.image  ?
                  
                  <>
                  <div className="pb-2">Upload Image</div>
                  <img
                    className="border h-10 w-14 bg-slate-200"
                    src={formValues?.images[0]?.image}
                    alt="avatar"
                    onClick={() => setImageResizer(true)}
                  />
                </>
                  
                  :(
                    <button
                      className="btn h-12 w-full   min-w-[7rem] border font-medium text-slate-800 bg-slate-150 focus:bg-slate-150 active:bg-slate-150/80 dark:border-navy-450 dark:text-navy-50 dark:hover:bg-navy-500 dark:focus:bg-navy-500 dark:active:bg-navy-500/90"
                      style={{ border: "dashed" }}
                      id="btn1"
                      alt="avatar"
                      onClick={(e) =>{e.preventDefault(); setImageResizer(true); }}
                    >
                      Add Upload Image
                    </button>
                  )} 
                </div>
              </label>

            <label
              className="block"
              style={{ marginLeft: "0px", marginTop: "8px" }}
            >
              <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
                Description
              </span>
              <textarea
                value={formValues.description}
                onChange={handleInputChange}
                required
                type="textarea"
                name="description"
                className="mt-1 h-14 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                placeholder="description"
                style={{border: "1px solid #949494"}}
              ></textarea>
            </label>
            
            <label
              className="block"
              style={{ marginLeft: "0px", marginTop: "8px" }}
            >
              <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
                Start Date
              </span>
              <input
                name="startDate"
                id="startDate"
                x-init="$el._x_flatpickr = flatpickr($el)"
                className="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                placeholder="Date."
                // onChange={handleInputChange}
                required
                type="text"
                value={isUpdate? formValues?.startDate?.split("T")[0]: ""}
                // value={isUpdate?moment(formValues.startDate).format("MMMM DD, YYYY"):""}
              />
              <span
                style={{ marginTop: "-30px" }}
                className="pointer-events-none absolute flex  w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 transition-colors duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </span>
            </label>

            <label
              className="block"
              style={{ marginLeft: "0px", marginTop: "8px" }} >
              <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
                End Date
              </span>
              <input
                name="endDate"
                x-init="$el._x_flatpickr = flatpickr($el)"
                className="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                placeholder="End Date."
                required
                type="text"
                id="endDate"
                value={isUpdate? formValues?.endDate?.split("T")[0]: ""}
              />
              <span
                style={{ marginTop: "-30px" }}
                className="pointer-events-none absolute flex  w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 transition-colors duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </span>
            </label>
            {/* <label className="block" style={{ marginLeft: '0px', marginTop:"20px" }}>
                <div style={{ marginLeft: "4px", marginTop: "15px", color: "black" }}  >
                  <legend>PaidPromotion</legend>
                    <input
                        name="isPaidPromotion"
                        value={"true"}
                        style={{ marginLeft: "10px", position: "relative", top: "2px" }}
                        className="form-checkbox is-outline h-5 w-5 rounded-full border-slate-400/70 before:bg-primary checked:border-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:before:bg-accent dark:checked:border-accent dark:hover:border-accent dark:focus:border-accent"
                        checked={formValues.isPaidPromotion }
                        onChange={handleInputChange}
                        id="isPaidPromotion"
                        required
                        type="radio"
                    />
                    {/* {formErrors.gender && (
                        <span className="text-red-error text-sm">{formErrors.gender}</span>
                    )} */}
            {/* </div>
            </label>   */}


         
            <button
             type="submit"
              className="btn mt-3 base-btn text-white bg-primary hover:bg-primary-focus focus:bg-primary-focus
              active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
              style={{
                float: "right",
                marginBottom: "16px",
              }}
            >
              {isUpdate? "Update Discount" : "Save Discounts"}
            </button>
          </form>
        </div>
      )}
        {imageResizer && (
        <ImageResize
          loader={loader}
          aspectRatio={1.5}
          imageModalClose={() => imageModalClose(false)}
          changeImage={changeImage}
          saveImageAdded={() => uploadImage(false)}
        />
      )}

{showMonthModal ? (
          <div
            class="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
            role="dialog"
          >
            <div
              class="absolute inset-0 bg-slate-900/60 backdrop-blur transition-opacity duration-300"
              id="showMonthModal"
              onClick={modalHide}
            ></div>
            <div class="relative w-full max-w-2xl origin-bottom rounded-lg bg-white pb-4 transition-all duration-300 dark:bg-navy-700">
              <div class="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
                <h3 class="text-base font-medium text-slate-700 dark:text-navy-100">
                  Select number of month
                </h3>
                <button
                  class="btn -mr-1.5 h-7 w-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                  id="showMonthModal"
                  onClick={modalHide}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4.5 w-4.5"
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

              <div class="is-scrollbar-hidden min-w-full overflow-x-auto">
              <span className="pb-3"> Payment For</span>
                 <input
                 style={{width:"94%", margin:"auto", display:"block"}}
                    className="mt-1.5 mx-3 mr-4 w-full rounded-lg border border-slate-300 bg-transparent  px-3 py-2"
                    id="category"
                    readOnly={true}
                   value="Featured Offer" /> 
              </div>
              <div class=" mt-3 is-scrollbar-hidden min-w-full overflow-x-auto">
              <span className="pb-3">Select Number of month</span>
                 <select
                 style={{width:"94%", margin:"auto", display:"block"}}
                    className="mt-1.5 mx-3 mr-4 w-full rounded-lg border border-slate-300 bg-transparent  px-3 py-2"
                    id="category"

                    onChange={(e) => { setMonths(e.target.value)}}>
                      <option value={0}>Select Number of month</option>
                      {Array.from([1,2,3,4,5,6,7,8,9,10,11,12]).map((month)=>{
                      return (<option value={month}>{month}</option>)})}
                  </select> 
              </div>
            
              <div class="is-scrollbar-hidden overflow-x-auto">
              <span className="pb-3">Total Calculated Payment</span>
                 <div
                 style={{ fontWeight:"bold"}}>
                   <h3>AED {parseInt(selectedMonth) * (1000)}</h3>
                   </div> 
              </div>
              
              <div class="text-center mt-2">
                
                <button
                  class="btn bg-primary btn-color from-sky-400 to-blue-600 font-medium text-white m-2"
                  id="showMonthModal"
                  onClick={modalHide}
                >
                  Close
                </button>
                <button
                  class="btn bg-primary btn-color from-sky-400 to-blue-600 font-medium text-white m-2"
                  onClick={promote}
                >
                  Pay Now
                </button>
                
              </div>
            </div>
          </div>
        ) : null}
    </div>
  );
};

export default Offers;
