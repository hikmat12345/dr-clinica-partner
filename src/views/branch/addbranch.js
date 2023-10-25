import React from 'react';
import swal from 'sweetalert';
import axios from 'axios';
import PlacesAutocomplete, {geocodeByAddress} from 'react-places-autocomplete';
import configData from '../../utils/constants/config.json' 
import ImageResize from '../../components/ImageCropper/imageupload';
import PhoneInput from 'react-phone-number-input';
export default class AddBranch extends React.Component{

    static defaultProps = {
        center: {
        lat: 25.2048,
        lng: 55.2708
        },
        zoom: 13
    };

    constructor(props) {
      super(props)
      this.state = {
        locationName : "",
        locationEmail : "",
        locationPhone : "",
        address : "",
        appartment : "",
        distict : "",
        city : "",
        region : "",
        postalcode : "",
        country : 1,
        direction : "",
        lat : 0.000000,
        lng : 0.000000,
        mainCategory : "",
        gender : 0,
        moreCategories : [],
        categories : [],
        countries : [],
        genders : [],
        businessNameForm : true,
        categoriesForm : false,
        addressForm : false,
        confirmationForm : false,
        description:"",
        gmapsLoaded : false,
       
        voucherImage:"",
        step4 : false,
        imageResizer:false,
        imageResizerMobile: false,
        loader:false,
        uplodedImag:"",
        uplodedImagmobile:""
      };
      this.mapAdded = false
    }
    
