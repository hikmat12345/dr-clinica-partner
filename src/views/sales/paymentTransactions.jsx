import { useEffect, useState } from "react";
import axios from "axios";
import swal from "sweetalert";
import {
  HiBarsArrowDown,
  HiAdjustmentsVertical,
  HiMagnifyingGlass,
  HiChevronDown,
} from "react-icons/hi2";

import configData from "../../utils/constants/config.json";
import Grid from "../../components/Grid";
import { ExportToExcel } from "../../utils/helpers/utilityFunctions";

const PaymentTransactions = () => {
  const [page, setPage] = useState(1);
  const [transactions, setTransactions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [records, setRecords] = useState(5);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchPaymentTransactions = () => {
      axios({
        method: "get",
        url:
          configData.SERVER_URL +
          `partner/sales/getbookingpayments/${page}/${records}?searchText=${searchText}`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          accesstoken: configData.ACCESSTOKEN,
          logintoken: localStorage.getItem("loginToken"),
        },
      })
        .then((response) => {
          
          const transactiondata=  response.data.bookingpayment.map((transaction) => {
              const transactionObject = {
                paymentDate: transaction.bookings.createdon,
                paymentRef: transaction.bookings.paymentref,
                client: `${transaction.bookings.customer_bookingsTocustomer.firstname} ${transaction.bookings.customer_bookingsTocustomer.lastname}`,
                email: transaction.bookings.customer_bookingsTocustomer.email,
                mobileNumber:
                  transaction.bookings.customer_bookingsTocustomer.phone,
                paymentMethod: transaction.bookings.mop,
                amount: transaction.bookings.bill,
              };
              return transactionObject
              // setTransactions([]);
            });
            setTransactions(transactiondata);
           
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

    fetchPaymentTransactions();
  }, [searchText]);

  const handleExportToExcel = () => {
    ExportToExcel(transactions, "TransactionSheet");
    setShowDropdown(false);
  };

  const gridColumns = [
    {
      field: "paymentDate",
      headerName: "Payment Date",
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
            {params.row.paymentDate}
          </div>
        );
      },
    },

    {
      field: "paymentRef",
      headerName: "Ref",
      flex: 0.4,
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
            {params.row.paymentRef}
          </div>
        );
      },
    },

    {
      field: "client",
      headerName: "Client",
      flex: 0.6,
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
            <span className="dark:text-navy-50">{params.row.client}</span>
          </div>
        );
      },
    },

    {
      field: "email",
      headerName: "Email",
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
          <span className="text-black dark:text-navy-50 text-base">
            {params.row.email}
          </span>
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

    {
      field: "paymentMethod",
      headerName: "Method",
      flex: 0.5,
      renderHeader: (params) => {
        return (
          <span className="font-bold dark:text-navy-50 text-base">
            {params?.colDef?.headerName}
          </span>
        );
      },
      renderCell: (params) => {
        return (
          <span className="dark:text-navy-50 text-base">
            {params.row.paymentMethod}
          </span>
        );
      },
    },

    {
      field: "amount",
      headerName: "Amount",
      flex: 0.4,
      renderHeader: (params) => {
        return (
          <span className="font-bold dark:text-navy-50 text-base">
            {params?.colDef?.headerName}
          </span>
        );
      },
      renderCell: (params) => {
        return (
          <span className="dark:text-navy-50 text-base">
            AED {params.row.amount}
          </span>
        );
      },
    },
  ];

  return (
    <div className="main-content px-[var(--margin-x)] pb-8">
      <div className="flex items-center justify-between mt-5">
        <div className="flex items-start flex-col text-slate-800 dark:text-navy-50">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold md:text-3xl">
              Payment transactions
            </h2>
          </div>
          <div className="mt-2 md:inline-flex items-center gap-1 font-medium md:text-base text-md">
            <span>View, filter, and share the history of your payments.</span>
          </div>
        </div>

        <div className="hidden md:inline-flex items-center justify-between gap-3">
          <div className="flex flex-col justify-center items-end relative">
            <button
              onClick={() => setShowDropdown((prevState) => !prevState)}
              className="btn border-[1px] border-gray-400 flex item-center gap-2
                base-btn  hover:bg-gray-200 dark:text-navy-50"  style={{backgroundColor: "#b9b9b947"}}
            >
              <span className="text-black font-bold">Options</span>
              <HiChevronDown className="mt-1 text-black font-bolder" />
            </button>

            {/* Menu Options */}
            {showDropdown && (
              <ul className="bg-white absolute top-14 min-w-[140px] text-center border-[1px] border-slate-400 rounded">
                <li
                  onClick={() => handleExportToExcel()}
                  className="base-btn hover:bg-gray-200 dark:text-navy-50 cursor-pointer"
                >
                  <span className="text-black font-medium">
                    Export as Excel
                  </span>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Data Grid and Search Element */}
      {/* <div className="bg-slate-200 p-4 lg:p-5 rounded-lg mt-10">
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
            </div> */}

            {/* <button className="icon-btn dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90">
              <span className="hidden md:inline-flex text-slate-800 dark:text-navy-50 font-bold text-sm lg:text-base">
                12 Feb, 2023 - 14 March, 2023
              </span>
              <HiBarsArrowDown className="md:hidden text-black dark:text-navy-50 lg:h-6 lg:w-6 w-5 h-5" />
            </button>

            <button className="icon-btn px-5 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90">
              <span className="hidden md:inline-flex text-slate-800 dark:text-navy-50 font-bold text-sm lg:text-base">
                Filters
              </span>
              <HiAdjustmentsVertical className="text-black dark:text-navy-50 lg:h-6 lg:w-6 w-5 h-5" />
            </button> */}
          {/* </div>
        </div>
      </div> */}
        {console.log(transactions, 'transactions')}
      {/* Actual Data Grid */}
      <Grid gridData={transactions} gridColumns={gridColumns} />
    </div>
  );
};

export default PaymentTransactions;
