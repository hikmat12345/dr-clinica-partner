import React from 'react';
import swal from 'sweetalert';
import axios from 'axios';
import configData from '../../utils/constants/config.json'

export default class BankAccount extends React.Component{

  constructor(props) {
      super(props)
      this.state = {
        partner : null,
        showBankAccountModal : false,
        account : null,
        accountName : "",
        accountType : "Individual",
        accountNo : "",
        iban : "",
        swiftCode : "",
        stripestatus: false
      }
  }

  componentDidMount () {
    axios({
        method: "get",
        url: configData.SERVER_URL + 'partner/account/geBankAccountDetails',
        headers: { 
            "Content-Type": "application/x-www-form-urlencoded",
            "accesstoken" : configData.ACCESSTOKEN,
            "logintoken" : localStorage.getItem('loginToken')
        },
    }).then(resp => {
        console.log(resp.data)
        if(parseInt(Object.keys(resp.data)[0]) === 200){
          this.setState({
            partner : resp.data.account
          })
          if(resp.data.account.bankaccount.length > 0){
            this.setState({
              account : resp.data.account.bankaccount[0],
              accountName : resp.data.account.bankaccount[0].name,
              accountType : resp.data.account.bankaccount[0].type,
              accountNo : resp.data.account.bankaccount[0].accountno,
              iban : resp.data.account.bankaccount[0].iban,
              swiftCode : resp.data.account.bankaccount[0].swiftcode,
              stripestatus : resp.data.account.stripestatus == 0 ? false : true
            })
          }
        }
    }).catch(err => {
        swal({
            title: "Server Not Responding",
            text: "Please try again later",
            icon: "warning",
            button: "ok",
        })
        console.log(err)
    })
  }

  handleInputChange = (event) => {
    event.preventDefault()
    this.setState({
        [event.target.id] : event.target.value
    });
  }

  handleModalShow = (e) => {
    e.preventDefault()
    this.setState({
        [e.target.id] : true
    });
  }

  handleModalHide = (e) => {
    e.preventDefault()
      console.log(e.currentTarget.id)
      this.setState({
          [e.currentTarget.id] : false
      });
  }

  saveAccountDetails = (e) => {
    e.preventDefault() 
    console.log(this.state)
    if(this.state.accountName === ""){
        document.getElementById("accountName").focus()
        return
    }
    if(this.state.iban === ""){
        document.getElementById("iban").focus()
        return
    }
    if(this.state.accountNo === ""){
        document.getElementById("accountNo").focus()
        return
    }
    if(this.state.accountType === ""){
        document.getElementById("accountType").focus()
        return
    }
    if(this.state.swiftCode === ""){
        document.getElementById("swiftCode").focus()
        return
    }
    var bodyFormData = new URLSearchParams()
    bodyFormData.append('name', this.state.accountName)
    bodyFormData.append('type', this.state.accountType)
    bodyFormData.append('accountno', this.state.accountNo)
    bodyFormData.append('iban', this.state.iban)
    bodyFormData.append('swiftcode', this.state.swiftCode)
    bodyFormData.append('isdefault', 1)
    axios({
        method: "post",
        url: configData.SERVER_URL + 'partner/account/saveBankAccountDetails',
        data: bodyFormData,
        headers: { 
            "Content-Type": "application/x-www-form-urlencoded",
            "accesstoken" : configData.ACCESSTOKEN,
            "logintoken" : localStorage.getItem('loginToken')
        },
    }).then(resp => {
        if(parseInt(Object.keys(resp.data)[0]) === 200){
            this.setState({
              showBankAccountModal : false,
              account : resp.data.bankaccount,
            });
        }else{
            swal({
                title: "Bank account Information",
                text: resp.data[Object.keys(resp.data)[0]],
                icon: "warning",
                button: "ok",
            })
        }
    }).catch(err => {
        swal({
            title: "Server Not Responding",
            text: "Please try again later",
            icon: "warning",
            button: "ok",
        })
        console.log(err)
    })
  }

