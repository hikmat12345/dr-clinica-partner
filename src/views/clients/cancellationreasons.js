import React from "react";
import swal from "sweetalert";
import axios from "axios";
import configData from "../../utils/constants/config.json";

export default class CancellationReasons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cancellationreasons: [],
      addNewCancellationReason: false,
      editCancellationReason: false,
      selectedCalcellationReason: null,
      reason: "",
      isdefault: false,
      editreason: "",
      editisdefault: false,
    };
  }

  componentDidMount() {
    axios({
      method: "get",
      url: configData.SERVER_URL + "partner/clients/getcancellationreason",
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
            cancellationreasons: resp.data.cancellationreasons,
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

  modalShow = (e) => {
    e.preventDefault();
    this.setState({
      [e.currentTarget.id]: true,
    });
  };

  modalHide = (e) => {
    e.preventDefault();
    this.setState({
      [e.currentTarget.id]: false,
    });
  };

  addNewCancellationReason = (e) => {
    e.preventDefault();
    console.log(this.state);
    if (this.state.name === "") {
      document.getElementById("name").focus();
      return;
    }
    var bodyFormData = new URLSearchParams();
    bodyFormData.append("reason", this.state.reason);
    bodyFormData.append("isdefault", this.state.isdefault);
    axios({
      method: "post",
      url: configData.SERVER_URL + "partner/clients/createcancellationreason",
      data: bodyFormData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        accesstoken: configData.ACCESSTOKEN,
        logintoken: localStorage.getItem("loginToken"),
      },
    })
      .then((resp) => {
        if (parseInt(Object.keys(resp.data)[0]) === 200) {
          if (this.state.isdefault) {
            this.state.cancellationreasons.forEach((cancellationreason) => {
              cancellationreason.isdefault = false;
            });
          }
          this.setState({
            cancellationreasons: [
              ...this.state.cancellationreasons,
              resp.data.cancellationreason,
            ],
            addNewCancellationReason: false,
          });
        } else {
          swal({
            title: "Service Information",
            text: resp.data[Object.keys(resp.data)[0]],
            icon: "warning",
            button: "ok",
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

  editPaymentType = (cancellationreason) => (e) => {
    e.preventDefault();
    if (cancellationreason.isdefault) {
      return;
    }
    this.setState({
      selectedCalcellationReason: cancellationreason,
      editreason: cancellationreason.message,
      editisdefault: cancellationreason.isdefault,
      editCancellationReason: true,
    });
  };

  saveEditCancellationReason = (e) => {
    e.preventDefault();
    var bodyFormData = new URLSearchParams();
    bodyFormData.append("id", this.state.selectedCalcellationReason.id);
    bodyFormData.append("reason", this.state.editreason);
    bodyFormData.append("isdefault", this.state.editisdefault);
    axios({
      method: "post",
      url: configData.SERVER_URL + "partner/clients/updatecancellationreason",
      data: bodyFormData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        accesstoken: configData.ACCESSTOKEN,
        logintoken: localStorage.getItem("loginToken"),
      },
    })
      .then((resp) => {
        if (parseInt(Object.keys(resp.data)[0]) === 200) {
          if (this.state.editisdefault) {
            this.state.cancellationreasons.forEach((cancellationreason) => {
              cancellationreason.isdefault = false;
            });
          }
          this.state.selectedCalcellationReason.message = this.state.editreason;
          this.state.selectedCalcellationReason.isdefault =
            this.state.editisdefault;
          this.setState({
            selectedCalcellationReason: this.state.selectedCalcellationReason,
            editCancellationReason: false,
          });
        } else {
          swal({
            title: "Service Information",
            text: resp.data[Object.keys(resp.data)[0]],
            icon: "warning",
            button: "ok",
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

  render() {
    return (
      <main class="main-content px-[var(--margin-x)] pb-8 mt-15">
        <div class="items-center justify-between">
          <div class="flex items-center space-x-4 py-5 lg:py-6">
            <h2 class="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">
              Cancellation Reasons
            </h2>
            <div class="hidden h-full py-1 sm:flex">
              <div class="h-full w-px bg-slate-300 dark:bg-navy-600"></div>
            </div>
            <ul class="hidden flex-wrap items-center space-x-2 sm:flex">
              <li class="flex items-center space-x-2">
                <a
                  class="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent"
                  href="/clients/notificationsettings"
                >
                  Clients
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
              <li>Cancellation Reasons</li>
            </ul>
          </div>
          <div
            class="text-right"
            style={{ marginRight: "5%", marginBottom: "2%" }}
          >
            <button
              id="addNewCancellationReason"
              onClick={this.modalShow}
              class="btn bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
            >
              Add New
            </button>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-2 sm:gap-2 lg:grid-cols-1 lg:gap-2 text-left">
          <p
            class="text-base font-medium text-slate-700 dark:text-navy-100"
            style={{ marginLeft: "5%", marginRight: "5%" }}
          >
            Cancellation Reasons
          </p>
          <p style={{ marginLeft: "5%", marginRight: "5%" }}>
            Manage all cancellation reasons you want to allow for cancellation.
          </p>
          {this.state.cancellationreasons.length == 0 ? (
            <div class="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6 text-left p-4">
              <div class="col-span-12 sm:col-span-12 mx-4 pl-4">
                <div class=" px-4 py-4 sm:px-5">
                  <div class="m-2 text-center mt-4 pt-4">
                    <i class="fas fa-comments fa-6x"></i>
                    <h2 class="text-2xl font-semibold">
                      No cancellation reason created yet
                    </h2>
                    <div class="m-2">
                      <p>Your all cancellation reasons will appear here</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          {this.state.cancellationreasons.map((cancellationreason) => (
            <div
              id={cancellationreason.id}
              class="card p-4 m-4"
              style={{ marginLeft: "5%", marginRight: "5%" }}
              onClick={this.editPaymentType(cancellationreason)}
            >
              <div class="flex justify-between space-x-2 p-4 m-4">
                <i class="fa-solid fa-bars fa-2x"></i>
                <div class="flex flex-1 flex-col justify-between px-4">
                  <div class="">
                    <a
                      href="#"
                      class="text-xl text-slate-700 outline-none transition-colors line-clamp-2 hover:text-primary focus:text-primary dark:text-navy-100 dark:hover:text-accent-light dark:focus:text-accent-light"
                    >
                      {cancellationreason.message}
                    </a>
                  </div>
                </div>
                <label class="flex items-center space-x-2">
                  {cancellationreason.isdefault ? (
                    <div class="badge bg-success/10 text-success dark:bg-success/15">
                      default
                    </div>
                  ) : null}
                  <span class="text-xs text-slate-400 dark:text-navy-300">
                    {cancellationreason.isdefault ? (
                      <i class="fa-solid fa-lock"></i>
                    ) : (
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
                    )}
                  </span>
                </label>
              </div>
            </div>
          ))}
        </div>
        {this.state.addNewCancellationReason ? (
          <div
            class="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
            role="dialog"
          >
            <div
              class="absolute inset-0 bg-slate-900/60 backdrop-blur transition-opacity duration-300"
              id="addNewCancellationReason"
              onClick={this.modalHide}
            ></div>
            <div class="relative w-full max-w-2xl origin-bottom rounded-lg bg-white pb-4 transition-all duration-300 dark:bg-navy-700">
              <div class="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
                <h3 class="text-base font-medium text-slate-700 dark:text-navy-100">
                  Add New Cancellation Reason
                </h3>
                <button
                  class="btn -mr-1.5 h-7 w-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                  id="addNewCancellationReason"
                  onClick={this.modalHide}
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
              <div class="is-scrollbar-hidden min-w-full overflow-x-auto p-4">
                <label class="block text-left">
                  <span>Reason</span>
                  <input
                    class="form-input mt-1.5 peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                    placeholder="Enter your reason here"
                    type="text"
                    id="name"
                    onChange={(e) => {
                      this.setState({
                        reason: e.currentTarget.value,
                      });
                    }}
                  />
                </label>
                <label class="inline-flex items-center space-x-2 pt-2">
                  <input
                    class="form-switch h-5 w-10 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-accent dark:checked:before:bg-white"
                    type="checkbox"
                    value="true"
                    checked={this.state.isdefault}
                    onChange={() => {
                      this.setState(({ isdefault }) => ({
                        isdefault: !isdefault,
                      }));
                    }}
                  />
                  <span>Default</span>
                </label>
              </div>
              <div class="text-center">
                <button
                  class="btn bg-primary btn-color from-sky-400 to-blue-600 font-medium text-white m-2"
                  onClick={this.addNewCancellationReason}
                >
                  Save
                </button>
                <button
                  class="btn bg-primary btn-color from-sky-400 to-blue-600 font-medium text-white m-2"
                  id="addNewCancellationReason"
                  onClick={this.modalHide}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        ) : null}
        {this.state.editCancellationReason ? (
          <div
            class="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
            role="dialog"
          >
            <div
              class="absolute inset-0 bg-slate-900/60 backdrop-blur transition-opacity duration-300"
              id="editCancellationReason"
              onClick={this.modalHide}
            ></div>
            <div class="relative w-full max-w-2xl origin-bottom rounded-lg bg-white pb-4 transition-all duration-300 dark:bg-navy-700">
              <div class="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
                <h3 class="text-base font-medium text-slate-700 dark:text-navy-100">
                  Edit Cancellation Reason
                </h3>
                <button
                  class="btn -mr-1.5 h-7 w-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                  id="editCancellationReason"
                  onClick={this.modalHide}
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
              <div class="is-scrollbar-hidden min-w-full overflow-x-auto p-4">
                <label class="block text-left">
                  <span>Reason</span>
                  <input
                    class="form-input mt-1.5 peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                    placeholder="Enter your reason here"
                    type="text"
                    id="name"
                    value={this.state.editreason}
                    onChange={(e) => {
                      this.setState({
                        editreason: e.currentTarget.value,
                      });
                    }}
                  />
                </label>
                <label class="inline-flex items-center space-x-2 pt-2">
                  <input
                    class="form-switch h-5 w-10 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-accent dark:checked:before:bg-white"
                    type="checkbox"
                    value="true"
                    checked={this.state.editisdefault}
                    onChange={() => {
                      this.setState(({ editisdefault }) => ({
                        editisdefault: !editisdefault,
                      }));
                    }}
                  />
                  <span>Default</span>
                </label>
              </div>
              <div class="text-center">
                <button
                  class="btn bg-primary btn-color from-sky-400 to-blue-600 font-medium text-white m-2"
                  onClick={this.saveEditCancellationReason}
                >
                  Save
                </button>
                <button
                  class="btn bg-primary btn-color from-sky-400 to-blue-600 font-medium text-white m-2"
                  id="editCancellationReason"
                  onClick={this.modalHide}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    );
  }
}
