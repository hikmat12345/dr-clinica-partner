import React from 'react';
import swal from 'sweetalert';
import axios from 'axios';
import configData from '../../utils/constants/config.json'

export default class Locations extends React.Component{

  constructor(props) {
      super(props)
      this.state = {
        branches : [],
        selectedMonth:1,
        selectedBranchId:null
      }
  }

  componentDidMount () {
    axios({
        method: "get",
        url: configData.SERVER_URL + 'partner/businesssetup/getBranches',
        headers: { 
            "Content-Type": "application/x-www-form-urlencoded",
            "accesstoken" : configData.ACCESSTOKEN,
            "logintoken" : localStorage.getItem('loginToken')
        },
    }).then(resp => {
        console.log(resp.data)
        if(parseInt(Object.keys(resp.data)[0]) === 200){
          this.setState({
            branches : resp.data.branches,
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

  editBranch(branchid){
    // e.preventDefault()
    localStorage.setItem('selectedBranch', branchid)
    window.location = "/account/editbranch"
  }
    modalShow = (e) => { 
     
     this.setState({showMonthModal:true}) 
};

  modalHide = (e) => {
  e.preventDefault();
  this.setState({showMonthModal:false}) };

  promote=()=>{
    
    const savedToken = localStorage.getItem('loginToken')
    const successURL = `https://partner.drclinica.com/payment-success?session_id={CHECKOUT_SESSION_ID}&branchId=${this .state.selectedBranchId}&noOfMonths=${this.state.selectedMonth}&indicator=branch`;
    const cancelled = `https://partner.drclinica.com/cancelled`;
    
    const paymentFor="FeaturedClinic"
    var urlencoded = new URLSearchParams() 
    urlencoded.append("successURL", successURL);
    urlencoded.append("cancelURL", cancelled);
    urlencoded.append("paymentFor", paymentFor);
    urlencoded.append("noOfMonths", this.state.selectedMonth);
    axios({
            method: "post",
            url: configData.SERVER_URL + `partner/promotion/create-stripe-session`,
            data: urlencoded,
            headers: { 
                "Content-Type": "application/x-www-form-urlencoded",
                "accesstoken" : configData.ACCESSTOKEN,
                "logintoken" : savedToken
            },
        }).then(resp => {
            if(parseInt(Object.keys(resp.data)[0]) === 200){
                 window.location.href = resp.data.session.url
              }else{
                swal({
                  text: resp.data[Object.keys(resp.data)[0]],
                  title: "Server Not Responding",
                  icon: "warning",
                  button: "ok",
                });
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
      <main class="main-content px-[var(--margin-x)] pb-8 m-4">
        <div class="items-center justify-between">
            <div class="flex items-center space-x-4 py-5 lg:py-6">
              <h2 class="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">Branches</h2>
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
                <li>Branches</li>
              </ul>
            </div>
            <div class="text-right" style={{marginRight:"5%",marginBottom:"2%"}}>
              <a href="/account/addbranch" class="btn bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90">Add New</a>
            </div>
          </div>
        <div class="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-1 lg:gap-6 text-left">
          {this.state.branches.map((branch) => ( 
            <div id={branch.id} class="card p-4 m-4" style={{marginLeft:"5%",marginRight:"5%"}} >
            {branch?.status==1 ?<div style={{position: "absolute",  right: "17px"}}><span style={{position: "relative", top: "-3px"}}>Not Active</span> <i style={{color: "red", fontSize: "22px"}} className="fa fa-minus-circle" aria-hidden="true"></i></div>:<div style={{position: "absolute",  right: "17px"}}><span style={{position: "relative", top: "-3px"}}>Active</span> <i style={{color: "#0bdf0b", fontSize: "22px"}} className="fa fa-check-circle" aria-hidden="true"></i></div>}
             <div onClick={()=>{this.setState({selectedBranchId:branch.id}); this.modalShow()}} style={{position: "absolute", top:"52px", right: "17px", cursor:"pointer", color:"blue",}}><span style={{position: "relative",   textDecoration:"underline"}}>Promote Clinic  <i class="fa-solid fa-bullhorn pl-3 fa-1x"></i></span></div>
  
              <div onClick={()=>this.editBranch(branch.id)} style={{cursor:"pointer"}} class="flex justify-between space-x-2 p-4 m-4">
                <i class='fa-solid fa-shop fa-6x'></i>
                <div class="flex flex-1 flex-col justify-between px-4">
                  <div class="">
                    <a href="#" class="font-medium text-slate-700 outline-none transition-colors line-clamp-2 hover:text-primary focus:text-primary dark:text-navy-100 dark:hover:text-accent-light dark:focus:text-accent-light">{branch.name}</a>
                    <a href="#" class="text-xs text-slate-400 hover:text-slate-800 dark:text-navy-300 dark:hover:text-navy-100">{branch.email}</a>
                    <a href="#" class="text-xs text-slate-400 line-clamp-2 hover:text-slate-800 dark:text-navy-300 dark:hover:text-navy-100">{branch.phone}</a>
                    <a href="#" class="text-xs text-slate-400 line-clamp-2 hover:text-slate-800 dark:text-navy-300 dark:hover:text-navy-100">{branch.address}</a>
                  </div>
                  <div class="flex items-center space-x-2 text-xs mt-2">
                    <div class="flex shrink-0 items-center space-x-1">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5 text-slate-400 dark:text-navy-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <p>10h 32m</p>
                    </div>
                    <div class="mx-2 my-1 w-px self-stretch bg-slate-200 dark:bg-navy-500"></div>
                    <span class="line-clamp-1">{branch.teammember.length} Team Members</span>
                  </div>
                </div>
                <label class="flex items-center space-x-2" style={{cursor:"pointer"}} onClick={()=>this.editBranch(branch.id)}>
                    <span>View</span> 
                    <span class="text-xs text-slate-400 dark:text-navy-300">
                       <span><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg></span>
                    </span>
                </label>
              </div>
            </div>
          ))}
        </div>

        {this.state.showMonthModal ? (
          <div
            class="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
            role="dialog"
          >
            <div
              class="absolute inset-0 bg-slate-900/60 backdrop-blur transition-opacity duration-300"
              id="showMonthModal"
              onClick={this.modalHide}
            ></div>
            <div class="relative w-full max-w-2xl origin-bottom rounded-lg bg-white pb-4 transition-all duration-300 dark:bg-navy-700">
              <div class="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
                <h3 class="text-base font-medium text-slate-700 dark:text-navy-100">
                  Select number of month
                </h3>
                <button
                  class="btn -mr-1.5 h-7 w-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                  id="showMonthModal"
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

              <div class="is-scrollbar-hidden min-w-full overflow-x-auto">
              <span className="pb-3"> Payment For</span>
                 <input
                 style={{width:"94%", margin:"auto", display:"block"}}
                    className="mt-1.5 mx-3 mr-4 w-full rounded-lg border border-slate-300 bg-transparent  px-3 py-2"
                    id="category"
                    readOnly={true}
                   value="Featured Clinic" /> 
              </div>
              <div class=" mt-3 is-scrollbar-hidden min-w-full overflow-x-auto">
              <span className="pb-3">Select Number of month</span>
                 <select
                 style={{width:"94%", margin:"auto", display:"block"}}
                    className="mt-1.5 mx-3 mr-4 w-full rounded-lg border border-slate-300 bg-transparent  px-3 py-2"
                    id="category"

                    onChange={(e) => { this.setState({selectedMonth: e.target.value})}}>
                      <option value={0}>Select Number of month</option>
                      {Array.from([1,2,3,4,5,6,7,8,9,10,11,12]).map((month)=>{
                      return (<option value={month}>{month}</option>)})}
                  </select> 
              </div>
            
              <div class="is-scrollbar-hidden overflow-x-auto">
              <span className="pb-3">Total Calculated Payment</span>
                 <div
                 style={{ fontWeight:"bold"}}>
                   <h3>AED {parseInt(this.state.selectedMonth) * (1000)}</h3>
                   </div> 
              </div>
              
              <div class="text-center mt-2">
                
                <button
                  class="btn bg-primary btn-color from-sky-400 to-blue-600 font-medium text-white m-2"
                  id="showMonthModal"
                  onClick={this.modalHide}
                >
                  Close
                </button>
                <button
                  class="btn bg-primary btn-color from-sky-400 to-blue-600 font-medium text-white m-2"
                  onClick={this.promote}
                >
                Pay Now
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    )
  }
}