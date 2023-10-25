import React from "react";
import swal from "sweetalert";
import axios from "axios";
import configData from "../../utils/constants/config.json";

export default class ReferralSources extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      referralsources: [],
      addNewReferralSource: false,
      editReferralSource: false,
      selectedReferralSource: null,
      name: "",
      active: false,
      editname: "",
      editactive: false,
    };
  }

  componentDidMount() {
    axios({
      method: "get",
      url: configData.SERVER_URL + "partner/clients/getreferralsources",
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
            referralsources: resp.data.referralsources,
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

  addNewReferralSurce = (e) => {
    e.preventDefault();
    console.log(this.state);
    if (this.state.name === "") {
      document.getElementById("name").focus();
      return;
    }
    var bodyFormData = new URLSearchParams();
    bodyFormData.append("name", this.state.name);
    bodyFormData.append("active", this.state.active);
    axios({
      method: "post",
      url: configData.SERVER_URL + "partner/clients/createreferralsources",
      data: bodyFormData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        accesstoken: configData.ACCESSTOKEN,
        logintoken: localStorage.getItem("loginToken"),
      },
    })
      .then((resp) => {
        if (parseInt(Object.keys(resp.data)[0]) === 200) {
          this.setState({
            referralsources: [
              ...this.state.referralsources,
              resp.data.referralsource,
            ],
            addNewReferralSource: false,
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

  editReferralSource = (referralsource) => (e) => {
    e.preventDefault();
    if (referralsource.isdefault) {
      return;
    }
    this.setState({
      selectedReferralSource: referralsource,
      editname: referralsource.name,
      editactive: referralsource.active,
      editReferralSource: true,
    });
  };

  saveEditReferralSource = (e) => {
    e.preventDefault();
    console.log(this.state.editactive);
    var bodyFormData = new URLSearchParams();
    bodyFormData.append("id", this.state.selectedReferralSource.id);
    bodyFormData.append("name", this.state.editname);
    bodyFormData.append("active", this.state.editactive);
    axios({
      method: "post",
      url: configData.SERVER_URL + "partner/clients/updatereferralsources",
      data: bodyFormData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        accesstoken: configData.ACCESSTOKEN,
        logintoken: localStorage.getItem("loginToken"),
      },
    })
      .then((resp) => {
        if (parseInt(Object.keys(resp.data)[0]) === 200) {
          this.state.selectedReferralSource.name = this.state.editname;
          this.state.selectedReferralSource.active = this.state.editactive;
          this.setState({
            selectedReferralSource: this.state.selectedReferralSource,
            editReferralSource: false,
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
              Referral Sources
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
              <li>Referral Sources</li>
            </ul>
          </div>
          <div
            class="text-right"
            style={{ marginRight: "5%", marginBottom: "2%" }}
          >
            <button
              id="addNewReferralSource"
              onClick={this.modalShow}
              class="btn bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
            >
              Add New Referral Source
            </button>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-2 sm:gap-2 lg:grid-cols-1 lg:gap-2 text-left">
          <p
            class="text-base font-medium text-slate-700 dark:text-navy-100"
            style={{ marginLeft: "5%", marginRight: "5%" }}
          >
            Referral Sources
          </p>
          {this.state.referralsources.map((referralsource) => (
            <div
              id={referralsource.id}
              class="card p-2 m-2"
              style={{ marginLeft: "5%", marginRight: "5%" }}
              onClick={this.editReferralSource(referralsource)}
            >
              <div class="flex justify-between space-x-2 p-2 m-2">
                <i class="fa-solid fa-bars fa-2x"></i>
                <div class="flex flex-1 flex-col justify-between px-4">
                  <div class="">
                    <a
                      href="#"
                      class="text-xl text-slate-700 outline-none transition-colors line-clamp-2 hover:text-primary focus:text-primary dark:text-navy-100 dark:hover:text-accent-light dark:focus:text-accent-light"
                    >
                      {referralsource.name}
                    </a>
                  </div>
                </div>
                <label class="flex items-center space-x-2">
                  {referralsource.active ? (
                    <div class="badge bg-success/10 text-success dark:bg-success/15">
                      Active
                    </div>
                  ) : (
                    <div class="badge bg-error/10 text-error dark:bg-error/15">
                      Inactive
                    </div>
                  )}
                  <span class="text-xs text-slate-400 dark:text-navy-300">
                    {referralsource.isdefault ? (
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
        {this.state.addNewReferralSource ? (
          <div
            class="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
            role="dialog"
          >
            <div
              class="absolute inset-0 bg-slate-900/60 backdrop-blur transition-opacity duration-300"
              id="addNewReferralSource"
              onClick={this.modalHide}
            ></div>
            <div class="relative w-full max-w-2xl origin-bottom rounded-lg bg-white pb-4 transition-all duration-300 dark:bg-navy-700">
              <div class="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
                <h3 class="text-base font-medium text-slate-700 dark:text-navy-100">
                  Add New Referral Source
                </h3>
                <button
                  class="btn -mr-1.5 h-7 w-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                  id="addNewReferralSource"
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
                <label class="block">
                  <span>Name</span>
                  <input
                    class="form-input mt-1.5 peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                    placeholder="Enter name"
                    type="text"
                    id="name"
                    onChange={(e) => {
                      this.setState({
                        name: e.currentTarget.value,
                      });
                    }}
                  />
                </label>
                <label class="inline-flex items-center space-x-2 pt-2">
                  <input
                    class="form-switch h-5 w-10 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-accent dark:checked:before:bg-white"
                    type="checkbox"
                    value="true"
                    checked={this.state.active}
                    onChange={() => {
                      this.setState(({ active }) => ({ active: !active }));
                    }}
                  />
                  <span>Active</span>
                </label>
              </div>
              <div class="text-center">
                <button
                  class="btn bg-primary btn-color from-sky-400 to-blue-600 font-medium text-white m-2"
                  onClick={this.addNewReferralSurce}
                >
                  Save
                </button>
                <button
                  class="btn bg-primary btn-color from-sky-400 to-blue-600 font-medium text-white m-2"
                  id="addNewReferralSource"
                  onClick={this.modalHide}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        ) : null}
        {this.state.editReferralSource ? (
          <div
            class="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
            role="dialog"
          >
            <div
              class="absolute inset-0 bg-slate-900/60 backdrop-blur transition-opacity duration-300"
              id="editReferralSource"
              onClick={this.modalHide}
            ></div>
            <div class="relative w-full max-w-2xl origin-bottom rounded-lg bg-white pb-4 transition-all duration-300 dark:bg-navy-700">
              <div class="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
                <h3 class="text-base font-medium text-slate-700 dark:text-navy-100">
                  Edit Service Charge
                </h3>
                <button
                  class="btn -mr-1.5 h-7 w-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                  id="editReferralSource"
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
                <label class="block">
                  <span>Name</span>
                  <input
                    class="form-input mt-1.5 peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                    placeholder="Enter name"
                    type="text"
                    id="name"
                    value={this.state.editname}
                    onChange={(e) => {
                      this.setState({
                        editname: e.currentTarget.value,
                      });
                    }}
                  />
                </label>
                <label class="inline-flex items-center space-x-2 pt-2">
                  <input
                    class="form-switch h-5 w-10 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-accent dark:checked:before:bg-white"
                    type="checkbox"
                    value="true"
                    checked={this.state.editactive}
                    onChange={() => {
                      this.setState(({ editactive }) => ({
                        editactive: !editactive,
                      }));
                    }}
                  />
                  <span>Active</span>
                </label>
              </div>
              <div class="text-center">
                <button
                  class="btn bg-primary btn-color from-sky-400 to-blue-600 font-medium text-white m-2"
                  onClick={this.saveEditReferralSource}
                >
                  Save
                </button>
                <button
                  class="btn bg-primary btn-color from-sky-400 to-blue-600 font-medium text-white m-2"
                  id="editReferralSource"
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
