import React from 'react'
import swal from 'sweetalert'
import axios from 'axios'
import configData from '../../utils/constants/config.json'

export default class BookingFees extends React.Component{

    constructor(props) {
        super(props)
        this.state = {
            businessfees : null,
        }
    }

    componentDidMount(){
        axios({
            method: "get",
            url: configData.SERVER_URL + 'partner/account/getBusinessfeesDetails',
            headers: { 
                "Content-Type": "application/x-www-form-urlencoded",
                "accesstoken" : configData.ACCESSTOKEN,
                "logintoken" : localStorage.getItem('loginToken')
            },
        }).then(resp => {
            console.log(resp.data)
            if(parseInt(Object.keys(resp.data)[0]) === 200){
                this.setState({
                    businessfees : resp.data.businessfees,
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

    saveBusinessfees = (e) => {
        if(this.state.businessfees.bookingdeposit < this.state.businessfees.cancellationfees || this.state.businessfees.bookingdeposit < this.state.businessfees.unattentedFees){
            swal({
                title: "Booking fees",
                text: "Booking deposit must be more than cancellation fees and unattended fee",
                icon: "warning",
                button: "ok",
            })
            return
        }
        e.preventDefault()
        var bodyFormData = new URLSearchParams()
        bodyFormData.append('businessfees', JSON.stringify(this.state.businessfees))
        axios({
            method: "post",
            url: configData.SERVER_URL + 'partner/account/saveBusinessfeesDetails',
            data : bodyFormData,
            headers: { 
                "Content-Type": "application/x-www-form-urlencoded",
                "accesstoken" : configData.ACCESSTOKEN,
                "logintoken" : localStorage.getItem('loginToken')
            },
        }).then(resp => {
            console.log(resp.data)
            if(parseInt(Object.keys(resp.data)[0]) === 200){
                swal({
                    title: "Booking Fees",
                    text: "Booking Fees Saved Successfully",
                    icon: "success",
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
            <main class="main-content px-[var(--margin-x)] pb-8">
                <div class="flex items-center space-x-4 py-5 lg:py-6">
                <h2 class="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">Deposits & Cancellation Fees</h2>
                <div class="hidden h-full py-1 sm:flex">
                    <div class="h-full w-px bg-slate-300 dark:bg-navy-600"></div>
                </div>
                <ul class="hidden flex-wrap items-center space-x-2 sm:flex">
                    <li class="flex items-center space-x-2">
                    <a class="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent" href="/settings">Settings</a>
                    <svg x-ignore xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                    </li>
                    <li>Deposits & Cancellation Fees</li>
                </ul>
                </div>
                { this.state.businessfees == null ? null :
                    <div class="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-1 lg:gap-6 text-left mt-4">
                        <div class="card rounded-2xl max-w-2xl px-4 py-4 sm:px-5">
                            <div class="mt-4">
                                <h2 class="text-lg font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">
                                    Deposits & Cancellation Fees
                                </h2>
                            </div>
                            <div class="pt-2 mt-4">
                                <label class="flex w-full items-center justify-between space-x-2">
                                    <span class="w-full">Fixed deposit for online booking</span>
                                   
                                    <label class="flex w-full">
                                        <div class="flex items-center justify-center rounded-l-lg border border-slate-300 px-3.5 font-inter dark:border-navy-450">
                                            <span>AED</span>
                                        </div>
                                        <input class="form-input w-full border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"  type="number" value={this.state.businessfees.bookingdeposit}
                                                onChange={(e) => {
                                                this.state.businessfees.bookingdeposit = e.currentTarget.value
                                                this.setState({
                                                    businessfees : this.state.businessfees
                                                })
                                                }}/> 
                                    </label>
                                </label>
 


                            </div>
                            <div class="pt-2 mt-4">
                                <label class="flex w-full items-center justify-between space-x-2">
                                    <span class="w-full">Cancellation Appointment fee</span>
                                    
                                    <label class="flex w-full">
                                        <div class="flex items-center justify-center rounded-l-lg border border-slate-300 px-3.5 font-inter dark:border-navy-450">
                                            <span>AED</span>
                                        </div>
                                        <input class="form-input w-full border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" type="number"
                                          value={this.state.businessfees.cancellationfees}
                                          onChange={(e) => {
                                          this.state.businessfees.cancellationfees = e.currentTarget.value
                                          this.setState({
                                              businessfees : this.state.businessfees
                                          })
                                          }}
                                         /> 
                                    </label>
                                </label>
                            </div>
                            <div class="pt-2 mt-4">
                                <label class="flex w-full items-center justify-between space-x-2">
                                    <span class="w-full">Unattended Appointment fee</span>
                                    

                                    <label class="flex w-full">
                                        <div class="flex items-center justify-center rounded-l-lg border border-slate-300 px-3.5 font-inter dark:border-navy-450">
                                            <span>AED</span>
                                        </div>
                                        <input class="form-input w-full border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                                          value={this.state.businessfees.unattentedFees}
                                          onChange={(e) => {
                                          this.state.businessfees.unattentedFees = e.currentTarget.value
                                          this.setState({
                                              businessfees : this.state.businessfees
                                           })
                                          }}
                                        /> 
                                    </label>
                                </label>
                            </div>
                            <div class="pt-2 mt-4 text-right">
                                <button class="btn space-x-2 bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90" onClick={this.saveBusinessfees}>
                                    <span>Save</span>
                                </button>
                            </div>
                        </div>
                    </div>
                }
            </main>
        )
    }
}