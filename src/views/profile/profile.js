import React from 'react';
import swal from 'sweetalert';
import axios from 'axios';
import configData from '../../utils/constants/config.json'
import axiosClient from '../../utils/helpers/server';
import ImageResize from '../../components/ImageCropper/imageupload';
import { faHourglassEmpty } from '@fortawesome/free-solid-svg-icons';

export default class Profile extends React.Component{

  constructor(props) {
      super(props)
      this.state = {
        partner : null,
        profile : null,
        fistName : "",
        lastName : "",
        phone : "",
        email : "",
        currentPassword : "",
        currentPasswordError: false,
        newPassword : "",
        newPasswordError: false,
        newPasswordErrorMessage : "",
        newRetypePassword : "",
        newRetypePasswordError : "",
        profileSrc : "/images/upload-image.png",
        imageResizer: false,
        loader:false

      }
  }

  componentDidMount () {
    axiosClient.get(configData.SERVER_URL + 'partner/account/getAccountDetails').then(resp => {
        if(parseInt(Object.keys(resp.data)[0]) === 200){
            this.setState({
                partner : resp.data.account,
                profileSrc : resp.data.account.image,
                firstName : resp.data.account.firstname,
                lastName : resp.data.account.lastname,
                email : resp.data.account.email,
                phone : resp.data.account.phone,
            })
        }else{
            swal({
                title: "Server Not Responding",
                text: "Please try again later",
                icon: "warning",
                button: "ok",
            })
        }
      })
  }


  handleImageChange = (event) => {
    event.preventDefault()
    var url = URL.createObjectURL(event.target.files[0])
    this.setState({
        [event.target.id] : event.target.files[0],
        profileSrc : url
    });
}

