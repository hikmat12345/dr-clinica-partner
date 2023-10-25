import React from 'react'
import swal from 'sweetalert'
import axios from 'axios'
import configData from '../../utils/constants/config.json'

export default class Tax extends React.Component{

  constructor(props) {
    super(props)
    this.state = {
      taxes : [],
      branches : [],
      taxname : "",
      taxrate : "",
      selectedTax : null,
      selectedTaxname : "",
      selectedTaxrate : "",
      selectedBranch : null,
      addNewTax : false,
      editTax : false,
      editDefaultTax : false
    }
  }

  componentDidMount () {
      axios({
          method: "get",
          url: configData.SERVER_URL + 'partner/sales/gettaxes/',
          headers: { 
              "Content-Type": "application/x-www-form-urlencoded",
              "accesstoken" : configData.ACCESSTOKEN,
              "logintoken" : localStorage.getItem('loginToken')
          },
      }).then(resp => {
          console.log(resp.data)
          if(parseInt(Object.keys(resp.data)[0]) === 200){
            this.setState({
                taxes : resp.data.taxes,
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

  saveNewTax = (e) => {
    e.preventDefault()
    if(this.state.taxname === ""){
        document.getElementById("taxname").focus()
        return
    }
    if(this.state.taxrate === ""){
        document.getElementById("taxrate").focus()
        return
    }
    var bodyFormData = new URLSearchParams()
    bodyFormData.append('name', this.state.taxname)
    bodyFormData.append('value', this.state.taxrate)
    axios({
        method: "post",
        url: configData.SERVER_URL + 'partner/sales/savetaxes',
        data: bodyFormData,
        headers: { 
            "Content-Type": "application/x-www-form-urlencoded",
            "accesstoken" : configData.ACCESSTOKEN,
            "logintoken" : localStorage.getItem('loginToken')
        },
    }).then(resp => {
        if(parseInt(Object.keys(resp.data)[0]) === 200){
            this.setState({
                addNewTax : false,
                taxes : [...this.state.taxes,resp.data.tax]
            })
        }else{
            swal({
                title: "Tax Information",
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

  selectTax = (tax) => (e) => {
    e.preventDefault()
    this.setState({
        selectedTax : tax,
        selectedTaxname : tax.name,
        selectedTaxrate : tax.value,
        editTax : true
    })
  }

  selectBranch = (branch) => (e) => {
    e.preventDefault()
    this.setState({
        selectedBranch : branch,
        editDefaultTax : true
    })
  }

  updateTax = (e) => {
    e.preventDefault()
    var bodyFormData = new URLSearchParams()
    bodyFormData.append('id', this.state.selectedTax.id)
    bodyFormData.append('name', this.state.selectedTaxname)
    bodyFormData.append('value', this.state.selectedTaxrate)
    axios({
        method: "post",
        url: configData.SERVER_URL + 'partner/sales/updatetaxes',
        data: bodyFormData,
        headers: { 
            "Content-Type": "application/x-www-form-urlencoded",
            "accesstoken" : configData.ACCESSTOKEN,
            "logintoken" : localStorage.getItem('loginToken')
        },
    }).then(resp => {
        if(parseInt(Object.keys(resp.data)[0]) === 200){
            this.state.selectedTax.name = this.state.selectedTaxname
            this.state.selectedTax.value = this.state.selectedTaxrate
            this.setState({
                selectedTax : this.state.selectedTax,
                editTax : false,
            })
        }else{
            swal({
                title: "Tax Information",
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

  updateDefaultTax = (e) => {
    e.preventDefault()
    var bodyFormData = new URLSearchParams()
    bodyFormData.append('id', this.state.selectedBranch.id)
    bodyFormData.append('defaultTax', this.state.selectedBranch.defaultTax)
    axios({
        method: "post",
        url: configData.SERVER_URL + 'partner/sales/updatedefaulttax',
        data: bodyFormData,
        headers: { 
            "Content-Type": "application/x-www-form-urlencoded",
            "accesstoken" : configData.ACCESSTOKEN,
            "logintoken" : localStorage.getItem('loginToken')
        },
    }).then(resp => {
        if(parseInt(Object.keys(resp.data)[0]) === 200){
            this.state.taxes.forEach(tax => {
                if(tax.id == this.state.selectedBranch.defaultTax){
                    this.state.selectedBranch.tax = tax
                }
            })
            this.setState({
                editDefaultTax : false,
                selectedBranch : this.state.selectedBranch
            })
        }else{
            swal({
                title: "Tax Information",
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
              <h2 class="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">Taxes</h2>
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
                <li>Taxes</li>
              </ul>
            </div>
            <div class="text-right">
              <button class="btn bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90" id="addNewTax" onClick={this.handleModalShow}>Add New</button>
            </div>
          </div>
        
        
        <div class="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6">
          <div>
            <div class="flex items-center justify-between">
              <h2 class="text-base font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">
                Taxes
              </h2>
            </div>
            <div class="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-1 lg:gap-6">
                <div class="card px-4 py-4 my-4">
                    <div class="pt-2">
                        { this.state.taxes.map( tax => {
                            return <div>
                                <div class="pb-4">
                                    <button style={{width:"100%"}} onClick={this.selectTax(tax)}>
                                        <div class="mt-2 flex h-8 justify-between">
                                            <h2 class="font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100 lg:text-base">
                                                {tax.name}
                                            </h2>
                                            <label class="flex items-center space-x-2">
                                                <span class="text-xs text-slate-400 dark:text-navy-300">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                                    </svg>
                                                </span>
                                            </label>
                                        </div>
                                        <div class="max-w-xl text-left">
                                            <p>{tax.value}%</p>
                                        </div>
                                    </button>
                                </div>
                                <div class="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>
                            </div>
                        })}
                    </div>
                </div>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6">
          <div>
            <div class="flex items-center justify-between">
              <h2 class="text-base font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">
                Default Taxes
              </h2>
            </div>
            <div class="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-1 lg:gap-6">

                <div class="card px-4 py-4 my-4">
                    <div class="pt-2">
                        { this.state.branches.map( branch => {
                            return <div>
                                <div class="pb-4">
                                    <button style={{width:"100%"}} onClick={this.selectBranch(branch)}>
                                        <div class="mt-2 flex h-8 justify-between">
                                            <h2 class="font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100 lg:text-base">
                                                {branch.name}
                                            </h2>
                                            <label class="flex items-center space-x-2">
                                                <span class="text-xs text-slate-400 dark:text-navy-300">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                                    </svg>
                                                </span>
                                            </label>
                                        </div>
                                        <div class="max-w-xl text-left">
                                            <p>{branch.tax.name} {branch.tax.value}%</p>
                                        </div>
                                    </button>
                                </div>
                                <div class="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>
                            </div>
                        })}
                    </div>
                </div>
            </div>
          </div>
        </div>

        { this.state.addNewTax ? 
            <div class="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5" role="dialog">
                <div class="absolute inset-0 bg-slate-900/60 backdrop-blur transition-opacity duration-300" id="addNewTax" onClick={this.handleModalHide}></div>
                <div class="relative w-full max-w-2xl origin-bottom rounded-lg bg-white pb-4 transition-all duration-300 dark:bg-navy-700">
                    <div class="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
                        <h3 class="text-base font-medium text-slate-700 dark:text-navy-100">Add New Tax Rate</h3>
                        <button class="btn -mr-1.5 h-7 w-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25" id="addNewTax" onClick={this.handleModalHide}>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" >
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" ></path>
                            </svg>
                        </button>
                    </div>
                    <div class="is-scrollbar-hidden overflow-x-auto text-left">
                        <p class="p-4">Set the tax name and percentage rate. To apply this to your products and services, adjust your tax defaults settings.</p>
                        <div class="mx-4">
                            <label class="block">
                            <span>Tax Name:</span>
                            <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Tax Name" type="text" id="taxname" onChange={this.handleInputChange}/>
                            </label>
                        </div>
                        <div class="mt-2 mx-4">
                            <label class="block">
                            <span>Tax Rate:</span>
                            <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" min="0" max="100" step="0.01" placeholder="0.00" type="number" id="taxrate" onChange={this.handleInputChange}/>
                            </label>
                        </div>
                    </div>
                    <div class="text-center mt-2">  
                        <button class="btn bg-primary btn-color from-sky-400 to-blue-600 font-medium text-white m-2" onClick={this.saveNewTax}>Save</button>
                        <button class="btn bg-primary btn-color from-sky-400 to-blue-600 font-medium text-white m-2" id="addNewTax" onClick={this.handleModalHide}>Close</button>
                    </div>
                </div>
            </div>
            :
            null
        }

        { this.state.editTax ? 
            <div class="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5" role="dialog">
                <div class="absolute inset-0 bg-slate-900/60 backdrop-blur transition-opacity duration-300" id="editTax" onClick={this.handleModalHide}></div>
                <div class="relative w-full max-w-2xl origin-bottom rounded-lg bg-white pb-4 transition-all duration-300 dark:bg-navy-700">
                    <div class="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
                        <h3 class="text-base font-medium text-slate-700 dark:text-navy-100">Edit Tax rate</h3>
                        <button class="btn -mr-1.5 h-7 w-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25" id="editTax" onClick={this.handleModalHide}>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" >
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" ></path>
                            </svg>
                        </button>
                    </div>
                    <div class="is-scrollbar-hidden overflow-x-auto text-left">
                        <p class="p-4">Set the tax name and percentage rate. To apply this to your products and services, adjust your tax defaults settings.</p>
                        <div class="mx-4">
                            <label class="block">
                            <span>Tax Name:</span>
                            <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Tax Name" type="text" value={this.state.selectedTaxname} onChange={(e) => {
                                this.setState({
                                    selectedTaxname : e.currentTarget.value
                                })
                            }}/>
                            </label>
                        </div>
                        <div class="mt-2 mx-4">
                            <label class="block">
                            <span>Tax Rate:</span>
                            <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" min="0" max="100" step="0.01" placeholder="0.00" type="number"  value={this.state.selectedTaxrate} onChange={(e) => {
                                this.setState({
                                    selectedTaxrate : e.currentTarget.value
                                })
                            }}/>
                            </label>
                        </div>
                    </div>
                    <div class="text-center mt-2">  
                        <button class="btn bg-primary btn-color from-sky-400 to-blue-600 font-medium text-white m-2" onClick={this.updateTax}>Save</button>
                        <button class="btn bg-primary btn-color from-sky-400 to-blue-600 font-medium text-white m-2" id="editTax" onClick={this.handleModalHide}>Close</button>
                    </div>
                </div>
            </div>
            :
            null
        }
        
        { this.state.editDefaultTax ? 
            <div class="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5" role="dialog">
                <div class="absolute inset-0 bg-slate-900/60 backdrop-blur transition-opacity duration-300" id="editDefaultTax" onClick={this.handleModalHide}></div>
                <div class="relative w-full max-w-2xl origin-bottom rounded-lg bg-white pb-4 transition-all duration-300 dark:bg-navy-700">
                    <div class="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
                        <h3 class="text-base font-medium text-slate-700 dark:text-navy-100">Edit Defauly Tax rate for {this.state.selectedBranch.name}</h3>
                        <button class="btn -mr-1.5 h-7 w-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25" id="editDefaultTax" onClick={this.handleModalHide}>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" >
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" ></path>
                            </svg>
                        </button>
                    </div>
                    <div class="is-scrollbar-hidden overflow-x-auto text-left">
                        <p class="p-4">Once saved, changes will automatically apply to all products and services which are already assigned to default taxes</p>
                        <div class="mx-4">
                            <label class="block">
                                <span>Default Tax:</span>
                                <select class="mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent  px-3 py-2" onChange={(e) => {
                                    this.state.selectedBranch.defaultTax = e.currentTarget.value
                                    this.setState({
                                        selectedBranch : this.state.selectedBranch
                                    })
                                }}>
                                    <option value="" hidden>{this.state.selectedBranch.tax.name} ({this.state.selectedBranch.tax.value}%)</option>
                                    { this.state.taxes.map( tax => (
                                        <option value={tax.id}>{tax.name} ({tax.value}%)</option>
                                    ))}
                                </select>
                            </label>
                        </div>
                    </div>
                    <div class="text-center mt-2">  
                        <button class="btn bg-primary btn-color from-sky-400 to-blue-600 font-medium text-white m-2" onClick={this.updateDefaultTax}>Save</button>
                        <button class="btn bg-primary btn-color from-sky-400 to-blue-600 font-medium text-white m-2" id="editDefaultTax" onClick={this.handleModalHide}>Close</button>
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