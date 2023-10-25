import React from "react";
import swal from "sweetalert";
import axios from "axios";
import configData from "../../utils/constants/config.json";
import { HiChevronDown } from "react-icons/hi2";

import { ExportToExcel } from "../../utils/helpers/utilityFunctions";
import { Link } from "react-router-dom";

export default class TeamMember extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tacbleAction: "popper-root",
      teammembers: [],
      page: 1,
      teammemberCount: 0,
      pageRecordCount: 5,
      totalPages: 0,
      showDropdown: false,
    };
  }

  componentDidMount() {
    document.body.classList.add("is-sidebar-open")
    axios({
      method: "get",
      url:
        configData.SERVER_URL +
        "partner/team/getTeamMembers/1/" +
        this.state.pageRecordCount,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        accesstoken: configData.ACCESSTOKEN,
        logintoken: localStorage.getItem("loginToken"),
      },
    })
      .then((resp) => {
        console.log(resp.data);
        if (parseInt(Object.keys(resp.data)[0]) === 200) {
          this.setState({
            teammembers: resp.data.teammember,
            page: resp.data.page,
            teammemberCount: resp.data.teammemberCount,
            pageRecordCount: resp.data.pageRecordCount,
            totalPages: resp.data.totalPages,
          });
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
  }

  handlePageChange = (e) => {
    e.preventDefault();
    axios({
      method: "get",
      url:
        configData.SERVER_URL +
        "partner/team/getTeamMembers/" +
        e.currentTarget.getAttribute("data-page") +
        "/" +
        this.state.pageRecordCount,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        accesstoken: configData.ACCESSTOKEN,
        logintoken: localStorage.getItem("loginToken"),
      },
    })
      .then((resp) => {
        console.log(resp.data);
        if (parseInt(Object.keys(resp.data)[0]) === 200) {
          this.setState({
            teammembers: resp.data.teammember,
            page: resp.data.page,
            teammemberCount: resp.data.teammemberCount,
            pageRecordCount: resp.data.pageRecordCount,
            totalPages: resp.data.totalPages,
          });
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

  handleRecordCountChange = (e) => {
    e.preventDefault();
    axios({
      method: "get",
      url:
        configData.SERVER_URL +
        "partner/team/getTeamMembers/" +
        this.state.page +
        "/" +
        e.currentTarget.value,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        accesstoken: configData.ACCESSTOKEN,
        logintoken: localStorage.getItem("loginToken"),
      },
    })
      .then((resp) => {
        console.log(resp.data);
        if (parseInt(Object.keys(resp.data)[0]) === 200) {
          this.setState({
            teammembers: resp.data.teammember,
            page: resp.data.page,
            teammemberCount: resp.data.teammemberCount,
            pageRecordCount: resp.data.pageRecordCount,
            totalPages: resp.data.totalPages,
          });
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

  onToggletableAction = (e) => {
    if (this.state.tacbleAction == "popper-root") {
      this.setState({
        tacbleAction: "popper-root show",
      });
    } else {
      this.setState({
        tacbleAction: "popper-root",
      });
    }
  };

  pagination() {
    if (this.state.page == 1) {
      return (
        <ol class="pagination">
          <li class="bg-slate-150 dark:bg-navy-500">
            <button
              data-page="1"
              onClick={this.handlePageChange}
              class="flex h-8 min-w-[2rem] items-center justify-center rounded-lg bg-primary px-3 leading-tight text-white transition-colors hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
            >
              1
            </button>
          </li>
          {this.state.totalPages > 1 ? (
            <li class="bg-slate-150 dark:bg-navy-500">
              <button
                data-page="2"
                onClick={this.handlePageChange}
                class="flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-3 leading-tight transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
              >
                2
              </button>
            </li>
          ) : null}
          <li class="rounded-r-lg bg-slate-150 dark:bg-navy-500">
            <button
              data-page={this.state.totalPages}
              onClick={this.handlePageChange}
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
      if (this.state.page == this.state.totalPages) {
        return (
          <ol class="pagination">
            <li class="rounded-l-lg bg-slate-150 dark:bg-navy-500">
              <button
                data-page="1"
                onClick={this.handlePageChange}
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
                data-page={parseInt(this.state.page) - 1}
                onClick={this.handlePageChange}
                class="flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-3 leading-tight transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
              >
                {parseInt(this.state.page) - 1}
              </button>
            </li>
            <li class="bg-slate-150 dark:bg-navy-500">
              <button
                data-page={this.state.page}
                onClick={this.handlePageChange}
                class="flex h-8 min-w-[2rem] items-center justify-center rounded-lg bg-primary px-3 leading-tight text-white transition-colors hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
              >
                {this.state.page}
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
                onClick={this.handlePageChange}
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
                data-page={parseInt(this.state.page) - 1}
                onClick={this.handlePageChange}
                class="flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-3 leading-tight transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
              >
                {parseInt(this.state.page) - 1}
              </button>
            </li>
            <li class="bg-slate-150 dark:bg-navy-500">
              <button
                data-page={this.state.page}
                onClick={this.handlePageChange}
                class="flex h-8 min-w-[2rem] items-center justify-center rounded-lg bg-primary px-3 leading-tight text-white transition-colors hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
              >
                {this.state.page}
              </button>
            </li>
            <li class="bg-slate-150 dark:bg-navy-500">
              <button
                data-page={parseInt(this.state.page) + 1}
                onClick={this.handlePageChange}
                class="flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-3 leading-tight transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
              >
                {parseInt(this.state.page) + 1}
              </button>
            </li>
            <li class="rounded-r-lg bg-slate-150 dark:bg-navy-500">
              <button
                data-page={this.state.totalPages}
                onClick={this.handlePageChange}
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
  }

  handleToogleOptionMenu = () => {
    this.setState((prevState) => ({
      ...prevState,
      showDropdown: !prevState.showDropdown,
    }));
  };

  handleExportToExcel = () => {
    ExportToExcel(this.state.teammembers, "TeamMembersSheet");
    this.setState((prevState) => ({
      ...prevState,
      showDropdown: false,
    }));
  };

  render() {
    return (
      <main class="main-content px-[var(--margin-x)] pb-8">
        <div class="items-center justify-between">
          <div class="flex items-center space-x-4 py-5 lg:py-6">
            <h2 class="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">
              Service Provider
            </h2>
            <div class="hidden h-full py-1 sm:flex">
              <div class="h-full w-px bg-slate-300 dark:bg-navy-600"></div>
            </div>
            <ul class="hidden flex-wrap items-center space-x-2 sm:flex">
              <li class="flex items-center space-x-2">
                <a
                  class="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent"
                  href="/settings"
                >
                  Settings
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
              <li>Service Provider List</li>
            </ul>
          </div>
          <div class="flex items-center -mt-2 justify-end gap-3">
            <div className="flex flex-col justify-center items-end relative">
              <button
                onClick={() => this.handleExportToExcel()}
                className="btn border-[1px] border-gray-400 flex item-center gap-2
                base-btn  hover:bg-gray-200 dark:text-navy-50" style={{backgroundColor: "#b9b9b947"}}
              >
                <span className="text-black font-bold"> Export as Excel</span>
                {/* <HiChevronDown className="mt-1 text-black font-bolder" /> */}
              </button>

              {/* Menu Options */}
              {this.state.showDropdown && (
                <ul className="bg-white z-10 absolute top-14 min-w-[140px] text-center border-[1px] border-slate-400 rounded">
                  <li
                    onClick={() => this.handleExportToExcel()}
                    className="base-btn hover:bg-gray-200 dark:text-navy-50 cursor-pointer"
                  >
                    <span className="text-black font-medium">
                      Export as Excel
                    </span>
                  </li>
                </ul>
              )}
            </div>
            <Link
              to="/team/addnewteammember"
              class="btn base-btn bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
            >
              Add New
            </Link>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 mt-1 sm:gap-5 lg:gap-6">
          <div>
            <div class="flex items-center justify-between">
              <h2 class="text-base font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">
                Service Provider List
              </h2>
            </div>
            <div class="card mt-3">
              <div
                class="is-scrollbar-hidden min-w-full overflow-x-auto"
                x-data="pages.tables.initExample1"
              >
                <table class="is-hoverable w-full text-left">
                  <thead>
                    <tr>
                      <th class="whitespace-nowrap rounded-tl-lg bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        #
                      </th>
                      <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Image
                      </th>
                      <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Title
                      </th>
                      <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Name
                      </th>
                      <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Email
                      </th>
                      <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Phone #
                      </th>
                      <th class="whitespace-nowrap rounded-tr-lg bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.teammembers.map((teammember, index) => (
                      <tr class="border-y border-transparent border-b-slate-200 dark:border-b-navy-500">
                        <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                          {teammember.id}
                        </td>
                        <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                          <div class="avatar flex">
                            <img
                              class="rounded-full"
                              src={teammember.profileimage}
                              alt={
                                teammember.firstname + " " + teammember.lastname
                              }
                            />
                          </div>
                        </td>
                        <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                          {teammember.title}
                        </td>
                        <td class="whitespace-nowrap px-3 py-3 font-medium text-slate-700 dark:text-navy-100 lg:px-5">
                          {teammember.firstname} {teammember.lastname}
                        </td>
                        <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                          {teammember.email}
                        </td>
                        <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                          {teammember.phone}
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
                                    .getElementById("pooper-" + teammember.id)
                                    .classList.contains("show")
                                ) {
                                  document
                                    .getElementById("pooper-" + teammember.id)
                                    .classList.remove("show");
                                } else {
                                  document
                                    .getElementById("pooper-" + teammember.id)
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
                              id={"pooper-" + teammember.id}
                              x-ref="popperRoot"
                              class="popper-root"
                            >
                              <div class="popper-box rounded-md border border-slate-150 bg-white py-1.5 font-inter dark:border-navy-500 dark:bg-navy-700">
                                <ul>
                                  <li>
                                    <button
                                      class="flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-none transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                                      onClick={() => {
                                        localStorage.setItem(
                                          "selectedteammember",
                                          teammember.id
                                        );
                                        window.location =
                                          "/team/editteammember";
                                      }}
                                    >
                                      Edit
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      class="flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-none transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                                      onClick={() => {
                                        axios({
                                          method: "delete",
                                          url:
                                            configData.SERVER_URL +
                                            "partner/team/deleteTeamMemberDetails/" +
                                            this.state.page +
                                            "/" +
                                            this.state.pageRecordCount +
                                            "/" +
                                            teammember.id,
                                          headers: {
                                            "Content-Type":
                                              "application/x-www-form-urlencoded",
                                            accesstoken: configData.ACCESSTOKEN,
                                            logintoken:
                                              localStorage.getItem(
                                                "loginToken"
                                              ),
                                          },
                                        })
                                          .then((resp) => {
                                            document
                                              .getElementById(
                                                "pooper-" + teammember.id
                                              )
                                              .classList.remove("show");
                                            if (
                                              parseInt(
                                                Object.keys(resp.data)[0]
                                              ) === 200
                                            ) {
                                              this.setState({
                                                teammembers:
                                                  resp.data.teammember,
                                                page: resp.data.page,
                                                teammemberCount:
                                                  resp.data.teammemberCount,
                                                pageRecordCount:
                                                  resp.data.pageRecordCount,
                                                totalPages:
                                                  resp.data.totalPages,
                                              });
                                            }
                                          })
                                          .catch((err) => {
                                            document
                                              .getElementById(
                                                "pooper-" + teammember.id
                                              )
                                              .classList.remove("show");
                                            swal({
                                              title: "Server Not Responding",
                                              text: "Please try again later",
                                              icon: "warning",
                                              button: "ok",
                                            });
                                            console.log(err);
                                          });
                                      }}
                                    >
                                      Delete
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
              </div>

              <div class="flex flex-col justify-between space-y-4 px-4 py-4 sm:flex-row sm:items-center sm:space-y-0 sm:px-5">
                <div class="flex items-center space-x-2 text-xs+">
                  <span>Show</span>
                  <label class="block">
                    <select
                      onChange={this.handleRecordCountChange}
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

                {this.pagination()}

                <div class="text-xs+">
                  {(this.state.page - 1) * this.state.pageRecordCount} -{" "}
                  {this.state.page * this.state.pageRecordCount} of{" "}
                  {this.state.servicesCount} entries
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}
