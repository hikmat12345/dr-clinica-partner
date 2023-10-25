import React from 'react';
import swal from 'sweetalert';
import axios from 'axios';
import configData from '../../utils/constants/config.json'
  
export default class OnlineBooking extends React.Component{

  constructor(props) {
      super(props)
      this.state = {
        onlinebooking : null,
        isemailteammember : false,
        isemailspecificaddress : false,
        displayrating : false,
      }
  }

  componentDidMount () {
    axios({
        method: "get",
        url: configData.SERVER_URL + 'partner/onlinebooking/getonlinebooking',
        headers: { 
            "Content-Type": "application/x-www-form-urlencoded",
            "accesstoken" : configData.ACCESSTOKEN,
            "logintoken" : localStorage.getItem('loginToken')
        },
    }).then(resp => {
        console.log(resp.data)
        if(parseInt(Object.keys(resp.data)[0]) === 200){
          this.setState({
            onlinebooking : resp.data.onlinebooking,
            isemailspecificaddress : resp.data.onlinebooking.isemailspecificaddress,
            isemailteammember : resp.data.onlinebooking.isemailteammember,
            displayrating : resp.data.onlinebooking.displayrating
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

  saveOnlineBookingDetails = (e) => {
    e.preventDefault()
    var bodyFormData = new URLSearchParams()
    bodyFormData.append('id', this.state.onlinebooking.id)
    bodyFormData.append('reschedulelimit', this.state.onlinebooking.reschedulelimit)
    bodyFormData.append('bookinglimit', this.state.onlinebooking.bookinglimit)
    bodyFormData.append('futurebookinglimit', this.state.onlinebooking.futurebookinglimit)
    bodyFormData.append('timeslot', this.state.onlinebooking.timeslot)
    bodyFormData.append('importantinfo', this.state.onlinebooking.importantinfo)
    bodyFormData.append('isemailteammember', this.state.isemailteammember ? 1 : 0)
    bodyFormData.append('isemailspecificaddress', this.state.isemailspecificaddress ? 1 : 0)
    bodyFormData.append('email', this.state.onlinebooking.email)
    bodyFormData.append('displayrating', this.state.displayrating ? 1 : 0)
    axios({
        method: "post",
        url: configData.SERVER_URL + 'partner/onlinebooking/saveonlinebooking',
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
                title: "Account Details",
                text: "Account Details Saved Successfully",
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
            <div class="items-center justify-between">
                <div class="flex items-center space-x-4 py-5 lg:py-6">
                    <h2 class="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">Online Booking</h2>
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
                        <li>Online Booking</li>
                    </ul>
                </div>
                <div class="text-right mx-4">
                    <button onClick={this.saveOnlineBookingDetails} class="btn bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90">Save</button>
                </div>
            </div>
            { this.state.onlinebooking != null ? 
              <div>
                <div class="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6 text-left p-4">
                  <div class="col-span-12 sm:col-span-6 m-4 p-4">
                      <h2 class="text-2xl font-semibold">Online cancellation and rescheduling</h2>
                      <p class="max-w-2xl mt-4">Set how far in advance clients can cancel or reschedule, after this timeframe clients must call to change their appointment.</p>
                  </div>
                  <div class="col-span-12 sm:col-span-6 m-4">
                    <div class="card px-4 py-4 sm:px-5">
                      <div class="pt-2 pb-4">
                        <label class="block">
                            <span>Clients can cancel or reschedule online</span>
                            <select class="form-select mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
                                onChange={(e) => {
                                  this.state.onlinebooking.reschedulelimit = e.currentTarget.value
                                  this.setState({
                                    onlinebooking : this.state.onlinebooking
                                  })
                                }}>
                              <option hidden selected>Upto {this.state.onlinebooking.reschedulelimit} hour in advance</option>
                              <option value="1">Upto 1 hour in advance</option>
                              <option value="2">Upto 2 hour in advance</option>
                              <option value="3">Upto 3 hour in advance</option>
                              <option value="4">Upto 4 hour in advance</option>
                              <option value="5">Upto 5 hour in advance</option>
                              <option value="6">Upto 6 hour in advance</option>
                              <option value="12">Upto 12 hour in advance</option>
                              <option value="24">Upto 24 hour in advance</option>
                              <option value="48">Upto 48 hour in advance</option>
                              <option value="72">Upto 72 hour in advance</option>
                            </select>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6 text-left p-4">
                  <div class="col-span-12 sm:col-span-6 m-4 p-4">
                      <h2 class="text-2xl font-semibold">Online booking availability</h2>
                      <p class="max-w-2xl mt-4">Set how far in advance clients can book online, and lead time for when clients can cancel or reschedule.</p>
                  </div>
                  <div class="col-span-12 sm:col-span-6 m-4">
                    <div class="card px-4 py-4 sm:px-5">
                      <div class="pt-2 pb-4">
                        <label class="block">
                            <span>Clients can book appointments online</span>
                            <select class="form-select mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
                                onChange={(e) => {
                                  this.state.onlinebooking.bookinglimit = e.currentTarget.value
                                  this.setState({
                                    onlinebooking : this.state.onlinebooking
                                  })
                                }}>
                              <option hidden selected>Upto {this.state.onlinebooking.bookinglimit} hour before start time</option>
                              <option value="1">Upto 1 hour before start time</option>
                              <option value="2">Upto 2 hour before start time</option>
                              <option value="3">Upto 3 hour before start time</option>
                              <option value="4">Upto 4 hour before start time</option>
                              <option value="5">Upto 5 hour before start time</option>
                              <option value="6">Upto 6 hour before start time</option>
                              <option value="12">Upto 12 hour before start time</option>
                              <option value="24">Upto 24 hour before start time</option>
                              <option value="48">Upto 48 hour before start time</option>
                              <option value="72">Upto 72 hour before start time</option>
                            </select>
                        </label>
                      </div>
                      <div class="pt-2 pb-4">
                        <label class="block">
                            <span>Clients can book future appointments online</span>
                            <select class="form-select mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
                                onChange={(e) => {
                                  this.state.onlinebooking.futurebookinglimit = e.currentTarget.value
                                  this.setState({
                                    onlinebooking : this.state.onlinebooking
                                  })
                                }}>
                              <option hidden selected>No more than {this.state.onlinebooking.futurebookinglimit} months in the future</option>
                              <option value="1">No more than 1 months in the future</option>
                              <option value="2">No more than 2 months in the future</option>
                              <option value="3">No more than 3 months in the future</option>
                              <option value="4">No more than 4 months in the future</option>
                              <option value="5">No more than 5 months in the future</option>
                              <option value="6">No more than 6 months in the future</option>
                              <option value="12">No more than 12 months in the future</option>
                              <option value="24">No more than 24 months in the future</option>
                              <option value="48">No more than 48 months in the future</option>
                              <option value="72">No more than 72 months in the future</option>
                            </select>
                        </label>
                      </div>
                      <div class="pt-2 pb-4">
                        <label class="block">
                            <span>Time slot interval</span>
                            <select class="form-select mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
                                onChange={(e) => {
                                  this.state.onlinebooking.timeslot = e.currentTarget.value
                                  this.setState({
                                    onlinebooking : this.state.onlinebooking
                                  })
                                }}>
                              <option hidden selected>{this.state.onlinebooking.timeslot} minutes</option>
                              <option value="10">10 minutes</option>
                              <option value="15">15 minutes</option>
                              <option value="20">20 minutes</option>
                              <option value="30">30 minutes</option>
                              <option value="45">45 minutes</option>
                              <option value="60">60 minutes</option>
                            </select>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6 text-left p-4">
                  <div class="col-span-12 sm:col-span-6 m-4 p-4">
                      <h2 class="text-2xl font-semibold">Important info</h2>
                      <p class="max-w-2xl mt-4">Add important info you’d like clients to see at checkout when booking an appointment or buying a voucher or membership.</p>
                  </div>
                  <div class="col-span-12 sm:col-span-6 m-4">
                    <div class="card px-4 py-4 sm:px-5">
                      <div class="pt-2 pb-4">
                        <label class="block">
                            <span>Important info</span>
                            <textarea rows="4" class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" type="text" value={this.state.onlinebooking.importantinfo}
                            onChange={(e) => {
                              this.state.onlinebooking.importantinfo = e.currentTarget.value
                              this.setState({
                                onlinebooking : this.state.onlinebooking
                              })
                            }}></textarea>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6 text-left p-4">
                  <div class="col-span-12 sm:col-span-6 m-4 p-4">
                      <h2 class="text-2xl font-semibold">Online booking activity emails</h2>
                      <p class="max-w-2xl mt-4">Receive emails when clients use online booking to book, reschedule or cancel. These emails are sent in addition to regular team members notifications.</p>
                  </div>
                  <div class="col-span-12 sm:col-span-6 m-4">
                    <div class="card px-4 py-4 sm:px-5">
                      <div class="pt-2 pb-4">
                        <label class="inline-flex items-center space-x-2">
                            <input class="form-switch h-5 w-10 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-accent dark:checked:before:bg-white" type="checkbox" value="true"  checked={this.state.isemailteammember} 
                            onChange={()=>{
                                    this.setState(({ isemailteammember }) => ({ isemailteammember: !isemailteammember }))
                            }}/>
                            <span>Send to team members booked</span>
                        </label>
                      </div>
                      <div class="pt-2 pb-4">
                        <label class="inline-flex items-center space-x-2">
                            <input class="form-switch h-5 w-10 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-accent dark:checked:before:bg-white" type="checkbox" checked={this.state.isemailspecificaddress} 
                            onChange={()=>{
                                    this.setState(({ isemailspecificaddress }) => ({ isemailspecificaddress: !isemailspecificaddress }))
                            }}/>
                            <span>Send to specific email address</span>
                        </label>
                      </div>
                      <div class="pt-2 pb-4">
                        <label class="block">
                            <span>Specific email addresses</span>
                            <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" type="text" value={this.state.onlinebooking.email}
                            onChange={(e) => {
                              this.state.onlinebooking.email = e.currentTarget.value
                              this.setState({
                                onlinebooking : this.state.onlinebooking
                              })
                            }}/>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6 text-left p-4">
                  <div class="col-span-12 sm:col-span-6 m-4 p-4">
                      <h2 class="text-2xl font-semibold">Star ratings</h2>
                      <p class="max-w-2xl mt-4">Show how great your team are by displaying average star ratings next to their names, it's proven to attract more clients online.</p>
                  </div>
                  <div class="col-span-12 sm:col-span-6 m-4">
                    <div class="card px-4 py-4 sm:px-5">
                      <div class="pt-2 pb-4">
                        <label class="inline-flex items-center space-x-2">
                            <input class="form-switch h-5 w-10 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-accent dark:checked:before:bg-white" type="checkbox" value="true"  checked={this.state.displayrating} 
                            onChange={()=>{
                                    this.setState(({ displayrating }) => ({ displayrating: !displayrating }))
                            }}/>
                            <span>Display star rating for team members</span>
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