import React from 'react'
import swal from 'sweetalert'
import axios from 'axios'
import configData from '../../utils/constants/config.json'
import ImageResize from '../../components/ImageCropper/imageupload'

export default class EditService extends React.Component{

    constructor(props) {
        super(props)
        this.state = {
            selectedserviceId : localStorage.getItem('selectedservice'),
            selectedService : null,
            teams : [],
            categories : [],
            subcategories : [],
            taxes : [],
            genders : [],
            pricetypes : [],
            branches : [],
            name : "",
            subcategory : null,
            category : null,
            gender : null,
            description : "",
            aftercare : "",
            branch : "",
            onlinebooking : false,
            vouchersale : false,
            tax : null,
            serviceteam : [],
            prices : [],
            extratime : false,
            extratimeduration : 0,
            serviceImages : [],
            newImage : null,
            voucherImage:"",
            imageResizer:false,
            loader:false
        }
    }

    componentDidMount () {
        axios({
            method: "get",
            url: configData.SERVER_URL + 'partner/service/createServicePreLoad',
            headers: { 
                "Content-Type": "application/x-www-form-urlencoded",
                "accesstoken" : configData.ACCESSTOKEN,
                "logintoken" : localStorage.getItem('loginToken')
            },
        }).then(resp => {
            console.log(resp.data)
            if(parseInt(Object.keys(resp.data)[0]) === 200){
              this.setState({
                teams : resp.data.teams,
                categories : resp.data.categories,
                subcategories : resp.data.subcategories,
                taxes : resp.data.taxes,
                genders : resp.data.genders,
                pricetypes : resp.data.pricetypes,
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
        axios({
            method: "get",
            url: configData.SERVER_URL + 'partner/service/getServiceDetails?serviceid='+localStorage.getItem('selectedservice'),
            headers: { 
                "Content-Type": "application/x-www-form-urlencoded",
                "accesstoken" : configData.ACCESSTOKEN,
                "logintoken" : localStorage.getItem('loginToken')
            },
        }).then(resp => {
            console.log(resp.data)
            if(parseInt(Object.keys(resp.data)[0]) === 200){
                let selecteam = []
                resp.data.service.teamservices.forEach(team => {
                    selecteam.push(String(team.teammember))
                });
              this.setState({
                selectedService :resp.data.service,
                name : resp.data.service.name,
                subcategory : resp.data.service.subcategory,
                category : resp.data.service.category,
                gender : resp.data.service.servicesfor,
                description : resp.data.service.details,
                aftercare : resp.data.service.aftercare,
                branch : resp.data.service.branch,
                onlinebooking : resp.data.service.onlinebooking == 1 ? true : false,
                vouchersale : resp.data.service.vouchersales == 1 ? true : false,
                 tax : resp.data.service.tax,
                prices : resp.data.service.price_priceToservice,
                serviceteam : selecteam,
                extratime : resp.data.service.extratime == 1 ? true : false,
                extratimeduration : resp.data.service.extratimeduration,
                serviceImages : resp.data.service.serviceimages
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
        let durations = []
        for (let index = 10; index <= 720; index+=10) {
            durations.push(index)
        }
    }

    handleInputChange = (event) => {
        event.preventDefault()
        console.log(this.state.serviceteam)
        this.setState({
            [event.target.id] : event.target.value
        });
    }

    handlePriceChange = (index) => (e) => {
        e.preventDefault()
        this.state.prices[index][e.currentTarget.id] = e.currentTarget.value
        this.setState({
            prices :  this.state.prices
        });
    }

    addPriceSlot = (event) => {
        event.preventDefault()
        this.setState({
            prices : [...this.state.prices,{
                id : null,
                service : this.state.selectedserviceId,
                name : "", 
                duration : 0,
                pricetype : null,
                pricefrom : 0,
                specialprice : 0,
            }]
        })
        console.log(this.state.prices)
    }

    removePriceSlot = (event) => {
        event.preventDefault()
        this.state.prices.splice(event.currentTarget.id,1)
        this.setState({
            prices : this.state.prices
        })
    }

    selectTeam = (event) => {
        event.preventDefault()
        console.log(this.state.serviceteam)
        if(this.state.serviceteam.includes(event.currentTarget.id)){
            this.setState({
                serviceteam: this.state.serviceteam.filter(function(service) { 
                    return service !== event.currentTarget.id
                  })
            })
            document.getElementById(event.currentTarget.id).classList.remove("border")
            document.getElementById(event.currentTarget.id).classList.remove("border-primary")
        }else{
            this.setState({
                serviceteam : [...this.state.serviceteam,event.currentTarget.id]
            })
            document.getElementById(event.currentTarget.id).classList.add("border")
            document.getElementById(event.currentTarget.id).classList.add("border-primary")
        }
    }

    handleSaveService = (event) => {
        event.preventDefault()
        console.log(this.state)
        let priceCheck = false
        this.state.prices.forEach(price => {
            if(price.name == "" || price.duration == 0 || price.pricetype == null || price.pricefrom == 0){
                priceCheck = true
            }
        })
        if(priceCheck){
            swal({
                title: "Price Option Information",
                text: "Please fill all the fields with * in price options",
                icon: "warning",
                button: "ok",
            })
            return
        }
        if(this.state.serviceteam.length < 1){
            swal({
              title: 'Service Provider',
              text: 'Please add atleast one service provider',
              icon: 'info',
              button: 'ok',
            })
          }
        var bodyFormData = new URLSearchParams()
        bodyFormData.append('serviceid', this.state.selectedserviceId)
        bodyFormData.append('name', this.state.name)
        bodyFormData.append('branch', this.state.branch)
        bodyFormData.append('category', this.state.category)
        bodyFormData.append('subcategory', this.state.subcategory)
        bodyFormData.append('gender', this.state.gender)
        bodyFormData.append('description', this.state.description)
        bodyFormData.append('aftercare', this.state.aftercare)
        bodyFormData.append('onlinebooking', this.state.onlinebooking ? 1 : 0)
        bodyFormData.append('vouchersale', this.state.vouchersale ? 1 : 0)
        bodyFormData.append('tax', this.state.tax)
        bodyFormData.append('serviceteam', this.state.serviceteam)
        bodyFormData.append('prices', JSON.stringify(this.state.prices))
        bodyFormData.append('extratime', this.state.extratime ? 1 : 0)
        bodyFormData.append('extratimeduration', this.state.extratimeduration)
        axios({
            method: "post",
            url: configData.SERVER_URL + 'partner/service/updateService',
            data: bodyFormData,
            headers: { 
                "Content-Type": "application/x-www-form-urlencoded",
                "accesstoken" : configData.ACCESSTOKEN,
                "logintoken" : localStorage.getItem('loginToken')
            },
        }).then(resp => {
            if(parseInt(Object.keys(resp.data)[0]) === 200){
                swal({
                    title: "Service Information",
                    text: resp.data[Object.keys(resp.data)[0]],
                    icon: "success",
                    button: "ok",
                })
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


    imageAdd = (file) => {

        //  var url = URL.createObjectURL(file)
         this.setState({
            newImage : file
        })
    }
   
    saveImageAdded = (e) => {
        e.preventDefault()
        this.setState({loader :true})
        var bodyFormData = new FormData()
        bodyFormData.append('id', this.state.selectedserviceId)
        bodyFormData.append('image', this.state.newImage)
        axios({
            method: "post",
            url: configData.SERVER_URL + 'partner/service/addNewImageService',
            data: bodyFormData,
            headers: { 
                "Content-Type": "multipart/form-data",
                "accesstoken" : configData.ACCESSTOKEN,
                "logintoken"  : localStorage.getItem('loginToken')
            },
        }).then(resp => {
            this.setState({loader :false})

             if(parseInt(Object.keys(resp.data)[0]) === 200){
                this.setState({ 
                    imageResizer : false , 
                    serviceImages : [...resp.data.serviceimages],
                    newImage : null
                })
            }else{
                swal({
                    title: "Save Image",
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

    deteleImageAdded = (e) => {
        e.preventDefault()
        let imageId = e.currentTarget.id
        var bodyFormData = new URLSearchParams()
        bodyFormData.append('id', imageId)
        axios({
            method: "delete",
            url: configData.SERVER_URL + 'partner/service/deleteImageService',
            data: bodyFormData,
            headers: { 
                "Content-Type": "application/x-www-form-urlencoded",
                "accesstoken" : configData.ACCESSTOKEN,
                "logintoken" : localStorage.getItem('loginToken')
            },
        }).then(resp => {
            
            if(parseInt(Object.keys(resp.data)[0]) === 200){
                this.setState({ 
                     serviceImages : this.state.serviceImages.filter(image => image.id != imageId )
                })
            }else{
                swal({
                    title: "Delete Image",
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

    render() {
        return (
            <main class="main-content px-[var(--margin-x)] pb-8">
                <div class="items-center justify-between">
                    <div class="flex items-center space-x-4 py-5 lg:py-6">
                        <h2 class="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">Edit Service</h2>
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
                            <li>Edit Service</li>
                        </ul>
                    </div>
                    <div class="text-right mx-4 my-4">
                        <button onClick={this.handleSaveService} class="btn bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90">Save</button>
                    </div>
                </div>

                <div class= "grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6">
                    <div class="col-span-12 grid lg:col-span-12">
                        <div class="card">
                            <div class="border-b border-slate-200 p-4 dark:border-navy-500 sm:px-5">
                                <div class="flex items-center space-x-2">
                                    <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 p-1 text-primary dark:bg-accent-light/10 dark:text-accent-light">
                                        <i class="fa-solid fa-check"></i>
                                    </div>
                                    <h4 class="text-lg font-medium text-slate-700 dark:text-navy-100">Service</h4>
                                </div>
                            </div>
                            <div class="space-y-4 p-4 sm:p-5">
                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div class="grid grid-cols-2 gap-4">
                                        <label class="block">
                                            <span>Service Name*</span>
                                            <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Enter Your Service Name" type="text" value={this.state.name} id="name" onChange={this.handleInputChange}/>
                                        </label>

                                        <label class="block">
                                            <span>Service Available for*</span>
                                            <select class="mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent  px-3 py-2" id="gender" onChange={this.handleInputChange}>
                                                {this.state.genders.map((gender) => {
                                                    if(gender.id == this.state.gender){
                                                        return <option value={gender.id} selected="ture">{gender.name}</option>
                                                    }else{
                                                        return <option value={gender.id}>{gender.name}</option>
                                                    }
                                                })}
                                            </select>
                                        </label>
                                    </div>
                                    <div class="grid grid-cols-2 gap-4">
                                        <label class="block">
                                            <span>Service Category*</span>
                                            <select class="mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent  px-3 py-2" id="category" onChange={(e) => {
                                                this.handleInputChange(e)
                                                this.setState({
                                                    subcategory : null
                                                })
                                            }}>
                                                {this.state.categories.map((category) => {
                                                    if(category.id == this.state.category){
                                                        return <option value={category.id} selected="true">{category.name}</option>
                                                    }else{
                                                        return <option value={category.id}>{category.name}</option>
                                                    }
                                                })}
                                            </select>
                                        </label>
                                        <label class="block">
                                            <span>Service Section*</span>
                                            <select class="mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent  px-3 py-2" id="subcategory" onChange={this.handleInputChange}>
                                                {this.state.subcategories.filter(subcat => subcat.category == this.state.category).map((subcategory) => {
                                                    if(subcategory.id == this.state.subcategory){
                                                        return <option value={subcategory.id} selected="true">{subcategory.name}</option>
                                                    }else{
                                                        return <option value={subcategory.id}>{subcategory.name}</option>
                                                    }
                                                })}
                                            </select>
                                        </label>
                                    </div>
                                </div>

                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <label class="block">
                                        <span>Service description</span>
                                        <textarea rows="4" placeholder="Enter Service Description" class="form-textarea w-full resize-none rounded-lg border border-slate-300 bg-transparent p-2.5 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" value={this.state.description}  id="description" onChange={this.handleInputChange}></textarea>
                                    </label>
                                    <label class="block">
                                        <span>Aftercare description</span>
                                        <textarea rows="4" placeholder="Enter Aftercare Description" class="form-textarea w-full resize-none rounded-lg border border-slate-300 bg-transparent p-2.5 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" value={this.state.aftercare}  id="aftercare" onChange={this.handleInputChange}></textarea>
                                    </label>
                                </div>

                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-1">
                                    <label class="inline-flex items-center space-x-2">
                                        Enable online bookings, choose who the service is available for and add a short description.
                                    </label>
                                    <label class="inline-flex items-center space-x-2">
                                        <input class="form-switch h-5 w-10 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-accent dark:checked:before:bg-white" type="checkbox" checked={this.state.onlinebooking}
                                        onChange={()=>{
                                            this.setState(({ onlinebooking }) => ({ onlinebooking: !onlinebooking }))
                                        }}/>
                                        <span>Enable Online Booking.</span>
                                    </label>
                                </div>
                                <div class="my-3 mx-4 h-px bg-slate-200 dark:bg-navy-500"></div>
                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-1">
                                    <label class="inline-flex items-center space-x-2">
                                        Enable voucher sale, choose who the service is available for and add a short description.
                                    </label>
                                    {console.log(this.state,'this.statethis.state')}
                                    <label class="inline-flex items-center space-x-2">
                                        <input class="form-switch h-5 w-10 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-accent dark:checked:before:bg-white" type="checkbox"
                                         checked={this.state.vouchersale} 
                                        onChange={()=>{
                                            this.setState(({ vouchersale }) => ({ vouchersale: !vouchersale }))
                                        }}/>
                                        <span>Enable Voucher Sales.</span>
                                    </label>
                                </div>
                                <div class="my-3 mx-4 h-px bg-slate-200 dark:bg-navy-500"></div>
                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div class="grid grid-cols-2 gap-4">
                                        <label class="block">
                                            <span>Set Tax Rate*</span>
                                            <select class="mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent  px-3 py-2" id="tax" onChange={this.handleInputChange}>
                                                {this.state.taxes.map((tax) => {
                                                    if(tax.id == this.state.tax){
                                                        return <option value={tax.id} selected="true">{tax.name}</option>
                                                    }else{
                                                        return <option value={tax.id}>{tax.name}</option>
                                                    }
                                                })}
                                            </select>
                                        </label>
                                        <label class="block">
                                            <span>Set branch*</span>
                                            <select class="mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent  px-3 py-2" id="branch" onChange={this.handleInputChange}>
                                                <option value="" hidden>Select Option</option>
                                                {this.state.branches.map((branch) => ( 
                                                    <option value={branch.id}>{branch.address}</option>
                                                ))}
                                            </select>
                                        </label>
                                    </div>
                                </div>
                                <div class="my-3 mx-4 h-px bg-slate-200 dark:bg-navy-500"></div>
                            </div>

                            <div class="border-b border-slate-200 p-4 dark:border-navy-500 sm:px-5">
                                <div class="flex items-center space-x-2">
                                    <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 p-1 text-primary dark:bg-accent-light/10 dark:text-accent-light">
                                        <i class="fa-solid fa-tag text-base"></i>
                                    </div>
                                    <h4 class="text-lg font-medium text-slate-700 dark:text-navy-100">Price</h4>
                                </div>
                            </div>

                            <div class="space-y-4 p-4 sm:p-5">
                                {this.state.prices.map((price, index) => {
                                    return <div class="card p-2 lg:flex-row bg-slate-200">
                                        <div class="flex w-full grow flex-col px-4 py-3 sm:px-5">
                                            <div class="flex items-center justify-between">
                                                <a class="text-xs+ text-info">Price Option # {index + 1}</a>
                                                <div class="-mr-1.5 flex space-x-1">
                                                <div class="inline-flex">
                                                    <button id={index} onClick={this.removePriceSlot} class="btn h-7 w-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25">
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                                                        </svg>
                                                    </button>
                                                </div>
                                                </div>
                                            </div>
                                            <div>
                                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 ">
                                                    <div class="grid grid-cols-1 gap-4">
                                                        <label class="block">
                                                            <span>Price Name*</span>
                                                            <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Price Name" value={price.name} id="name" onChange={this.handlePriceChange(index)}/>
                                                        </label>
                                                    </div>

                                                    <div class="grid grid-cols-1 gap-4">
                                                        <label class="block">
                                                            Price Type*
                                                            <select class="mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent  px-3 py-2" id="pricetype" onChange={this.handlePriceChange(index)}>
                                                                {this.state.pricetypes.map((pricetype) => {
                                                                    if(pricetype.id == price.pricetype){
                                                                        return <option value={pricetype.id} selected="true">{pricetype.type}</option>
                                                                    }else{
                                                                        return <option value={pricetype.id}>{pricetype.type}</option>
                                                                    }
                                                                })}
                                                            </select>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div class="grid grid-cols-1 sm:grid-cols-3 mt-2">
                                                    <div class="grid grid-cols-1">
                                                        <label class="block">
                                                            Duration*
                                                        </label>
                                                        <label class="flex -space-x-px">
                                                            <input class="form-input w-full border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Enter Price Duration" type="number" value={price.duration} id="duration"  onChange={this.handlePriceChange(index)}/>
                                                            <div class="flex items-center justify-center rounded-r-lg border border-slate-300 px-3.5 font-inter dark:border-navy-450">
                                                                <span>Minutes</span>
                                                            </div>
                                                        </label>
                                                    </div>
                                                    <div class="grid grid-cols-1">
                                                        <label class="block">
                                                            Price*
                                                        </label>
                                                        <label class="flex -space-x-px">
                                                            <div class="flex items-center justify-center rounded-l-lg border border-slate-300 px-3.5 font-inter dark:border-navy-450">
                                                                <span>AED</span>
                                                            </div>
                                                            <input class="form-input w-full border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Enter Price" type="number" value={price.pricefrom} id="pricefrom" onChange={this.handlePriceChange(index)}/>
                                                            <div class="flex items-center justify-center rounded-r-lg border border-slate-300 px-3.5 font-inter dark:border-navy-450">
                                                                <span>.00</span>
                                                            </div>
                                                        </label>
                                                    </div>
                                                    <div class="grid grid-cols-1">
                                                        <label class="block">
                                                            Special Price (Optional)
                                                        </label>
                                                        <label class="flex -space-x-px">
                                                            <div class="flex items-center justify-center rounded-l-lg border border-slate-300 px-3.5 font-inter dark:border-navy-450">
                                                                <span>AED</span>
                                                            </div>
                                                            <input class="form-input w-full border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Enter Price" type="number" value={price.specialprice} id="specialprice" onChange={this.handlePriceChange(index)}/>
                                                            <div class="flex items-center justify-center rounded-r-lg border border-slate-300 px-3.5 font-inter dark:border-navy-450">
                                                                <span>.00</span>
                                                            </div>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>  
                                })}
                                <div class="flex items-left"><button class="text-xs+ text-info" onClick={this.addPriceSlot}>Add New Option</button></div>
                            </div>

                            <div class="space-y-4 p-4 sm:p-5">
                                <div class="my-3 mx-4 h-px bg-slate-200 dark:bg-navy-500"></div>
                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-1">
                                    <label class="inline-flex items-center space-x-2">
                                        Enable extra time after the service.
                                    </label>
                                    <label class="inline-flex items-center space-x-2">
                                        <input class="form-switch h-5 w-10 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-accent dark:checked:before:bg-white" type="checkbox" checked={this.state.extratime}
                                        onChange={()=>{
                                            this.setState(({ extratime }) => ({ extratime: !extratime }))
                                        }}/>
                                        <span>Enable Extra Time.</span>
                                    </label>
                                </div>

                                { this.state.extratime ? 
                                    <div class="grid grid-cols-1 gap-4">
                                        <label class="block">
                                            Extra Time Duration*
                                        </label>
                                        <label class="mt-1 flex -space-x-px">
                                            <input class="form-input w-full border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Enter Price Duration" type="number" value={this.state.extratimeduration} id="extratimeduration" onChange={this.handleInputChange}/>
                                            <div class="flex items-center justify-center rounded-r-lg border border-slate-300 px-3.5 font-inter dark:border-navy-450">
                                                <span>Minutes</span>
                                            </div>
                                        </label>
                                    </div>
                                    : null
                                }
                                
                                <div class="my-3 mx-4 h-px bg-slate-200 dark:bg-navy-500"></div>
                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-1">
                                    <label class="inline-flex items-center space-x-2">
                                        Service Providers for the service.
                                    </label>
                                </div>
                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
                                    {this.state.teams.map((team) => ( 
                                        <div class={this.state.serviceteam.includes(''+team.id) ? "card hover:bg-primary hover:text-white border border-primary" : "card hover:bg-primary hover:text-white"} id={team.id} onClick={this.selectTeam}>
                                            <div class="flex flex-col items-center p-4 text-center sm:p-5">
                                                <div class="avatar h-20 w-20">
                                                    <img class="rounded-full" src={ team.profileimage} alt={team.firstname + " " + team.lastname} />
                                                </div>
                                                <h3 class="pt-3 text-lg font-medium">{team.firstname + " " + team.lastname}</h3>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-span-12 sm:col-span-14">
                        <div class="card px-4 py-4 sm:px-5">
                            <div class="m-2">
                                <h2 class="text-lg font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">Service Images</h2>
                            </div>
                            
                            <div class="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>
                            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
                                {this.state.serviceImages.map((serviceImages) => (
                                    <div class="card">
                                        <div class="text-right px-2">
                                            <div class="inline-flex">
                                                <button id={serviceImages.id} onClick={this.deteleImageAdded}  class="btn h-4 w-4 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25">
                                                    <i class="fa fa-times" aria-hidden="true"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <div class="px-2 pb-2">
                                            <img src={serviceImages.image} class="h-48 w-full rounded-lg object-cover object-center" alt="image"/>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div class="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>
                            { this.state.newImage == null ? null :
                                <div class="alert flex flex-col items-center justify-between rounded-lg border border-slate-300 px-4 py-2 text-center text-slate-800 dark:border-navy-450 dark:text-navy-50 sm:flex-row sm:space-y-0 sm:px-5">
                                    <p>{this.state.newImage.name} new iamge has been selected</p>
                                    <button class="btn space-x-2 rounded-full bg-slate-150 font-medium text-slate-800 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200/80 dark:bg-navy-500 dark:text-navy-50 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90" onClick={this.saveImageAdded}>
                                        <i class="fas fa-save"></i><span>Save Image</span>
                                    </button>
                                </div>
                            }
                            <div class="inline-space mt-5 flex flex-wrap">
                                <label class="btn relative bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90">
                                    {/* <input tabindex="-1" type="file" accept="image/png, image/jpeg, image/jpg" class="absolute inset-0 h-full w-full opacity-0" onChange={this.imageAdd}/> */}
                                     
                               <button  class="flex items-center space-x-2" alt="avatar" onClick={() => {
                                     this.setState({
                                        imageResizer : true
                                    })  }}>
                                   <i class="fa-solid fa-cloud-arrow-up text-base"></i>
                                   <span>Add New Image</span>
                                </button> 
                                </label>
                            </div>
                        </div>
                    </div>
                </div>  
                { this.state.imageResizer ?
                <ImageResize loader={this.state.loader} aspectRatio={1.5} imageModalClose={()=>this.imageModalClose(false)} changeImage={this.imageAdd} saveImageAdded={this.saveImageAdded}/> : <></>
            }
            </main>
        )
    }
}