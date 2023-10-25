import React from "react";
import swal from "sweetalert";
import axios from "axios";
import configData from "../../utils/constants/config.json";
import firebase from "../../utils/helpers/firebase";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import ReactInputVerificationCode from "react-input-verification-code";

export default class Registration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: null,
      lastname: null,
      email: null,
      phone: null,
      password: null,
      repeatpassword: null,
      country: null,
      timezone: null,
      currency: null,
      language: null,
      otp: null,
      countries: null,
      timezones: null,
      currencies: null,
      languages: null,
      showCountryModal: false,
      showOtpModal: false,
      dataisloaded: false,
      passwordErrorLabel: false,
      passwordErrorMessage: "",
      repeatPasswordErrorLabel: false,
      termsConditions: false,
      otpSended: false,
      otpTimer: false,
      time: { h: 0, m: 0, s: 0 },
      seconds: 90,
      fistTime: true,
      leadphone: null,
      bussinessname: null,
      leadEmail: null,
      registerBtnText: "Register",
      loader:false,
    };
    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
  }

  componentDidMount() {
    const defaultData= {
        countries : [
          {
              id: 1,
              name: "United Arab Emirates",
              code: "AE",
              status: 0,
              createdon: "2022-10-27T06:58:41.000Z"
          },
          {
              id: 2,
              name: "Qatar",
              code: "QR",
              status: 0,
              createdon: "2022-10-27T06:58:41.000Z"
          }
      ],
       cuurencies : [
          {
              id: 1,
              name: "Dirham",
              tag: "AED",
              status: 0,
              createdon: "2022-10-27T05:42:22.000Z"
          },
          {
              id: 2,
              name: "Qatari Riyal",
              tag: "QR",
              status: 0,
              createdon: "2022-10-27T05:42:22.000Z"
          }
      ],
       languages : [
          {
              id: 1,
              name: "English",
              tag: "EN",
              status: 0,
              createdon: "2022-10-27T05:44:27.000Z"
          }
      ],
       timezones : [
          {
              id: 1,
              name: "Dubai",
              tag: "GMT +04:00",
              status: 0,
              createdon: "2022-10-27T05:54:39.000Z"
          },
          {
              id: 2,
              name: "Qatar",
              tag: "GMT +03:00",
              status: 0,
              createdon: "2022-10-27T05:54:39.000Z"
          }
      ]
  }
    this.setState({
      country: defaultData.countries[0].id,
      timezone: defaultData.timezones[0].id,
      currency: defaultData.cuurencies[0].id,
      language: defaultData.languages[0].id,
      countries: defaultData.countries,
      timezones: defaultData.timezones,
      currencies: defaultData.cuurencies,
      languages: defaultData.languages,
      dataisloaded: true,
    });
    // axios({
    //   method: "get",
    //   url: configData.SERVER_URL + "partner/account/createAccountPreLoad",
    //   headers: {
    //     'Clear-Site-Data': 'cache, cookies, storage', 
    //     "Content-Type": "application/x-www-form-urlencoded",
    //     accesstoken: configData.ACCESSTOKEN,
    //   },
    // })
    //   .then((resp) => {
    //     if (parseInt(Object.keys(resp.data)[0]) === 200) {
    //       this.setState({
    //         country: resp.data.countries[0].id,
    //         timezone: resp.data.timezones[0].id,
    //         currency: resp.data.cuurencies[0].id,
    //         language: resp.data.languages[0].id,
    //         countries: resp.data.countries,
    //         timezones: resp.data.timezones,
    //         currencies: resp.data.cuurencies,
    //         languages: resp.data.languages,
    //         dataisloaded: true,
    //       });
    //       this.configureCaptcha();
    //     } else {
    //       swal({
    //         title: "Server Not Reachable",
    //         text: "We are not able to reach out the server. Please try again later",
    //         icon: "warning",
    //         button: "ok",
    //       });
    //     }
    //   })
    //   .catch((err) => {
    //     swal({
    //       title: "Server Not Responding",
    //       text: "Please try again later",
    //       icon: "warning",
    //       button: "ok",
    //     });
    //     console.log(err);
    //   });
  }

  handleChange = (event) => {
    event.preventDefault();
    this.setState({
      [event.target.id]: event.target.value,
    });
  };

  toggleChange = (event) => {
    event.preventDefault();
    document.getElementById("termsCondition").style.border = "0px solid #fff";
    this.setState({
      termsConditions: !this.state.termsConditions,
    });
  };

  handlePasswordChange = (event) => {
    event.preventDefault();
    const isValidLength = /^.{8,16}$/;
    if (!isValidLength.test(event.target.value)) {
      this.setState({
        passwordErrorLabel: true,
        passwordErrorMessage: "Password must be 8-16 Characters Long.",
      });
      return;
    }
    const isContainsNumber = /^(?=.*[0-9])/;
    if (!isContainsNumber.test(event.target.value)) {
      this.setState({
        passwordErrorLabel: true,
        passwordErrorMessage: "Password must contain at least one Digit.",
      });
      return;
    }
    const isContainsSymbol = /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹])/;
    if (!isContainsSymbol.test(event.target.value)) {
      this.setState({
        passwordErrorLabel: true,
        passwordErrorMessage:
          "Password must contain at least one Special Symbol.",
      });
      return;
    }
    const isContainsUppercase = /^(?=.*[A-Z])/;
    if (!isContainsUppercase.test(event.target.value)) {
      this.setState({
        passwordErrorLabel: true,
        passwordErrorMessage:
          "Password must have at least one Uppercase Character.",
      });
      return;
    }
    const isContainsLowercase = /^(?=.*[a-z])/;
    if (!isContainsLowercase.test(event.target.value)) {
      this.setState({
        passwordErrorLabel: true,
        passwordErrorMessage:
          "Password must have at least one Lowercase Character.",
      });
      return;
    }
    const isWhitespace = /^(?=.*\s)/;
    if (isWhitespace.test(event.target.value)) {
      this.setState({
        passwordErrorLabel: true,
        passwordErrorMessage: "Password must not contain Whitespaces.",
      });
      return;
    }
    this.setState({
      passwordErrorLabel: false,
      passwordErrorMessage: "",
      [event.target.id]: event.target.value,
    });
  };

  handleRepeatPasswordChange = (event) => {
    if (this.state.password !== event.currentTarget.value) {
      this.setState({
        repeatPasswordErrorLabel: true,
      });
      return;
    }
    this.setState({
      repeatPasswordErrorLabel: false,
      [event.target.id]: event.target.value,
    });
  };

  handleRegisterClick = (event) => {
    if (this.state.firstname == null) {
      document.getElementById("firstname").focus();
      return;
    }
    if (this.state.lastname == null) {
      document.getElementById("lastname").focus();
      return;
    }
    if (
      this.state.email == null ||
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email)
    ) {
      document.getElementById("email").focus();
      return;
    }
    if (this.state.phone == null) {
      document.getElementById("phone").focus();
      return;
    }
    if (this.state.password == null) {
      document.getElementById("password").focus();
      return;
    }
    if (
      this.state.repeatpassword == null ||
      this.state.repeatpassword !== this.state.password
    ) {
      document.getElementById("repeatpassword").focus();
      return;
    }
    if (this.state.termsConditions === false) {
      console.log("Terms");
      document.getElementById("termsCondition").style.border =
        "2px solid #4f46e5";
      return;
    }
    this.setState({
      registerBtnText: "Please Wait...",
    });
    console.log(this.state.phone);
    const appVerifier = window.recaptchaVerifier;
    firebase
      .auth()
      .signInWithPhoneNumber(this.state.phone, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        console.log("OTP has been sent");
        this.setState({
          otpTimer: true,
          showOtpModal: true,
          otpSended: true,
          seconds: 30,
        });
        this.startTimer();
      })
      .catch((error) => {
        console.log("SMS not sent");
        console.log(error);
      });
  };

  onSubmitOTP = (e) => {
    e.preventDefault();
    if (this.state.otp == null) {
      document.getElementById("otp").focus();
      return;
    }
    window.confirmationResult
      .confirm(this.state.otp)
      .then((result) => {
        // User signed in successfully.
        //   const user = result.user;
        this.setState({
          showOtpModal: false,
        });
        console.log("OTP Verification Successfull");
        swal({
          title: "Please Wait..!!",
          text: "Please wait while we are processing your request",
          icon: "success",
        });
        this.registerUser();
      })
      .catch((error) => {
        console.log("OTP Verification Failed");
        console.log(error);
        swal({
          title: "Incorrect OTP",
          text: "Please enter the correct otp.",
          icon: "warning",
          button: "ok",
        });
      });
  };

  configureCaptcha = () => {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "sign-in-button",
      {
        size: "invisible",
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          this.handleRegisterClick();
          console.log("Recaptca varified");
        },
        defaultCountry: "UAE",
      }
    );
  };

  registerUser = (event) => {
    this.setState({
      loader:true,})
    var bodyFormData = new URLSearchParams();
    bodyFormData.append("firstname", this.state.firstname);
    bodyFormData.append("lastname", this.state.lastname);
    bodyFormData.append("password", this.state.password);
    bodyFormData.append("email", this.state.email);
    bodyFormData.append("phone", this.state.phone);
    bodyFormData.append("country", this.state.country);
    bodyFormData.append("timezone", this.state.timezone);
    bodyFormData.append("currency", this.state.currency);
    bodyFormData.append("language", this.state.language);
    axios({
      method: "post",
      url: configData.SERVER_URL + "partner/account/createAccount",
      data: bodyFormData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        accesstoken: configData.ACCESSTOKEN,
      },
    })
      .then((resp) => {
        this.setState({
          loader:false,})
        if (parseInt(Object.keys(resp.data)[0]) === 200) {
          localStorage.setItem("loginToken", resp.data.partner.token);
          swal({
            title: "Thank you for your registration!",
            text: "Clinic activation will be done with in 48 hours",
            icon: "success",
            button: "ok",
          }).then(function () {
            window.location.href = "/";
        });
        
          // setTimeout(() => {
          //   window.location.href = "/";
          // }, 3000); 
        } else {
          swal({
            title: "Registration Failed",
            text: resp.data[Object.keys(resp.data)[0]],
            icon: "warning",
            button: "ok",
          });
        }
      })
      .catch((err) => {
        swal({
          title: "Server Not Responding",
          text: "Please try again later",
          icon: "warning",
          button: "ok",
        });
        console.log(err);
      });
  };
  LeadBtnHandler = (event) => {
    if (this.state.bussinessname == null) {
      document.getElementById("bussinessname").focus();
      return;
    } 
    if (this.state.email == null) {
      document.getElementById("email").focus();
      return;
    } 
    if (this.state.phone == null) {
      document.getElementById("tel").focus();
      return;
    }
   
   
    var bodyFormData = new URLSearchParams();
    this.setState({
      loader:true,})
    const body = JSON.stringify({
      name: this.state.bussinessname,
      email: this.state.email,
      phoneNumber: this.state.phone,
    });
    axios({
      method: "post",
      url: configData.SERVER_URL + "marketing/form/leads",
      data: body,
      headers: {
        "Content-Type": "application/json",
        accesstoken: configData.ACCESSTOKEN,
      },
    })
      .then((resp) => {
        this.setState({
          loader:false,})
        if (parseInt(Object.keys(resp.data)[0]) === 200) {
          this.setState({
            fistTime: false,
            leadphone: this.state.phone,
            bussinessname: this.state.bussinessname,
            leadEmail: this.state.email,
          });
        } else {
          swal({
            title: "Registration Failed",
            text: resp.data[Object.keys(resp.data)[0]],
            icon: "warning",
            button: "ok",
          });
        }
      })
      .catch((err) => {
        swal({
          title: "Server Not Responding",
          text: "Please try again later",
          icon: "warning",
          button: "ok",
        });
        console.log(err);
      });
  };
  handleModalShow = (e) => {
    this.setState({
      [e.target.id]: true,
    });
  };

  handleModalHide = (e) => {
    console.log(e.currentTarget.id);
    this.setState({
      [e.currentTarget.id]: false,
    });
  };

  startTimer() {
    if (this.timer === 0 && this.state.seconds > 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
  }

  countDown() {
    // Remove one second, set state so a re-render happens.
    let seconds = this.state.seconds - 1;
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds,
    });

    // Check if we're at zero.
    if (seconds === 0) {
      clearInterval(this.timer);
      this.setState({
        otpTimer: false,
      });
      this.timer = 0;
    }
  }

  secondsToTime(secs) {
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      h: hours,
      m: minutes,
      s: seconds,
    };
    return obj;
  }

  render() {
    return (
      <div>
        <div id="sign-in-button"></div>
        <div
          id="root"
          class="min-h-100vh flex grow bg-slate-50 dark:bg-navy-900"
          x-cloak
        >
          <div class="fixed top-0 hidden p-6 lg:block lg:px-12">
            <a href="/" class="flex items-center space-x-2">
              <img
                class="h-24"
                src="images/app-logo-main.png"
                alt="Dr. Clinica"
              />
              {/* <p class="text-xl font-semibold uppercase text-slate-700 dark:text-navy-100">Dr. Clinica</p> */}
            </a>
          </div>
          <div class="hidden w-full place-items-center lg:grid">
            <div class="w-full">
              <img
                class="w-full"
                x-show="!$store.global.isDarkModeEnabled"
                src="/images/registration.png"
                alt="Dr. Clinica"
              />
              <img
                class="w-full"
                x-show="$store.global.isDarkModeEnabled"
                src="images/illustrations/dashboard-meet-dark.svg"
                alt="Dr. Clinica"
              />
            </div>
          </div>
          <main class="flex w-full flex-col items-center bg-white dark:bg-navy-700 lg:max-w-md">
            <div class="flex w-full max-w-sm grow flex-col justify-center p-5">
              <div class="text-center">
                <img
                  class="mx-auto h-16 w-16 lg:hidden"
                  src="images/app-logo-main.png"
                  alt="Dr. Clinica"
                />
                <div class="mt-4">
                  <h2 class="text-2xl font-semibold text-slate-600 dark:text-navy-100">
                    Welcome To Dr. Clinica
                  </h2>
                  <p class="text-slate-400 dark:text-navy-300">
                    Please sign up to continue
                  </p>
                </div>
              </div>

              {this.state.showOtpModal ? (
                <div class="mt-4 space-y-4">
                  <label class="relative flex">
                    <div className="custom-styles">
                      <ReactInputVerificationCode
                        length={6}
                        onChange={(otp) => {
                          this.setState({
                            otp: otp,
                          });
                        }}
                      />
                    </div>
                  </label>
                  {this.state.otpTimer ? (
                    <div
                      class="badge rounded-full border border-info text-info"
                      id="timer"
                    >
                      Request a new otp after {this.state.time.m}:
                      {this.state.time.s}
                    </div>
                  ) : (
                    <button
                      class="btn mt-4 h-14 w-full bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
                      onClick={this.handleRegisterClick}
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              ) : this.state.fistTime ? (
                <div class="mt-4 space-y-4">
                  <>
                  
                    <label class="relative flex">
                      <input
                      style={{height: "55px", fontSize:"18px"}}
                        class="form-input peer w-full rounded-lg bg-slate-150 px-3 py-2 pl-9 ring-primary/50 placeholder:text-slate-400 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:placeholder:text-navy-300 dark:hover:bg-navy-900 dark:focus:bg-navy-900"
                        placeholder="Bussiness Name*"
                        type="text"
                        id="bussinessname"
                        onChange={this.handleChange}
                      />
                      <span class="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5 transition-colors duration-200"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          stroke-width="1.5"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </span>
                    </label>

                    <label class="relative flex">
                      <input
                      style={{height: "55px", fontSize:"18px"}}
                        class="form-input peer w-full rounded-lg bg-slate-150 px-3 py-2 pl-9 ring-primary/50 placeholder:text-slate-400 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:placeholder:text-navy-300 dark:hover:bg-navy-900 dark:focus:bg-navy-900"
                        placeholder="Email*"
                        type="email"
                        id="email"
                        onChange={this.handleChange}
                      />
                      <span class="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5 transition-colors duration-200"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1.5"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </span>
                    </label>

                    <label class="relative flex">
                      <PhoneInput
                      style={{height: "55px", fontSize:"18px"}}
                        id="tel"
                        className="form-input form-input-phone peer w-full rounded-lg bg-slate-150 px-3 py-2 pl-1 ring-primary/50 placeholder:text-slate-400 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:placeholder:text-navy-300 dark:hover:bg-navy-900 dark:focus:bg-navy-900"
                        placeholder="Enter contact number"
                        defaultCountry="AE"
                        onChange={(phone) => this.setState({ phone })}
                        onMouseOut={this.removeError}
                      />
                    </label>
                    <div
                      class="mt-4 flex items-center space-x-2 p-2"
                      id="termsCondition"
                    >
                      <input
                      
                        class="form-checkbox is-basic h-5 w-5 rounded border-slate-400/70 checked:border-primary checked:bg-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:checked:border-accent dark:checked:bg-accent dark:hover:border-accent dark:focus:border-accent"
                        type="checkbox"
                        checked={this.state.termsConditions}
                        onChange={this.toggleChange}
                      />
                      <p class="line-clamp-1">
                        I agree with{" "}
                        <a
                          href="/terms-&-condition"
                          class="text-slate-400 hover:underline dark:text-navy-300"
                          target="_blank"
                        >
                          Terms & Condition
                        </a>
                      </p>
                    </div>
                   {this.state.loader ? <button
                      class="btn mt-4 h-14 w-full bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
                       
                    >
                     <svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                     <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                                     <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                                    </svg> Loading...
                    </button> :

                    <button
                      class="btn mt-4 h-14 w-full bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
                      onClick={this.LeadBtnHandler}
                    >
                      Register
                    </button>}
                  </>
                </div>
              ) : (
                <div class="mt-4 space-y-4">
                  <>
                   
                    <label class="relative flex">
                      <input
                      style={{height: "55px", fontSize:"18px"}}
                        readOnly
                        class="form-input peer w-full rounded-lg bg-slate-150 px-3 py-2 pl-9 ring-primary/50 placeholder:text-slate-400 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:placeholder:text-navy-300 dark:hover:bg-navy-900 dark:focus:bg-navy-900"
                        placeholder="Bussiness Name*"
                        type="text"
                        id="bussinessname"
                        value={this.state.bussinessname}
                        onChange={this.handleChange}
                      />
                      <span class="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5 transition-colors duration-200"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          stroke-width="1.5"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </span>
                    </label>

                    <label class="relative flex">
                      <input
                      style={{height: "55px", fontSize:"18px"}}
                        readOnly
                        class="form-input peer w-full rounded-lg bg-slate-150 px-3 py-2 pl-9 ring-primary/50 placeholder:text-slate-400 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:placeholder:text-navy-300 dark:hover:bg-navy-900 dark:focus:bg-navy-900"
                        placeholder="Email*"
                        type="email"
                        id="email"
                        value={this.state.leadEmail}
                        onChange={this.handleChange}
                      />
                      <span class="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5 transition-colors duration-200"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1.5"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </span>
                    </label>

                    <label class="relative flex">
                      <PhoneInput
                      style={{height: "55px", fontSize:"18px"}}
                        readOnly
                        id="tel"
                        value={this.state.leadphone}
                        className="form-input form-input-phone peer w-full rounded-lg bg-slate-150 px-3 py-2 pl-9 ring-primary/50 placeholder:text-slate-400 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:placeholder:text-navy-300 dark:hover:bg-navy-900 dark:focus:bg-navy-900"
                        placeholder="Enter contact number"
                        defaultCountry="AE"
                        onChange={(phone) => this.setState({ phone })}
                        onMouseOut={this.removeError}
                      />
                    </label>
                   
                   
                    <label class="relative flex">
                      <input
                      style={{height: "55px", fontSize:"18px"}}
                        class="form-input peer w-full rounded-lg bg-slate-150 px-3 py-2 pl-9 ring-primary/50 placeholder:text-slate-400 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:placeholder:text-navy-300 dark:hover:bg-navy-900 dark:focus:bg-navy-900"
                        placeholder="First Name*"
                        type="text"
                        id="firstname"
                        onChange={this.handleChange}
                      />
                      <span class="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5 transition-colors duration-200"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          stroke-width="1.5"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </span>
                    </label>
                    <label class="relative flex">
                      <input
                      style={{height: "55px", fontSize:"18px"}}
                        class="form-input peer w-full rounded-lg bg-slate-150 px-3 py-2 pl-9 ring-primary/50 placeholder:text-slate-400 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:placeholder:text-navy-300 dark:hover:bg-navy-900 dark:focus:bg-navy-900"
                        placeholder="Last Name*"
                        type="text"
                        id="lastname"
                        onChange={this.handleChange}
                      />
                      <span class="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5 transition-colors duration-200"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          stroke-width="1.5"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </span>
                    </label>

                    <label class="relative flex">
                      <input
                      style={{height: "55px", fontSize:"18px"}}
                        class="form-input peer w-full rounded-lg bg-slate-150 px-3 py-2 pl-9 ring-primary/50 placeholder:text-slate-400 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:placeholder:text-navy-300 dark:hover:bg-navy-900 dark:focus:bg-navy-900"
                        placeholder="Password"
                        type="password"
                        id="password"
                        onChange={this.handlePasswordChange}
                      />
                      <span class="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5 transition-colors duration-200"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1.5"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </span>
                    </label>
                    {this.state.passwordErrorLabel ? (
                      <div class="badge bg-error/10 text-error dark:bg-error/15">
                        {this.state.passwordErrorMessage}
                      </div>
                    ) : null}
                    <label class="relative flex">
                      <input
                      style={{height: "55px", fontSize:"18px"}}
                        class="form-input peer w-full rounded-lg bg-slate-150 px-3 py-2 pl-9 ring-primary/50 placeholder:text-slate-400 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:placeholder:text-navy-300 dark:hover:bg-navy-900 dark:focus:bg-navy-900"
                        placeholder="Repeat Password"
                        type="password"
                        id="repeatpassword"
                        onChange={this.handleRepeatPasswordChange}
                      />
                      <span class="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5 transition-colors duration-200"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1.5"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </span>
                    </label>
                    {this.state.repeatPasswordErrorLabel ? (
                      <div class="badge bg-error/10 text-error dark:bg-error/15">
                        Password doesnot match
                      </div>
                    ) : null}
                    <label class="relative flex">
                      <input
                      style={{height: "55px", fontSize:"18px"}}
                        class="form-input peer w-full rounded-lg bg-slate-150 px-3 py-2 pl-9 ring-primary/50 placeholder:text-slate-400 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:placeholder:text-navy-300 dark:hover:bg-navy-900 dark:focus:bg-navy-900"
                        value={
                          this.state.dataisloaded
                            ? this.state.countries[0].name
                            : "Please Select Country"
                        }
                        type="text"
                        readOnly
                        id="showCountryModal"
                      />
                      <span class="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5 transition-colors duration-200"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1.5"
                            d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001M14 1.221c-.22.078-.48.167-.766.255-.81.252-1.872.523-2.734.523-.886 0-1.592-.286-2.203-.534l-.008-.003C7.662 1.21 7.139 1 6.5 1c-.669 0-1.606.229-2.415.478A21.294 21.294 0 0 0 3 1.845v6.433c.22-.078.48-.167.766-.255C4.576 7.77 5.638 7.5 6.5 7.5c.847 0 1.548.28 2.158.525l.028.01C9.32 8.29 9.86 8.5 10.5 8.5c.668 0 1.606-.229 2.415-.478A21.317 21.317 0 0 0 14 7.655V1.222z"
                          />
                        </svg>
                      </span>
                    </label>
                    <div
                      class="mt-4 flex items-center space-x-2 p-2"
                      id="termsCondition"
                    >
                      <input
                      
                        class="form-checkbox is-basic h-5 w-5 rounded border-slate-400/70 checked:border-primary checked:bg-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:checked:border-accent dark:checked:bg-accent dark:hover:border-accent dark:focus:border-accent"
                        type="checkbox"
                        checked={this.state.termsConditions}
                        onChange={this.toggleChange}
                      />
                      <p class="line-clamp-1">
                        I agree with{" "}
                        <a
                          href="/terms-&-condition"
                          class="text-slate-400 hover:underline dark:text-navy-300"
                          target="_blank"
                        >
                          Terms & Condition
                        </a>
                      </p>
                    </div>
                  </>{" "}
                </div>
              )}
              {
                this.state.otpSended ? (
                  <button
                    class="btn mt-4 h-10 w-full bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
                    onClick={this.onSubmitOTP}
                  >
                    Verify
                  </button>
                ) : (
                  this.state.fistTime == false && (
                    this.state.loader ?
                      <button   class="btn mt-4 h-10 w-full bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
                     
                    >
                     <svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                     <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                                     <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                                    </svg> Loading...
                    </button> :
                    <button   class="btn mt-4 h-10 w-full bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
                    onClick={this.registerUser}
                  >
                    Register
                  </button>
                  )
                )
                // <button class="btn mt-4 h-10 w-full bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90" onClick={this.handleRegisterClick}>{this.state.registerBtnText}</button>
              }
              <div class="mt-4 text-center text-xs+">
                <p class="line-clamp-1">
                  <span>Already have an account? </span>
                  <a
                    class="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent"
                    href="/"
                  >
                    Sign In
                  </a>
                </p>
              </div>
            </div>
          </main>
        </div>
        {this.state.showCountryModal ? (
          <div
            class="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
            role="dialog"
          >
            <div
              class="absolute inset-0 bg-slate-900/60 backdrop-blur transition-opacity duration-300"
              id="showCountryModal"
              onClick={this.handleModalHide}
            ></div>
            <div class="relative w-full max-w-2xl origin-bottom rounded-lg bg-white pb-4 transition-all duration-300 dark:bg-navy-700">
              <div class="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
                <h3 class="text-base font-medium text-slate-700 dark:text-navy-100">
                  Settings
                </h3>
                <button
                  class="btn -mr-1.5 h-7 w-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                  id="showCountryModal"
                  onClick={this.handleModalHide}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4.5 w-4.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
              <div class="is-scrollbar-hidden min-w-full overflow-x-auto">
                <div class="m-4 space-y-4 p-5">
                  <label class="block">
                    <span>Country</span>
                    <select
                      class="form-select mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
                      id="country"
                      onChange={this.handleChange}
                    >
                      {this.state.countries.map((country) => (
                        <option value={country.id}>{country.name}</option>
                      ))}
                    </select>
                  </label>

                  <label class="block">
                    <span>Time Zone</span>
                    <select
                      class="form-select mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
                      id="timezone"
                      onChange={this.handleChange}
                    >
                      {this.state.timezones.map((timezone) => (
                        <option value={timezone.id}>
                          {timezone.name} ({timezone.tag})
                        </option>
                      ))}
                    </select>
                  </label>

                  <label class="block">
                    <span>Currency</span>
                    <select
                      class="form-select mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
                      id="currency"
                      onChange={this.handleChange}
                    >
                      {this.state.currencies.map((currency) => (
                        <option value={currency.id}>
                          {currency.tag} {currency.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label class="block">
                    <span>Language</span>
                    <select
                      class="form-select mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
                      id="language"
                      onChange={this.handleChange}
                    >
                      {this.state.languages.map((language) => (
                        <option value={language.id}>
                          {language.name} ({language.tag})
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
              <div class="text-center">
                <button
                  class="btn bg-primary btn-color from-sky-400 to-blue-600 font-medium text-white"
                  id="showCountryModal"
                  onClick={this.handleModalHide}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  }
}
