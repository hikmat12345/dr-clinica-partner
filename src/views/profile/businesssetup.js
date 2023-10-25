import React from 'react';
import swal from 'sweetalert';
import axios from 'axios';
import PlacesAutocomplete, {geocodeByAddress} from 'react-places-autocomplete';
import configData from '../../utils/constants/config.json'

export default class BusinessSetup extends React.Component{

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
        businessName : "",
        website : "",
        address : "",
        appartment : "",
        distict : "",
        isnotValid:true,
        city : "",
        region : "",
        postalcode : "",
        country : 1,
        direction : "",
        description : "",
        lat : 0.000000,
        lng : 0.000000,
        gender : 0,
        genders : [],
        mainCategory : "",
        moreCategories : [],
        teamsize : "",
        software : "",
        hearabout : "",
        categories : [],
        teamsizes : [],
        softwares : [],
        hearaboutus : [],
        countries : [],
        businessNameForm : true,
        categoriesForm : false,
        detailsForm : false,
        addressForm : false,
        confirmationForm : false,
        gmapsLoaded : false
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
                teamsizes : resp.data.teamsizes,
                softwares : resp.data.softwares,
                hearaboutus : resp.data.hearaboutus,
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
            console.log(address)
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
        if(this.state.businessName === ""){
            document.getElementById("businessName").focus()
            return
        }
        if(this.state.website === ""){
            document.getElementById("website").focus()
            return
        }
        const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;

