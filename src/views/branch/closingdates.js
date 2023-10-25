import React from 'react'
import swal from 'sweetalert'
import axios from 'axios'
import configData from '../../utils/constants/config.json'
import moment from 'moment'
import { ToastContainer, toast } from 'react-toastify'

export default class ClosingDates extends React.Component{

  constructor(props) {
    super(props)
    this.state = {
      tacbleAction : "popper-root",
      businessholidays : [],
      page : 1,
      businessholidaysCount : 0,
      pageRecordCount : 5,
      totalPages : 0,
      date : "",
      isholiday : 1,
      addClosingDateModal : false,
      editClosingDateModal : false,
      selectedDate : "",
      selectedDateId : "",
      selectedHoliday : true
    }
  }

  componentDidMount () {
      axios({
          method: "get",
          url: configData.SERVER_URL + 'partner/businesssetup/getClosingDates/1/'+this.state.pageRecordCount,
          headers: { 
              "Content-Type": "application/x-www-form-urlencoded",
              "accesstoken" : configData.ACCESSTOKEN,
              "logintoken" : localStorage.getItem('loginToken')
          },
      }).then(resp => {
          console.log(resp.data)
          if(parseInt(Object.keys(resp.data)[0]) === 200){
            this.setState({
                businessholidays : resp.data.businessholidays,
                page : resp.data.page,
                businessholidaysCount : resp.data.businessholidaysCount,
                pageRecordCount : resp.data.pageRecordCount,
                totalPages : resp.data.totalPages
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

  handlePageChange = (e) => {
    e.preventDefault()
    axios({
        method: "get",
        url: configData.SERVER_URL + 'partner/businesssetup/getClosingDates/'+e.currentTarget.getAttribute("data-page")+'/'+this.state.pageRecordCount,
        headers: { 
            "Content-Type": "application/x-www-form-urlencoded",
            "accesstoken" : configData.ACCESSTOKEN,
            "logintoken" : localStorage.getItem('loginToken')
        },
    }).then(resp => {
        console.log(resp.data)
        if(parseInt(Object.keys(resp.data)[0]) === 200){
          this.setState({
            teammembers : resp.data.teammember,
            page : resp.data.page,
            teammemberCount : resp.data.teammemberCount,
            pageRecordCount : resp.data.pageRecordCount,
            totalPages : resp.data.totalPages
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

  handleRecordCountChange = (e) => {
    e.preventDefault()
    axios({
        method: "get",
        url: configData.SERVER_URL + 'partner/businesssetup/getClosingDates/'+this.state.page+'/'+e.currentTarget.value,
        headers: { 
            "Content-Type": "application/x-www-form-urlencoded",
            "accesstoken" : configData.ACCESSTOKEN,
            "logintoken" : localStorage.getItem('loginToken')
        },
    }).then(resp => {
        console.log(resp.data)
        if(parseInt(Object.keys(resp.data)[0]) === 200){
          this.setState({
            teammembers : resp.data.teammember,
            page : resp.data.page,
            teammemberCount : resp.data.teammemberCount,
            pageRecordCount : resp.data.pageRecordCount,
            totalPages : resp.data.totalPages
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

  onToggletableAction = (e) => {
      if(this.state.tacbleAction == "popper-root"){
          this.setState({
              tacbleAction : "popper-root show"
          })
      }else{
          this.setState({
              tacbleAction : "popper-root"
          })
      }
  }

  handleModalShow = (e) => {
    e.preventDefault()
    this.setState({
        [e.currentTarget.id] : true,
    })
  }

  handleModalHide = (e) => {
    e.preventDefault()
    this.setState({
        [e.currentTarget.id] : false,
    })
  }

  saveClosingDate = (e) => {
    e.preventDefault()
    let holiday = 0
    if(document.getElementById("isholiday").checked){
        holiday = 1
    }
    if(document.getElementById('date').value == ""){
        document.getElementById('date').focus()
        return
    }
    var bodyFormData = new URLSearchParams()
    bodyFormData.append('date', document.getElementById("date").value)
    bodyFormData.append('isholiday', holiday)
    axios({
        method: "post",
        url: configData.SERVER_URL + 'partner/businesssetup/saveClosingDates/'+this.state.page+'/'+this.state.pageRecordCount,
        data : bodyFormData,
        headers: { 
            "Content-Type": "application/x-www-form-urlencoded",
            "accesstoken" : configData.ACCESSTOKEN,
            "logintoken" : localStorage.getItem('loginToken')
        },
    }).then(resp => {
        console.log(resp.data)
        if(parseInt(Object.keys(resp.data)[0]) === 200){
            this.setState({
                businessholidays : resp.data.businessholidays,
                page : resp.data.page,
                businessholidaysCount : resp.data.businessholidaysCount,
                pageRecordCount : resp.data.pageRecordCount,
                totalPages : resp.data.totalPages,
                addClosingDateModal : false
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

  selectDate = selectedClosingDate => (e) => {
    e.preventDefault()
    console.log(selectedClosingDate)
    document.getElementById("pooper-"+selectedClosingDate.id).classList.remove("show")
    this.setState({
        selectedDate : selectedClosingDate.data,
        selectedDateId : selectedClosingDate.id,
        selectedHoliday : selectedClosingDate.isholiday == 1 ? true : false,
        editClosingDateModal : true
    })
  }

  saveSelectedClosingDate = (e) => {
    e.preventDefault()
    if(document.getElementById('selecteddate').value == ""){
        document.getElementById('selecteddate').focus()
        return
    }
    var bodyFormData = new URLSearchParams()
    bodyFormData.append('id', this.state.selectedDateId)
    bodyFormData.append('date', document.getElementById("selecteddate").value)
    bodyFormData.append('isholiday', this.state.selectedHoliday ? 1 : 0)
    axios({
        method: "post",
        url: configData.SERVER_URL + 'partner/businesssetup/saveSelecetdClosingDates/'+this.state.page+'/'+this.state.pageRecordCount,
        data : bodyFormData,
        headers: { 
            "Content-Type": "application/x-www-form-urlencoded",
            "accesstoken" : configData.ACCESSTOKEN,
            "logintoken" : localStorage.getItem('loginToken')
        },
    }).then(resp => {
        console.log(resp.data)
        if(parseInt(Object.keys(resp.data)[0]) === 200){
            this.setState({
                businessholidays : resp.data.businessholidays,
                page : resp.data.page,
                businessholidaysCount : resp.data.businessholidaysCount,
                pageRecordCount : resp.data.pageRecordCount,
                totalPages : resp.data.totalPages,
                editClosingDateModal : false
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

  pagination(){
    if(this.state.page == 1){
      return (
        <ol className="pagination">
          <li className="bg-slate-150 dark:bg-navy-500">
            <button data-page="1" onClick={this.handlePageChange} className="flex h-8 min-w-[2rem] items-center justify-center rounded-lg bg-primary px-3 leading-tight text-white transition-colors hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90">1</button>
          </li>
          { this.state.totalPages > 1 ?
            <li className="bg-slate-150 dark:bg-navy-500">
              <button data-page="2" onClick={this.handlePageChange} className="flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-3 leading-tight transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90">2</button>
            </li> : null
          }
          <li className="rounded-r-lg bg-slate-150 dark:bg-navy-500">
            <button data-page={this.state.totalPages} onClick={this.handlePageChange} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:text-navy-200 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </li>
        </ol>
      )
    }else{
      if(this.state.page == this.state.totalPages){
        return (
          <ol className="pagination">
            <li className="rounded-l-lg bg-slate-150 dark:bg-navy-500">
              <button data-page="1" onClick={this.handlePageChange} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:text-navy-200 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
            </li>
            <li className="bg-slate-150 dark:bg-navy-500">
              <button data-page={ parseInt(this.state.page) - 1} onClick={this.handlePageChange} className="flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-3 leading-tight transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90">{parseInt(this.state.page)  -1}</button>
            </li>
            <li className="bg-slate-150 dark:bg-navy-500">
              <button data-page={this.state.page} onClick={this.handlePageChange}className="flex h-8 min-w-[2rem] items-center justify-center rounded-lg bg-primary px-3 leading-tight text-white transition-colors hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90">{this.state.page}</button>
            </li>
          </ol>
        )
      }else{
        return (
          <ol className="pagination">
            <li className="rounded-l-lg bg-slate-150 dark:bg-navy-500">
              <button data-page="1" onClick={this.handlePageChange} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:text-navy-200 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
            </li>
            <li className="bg-slate-150 dark:bg-navy-500">
              <button data-page={parseInt(this.state.page) -1} onClick={this.handlePageChange} className="flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-3 leading-tight transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90">{parseInt(this.state.page)  -1}</button>
            </li>
            <li className="bg-slate-150 dark:bg-navy-500">
              <button data-page={this.state.page} onClick={this.handlePageChange} className="flex h-8 min-w-[2rem] items-center justify-center rounded-lg bg-primary px-3 leading-tight text-white transition-colors hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90">{this.state.page}</button>
            </li>
            <li className="bg-slate-150 dark:bg-navy-500">
              <button data-page={parseInt(this.state.page) +1} onClick={this.handlePageChange} className="flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-3 leading-tight transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90">{parseInt(this.state.page)  + 1}</button>
            </li>
            <li className="rounded-r-lg bg-slate-150 dark:bg-navy-500">
              <button data-page={this.state.totalPages} onClick={this.handlePageChange} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:text-navy-200 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </li>
          </ol>
        )
      }
    }
  }

  
  removeClosingDate = (closingDateId) => {
    let holiday = 0 
    var bodyFormData = new URLSearchParams()
     bodyFormData.append('id', closingDateId)
    axios({
        method: "delete",
        url: configData.SERVER_URL + 'partner/businesssetup/deleteClosingDates/'+this.state.page+'/'+this.state.pageRecordCount,
        data : bodyFormData,
        headers: { 
            "Content-Type": "application/x-www-form-urlencoded",
            "accesstoken" : configData.ACCESSTOKEN,
            "logintoken" : localStorage.getItem('loginToken')
        },
    }).then(resp => {
        console.log(resp.data)
        if(parseInt(Object.keys(resp.data)[0]) === 200){
          toast.success('closing date deleted successfuly', {
              position: "bottom-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
            this.setState({
                businessholidays : resp.data.businessholidays,
                page : resp.data.page,
                businessholidaysCount : resp.data.businessholidaysCount,
                pageRecordCount : resp.data.pageRecordCount,
                totalPages : resp.data.totalPages,
                addClosingDateModal : false
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
              <h2 class="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">Closing Date List</h2>
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
                <li>Closing Date List</li>
              </ul>
            </div>
            <div class="text-right">
              <button class="btn bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90" id="addClosingDateModal" onClick={this.handleModalShow}>Add New</button>
            </div>
          </div>
        
        
        <div class="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6">
          <div>
            <div class="flex items-center justify-between">
              <h2 class="text-base font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">
                Closing Date List
              </h2>
              <div class="flex">
                <div class="flex items-center" x-data="{isInputActive:false}">
                  <label class="block">
                    <input x-effect="isInputActive === true && $nextTick(() => { $el.focus()});" class="form-input bg-transparent px-1 text-right transition-all duration-100 placeholder:text-slate-500 dark:placeholder:text-navy-200" placeholder="Search here..." type="text" />
                  </label>
                  <button class="btn h-8 w-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                  </button>
                </div>
                <div x-data="usePopper({placement:'bottom-end',offset:4})" class="inline-flex">
                  <button x-ref="popperRef" class="btn h-8 w-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25" onClick={this.onToggletableAction}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                    </svg>
                  </button>
                  <div x-ref="popperRoot" class={this.state.tacbleAction}>
                    <div class="popper-box rounded-md border border-slate-150 bg-white py-1.5 font-inter dark:border-navy-500 dark:bg-navy-700">
                      {/* <ul>
                        <li>
                          <a href="/" class="flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-none transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100">Download PDF</a>
                        </li>
                        <li>
                          <a href="/" class="flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-none transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100">Downlaod Excel</a>
                        </li>
                      </ul> */}
                      {/* <div class="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>
                      <ul>
                        <li>
                          <a href="/" class="flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-none transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100">Create Share Link</a>
                        </li>
                      </ul> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="card mt-3">
              <div class="is-scrollbar-hidden min-w-full overflow-x-auto" x-data="pages.tables.initExample1">
                <table class="is-hoverable w-full text-left">
                  <thead>
                    <tr>
                      <th class="whitespace-nowrap rounded-tl-lg bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">#</th>
                      <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Date</th>
                      <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Is Holiday</th>
                      <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Created On</th>
                      <th class="whitespace-nowrap rounded-tr-lg bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.businessholidays.map((businessholiday,index) => ( 
                      <tr class="border-y border-transparent border-b-slate-200 dark:border-b-navy-500">
                        <td class="whitespace-nowrap px-4 py-3 sm:px-5">{ index+1 }</td>
                        <td class="whitespace-nowrap px-4 py-3 sm:px-5">{ moment(businessholiday.date).format("DD/MM/YYYY")}</td>
                        {businessholiday.isholiday == 1 ? 
                            <td  class="whitespace-nowrap px-3 py-3 font-medium text-slate-700 dark:text-navy-100 lg:px-5">Yes</td>
                            :
                            <td  class="whitespace-nowrap px-3 py-3 font-medium text-slate-700 dark:text-navy-100 lg:px-5">No</td>
                        }
                        <td class="whitespace-nowrap px-4 py-3 sm:px-5">{ moment(businessholiday.createdon).format("DD/MM/YYYY")}</td>
                        <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                          <div x-data="usePopper({placement:'bottom-end',offset:4})" class="inline-flex">
                            <button x-ref="popperRef" class="btn h-8 w-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                            onClick={() => {
                                if(document.getElementById("pooper-"+businessholiday.id).classList.contains("show")){
                                    document.getElementById("pooper-"+businessholiday.id).classList.remove("show")
                                }else{
                                    document.getElementById("pooper-"+businessholiday.id).classList.add("show")
                                }
                            }}>
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"/>
                              </svg>
                            </button>

                            <div id={ "pooper-" + businessholiday.id } x-ref="popperRoot" class="popper-root">
                              <div class="popper-box rounded-md border border-slate-150 bg-white py-1.5 font-inter dark:border-navy-500 dark:bg-navy-700">
                                <ul>
                                  <li>
                                    <button class="flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-none transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100" id="editClosingDateModal" onClick={this.selectDate(businessholiday)}>Edit</button>
                                  </li>
                                  <li>
                                  <button onClick={(e)=>{e.preventDefault(); this.removeClosingDate(businessholiday.id)}} className="flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-none transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100">Delete</button>
                                  </li>
                                </ul>
                                {/* <div className="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>
                                <ul>
                                  <li>
                                    <a href="/" className="flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-none transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100">Share Link</a>
                                  </li>
                                </ul> */}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col justify-between space-y-4 px-4 py-4 sm:flex-row sm:items-center sm:space-y-0 sm:px-5">
                <div className="flex items-center space-x-2 text-xs+">
                  <span>Show</span>
                  <label className="block">
                    <select onChange={this.handleRecordCountChange} className="form-select rounded-full border border-slate-300 bg-white px-2 py-1 pr-6 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent">
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="15">15</option>
                      <option value="20">20</option>
                    </select>
                  </label>
                  <span>entries</span>
                </div>

                {this.pagination()}

                <div className="text-xs+">{(this.state.page - 1) * this.state.pageRecordCount} - {(this.state.page) * this.state.pageRecordCount} of {this.state.servicesCount} entries</div>
              </div>
            </div>
          </div>
        </div>

        { this.state.addClosingDateModal ? 
            <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5" role="dialog">
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur transition-opacity duration-300" id="addClosingDateModal" onClick={this.handleModalHide}></div>
                <div className="relative w-full max-w-2xl origin-bottom rounded-lg bg-white pb-4 transition-all duration-300 dark:bg-navy-700">
                    <div className="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
                        <h3 className="text-base font-medium text-slate-700 dark:text-navy-100">Add special holiday</h3>
                        <button className="btn -mr-1.5 h-7 w-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25" id="addClosingDateModal" onClick={this.handleModalHide}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" >
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" ></path>
                            </svg>
                        </button>
                    </div>
                    <div className="is-scrollbar-hidden min-w-full overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border border-transparent border-b-slate-200 dark:border-b-navy-500">
                                    <th className="whitespace-nowrap px-3 py-3 font-semibold uppercase text-slate-800 dark:text-navy-100 lg:px-5">Date</th>
                                    <th className="whitespace-nowrap px-3 py-3 font-semibold uppercase text-slate-800 dark:text-navy-100 lg:px-5">Holiday</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border border-transparent border-b-slate-200 dark:border-b-navy-500">
                                        <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                                            <label className="relative flex">
                                                <input x-init="$el._x_flatpickr = flatpickr($el)" className="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Date." type="text" id="date"/>
                                                <span className="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                                    </svg>
                                                </span>
                                            </label>
                                        </td>
                                        <td>
                                            <label className="inline-flex items-center space-x-2">
                                                <input className="form-checkbox is-outline h-5 w-5 rounded-full border-slate-400/70 before:bg-primary checked:border-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:before:bg-accent dark:checked:border-accent dark:hover:border-accent dark:focus:border-accent" type="checkbox" id="isholiday" checked="true"/>
                                                <p>Enable Day Off</p>
                                            </label>
                                        </td>
                                    </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="text-center mt-2">  
                        <button className="btn bg-primary btn-color from-sky-400 to-blue-600 font-medium text-white m-2" onClick={this.saveClosingDate}>Save</button>
                        <button className="btn bg-primary btn-color from-sky-400 to-blue-600 font-medium text-white m-2" id="addClosingDateModal" onClick={this.handleModalHide}>Close</button>
                    </div>
                </div>
            </div>
            :
            null
        }

        { this.state.editClosingDateModal ? 
            <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5" role="dialog">
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur transition-opacity duration-300" id="editClosingDateModal" onClick={this.handleModalHide}></div>
                <div className="relative w-full max-w-2xl origin-bottom rounded-lg bg-white pb-4 transition-all duration-300 dark:bg-navy-700">
                    <div className="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
                        <h3 className="text-base font-medium text-slate-700 dark:text-navy-100">Edit special holiday</h3>
                        <button className="btn -mr-1.5 h-7 w-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25" id="editClosingDateModal" onClick={this.handleModalHide}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" >
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" ></path>
                            </svg>
                        </button>
                    </div>
                    <div className="is-scrollbar-hidden min-w-full overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border border-transparent border-b-slate-200 dark:border-b-navy-500">
                                    <th className="whitespace-nowrap px-3 py-3 font-semibold uppercase text-slate-800 dark:text-navy-100 lg:px-5">Date</th>
                                    <th className="whitespace-nowrap px-3 py-3 font-semibold uppercase text-slate-800 dark:text-navy-100 lg:px-5">Holiday</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border border-transparent border-b-slate-200 dark:border-b-navy-500">
                                        <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                                            <label className="relative flex">
                                                <input x-init="$el._x_flatpickr = flatpickr($el)" className="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Date." type="text" id="selecteddate"  value={moment(this.state.selectedDate).format('YYYY-MM-DD')}/>
                                                <span className="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                                    </svg>
                                                </span>
                                            </label>
                                        </td>
                                        <td>
                                            <label className="inline-flex items-center space-x-2">
                                                <input className="form-checkbox is-outline h-5 w-5 rounded-full border-slate-400/70 before:bg-primary checked:border-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:before:bg-accent dark:checked:border-accent dark:hover:border-accent dark:focus:border-accent" type="checkbox" id="selectedholiday" checked={this.state.selectedHoliday}
                                                onChange={() => {
                                                    console.log(this.state.selectedHoliday)
                                                    this.setState({
                                                        selectedHoliday : !this.state.selectedHoliday
                                                    })
                                                }}/>
                                                <p>Enable Day Off</p>
                                            </label>
                                        </td>
                                    </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="text-center mt-2">  
                        <button className="btn bg-primary btn-color from-sky-400 to-blue-600 font-medium text-white m-2" onClick={this.saveSelectedClosingDate}>Save</button>
                        <button className="btn bg-primary btn-color from-sky-400 to-blue-600 font-medium text-white m-2" id="editClosingDateModal" onClick={this.handleModalHide}>Close</button>
                    </div>
                </div>
            </div>
            :
            null
        }
        <ToastContainer />
      </main>
    )
  }
}