    componentDidMount () {
        axios({
            method: "get",
            url: configData.SERVER_URL + 'partner/businesssetup/getdata',
            headers: { 
                "Content-Type": "application/x-www-form-urlencoded",
                "accesstoken" : configData.ACCESSTOKEN,
            },
        }).then(resp => {
            console.log(resp.data)
            if(parseInt(Object.keys(resp.data)[0]) === 200){
              this.setState({
                categories : resp.data.categories,
                countries : resp.data.countries,
                genders : resp.data.gender
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
        if(!this.mapAdded){ 
            this.mapAdded = true
            window.initMap = this.initMap
            const gmapScriptEl = document.createElement(`script`)
            gmapScriptEl.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCbW7sUOtCHtwO_QhbEsp8hjmlDwERkMWE&libraries=places&callback=initMap`
            document.querySelector(`body`).insertAdjacentElement(`beforeend`, gmapScriptEl)
        }
    }

    initMap = () => {
        this.setState({
          gmapsLoaded: true,
        })
    }
    
    handleChange = address => {
        this.setState({ address });

    };
    
    handleSelect = address => {
        this.setState({ address });
        document.getElementById("myAddress").value = address
        geocodeByAddress(address).then( results => {
            for (var i = 0; i < results[0].address_components.length; i++) {
                var addressType = results[0].address_components[i].types[0];
                if (addressType === "locality") {
                    this.setState({
                        city : results[0].address_components[i].long_name,
                        lat : results[0].geometry.location.lat(),
                        lng : results[0].geometry.location.lng()
                    });
                    document.getElementById("city").value = results[0].address_components[i].long_name
                }
            }
        });
    }

    handleInputChange = (event) => {
        event.preventDefault()
        this.setState({
            [event.target.id] : event.target.value
        });
    }
    
    businessNameFormNext = (event) => {
        event.preventDefault()
        if(this.state.locationName === ""){
            document.getElementById("locationName").focus()
            return
        }
        if(this.state.locationEmail === "" || !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.locationEmail)){
            document.getElementById("locationEmail").focus()
            return
        }
        if(this.state.locationPhone === ""){
            document.getElementById("locationPhone").focus()
            return
        }
        if(this.state.mainCategory === ""){
            document.getElementById("mainCategory").focus()
            return
        }
        if(this.state.gender === 0){
            document.getElementById("gender").focus()
            return
        }
        this.setState({
            businessNameForm : false,
            categoriesForm : true
        })
    }

    selectCategories = (event) => {
        event.preventDefault()
        if(this.state.moreCategories.includes(event.currentTarget.id)){
            this.setState({
                moreCategories: this.state.moreCategories.filter(function(category) { 
                    return category !== event.currentTarget.id
                  })
            })
            document.getElementById(event.currentTarget.id).classList.remove("border")
            document.getElementById(event.currentTarget.id).classList.remove("border-primary")
        }else{
            this.setState({
                moreCategories : [...this.state.moreCategories,event.currentTarget.id]
            })
            document.getElementById(event.currentTarget.id).classList.add("border")
            document.getElementById(event.currentTarget.id).classList.add("border-primary")
        }
    }

    addressFormNext = (event) => {
        event.preventDefault()
        if(this.state.address === ""){
            document.getElementById("address").focus()
            return
        }
        this.setState({
            addressForm : false,
            confirmationForm : true
        })
    }

    handleSubmit = (event) => {
        event.preventDefault()
        console.log(this.state)
        const savedToken = localStorage.getItem('loginToken')
        
        var bodyFormData = new URLSearchParams()
        bodyFormData.append('locationName', this.state.locationName)
        bodyFormData.append('locationEmail', this.state.locationEmail)
        bodyFormData.append('locationPhone', this.state.locationPhone)
        bodyFormData.append('category', this.state.mainCategory)
        bodyFormData.append('morecategories', this.state.moreCategories)
        bodyFormData.append('gender', this.state.gender)
        bodyFormData.append('address', this.state.address)
        bodyFormData.append('appartment', this.state.appartment)
        bodyFormData.append('distict', this.state.distict)
        bodyFormData.append('city', this.state.city)
        bodyFormData.append('region', this.state.region)
        bodyFormData.append('postalcode', this.state.postalcode)
        bodyFormData.append('direction', this.state.direction)
        bodyFormData.append('description', this.state.description)
        bodyFormData.append('lat', this.state.lat)
        bodyFormData.append('lng', this.state.lng)
        bodyFormData.append('country', this.state.country) 
        bodyFormData.append('bannerWeb',  this.state.uplodedImag[0])
        bodyFormData.append('bannerMobile',  this.state.uplodedImagmobile[0])

        if(this.state.uplodedImag[0]  && this.state.uplodedImagmobile[0]){

            axios({
                method: "post",
                url: configData.SERVER_URL + 'partner/businesssetup/createBranch',
                data: bodyFormData,
                headers: { 
                    "Content-Type": "application/x-www-form-urlencoded",
                    "accesstoken" : configData.ACCESSTOKEN,
                    "logintoken" : savedToken
                },
            }).then(resp => {
                if(parseInt(Object.keys(resp.data)[0]) === 200){
                    swal({
                        title: "Thank you for your registration!",
                        text: "Clinic activation will be done with in 48 hours",
                        icon: "success",
                        button: "ok",
                    }).then(function () {
                        window.location.href = "/account/locations";
                    });
                    
                }else{
                    swal({
                        title: "Business Information",
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
        } else{
            swal({
                title: "Banner images missing",
                text: "Please provide banner images",
                icon: "warning",
                button: "ok",
            })
        }
    }


    imageModalClose = (e) => {
        e ? this.setState({
            imageResizerMobile : true
        }):  this.setState({
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

    uploadImage = (isMobile) => {
        this.setState({loader :true})
        var bodyFormData = new FormData()
        bodyFormData.append('image', this.state.voucherImage)
        axios({
            method: "post",
            url: configData.SERVER_URL + 'partner/businesssetup/branch-banners',
            data : bodyFormData,
            headers: { 
                "Content-Type": "multipart/form-data",
                "accesstoken" : configData.ACCESSTOKEN,
                "logintoken" : localStorage.getItem('loginToken')
            },
        }).then(resp => {
            this.setState({loader :false})
            console.log(resp.data)
            if(isMobile){
            this.setState({
                imageResizerMobile : false,
                uplodedImagmobile : resp.data.data.url
            })} else {
                this.setState({
                imageResizer : false,
                uplodedImag : resp.data.data.url
            }) }
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
                <div id="root" class="min-h-100vh flex grow bg-slate-50 dark:bg-navy-900" x-cloak>
                    <main class="main-content w-full px-[var(--margin-x)] pb-8">
                        <div class="flex items-center space-x-4 py-5 lg:py-6">
                            <h2 class="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">Add Branch</h2>
                            <div class="hidden h-full py-1 sm:flex">
                                <div class="h-full w-px bg-slate-300 dark:bg-navy-600"></div>
                            </div>
                            <ul class="hidden flex-wrap items-center space-x-2 sm:flex">
                                    <li class="flex items-center space-x-2">
                                        <a class="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent" href="/account/locations">Branches</a>
                                        <svg x-ignore xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                        </svg>
                                    </li>
                                <li>Add Branch</li>
                            </ul>
                        </div>
                        <div class={ this.state.businessNameForm ? "grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6" : "grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6 hide"}>
                            <div class="col-span-12 grid lg:col-span-4 lg:place-items-center">
                                <div>
                                    <ol class="steps is-vertical line-space [--size:2.75rem] [--line:.5rem]">
                                        <li class="step space-x-4 pb-12 before:bg-slate-200 dark:before:bg-navy-500">
                                            <div class="step-header mask is-hexagon bg-primary text-white dark:bg-accent">
                                                <i class="fa-solid fa-layer-group text-base"></i>
                                            </div>
                                            <div class="text-left">
                                                <p class="text-xs text-slate-400 dark:text-navy-300">Step 1</p>
                                                <h3 class="text-base font-medium text-primary dark:text-accent-light">General</h3>
                                            </div>
                                        </li>
                                        <li class="step space-x-4 pb-12 before:bg-slate-200 dark:before:bg-navy-500">
                                            <div class="step-header mask is-hexagon bg-slate-200 text-slate-500 dark:bg-navy-500 dark:text-navy-100">
                                                <i class="fa-solid fa-list text-base"></i>
                                            </div>
                                            <div class="text-left">
                                                <p class="text-xs text-slate-400 dark:text-navy-300">Step 2</p>
                                                <h3 class="text-base font-medium">Details</h3>
                                            </div>
                                        </li>
                                        <li class="step space-x-4 pb-12 before:bg-slate-200 dark:before:bg-navy-500">
                                            <div class="step-header mask is-hexagon bg-slate-200 text-slate-500 dark:bg-navy-500 dark:text-navy-100">
                                                <i class="fa-solid fa-truck-fast text-base"></i>
                                            </div>
                                            <div class="text-left">
                                                <p class="text-xs text-slate-400 dark:text-navy-300">Step 3</p>
                                                <h3 class="text-base font-medium">Address</h3>
                                            </div>
                                        </li>
                                        <li class="step space-x-4 before:bg-slate-200 dark:before:bg-navy-500">
                                            <div class="step-header mask is-hexagon bg-slate-200 text-slate-500 dark:bg-navy-500 dark:text-navy-100">
                                                <i class="fa-solid fa-check text-base"></i>
                                            </div>
                                            <div class="text-left">
                                                <p class="text-xs text-slate-400 dark:text-navy-300">Step 4</p>
                                                <h3 class="text-base font-medium">Confirm</h3>
                                            </div>
                                        </li>
                                    </ol>
                                </div>
                            </div>
                            <div class="col-span-12 grid lg:col-span-8">
                                <div class="card">
                                    <div class="border-b border-slate-200 p-4 dark:border-navy-500 sm:px-5">
                                        <div class="flex items-center space-x-2">
                                            <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 p-1 text-primary dark:bg-accent-light/10 dark:text-accent-light">
                                                <i class="fa-solid fa-layer-group"></i>
                                            </div>
                                            <h4 class="text-lg font-medium text-slate-700 dark:text-navy-100">General</h4>
                                        </div>
                                    </div>
                                    <div class="space-y-4 p-4 sm:p-5">
                                        <label class="block">
                                            <span>Location Name*</span>
                                            <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Enter Your Business Name" type="text" id="locationName" onChange={this.handleInputChange}/>
                                        </label>
                                        <label class="block">
                                            <span>Location Email Address*</span>
                                            <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Enter Your Email Address" type="email" id="locationEmail" onChange={this.handleInputChange}/>
                                        </label>
                                        <label class="block">
                                            <span>Location contact number*</span>
                                            <div class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent">
                                                 <PhoneInput
                                                readOnly 
                                                class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                                                placeholder="+9715XXXXXXXX" type="text" 
                                                id="locationPhone" onChange={this.handleInputChange}
                                                  defaultCountry="AE"
                                                // onChange={(phone) => this.setState({ phone })}
                                                // onMouseOut={this.removeError}
                                            />
                                           </div>
                                        </label>
                                        <div class="grid grid-cols-2 gap-4 text-left">
                                            <label class="block">
                                            <div class="  mx-auto"> 
                                                    {this.state.uplodedImag?<><div className='pb-2'>Banner image for web (Size 1056X100) </div><img class=" border h-20 w-25 bg-slate-200" src={this.state.uplodedImag} alt="avatar" onClick={() => {
                                                        this.setState({
                                                        imageResizer : true
                                                        })
                                                    }}/></> :
                                                    <button class="btn h-16 min-w-[7rem] border  font-medium text-slate-800  bg-slate-150 focus:bg-slate-150 active:bg-slate-150/80 dark:border-navy-450 dark:text-navy-50 dark:hover:bg-navy-500 dark:focus:bg-navy-500 dark:active:bg-navy-500/90" style={{border:"dashed", width:"100%"}} id="btn1" alt="avatar" onClick={() => {
                                                        this.setState({
                                                        imageResizer : true
                                                        })
                                                    }}>
                                                        Add banner image for web (Size 1056X100)</button>}
                                                    <input type="file" id="profile" style={{ display : "none"}} accept="image/png, image/jpeg, image/jpg" onChange={this.handleImageChange} />
                                                </div>
                                        </label>
                                        <label class="block">
                                        <div class=""> 
                                                {this.state.uplodedImagmobile?<><div className='pb-2'>Banner image for mobile (Size 524X100) </div><img class=" border h-16 w-25 bg-slate-200" src={this.state.uplodedImagmobile} alt="avatar" onClick={() => {
                                                    this.setState({
                                                    imageResizerMobile : true
                                                    })
                                                }}/></> :
                                                <button class="btn h-16 min-w-[7rem] border  font-medium text-slate-800  bg-slate-150 focus:bg-slate-150 active:bg-slate-150/80 dark:border-navy-450 dark:text-navy-50 dark:hover:bg-navy-500 dark:focus:bg-navy-500 dark:active:bg-navy-500/90"  id="btn2" 
                                                style={{border:"dashed", width:"100%"}} alt="avatar" onClick={() => {
                                                    this.setState({
                                                    imageResizerMobile : true
                                                    })
                                                }}>
                                                    Add banner image for mobile (Size 524X100)</button>}
                                                <input type="file" id="profile" style={{ display : "none"}} accept="image/png, image/jpeg, image/jpg" onChange={this.handleImageChange} />
                                            </div>
                                        </label>
                                        </div>
                                        <label class="block">
                                            <span>Main Business Category*</span>
                                            <select class="mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent  px-3 py-2" id="mainCategory" onChange={this.handleInputChange}>
                                                <option value="" hidden>Select Category</option>
                                                {this.state.categories.map((category) => ( 
                                                    <option value={category.id}>{category.name}</option>
                                                ))}
                                            </select>
                                        </label>
                                        <label class="block">
                                            <span>Branch for*</span>
                                            <select class="mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent  px-3 py-2" id="gender" onChange={this.handleInputChange}>
                                                <option value="" hidden>Select Gender</option>
                                                {this.state.genders.map((gender) => ( 
                                                    <option value={gender.id}>{gender.name}</option>
                                                ))}
                                            </select>
                                        </label>
                                        <div class="flex justify-center space-x-2 pt-4">
                                            <button class="btn space-x-2 bg-slate-150 font-medium text-slate-800 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200/80 dark:bg-navy-500 dark:text-navy-50 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fill-rule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd" />
                                                </svg>
                                                <span>Prev</span>
                                            </button>
                                            <button class="btn space-x-2 bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90" onClick={this.businessNameFormNext}>
                                                <span>Next</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" >
                                                    <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class={ this.state.categoriesForm ? "grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6" : "grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6 hide"}>
                            <div class="col-span-12 grid lg:col-span-4 lg:place-items-center">
                                <div>
                                    <ol class="steps is-vertical line-space [--size:2.75rem] [--line:.5rem]">
                                        <li class="step space-x-4 pb-12 before:bg-primary dark:before:bg-accent-500">
                                            <div class="step-header mask is-hexagon bg-primary text-white dark:bg-accent">
                                                <i class="fa-solid fa-layer-group text-base"></i>
                                            </div>
                                            <div class="text-left">
                                                <p class="text-xs text-slate-400 dark:text-navy-300">Step 1</p>
                                                <h3 class="text-base font-medium text-primary dark:text-accent-light">General</h3>
                                            </div>
                                        </li>
                                        <li class="step space-x-4 pb-12 before:bg-slate-200 dark:before:bg-navy-500">
                                            <div class="step-header mask is-hexagon bg-primary text-white dark:bg-accent">
                                                <i class="fa-solid fa-list text-base"></i>
                                            </div>
                                            <div class="text-left">
                                                <p class="text-xs text-slate-400 dark:text-navy-300">Step 2</p>
                                                <h3 class="text-base font-medium text-primary dark:text-accent-light">Details</h3>
                                            </div>
                                        </li>
                                        <li class="step space-x-4 pb-12 before:bg-slate-200 dark:before:bg-navy-500">
                                            <div class="step-header mask is-hexagon bg-slate-200 text-slate-500 dark:bg-navy-500 dark:text-navy-100">
                                                <i class="fa-solid fa-truck-fast text-base"></i>
                                            </div>
                                            <div class="text-left">
                                                <p class="text-xs text-slate-400 dark:text-navy-300">Step 3</p>
                                                <h3 class="text-base font-medium">Address</h3>
                                            </div>
                                        </li>
                                        <li class="step space-x-4 before:bg-slate-200 dark:before:bg-navy-500">
                                            <div class="step-header mask is-hexagon bg-slate-200 text-slate-500 dark:bg-navy-500 dark:text-navy-100">
                                                <i class="fa-solid fa-check text-base"></i>
                                            </div>
                                            <div class="text-left">
                                                <p class="text-xs text-slate-400 dark:text-navy-300">Step 4</p>
                                                <h3 class="text-base font-medium">Confirm</h3>
                                            </div>
                                        </li>
                                    </ol>
                                </div>
                            </div>

                            <div class="col-span-12 grid lg:col-span-8">
                                <div class="card">
                                    <div class="border-b border-slate-200 p-4 dark:border-navy-500 sm:px-5">
                                        <div class="flex items-center space-x-2">
                                            <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 p-1 text-primary dark:bg-accent-light/10 dark:text-accent-light">
                                                <i class="fa-solid fa-layer-group"></i>
                                            </div>
                                            <h4 class="text-lg font-medium text-slate-700 dark:text-navy-100">Categories</h4>
                                        </div>
                                    </div>
                                    <div class="space-y-4 p-4 sm:p-5">
                                        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
                                            {this.state.categories.map((category) => ( 
                                                <div class="card hover:bg-primary hover:text-white" id={category.id} onClick={this.selectCategories}>
                                                    <div class="flex flex-col items-center p-4 text-center sm:p-5">
                                                        <div class="avatar h-20 w-20">
                                                            <img class="rounded-full" src={ configData.SERVER_URL + "assets/images/categories/" + category.image} alt={category.name} />
                                                        </div>
                                                        <h3 class="pt-3 text-lg font-medium">{category.name}</h3>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div class="flex justify-center space-x-2 pt-4">
                                            <button class="btn space-x-2 bg-slate-150 font-medium text-slate-800 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200/80 dark:bg-navy-500 dark:text-navy-50 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90" 
                                                onClick={() => this.setState({
                                                    businessNameForm : true,
                                                    categoriesForm : false
                                                })}>
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fill-rule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd" />
                                                </svg>
                                                <span>Prev</span>
                                            </button>
                                            <button class="btn space-x-2 bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
                                                onClick={() => this.setState({
                                                    categoriesForm : false,
                                                    addressForm : true
                                                })}>
                                                <span>Next</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" >
                                                    <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class={ this.state.addressForm ? "grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6" : "grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6 hide"}>
                            <div class="col-span-12 grid lg:col-span-4 lg:place-items-center">
                                <div>
                                    <ol class="steps is-vertical line-space [--size:2.75rem] [--line:.5rem]">
                                        <li class="step space-x-4 pb-12 before:bg-primary dark:before:bg-accent-500">
                                            <div class="step-header mask is-hexagon bg-primary text-white dark:bg-accent">
                                                <i class="fa-solid fa-layer-group text-base"></i>
                                            </div>
                                            <div class="text-left">
                                                <p class="text-xs text-slate-400 dark:text-navy-300">Step 1</p>
                                                <h3 class="text-base font-medium text-primary dark:text-accent-light">General</h3>
                                            </div>
                                        </li>
                                        <li class="step space-x-4 pb-12 before:bg-primary dark:before:bg-accent-500">
                                            <div class="step-header mask is-hexagon bg-primary text-white dark:bg-accent">
                                                <i class="fa-solid fa-list text-base"></i>
                                            </div>
                                            <div class="text-left">
                                                <p class="text-xs text-slate-400 dark:text-navy-300">Step 2</p>
                                                <h3 class="text-base font-medium text-primary dark:text-accent-light">Details</h3>
                                            </div>
                                        </li>
                                        <li class="step space-x-4 pb-12 before:bg-slate-200 dark:before:bg-navy-500">
                                            <div class="step-header mask is-hexagon bg-primary text-white dark:bg-accent">
                                                <i class="fa-solid fa-truck-fast text-base"></i>
                                            </div>
                                            <div class="text-left">
                                                <p class="text-xs text-slate-400 dark:text-navy-300">Step 3</p>
                                                <h3 class="text-base font-medium text-primary dark:text-accent-light">Address</h3>
                                            </div>
                                        </li>
                                        <li class="step space-x-4 before:bg-slate-200 dark:before:bg-navy-500">
                                            <div class="step-header mask is-hexagon bg-slate-200 text-slate-500 dark:bg-navy-500 dark:text-navy-100">
                                                <i class="fa-solid fa-check text-base"></i>
                                            </div>
                                            <div class="text-left">
                                                <p class="text-xs text-slate-400 dark:text-navy-300">Step 4</p>
                                                <h3 class="text-base font-medium">Confirm</h3>
                                            </div>
                                        </li>
                                    </ol>
                                </div>
                            </div>

                            <div class="col-span-12 grid lg:col-span-8">
                                <div class="card">
                                    <div class="border-b border-slate-200 p-4 dark:border-navy-500 sm:px-5">
                                        <div class="flex items-center space-x-2">
                                            <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 p-1 text-primary dark:bg-accent-light/10 dark:text-accent-light">
                                                <i class="fa-solid fa-layer-group"></i>
                                            </div>
                                            <h4 class="text-lg font-medium text-slate-700 dark:text-navy-100">General</h4>
                                        </div>
                                    </div>
                                    <div class="space-y-4 p-4 sm:p-5">
                                        {this.state.gmapsLoaded && (
                                            <PlacesAutocomplete 
                                            value={this.state.address}
                                            onChange={this.handleChange}
                                            onSelect={this.handleSelect}
                                            >
                                            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                                <div class="block">
                                                <input
                                                    {...getInputProps({
                                                    placeholder: 'Search Places ...',
                                                    className: 'location-search-input form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2',
                                                    id : 'address',
                                                    })}
                                                />
                                                <div className="autocomplete-dropdown-container" id="overlay">
                                                    {loading && <div>Loading...</div>}
                                                    {suggestions.map(suggestion => {
                                                    const className = suggestion.active
                                                        ? 'suggestion-item--active'
                                                        : 'suggestion-item';
                                                    // inline style for demonstration purpose
                                                    const style = suggestion.active
                                                        ? { backgroundColor: '#fafafa', cursor: 'pointer', padding: '5px' }
                                                        : { backgroundColor: '#ffffff', cursor: 'pointer', padding: '5px' };
                                                    return (
                                                        <div
                                                        {...getSuggestionItemProps(suggestion, {
                                                            className,
                                                            style,
                                                        })}
                                                        >
                                                        <span>{suggestion.description}</span>
                                                        </div>
                                                    );
                                                    })}
                                                </div>
                                                </div>
                                            )}
                                            </PlacesAutocomplete>
                                        )}
                                        <label class="block">
                                            <span>Address*</span>
                                            <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Address" type="text" id="myAddress" readOnly/>
                                        </label>
                                        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <label class="block">
                                                <span>Appartment</span>
                                                <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Appartment" type="text" id="appartment" onChange={this.handleInputChange}/>
                                            </label>
                                            <div class="grid grid-cols-2 gap-4">
                                                <label class="block">
                                                    <span>City*</span>
                                                    <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="City" type="text" id="city" onChange={this.handleInputChange}/>
                                                </label>
                                                <label class="block">
                                                    <span>Post Code</span>
                                                    <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Post Code" type="text" id="postalcode" onChange={this.handleInputChange}/>
                                                </label>
                                            </div>
                                        </div>
                                        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div class="grid grid-cols-2 gap-4">
                                                <label class="block">
                                                    <span>Distict</span>
                                                    <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Distict" type="text" id="distict" onChange={this.handleInputChange}/>
                                                </label>
                                                <label class="block">
                                                    <span>Region</span>
                                                    <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Region" type="text" id="region" onChange={this.handleInputChange}/>
                                                </label>
                                            </div>
                                            <label class="block">
                                                <span>Country*</span>
                                                <select class="mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent  px-3 py-2" id="country" onChange={this.handleInputChange}>
                                                    {this.state.countries.map((country) => ( 
                                                        <option value={country.id}>{country.name}</option>
                                                    ))}
                                                </select>
                                            </label>
                                        </div>
                                        <label class="block">
                                            <span>Directions</span>
                                            <textarea rows="4" style={{   border: "1px solid"}} placeholder="Enter Directions" class="form-textarea w-full resize-none rounded-lg border border-slate-300 bg-transparent p-2.5 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" id="direction" onChange={this.handleInputChange}></textarea>
                                        </label>
                                        <label class="block">
                                            <span>Description</span>
                                            <textarea rows="4" style={{ border: "1px solid"}} placeholder="Enter description" class="form-textarea w-full resize-none rounded-lg border border-slate-300 bg-transparent p-2.5 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" id="description" onChange={this.handleInputChange}></textarea>
                                        </label>
                                        <div class="flex justify-center space-x-2 pt-4">
                                            <button class="btn space-x-2 bg-slate-150 font-medium text-slate-800 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200/80 dark:bg-navy-500 dark:text-navy-50 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
                                                onClick={() => this.setState({
                                                    categoriesForm : true,
                                                    addressForm : false
                                                })}>
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fill-rule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd" />
                                                </svg>
                                                <span>Prev</span>
                                            </button>
                                            <button class="btn space-x-2 bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90" onClick={this.addressFormNext}>
                                                <span>Next</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" >
                                                    <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class={ this.state.confirmationForm ? "grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6" : "grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6 hide"}>
                            <div class="col-span-12 grid lg:col-span-4 lg:place-items-center">
                                <div>
                                    <ol class="steps is-vertical line-space [--size:2.75rem] [--line:.5rem]">
                                        <li class="step space-x-4 pb-12 before:bg-primary dark:before:bg-accent-500">
                                            <div class="step-header mask is-hexagon bg-primary text-white dark:bg-accent">
                                                <i class="fa-solid fa-layer-group text-base"></i>
                                            </div>
                                            <div class="text-left">
                                                <p class="text-xs text-slate-400 dark:text-navy-300">Step 1</p>
                                                <h3 class="text-base font-medium text-primary dark:text-accent-light">General</h3>
                                            </div>
                                        </li>
                                        <li class="step space-x-4 pb-12 before:bg-primary dark:before:bg-accent-500">
                                            <div class="step-header mask is-hexagon bg-primary text-white dark:bg-accent">
                                                <i class="fa-solid fa-list text-base"></i>
                                            </div>
                                            <div class="text-left">
                                                <p class="text-xs text-slate-400 dark:text-navy-300">Step 2</p>
                                                <h3 class="text-base font-medium text-primary dark:text-accent-light">Details</h3>
                                            </div>
                                        </li>
                                        <li class="step space-x-4 pb-12 before:bg-primary dark:before:bg-accent-500">
                                            <div class="step-header mask is-hexagon bg-primary text-white dark:bg-accent">
                                                <i class="fa-solid fa-truck-fast text-base"></i>
                                            </div>
                                            <div class="text-left">
                                                <p class="text-xs text-slate-400 dark:text-navy-300">Step 3</p>
                                                <h3 class="text-base font-medium text-primary dark:text-accent-light">Address</h3>
                                            </div>
                                        </li>
                                        <li class="step space-x-4 before:bg-slate-200 dark:before:bg-navy-500">
                                            <div class="step-header mask is-hexagon bg-primary text-white dark:bg-accent">
                                                <i class="fa-solid fa-check text-base"></i>
                                            </div>
                                            <div class="text-left">
                                                <p class="text-xs text-slate-400 dark:text-navy-300">Step 4</p>
                                                <h3 class="text-base font-medium text-primary dark:text-accent-light">Confirm</h3>
                                            </div>
                                        </li>
                                    </ol>
                                </div>
                            </div>

                            <div class="col-span-12 grid lg:col-span-8">
                                <div class="card">
                                    <div class="border-b border-slate-200 p-4 dark:border-navy-500 sm:px-5">
                                        <div class="flex items-center space-x-2">
                                            <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 p-1 text-primary dark:bg-accent-light/10 dark:text-accent-light">
                                                <i class="fa-solid fa-layer-group"></i>
                                            </div>
                                            <h4 class="text-lg font-medium text-slate-700 dark:text-navy-100">General</h4>
                                        </div>
                                    </div>
                                    <div class="space-y-4 p-4 sm:p-5">
                                        <label class="block">
                                            <span>Location Name</span>
                                            <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" type="text" value={this.state.locationName} readOnly/>
                                        </label>
                                        <label class="block">
                                            <span>Location Email Address</span>
                                            <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" type="text" value={this.state.locationEmail} readOnly/>
                                        </label>
                                        <label class="block">
                                            <span>Location Phone Number</span>
                                            <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" type="text" value={this.state.locationPhone} readOnly/>
                                        </label>
                                        <label class="block">
                                            <span>Main Business Category</span>
                                            <select class="mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent  px-3 py-2" readOnly>
                                                {this.state.categories.map((category) => {
                                                        if(category.id == this.state.mainCategory){
                                                            return <option value={category.id}>{category.name}</option>
                                                        }
                                                    }
                                                )}
                                            </select>
                                        </label>
                                        <label class="block">
                                            <span>Address</span>
                                            <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Address" type="text" value={this.state.address} readOnly/>
                                        </label>
                                        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <label class="block">
                                                <span>Appartment</span>
                                                <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Appartment" type="text" value={this.state.appartment} readOnly/>
                                            </label>
                                            <div class="grid grid-cols-2 gap-4">
                                                <label class="block">
                                                    <span>City</span>
                                                    <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="City" type="text" value={this.state.city} readOnly/>
                                                </label>
                                                <label class="block">
                                                    <span>Post Code</span>
                                                    <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Post Code" type="text" value={this.state.postalcode} readOnly/>
                                                </label>
                                            </div>
                                        </div>
                                        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div class="grid grid-cols-2 gap-4">
                                                <label class="block">
                                                    <span>Distict</span>
                                                    <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Distict" type="text" value={this.state.distict} readOnly/>
                                                </label>
                                                <label class="block">
                                                    <span>Region</span>
                                                    <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Region" type="text" value={this.state.region} readOnly/>
                                                </label>
                                            </div>
                                            <label class="block">
                                                <span>Country</span>
                                                <select class="mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent  px-3 py-2" id="country" onChange={this.handleInputChange}>
                                                    {this.state.countries.map((country) => {
                                                            if(country.id == this.state.country){
                                                                return <option value={country.id}>{country.name}</option>
                                                            }
                                                        }
                                                    )}
                                                </select>
                                            </label>
                                        </div>
                                        <label class="block">
                                            <span>Directions</span>
                                            <textarea style={{ border: "1px solid"}} rows="4" placeholder="Enter Directions" class="form-textarea w-full resize-none rounded-lg border border-slate-300 bg-transparent p-2.5 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" value={this.state.direction} readOnly></textarea>
                                        </label>
                                        <label class="block">
                                            <span>Description</span>
                                            <textarea style={{ border: "1px solid"}} rows="4" placeholder="Enter Descriptions" class="form-textarea w-full resize-none rounded-lg border border-slate-300 bg-transparent p-2.5 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" value={this.state.description} readOnly></textarea>
                                        </label>
                                        <div class="flex justify-center space-x-2 pt-4">
                                            <button class="btn space-x-2 bg-slate-150 font-medium text-slate-800 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200/80 dark:bg-navy-500 dark:text-navy-50 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
                                                onClick={() => this.setState({
                                                    addressForm : true,
                                                    confirmationForm : false
                                                })}>
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fill-rule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd" />
                                                </svg>
                                                <span>Prev</span>
                                            </button>
                                            <button class="btn space-x-2 bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90" onClick={this.handleSubmit}>
                                                <span>Submit</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" >
                                                    <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </main>
                    { this.state.imageResizer ?
                <ImageResize loader={this.state.loader} aspectRatio={10.56} imageModalClose={()=>this.imageModalClose(false)} changeImage={this.changeImage} saveImageAdded={()=>this.uploadImage(false)}/> : <></>
                    }
                    { this.state.imageResizerMobile ?
                        <ImageResize loader={this.state.loader} aspectRatio={5.24} imageModalClose={()=>this.imageModalClose(true)} changeImage={this.changeImage} saveImageAdded={()=>this.uploadImage(true)}/> : <></>
                    }
                </div>
        )
    }
}