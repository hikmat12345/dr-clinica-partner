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

const SoldVouchers = () => {
  const [page, setPage] = useState(1);
  const [vouchers, setVouchers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [records, setRecords] = useState(5);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchSoldVouchers = () => {
      axios({
        method: "get",
        url:
          configData.SERVER_URL +
          `partner/vouchers/getsoldvouchers/${page}/${records}`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          accesstoken: configData.ACCESSTOKEN,
          logintoken: localStorage.getItem("loginToken"),
        },
      })
        .then((response) => {
          if (vouchers.length === 0) {
            response.data.vouchersold.map((voucher) => {
              const voucherObject = {
                customerName: `${voucher.customer_customerTovouchersold.firstname} ${voucher.customer_customerTovouchersold.lastname}`,
                customerEmail: voucher.customer_customerTovouchersold.email,
                mobileNumber: voucher.customer_customerTovouchersold.phone,
                voucherTitle: voucher.vouchers.title,
                originalAmount: voucher.vouchers.value,
                paidAmount: voucher.amountpaid,
                availDate: voucher.customer_customerTovouchersold.registedon,
              };
              setVouchers([]);
              setVouchers((prevState) => [...prevState, voucherObject]);
            });
          } else {
            return vouchers;
          }
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

    fetchSoldVouchers();
  }, []);

  const gridColumns = [
    {
      field: "customerName",
      headerName: "Customer Name",
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
            {params.row.customerName}
          </div>
        );
      },
    },

    {
      field: "customerEmail",
      headerName: "Email",
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
          <div className="dark:text-navy-50 text-base">
            {params.row.customerEmail}
          </div>
        );
      },
    },

    {
      field: "mobileNumber",
      headerName: "Mobile Number",
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
            <span className="dark:text-navy-50">{params.row.mobileNumber}</span>
          </div>
        );
      },
    },

    {
      field: "voucherTitle",
      headerName: "Title",
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
          <span className="text-black dark:text-navy-50 text-base">
            {params.row.voucherTitle}
          </span>
        );
      },
    },

    {
      field: "originalAmount",
      headerName: "Original Amount",
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
          <div className="dark:text-navy-50 text-base">
            AED {params.row.originalAmount}
          </div>
        );
      },
    },

    {
      field: "paidAmount",
      headerName: "Paid Amount",
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
            {params.row.paidAmount}
          </span>
        );
      },
    },

    {
      field: "availDate",
      headerName: "Avail Date",
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
            {params.row.availDate}
          </span>
        );
      },
    },
  ];

  const handleExportToExcel = () => {
    ExportToExcel(vouchers, "VoucherSheet");
    setShowDropdown(false);
  };

  return (
    <div className="main-content px-[var(--margin-x)] pb-10">
      <div className="flex justify-between mt-6">
        <div className="flex items-start flex-col text-slate-800 dark:text-navy-50">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold md:text-3xl">Vouchers sold</h2>
          </div>
          <div className="mt-2 md:inline-flex items-center font-medium text-md md:text-base">
            <span>
              View, filter and export vouchers purchased by your clients.
            </span>
            <span className="cursor-pointer text-sky-500 ml-1">Learn more</span>
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
              <ul className="bg-white absolute top-14 min-w-[156px] text-center border-[1px] border-slate-400 rounded">
                <li className="base-btn hover:bg-gray-200 dark:text-navy-50 cursor-pointer">
                  <a href="/services/vouchers">
                    <span className="text-black  font-medium">
                      Manage vouchers
                    </span>
                  </a>
                </li>

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
      <div className="bg-slate-200 p-4 lg:p-5 rounded-lg mt-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex flex-auto items-center gap-3 w-[320px] lg:w-[380px] px-3 py-2 border-[1px]
             border-gray-400 rounded-full bg-white"
            >
              <HiMagnifyingGlass className="text-black font-bold h-4 w-4 lg:w-5 lg:h-5 cursor-pointer" />
              <input
                className="outline-none text-sm lg: bg-transparent flex-auto"
                type="text"
                placeholder="Search by name, email or mobile number"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>

            <button className="icon-btn dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90">
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
            </button>
          </div>
        </div>
      </div>

      {/* Actual Data Grid */}
      <Grid gridData={vouchers} gridColumns={gridColumns} />
    </div>
  );
};

export default SoldVouchers;
