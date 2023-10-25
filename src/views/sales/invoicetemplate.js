import React from "react";
import swal from "sweetalert";
import axios from "axios";
import configData from "../../utils/constants/config.json";

export default class InvoiceTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      country: "United Arab Emirates",
      currency: "AED",
      receipttemplate: null,
      autoprint: false,
      showcontactdetails: false,
      showaddress: false,
    };
  }

  componentDidMount() {
    axios({
      method: "get",
      url: configData.SERVER_URL + "partner/sales/getreceipttemplate",
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
            receipttemplate: resp.data.receipttemplate,
            autoprint: resp.data.receipttemplate.autoprint == 1 ? true : false,
            showcontactdetails:
              resp.data.receipttemplate.showcontactdetails == 1 ? true : false,
            showaddress:
              resp.data.receipttemplate.showaddress == 1 ? true : false,
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

  saveInvoiceTemplateDetails = (e) => {
    e.preventDefault();
    var bodyFormData = new URLSearchParams();
    bodyFormData.append("id", this.state.receipttemplate.id);
    bodyFormData.append("title", this.state.receipttemplate.title);
    bodyFormData.append("customline1", this.state.receipttemplate.customline1);
    bodyFormData.append("customline2", this.state.receipttemplate.customline2);
    bodyFormData.append("footer", this.state.receipttemplate.footer);
    bodyFormData.append("autoprint", this.state.autoprint ? 1 : 0);
    bodyFormData.append(
      "showcontactdetails",
      this.state.showcontactdetails ? 1 : 0
    );
    bodyFormData.append("showaddress", this.state.showaddress ? 1 : 0);
    axios({
      method: "post",
      url: configData.SERVER_URL + "partner/sales/updatereceipttemplate",
      data: bodyFormData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        accesstoken: configData.ACCESSTOKEN,
        logintoken: localStorage.getItem("loginToken"),
      },
    })
      .then((resp) => {
        console.log(resp.data);
        if (parseInt(Object.keys(resp.data)[0]) === 200) {
          swal({
            title: "Invoice Template",
            text: "Invoice Template Saved Successfully",
            icon: "success",
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
      <main class="main-content px-[var(--margin-x)] pb-8">
        <div class="items-center justify-between">
          <div class="flex items-center space-x-4 py-5 lg:py-6">
            <h2 class="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">
              Invoice Template
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
              <li>Invoice Template</li>
            </ul>
          </div>
          <div class="text-right mx-4">
            <button
              onClick={this.saveInvoiceTemplateDetails}
              class="btn bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
            >
              Save
            </button>
          </div>
        </div>
        {this.state.receipttemplate != null ? (
          <div>
            <div class="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6 text-left p-4">
              <div class="col-span-12 sm:col-span-6 m-4 p-4">
                <h2 class="text-2xl font-semibold">Sale receipt settings</h2>
                <p class="max-w-2xl mt-4">
                  Customize the content displayed on sales receipts issued to
                  your clients
                </p>
              </div>
              <div class="col-span-12 sm:col-span-6 m-4">
                <div class="card px-4 py-4 sm:px-5">
                  <div class="pt-2 pb-4">
                    <label class="inline-flex items-center space-x-2">
                      <input
                        class="form-switch h-5 w-10 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-accent dark:checked:before:bg-white"
                        type="checkbox"
                        value="true"
                        checked={this.state.autoprint}
                        onChange={() => {
                          this.setState(({ autoprint }) => ({
                            autoprint: !autoprint,
                          }));
                        }}
                      />
                      <span>Automatically print receipt upon sale</span>
                    </label>
                  </div>
                  <div class="pt-2 pb-4">
                    <label class="inline-flex items-center space-x-2">
                      <input
                        class="form-switch h-5 w-10 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-accent dark:checked:before:bg-white"
                        type="checkbox"
                        value="true"
                        checked={this.state.showcontactdetails}
                        onChange={() => {
                          this.setState(({ showcontactdetails }) => ({
                            showcontactdetails: !showcontactdetails,
                          }));
                        }}
                      />
                      <span>Show client mobile and email on sale receipt</span>
                    </label>
                  </div>
                  <div class="pt-2 pb-4">
                    <label class="inline-flex items-center space-x-2">
                      <input
                        class="form-switch h-5 w-10 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-accent dark:checked:before:bg-white"
                        type="checkbox"
                        value="true"
                        checked={this.state.showaddress}
                        onChange={() => {
                          this.setState(({ showaddress }) => ({
                            showaddress: !showaddress,
                          }));
                        }}
                      />
                      <span>Show client address on sale receipt</span>
                    </label>
                  </div>
                  <div class="pt-2 pb-4">
                    <label class="block">
                      <span>Receipt title</span>
                      <input
                        class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                        placeholder="Enter Your Invoice Title"
                        type="text"
                        value={this.state.receipttemplate.title}
                        onChange={(e) => {
                          this.state.receipttemplate.title =
                            e.currentTarget.value;
                          this.setState({
                            receipttemplate: this.state.receipttemplate,
                          });
                        }}
                      />
                    </label>
                  </div>
                  <div class="pt-2 pb-4">
                    <label class="block">
                      <span>Receipt custom line 1</span>
                      <input
                        class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                        placeholder=""
                        type="text"
                        value={this.state.receipttemplate.customline1}
                        onChange={(e) => {
                          this.state.receipttemplate.customline1 =
                            e.currentTarget.value;
                          this.setState({
                            receipttemplate: this.state.receipttemplate,
                          });
                        }}
                      />
                    </label>
                  </div>
                  <div class="pt-2 pb-4">
                    <label class="block">
                      <span>Receipt custom line 2</span>
                      <input
                        class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                        placeholder=""
                        type="text"
                        value={this.state.receipttemplate.customline2}
                        onChange={(e) => {
                          this.state.receipttemplate.customline2 =
                            e.currentTarget.value;
                          this.setState({
                            receipttemplate: this.state.receipttemplate,
                          });
                        }}
                      />
                    </label>
                  </div>
                  <div class="pt-2 pb-4">
                    <label class="block">
                      <span>Receipt footer</span>
                      <input
                        class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                        placeholder=""
                        type="text"
                        value={this.state.receipttemplate.footer}
                        onChange={(e) => {
                          this.state.receipttemplate.footer =
                            e.currentTarget.value;
                          this.setState({
                            receipttemplate: this.state.receipttemplate,
                          });
                        }}
                      />
                    </label>
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
