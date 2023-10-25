import React from 'react';
import swal from 'sweetalert';
import axios from 'axios';
import configData from '../../utils/constants/config.json'
import ImageResize from '../../components/ImageCropper/imageupload';

export default class BusinessDetails extends React.Component{

  constructor(props) {
      super(props)
      this.state = {
        country : "United Arab Emirates",
        currency : "AED",
        partner : null,
        business : null,
        timezones : [],
        languages : [],
        weekDays : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        profileSrc : "/images/upload-image.png",
        profile : null,
        imageResizer: false,
        loader:false,
        isnotValid:true,

      }
  }

  componentDidMount () {
    this.setState({loader:true})
    axios({
        method: "get",
        url: configData.SERVER_URL + 'partner/account/getAccountDetails',
        headers: { 
            "Content-Type": "application/x-www-form-urlencoded",
            "accesstoken" : configData.ACCESSTOKEN,
            "logintoken" : localStorage.getItem('loginToken')
        },
    }).then(resp => {
        console.log(resp.data,parseInt(Object.keys(resp.data)[0]) === 200, resp.data.account,'before')
        this.setState({
          partner : resp.data.account,
          profileSrc : `${resp.data.account.business[0].image}`,
          business : resp.data.account.business[0],
          timezones : resp.data.timezones,
          languages : resp.data.languages,
        })
        this.setState({loader:false})
        if(parseInt(Object.keys(resp.data)[0]) === 200){
          const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;

          if (urlRegex.test(resp.data.account.business[0].website)) {
            // URL is valid
            this.setState({isnotValid: false});
           } else {
            // URL is invalid
            this.setState({isnotValid: true});
            return
          }
          console.log(resp, 'respresp')
         
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
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;

    if (urlRegex.test(this.state.business.website)) {
      // URL is valid
      this.setState({isnotValid: false});
     } else {
      // URL is invalid
      this.setState({isnotValid: true});
      return
    }
    this.setState({loader :true})
    var bodyFormData = new FormData()
    bodyFormData.append('timezone', this.state.partner.timezone)
    bodyFormData.append('timeformat', this.state.partner.timeformat)
    bodyFormData.append('weekstart', this.state.partner.weekstart)
    bodyFormData.append('teamlanguage', this.state.partner.teamlanguage)
    bodyFormData.append('clientnotificationlanuage', this.state.partner.clientnotificationlanuage)
    bodyFormData.append('businessid', this.state.business.id)
    bodyFormData.append('name', this.state.business.name)
    bodyFormData.append('website', this.state.business.website)
    bodyFormData.append('facebook', this.state.business.facebook)
    bodyFormData.append('instagram', this.state.business.instagram)
    bodyFormData.append('image', this.state.business.image)
    if(this.state.profile != null){
      bodyFormData.append('logo', this.state.profile)
    }
    axios({
        method: "post",
        url: configData.SERVER_URL + 'partner/account/saveAccountDetails',
        data : bodyFormData,
        headers: { 
            "Content-Type": "multipart/form-data",
            "accesstoken" : configData.ACCESSTOKEN,
            "logintoken" : localStorage.getItem('loginToken')
        },
    }).then(resp => {
        console.log(resp.data)
        this.setState({loader :false})
        if(parseInt(Object.keys(resp.data)[0]) === 200){
            swal({
                title: "Account Details",
                text: "Account Details Saved Successfully",
                icon: "success",
                button: "ok",
            })
            this.setState({
                imageResizer : false
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
                    <h2 class="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">Business Details</h2>
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
                        <li>Business Details</li>
                    </ul>
                </div>
                <div class="text-right mx-4">
                    <button onClick={this.saveBusinessDetails} class="btn bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90">Save</button>
                </div>
            </div>
            {console.log(this.state.partner,this.state.profileSrc,this.state.business, 'partner' )}
            { this.state.partner ? 
              <div>
                <div class="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6 text-left p-4">
                  <div class="col-span-12 sm:col-span-6 m-4 p-4">
                      <h2 class="text-2xl font-semibold">Business Info</h2>
                      <p class="max-w-2xl mt-4">Your business name is displayed across many areas including on your online booking profile, sales receipts and messages to clients</p>
                  </div>
                  <div class="col-span-12 sm:col-span-6 m-4">
                    <div class="card px-4 py-4 sm:px-5">
                      <div class="pt-2 pb-4">
                        <div class="grid grid-cols-1 gap-4 mx-auto my-auto sm:col-span-12">
                            <div class="avatar h-48 w-48 mx-auto">
                                <img class="rounded-full bg-slate-200" src={this.state.profileSrc} alt="avatar" onClick={() => {
                                    // document.getElementById("profile").click()
                                    this.setState({
                                      imageResizer : true
                                    })
                                }}/>
                                <input type="file" id="profile" style={{ display : "none"}} accept="image/png, image/jpeg, image/jpg" onChange={this.handleImageChange} />
                            </div>
                        </div>
                        <label class="block">
                           <span>Business Name</span>
                            <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Enter Your Business Name" type="text" value={this.state.business.name}
                             onChange={(e) => {
                              this.state.business.name = e.currentTarget.value
                              this.setState({
                                business : this.state.business
                              })
                            }}/>
                        </label>
                        {/* <div class="mt-4 alert flex rounded-lg bg-slate-200 px-4 py-4 text-slate-600 dark:bg-navy-500 dark:text-navy-100 sm:px-5">
                          <p class="text-sm leading-6">
                            Your country is set to <strong>{this.state.country}</strong> with <strong>{this.state.currency}</strong> currency. To change these settings, 
                            <a href="/" class="font-semibold underline decoration-primary decoration-dashed decoration-2">please contact our support team.</a>
                          </p>
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6 text-left p-4">
                  <div class="col-span-12 sm:col-span-6 m-4 p-4">
                      <h2 class="text-2xl font-semibold">Time and calendar settings</h2>
                      <p class="max-w-2xl mt-4">Choose the time zone and format which suit your business. Daylight savings changes will automatically apply based on your selected time zone</p>
                  </div>
                  <div class="col-span-12 sm:col-span-6 m-4">
                    <div class="card px-4 py-4 sm:px-5">
                      <div class="pt-2 pb-4">
                        <label class="block">
                            <span>Time Zone</span>
                            <select class="form-select mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
                                onChange={(e) => {
                                  this.state.partner.timezone = e.currentTarget.value
                                  this.setState({
                                    partner : this.state.partner
                                  })
                                }}>
                                <option hidden selected>{this.state.partner.timezone_partnerTotimezone.name} ({this.state.partner.timezone_partnerTotimezone.tag})</option>
                                {this.state.timezones.map((timezone) => ( 
                                    <option value={timezone.id}>{timezone.name} ({timezone.tag})</option>
                                ))}
                            </select>
                        </label>
                      </div>
                      <div class="pt-2 pb-4">
                        <label class="block">
                            <span>Time Format</span>
                            <select class="form-select mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
                                onChange={(e) => {
                                  this.state.partner.timeformat = e.currentTarget.value
                                  this.setState({
                                    partner : this.state.partner
                                  })
                                }}>
                                <option value="12 hours" selected>12 hours</option>
                            </select>
                        </label>
                      </div>
                      <div class="pt-2 pb-4">
                        <label class="block">
                            <span>Week Start</span>
                            <select class="form-select mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
                                onChange={(e) => {
                                  this.state.partner.weekstart = e.currentTarget.value
                                  this.setState({
                                    partner : this.state.partner
                                  })
                                }}>
                                <option hidden selected>{this.state.partner.weekstart}</option>
                                {this.state.weekDays.map((weekDay) => ( 
                                    <option value={weekDay}>{weekDay}</option>
                                ))}
                            </select>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div class="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6 text-left p-4">
                  <div class="col-span-12 sm:col-span-6 m-4 p-4">
                      <h2 class="text-2xl font-semibold">Language settings</h2>
                      <p class="max-w-2xl mt-4">Choose the default language for appointment notification messages sent to your clients. Per-client language preferences can also be set within the settings for each client.</p>
                  </div>
                  <div class="col-span-12 sm:col-span-6 m-4">
                    <div class="card px-4 py-4 sm:px-5">
                      <div class="pt-2 pb-4">
                        <label class="block">
                            <span>Client notification language</span>
                            <select class="form-select mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
                                onChange={(e) => {
                                  this.state.partner.clientnotificationlanuage = e.currentTarget.value
                                  this.setState({
                                    partner : this.state.partner
                                  })
                                }}>
                              <option hidden selected>{this.state.partner.language_languageTopartner_clientnotificationlanuage.name} ({this.state.partner.language_languageTopartner_clientnotificationlanuage.tag})</option>
                                {this.state.languages.map((language) => ( 
                                    <option value={language.id}>{language.name} ({language.tag})</option>
                                ))}
                            </select>
                        </label>
                      </div>


                      <div class="pt-2 pb-4">
                        <label class="block">
                            <span>Default language for your team</span>
                            <select class="form-select mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
                                onChange={(e) => {
                                  this.state.partner.teamlanguage = e.currentTarget.value
                                  this.setState({
                                    partner : this.state.partner
                                  })
                                }}>
                              <option hidden selected>{this.state.partner.language_languageTopartner_teamlanguage.name} ({this.state.partner.language_languageTopartner_teamlanguage.tag})</option>
                                {this.state.languages.map((language) => ( 
                                    <option value={language.id}>{language.name} ({language.tag})</option>
                                ))}
                            </select>
                        </label>
                      </div>

                      <div class="pt-2 pb-4">
                        <div class=" alert flex rounded-lg bg-slate-200 px-4 py-4 text-slate-600 dark:bg-navy-500 dark:text-navy-100 sm:px-5">
                          <p class="text-sm leading-6">
                          New team members will see Dr. Clinica in this language but they can override this in their personal user settings.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}

                <div class="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6 text-left p-4">
                  <div class="col-span-12 sm:col-span-6 m-4 p-4">
                      <h2 class="text-2xl font-semibold">Online links</h2>
                      <p class="max-w-2xl mt-4">Add your company website and social media links for sharing with clients</p>
                  </div>
                  <div class="col-span-12 sm:col-span-6 m-4">
                    <div class="card px-4 py-4 sm:px-5">

                      <div class="pt-2 pb-4">
                        <span>Website</span>
                        <label class="mt-1.5 flex -space-x-px"> 
                          <div class="flex items-center justify-center rounded-l-lg border border-slate-300 px-3.5 font-inter dark:border-navy-450">
                            <span class="-mt-1"><i class="fa fa-globe"></i></span>
                          </div>
                          <input class="form-input w-full rounded-r-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="https://www.site.com" type="text" 
                          value={(this.state.business.website !==undefined && this.state.business.website !==null && this.state.business.website !=="null")?  this.state.business.website:" "}
                          onChange={(e) => {
                              this.state.business.website = e.currentTarget.value
                              this.setState({
                                business : this.state.business
                              })
                            }}/>

                        </label>
                        {(this.state.isnotValid) && <p style={{color:"red", margin:"none"}}>Please enter a valid URL.</p>}
                      </div>
                      
                      <div class="pt-2 pb-4">
                        <span>Facebook</span>
                         <label class="mt-1.5 flex -space-x-px"> 
                          <div class="flex items-center justify-center rounded-l-lg border border-slate-300 px-3.5 font-inter dark:border-navy-450">
                            <span class="-mt-1"><i class="fab fa-facebook-f"></i></span>
                          </div>
                          <input class="form-input w-full rounded-r-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="www.facebook.com/yoursite" type="text" 
                          value={(this.state.business.facebook !==undefined && this.state.business.facebook !==null && this.state.business.facebook !=="null")?  this.state.business.facebook:" "}
                            onChange={(e) => {
                              this.state.business.facebook = e.currentTarget.value
                              this.setState({
                                business : this.state.business
                              })
                            }}/>
                        </label>
                      </div>
                      
                      <div class="pt-2 pb-4">
                        <span>Instagram</span>
                        <label class="mt-1.5 flex -space-x-px"> 
                          <div class="flex items-center justify-center rounded-l-lg border border-slate-300 px-3.5 font-inter dark:border-navy-450">
                            <span class="-mt-1"><i class="fab fa-instagram"></i></span>
                          </div>
                          <input class="form-input w-full rounded-r-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="www.instagram.com/yoursite" type="text" 
                          value={(this.state.business.instagram !==undefined && this.state.business.instagram !==null && this.state.business.instagram !=="null")?  this.state.business.instagram:" "}
                          onChange={(e) => {
                              this.state.business.instagram = e.currentTarget.value
                              this.setState({
                                business : this.state.business
                              })
                            }}/>
                        </label>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
              
            : null
            }
            { this.state.imageResizer ?
                <ImageResize loader={this.state.loader} aspectRatio={1.0} imageModalClose={this.imageModalClose} changeImage={this.changeImage} saveImageAdded={this.saveBusinessDetails}/> : <></>
            }
        </main>
    )
  }
}