  saveBusinessDetails = (e) => {
    e.preventDefault()
    if(this.state.currentPasswordError){
        swal({
            title: "Password",
            text: "Please enter the correct password",
            icon: "warning",
            button: "ok",
        })
    }
    if(this.state.newPasswordError){
        swal({
            title: "Password",
            text: "Please enter the correct format for new password",
            icon: "warning",
            button: "ok",
        })
    }
    if(this.state.newRetypePasswordError){
        swal({
            title: "Password",
            text: "Please retype the correct password",
            icon: "warning",
            button: "ok",
        })
    }
    var bodyFormData = new URLSearchParams()
    bodyFormData.append('firstName', this.state.fistName)
    bodyFormData.append('lastName', this.state.lastName)
    bodyFormData.append('email', this.state.email)
    bodyFormData.append('phone', this.state.phone)
    bodyFormData.append('image', this.state.profileSrc)
    bodyFormData.append('password', this.state.newPassword === "" ? this.state.currentPassword : this.state.newPassword)
    axios({
        method: "put",
        url: configData.SERVER_URL + 'partner/account/update-partner',
        data : bodyFormData,
        headers: { 
            "Content-Type": "application/x-www-form-urlencoded",
            "accesstoken" : configData.ACCESSTOKEN,
            "logintoken" : localStorage.getItem('loginToken')
        },
    }).then(resp => {
        console.log(resp.data)
        swal({
            title: "Account Details",
            text: "Account Details Saved Successfully",
            icon: "success",
            button: "ok",
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

  deleteAccount = (e) => {
    axios({
        method: "delete",
        url: configData.SERVER_URL + 'partner/account/deleteAccount',
        headers: { 
            "Content-Type": "application/x-www-form-urlencoded",
            "accesstoken" : configData.ACCESSTOKEN,
            "logintoken" : localStorage.getItem('loginToken')
        },
    }).then(resp => {
        swal({
            title: 'Account',
            text: 'Account deleted successfully',
            icon: 'success',
            button: 'ok',
          }).then(function(){
            localStorage.setItem('loginToken', 0)
            window.location.href = '/'
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

    handlePasswordChange = (event) => {
        event.preventDefault();
        const isValidLength = /^.{8,16}$/;
        if (!isValidLength.test(event.target.value)) {
          this.setState({
                newPasswordError : true,
                newPasswordErrorMessage :  "Password must be 8-16 Characters Long."
          })
          return
        }
        const isContainsNumber = /^(?=.*[0-9])/;
        if (!isContainsNumber.test(event.target.value)) {
          this.setState({
                newPasswordError : true,
                newPasswordErrorMessage :  "Password must contain at least one Digit."
          })
          return
        }
        const isContainsSymbol = /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹])/;
        if (!isContainsSymbol.test(event.target.value)) {
            this.setState({
                newPasswordError : true,
                newPasswordErrorMessage :  "Password must contain at least one Special Symbol."
            })
            return
        }
        const isContainsUppercase = /^(?=.*[A-Z])/;
        if (!isContainsUppercase.test(event.target.value)) {
          this.setState({
                newPasswordError : true,
                newPasswordErrorMessage :  "Password must have at least one Uppercase Character."
          })
          return
        }
        const isContainsLowercase = /^(?=.*[a-z])/;
        if (!isContainsLowercase.test(event.target.value)) {
          this.setState({
                newPasswordError : true,
                newPasswordErrorMessage :  "Password must have at least one Lowercase Character."
          })
          return
        }
        const isWhitespace = /^(?=.*\s)/;
        if (isWhitespace.test(event.target.value)) {
            this.setState({
                newPasswordError : true,
                newPasswordErrorMessage :  "Password must not contain Whitespaces."
            })
            return
        }
        this.setState({
            newPasswordError : false,
            newPasswordErrorMessage :  "",
            newPassword : event.target.value
        });
    }

    uploadImage = () => {
        this.setState({loader :true})
        var bodyFormData = new FormData()
        bodyFormData.append('image', this.state.profile)
        axios({
            method: "post",
            url: configData.SERVER_URL + 'partner/account/upload-profile-image',
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
                profileSrc : resp.data.data.url
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
            <main class="main-content px-[var(--margin-x)] pb-8">
                <div class="items-center justify-between">
                    <div class="flex items-center space-x-4 py-5 lg:py-6">
                        <h2 class="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">My Profile</h2>
                        <div class="hidden h-full py-1 sm:flex">
                            <div class="h-full w-px bg-slate-300 dark:bg-navy-600"></div>
                        </div>
                        <ul class="hidden flex-wrap items-center space-x-2 sm:flex">
                            <li class="flex items-center space-x-2">
                                <a class="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent" href="/settings">Settigns</a>
                                <svg x-ignore xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                </svg>
                            </li>
                            <li>My Profile</li>
                        </ul>
                    </div>
                    <div class="text-right mx-4">
                        <button onClick={this.saveBusinessDetails} class="btn bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90">Save</button>
                    </div>
                </div>
                { this.state.partner != null ? 
                <div>
                    <div class="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6 text-left p-4">
                    <div class="col-span-12 sm:col-span-6 m-4 p-4">
                        <h2 class="text-2xl font-semibold">Personal details</h2>
                        <p class="max-w-2xl mt-4">Set your name and contact info here. The email address entered here is used for your login access.</p>
                    </div>
                    <div class="col-span-12 sm:col-span-6 m-4">
                        <div class="card px-4 py-4 sm:px-5">
                        <div class="pt-2 pb-4">
                            <div class="grid grid-cols-1">

                                <div class="grid grid-cols-1 gap-4 mx-auto my-auto">
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

                                <div class="mt-2 grid grid-cols-1 gap-4">
                                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div class="grid grid-cols-1 gap-4">
                                            <label class="block">
                                                <span>First Name</span>
                                                <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="First name" type="text" value={this.state.firstName}
                                                    onChange={(e) => {
                                                        this.setState({
                                                            firstName :  e.currentTarget.value
                                                        })
                                                    }}/>
                                            </label>
                                        </div>
                                        <div class="grid grid-cols-1 gap-4">
                                            <label class="block">
                                                <span>Last Name</span>
                                                <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Last name" type="text" value={this.state.lastName}
                                                    onChange={(e) => {
                                                        this.setState({
                                                            lastName : e.currentTarget.value
                                                        })
                                                    }}/>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div class="mt-2 grid grid-cols-1 gap-4">
                                    <label class="block">
                                        <span>Mobile Number</span>
                                        <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="+9715XXXXXXXX" type="text" value={this.state.phone}
                                            onChange={(e) => {
                                                this.setState({
                                                    phone : e.currentTarget.value
                                                })
                                            }}/>
                                    </label>
                                </div>

                                <div class="mt-2 grid grid-cols-1 gap-4">
                                    <label class="block">
                                        <span>Email</span>
                                        <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="abc@xyz.com" type="email" value={this.state.email}
                                            onChange={(e) => {
                                                this.setState({
                                                    email : e.currentTarget.value
                                                })
                                            }}/>
                                    </label>
                                </div>

                            </div>
                        </div>
                        </div>
                    </div>
                    </div>


                    <div class="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6 text-left p-4">
                    <div class="col-span-12 sm:col-span-6 m-4 p-4">
                        <h2 class="text-2xl font-semibold">Change password</h2>
                        <p class="max-w-2xl mt-4">To make an update, enter your existing password followed by a new one. If you don't know your existing password, you can log out and use the Reset Password link on the Log In page.</p>
                    </div>
                    <div class="col-span-12 sm:col-span-6 m-4">
                        <div class="card px-4 py-4 sm:px-5">
                        <div class="pt-2 pb-4">
                            <div class="grid grid-cols-1">

                                <div class="mt-2 grid grid-cols-1 gap-4">
                                    <label class="block">
                                        <span>Current password</span>
                                        <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="*********" type="password"
                                            onChange={(e) => {
                                                if(e.currentTarget.value == this.state.partner.password){
                                                    this.setState({
                                                        currentPassword : e.currentTarget.value,
                                                        currentPasswordError : false
                                                    })
                                                }else{
                                                    this.setState({
                                                        currentPassword : e.currentTarget.value,
                                                        currentPasswordError : true
                                                    })
                                                }
                                            }}/>
                                        { this.state.currentPasswordError ? <span class="text-tiny+ text-error">Invalid current password</span> : <></> }
                                    </label>
                                </div>

                                <div class="mt-2 grid grid-cols-1 gap-4">
                                    <label class="block">
                                        <span>New password</span>
                                        <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="********" type="password"
                                            disabled={this.state.currentPasswordError}
                                            onChange={this.handlePasswordChange}/>
                                        {this.state.newPasswordError ? <span class="text-tiny+ text-error">{this.state.newPasswordErrorMessage}</span> : <></> }
                                    </label>
                                </div>

                                <div class="mt-2 grid grid-cols-1 gap-4">
                                    <label class="block">
                                        <span>Verify password</span>
                                        <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="********" type="password"
                                            disabled={this.state.currentPasswordError}
                                            onChange={(e) => {
                                                if(e.currentTarget.value == this.state.newPassword){
                                                    this.setState({
                                                        newRetypePassword : e.currentTarget.value,
                                                        newRetypePasswordError : false
                                                    })
                                                }else{
                                                    this.setState({
                                                        newRetypePasswordError : true
                                                    })
                                                }
                                            }}/>
                                        {this.state.newRetypePasswordError ? <span class="text-tiny+ text-error">Password doenot match</span> : <></> }
                                    </label>
                                </div>

                            </div>
                        </div>
                        </div>
                    </div>
                    </div>

                    <div class="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6 text-left p-4">
                    <div class="col-span-12 sm:col-span-6 m-4 p-4">
                        <h2 class="text-2xl font-semibold">My notification settings</h2>
                        <p class="max-w-2xl mt-4">Receive notifications about important activity in your account.</p>
                    </div>
                    <div class="col-span-12 sm:col-span-6 m-4">
                        <div class="card px-4 py-4 sm:px-5">
                        <div class="pt-2 pb-4">
                            <div class="grid grid-cols-1">

                                <div class="mt-2 grid grid-cols-1 gap-4">
                                    <p class="text-sm leading-6">
                                        Go to my&nbsp;
                                        <a href="/clients/notificationsettings" class="font-semibold underline decoration-primary decoration-2">notification settings.</a>
                                    </p>
                                </div>

                            </div>
                        </div>
                        </div>
                    </div>
                    </div>

                    {/* <div class="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6 text-left p-4">
                        <div class="col-span-12 sm:col-span-6 m-4 p-4">
                            <h2 class="text-2xl font-semibold">My calendar syncing</h2>
                            <p class="max-w-2xl mt-4">Sync up your Dr. Clinica calendar with external calendars.</p>
                        </div>
                        <div class="col-span-12 sm:col-span-6 m-4">
                            <div class="card px-4 py-4 sm:px-5">
                            <div class="pt-2 pb-4">
                                <div class="grid grid-cols-1">

                                    <div class="mt-2 grid grid-cols-1 gap-4">
                                        <p class="text-sm leading-6">
                                            <a href="/" class="font-semibold underline decoration-primary decoration-2">
                                                <i class="fa fa-plus-circle pr-2" aria-hidden="true"></i>Sync a calendar.
                                            </a>
                                        </p>
                                    </div>

                                </div>
                            </div>
                            </div>
                        </div>
                    </div> */}

                    <div class="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6 text-left p-4">
                        <div class="col-span-12 sm:col-span-6 m-4 p-4">
                            <h2 class="text-2xl font-semibold">Delete account</h2>
                            <p class="max-w-2xl mt-4">You will delete all your personal info and won't be able to retrieve it.</p>
                        </div>
                        <div class="col-span-12 sm:col-span-6 m-4">
                            <div class="card px-4 py-4 sm:px-5">
                            <div class="pt-2 pb-4">
                                <div class="grid grid-cols-1">

                                    <div class="mt-2 grid grid-cols-1 gap-4">
                                        <p class="text-sm leading-6">
                                            <a onClick={this.deleteAccount} class="font-semibold underline decoration-error text-error decoration-2">
                                                <i class="fa fa-trash pr-2" aria-hidden="true"></i>Delete my Dr. Clinica Account.
                                            </a>
                                        </p>
                                    </div>

                                </div>
                            </div>
                            </div>
                        </div>
                    </div>

                </div>
                
                : null
                }
                { this.state.imageResizer ?
                    <ImageResize loader={this.state.loader} aspectRatio={1.0} imageModalClose={this.imageModalClose} changeImage={this.changeImage} saveImageAdded={this.uploadImage}/> : <></>
                }
            </main>
        )
    }
}