import React from 'react';
import swal from 'sweetalert';
import axios from 'axios';
import configData from '../../utils/constants/config.json'
import  axiosClient from '../../utils/helpers/server'

export default class VoucherSettigns extends React.Component{

  constructor(props) {
      super(props)
      this.state = {
        voucherSettings : null,
      }
  }

  componentDidMount () {
    axiosClient.get("partner/vouchers/getvouchersettings/").then(resp => {
        console.log(resp)
        if(parseInt(Object.keys(resp.data)[0]) === 200){
            this.setState ({
                voucherSettings : resp.data.vouchersettings
            })
        }else{
          swal({
              title: "Get Voucher Settigns",
              text: resp.data[Object.keys(resp.data)[0]],
              icon: "warning",
              button: "ok",
          })
        }
    })
  }

  saveBusinessDetails = (e) => {
    e.preventDefault()
    var bodyFormData = new URLSearchParams()
    bodyFormData.append('vouchersettings', JSON.stringify(this.state.voucherSettings))
    axiosClient.post("partner/vouchers/updatevouchersettings/",bodyFormData).then(resp => {
        console.log(resp)
        if(parseInt(Object.keys(resp.data)[0]) === 200){
            swal({
                title: "Update Voucher Settings",
                text: resp.data[Object.keys(resp.data)[0]],
                icon: "success",
                button: "ok",
            })
        }else{
          swal({
              title: "Update Voucher Settings",
              text: resp.data[Object.keys(resp.data)[0]],
              icon: "warning",
              button: "ok",
          })
        }
    })
  }

  render() {
    return (
        <main class="main-content px-[var(--margin-x)] pb-8">
            <div class="items-center justify-between">
                <div class="flex items-center space-x-4 py-5 lg:py-6">
                    <h2 class="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">Voucher Settings</h2>
                    <div class="hidden h-full py-1 sm:flex">
                        <div class="h-full w-px bg-slate-300 dark:bg-navy-600"></div>
                    </div>
                    <ul class="hidden flex-wrap items-center space-x-2 sm:flex">
                        <li class="flex items-center space-x-2">
                            <a class="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent" href="/services/servicelist">Services</a>
                            <svg x-ignore xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                            </svg>
                        </li>
                        <li>Voucher Settings</li>
                    </ul>
                </div>
                <div class="text-right mx-4">
                    <button onClick={this.saveBusinessDetails} class="btn bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90">Save</button>
                </div>
            </div>
            { this.state.voucherSettings != null ? 
              <div>
                <div class="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6 text-left p-4">
                  <div class="col-span-12 sm:col-span-6 m-4 p-4">
                      <h2 class="text-2xl font-semibold">Default expiry period</h2>
                      <p class="max-w-2xl mt-4">You can set the default business vouchers expiry time from here. It will helps to create vouchers faster.</p>
                  </div>
                  <div class="col-span-12 sm:col-span-6 m-4">
                    <div class="card px-4 py-4 sm:px-5">
                      <div class="pt-2 pb-4">
                        <label class="block">
                            <span>Default expiry period</span>
                            <select value={this.state.voucherSettings.expirytime} class="form-select mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent" 
                            onChange={(e)=>{
                                this.state.voucherSettings.expirytime = e.currentTarget.value
                                    this.setState({
                                        voucherSettings : this.state.voucherSettings 
                                    })
                            }}>
                                <option value="1">1 Month</option>
                                <option value="2">2 Month</option>
                                <option value="3">3 Month</option>
                                <option value="4">4 Month</option>
                                <option value="6">6 Month</option>
                                <option value="12">12 Month</option>
                                <option value="24">24 Month</option>
                                <option value="48">48 Month</option>
                                <option value="72">72 Month</option>
                                <option value="null">Never</option>
                            </select>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6 text-left p-4">
                  <div class="col-span-12 sm:col-span-6 m-4 p-4">
                      <h2 class="text-2xl font-semibold">Voucher redeem settings</h2>
                      <p class="max-w-2xl mt-4">Choose the places where you want your customer to redeemed the vouchers.</p>
                  </div>
                  <div class="col-span-12 sm:col-span-6 m-4">
                    <div class="card px-4 py-4 sm:px-5">
                      <div class="pt-2 pb-4">
                        <label class="inline-flex items-center space-x-2">
                            <input class="form-switch h-5 w-10 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-accent dark:checked:before:bg-white" type="checkbox" value="true"  checked={this.state.voucherSettings.onlineredeem} 
                            onChange={()=>{
                                this.state.voucherSettings.onlineredeem = !this.state.voucherSettings.onlineredeem 
                                    this.setState({
                                        voucherSettings : this.state.voucherSettings 
                                    })
                            }}/>
                            <span>Online Redeem</span>
                        </label>
                      </div>
                      <div class="pt-2 pb-4">
                        <label class="inline-flex items-center space-x-2">
                            <input class="form-switch h-5 w-10 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-accent dark:checked:before:bg-white" type="checkbox" value="true"  checked={this.state.voucherSettings.instoreredeem} 
                            onChange={()=>{
                                this.state.voucherSettings.instoreredeem = !this.state.voucherSettings.instoreredeem 
                                    this.setState({
                                        voucherSettings : this.state.voucherSettings 
                                    })
                            }}/>
                            <span>In-Clinic Redeem</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6 text-left p-4">
                  <div class="col-span-12 sm:col-span-6 m-4 p-4">
                      <h2 class="text-2xl font-semibold">Voucher sale settings</h2>
                      <p class="max-w-2xl mt-4">Choose the places where you want your customer to buy the vouchers.</p>
                  </div>
                  <div class="col-span-12 sm:col-span-6 m-4">
                    <div class="card px-4 py-4 sm:px-5">
                      <div class="pt-2 pb-4">
                        <label class="inline-flex items-center space-x-2">
                            <input class="form-switch h-5 w-10 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-accent dark:checked:before:bg-white" type="checkbox" value="true"  checked={this.state.voucherSettings.onlinesale} 
                            onChange={()=>{
                                this.state.voucherSettings.onlinesale = !this.state.voucherSettings.onlinesale 
                                    this.setState({
                                        voucherSettings : this.state.voucherSettings 
                                    })
                            }}/>
                            <span>Online Sale</span>
                        </label>
                      </div>
                      <div class="pt-2 pb-4">
                        <label class="inline-flex items-center space-x-2">
                            <input class="form-switch h-5 w-10 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-accent dark:checked:before:bg-white" type="checkbox" value="true"  checked={this.state.voucherSettings.instoresale} 
                            onChange={()=>{
                                this.state.voucherSettings.instoresale = !this.state.voucherSettings.instoresale 
                                    this.setState({
                                        voucherSettings : this.state.voucherSettings 
                                    })
                            }}/>
                            <span>In-Clinic Sale</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>


              </div>
              
            : null
            }
        </main>
    )
  }
}