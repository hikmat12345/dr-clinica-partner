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

const Reviews = () => {
   const [clients, setClients] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [inputValue, setInputValue] = useState('')
  const [totalPages, setTotalPages] = useState(1);
  const [page, setpage] = useState(1);
  const [customerCount, setCustomerCount] = useState(1);
  const [pageRecordCount, setPageRecordCount] = useState(8);
  const [popup, showPopup] = useState(false)
   const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gender: 'male',
    phone: '',
  })
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

  const [customerList, setcustomerList] = useState([])
  useEffect(() => {
    API({
      method: 'get',
      url: `partner/reviews/get-business-reviews?count=${pageRecordCount}&page=${page}&searchText=${searchText}`,
    }).then((response) => {
       setcustomerList(response.reviews.map((client, index) =>client ))
      const fields= Object.keys(response.reviews[0]).map((client, index) => {
        return {id:index, field: client, headerName: "Column "+index, width: 150 }
      })
      setClients(fields); 
      setTotalPages(Number(response?.totalPages))
       setPageRecordCount(Number(response?.pageRecordCount))
       setCustomerCount(response?.customersCount)
      setpage(Number(response?.page) ) 
    })
  }, [searchText])

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }))
  }
  const handleSubmit = (event) => {
    event.preventDefault()
    API({
      method: 'POST',
      url: 'partner/clients/create-customer',
      contentType: 'application/json',
      payload: JSON.stringify(formValues),
    }).then((res) => {
      if (res?.message == 'customer account created') {
        showPopup(false)
        swal({
          title: 'Thanks',
          text: res?.message,
          icon: 'success',
          button: 'ok',
        })
        setFormValues({
          firstName: '',
          lastName: '',
          email: '',
          gender: 'male',
          phone: '',
        })
      } else {
        swal({
          title: 'We are sorry.',
          text: res?.message,
          icon: 'warning',
          button: 'ok',
        })
      }
    })
  }

  const  onViewe=(bookingId)=>{
    // history(`/calendar/viewappointment/${bookingId}`)
}
 
const  handlePageChange = (e) => {
      e.preventDefault()
       API({
          method: 'get',
          url: `partner/reviews/get-business-reviews?count=${pageRecordCount}&page=${e.currentTarget.getAttribute('data-page')}&searchText=${searchText}`,
        }).then((response) => {
            setcustomerList(response.reviews.map((client, index) =>client ))
            setTotalPages(Number(response?.totalPages))
            setCustomerCount(response?.customersCount)
            setPageRecordCount(Number(response?.pageRecordCount))
            setpage(Number(response?.page))   
        }) 
  }
