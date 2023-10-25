import React from 'react'
import swal from 'sweetalert'
import axios from 'axios'
import configData from '../../utils/constants/config.json'
import moment from 'moment'
import ImageResize from '../../components/ImageCropper/imageupload';
const memberid = new URLSearchParams(window?.location?.search)?.get(
    "memberid"
  );
export default class EditTeamMember extends React.Component{

    constructor(props) {
        super(props)
        this.state = {
            selectedteammember : localStorage.getItem('selectedteammember'),
            branches : [],
            categories : [],
            subcategories : [],
            selectedSubCategory : null,
            services : [],
            oldProfileSrc : "",
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
            onlinebooking : false,
            calendarbooking : false,
            calendarcolor : "#ffffff",
            selectedServices : [],
            selectedService : "",
            commissionrate : "",
            commissionthreshhold : "",
            imageResizer: false,
            loader:false
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

        axios({
            method: "get",
            url: configData.SERVER_URL + 'partner/team/getTeamMemberDetails?memberid='+( memberid ? memberid : localStorage.getItem('selectedteammember')),
            headers: { 
                "Content-Type": "application/x-www-form-urlencoded",
                "accesstoken" : configData.ACCESSTOKEN,
                "logintoken" : localStorage.getItem('loginToken')
            },
        }).then(resp => {
            console.log(resp.data)
            let selectedservices = []
            resp.data.teamMember.teamservices.forEach(service => {
                selectedservices.push(service.service_serviceToteamservices)
            })
            if(parseInt(Object.keys(resp.data)[0]) === 200){
              this.setState({
                firstname : resp.data.teamMember.firstname,
                lastname : resp.data.teamMember.lastname,
                oldProfileSrc : resp.data.teamMember.profileimage,
                profileSrc : resp.data.teamMember.profileimage,
                title : resp.data.teamMember.title,
                note : resp.data.teamMember.not,
                email : resp.data.teamMember.email,
                phone : resp.data.teamMember.phone,
                startdate : moment(resp.data.teamMember.startdate).format("YYYY-MM-DD"),
                enddate : moment(resp.data.teamMember.enddate).format("YYYY-MM-DD"),
                branch : resp.data.teamMember.branch,
                onlinebooking : resp.data.teamMember.onlinebooking == 0 ? false : true,
                calendarbooking : resp.data.teamMember.calendarbooking == 0 ? false : true,
                selectedServices : selectedservices,
                commissionrate : resp.data.teamMember.commissionrate == null ? 0 : resp.data.teamMember.commissionrate,
                commissionthreshhold : resp.data.teamMember.commissionthreshhold == null ? 0 : resp.data.teamMember.commissionthreshhold
              }, () =>{
                this.fetchCat()
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

    fetchCat = () => {
        axios({
            method: "get",
            url: configData.SERVER_URL + 'partner/team/team-member-pre-load/' + this.state.branch,
            headers: { 
                "Content-Type": "application/x-www-form-urlencoded",
                "accesstoken" : configData.ACCESSTOKEN,
                "logintoken" : localStorage.getItem('loginToken')
            },
        }).then(resp => {
            this.setState({
                categories : resp.data.categoryWithSubCategoryAndService
            })
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

    handleSaveTeamMember = (event) => {
        event.preventDefault()
        this.setState({loader :true})
        var bodyFormData = new FormData()
        bodyFormData.append('id', this.state.selectedteammember)
        bodyFormData.append('oldProfileSrc', this.state.oldProfileSrc)
        bodyFormData.append('profile', this.state.profile)
        bodyFormData.append('firstname', this.state.firstname)
        bodyFormData.append('lastname', this.state.lastname)
        bodyFormData.append('title', this.state.title)
        bodyFormData.append('note', this.state.note)
        bodyFormData.append('email', this.state.email)
        bodyFormData.append('phone', this.state.phone)
        bodyFormData.append('startdate', this.state.startdate)
        bodyFormData.append('enddate', this.state.enddate)
        bodyFormData.append('branch', this.state.branch)
        bodyFormData.append('onlinebooking', this.state.onlinebooking ? 1 : 0)
        bodyFormData.append('calendarbooking', this.state.calendarbooking ? 1 : 0)
        bodyFormData.append('calendarcolor', this.state.calendarcolor)
        bodyFormData.append('selectedServices', JSON.stringify(this.state.selectedServices))
        bodyFormData.append('commissionrate', this.state.commissionrate)
        bodyFormData.append('commissionthreshhold', this.state.commissionthreshhold)
        axios({
            method: "post",
            url: configData.SERVER_URL + 'partner/team/updateTeamMemberDetails',
            data: bodyFormData,
            headers: { 
                "Content-Type": "multipart/form-data",
                "accesstoken" : configData.ACCESSTOKEN,
                "logintoken" : localStorage.getItem('loginToken')
            },
        }).then(resp => {
            this.setState({loader :false})
            if(parseInt(Object.keys(resp.data)[0]) === 200){
                swal({
                    title: "Service Provider Information",
                    text: resp.data[Object.keys(resp.data)[0]],
                    icon: "success",
                    button: "ok",
                })
            }else{
                swal({
                    title: "Service Provider Information",
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
            profile : file,
            profileSrc : url
        });
    }

    render() {
        return (
            <main class="main-content px-[var(--margin-x)] pb-8">
                <div class="items-center justify-between">
                    <div class="flex items-center space-x-4 py-5 lg:py-6">
                        <h2 class="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">Edit Service Provider</h2>
                        <div class="hidden h-full py-1 sm:flex">
                            <div class="h-full w-px bg-slate-300 dark:bg-navy-600"></div>
                        </div>
                        <ul class="hidden flex-wrap items-center space-x-2 sm:flex">
                            <li class="flex items-center space-x-2">
                                <a class="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent" href="/team/teammember">Service Providers</a>
                                <svg x-ignore xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                </svg>
                            </li>
                            <li>Edit Service Provider</li>
                        </ul>
                    </div>
                    <div class="text-right mx-4 my-4">
                        <button onClick={this.handleSaveTeamMember} class="btn bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90">Save</button>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6">
                    <div class="col-span-12 grid lg:col-span-12 text-left">
                        <div class="card px-4">
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
                                                    imageResizer : true
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
                                                    <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="First Name" type="text" value={this.state.firstname} id="firstname" onChange={this.handleInputChange}/>
                                                </label>
                                            </div>
                                            <div class="grid grid-cols-1 gap-4">
                                                <label class="block text-left">
                                                    <span>Last Name*</span>
                                                    <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Last Name" type="text" value={this.state.lastname} id="lastname" onChange={this.handleInputChange}/>
                                                </label>
                                            </div>
                                        </div>
                                        <div class="grid grid-cols-1 gap-4">
                                            <label class="block text-left">
                                                <span>Team Member Title*</span>
                                                <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Title" type="text" value={this.state.title} id="title" onChange={this.handleInputChange}/>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div class="grid grid-cols-1 gap-4">
                                    <label class="block text-left">
                                        <span>Note (Optional)</span>
                                        <textarea rows="4" placeholder="Note" class="form-textarea w-full resize-none rounded-lg border border-slate-300 bg-transparent p-2.5 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" value={this.state.note} id="note" onChange={this.handleInputChange}></textarea>
                                    </label>
                                </div>

                                <div class="my-3 mx-4 h-px bg-slate-200 dark:bg-navy-500"></div>

                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div class="grid grid-cols-1 gap-4">
                                        <label class="block text-left">
                                            <span>Email*</span>
                                            <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" value={this.state.email} type="email" id="email" onChange={this.handleInputChange}/>
                                        </label>
                                    </div>
                                    <div class="grid grid-cols-1 gap-4">
                                        <label class="block text-left">
                                            <span>Phone Number*</span>
                                            <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" value={this.state.phone} type="tel" id="phone" onChange={this.handleInputChange}/>
                                        </label>
                                    </div>
                                </div>

                                <div class="my-3 mx-4 h-px bg-slate-200 dark:bg-navy-500"></div>
                                <h6 class="font-medium text-slate-700 dark:text-navy-100 text-left">Please select the employment start and end date.</h6>
                                
                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div class="grid grid-cols-1 gap-4">
                                        <label class="block text-left">
                                            <span>Start Date*</span>
                                            <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" value={this.state.startdate} type="text" id="startdate" onChange={this.handleInputChange}/>
                                        </label>
                                    </div>
                                    <div class="grid grid-cols-1 gap-4">
                                        <label class="block text-left">
                                            <span>End Date*</span>
                                            <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" value={this.state.enddate} type="text" id="enddate" onChange={this.handleInputChange}/>
                                        </label>
                                    </div>
                                </div>
                                <div class="my-3 mx-4 h-px bg-slate-200 dark:bg-navy-500"></div>                                
                                <label class="block">
                                    <span>Branch*</span>
                                    <select class="mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent  px-3 py-2" id="branch" onChange={this.handleInputChange}>
                                        {this.state.branches.map((branch) => {
                                            if(branch.id == this.state.branch){
                                                return <option value={branch.id} selected>{branch.address}</option>
                                            }else{
                                                return <option value={branch.id}>{branch.address}</option>
                                            }
                                        })}
                                    </select>
                                </label>
                                <div class="my-3 mx-4 h-px bg-slate-200 dark:bg-navy-500"></div>
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
                                        Enable calender bookings, choose who the service is available for and add a short description.
                                    </label>
                                    <label class="inline-flex items-center space-x-2">
                                        <input class="form-switch h-5 w-10 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-accent dark:checked:before:bg-white" type="checkbox" checked={this.state.calendarbooking}
                                        onChange={()=>{
                                            this.setState(({ calendarbooking }) => ({ calendarbooking: !calendarbooking }))
                                        }}/>
                                        <span>Enable Calender Booking.</span>
                                    </label>
                                </div>
                                <div class="my-3 mx-4 h-px bg-slate-200 dark:bg-navy-500"></div>
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
                                            this.setState({
                                                selectedSubCategory : e.currentTarget.value,
                                                selectedService : ""
                                            })
                                        }}
                                    >
                                        <option value="" hidden>Select Section</option>
                                        {this.state.subcategories.map((subcategory) => (
                                            <option value={subcategory.id}>{subcategory.name}</option>
                                        ))}
                                    </select>
                                    </label>
                                </div>
                                <label class="block">
                                    <span>Select Services*</span>
                                    <select class="mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent  px-3 py-2" id="selectedServices" value={this.state.selectedService}  onChange={this.handleAddService}>
                                        <option value="" hidden>Select Option</option>
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
                                                    <img class="rounded-full" src={ configData.IMAGES_URL + "categories/" + service.category_categoryToservice.image} alt={service.name} />
                                                </div>
                                                <h3 class="pt-3 text-lg font-medium">{service.name}</h3>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div class="grid grid-cols-1 gap-4">
                                        <label class="block text-left">
                                            <span>Commission Rate (Percentage)</span>
                                            <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" value={this.state.commissionrate} type="number" id="commissionrate" onChange={this.handleInputChange}/>
                                        </label>
                                    </div>
                                    <div class="grid grid-cols-1 gap-4">
                                        <label class="block text-left">
                                            <span>Commission Threshhold</span>
                                            <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" value={this.state.commissionthreshhold} type="number" id="commissionthreshhold" onChange={this.handleInputChange}/>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>  


                { this.state.imageResizer ?
                    <ImageResize loader={this.state.loader} aspectRatio={1.0} imageModalClose={this.imageModalClose} changeImage={this.changeImage} saveImageAdded={this.handleSaveTeamMember}/> : <></>
                }
            </main>
        )
    }
}