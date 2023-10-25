import React from "react";
import swal from "sweetalert";
import axios from "axios";
import configData from "../../utils/constants/config.json";

export default class PaymentTypes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paymenttype: [],
    };
  }

  componentDidMount() {
    axios({
      method: "get",
      url: configData.SERVER_URL + "partner/sales/getpaymenttype",
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
            paymenttype: resp.data.paymenttype,
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

  savePaymentType = (type) => {
    var bodyFormData = new URLSearchParams();
    bodyFormData.append("id", type.id);
    bodyFormData.append("name", type.name);
    bodyFormData.append("status", type.status);
    axios({
      method: "post",
      url: configData.SERVER_URL + "partner/sales/updatepaymenttype",
      data: bodyFormData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        accesstoken: configData.ACCESSTOKEN,
        logintoken: localStorage.getItem("loginToken"),
      },
    })
      .then((resp) => {
        if (parseInt(Object.keys(resp.data)[0]) === 200) {
          swal({
            title: "Payment Information",
            text: resp.data[Object.keys(resp.data)[0]],
            icon: "success",
            button: "ok",
          });
        } else {
          swal({
            title: "Payment Information",
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
          <div class="flex ml-1 items-center space-x-4 py-5 lg:py-6">
            <h2 class="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">
              Payment Types
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
              <li>Payment Types</li>
            </ul>
          </div>
          <div
            class="text-right"
            style={{ marginRight: "5%", marginBottom: "2%" }}
          >
            <button
              onClick={this.savePaymentType}
              class="btn bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
            >
              Save
            </button>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-2 sm:gap-2 lg:grid-cols-1 lg:gap-2 text-left">
          <p
            class="text-base font-medium text-slate-700 dark:text-navy-100"
            style={{ marginLeft: "5%", marginRight: "5%" }}
          >
            Payment Types
          </p>
          <p
            style={{
              marginLeft: "5%",
              marginRight: "5%",
              marginBottom: "10px",
            }}
          >
            Manage all payment options you want to allow at checkout.
          </p>
          {this.state.paymenttype.map((type) => (
            <div
              id={type.id}
              class="card p-4 m-4"
              style={{ marginLeft: "5%", marginRight: "5%" }}
            >
              <div class="flex justify-between space-x-2 p-4 m-4">
                <i class="fa-solid fa-bars fa-2x"></i>
                <div class="flex flex-1 flex-col justify-between px-4">
                  <div class="">
                    <a
                      href="#"
                      class="text-xl text-slate-700 outline-none transition-colors line-clamp-2 hover:text-primary focus:text-primary dark:text-navy-100 dark:hover:text-accent-light dark:focus:text-accent-light"
                    >
                      {type.name}
                    </a>
                  </div>
                </div>
                <label class="flex items-center space-x-2">
                  <span class="text-xs text-slate-400 dark:text-navy-300">
                    <input
                      class="form-checkbox is-outline h-5 w-5 rounded-full border-slate-400/70 before:bg-primary checked:border-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:before:bg-accent dark:checked:border-accent dark:hover:border-accent dark:focus:border-accent"
                      type="checkbox"
                      checked={type.status}
                      onChange={() => {
                        type.status = !type.status;
                        this.setState({
                          paymenttype: this.state.paymenttype,
                        });
                        this.savePaymentType(type);
                      }}
                    />
                  </span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }
}
