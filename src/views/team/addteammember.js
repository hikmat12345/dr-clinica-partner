import React from 'react'
import swal from 'sweetalert'
import axios from 'axios'
import configData from '../../utils/constants/config.json'
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import ImageResize from '../../components/ImageCropper/imageupload';

export default class AddNewTeamMember extends React.Component{

    constructor(props) {
        super(props)
        this.state = {
            basicInfo : true,
            booking : false,
            servicesInfo : false,
            confirmation : false,
            branches : [],
            categories : [],
            subcategories : [],
            selectedSubCategory : null,
            services : [],
            profileSrc : "/images/upload-image.png",
            profile : null,
            firstname : "",
            lastname : "",
            title : "",
            note : "",
            email : "",
            phone : "",
            startdate : "",
            enddate : "",
            branch : null,
            onlinebooking : true,
            calendarbooking : true,
            calendarcolor : "#ffffff",
            selectedServices : [],
            selectedService : "",
            imageResizer: false
        }
    }

    componentDidMount () {
        axios({
            method: "get",
            url: configData.SERVER_URL + 'partner/team/createTeamMemberPreLoad',
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
                services : resp.data.services
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
        this.setState({
            [event.target.id] : event.target.value
        });
    }

    handleImageChange = (event) => {
        event.preventDefault()
        var url = URL.createObjectURL(event.target.files[0])
        this.setState({
            [event.target.id] : event.target.files[0],
            profileSrc : url
        });
    }

    handleBasicInfoNext = (event) => {
        event.preventDefault()
        this.setState({
            startdate : document.getElementById("startdate").value,
            enddate : document.getElementById('enddate').value
        })
        if(this.state.profile == null){
            swal({
                title: "Profile Image",
                text: "Please upload profile image",
                icon: "warning",
                button: "ok",
            })
            return
        }
        if(this.state.firstname === ""){
            document.getElementById("firstname").focus()
            return
        }
        if(this.state.lastname === ""){
            document.getElementById("lastname").focus()
            return
        }
        if(this.state.title === ""){
            document.getElementById("title").focus()
            return
        }
        if(this.state.email === ""){
            document.getElementById("email").focus()
            return
        }
        if(this.state.phone === ""){
            document.getElementById("phone").focus()
            return
        }
        if(document.getElementById("startdate").value === ""){
            document.getElementById("startdate").focus()
            return
        }
        // if(this.state.enddate === ""){
        //     document.getElementById("enddate").focus()
        //     return
        // }
        this.setState({
            basicInfo : false,
            booking : true
        })
    }

    handleBookingNext = (event) => {
        event.preventDefault()
        if(this.state.branch === null){
            document.getElementById("branch").focus()
            return
        }
        axios({
            method: "get",
            url: configData.SERVER_URL + 'partner/team/team-member-pre-load/' + this.state.branch,
            headers: { 
                "Content-Type": "application/x-www-form-urlencoded",
                "accesstoken" : configData.ACCESSTOKEN,
                "logintoken" : localStorage.getItem('loginToken')
            },
        }).then(resp => {
            if(resp.data.categoryWithSubCategoryAndService.length > 0){
                this.setState({
                    categories : resp.data.categoryWithSubCategoryAndService,
                    booking : false,
                    servicesInfo : true
                })
            }else{

                this.setState({
                    booking : false,
                    confirmation : true
                })
            }
        }).catch(err => {
            swal({
                title: "Services Information",
                text: err.response.data[Object.keys(err.response.data)[0]],
                icon: "warning",
                button: "ok",
            })
            console.log(err)
        })
    }

    handleAddService = (event) => {
        event.preventDefault()
        if(event.currentTarget.value !== ""){
            this.state.services.forEach(service => {
                if(service.id == event.currentTarget.value){
                    this.setState({
                        selectedServices : [...this.state.selectedServices,service],
                        selectedService: service
                    })
                }
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

    handleServicesNext = (event) => {
        event.preventDefault()
        // if(this.state.selectedServices.length < 1){
        //     swal({
        //         title: "Service Information",
        //         text: "Please select at least one service for team member",
        //         icon: "warning",
        //         button: "ok",
        //     })
        //     return
        // }
        this.setState({
            servicesInfo : false,
            confirmation : true
        })
    }

    handleConfirmTeamMember = () => {
        let bodyFormData = new FormData()
        bodyFormData.append('profile', this.state.profile)
        bodyFormData.append('firstname', this.state.firstname)
        bodyFormData.append('lastname', this.state.lastname)
        bodyFormData.append('title', this.state.title)
        bodyFormData.append('note', this.state.note)
        bodyFormData.append('email', this.state.email)
        bodyFormData.append('phone', this.state.phone)
        bodyFormData.append('startdate', this.state.startdate)
        bodyFormData.append('enddate', this.state.enddate == "" ? null : this.state.enddate)
        bodyFormData.append('branch', this.state.branch)
        bodyFormData.append('onlinebooking', this.state.onlinebooking ? 1 : 0)
        bodyFormData.append('calendarbooking', this.state.calendarbooking ? 1 : 0)
        bodyFormData.append('calendarcolor', this.state.calendarcolor)
        bodyFormData.append('selectedServices', JSON.stringify(this.state.selectedServices))
        axios({
            method: "post",
            url: configData.SERVER_URL + 'partner/team/createTeamMember',
            data: bodyFormData,
            headers: { 
                "Content-Type": "multipart/form-data",
                "accesstoken" : configData.ACCESSTOKEN,
                "logintoken" : localStorage.getItem('loginToken')
            },
        }).then(resp => {
         
              swal({
                title: "Service Provider Information",
                text: resp.data[Object.keys(resp.data)[0]],
                icon: "success",
                button: "ok",
              })
            window.location.href="/team/teammember";
        }).catch(err => {
            swal({
                title: "Service Provider Information",
                text: err.response.data[Object.keys(err.response.data)[0]],
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
            profile : file,
            profileSrc : url
        });
    }

    render() {
        return (
            <main class="main-content px-[var(--margin-x)] pb-8">
                <div class="flex items-center space-x-4 py-5 lg:py-6">
                    <h2 class="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">Add New Service Provider</h2>
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
                    <li>Add New Service Provider</li>
                    </ul>
                </div>
                
                <div class={ this.state.basicInfo ? "grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6" : "grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6 hide"}>
                    <div class="col-span-12 grid lg:col-span-4 lg:place-items-center">
                        <div>
                            <ol class="steps is-vertical line-space [--size:2.75rem] [--line:.5rem]">
                                <li class="step space-x-4 pb-12 before:bg-slate-200 dark:before:bg-navy-500">
                                    <div class="step-header mask is-hexagon bg-primary text-white dark:bg-accent">
                                        <i class="fa-solid fa-layer-group text-base"></i>
                                    </div>
                                    <div class="text-left">
                                        <p class="text-xs text-slate-400 dark:text-navy-300">Step 1</p>
                                        <h3 class="text-base font-medium text-primary dark:text-accent-light">Basic Info</h3>
                                    </div>
                                </li>
                                <li class="step space-x-4 pb-12 before:bg-slate-200 dark:before:bg-navy-500">
                                    <div class="step-header mask is-hexagon bg-slate-200 text-slate-500 dark:bg-navy-500 dark:text-navy-100">
                                        <i class="fa-solid fa-ticket text-base"></i>
                                    </div>
                                    <div class="text-left">
                                        <p class="text-xs text-slate-400 dark:text-navy-300">Step 2</p>
                                        <h3 class="text-base font-medium">Booking</h3>
                                    </div>
                                </li>
                                <li class="step space-x-4 pb-12 before:bg-slate-200 dark:before:bg-navy-500">
                                    <div class="step-header mask is-hexagon bg-slate-200 text-slate-500 dark:bg-navy-500 dark:text-navy-100">
                                        <i class="fa-solid fa-wrench text-base"></i>
                                    </div>
                                    <div class="text-left">
                                        <p class="text-xs text-slate-400 dark:text-navy-300">Step 3</p>
                                        <h3 class="text-base font-medium">Services</h3>
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
                                    <h4 class="text-lg font-medium text-slate-700 dark:text-navy-100">Basic Infomation</h4>
                                </div>
                            </div>
                            <div class="space-y-4 p-4 sm:p-5">
                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-12">
                                    <div class="grid grid-cols-1 gap-4 mx-auto my-auto sm:col-span-4">
                                        <div class="avatar h-48 w-48">
                                            <img class="rounded-full bg-slate-200" src={this.state.profileSrc} alt="avatar" onClick={() => {
                                                // document.getElementById("profile").click()
                                                this.setState({
                                                    imageResizer: true
                                                })
                                            }}/>
                                            <input type="file" id="profile" style={{ display : "none"}} accept="image/png, image/jpeg" onChange={this.handleImageChange} />
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-1 gap-4 sm:col-span-8">
                                        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div class="grid grid-cols-1 gap-4">
                                                <label class="block text-left">
                                                    <span>First Name*</span>
                                                    <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="First Name" type="text" id="firstname" onChange={this.handleInputChange}/>
                                                </label>
                                            </div>
                                            <div class="grid grid-cols-1 gap-4">
                                                <label class="block text-left">
                                                    <span>Last Name*</span>
                                                    <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Last Name" type="text" id="lastname" onChange={this.handleInputChange}/>
                                                </label>
                                            </div>
                                        </div>
                                        <div class="grid grid-cols-1 gap-4">
                                            <label class="block text-left">
                                                <span>Team Member Title*</span>
                                                <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Title" type="text" id="title" onChange={this.handleInputChange}/>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div class="grid grid-cols-1 gap-4">
                                    <label class="block text-left">
                                        <span>Note (Optional)</span>
                                        <textarea rows="4" placeholder="Note" class="form-textarea w-full resize-none rounded-lg border border-slate-300 bg-transparent p-2.5 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" id="note" onChange={this.handleInputChange}></textarea>
                                    </label>
                                </div>

                                <div class="my-3 mx-4 h-px bg-slate-200 dark:bg-navy-500"></div>

                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div class="grid grid-cols-1 gap-4">
                                        <label class="block text-left">
                                            <span>Email*</span>
                                            <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Email" type="email" id="email" onChange={this.handleInputChange}/>
                                        </label>
                                    </div>
                                    <div class="grid grid-cols-1 gap-4">
                                        <label class="block text-left">
                                            <span>Phone Number*</span>
                                            <PhoneInput id="tel" className="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Enter contact number" defaultCountry="AE" onChange={ phone => this.setState({ phone }) } onMouseOut={this.removeError} />
                                    
                                        </label>
                                    </div>
                                </div>

                                <div class="my-3 mx-4 h-px bg-slate-200 dark:bg-navy-500"></div>
                                <h6 class="font-medium text-slate-700 dark:text-navy-100 text-left">Please select the employment start and end date.</h6>
                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div class="grid grid-cols-1 gap-4">
                                        <label class="relative flex">
                                            <input x-init="$el._x_flatpickr = flatpickr($el)" class="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Start Date" type="text" id="startdate"/>
                                            <span class="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                                </svg>
                                            </span>
                                        </label>
                                    </div>
                                    <div class="grid grid-cols-1 gap-4">
                                        <label class="relative flex">
                                            <input x-init="$el._x_flatpickr = flatpickr($el)" class="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="End Date" type="text" id="enddate"/>
                                            <span class="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                                </svg>
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                <div class="flex justify-center space-x-2 pt-4">
                                    <button class="btn space-x-2 bg-slate-150 font-medium text-slate-800 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200/80 dark:bg-navy-500 dark:text-navy-50 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd" />
                                        </svg>
                                        <span>Prev</span>
                                    </button>
                                    <button class="btn space-x-2 bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90" onClick={this.handleBasicInfoNext}>
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
                
                <div class={ this.state.booking ? "grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6" : "grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6 hide"}>
                    <div class="col-span-12 grid lg:col-span-4 lg:place-items-center">
                        <div>
                            <ol class="steps is-vertical line-space [--size:2.75rem] [--line:.5rem]">
                                <li class="step space-x-4 pb-12 before:bg-primary dark:before:bg-navy-500">
                                    <div class="step-header mask is-hexagon bg-primary text-white dark:bg-accent">
                                        <i class="fa-solid fa-layer-group text-base"></i>
                                    </div>
                                    <div class="text-left">
                                        <p class="text-xs text-slate-400 dark:text-navy-300">Step 1</p>
                                        <h3 class="text-base font-medium text-primary dark:text-accent-light">Basic Info</h3>
                                    </div>
                                </li>
                                <li class="step space-x-4 pb-12 before:bg-slate-200 dark:before:bg-navy-500">
                                    <div class="step-header mask is-hexagon bg-primary text-white dark:bg-accent">
                                        <i class="fa-solid fa-ticket text-base"></i>
                                    </div>
                                    <div class="text-left">
                                        <p class="text-xs text-slate-400 dark:text-navy-300">Step 2</p>
                                        <h3 class="text-base font-medium">Booking</h3>
                                    </div>
                                </li>
                                <li class="step space-x-4 pb-12 before:bg-slate-200 dark:before:bg-navy-500">
                                    <div class="step-header mask is-hexagon bg-slate-200 text-slate-500 dark:bg-navy-500 dark:text-navy-100">
                                        <i class="fa-solid fa-wrench text-base"></i>
                                    </div>
                                    <div class="text-left">
                                        <p class="text-xs text-slate-400 dark:text-navy-300">Step 3</p>
                                        <h3 class="text-base font-medium">Services</h3>
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
                    <div class="col-span-12 grid lg:col-span-8 text-left">
                        <div class="card">
                            <div class="border-b border-slate-200 p-4 dark:border-navy-500 sm:px-5">
                                <div class="flex items-center space-x-2">
                                    <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 p-1 text-primary dark:bg-accent-light/10 dark:text-accent-light">
                                        <i class="fa-solid fa-ticket"></i>
                                    </div>
                                    <h4 class="text-lg font-medium text-slate-700 dark:text-navy-100">Booking Infomation</h4>
                                </div>
                            </div>
                            <div class="space-y-4 p-4 sm:p-5">
                                <label class="block">
                                    <span>Set branch*</span>
                                    <select class="mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent  px-3 py-2" id="branch" onChange={this.handleInputChange}>
                                        <option value="" hidden>Select Option</option>
                                        {this.state.branches.map((branch) => ( 
                                            <option value={branch.id}>{branch.address}</option>
                                        ))}
                                    </select>
                                </label>
                                <div class="my-3 mx-4 h-px bg-slate-200 dark:bg-navy-500"></div>
                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-1">
                                    {/* <label class="inline-flex items-center space-x-2">
                                        Enable online bookings, choose who the service is available for and add a short description.
                                    </label> */}
                                    <label class="inline-flex items-center space-x-2">
                                        <input class="form-switch h-5 w-10 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-accent dark:checked:before:bg-white" type="checkbox" value={this.state.onlinebooking} defaultChecked={true} id="onlinebooking" 
                                        onChange={()=>{
                                                this.setState(({ onlinebooking }) => ({ onlinebooking: !onlinebooking }))
                                        }}/>
                                        <span>Enable Online Booking.</span>
                                    </label>
                                </div>
                                <div class="my-3 mx-4 h-px bg-slate-200 dark:bg-navy-500"></div>
                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-1">
                                        {/* <label class="inline-flex items-center space-x-2">
                                            Enable calender bookings, choose who the service is available for and add a short description.
                                        </label> */}
                                    <label class="inline-flex items-center space-x-2">
                                        <input class="form-switch h-5 w-10 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-accent dark:checked:before:bg-white" type="checkbox" value={this.state.calendarbooking} defaultChecked={true} id="onlinebooking" 
                                        onChange={()=>{
                                                this.setState(({ calendarbooking }) => ({ calendarbooking: !calendarbooking }))
                                        }}/>
                                        <span>Enable Calender Booking.</span>
                                    </label>
                                </div>

                                <div class="flex justify-center space-x-2 pt-4">
                                    <button class="btn space-x-2 bg-slate-150 font-medium text-slate-800 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200/80 dark:bg-navy-500 dark:text-navy-50 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        this.setState({
                                            basicInfo : true,
                                            booking : false
                                        })
                                    }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd" />
                                        </svg>
                                        <span>Prev</span>
                                    </button>
                                    <button class="btn space-x-2 bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90" onClick={this.handleBookingNext}>
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

                <div class={ this.state.servicesInfo ? "grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6" : "grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6 hide"}>
                    <div class="col-span-12 grid lg:col-span-4 lg:place-items-center">
                        <div>
                            <ol class="steps is-vertical line-space [--size:2.75rem] [--line:.5rem]">
                                <li class="step space-x-4 pb-12 before:bg-primary dark:before:bg-navy-500">
                                    <div class="step-header mask is-hexagon bg-primary text-white dark:bg-accent">
                                        <i class="fa-solid fa-layer-group text-base"></i>
                                    </div>
                                    <div class="text-left">
                                        <p class="text-xs text-slate-400 dark:text-navy-300">Step 1</p>
                                        <h3 class="text-base font-medium text-primary dark:text-accent-light">Basic Info</h3>
                                    </div>
                                </li>
                                <li class="step space-x-4 pb-12 before:bg-primary dark:before:bg-navy-500">
                                    <div class="step-header mask is-hexagon bg-primary text-white dark:bg-accent">
                                        <i class="fa-solid fa-ticket text-base"></i>
                                    </div>
                                    <div class="text-left">
                                        <p class="text-xs text-slate-400 dark:text-navy-300">Step 2</p>
                                        <h3 class="text-base font-medium">Booking</h3>
                                    </div>
                                </li>
                                <li class="step space-x-4 pb-12 before:bg-slate-200 dark:before:bg-navy-500">
                                    <div class="step-header mask is-hexagon bg-primary text-white dark:bg-accent">
                                        <i class="fa-solid fa-wrench text-base"></i>
                                    </div>
                                    <div class="text-left">
                                        <p class="text-xs text-slate-400 dark:text-navy-300">Step 3</p>
                                        <h3 class="text-base font-medium">Services</h3>
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
                                        <i class="fa-solid fa-wrench"></i>
                                    </div>
                                    <h4 class="text-lg font-medium text-slate-700 dark:text-navy-100">Services</h4>
                                </div>
                            </div>
                            <div class="space-y-4 p-4 sm:p-5 text-left">
                                <div className="grid grid-cols-2 gap-4">
                                    <label className="block">
                                    <span>Category*</span>
                                    <select
                                        className="mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent  px-3 py-2"
                                        id="category"
                                        onChange={(e) => {
                                            let subcategories = this.state.categories.filter((category) => category.id == e.currentTarget.value)
                                            console.log(subcategories)
                                            this.setState({
                                                subcategories : subcategories[0].subcategory,
                                                selectedSubCategory : subcategories[0].subcategory[0].id,
                                                selectedService : ""
                                            })
                                        }}
                                    >
                                        <option value="" hidden>Select Category</option>
                                        {this.state.categories.map((category) => (
                                            <option value={category.id}>{category.name}</option>
                                        ))}
                                    </select>
                                    </label>
                                    <label className="block">
                                    <span>Select Section*</span>
                                    <select
                                        className="mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent  px-3 py-2"
                                        id="subcategory"
                                        onChange={(e) => {
                                            console.log(e.currentTarget.value)
                                            this.setState({
                                                selectedSubCategory : e.currentTarget.value,
                                                selectedService : ""
                                            })
                                        }}
                                    >
                                        <option value="" hidden selected>Select Section</option>
                                        {this.state.subcategories.map((subcategory) => (
                                            <option value={subcategory.id}>{subcategory.name}</option>
                                        ))}
                                    </select>
                                    </label>
                                </div>
                                <label class="block">
                                    <span>Select Services*</span>
                                    <select class="mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent  px-3 py-2" id="selectedServices" value={this.state.selectedService} onChange={this.handleAddService}>
                                        <option value="">Select Option</option>
                                        {this.state.services.filter(filterService => filterService.subcategory == this.state.selectedSubCategory).map((service) => ( 
                                            <option value={service.id}>{service.name}</option>
                                        ))}
                                    </select>
                                </label>
                                <div class="my-3 mx-4 h-px bg-slate-200 dark:bg-navy-500"></div>
                                <h6 class="text-lg font-medium text-slate-700 dark:text-navy-100">Selected Services</h6>
                                
                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
                                    {this.state.selectedServices.map((service) => (
                                        <div class="rounded-lg bg-gradient-to-r from-sky-400 to-blue-600 p-1 text-white float-right" id={service.id}>
                                            <div class="flex items-center justify-between">
                                                <h2 class="font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100 lg:text-base"></h2>
                                                <button class="btn -mr-1.5 h-7 w-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25" id={service.id} onClick={this.handleRemoveService}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                            
                                            <div class="flex flex-col items-center p-4 text-center sm:p-5">
                                                <div class="avatar h-20 w-20">
                                                    <img class="rounded-full" src={ configData.SERVER_URL + "assets/images/categories/" + service.category_categoryToservice.image} alt={service.name} />
                                                </div>
                                                <h3 class="pt-3 text-lg font-medium">{service.name}</h3>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div class="flex justify-center space-x-2 pt-4">
                                    <button class="btn space-x-2 bg-slate-150 font-medium text-slate-800 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200/80 dark:bg-navy-500 dark:text-navy-50 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90" 
                                        onClick={() => this.setState({
                                            booking : true,
                                            servicesInfo : false
                                        })}>
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd" />
                                        </svg>
                                        <span>Prev</span>
                                    </button>
                                    <button class="btn space-x-2 bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90" onClick={this.handleServicesNext}>
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

                <div class={ this.state.confirmation ? "grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6" : "grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6 hide"}>
                    <div class="col-span-12 grid lg:col-span-4 lg:place-items-center">
                        <div>
                        <ol class="steps is-vertical line-space [--size:2.75rem] [--line:.5rem]">
                                <li class="step space-x-4 pb-12 before:bg-primary dark:before:bg-navy-500">
                                    <div class="step-header mask is-hexagon bg-primary text-white dark:bg-accent">
                                        <i class="fa-solid fa-layer-group text-base"></i>
                                    </div>
                                    <div class="text-left">
                                        <p class="text-xs text-slate-400 dark:text-navy-300">Step 1</p>
                                        <h3 class="text-base font-medium text-primary dark:text-accent-light">Basic Info</h3>
                                    </div>
                                </li>
                                <li class="step space-x-4 pb-12 before:bg-primary dark:before:bg-navy-500">
                                    <div class="step-header mask is-hexagon bg-primary text-white dark:bg-accent">
                                        <i class="fa-solid fa-ticket text-base"></i>
                                    </div>
                                    <div class="text-left">
                                        <p class="text-xs text-slate-400 dark:text-navy-300">Step 2</p>
                                        <h3 class="text-base font-medium">Booking</h3>
                                    </div>
                                </li>
                                <li class="step space-x-4 pb-12 before:bg-primary dark:before:bg-navy-500">
                                    <div class="step-header mask is-hexagon bg-primary text-white dark:bg-accent">
                                        <i class="fa-solid fa-wrench text-base"></i>
                                    </div>
                                    <div class="text-left">
                                        <p class="text-xs text-slate-400 dark:text-navy-300">Step 3</p>
                                        <h3 class="text-base font-medium">Services</h3>
                                    </div>
                                </li>
                                <li class="step space-x-4 before:bg-slate-200 dark:before:bg-navy-500">
                                    <div class="step-header mask is-hexagon bg-primary text-white dark:bg-accent">
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
                    <div class="col-span-12 grid lg:col-span-8 text-left">
                        <div class="card">
                            <div class="border-b border-slate-200 p-4 dark:border-navy-500 sm:px-5">
                                <div class="flex items-center space-x-2">
                                    <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 p-1 text-primary dark:bg-accent-light/10 dark:text-accent-light">
                                        <i class="fa-solid fa-layer-group"></i>
                                    </div>
                                    <h4 class="text-lg font-medium text-slate-700 dark:text-navy-100">Basic Infomation</h4>
                                </div>
                            </div>
                            <div class="space-y-4 p-4 sm:p-5">
                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-12">
                                    <div class="grid grid-cols-1 gap-4 mx-auto my-auto sm:col-span-4">
                                        <div class="avatar h-48 w-48">
                                            <img class="rounded-full bg-slate-200" src={this.state.profileSrc} alt="avatar"/>
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-1 gap-4 sm:col-span-8">
                                        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div class="grid grid-cols-1 gap-4">
                                                <label class="block text-left">
                                                    <span>First Name*</span>
                                                    <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="First Name" type="text" readOnly value={this.state.firstname}/>
                                                </label>
                                            </div>
                                            <div class="grid grid-cols-1 gap-4">
                                                <label class="block text-left">
                                                    <span>Last Name*</span>
                                                    <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Last Name" type="text" readOnly value={this.state.lastname}/>
                                                </label>
                                            </div>
                                        </div>
                                        <div class="grid grid-cols-1 gap-4">
                                            <label class="block text-left">
                                                <span>Team Member Title*</span>
                                                <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Title" type="text" readOnly value={this.state.title}/>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div class="grid grid-cols-1 gap-4">
                                    <label class="block text-left">
                                        <span>Note (Optional)</span>
                                        <textarea rows="4" placeholder="Note" class="form-textarea w-full resize-none rounded-lg border border-slate-300 bg-transparent p-2.5 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" readOnly value={this.state.note}></textarea>
                                    </label>
                                </div>

                                <div class="my-3 mx-4 h-px bg-slate-200 dark:bg-navy-500"></div>

                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div class="grid grid-cols-1 gap-4">
                                        <label class="block text-left">
                                            <span>Email*</span>
                                            <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" value={this.state.email} type="email" readOnly/>
                                        </label>
                                    </div>
                                    <div class="grid grid-cols-1 gap-4">
                                        <label class="block text-left">
                                            <span>Phone Number*</span>
                                            <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" value={this.state.phone} type="tel" readOnly/>
                                        </label>
                                    </div>
                                </div>

                                <div class="my-3 mx-4 h-px bg-slate-200 dark:bg-navy-500"></div>
                                <h6 class="font-medium text-slate-700 dark:text-navy-100 text-left">Please select the employment start and end date.</h6>
                                
                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div class="grid grid-cols-1 gap-4">
                                        <label class="block text-left">
                                            <span>Start Date*</span>
                                            <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" value={this.state.startdate} type="email" readOnly/>
                                        </label>
                                    </div>
                                    <div class="grid grid-cols-1 gap-4">
                                        <label class="block text-left">
                                            <span>End Date*</span>
                                            <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" value={this.state.enddate} type="tel" readOnly/>
                                        </label>
                                    </div>
                                </div>
                                <div class="my-3 mx-4 h-px bg-slate-200 dark:bg-navy-500"></div>                                
                                <label class="block">
                                    <span>Branch*</span>
                                    <select class="mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent  px-3 py-2">
                                        {this.state.branches.map((branch) => {
                                            if(branch.id == this.state.branch){
                                                return <option value={branch.id}>{branch.address}</option>
                                            }
                                        })}
                                    </select>
                                </label>
                                <div class="my-3 mx-4 h-px bg-slate-200 dark:bg-navy-500"></div>
                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-1">
                                    {/* <label class="inline-flex items-center space-x-2">
                                        Enable online bookings, choose who the service is available for and add a short description.
                                    </label> */}
                                    <label class="inline-flex items-center space-x-2">
                                        <input class="form-switch h-5 w-10 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-accent dark:checked:before:bg-white" type="checkbox" checked={this.state.onlinebooking}/>
                                        <span>Enable Online Booking.</span>
                                    </label>
                                </div>
                                <div class="my-3 mx-4 h-px bg-slate-200 dark:bg-navy-500"></div>
                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-1">
                                    {/* <label class="inline-flex items-center space-x-2">
                                        Enable calender bookings, choose who the service is available for and add a short description.
                                    </label> */}
                                    <label class="inline-flex items-center space-x-2">
                                        <input class="form-switch h-5 w-10 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-accent dark:checked:before:bg-white" type="checkbox" checked={this.state.calendarbooking}/>
                                        <span>Enable Calender Booking.</span>
                                    </label>
                                </div>
                                <div class="my-3 mx-4 h-px bg-slate-200 dark:bg-navy-500"></div>
                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
                                    {this.state.selectedServices.map((service) => (
                                        <div class="rounded-lg bg-gradient-to-r from-sky-400 to-blue-600 p-1 text-white float-right">                    
                                            <div class="flex flex-col items-center p-4 text-center sm:p-5">
                                                <div class="avatar h-20 w-20">
                                                    <img class="rounded-full" src={ configData.SERVER_URL + "assets/images/categories/" + service.category_categoryToservice.image} alt={service.name} />
                                                </div>
                                                <h3 class="pt-3 text-lg font-medium">{service.name}</h3>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div class="flex justify-center space-x-2 pt-4">
                                    <button class="btn space-x-2 bg-slate-150 font-medium text-slate-800 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200/80 dark:bg-navy-500 dark:text-navy-50 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
                                        onClick={() => this.setState({
                                            servicesInfo : true,
                                            confirmation : false
                                        })}>
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd" />
                                        </svg>
                                        <span>Prev</span>
                                    </button>
                                    <button class="btn space-x-2 bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90" onClick={this.handleConfirmTeamMember}>
                                        <span>Confirm</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" >
                                            <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>  

                { this.state.imageResizer ?
                    <ImageResize aspectRatio={1.0} imageModalClose={this.imageModalClose} changeImage={this.changeImage} saveImageAdded={this.imageModalClose}/> : <></>
                }
            </main>
        )
    }
}