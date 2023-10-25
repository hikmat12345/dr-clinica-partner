import React from 'react';
import swal from 'sweetalert';
import axios from 'axios';
import configData from '../../utils/constants/config.json'

export default class NotificationSettings extends React.Component{

  constructor(props) {
      super(props)
      this.state = {
        notificationsettings : [],
      }
  }

  componentDidMount () {
    axios({
        method: "get",
        url: configData.SERVER_URL + 'partner/clients/getnotificationsettings',
        headers: { 
            "Content-Type": "application/x-www-form-urlencoded",
            "accesstoken" : configData.ACCESSTOKEN,
            "logintoken" : localStorage.getItem('loginToken')
        },
    }).then(resp => {
        console.log(resp.data)
        if(parseInt(Object.keys(resp.data)[0]) === 200){
          this.setState({
            notificationsettings : resp.data.notificationsettings,
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

  saveBusinessDetails = (e) => {
    e.preventDefault()
    console.log(this.state.partner)
    console.log(this.state.business)
    var bodyFormData = new URLSearchParams()
    bodyFormData.append('notificationsettings',JSON.stringify(this.state.notificationsettings))
    axios({
        method: "post",
        url: configData.SERVER_URL + 'partner/clients/updatenotificationsettings',
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
                    <h2 class="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">Notification Settings</h2>
                    <div class="hidden h-full py-1 sm:flex">
                        <div class="h-full w-px bg-slate-300 dark:bg-navy-600"></div>
                    </div>
                    <ul class="hidden flex-wrap items-center space-x-2 sm:flex">
                        <li class="flex items-center space-x-2">
                            <a class="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent" href="/clients/notificationsettings">Clients</a>
                            <svg x-ignore xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                            </svg>
                        </li>
                        <li>Notification Settings</li>
                    </ul>
                </div>
                <div class="text-right mx-4">
                    <button onClick={this.saveBusinessDetails} class="btn bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90">Save</button>
                </div>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-4 lg:gap-6 m-4 p-4">
              { this.state.notificationsettings.map((notificationsetting) => (
                <div class="card border border-slate-150 px-4 py-4 shadow-none dark:border-navy-600 sm:px-5">
                  <div>
                    <h2 class="text-lg font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">{ notificationsetting.name }</h2>
                  </div>
                  <div class="pt-2">
                    <p>{ notificationsetting.message }</p>
                    <div class="inline-space mt-4 pt-2">
                      <label class="inline-flex items-center space-x-2">
                        <input class="form-checkbox is-outline h-5 w-5 rounded-full border-slate-400/70 before:bg-primary checked:border-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:before:bg-accent dark:checked:border-accent dark:hover:border-accent dark:focus:border-accent" type="checkbox" checked={notificationsetting.isemail}
                        onChange={()=> {
                          notificationsetting.isemail = !notificationsetting.isemail
                          this.setState({
                            notificationsettings : this.state.notificationsettings
                          })
                        }}/>
                        <p>Email</p>
                      </label>
                      {/* <label class="inline-flex items-center space-x-2">
                        <input class="form-checkbox is-outline h-5 w-5 rounded-full border-slate-400/70 before:bg-primary checked:border-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:before:bg-accent dark:checked:border-accent dark:hover:border-accent dark:focus:border-accent" type="checkbox" checked={notificationsetting.ismesaage}
                        onChange={()=> {
                          notificationsetting.ismesaage = !notificationsetting.ismesaage
                          this.setState({
                            notificationsettings : this.state.notificationsettings
                          })
                        }}/>
                        <p>Text</p>
                      </label> */}
                      <label class="inline-flex items-center space-x-2">
                        <input class="form-checkbox is-outline h-5 w-5 rounded-full border-slate-400/70 before:bg-primary checked:border-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:before:bg-accent dark:checked:border-accent dark:hover:border-accent dark:focus:border-accent" type="checkbox" checked={notificationsetting.isapp}
                        onChange={()=> {
                          notificationsetting.isapp = !notificationsetting.isapp
                          this.setState({
                            notificationsettings : this.state.notificationsettings
                          })
                        }}/>
                        <p>App</p>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
        </main>
    )
  }
}