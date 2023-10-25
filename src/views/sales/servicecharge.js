import React from "react";
import swal from "sweetalert";
import axios from "axios";
import configData from "../../utils/constants/config.json";

export default class ServiceCharge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      taxes: [],
      servicecharge: [],
      addNewServiceCharge: false,
      editServiceCharge: false,
      selectedServiceCharge: null,
      name: "",
      description: "",
      services: true,
      products: true,
      membership: true,
      vouchers: true,
      isPercentage: false,
      isAutoApply: true,
      rate: 0,
      tax: null,
      editname: "",
      editdescription: "",
      editservices: true,
      editproducts: true,
      editmembership: true,
      editvouchers: true,
      editisPercentage: false,
      editisAutoApply: true,
      editrate: 0,
      edittax: null,
    };
  }

  componentDidMount() {
    axios({
      method: "get",
      url: configData.SERVER_URL + "partner/sales/getservicecharge",
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
            servicecharge: resp.data.servicecharge,
            taxes: resp.data.taxes,
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

  addNewServiceCharge = (e) => {
    e.preventDefault();
    console.log(this.state);
    if (this.state.name === "") {
      document.getElementById("name").focus();
      return;
    }
    if (this.state.description === "") {
      document.getElementById("description").focus();
      return;
    }
    if (
      !this.state.services &&
      !this.state.products &&
      !this.state.membership &&
      !this.state.vouchers
    ) {
      swal({
        title: "Service Charge",
        text: "Please select at least one item to apply service charge",
        icon: "warning",
        button: "ok",
      });
      return;
    }
    if (this.state.rate === 0) {
      if (this.state.isPercentage) {
        document.getElementById("prate").focus();
      } else {
        document.getElementById("frate").focus();
      }
      return;
    }
    if (this.state.tax === null) {
      document.getElementById("tax").focus();
      return;
    }
    var bodyFormData = new URLSearchParams();
    bodyFormData.append("name", this.state.name);
    bodyFormData.append("description", this.state.description);
    bodyFormData.append("applyservice", this.state.services ? 1 : 0);
    bodyFormData.append("applyproducts", this.state.products ? 1 : 0);
    bodyFormData.append("applymembers", this.state.membership ? 1 : 0);
    bodyFormData.append("applyvouchers", this.state.vouchers ? 1 : 0);
    bodyFormData.append("isautoapply", this.state.isAutoApply ? 1 : 0);
    bodyFormData.append("ratetype", this.state.isPercentage ? 1 : 0);
    bodyFormData.append("rate", this.state.rate);
    bodyFormData.append("istaxable", this.state.tax);
    axios({
      method: "post",
      url: configData.SERVER_URL + "partner/sales/createservicecharge",
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
            servicecharge: [
              ...this.state.servicecharge,
              resp.data.servicecharge,
            ],
            addNewServiceCharge: false,
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

  editServiceCharge = (servicecharge) => (e) => {
    e.preventDefault();
    this.setState({
      selectedServiceCharge: servicecharge,
      editname: servicecharge.name,
      editdescription: servicecharge.details,
      editservices: servicecharge.applyservice == 1 ? true : false,
      editproducts: servicecharge.applyproducts == 1 ? true : false,
      editmembership: servicecharge.applymembers == 1 ? true : false,
      editvouchers: servicecharge.applyvouchers == 1 ? true : false,
      editisPercentage: servicecharge.ratetype == 1 ? true : false,
      editisAutoApply: servicecharge.isautoapply == 1 ? true : false,
      editrate: servicecharge.rate,
      edittax: servicecharge.istaxable,
      editServiceCharge: true,
    });
  };

  saveEditServiceCharge = (e) => {
    e.preventDefault();
    var bodyFormData = new URLSearchParams();
    bodyFormData.append("id", this.state.selectedServiceCharge.id);
    bodyFormData.append("name", this.state.editname);
    bodyFormData.append("description", this.state.editdescription);
    bodyFormData.append("applyservice", this.state.editservices ? 1 : 0);
    bodyFormData.append("applyproducts", this.state.editproducts ? 1 : 0);
    bodyFormData.append("applymembers", this.state.editmembership ? 1 : 0);
    bodyFormData.append("applyvouchers", this.state.editvouchers ? 1 : 0);
    bodyFormData.append("isautoapply", this.state.editisAutoApply ? 1 : 0);
    bodyFormData.append("ratetype", this.state.editisPercentage ? 1 : 0);
    bodyFormData.append("rate", this.state.editrate);
    bodyFormData.append("istaxable", this.state.edittax);
    axios({
      method: "post",
      url: configData.SERVER_URL + "partner/sales/updateservicecharge",
      data: bodyFormData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        accesstoken: configData.ACCESSTOKEN,
        logintoken: localStorage.getItem("loginToken"),
      },
    })
      .then((resp) => {
        if (parseInt(Object.keys(resp.data)[0]) === 200) {
          this.state.selectedServiceCharge.name = this.state.editname;
          this.state.selectedServiceCharge.details = this.state.editdescription;
          this.state.selectedServiceCharge.applyservice = this.state
            .editservices
            ? 1
            : 0;
          this.state.selectedServiceCharge.applyproducts = this.state
            .editproducts
            ? 1
            : 0;
          this.state.selectedServiceCharge.applymembers = this.state
            .editmembership
            ? 1
            : 0;
          this.state.selectedServiceCharge.applyvouchers = this.state
            .editvouchers
            ? 1
            : 0;
          this.state.selectedServiceCharge.ratetype = this.state
            .editisPercentage
            ? 1
            : 0;
          this.state.selectedServiceCharge.isautoapply = this.state
            .editisAutoApply
            ? 1
            : 0;
          this.state.selectedServiceCharge.rate = this.state.editrate;
          this.state.selectedServiceCharge.istaxable = this.state.edittax;
          this.setState({
            selectedServiceCharge: this.state.selectedServiceCharge,
            editServiceCharge: false,
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
              Service Charges
            </h2>
            <div class="hidden h-full py-1 sm:flex">
              <div class="h-full w-px bg-slate-300 dark:bg-navy-600"></div>
            </div>
            <ul class="hidden flex-wrap items-center space-x-2 sm:flex">
              <li class="flex items-center space-x-2">
                <a
                  class="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent"
                  href="/sales/invoicsequencing"
                >
                  Sales
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
              <li>Service Charges</li>
            </ul>
          </div>
          <div
            class="text-right"
            style={{ marginRight: "5%", marginBottom: "2%" }}
          >
            <button
              id="addNewServiceCharge"
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
            Service charges
          </p>
          <p style={{ marginLeft: "5%", marginRight: "5%" }}>
            Manage any extra charges that apply to services and items sold at
            checkout.
          </p>
          {this.state.servicecharge.map((service) => (
            <div
              id={service.id}
              class="card p-4 m-4"
              style={{ marginLeft: "5%", marginRight: "5%" }}
              onClick={this.editServiceCharge(service)}
            >
              <div class="flex justify-between space-x-2 p-4 m-4">
                <i class="fa-solid fa-ticket fa-3x"></i>
                <div class="flex flex-1 flex-col justify-between px-4">
                  <div class="">
                    <a
                      href="#"
                      class="font-medium text-slate-700 outline-none transition-colors line-clamp-2 hover:text-primary focus:text-primary dark:text-navy-100 dark:hover:text-accent-light dark:focus:text-accent-light"
                    >
                      {service.name}
                    </a>
                    {service.ratetype == 0 ? (
                      <a
                        href="#"
                        class="text-xs text-slate-400 hover:text-slate-800 dark:text-navy-300 dark:hover:text-navy-100"
                      >
                        AED {service.rate} applied on (
                        {service.applyservice == 1 &&
                        service.applyproducts == 1 &&
                        service.applymembers == 1 &&
                        service.applyvouchers == 1 ? (
                          <span>all sales amount)</span>
                        ) : (
                          <span>
                            {service.applyservice == 1 ? (
                              <span> services</span>
                            ) : null}
                            {service.applyproducts == 1 ? (
                              <span> products</span>
                            ) : null}
                            {service.applymembers == 1 ? (
                              <span> memberships</span>
                            ) : null}
                            {service.applyvouchers == 1 ? (
                              <span> vouchers</span>
                            ) : null}
                          </span>
                        )}
                        <span> )</span>
                      </a>
                    ) : (
                      <a
                        href="#"
                        class="text-xs text-slate-400 hover:text-slate-800 dark:text-navy-300 dark:hover:text-navy-100"
                      >
                        {service.rate}% applied on (
                        {service.applyservice == 1 &&
                        service.applyproducts == 1 &&
                        service.applymembers == 1 &&
                        service.applyvouchers == 1 ? (
                          <span>all sales amount)</span>
                        ) : (
                          <span>
                            {service.applyservice == 1 ? (
                              <span> services</span>
                            ) : null}
                            {service.applyproducts == 1 ? (
                              <span> products</span>
                            ) : null}
                            {service.applymembers == 1 ? (
                              <span> memberships</span>
                            ) : null}
                            {service.applyvouchers == 1 ? (
                              <span> vouchers</span>
                            ) : null}
                          </span>
                        )}
                        <span> )</span>
                      </a>
                    )}
                  </div>
                </div>
                <label class="flex items-center space-x-2">
                  <span class="text-xs text-slate-400 dark:text-navy-300">
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
                  </span>
                </label>
              </div>
            </div>
          ))}
        </div>
        {this.state.addNewServiceCharge ? (
          <div
            class="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
            role="dialog"
          >
            <div
              class="absolute inset-0 bg-slate-900/60 backdrop-blur transition-opacity duration-300"
              id="addNewServiceCharge"
              onClick={this.modalHide}
            ></div>
            <div class="relative w-full max-w-2xl origin-bottom rounded-lg bg-white pb-4 transition-all duration-300 dark:bg-navy-700">
              <div class="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
                <h3 class="text-base font-medium text-slate-700 dark:text-navy-100">
                  Add New Service Charge
                </h3>
                <button
                  class="btn -mr-1.5 h-7 w-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                  id="addNewServiceCharge"
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
                <label class="block text-left pt-2">
                  <span>Description</span>
                  <textarea
                    rows="4"
                    placeholder="Enter a description for your service charge"
                    class="form-textarea mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent p-2.5 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                    id="description"
                    onChange={(e) => {
                      this.setState({
                        description: e.currentTarget.value,
                      });
                    }}
                  ></textarea>
                </label>
                {/* <div class="my-3 mx-4 h-px bg-slate-200 dark:bg-navy-500"></div>
                    <div class="block text-left pt-2">
                        <span>Apply service charge on</span>
                    </div>
                    <div class="flex justify-between" id="applicableon"> 
                        <label class="inline-flex items-center space-x-2 p-2">
                            <input class="form-switch h-5 w-10 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-accent dark:checked:before:bg-white" type="checkbox" checked={this.state.services}
                                onChange={()=>{
                                    this.setState(({ services }) => ({ services: !services }))
                                }}/>
                            <span>Services</span>
                        </label>
                        <label class="inline-flex items-center space-x-2 p-2">
                            <input class="form-switch h-5 w-10 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-accent dark:checked:before:bg-white" type="checkbox" checked={this.state.products}
                                onChange={()=>{
                                    this.setState(({ products }) => ({ products: !products }))
                                }}/>
                            <span>Products</span>
                        </label>
                        <label class="inline-flex items-center space-x-2 p-2">
                            <input class="form-switch h-5 w-10 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-accent dark:checked:before:bg-white" type="checkbox" checked={this.state.membership}
                                onChange={()=>{
                                    this.setState(({ membership }) => ({ membership: !membership }))
                                }}/>
                            <span>Membership</span>
                        </label>
                        <label class="inline-flex items-center space-x-2 p-2">
                            <input class="form-switch h-5 w-10 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-accent dark:checked:before:bg-white" type="checkbox" checked={this.state.vouchers}
                                onChange={()=>{
                                    this.setState(({ vouchers }) => ({ vouchers: !vouchers }))
                                }}/>
                            <span>Vouchers</span>
                        </label>
                    </div> */}
                <div class="my-3 mx-4 h-px bg-slate-200 dark:bg-navy-500"></div>
                <div class=" block text-left pt-2">
                  <label class="inline-flex items-center space-x-2 text-left">
                    <input
                      class="form-switch h-5 w-10 rounded-lg bg-slate-300 before:rounded-md before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-accent dark:checked:before:bg-white"
                      type="checkbox"
                      onChange={() => {
                        this.setState(({ isPercentage }) => ({
                          isPercentage: !isPercentage,
                        }));
                      }}
                    />
                    <span>
                      Set the service charge rate. (Flat Rate/ Percentage)
                    </span>
                  </label>
                </div>
                {!this.state.isPercentage ? (
                  <div class="text-left pt-2">
                    <span>Flat Rate:</span>
                    <label class="mt-1.5 flex -space-x-px">
                      <input
                        class="form-input w-full rounded-l-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                        placeholder="0.00"
                        type="number"
                        min="0.00"
                        step="1"
                        id="frate"
                        onChange={(e) => {
                          this.setState({
                            rate: e.currentTarget.value,
                          });
                        }}
                      />
                      <div class="flex items-center justify-center rounded-r-lg border border-slate-300 px-3.5 font-inter dark:border-navy-450">
                        <span>AED</span>
                      </div>
                    </label>
                  </div>
                ) : (
                  <div class="text-left pt-2">
                    <span>Percentage:</span>
                    <label class="mt-1.5 flex -space-x-px">
                      <input
                        class="form-input w-full rounded-l-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                        placeholder="0.00"
                        type="number"
                        min="0.00"
                        step="0.01"
                        id="prate"
                        onChange={(e) => {
                          this.setState({
                            rate: e.currentTarget.value,
                          });
                        }}
                      />
                      <div class="flex items-center justify-center rounded-r-lg border border-slate-300 px-3.5 font-inter dark:border-navy-450">
                        <span>%</span>
                      </div>
                    </label>
                  </div>
                )}
                <div class="my-3 mx-4 h-px bg-slate-200 dark:bg-navy-500"></div>
                <div class=" block text-left pt-2">
                  <label class="inline-flex items-center space-x-2 text-left">
                    <input
                      class="form-switch h-5 w-10 rounded-lg bg-slate-300 before:rounded-md before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-accent dark:checked:before:bg-white"
                      type="checkbox"
                      onChange={() => {
                        this.setState(({ isAutoApply }) => ({
                          isAutoApply: !isAutoApply,
                        }));
                      }}
                    />
                    <span>Autometically apply during checkout</span>
                  </label>
                </div>
                <label class="block text-left pt-2">
                  <span>Set Tax Rate*</span>
                  <select
                    class="mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent  px-3 py-2"
                    id="tax"
                    onChange={(e) => {
                      this.setState({
                        tax: e.currentTarget.value,
                      });
                    }}
                  >
                    <option value="0">No Tax</option>
                    {this.state.taxes.map((tax) => (
                      <option value={tax.id}>{tax.name}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div class="text-center">
                <button
                  class="btn bg-primary btn-color from-sky-400 to-blue-600 font-medium text-white m-2"
                  onClick={this.addNewServiceCharge}
                >
                  Save
                </button>
                <button
                  class="btn bg-primary btn-color from-sky-400 to-blue-600 font-medium text-white m-2"
                  id="addNewServiceCharge"
                  onClick={this.modalHide}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        ) : null}
        {this.state.editServiceCharge ? (
          <div
            class="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
            role="dialog"
          >
            <div
              class="absolute inset-0 bg-slate-900/60 backdrop-blur transition-opacity duration-300"
              id="editServiceCharge"
              onClick={this.modalHide}
            ></div>
            <div class="relative w-full max-w-2xl origin-bottom rounded-lg bg-white pb-4 transition-all duration-300 dark:bg-navy-700">
              <div class="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
                <h3 class="text-base font-medium text-slate-700 dark:text-navy-100">
                  Edit Service Charge
                </h3>
                <button
                  class="btn -mr-1.5 h-7 w-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                  id="editServiceCharge"
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
                <label class="block text-left pt-2">
                  <span>Description</span>
                  <textarea
                    rows="4"
                    placeholder="Enter a description for your service charge"
                    class="form-textarea mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent p-2.5 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                    id="description"
                    value={this.state.editdescription}
                    onChange={(e) => {
                      this.setState({
                        editdescription: e.currentTarget.value,
                      });
                    }}
                  ></textarea>
                </label>
                {/* <div class="my-3 mx-4 h-px bg-slate-200 dark:bg-navy-500"></div>
                    <div class="block text-left pt-2">
                        <span>Apply service charge on</span>
                    </div>
                    <div class="flex justify-between" id="applicableon"> 
                        <label class="inline-flex items-center space-x-2 p-2">
                            <input class="form-switch h-5 w-10 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-accent dark:checked:before:bg-white" type="checkbox" checked={this.state.editservices}
                                onChange={()=>{
                                    this.setState(({ editservices }) => ({ editservices: !editservices }))
                                }}/>
                            <span>Services</span>
                        </label>
                        <label class="inline-flex items-center space-x-2 p-2">
                            <input class="form-switch h-5 w-10 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-accent dark:checked:before:bg-white" type="checkbox" checked={this.state.editproducts}
                                onChange={()=>{
                                    this.setState(({ editproducts }) => ({ editproducts: !editproducts }))
                                }}/>
                            <span>Products</span>
                        </label>
                        <label class="inline-flex items-center space-x-2 p-2">
                            <input class="form-switch h-5 w-10 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-accent dark:checked:before:bg-white" type="checkbox" checked={this.state.editmembership}
                                onChange={()=>{
                                    this.setState(({ editmembership }) => ({ editmembership: !editmembership }))
                                }}/>
                            <span>Membership</span>
                        </label>
                        <label class="inline-flex items-center space-x-2 p-2">
                            <input class="form-switch h-5 w-10 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-accent dark:checked:before:bg-white" type="checkbox" checked={this.state.editvouchers}
                                onChange={()=>{
                                    this.setState(({ editvouchers }) => ({ editvouchers: !editvouchers }))
                                }}/>
                            <span>Vouchers</span>
                        </label>
                    </div> */}
                <div class="my-3 mx-4 h-px bg-slate-200 dark:bg-navy-500"></div>
                <div class=" block text-left pt-2">
                  <label class="inline-flex items-center space-x-2 text-left">
                    <input
                      class="form-switch h-5 w-10 rounded-lg bg-slate-300 before:rounded-md before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-accent dark:checked:before:bg-white"
                      type="checkbox"
                      checked={this.state.editisPercentage}
                      onChange={() => {
                        this.setState(({ editisPercentage }) => ({
                          editisPercentage: !editisPercentage,
                        }));
                      }}
                    />
                    <span>
                      Set the service charge rate. (Flat Rate/ Percentage)
                    </span>
                  </label>
                </div>
                {!this.state.editisPercentage ? (
                  <div class="text-left pt-2">
                    <span>Flat Rate:</span>
                    <label class="mt-1.5 flex -space-x-px">
                      <input
                        class="form-input w-full rounded-l-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                        placeholder="0.00"
                        type="number"
                        min="0.00"
                        step="1"
                        id="frate"
                        value={this.state.editrate}
                        onChange={(e) => {
                          this.setState({
                            editrate: e.currentTarget.value,
                          });
                        }}
                      />
                      <div class="flex items-center justify-center rounded-r-lg border border-slate-300 px-3.5 font-inter dark:border-navy-450">
                        <span>AED</span>
                      </div>
                    </label>
                  </div>
                ) : (
                  <div class="text-left pt-2">
                    <span>Percentage:</span>
                    <label class="mt-1.5 flex -space-x-px">
                      <input
                        class="form-input w-full rounded-l-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                        placeholder="0.00"
                        type="number"
                        min="0.00"
                        step="0.01"
                        id="prate"
                        value={this.state.editrate}
                        onChange={(e) => {
                          this.setState({
                            editrate: e.currentTarget.value,
                          });
                        }}
                      />
                      <div class="flex items-center justify-center rounded-r-lg border border-slate-300 px-3.5 font-inter dark:border-navy-450">
                        <span>%</span>
                      </div>
                    </label>
                  </div>
                )}
                <div class="my-3 mx-4 h-px bg-slate-200 dark:bg-navy-500"></div>
                <div class=" block text-left pt-2">
                  <label class="inline-flex items-center space-x-2 text-left">
                    <input
                      class="form-switch h-5 w-10 rounded-lg bg-slate-300 before:rounded-md before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-accent dark:checked:before:bg-white"
                      type="checkbox"
                      checked={this.state.editisAutoApply}
                      onChange={() => {
                        this.setState(({ editisAutoApply }) => ({
                          editisAutoApply: !editisAutoApply,
                        }));
                      }}
                    />
                    <span>Autometically apply during checkout</span>
                  </label>
                </div>
                <label class="block text-left pt-2">
                  <span>Set Tax Rate*</span>
                  <select
                    class="mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent  px-3 py-2"
                    id="tax"
                    onChange={(e) => {
                      this.setState({
                        edittax: e.currentTarget.value,
                      });
                    }}
                  >
                    <option value="0">No Tax</option>
                    {this.state.taxes.map((tax) => {
                      if (this.state.edittax == tax.id) {
                        return (
                          <option value={tax.id} selected>
                            {tax.name}
                          </option>
                        );
                      } else {
                        return <option value={tax.id}>{tax.name}</option>;
                      }
                    })}
                  </select>
                </label>
              </div>
              <div class="text-center">
                <button
                  class="btn bg-primary btn-color from-sky-400 to-blue-600 font-medium text-white m-2"
                  onClick={this.saveEditServiceCharge}
                >
                  Save
                </button>
                <button
                  class="btn bg-primary btn-color from-sky-400 to-blue-600 font-medium text-white m-2"
                  id="editServiceCharge"
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
