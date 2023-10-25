import React from 'react';
import swal from 'sweetalert';
import axios from 'axios';
import configData from '../../utils/constants/config.json'
import ImageResize from '../../components/ImageCropper/imageupload';

export default class EditVoucher extends React.Component{

    constructor(props) {
        super(props)
        this.state = {
            step1: true,
            step2 : false,
            step3 : false,
            step4 : false,
            services : [],
            locations : [],
            business : this.props.business,
            voucherId : null,
            name : "Title",
            value : 100.00,
            minthreshhold : 1000.00,
            validfor : 6,
            limitsales : false,
            noofsales : 50,
            selectedServices : [],
            selectedLocations : [],
            onlinesale : true,
            bookbtn : true,
            title : "",
            description : "",
            color : "#fff",
            retailPriceError : false,
            loader:false,
            uplodedImag:"",
            imageResizer:false,
            voucherImage:"",
        }
    }
    
    componentDidMount(){
        let selectedVoucher = JSON.parse(localStorage.getItem("selectedvoucher"))
        axios({
            method: "get",
            url: configData.SERVER_URL + 'partner/vouchers/addvoucherpreload',
            headers: { 
                "Content-Type": "application/x-www-form-urlencoded",
                "accesstoken" : configData.ACCESSTOKEN,
                "logintoken" : localStorage.getItem('loginToken')
            },
        }).then(resp => {
            console.log(resp.data)
            let selectedLocations = []
            let selectedServices = []
            console.log(selectedVoucher.voucherservices)
            resp.data.services.forEach(service => {
                selectedVoucher.voucherservices.forEach(voucherservice => {
                    if(voucherservice.service == service.id){
                        selectedServices.push(service)
                    }
                })
            });
            resp.data.locations.forEach(location => {
                selectedVoucher.voucherlocations.forEach(voucherlocation => {
                    if(voucherlocation.location == location.id){
                        selectedLocations.push(location)
                    }
                })
            });
            if(parseInt(Object.keys(resp.data)[0]) === 200){
              this.setState({
                services : resp.data.services,
                locations : resp.data.locations,
                voucherId : selectedVoucher.id,
                name : selectedVoucher.name,
                value : selectedVoucher.value,
                minthreshhold : selectedVoucher.minretailprice,
                validfor : selectedVoucher.validupto,
                limitsales : selectedVoucher.limitsales,
                noofsales : selectedVoucher.minsales,
                selectedServices : selectedServices,
                selectedLocations : selectedLocations,
                onlinesale : selectedVoucher.onlinesale,
                bookbtn : selectedVoucher.bookbtn,
                title : selectedVoucher.title,
                description : selectedVoucher.description,
                color : selectedVoucher.color
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

    handleInputChange = (e) => {
        e.preventDefault()
        this.setState({
            [e.currentTarget.id] : e.currentTarget.value
        })
    }

    handleRetailPriceInputChange = (e) => {
        e.preventDefault()
        if(this.state.value > e.currentTarget.value){
            this.setState({
                [e.currentTarget.id] : e.currentTarget.value,
                retailPriceError : false
            })
        }else{
            this.setState({
                [e.currentTarget.id] : e.currentTarget.value,
                retailPriceError : true
            })
        }
    }

    handleValueInputChange = (e) => {
        e.preventDefault()
        if(e.currentTarget.value > this.state.minthreshhold){
            this.setState({
                [e.currentTarget.id] : e.currentTarget.value,
                retailPriceError : false
            })
        }else{
            this.setState({
                [e.currentTarget.id] : e.currentTarget.value,
                retailPriceError : true
            })
        }
    }

    forwardStep1 = (e) => {
        e.preventDefault()
        if(this.state.name === "Title"){
            document.getElementById("name").focus()
            return
        }
        if(this.state.value  < this.state.minthreshhold){
            document.getElementById("minthreshhold").focus()
            return
        }
        this.setState({
            step1 : false,
            step2 : true
        })
    }

    handleAddService = (event) => {
        event.preventDefault()
        console.log(JSON.parse(event.currentTarget.value))
        if(JSON.parse(event.currentTarget.value) == null){
            this.setState({
                selectedServices : []
            })
        }else{
            this.setState({
                selectedServices : [...this.state.selectedServices,JSON.parse(event.currentTarget.value)]
            })
        }
    }

    handleRemoveService = (event) => {
        event.preventDefault()
        this.setState({
            selectedServices: this.state.selectedServices.filter(function(service) { 
                return service.id != event.currentTarget.id
              })
        })
    }

    handleAddLocation = (event) => {
        event.preventDefault()
        console.log(JSON.parse(event.currentTarget.value))
        if(JSON.parse(event.currentTarget.value) == null){
            this.setState({
                selectedLocations : []
            })
        }else{
            this.setState({
                selectedLocations : [...this.state.selectedLocations,JSON.parse(event.currentTarget.value)]
            })
        }
    }

    handleRemoveLocation = (event) => {
        event.preventDefault()
        this.setState({
            selectedLocations: this.state.selectedLocations.filter(function(location) { 
                return location.id != event.currentTarget.id
              })
        })
    }

    updateVoucher = (event) => {
        event.preventDefault()
        if(this.state.title === ""){
            document.getElementById("title").focus()
            return
        }
        if(this.state.description === ""){
            document.getElementById("description").focus()
            return
        }
        var bodyFormData = new URLSearchParams()
        bodyFormData.append('id', this.state.voucherId)
        bodyFormData.append('name', this.state.name)
        bodyFormData.append('value', this.state.value)
        bodyFormData.append('minthreshhold', this.state.minthreshhold)
        bodyFormData.append('validfor', this.state.validfor)
        bodyFormData.append('limitsales', this.state.limitsales)
        bodyFormData.append('noofsales', this.state.noofsales)
        bodyFormData.append('selectedServices', JSON.stringify(this.state.selectedServices))
        bodyFormData.append('selectedLocations', JSON.stringify(this.state.selectedLocations))
        bodyFormData.append('onlinesale', this.state.onlinesale)
        bodyFormData.append('bookbtn', this.state.bookbtn)
        bodyFormData.append('title', this.state.title)
        bodyFormData.append('description', this.state.description)
        bodyFormData.append('color', this.state.color)
        bodyFormData.append('voucherImages', JSON.stringify(this.state.uplodedImag))

        axios({
            method: "post",
            url: configData.SERVER_URL + 'partner/vouchers/updatevoucher',
            data: bodyFormData,
            headers: { 
                "Content-Type": "application/x-www-form-urlencoded",
                "accesstoken" : configData.ACCESSTOKEN,
                "logintoken" : localStorage.getItem('loginToken')
            },
        }).then(resp => {
 
            if(parseInt(Object.keys(resp.data)[0]) === 200){
                // window.location.href="/services/vouchers";
            }else{
                swal({
                    title: "Service Information",
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


    
    imageModalClose = (e) => {
        this.setState({
            imageResizer : false
        })
    }

    changeImage = (file) => {
        var url = URL.createObjectURL(file)
        this.setState({
            voucherImage : file,
            // profileSrc : url
        });
    }

    uploadImage = () => {
        this.setState({loader :true})
        var bodyFormData = new FormData()
        bodyFormData.append('image', this.state.voucherImage)
        axios({
            method: "post",
            url: configData.SERVER_URL + 'partner/vouchers/voucher-image',
            data : bodyFormData,
            headers: { 
                "Content-Type": "multipart/form-data",
                "accesstoken" : configData.ACCESSTOKEN,
                "logintoken" : localStorage.getItem('loginToken')
            },
        }).then(resp => {
            this.setState({loader :false})
            console.log(resp.data)
            this.setState({
                imageResizer : false,
                uplodedImag : resp.data.data.url
            })
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
              <h2 class="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">Add Voucher</h2>
              <div class="hidden h-full py-1 sm:flex">
                <div class="h-full w-px bg-slate-300 dark:bg-navy-600"></div>
              </div>
              <ul class="hidden flex-wrap items-center space-x-2 sm:flex">
                <li class="flex items-center space-x-2">
                  <a class="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent" href="/services/vouchers">Vouchers</a>
                  <svg x-ignore xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </li>
                <li>Add Vouceher</li>
              </ul>
            </div>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2 lg:gap-6">
            <div class="px-4 pb-4 sm:px-5">
                <div class="relative mx-auto h-40 w-80 rounded-lg text-white shadow-xl transition-transform hover:scale-110 lg:h-48 lg:w-80" style={{height:"28rem"}}>
                    <div class="h-full w-full rounded-lg bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400"></div>
                    <div class="absolute top-0 flex h-full w-full flex-col justify-between p-4 sm:p-5">
                        <div class="pt-4">
                            <i class="fa-solid fa-shop fa-3x"></i>
                            <p class="text-xs+ font-light">{this.state.business.name}</p>
                            <p class="font-medium uppercase tracking-wide">{this.state.name}</p>
                        </div>
                        <div class="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>
                        <div>
                            <p class="text-xs+ font-light pb-2">Voucher value</p>
                            <h1 class="text-3xl font-semibold">AED {parseFloat(this.state.value).toFixed(2)}</h1>
                        </div>
                        <div class="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>
                        <div>
                            <p class="text-xs+ font-light pb-2">Vouceher Code: XXXXXX</p>
                            {this.state.bookbtn ?
                            <button class="btn border border-slate-300 text-xs font-medium text-slate-800 bg-slate-150 focus:bg-slate-150 active:bg-slate-150/80 dark:border-navy-450 dark:text-navy-50 dark:hover:bg-navy-500 dark:focus:bg-navy-500 dark:active:bg-navy-500/90">
                                Book Now
                            </button> : null }
                            <p class="text-xs+ font-light pt-2">Radeem on {this.state.selectedServices.length > 0 ? this.state.selectedServices.length : "all "} services</p>
                            <p class="text-xs+ font-light">Valid for {this.state.validfor} months</p>
                            <p class="text-xs+ font-light">Valid on {this.state.selectedLocations.length > 0 ? this.state.selectedLocations.length : "all "} branches</p>
                        </div>
                    </div>
                </div>
            </div>
            { this.state.step1 ? 
                <div class="card px-4 pb-4 sm:px-5">
                    <div class="flex items-center justify-between py-4">
                    <p class="text-xl font-semibold text-primary dark:text-accent-light">Vouceher Info</p>
                    <div class="badge rounded-full border border-primary text-primary dark:border-accent-light dark:text-accent-light">Primary Info</div>
                    </div>
                    <div class="space-y-4">
                    <label class="block text-left">
                        <span>Voucher name</span>
                        <input class="form-input mt-1.5 w-full rounded-lg bg-slate-150 px-3 py-2 ring-primary/50 placeholder:text-slate-400 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:placeholder:text-navy-300 dark:hover:bg-navy-900 dark:focus:bg-navy-900" type="text" id="name" value={this.state.name} onChange={this.handleInputChange}/>
                    </label>
                    <div class="grid grid-cols-2 gap-4 text-left">
                        <label class="block">
                        <span>Value</span>
                        <input class="form-input mt-1.5 w-full rounded-lg bg-slate-150 px-3 py-2 ring-primary/50 placeholder:text-slate-400 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:placeholder:text-navy-300 dark:hover:bg-navy-900 dark:focus:bg-navy-900" type="number" min="0.00" step="1" value={this.state.value} id="value" onChange={this.handleValueInputChange}/>
                        </label>
                        <label class="block">
                            <span>Min retail threhold</span>
                            <input class="form-input mt-1.5 w-full rounded-lg bg-slate-150 px-3 py-2 ring-primary/50 placeholder:text-slate-400 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:placeholder:text-navy-300 dark:hover:bg-navy-900 dark:focus:bg-navy-900" type="number" min="0.00" step="1" value={this.state.minthreshhold} id="minthreshhold" onChange={this.handleRetailPriceInputChange}/>
                            {this.state.retailPriceError ? <span class="mt-1.5 text-error">Retail price must be smaller than voucher value</span> : <></>}
                        </label>
                    </div>  
                    <label class="block">
                        <span>Valid for</span>
                        <select class="form-select mt-1.5 w-full rounded-lg bg-slate-150 px-3 py-2 ring-primary/50 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:hover:bg-navy-900 dark:focus:bg-navy-900" id="validfor" onChange={this.handleInputChange}>
                            <option selected="true" hidden value={this.state.validfor}>{this.state.validfor} Month</option>
                            <option value="1">1 Month</option>
                            <option value="2">2 Month</option>
                            <option value="3">3 Months</option>
                            <option value="4">4 Months</option>
                            <option value="6">6 Months</option>
                            <option value="12">12 Months</option>
                            <option value="null">Always</option>
                        </select>
                    </label>
                    <div class="block text-left">
                        <label class="inline-flex items-center space-x-2">
                            <input class="form-switch h-5 w-10 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-accent dark:checked:before:bg-white" type="checkbox" checked={this.state.limitsales}
                            onChange={() => {
                                this.setState(({ limitsales }) => ({ limitsales: !limitsales }))
                            }}/>
                            <span>Limit amount of sales</span>
                        </label>
                    </div>
                    <label class="block text-left">
                        <span>No of sales</span>
                        <select class="form-select mt-1.5 w-full rounded-lg bg-slate-150 px-3 py-2 ring-primary/50 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:hover:bg-navy-900 dark:focus:bg-navy-900" disabled={!this.state.limitsales}  id="noofsales" onChange={this.handleInputChange}>
                            <option selected="true" hidden value={this.state.noofsales}>{this.state.noofsales}</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                            <option value="40">40</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                            <option value="250">250</option>
                            <option value="500">500</option>
                            <option value="1000">1000</option>
                        </select>
                    </label>
                    <div class="flex justify-center space-x-2 pt-4">
                        <button class="btn min-w-[7rem] border border-slate-300 font-medium text-slate-800 hover:bg-slate-150 focus:bg-slate-150 active:bg-slate-150/80 dark:border-navy-450 dark:text-navy-50 dark:hover:bg-navy-500 dark:focus:bg-navy-500 dark:active:bg-navy-500/90">Pre</button>
                        <button class="btn min-w-[7rem] bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90" onClick={this.forwardStep1}>Next</button>
                    </div>
                    </div>
                </div>
            : null
            }
            { this.state.step2 ? 
                <div class="card px-4 pb-4 sm:px-5">
                    <div class="flex items-center justify-between py-4">
                        <p class="text-xl font-semibold text-primary dark:text-accent-light">Vouceher Info</p>
                        <div class="badge rounded-full border border-primary text-primary dark:border-accent-light dark:text-accent-light">Services Info</div>
                    </div> 
                    <label class="block text-left">
                        <span>Select service</span>
                        <select class="form-select mt-1.5 w-full rounded-lg bg-slate-150 px-3 py-2 ring-primary/50 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:hover:bg-navy-900 dark:focus:bg-navy-900" onChange={this.handleAddService}>
                            <option value={JSON.stringify(null)}>All</option>
                            {this.state.services.map(service => {
                                return <option value={JSON.stringify(service)}>{service.name}</option>
                            })}
                        </select>
                    </label>
                    <label class="block text-left pt-2">
                        <span>Selected services those will include in your voucher</span>
                    </label>
                    <div style={{height:"15rem",overflowY:"scroll"}}>
                        <div class="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-3 pt-2">
                            {this.state.selectedServices.map((service) => (
                                <div class="rounded-lg bg-gradient-to-r from-sky-400 to-blue-600 text-white float-right" id={service.id}>
                                    <div class="flex items-center justify-between">
                                        <h2 class="font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100 lg:text-base"></h2>
                                        <button class="btn -mr-1.5 h-7 w-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25" id={service.id} onClick={this.handleRemoveService}>
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                                            </svg>
                                        </button>
                                    </div>
                                    
                                    <div class="flex flex-col items-center pb-2 px-4 text-center sm:px-5">
                                        <div class="avatar h-20 w-20">
                                            <img class="rounded-full" src={ configData.SERVER_URL + "assets/images/categories/" + service.category_categoryToservice.image} alt={service.name} />
                                        </div>
                                        <h5 class="pt-2 text-base font-semibold">{service.name.length > 20 ? service.name.substring(0, 17) + "..." : service.name}</h5>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div class="flex justify-center space-x-2 pt-4">
                        <button class="btn min-w-[7rem] border border-slate-300 font-medium text-slate-800 hover:bg-slate-150 focus:bg-slate-150 active:bg-slate-150/80 dark:border-navy-450 dark:text-navy-50 dark:hover:bg-navy-500 dark:focus:bg-navy-500 dark:active:bg-navy-500/90" onClick={()=>{
                            this.setState({
                                step1:true,
                                step2:false
                            })
                        }}>Pre</button>
                        <button class="btn min-w-[7rem] bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90" onClick={()=>{
                            this.setState({
                                step2 : false,
                                step3 : true
                            })
                        }}>Next</button>
                    </div>
                </div>
            : null
            }
            { this.state.step3 ? 
                <div class="card px-4 pb-4 sm:px-5">
                    <div class="flex items-center justify-between py-4">
                        <p class="text-xl font-semibold text-primary dark:text-accent-light">Locations Info</p>
                        <div class="badge rounded-full border border-primary text-primary dark:border-accent-light dark:text-accent-light">Locations Info</div>
                    </div> 
                    <label class="block text-left">
                        <span>Select location</span>
                        <select class="form-select mt-1.5 w-full rounded-lg bg-slate-150 px-3 py-2 ring-primary/50 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:hover:bg-navy-900 dark:focus:bg-navy-900" onChange={this.handleAddLocation}>
                            <option value={JSON.stringify(null)}>All</option>
                            {this.state.locations.map(location => {
                                return <option value={JSON.stringify(location)}>{location.name}</option>
                            })}
                        </select>
                    </label>
                    <label class="block text-left pt-2">
                        <span>Selected locations those will include in your voucher</span>
                    </label>
                    <div style={{height:"15rem",overflowY:"scroll"}}>
                        <div class="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-3 pt-2">
                            {this.state.selectedLocations.map((location) => (
                                <div class="rounded-lg bg-gradient-to-r from-sky-400 to-blue-600 text-white float-right" id={location.id}>
                                    <div class="flex items-center justify-between">
                                        <h2 class="font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100 lg:text-base"></h2>
                                        <button class="btn -mr-1.5 h-7 w-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25" id={location.id} onClick={this.handleRemoveLocation}>
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                                            </svg>
                                        </button>
                                    </div>
                                    
                                    <div class="flex flex-col items-center pb-2 px-4 text-center sm:px-5">
                                        <div class="avatar h-20 w-20">
                                            <i class="fa-solid fa-shop fa-4x"></i>
                                        </div>
                                        <h5 class="pt-2 text-base font-semibold">{location.name.length > 20 ? location.name.substring(0, 17) + "..." : location.name}</h5>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div class="flex justify-center space-x-2 pt-4">
                        <button class="btn min-w-[7rem] border border-slate-300 font-medium text-slate-800 hover:bg-slate-150 focus:bg-slate-150 active:bg-slate-150/80 dark:border-navy-450 dark:text-navy-50 dark:hover:bg-navy-500 dark:focus:bg-navy-500 dark:active:bg-navy-500/90" onClick={()=>{
                            this.setState({
                                step2:true,
                                step3:false
                            })
                        }}>Pre</button>
                        <button class="btn min-w-[7rem] bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90" onClick={()=>{
                            this.setState({
                                step3:false,
                                step4:true
                            })
                        }}>Next</button>
                    </div>
                </div>
            : null
            }
            { this.state.step4 ? 
                <div class="card px-4 pb-4 sm:px-5">
                    <div class="flex items-center justify-between py-4">
                    <p class="text-xl font-semibold text-primary dark:text-accent-light">Vouceher Info</p>
                    <div class="badge rounded-full border border-primary text-primary dark:border-accent-light dark:text-accent-light">Email Info</div>
                    </div>
                    <div class="space-y-4">
                    <label class="block text-left">
                        <span>Voucher title</span>
                        <input class="form-input mt-1.5 w-full rounded-lg bg-slate-150 px-3 py-2 ring-primary/50 placeholder:text-slate-400 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:placeholder:text-navy-300 dark:hover:bg-navy-900 dark:focus:bg-navy-900" type="text" id="title" value={this.state.title} onChange={this.handleInputChange}/>
                    </label>
                    <label class="block text-left">
                        <span>Voucher description</span>
                        <input class="form-input mt-1.5 w-full rounded-lg bg-slate-150 px-3 py-2 ring-primary/50 placeholder:text-slate-400 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:placeholder:text-navy-300 dark:hover:bg-navy-900 dark:focus:bg-navy-900" type="text" id="description" value={this.state.description} onChange={this.handleInputChange}/>
                    </label>
                    <div class="block text-left">
                        <label class="inline-flex items-center space-x-2">
                            <input class="form-switch h-5 w-10 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-accent dark:checked:before:bg-white" type="checkbox" checked={this.state.onlinesale}
                            onChange={() => {
                                this.setState(({ onlinesale }) => ({ onlinesale: !onlinesale }))
                            }}/>
                            <span>Allow online bookings</span>
                        </label>
                    </div>
                    <div class="block text-left">
                        <label class="inline-flex items-center space-x-2">
                            <input class="form-switch h-5 w-10 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-accent dark:checked:before:bg-white" type="checkbox" checked={this.state.bookbtn}
                            onChange={() => {
                                this.setState(({ bookbtn }) => ({ bookbtn: !bookbtn }))
                            }}/>
                            <span>Add a book now button</span>
                        </label>
                    </div>
                    {/* <div class="block text-left">
                    <label class="block text-left">
                         <div class="  mx-auto"> 
                                {this.state.uplodedImag?<><div>Add banners image</div><img class="  h-10 w-18 bg-slate-200" src={this.state.uplodedImag} alt="avatar" onClick={() => {
                                     this.setState({
                                      imageResizer : true
                                    })
                                }}/></> :
                                <button class="btn min-w-[7rem] border  font-medium text-slate-800  bg-slate-150 focus:bg-slate-150 active:bg-slate-150/80 dark:border-navy-450 dark:text-navy-50 dark:hover:bg-navy-500 dark:focus:bg-navy-500 dark:active:bg-navy-500/90" style={{border:"dashed"}} alt="avatar" onClick={() => {
                                     this.setState({
                                      imageResizer : true
                                    })
                                }}>
                                    Add Banner Image</button>}
                                <input type="file" id="profile" style={{ display : "none"}} accept="image/png, image/jpeg, image/jpg" onChange={this.handleImageChange} />
                            </div>
                    </label>
                    </div> */}
                    <div class="flex justify-center space-x-2 pt-4">
                        <button class="btn min-w-[7rem] border border-slate-300 font-medium text-slate-800 hover:bg-slate-150 focus:bg-slate-150 active:bg-slate-150/80 dark:border-navy-450 dark:text-navy-50 dark:hover:bg-navy-500 dark:focus:bg-navy-500 dark:active:bg-navy-500/90" onClick={()=>{
                            this.setState({
                                step3:true,
                                step4:false
                            })
                        }}
                        >Pre</button>
                        <button class="btn min-w-[7rem] bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90" onClick={this.updateVoucher}>Update Voucher</button>
                    </div>
                    </div>
                </div>
            : null
            }
            { this.state.imageResizer ?
                <ImageResize loader={this.state.loader} aspectRatio={1.0} imageModalClose={this.imageModalClose} changeImage={this.changeImage} saveImageAdded={this.uploadImage}/> : <></>
            }
        </div>
      </main>
    )
  }
}