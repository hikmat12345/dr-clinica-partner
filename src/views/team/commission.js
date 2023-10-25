import React from 'react'
import swal from 'sweetalert'
import axios from 'axios'
import configData from '../../utils/constants/config.json'

export default class Commission extends React.Component{

    constructor(props) {
        super(props)
        this.state = {
            withdiscount : false,
            withtax : false,
            commission : null,
        }
    }

    componentDidMount(){
        axios({
            method: "get",
            url: configData.SERVER_URL + 'partner/team/getCommission',
            headers: { 
                "Content-Type": "application/x-www-form-urlencoded",
                "accesstoken" : configData.ACCESSTOKEN,
                "logintoken" : localStorage.getItem('loginToken')
            },
        }).then(resp => {
            console.log(resp.data)
            if(parseInt(Object.keys(resp.data)[0]) === 200){
                this.setState({
                    commission : resp.data.commission,
                    withdiscount : resp.data.commission.withdiscount == 1 ? true : false,
                    withtax : resp.data.commission.withtax == 1 ? true : false
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

    saveCommission = (e) => {
        e.preventDefault()
        console.log(this.state.withdiscount)
        console.log(this.state.withtax)
        var bodyFormData = new URLSearchParams()
        bodyFormData.append('id', this.state.commission.id)
        bodyFormData.append('withdiscount', this.state.withdiscount ? 1 : 0)
        bodyFormData.append('withtax', this.state.withtax ? 1 : 0)
        axios({
            method: "post",
            url: configData.SERVER_URL + 'partner/team/updateCommission',
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
                    title: "Commission",
                    text: "Commission Saved Successfully",
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
                <h2 class="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">Commission</h2>
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
                    <li>Commission</li>
                </ul>
                </div>
                <div class="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-1 lg:gap-6 text-left mt-4">
                    <div class="card rounded-2xl max-w-2xl px-4 py-4 sm:px-5">
                        <div class="mt-4">
                            <h2 class="text-lg font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">
                                Commission
                            </h2>
                        </div>
                        <div class="pt-2 mt-4">
                            <label class="inline-flex items-center space-x-2">
                                <input class="form-switch h-5 w-10 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-accent dark:checked:before:bg-white" type="checkbox" checked={this.state.withdiscount}
                                    onChange={()=>{
                                        this.setState(({ withdiscount }) => ({ withdiscount: !withdiscount }))
                                    }}/>
                                <span>Calculate by item sale price before discount</span>
                            </label>
                        </div>
                        <div class="pt-2 mt-4">
                            <label class="inline-flex items-center space-x-2">
                                <input class="form-switch h-5 w-10 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-accent dark:checked:before:bg-white" type="checkbox" checked={this.state.withtax}
                                    onChange={()=>{
                                        this.setState(({ withtax }) => ({ withtax: !withtax }))
                                    }}/>
                                <span>Calculate by item sale price before tax</span>
                            </label>
                        </div>
                        <div class="pt-2 mt-4 text-right">
                            <button class="btn space-x-2 bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90" onClick={this.saveCommission}>
                                <span>Save</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        )
    }
}