        if (urlRegex.test(this.state.website)) {
          // URL is valid
          this.setState({isnotValid: false});
         } else {
          // URL is invalid
          this.setState({isnotValid: true});
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

    detailsFormNext = (event) => {
        event.preventDefault()
        if(this.state.teamsize === ""){
            document.getElementById("teamsize").focus()
            return
        }
        if(this.state.software === ""){
            document.getElementById("software").focus()
            return
        }
        if(this.state.hearabout === ""){
            document.getElementById("hearabout").focus()
            return
        }
        this.setState({
            detailsForm : false,
            addressForm : true
        })
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
        bodyFormData.append('businessname', this.state.businessName)
        bodyFormData.append('website', this.state.website)
        bodyFormData.append('category', this.state.mainCategory)
        bodyFormData.append('teamsize', this.state.teamsize)
        bodyFormData.append('software', this.state.software)
        bodyFormData.append('hearabout', this.state.hearabout)
        bodyFormData.append('gender', this.state.gender)
        bodyFormData.append('morecategories', this.state.moreCategories)
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
        axios({
            method: "post",
            url: configData.SERVER_URL + 'partner/businesssetup/createBusiness',
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
                    window.location.href = "/";
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
    }

    render() {
        return (
                <div id="root" class="min-h-100vh flex grow bg-slate-50 dark:bg-navy-900" x-cloak>
                    <main class="main-content w-full px-[var(--margin-x)] pb-8">
                        <div class="flex items-center space-x-4 py-5 lg:py-6">
                            <h2 class="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">Business Setup</h2>
                            <div class="hidden h-full py-1 sm:flex">
                                <div class="h-full w-px bg-slate-300 dark:bg-navy-600"></div>
                            </div>
                            <ul class="hidden flex-wrap items-center space-x-2 sm:flex">
                                    <li class="flex items-center space-x-2">
                                        <a class="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent" href="#">Business</a>
                                        <svg x-ignore xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                        </svg>
                                    </li>
                                <li>Setup</li>
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
                                            <span>Business Name*</span>
                                            <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Enter Your Business Name" type="text" id="businessName" onChange={this.handleInputChange}/>
                                        </label>
                                        <label class="block">
                                            <span>Website URL*</span>
                                            <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Website URL" type="text" id="website" onChange={this.handleInputChange}/>
                                            {(this.state.isnotValid && this.state.website) && <p style={{color:"red", margin:"none"}}>Please enter a valid URL.</p>}
                                        </label>
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
                                                    detailsForm : true
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
                        
                        <div class={ this.state.detailsForm ? "grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6" : "grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6 hide"}>
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
                                            <h4 class="text-lg font-medium text-slate-700 dark:text-navy-100">Details</h4>
                                        </div>
                                    </div>
                                    <div class="space-y-4 p-4 sm:p-5">
                                        <label class="block">
                                            <span>What is your current team size?*</span>
                                            <select class="mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent  px-3 py-2" id="teamsize" onChange={this.handleInputChange}>
                                                <option value="" hidden>Select Team Size</option>
                                                {this.state.teamsizes.map((teamsize) => ( 
                                                    <option value={teamsize.id}>{teamsize.name}</option>
                                                ))}
                                            </select>
                                        </label>
                                        <label class="block">
                                            <span>What is your current business managment software?*</span>
                                            <select class="mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent  px-3 py-2" id="software" onChange={this.handleInputChange}>
                                                <option value="" hidden>Select Software</option>
                                                {this.state.softwares.map((software) => ( 
                                                    <option value={software.id}>{software.name}</option>
                                                ))}
                                            </select>
                                        </label>
                                        <label class="block">
                                            <span>Where did you hear about us?*</span>
                                            <select class="mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent  px-3 py-2" id="hearabout" onChange={this.handleInputChange}>
                                                <option value="" hidden>Select Option</option>
                                                {this.state.hearaboutus.map((element) => ( 
                                                    <option value={element.id}>{element.name}</option>
                                                ))}
                                            </select>
                                        </label>
                                        <div class="flex justify-center space-x-2 pt-4">
                                            <button class="btn space-x-2 bg-slate-150 font-medium text-slate-800 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200/80 dark:bg-navy-500 dark:text-navy-50 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
                                                onClick={() => this.setState({
                                                    categoriesForm : true,
                                                    detailsForm : false
                                                })}>
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fill-rule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd" />
                                                </svg>
                                                <span>Prev</span>
                                            </button>
                                            <button class="btn space-x-2 bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90" onClick={this.detailsFormNext}>
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
                                            <textarea rows="4" placeholder="Enter Directions" class="form-textarea w-full resize-none rounded-lg border border-slate-300 bg-transparent p-2.5 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" id="direction" onChange={this.handleInputChange}></textarea>
                                        </label>
                                        <label class="block">
                                            <span>Description</span>
                                            <textarea rows="4" placeholder="Enter Description" class="form-textarea w-full resize-none rounded-lg border border-slate-300 bg-transparent p-2.5 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" id="description" onChange={this.handleInputChange}></textarea>
                                        </label>
                                        <div class="flex justify-center space-x-2 pt-4">
                                            <button class="btn space-x-2 bg-slate-150 font-medium text-slate-800 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200/80 dark:bg-navy-500 dark:text-navy-50 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
                                                onClick={() => this.setState({
                                                    detailsForm : true,
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
                                            <span>Business Name</span>
                                            <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Enter Your Business Name" type="text" value={this.state.businessName} readOnly/>
                                        </label>
                                        <label class="block">
                                            <span>Website</span>
                                            <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Website URL" type="text" value={this.state.website} readOnly/>
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
                                            <span>What is your current team size?</span>
                                            <select class="mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent  px-3 py-2" id="teamsize" onChange={this.handleInputChange}>
                                                {this.state.teamsizes.map((teamsize) => {
                                                        if(teamsize.id == this.state.teamsize){
                                                            return <option value={teamsize.id}>{teamsize.name}</option>
                                                        }
                                                    }
                                                )}
                                            </select>
                                        </label>
                                        <label class="block">
                                            <span>What is your current business managment software?</span>
                                            <select class="mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent  px-3 py-2" id="software" onChange={this.handleInputChange}>
                                                {this.state.softwares.map((software) => {
                                                        if(software.id == this.state.software){
                                                            return <option value={software.id}>{software.name}</option>
                                                        }
                                                    }
                                                )}
                                            </select>
                                        </label>
                                        <label class="block">
                                            <span>Where did you hear about us?</span>
                                            <select class="mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent  px-3 py-2" id="hearabout" onChange={this.handleInputChange}>
                                                {this.state.hearaboutus.map((hearabout) => {
                                                        if(hearabout.id == this.state.hearabout){
                                                            return <option value={hearabout.id}>{hearabout.name}</option>
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
                                            <textarea rows="4" placeholder="Enter Directions" class="form-textarea w-full resize-none rounded-lg border border-slate-300 bg-transparent p-2.5 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" value={this.state.direction} readOnly></textarea>
                                        </label>
                                        <label class="block">
                                            <span>Description</span>
                                            <textarea rows="4" placeholder="Enter Description" class="form-textarea w-full resize-none rounded-lg border border-slate-300 bg-transparent p-2.5 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" value={this.state.description} readOnly></textarea>
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
                </div>
        )
    }
}