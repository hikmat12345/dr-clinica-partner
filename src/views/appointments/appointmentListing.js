import React, { useEffect, useState } from "react";
import swal from "sweetalert";
import axios from "axios";
import configData from "../../utils/constants/config.json";
import moment from "moment";
import axiosClient from "../../utils/helpers/server";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../../Pages/AddAppointment/API";
import { getDurationInMinutes } from "../../utls";

export default function AppoitmentListing() {
  const [tacbleAction, setTacbleAction] = useState("popper-root");
  const [appointments, setAppointments] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedPrefix, setSelectedPrefix] = useState("");
  const [selectedNextNo, setSelectedNextNo] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setpage] = useState(1);
  const [totalAppointment, setTotalAppointment] = useState(1);
  const [pageRecordCount, setPageRecordCount] = useState(8);
  const [changedFlag, setchangedFlag] = useState(false);
  const [editReceiptingSequence, setEditReceiptingSequence] = useState(false);
  const history = useNavigate();

  useEffect(() => {
    document.body.classList.add("is-sidebar-open")
    axios({
      method: "get",
      url: `${configData.SERVER_URL}partner/appointment/listingAppointmentApi/?count=${pageRecordCount}&page=${page}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        accesstoken: configData.ACCESSTOKEN,
        logintoken: localStorage.getItem("loginToken"),
      },
    })
      .then((resp) => {
        setAppointments(resp.data.appointment);
        setTotalPages(Number(resp.data.totalPages));
        setTotalAppointment(resp.data.appointmentCount);
        setPageRecordCount(Number(resp?.data?.recordCount));
        setpage(Number(resp?.data?.page));
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
  }, [changedFlag]);

  const onToggletableAction = (e) => {
    if (tacbleAction === "popper-root") {
      setTacbleAction("popper-root show");
    } else {
      setTacbleAction("popper-root");
    }
  };

  const handlePageChange = (e) => {
    e.preventDefault();
    // setState({ loader: true })

    axiosClient
      .get(
        `partner/appointment/listingAppointmentApi/?count=${pageRecordCount}&page=${e.currentTarget.getAttribute(
          "data-page"
        )}`
      )
      .then((resp) => {
        setAppointments(
          resp.data?.appointment?.filter((obj) => obj.status !== 5)
        );
        setTotalPages(Number(resp.data.totalPages));
        setTotalAppointment(resp.data.appointmentCount);
        setPageRecordCount(Number(resp?.data?.recordCount));
        setpage(Number(resp?.data?.page));
      })
      .catch((err) => {
        swal({
          title: "Server Not Responding",
          text: "Please try again later",
          icon: "warning",
          button: "ok",
        });
      });
  };
  const appointmentStatus = (statusCode) => {
    switch (statusCode) {
      case 0:
        return (
          <span
            style={{
              backgroundColor: "#f44294",
              color: "black",
              padding: "3px 10px",
              borderRadius: "30px ",
            }}
          >
            Unconfirmed
          </span>
        );
      case 1:
        return (
          <span
            style={{
              backgroundColor: "#d8feff",
              color: "#00516c",
              padding: "3px 10px",
              borderRadius: "30px ",
            }}
          >
            Confirmed
          </span>
        );
      case 2:
        return (
          <span
            style={{
              backgroundColor: "#fbffd2",
              color: "#b7c100",
              padding: "3px 10px",
              borderRadius: "30px ",
            }}
          >
            No Show
          </span>
        );
      case 3:
        return (
          <span
            style={{
              backgroundColor: "#ffcaca",
              color: "#ff0a0a",
              padding: "3px 10px",
              borderRadius: "30px ",
            }}
          >
            Cancelled
          </span>
        );
      case 4:
        return (
          <span
            style={{
              backgroundColor: "#f1d0ff",
              color: "#a253c4",
              padding: "3px 10px",
              borderRadius: "30px ",
            }}
          >
            CheckedIn
          </span>
        );
      case 5:
        return (
          <span
            style={{
              backgroundColor: "rgb(22 163 74 / 0.2)",
              color: "green",
              padding: "3px 10px",
              borderRadius: "30px ",
            }}
          >
            Completed
          </span>
        );
      default:
        return (
          <span
            style={{
              backgroundColor: "#ffdfc6",
              color: "#e56300",
              padding: "3px 10px",
              borderRadius: "30px ",
            }}
          >
            fixed
          </span>
        );
    }
  };
  const onViewe = (bookingId, bookingStatus) => {
    history(`/calendar/viewappointment/${bookingId}?isFromListing=true`);
  };
  const reschedule = (bookingId, date, durationInMinutes, cusid, teamMid) => {
   history(`/calendar?bookingId=${bookingId}&selectedDate=${date}&durvalue=${durationInMinutes}&customerId=${cusid}&teammemeber=${teamMid}`);
  };

  const cancelAppointment = (bookingId) => {
    API({
      method: "put",
      url: `partner/appointment/updateStatus/${bookingId}`,
      payload: JSON.stringify({ status: "Cancelled" }),
    }).then((res) => {
      document.getElementById("pooper-" + bookingId).classList.remove("show");
      setchangedFlag(!changedFlag);
    });
  };
  const noShowAppointment = (bookingId, date) => {
    API({
      method: "put",
      url: `partner/appointment/updateStatus/${bookingId}`,
      payload: JSON.stringify({ status: "Unattended" }),
    }).then((res) => {
      document.getElementById("pooper-" + bookingId).classList.remove("show");
      setchangedFlag(!changedFlag);
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
    axios({
      method: "get",
      url:
        configData.SERVER_URL +
        `partner/appointment/listingAppointmentApi/?count=${e.currentTarget.value}&page=${page}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        accesstoken: configData.ACCESSTOKEN,
        logintoken: localStorage.getItem("loginToken"),
      },
    })
      .then((resp) => {
        setAppointments(
          resp.data?.appointment?.filter((obj) => obj.status !== 5)
        );
        setTotalPages(Number(resp.data.totalPages));
        setPageRecordCount(Number(resp?.data?.recordCount));
        setpage(Number(resp?.data?.page));
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
    <main class="main-content px-[var(--margin-x)] pb-8">
      <div class="items-center justify-between">
        <div class="flex items-center space-x-4 py-5 lg:py-6">
          <h2 class="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">
            Appointments
          </h2>
          <div class="hidden h-full py-1 sm:flex">
            <div class="h-full w-px bg-slate-300 dark:bg-navy-600"></div>
          </div>
          <ul class="hidden flex-wrap items-center space-x-2 sm:flex">
            <li class="flex items-center space-x-2">
              <a
                class="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent"
                href="/sales/invoicsequencing"
              ></a>
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
            <li>Appointments List</li>
          </ul>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6">
        <div>
          <div class="flex items-center justify-between">
            <h2 class="text-base font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">
              Appointments List
            </h2>
          </div>
          <div class="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-1 lg:gap-6">
            <div class="card mt-3">
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
                      {/* <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Branch
                      </th> */}
                      <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Date
                      </th>
                      <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Start Time
                      </th>
                      <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Client Name
                      </th>
                      <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Provider Name
                      </th>
                      <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Service Name
                      </th>
                      <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Appointment status
                      </th>
                      <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((branch) => (
                      <tr class="border-y border-transparent border-b-slate-200 dark:border-b-navy-500">
                        <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                          {branch.id}
                        </td>
                        {/* <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                          {branch.branch}
                        </td> */}
                        <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                          {moment(branch.date).format("MMMM DD, YYYY")}
                        </td>
                        <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                          {branch.starttime}
                        </td>
                        <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                          {branch.customer_bookingsTocustomer?.firstname}
                        </td>
                        <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                          {branch.teammember?.firstname}
                        </td>
                        <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                          {branch.service_bookingsToservice?.name}
                        </td>
                        <td class="whitespace-nowrap px-4 py-3 sm:px-5 text-center">
                          {appointmentStatus(branch?.status)}
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
                                    .getElementById("pooper-" + branch.id)
                                    .classList.contains("show")
                                ) {
                                  document
                                    .getElementById("pooper-" + branch.id)
                                    .classList.remove("show");
                                } else {
                                  document
                                    .getElementById("pooper-" + branch.id)
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
                              id={"pooper-" + branch.id}
                              x-ref="popperRoot"
                              class="popper-root"
                            >
                              <div class="popper-box rounded-md border border-slate-150 bg-white py-1.5 font-inter dark:border-navy-500 dark:bg-navy-700">
                                <ul>
                                  {/* view  */}
                                 <li>
                                    <button
                                      onClick={() =>
                                        onViewe(branch.id)
                                      }
                                      class="flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-none transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                                      id="editClosingDateModal" >
                                      View
                                    </button>
                                  </li>
                                  {/* now show  */}
                                  {branch.status ==3 || branch.status ==5 || branch.status ==2 ? "":
                                  <li>
                                    <button
                                      onClick={() =>
                                        noShowAppointment(branch.id)
                                      }
                                      class="flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-none transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                                      id="editClosingDateModal"
                                    >
                                      No-Show
                                    </button>
                                  </li>}
                                  {/* cancel  */}
                                  {branch.status ==3 || branch.status ==5 ? 
                                  "":
                                  <li>
                                    <button
                                      onClick={() =>
                                        cancelAppointment(
                                          branch.status,
                                          moment(branch.date).format(
                                            "MMMM DD YYYY"
                                          )
                                        )
                                      }
                                      class="flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-none transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                                      id="editClosingDateModal"
                                    >
                                      Cancel
                                    </button>
                                  </li>}
                                  {/* reschedule */}
                                  {(branch.status !==5 && branch.status !==3) ?
                                  <li>
                                    <button
                                      onClick={() =>
                                        reschedule(
                                          branch.id,
                                          branch.date,
                                          getDurationInMinutes(
                                            branch.starttime,
                                            branch.endtime
                                          ),
                                          branch.customer,
                                          branch.serviceprovider
                                        )
                                      }
                                      class="flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-none transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                                      id="editClosingDateModal"
                                    >
                                      Reschedule
                                    </button>
                                  </li>:""}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {appointments?.length !== 0 && (
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
                      {(page - 1) * pageRecordCount} - {page * pageRecordCount}{" "}
                      of {totalAppointment} entries
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
