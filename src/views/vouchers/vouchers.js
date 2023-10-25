import React from "react";
import swal from "sweetalert";
import axiosClient from "../../utils/helpers/server";
import { HiMagnifyingGlass } from "react-icons/hi2";

export default class Vouchers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      vouchers: [],
      selectedVoucher: null,
      selectedVoucherModal: false,
      business: this.props.business,
      setSearchText:""
    };
  }

    voucherListAPICall (searchTextValue){
      axiosClient.get(`partner/vouchers/getvouchers?search=${searchTextValue}`).then((resp) => {
        console.log(resp);
        if (parseInt(Object.keys(resp.data)[0]) === 200) {
          this.setState({
            vouchers: resp.data.vouchers,
          });
        } else {
          swal({
            title: "Get Vouchers",
            text: resp.data[Object.keys(resp.data)[0]],
            icon: "warning",
            button: "ok",
          });
        }
      });
    }
    componentDidMount() {
    this.voucherListAPICall("")
    }

    // componant did update and will mount when change the searchtext
    componentDidUpdate(prevProps, prevState) {
      if (prevState.setSearchText !== this.state.setSearchText) {
        this.voucherListAPICall(this.state.setSearchText);
      }
    }

  selectVoucher = (voucher) => (e) => {
    e.preventDefault();
    this.setState({
      selectedVoucher: voucher,
      selectedVoucherModal: true,
    });
  };

  handleModalShow = (e) => {
    e.preventDefault();
    this.setState({
      [e.currentTarget.id]: true,
    });
  };

  handleModalHide = (e) => {
    e.preventDefault();
    this.setState({
      [e.currentTarget.id]: false,
    });
  };

  deleteVoucher = (e) => {
    e.preventDefault();
    axiosClient
      .delete("partner/vouchers/deletevoucher/" + this.state.selectedVoucher.id)
      .then((resp) => {
        console.log(resp);
        if (parseInt(Object.keys(resp.data)[0]) === 200) {
          this.state.selectedVoucher.status = false;
          this.setState({
            selectedVoucher: this.state.selectedVoucher,
            selectedVoucherModal: false,
          });
        } else {
          swal({
            title: "Delete Voucher",
            text: resp.data[Object.keys(resp.data)[0]],
            icon: "warning",
            button: "ok",
          });
        }
      });
  };

  editVoucher = (e) => {
    e.preventDefault();
    localStorage.setItem(
      "selectedvoucher",
      JSON.stringify(this.state.selectedVoucher)
    );
    window.location = "/services/editvoucher";
  };

  duplicateVoucher = (e) => {
    e.preventDefault();
    axiosClient
      .put("partner/vouchers/duplicatevoucher/" + this.state.selectedVoucher.id)
      .then((resp) => {
        console.log(resp);
        if (parseInt(Object.keys(resp.data)[0]) === 200) {
          this.setState({
            vouchers: [...this.state.vouchers, this.state.selectedVoucher],
            selectedVoucherModal: false,
          });
        } else {
          swal({
            title: "Duplicate Voucher",
            text: resp.data[Object.keys(resp.data)[0]],
            icon: "warning",
            button: "ok",
          });
        }
      });
  };

  reopenVoucher = (e) => {
    e.preventDefault();
    axiosClient
      .get("partner/vouchers/reopenvoucher/" + this.state.selectedVoucher.id)
      .then((resp) => {
        console.log(resp);
        if (parseInt(Object.keys(resp.data)[0]) === 200) {
          this.state.selectedVoucher.status = true;
          this.setState({
            selectedVoucher: this.state.selectedVoucher,
            selectedVoucherModal: false,
          });
        } else {
          swal({
            title: "Delete Voucher",
            text: resp.data[Object.keys(resp.data)[0]],
            icon: "warning",
            button: "ok",
          });
        }
      });
  };

  render() {
    return (
      <main class="main-content px-[var(--margin-x)] pb-8 mt-15">
        <div class="items-center justify-between">
          <div class="flex items-center space-x-4 py-5 lg:py-6">
            <h2 class="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">
              Vouchers
            </h2>
            <div class="hidden h-full py-1 sm:flex">
              <div class="h-full w-px bg-slate-300 dark:bg-navy-600"></div>
            </div>
            <ul class="hidden flex-wrap items-center space-x-2 sm:flex">
              <li class="flex items-center space-x-2">
                <a
                  class="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent"
                  href="/services/servicelist"
                >
                  Services
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
              <li>Voucehers</li>
            </ul>
          </div>
          <div class="text-right" style={{ marginBottom: "2%" }}>
            <a
              href="/services/addvoucher"
              class="btn bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
            >
              Add New Voucher
            </a>
          </div>
        </div>


          {/* Data Grid and Search Element */}
      <div className="bg-slate-200 mt-6  mb-4 p-4 lg:p-5 rounded-lg">
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
              value={this.state.setSearchText}
              onChange={(e) => this.setState({setSearchText :e.target.value})}
            />
          </div> 
        </div>
      </div>


        <div class="grid grid-cols-1  mt-4 gap-4 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {this.state.vouchers.map((voucher) => (
            <div
              class="rounded-lg bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 px-4 py-4 text-white dark:bg-accent sm:px-5"
              onClick={this.selectVoucher(voucher)}
            >
              <div>
                <h5 class="text-base">Voucher value</h5>
                <h1 class="text-3xl font-semibold">AED {voucher.value}</h1>
              </div>
              <div class="pt-4 mt-4">
                <div class="grid grid-cols-2 gap-4 text-left">
                  <div class="text-left">
                    <h4 class="text-lg font-semibold">{voucher.name}</h4>
                    <p class="text-xs">
                      Redeem on {voucher.voucherservices.length} services
                    </p>
                    <p class="text-xs">
                      Redeem on {voucher.voucherlocations.length} locations
                    </p>
                  </div>
                  <div class="text-right">
                    {voucher.status ? (
                      <p class="pb-1">
                        <div class="badge bg-primary text-white">Active</div>
                      </p>
                    ) : (
                      <p class="pb-1">
                        <div class="badge bg-primary text-white">Closed</div>
                      </p>
                    )}
                    <div class="badge bg-primary text-white">
                      Save{" "}
                      {parseInt((voucher.minretailprice / voucher.value) * 100)}
                      %
                    </div>
                    {voucher.limitsales ? (
                      <p class="text-xs pt-1">
                        Applicable for unllimited sales
                      </p>
                    ) : (
                      <p class="text-xs pt-1">
                        Limited to sale {voucher.minsales} times only
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div class="pt-2">
                <p class="text-xs">
                  Voucher retail price is {voucher.minretailprice} AED
                </p>
              </div>
            </div>
          ))}
        </div>

        {this.state.selectedVoucherModal ? (
          <div
            class="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
            role="dialog"
          >
            <div
              class="absolute inset-0 bg-slate-900/60 backdrop-blur transition-opacity duration-300"
              id="selectedVoucherModal"
              onClick={this.handleModalHide}
            ></div>
            <div class="relative w-full max-w-2xl origin-bottom rounded-lg bg-white transition-all duration-300 dark:bg-navy-700">
              <div class="is-scrollbar-hidden overflow-x-auto">
                <div class="grid grid-cols-1 lg:grid-cols-2">
                  <div class="p-4 bg-slate-150">
                    <div
                      class="m-4 relative rounded-lg text-white"
                      style={{ height: "26rem", width: "auto" }}
                    >
                      <div class="h-full w-full rounded-lg bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400"></div>
                      <div class="absolute top-0 flex h-full w-full flex-col justify-between p-4 sm:p-5">
                        <div class="pt-4">
                          <i class="fa-solid fa-shop fa-3x"></i>
                          <p class="text-xs+ font-light">
                            {this.state.business.name}
                          </p>
                          <p class="font-medium uppercase tracking-wide">
                            {this.state.selectedVoucher.name}
                          </p>
                        </div>
                        <div class="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>
                        <div>
                          <p class="text-xs+ font-light pb-2">Voucher value</p>
                          <h1 class="text-3xl font-semibold">
                            AED{" "}
                            {parseFloat(
                              this.state.selectedVoucher.value
                            ).toFixed(2)}
                          </h1>
                        </div>
                        <div class="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>
                        <div>
                          <p class="text-xs+ font-light pb-2">
                            Vouceher Code: XXXXXX
                          </p>
                          {this.state.selectedVoucher.bookbtn ? (
                            <button class="btn border border-slate-300 text-xs font-medium text-slate-800 bg-slate-150 focus:bg-slate-150 active:bg-slate-150/80 dark:border-navy-450 dark:text-navy-50 dark:hover:bg-navy-500 dark:focus:bg-navy-500 dark:active:bg-navy-500/90">
                              Book Now
                            </button>
                          ) : null}
                          <p class="text-xs+ font-light pt-2">
                            Radeem on{" "}
                            {this.state.selectedVoucher.voucherservices.length >
                            0
                              ? this.state.selectedVoucher.voucherservices
                                  .length
                              : "all "}{" "}
                            services
                          </p>
                          <p class="text-xs+ font-light">
                            Valid for {this.state.selectedVoucher.validfor}{" "}
                            months
                          </p>
                          <p class="text-xs+ font-light">
                            Valid on{" "}
                            {this.state.selectedVoucher.voucherlocations
                              .length > 0
                              ? this.state.selectedVoucher.voucherlocations
                                  .length
                              : "all "}{" "}
                            branches
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div class="flex justify-between rounded-t-lg px-4 py-3 dark:bg-navy-800 sm:px-5">
                      <h3 class="text-base font-medium text-slate-700 dark:text-navy-100"></h3>
                      <button
                        class="btn -mr-1.5 h-7 w-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                        id="selectedVoucherModal"
                        onClick={this.handleModalHide}
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
                    <div class="p-4">
                      <div class="text-left">
                        <h1 class="text-3xl font-semibold">
                          AED {this.state.selectedVoucher.value}{" "}
                          {this.state.selectedVoucher.name}
                        </h1>
                        <p>
                          Available in{" "}
                          {this.state.selectedVoucher.voucherlocations.length}{" "}
                          locations
                        </p>
                      </div>
                      <div class="p-4">
                        {/* <button class="btn h-11 w-full bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90">Sell voucher</button> */}
                      </div>
                      <div class="flex justify-between p-4">
                        <label>
                          <button
                            class="btn h-9 w-9 border border-primary p-0 font-medium text-primary hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary/90 dark:border-accent dark:text-accent-light dark:hover:bg-accent dark:hover:text-white dark:focus:bg-accent dark:focus:text-white dark:active:bg-accent/90"
                            onClick={this.duplicateVoucher}
                          >
                            <i class="fa-solid fa-clone"></i>
                          </button>
                          <br />
                          <span>Duplicate voucher</span>
                        </label>
                        <label>
                          <button
                            class="btn h-9 w-9 border border-primary p-0 font-medium text-primary hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary/90 dark:border-accent dark:text-accent-light dark:hover:bg-accent dark:hover:text-white dark:focus:bg-accent dark:focus:text-white dark:active:bg-accent/90"
                            onClick={this.editVoucher}
                          >
                            <i class="fa-solid fa-edit"></i>
                          </button>
                          <br />
                          <span>Edit voucher</span>
                        </label>
                        {/* <label>
                                <button class="btn h-9 w-9 border border-primary p-0 font-medium text-primary hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary/90 dark:border-accent dark:text-accent-light dark:hover:bg-accent dark:hover:text-white dark:focus:bg-accent dark:focus:text-white dark:active:bg-accent/90">
                                  <i class="fa-solid fa-bullhorn"></i>
                                </button><br/>
                                <span>Promote voucher</span>
                              </label> */}
                        {this.state.selectedVoucher.status ? (
                          <label>
                            <button
                              class="btn h-9 w-9 border border-primary p-0 font-medium text-primary hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary/90 dark:border-accent dark:text-accent-light dark:hover:bg-accent dark:hover:text-white dark:focus:bg-accent dark:focus:text-white dark:active:bg-accent/90"
                              onClick={this.deleteVoucher}
                            >
                              <i class="fa-solid fa-trash"></i>
                            </button>
                            <br />
                            <span>Close voucher</span>
                          </label>
                        ) : (
                          <label>
                            <button
                              class="btn h-9 w-9 border border-primary p-0 font-medium text-primary hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary/90 dark:border-accent dark:text-accent-light dark:hover:bg-accent dark:hover:text-white dark:focus:bg-accent dark:focus:text-white dark:active:bg-accent/90"
                              onClick={this.reopenVoucher}
                            >
                              <i class="fa-solid fa-trash-restore"></i>
                            </button>
                            <br />
                            <span>Reopen voucher</span>
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    );
  }
}
