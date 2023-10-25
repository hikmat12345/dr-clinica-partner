import React from "react";
import swal from "sweetalert";
import axios from "axios";
import configData from "../../utils/constants/config.json";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      password: null,
      showPassword: false,
    };
  }

  handleChange = (event) => {
    event.preventDefault();
    this.setState({
      [event.target.id]: event.target.value,
    });
  };

  togglePasswordVisibility = () => {
    this.setState((prevState) => ({
      showPassword: !prevState.showPassword,
    }));
  };

  handleSubmit = (event) => {
    event.preventDefault();
    console.log("Jawad");
    if (this.state.email == null) {
      swal({
        title: "Empty Email",
        text: "Please enter your email address",
        icon: "warning",
        button: "ok",
      });
    } else {
      if (this.state.password == null) {
        swal({
          title: "Empty Password",
          text: "Please enter your password",
          icon: "warning",
          button: "ok",
        });
      } else {
        var bodyFormData = new URLSearchParams();
        bodyFormData.append("email", this.state.email);
        bodyFormData.append("password", this.state.password);
        axios({
          method: "post",
          url: configData.SERVER_URL + "partner/authetication/loginwithemail",
          data: bodyFormData,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            accesstoken: configData.ACCESSTOKEN,
          },
        })
          .then((resp) => {
            if (parseInt(Object.keys(resp.data)[0]) === 200) {
              localStorage.setItem("loginToken", resp.data.partner.token);
              window.location.href = "/";
            } else {
              swal({
                title: "Login Failed",
                text: "Please provide the correct email or password",
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
      }
    }
  };

  render() {
    const { showPassword, password } = this.state;

    return (
      <div
        id="root"
        class="min-h-100vh flex grow bg-slate-50 dark:bg-navy-900"
        x-cloak
      >
        <div class="fixed top-0 hidden p-6 lg:block lg:px-12">
          <Link to="/" class="flex items-center space-x-2">
            <img
              class="h-24"
              src="images/app-logo-main.png"
              alt="Dr. Clinica"
            />
            {/* <p class="text-xl font-semibold uppercase text-slate-700 dark:text-navy-100">Dr. Clinica</p> */}
          </Link>
        </div>
        <div class="hidden w-full place-items-center lg:grid">
          <div class="w-full">
            <img
              class="w-full"
              x-show="!$store.global.isDarkModeEnabled"
              src="images/login.png"
              alt="Dr. Clinica"
            />
            <img
              class="w-full"
              x-show="$store.global.isDarkModeEnabled"
              src="images/illustrations/dashboard-check-dark.svg"
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
                  Welcome Back
                </h2>
                <p class="text-slate-400 dark:text-navy-300">
                  Please sign in to continue
                </p>
              </div>
            </div>
            <div class="mt-16">
              <label class="relative flex">
                <input
                style={{height: "55px"}}
                  class="form-input peer w-full rounded-lg bg-slate-150 px-3 py-2 pl-9 ring-primary/50 placeholder:text-slate-400 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:placeholder:text-navy-300 dark:hover:bg-navy-900 dark:focus:bg-navy-900"
                  placeholder="Email"
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
              <label class="relative ">
                <div className="mt-4">
                  <input
                     className="form-input peer w-full rounded-lg bg-slate-150 px-3 py-2 pl-9 ring-primary/50 placeholder:text-slate-400 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:placeholder:text-navy-300 dark:hover:bg-navy-900 dark:focus:bg-navy-900"
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={this.handleChange}
                    style={{
                      width: "100%",
                      borderRadius: "0.375rem",
                        paddingRight: "2.5rem", 
                      height: "55px",
                      borderWidth: "0",
                       outline: "none",
                      transition: "background-color 0.3s ease",
                    }}
                  />
                  {showPassword ? (
                    <FaEyeSlash
                      className="eye-icon"
                      onClick={this.togglePasswordVisibility}
                      style={{
                        position: "absolute",
                        right: "0.75rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                      }}
                    />
                  ) : (
                    <FaEye
                      className="eye-icon"
                      onClick={this.togglePasswordVisibility}
                      style={{
                        position: "absolute",
                        right: "0.75rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                      }}
                    />
                  )}
                </div>

                <span style={{top:"0px"}} class="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
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
              <div class="mt-4 flex items-center justify-between space-x-2">
                <label class="inline-flex items-center space-x-2">
                  <input
                  
                    class="form-checkbox is-outline h-5 w-5 rounded border-slate-400/70 bg-slate-100 before:bg-primary checked:border-primary hover:border-primary focus:border-primary dark:border-navy-500 dark:bg-navy-900 dark:before:bg-accent dark:checked:border-accent dark:hover:border-accent dark:focus:border-accent"
                    type="checkbox"
                  />
                  <span class="line-clamp-1">Remember me</span>
                </label>
                {/* <Link to="/" class="text-xs text-slate-400 transition-colors line-clamp-1 hover:text-slate-800 focus:text-slate-800 dark:text-navy-300 dark:hover:text-navy-100 dark:focus:text-navy-100">Forgot Password?</Link> */}
              </div>
              <button
                class="btn mt-10 h-14 w-full bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
                onClick={this.handleSubmit}
              >
                Sign In
              </button>
              <div class="mt-4 text-center text-xs+">
                <p class="line-clamp-1">
                  <span>Dont have Account?</span>
                  <Link
                    class="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent"
                    to="/registration"
                  >
                    Create account
                  </Link>
                </p>
              </div>
              {/* <div class="my-7 flex items-center space-x-3">
                        <div class="h-px flex-1 bg-slate-200 dark:bg-navy-500"></div>
                        <p>OR</p>
                        <div class="h-px flex-1 bg-slate-200 dark:bg-navy-500"></div>
                    </div>
                    <div class="flex space-x-4">
                        <button class="btn w-full space-x-3 border border-slate-300 font-medium text-slate-800 hover:bg-slate-150 focus:bg-slate-150 active:bg-slate-150/80 dark:border-navy-450 dark:text-navy-50 dark:hover:bg-navy-500 dark:focus:bg-navy-500 dark:active:bg-navy-500/90">
                            <img class="h-5.5 w-5.5" src="images/google-icon.png" alt="logo" />
                            <span>Google</span>
                        </button>
                        <button class="btn w-full space-x-3 border border-slate-300 font-medium text-slate-800 hover:bg-slate-150 focus:bg-slate-150 active:bg-slate-150/80 dark:border-navy-450 dark:text-navy-50 dark:hover:bg-navy-500 dark:focus:bg-navy-500 dark:active:bg-navy-500/90">
                            <img class="h-5.5 w-5.5" src="images/facebook-icon.png" alt="logo"/>
                            <span>Facebook</span>
                        </button>
                    </div> */}
            </div>
          </div>
          <div class="my-5 flex justify-center text-xs text-slate-400 dark:text-navy-300">
            <Link to="/">Privacy Notice</Link>
            <div class="mx-3 my-1 w-px bg-slate-200 dark:bg-navy-500"></div>
            <Link to="/">Term of service</Link>
          </div>
        </main>
      </div>
    );
  }
}
