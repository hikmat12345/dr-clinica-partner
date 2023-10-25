import React from 'react'
import swal from 'sweetalert'
import axios from 'axios'
import configData from '../../utils/constants/config.json'

export default class InvoiceSequencing extends React.Component{

  constructor(props) {
    super(props)
    this.state = {
      tacbleAction : "popper-root",
      branches : [],
      selectedBranch : null,
      selectedPrefix : "",
      selectedNextNo : 0,
      editReceiptingSequence : false,
    }
  }

  componentDidMount () {
      axios({
          method: "get",
          url: configData.SERVER_URL + 'partner/sales/getreceiptsequencing/',
          headers: { 
              "Content-Type": "application/x-www-form-urlencoded",
              "accesstoken" : configData.ACCESSTOKEN,
              "logintoken" : localStorage.getItem('loginToken')
          },
      }).then(resp => {
          console.log(resp.data)
          if(parseInt(Object.keys(resp.data)[0]) === 200){
            this.setState({
                branches : resp.data.branches
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

  handleInputChange = (event) => {
    event.preventDefault()
    this.setState({
        [event.target.id] : event.target.value
    });
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

  selectBranch = (branch) => (e) => {
    e.preventDefault()
    document.getElementById("pooper-"+branch.id).classList.remove("show")
    this.setState({
        selectedBranch : branch,
        selectedPrefix : branch.receiptsettings[0].prefix,
        selectedNextNo : branch.receiptsettings[0].nextno,
        editReceiptingSequence : true
    })
  }

  updateReceiptSequencing = (e) => {
    e.preventDefault()
    var bodyFormData = new URLSearchParams()
    bodyFormData.append('id', this.state.selectedBranch.receiptsettings[0].id)
    bodyFormData.append('prefix', this.state.selectedPrefix)
    bodyFormData.append('nextno', this.state.selectedNextNo)
    axios({
        method: "post",
        url: configData.SERVER_URL + 'partner/sales/updatereceiptsequencing',
        data: bodyFormData,
        headers: { 
            "Content-Type": "application/x-www-form-urlencoded",
            "accesstoken" : configData.ACCESSTOKEN,
            "logintoken" : localStorage.getItem('loginToken')
        },
    }).then(resp => {
        if(parseInt(Object.keys(resp.data)[0]) === 200){
            this.state.selectedBranch.receiptsettings[0].prefix = this.state.selectedPrefix
            this.state.selectedBranch.receiptsettings[0].nextno = this.state.selectedNextNo
            this.setState({
                selectedBranch : this.state.selectedBranch,
                editReceiptingSequence : false,
            })
        }else{
            swal({
                title: "Invoice Sequencing",
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
        <main class="main-content px-[var(--margin-x)] pb-8">
          <div class="items-center justify-between">
            <div class="flex items-center space-x-4 py-5 lg:py-6">
              <h2 class="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">Invoice Sequencing</h2>
              <div class="hidden h-full py-1 sm:flex">
                <div class="h-full w-px bg-slate-300 dark:bg-navy-600"></div>
              </div>
              <ul class="hidden flex-wrap items-center space-x-2 sm:flex">
                <li class="flex items-center space-x-2">
                  <a class="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent" href="/sales/invoicsequencing">Sales</a>
                  <svg x-ignore xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </li>
                <li>Invoice Sequencing</li>
              </ul>
            </div>
          </div>
        
        
        <div class="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6">
          <div>
            <div class="flex items-center justify-between">
              <h2 class="text-base font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">
                Invoice Sequencing
              </h2>
            </div>
            <div class="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-1 lg:gap-6"> 
                <div class="card mt-3">
                <div class="is-scrollbar-hidden min-w-full overflow-x-auto" x-data="pages.tables.initExample1">
                    <table class="is-hoverable w-full text-left">
                    <thead>
                        <tr>
                        <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Location Name</th>
                        <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Receipt No. Prefix</th>
                        <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Next Receipt Number</th>
                        <th class="whitespace-nowrap rounded-tr-lg bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.branches.map((branch) => ( 
                        <tr class="border-y border-transparent border-b-slate-200 dark:border-b-navy-500">
                            <td class="whitespace-nowrap px-4 py-3 sm:px-5">{ branch.name }</td>
                            <td class="whitespace-nowrap px-4 py-3 sm:px-5">{ branch.receiptsettings[0].prefix}</td>
                            <td class="whitespace-nowrap px-4 py-3 sm:px-5">{ branch.receiptsettings[0].nextno}</td>
                            <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                            <div x-data="usePopper({placement:'bottom-end',offset:4})" class="inline-flex">
                                <button x-ref="popperRef" class="btn h-8 w-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                                onClick={() => {
                                    if(document.getElementById("pooper-"+branch.id).classList.contains("show")){
                                        document.getElementById("pooper-"+branch.id).classList.remove("show")
                                    }else{
                                        document.getElementById("pooper-"+branch.id).classList.add("show")
                                    }
                                }}>
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"/>
                                </svg>
                                </button>

                                <div id={ "pooper-" + branch.id } x-ref="popperRoot" class="popper-root">
                                <div class="popper-box rounded-md border border-slate-150 bg-white py-1.5 font-inter dark:border-navy-500 dark:bg-navy-700">
                                    <ul>
                                    <li>
                                        <button class="flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-none transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100" id="editClosingDateModal" onClick={this.selectBranch(branch)}>Edit</button>
                                    </li>
                                    </ul>
                                    {/* <div class="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>
                                    <ul>
                                    <li>
                                        <a href="/" class="flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-none transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100">Share Link</a>
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
                </div>
            </div>
          </div>
        </div>

        { this.state.editReceiptingSequence ? 
            <div class="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5" role="dialog">
                <div class="absolute inset-0 bg-slate-900/60 backdrop-blur transition-opacity duration-300" id="editReceiptingSequence" onClick={this.handleModalHide}></div>
                <div class="relative w-full max-w-2xl origin-bottom rounded-lg bg-white pb-4 transition-all duration-300 dark:bg-navy-700">
                    <div class="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
                        <h3 class="text-base font-medium text-slate-700 dark:text-navy-100">Change Sequencing</h3>
                        <button class="btn -mr-1.5 h-7 w-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25" id="editReceiptingSequence" onClick={this.handleModalHide}>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" >
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" ></path>
                            </svg>
                        </button>
                    </div>
                    <div class="is-scrollbar-hidden overflow-x-auto text-left">
                        <p class="p-4">You are about to introduce this change for <strong>{this.state.selectedBranch.name}</strong>.</p>
                        <div class="mx-4">
                            <label class="block">
                            <span>Receipt No. Prefix:</span>
                            <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" value={this.state.selectedPrefix} type="text" onChange={(e) => {
                                this.setState({
                                    selectedPrefix : e.currentTarget.value
                                })
                            }}/>
                            </label>
                        </div>
                        <div class="mt-2 mx-4">
                            <label class="block">
                            <span>Next Receipt Number:</span>
                            <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" min="0" step="1" placeholder="0" type="number"  value={this.state.selectedNextNo} onChange={(e) => {
                                this.setState({
                                    selectedNextNo : e.currentTarget.value
                                })
                            }}/>
                            </label>
                        </div>
                    </div>
                    <div class="text-center mt-2">  
                        <button class="btn bg-primary from-sky-400 to-blue-600 font-medium text-white m-2" onClick={this.updateReceiptSequencing}>Save</button>
                        <button class="btn bg-primary from-sky-400 to-blue-600 font-medium text-white m-2" id="editReceiptingSequence" onClick={this.handleModalHide}>Close</button>
                    </div>
                </div>
            </div>
            :
            null
        }
        
      </main>
    )
  }
}