  stripeActivation = (e) => {
    axios({
      method: "get",
      url: configData.SERVER_URL + 'partner/account/activatestripe',
      headers: { 
          "Content-Type": "application/x-www-form-urlencoded",
          "accesstoken" : configData.ACCESSTOKEN,
          "logintoken" : localStorage.getItem('loginToken')
      },
  }).then(resp => {
      if(parseInt(Object.keys(resp.data)[0]) === 200){
          console.log(resp.data.accountLink)
          if(resp.data.accountLink) {
            window.location.href = resp.data.accountLink.url
          }else{
            swal({
              title: "Stripe Activation Failed",
              text: "Please try again",
              icon: "warning",
              button: "ok",
            })
          }
      }else{
          swal({
              title: "Stripe Activation Failed",
              text: resp.data[Object.keys(resp.data)[0]],
              icon: "warning",
              button: "ok",
          })
      }
  }).catch(err => {
      swal({
          title: "Server Not Responding",
          text: "Please try again later",
          icon: "warning",
          button: "ok",
      })
      console.log(err)
  })
  }

  render() {
    return (
      <main className="main-content px-[var(--margin-x)] pb-8">
      <div className="flex items-center space-x-4 py-5 lg:py-6">
        <h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">Bank Account</h2>
        <div className="hidden h-full py-1 sm:flex">
          <div className="h-full w-px bg-slate-300 dark:bg-navy-600"></div>
        </div>
        <ul className="hidden flex-wrap items-center space-x-2 sm:flex">
          <li className="flex items-center space-x-2">
            <a className="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent" href="/settings">Settings</a>
            <svg x-ignore xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </li>
          <li>Bank Account</li>
        </ul>
      </div>
      <div className="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6 text-left p-4">
        <div className="col-span-12 sm:col-span-12 mx-4 px-4">
          <div className="card px-4 py-4 sm:px-5">
            <div className="m-2">
              <h2 className="text-lg font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">Bank account</h2>
            </div>
            <div className="m-2">
              <p>Add or edit your default bank account details to display on monthly invoice from Dr. Clinica</p>
            </div>
            <div className="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>
            { this.state.account == null ?
              <div className="m-2">
                <p className="my-1">
                  Please set up your bank account
                </p>
              </div>
              : 
              <div className="m-2">
                <h4 className="text-lg font-semibold">{this.state.account.name} ({this.state.account.type})</h4>
                <p>IBAN: {this.state.account.iban}</p>
                <p>Account No: {this.state.account.accountno}</p>
                <p>SWIFT CODE: {this.state.account.swiftcode}</p>
              </div>
            }
            <div className="m-2">
              <button className="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent" id="showBankAccountModal" onClick={this.handleModalShow}>Edit bank account</button>
            </div>
            { this.state.stripestatus &&  this.state.account != null ? <></> :
              <button class="btn bg-slate-150 font-medium text-slate-800 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200/80 dark:bg-navy-500 dark:text-navy-50 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90" onClick={this.stripeActivation}>
                Please setup your stripe acoount for getting started to receive payouts.
              </button>
            }
          </div>
        </div>
        <div className="col-span-12 sm:col-span-12 mx-4 px-4">
          <div className="card px-4 py-4 sm:px-5">
            <div className="m-2">
              <h2 className="text-lg font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">Sales & fees</h2>
            </div>
            <div className="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>
            <div className="m-2 text-center mt-4 pt-4">
              <i className="fas fa-file fa-6x"></i>
              <h2 className="text-2xl font-semibold">No documents yet</h2>
              <div className="m-2">
                <p>Your monthly invoices and fees will appear here</p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Transactions History */}
        <div className="col-span-12 sm:col-span-12 mx-4 px-4">

          {/* <div className="card px-4 py-4 sm:px-5">
            <div className="m-2">
              <h2 className="text-lg font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">        Account Transactions History</h2>
            </div>
            <div className="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>
              <div  className="is-scrollbar-hidden min-w-full overflow-x-auto"
                x-data="pages.tables.initExample1" >
                <table className="is-hoverable w-full text-left">
                  <thead>
                    <tr>
                      <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Transaction Id#
                      </th>
                      
                      <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Date
                      </th>
                      <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Time
                      </th>
                      <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                       Name
                      </th>
                      <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                       Provider Name
                      </th>
                      <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Service Name
                      </th>
                      <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Client Name
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                     
                      <tr className="border-y border-transparent border-b-slate-200 dark:border-b-navy-500">
                        <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                          #1
                        </td> 
                        <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                          test
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                          text4
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                          text2
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                          text
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                           text
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 sm:px-5 text-center">
                          1
                        </td> 
                      </tr>
                   
                  </tbody>
                </table>
              </div>
            </div> */}
 
          <div className="card px-4 py-4 sm:px-5">
            <div className="m-2">
              <h2 className="text-lg font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">        Account Transactions History</h2>
            </div>
            <div className="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>
            <div className="m-2 text-center mt-4 pt-4">
              <i className="fas fa-file fa-6x"></i>
              <h2 className="text-2xl font-semibold">No documents yet</h2>
              <div className="m-2">
                <p>Your trnsaction history will appear here</p>
              </div>
            </div>
          </div>

        </div>

      {/* Credit Card Transactions History */}
        <div className="col-span-12 sm:col-span-12 mx-4 px-4">

        {/* <div className="card px-4 py-4 sm:px-5">
            <div className="m-2">
              <h2 className="text-lg font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">        Account Transactions History</h2>
            </div>
            <div className="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>
              <div  className="is-scrollbar-hidden min-w-full overflow-x-auto"
                x-data="pages.tables.initExample1" >
                <table className="is-hoverable w-full text-left">
                  <thead>
                    <tr>
                      <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Transaction Id#
                      </th>
                      
                      <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Date
                      </th>
                      <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Time
                      </th>
                      <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                       Name
                      </th>
                      <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                       Provider Name
                      </th>
                      <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Service Name
                      </th>
                      <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Client Name
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                     
                      <tr className="border-y border-transparent border-b-slate-200 dark:border-b-navy-500">
                        <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                          #1
                        </td> 
                        <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                          test
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                          text4
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                          text2
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                          text
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                           text
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 sm:px-5 text-center">
                          1
                        </td> 
                      </tr>
                   
                  </tbody>
                </table>
              </div>
            </div> */}

            
          <div className="card px-4 py-4 sm:px-5">
            <div className="m-2">
              <h2 className="text-lg font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100"> Credit Card Transactions History</h2>
            </div>
            <div className="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>
            <div className="m-2 text-center mt-4 pt-4">
              <i className="fas fa-file fa-6x"></i>
              <h2 className="text-2xl font-semibold">No documents yet</h2>
              <div className="m-2">
                <p>Your credit card trnsaction history will appear here</p>
              </div>
            </div>
          </div>
        </div>


      </div>
      { this.state.showBankAccountModal ? 
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5" role="dialog">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur transition-opacity duration-300" id="showBankAccountModal" onClick={this.handleModalHide}></div>
          <div className="relative w-full max-w-2xl origin-bottom rounded-lg bg-white pb-4 transition-all duration-300 dark:bg-navy-700">
              <div className="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
              <h3 className="text-base font-medium text-slate-700 dark:text-navy-100">Edit bank account</h3>
              <button className="btn -mr-1.5 h-7 w-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25" id="showBankAccountModal" onClick={this.handleModalHide}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" ></path>
                  </svg>
              </button>
              </div>
              <div className="is-scrollbar-hidden min-w-full overflow-x-auto">
                <div className="space-y-4 p-4 sm:p-5 text-left">
                  <label className="block">
                      <span>Account Holder Name*</span>
                      <input className="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Enter account holder name" type="text" id="accountName" value={this.state.accountName} onChange={this.handleInputChange}/>
                  </label>
                  <label className="block">
                      <span>IBAN*</span>
                      <input className="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Enter iban" type="text" id="iban" value={this.state.iban} onChange={this.handleInputChange}/>
                  </label>
                  <label className="block">
                      <span>Account No*</span>
                      <input className="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Enter account number" type="text" id="accountNo" value={this.state.accountNo} onChange={this.handleInputChange}/>
                  </label>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <label className="block">
                          <span>Account Type*</span>
                          <select
                           className="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Cuurent account/ Saving account" type="text" id="accountType" 
                           value={this.state.accountType} onChange={this.handleInputChange}
                          >
                             <option value={"Individual"}>Individual</option>
                             <option value={"Company"}>Company</option>
                        </select>
                          {/* <input className="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Cuurent account/ Saving account" type="text" id="accountType" value={this.state.accountType} onChange={this.handleInputChange}/> */}
                      </label>
                      <label className="block">
                          <span>Swift Code*</span>
                          <input className="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Enter swift code" type="text" id="swiftCode" value={this.state.swiftCode} onChange={this.handleInputChange}/>
                      </label>
                  </div>
              </div>
            </div>
            <div className="text-center">  
              <button className="btn bg-primary btn-color from-sky-400 to-blue-600 font-medium text-white" onClick={this.saveAccountDetails}>Save</button>
            </div>
          </div>
        </div>
        : null
      }
    </main>
    )
  }
}