const pagination=()=>{
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
     )
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
       )
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
       )
     }
   }
 }

 const handleRecordCountChange = (e) => {
   e.preventDefault() 
    API({
        method: 'get',
        url: `partner/reviews/get-business-reviews?count=${e.currentTarget.value}&page=${page}&searchText=${searchText}`,
      }).then((response) => {
          setcustomerList(response.reviews.map((client, index) =>client ))
          setTotalPages(Number(response?.totalPages))
          setCustomerCount(response?.customersCount)
          setPageRecordCount(Number(response?.pageRecordCount))
          setpage(Number(response?.page))    
      }) 
   }
  
   return (
    <div className="main-content px-[var(--margin-x)] pb-8">
      <div className="flex items-center justify-between mt-5">
        <div className="flex items-start flex-col text-slate-800 dark:text-navy-50">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold lg:text-2xl">Reviews list</h2>
            <div className="border-2 border-gray-300 font-semibold px-[8px] rounded-full">
              <span className=" text-xs"></span>
            </div>
          </div>
          <div className="mt-2 hidden md:inline-flex items-center gap-1 font-medium text-base">
            <span>View, Service providers Reviews.</span>
            <span className="cursor-pointer text-sky-500">Learn more</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
{/*           
          <div className="text-right">
            <button
              onClick={() => showPopup(!popup)}
              className="btn base-btn bg-primary hover:bg-primary-focus focus:bg-primary-focus
               active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
            >
             add review
            </button>
          </div> */}
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
          </div> 
        </div>
      </div>

      {/* Actual Data Grid */}
     {console.log(customerList, 'customerList')}
      <Box className="dark:text-navy-50">
        {/* <StyledDataGrid className="customClass"> */}
        <div class="grid grid-cols-1 gap-4 sm:gap-5 mb-5 lg:grid-cols-1 lg:gap-6"> 
                <div class="card mt-3"  style={{marginBottom:"6rem"}}>
                <div class="is-scrollbar-hidden min-w-full overflow-x-auto" x-data="pages.tables.initExample1">
                   <table class="is-hoverable w-full text-left">
                    <thead>
                      <tr>
                        <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">No#</th>
                        <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Customer Name</th>
                        <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Branch Name</th>
                        <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Content</th>
                        <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Rating</th>


                        <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Created on</th>
                       </tr>
                    </thead>
                    <tbody>
                        {customerList.map((client, index) => ( 
                         <tr class="border-y border-transparent border-b-slate-200 dark:border-b-navy-500">
                            <td class="whitespace-nowrap px-4 py-3 sm:px-5">{ index+1 }</td>
                            <td class="whitespace-nowrap px-4 py-3 sm:px-5">{ client?.author?.firstname +" "+ client?.author?.lastname  }</td>
                             <td class="whitespace-nowrap px-4 py-3 sm:px-5">{ client?.subject?.name  }</td>

                              <td class="whitespace-nowrap px-4 py-3 sm:px-5">{ client?.content }</td>
                             <td class="whitespace-nowrap px-4 py-3 sm:px-5">{ client?.rating }.<i class="fas fa-star fa-1x"></i></td>
                            
                              <td class="whitespace-nowrap px-4 py-3 sm:px-5">{ moment(client?.createdAt).format('MMMM DD, YYYY')}</td>
                         </tr>
                        ))} 
                    </tbody>
                    </table>
                    {customerList?.length == 0 && (  <div class="m-2 text-center mt-4 pt-4">
                      <i class="fas fa-star fa-6x"></i>
                      <h2 class="text-2xl font-semibold">No Reviews yet</h2>
                      <div class="m-2">
                        <p>Reviews will appear here</p>
                      </div>
                    </div>)}
                    {customerList?.length !== 0 && ( <div class="flex flex-col justify-between space-y-4 px-4 py-4 sm:flex-row sm:items-center sm:space-y-0 sm:px-5">
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
                  {(page - 1) * pageRecordCount} -{' '}
                  {page * pageRecordCount} of{' '}
                  {customerCount} entries
                </div>
              </div>)}
                </div>
                </div>
            </div>
        {/* </StyledDataGrid> */}
      </Box>

      {/* popups  */}

      {popup && (
        <div className="max-w-lg mx-auto p-8 drop-shadow-2xl popup-box">
          <span className="popup-close-icon" onClick={() => showPopup(false)}>
            x
          </span>
          <form className="space-x-6 p-6 text-left">
            <label className="block"  style={{  marginTop:"20px" }}>
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
            <label className="" style={{  marginTop:"20px" }}>
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
            <label className="block" style={{ marginLeft: '0px', marginTop:"20px" }}>
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
            <label className="block" style={{ marginLeft: '0px', marginTop:"20px" }}>
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

            <div style={{ marginLeft: '4px', marginTop: "20px", color: "black" }}>
              <legend>Gender</legend>

              <input
                id="draft"
                className="peer/draft mt-2"
                type="radio"
                name="gender"
                value={'female'}
                checked={formValues.gender === 'female'}
                onChange={handleInputChange}

              />
              <label for="draft" className="peer-checked/draft:text-sky-500">
                Female
              </label>

              <input
                name="gender"
                value={'male'}
                style={{ marginLeft: "10px", position: "relative", top: "2px" }}
                className="peer/published ml-2"
                checked={formValues.gender === 'male'}
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
               className="btn base-btn bg-primary hover:bg-primary-focus focus:bg-primary-focus
              active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
              style={{
                float: 'right',
                marginBottom: '16px',
              }}
            >
              Save Client
            </button>
          </form>
        </div>
      )}


    </div>
  );
};

export default Reviews;
