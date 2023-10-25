import React from "react";
import SubscriptionIcon from "../../../assets/images/svg/Subscription";
import configData from "../../../utils/constants/config.json";
import AccountSidebar from "../subsidebars/accountsidebar";
import ClientsSidebar from "../subsidebars/clientssidebar";
import DashboardSidebar from "../subsidebars/dashboardsidebar";
import SalesSidebar from "../subsidebars/salessidebar";
import ServicesSidebar from "../subsidebars/servicessidebar";
import TeamSidebar from "../subsidebars/teamsidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icon from "../../../assets/images/png/subscription-icon.png";
import { Link, useLocation } from "react-router-dom";
import PromotionSidebar from "../subsidebars/promotions";
const NestedSidebar =()=>{
  const history= useLocation()
  console.log(history,history.pathname?.split("/")[0], 'history')
  return (
    <>
        {history.pathname == "/" ? <DashboardSidebar /> : null}
        {history.pathname?.split("/")[1] == "commingsoon" ? (
          <DashboardSidebar />
        ) : null}
        {history.pathname?.split("/")[1] == "services" ? (
          <ServicesSidebar />
        ) : null}
        {history.pathname?.split("/")[1] == "team" ? (
          <TeamSidebar />
        ) : null}
        {history.pathname?.split("/")[1] == "clients" ? (
          <ClientsSidebar />
        ) : null}
        {history.pathname?.split("/")[1] == "sales" ? (
          <SalesSidebar />
        ) : null}
        {history.pathname?.split("/")[1] == "promotions" ? (
          <PromotionSidebar />
        ) : null}

       {history.pathname?.split("/")[1] == "calendar" ? (
          <DashboardSidebar />
        ) : null}

        {history.pathname?.split("/")[1] == "settings" ? (
          <DashboardSidebar />
        ) : null}
        {history.pathname?.split("/")[1] == "account" ? (
          <AccountSidebar />
        ) : null}
        </>
  )
}
class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    console.log(props, 'props')
    this.state = {
      profileMenuClass: "popper-root fixed",
      profileMenuBool: false,
      user: this.props.user,
      themeColor: localStorage.getItem("dark-mode"),
    };
  }

  handleProfileMenu = (event) => {
    event.preventDefault();
    if (this.state.profileMenuBool) {
      this.setState({
        profileMenuClass: "popper-root fixed",
        profileMenuBool: false,
      });
    } else {
      this.setState({
        profileMenuClass: "popper-root fixed show",
        profileMenuBool: true,
      });
    }
  };

  ontoggleSidebar = (event) => {
    document.body.classList.contains("is-sidebar-open")
      ? document.body.classList.remove("is-sidebar-open")
      : document.body.classList.add("is-sidebar-open");
  };
// componentDidMount(){
//   document.body.classList.add("is-sidebar-open")
// }
  render() {
    return (
      <div className="sidebar print:hidden">
        <div className="main-sidebar">
          <div className="flex h-full w-full flex-col items-center border-r border-slate-150 bg-white dark:border-navy-700 dark:bg-navy-800">
            <div className="flex pt-4">
              {this.state.themeColor == "dark" ? (
                <Link to="/">
                  {" "}
                  <img
                    className="h-11 w-11 transition-transform duration-500 ease-in-out hover:rotate-[360deg]"
                    src="/images/app-logo-white.png"
                    alt="Dr. Clinica"
                  />
                </Link>
              ) : (
                <Link to="/">
                  {" "}
                  <img
                    className="h-11 w-11 transition-transform duration-500 ease-in-out hover:rotate-[360deg]"
                    src="/images/app-logo.png"
                    alt="Dr. Clinica"
                  />
                </Link>
              )}
            </div>

            <div className="is-scrollbar-hidden flex grow flex-col space-y-4 overflow-y-auto pt-6">
              <Link
                to="/"
                x-tooltip="'Dashboard'"
                className="flex h-11 w-11 items-center justify-center rounded-lg outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
              >
                <img
                  className="h-11 w-11 transition-transform duration-500 ease-in-out hover:rotate-[360deg]"
                  src="/images/icons/Dashboard.svg"
                  alt="Dashboard"
                />
              </Link>

              <Link
                to="/calendar"
                x-tooltip="'Calender'"
                className="flex h-11 w-11 items-center justify-center rounded-lg outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
              >
                <img
                  className="h-11 w-11 transition-transform duration-500 ease-in-out hover:rotate-[360deg]"
                  src="/images/icons/Calendar.svg"
                  alt="Calendar"
                />
              </Link>

              <Link
                to="/sales/appointments/listing"
                x-tooltip="'Sales'"
                className="flex h-11 w-11 items-center justify-center rounded-lg outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
              >
                <img
                  className="h-11 w-11 transition-transform duration-500 ease-in-out hover:rotate-[360deg]"
                  src="/images/icons/Sales.svg"
                  alt="Sales"
                />
              </Link>

              <Link
                to="/clients"
                x-tooltip="'Clients'"
                className="flex h-11 w-11 items-center justify-center rounded-lg outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
              >
                <img
                  className="h-11 w-11 transition-transform duration-500 ease-in-out hover:rotate-[360deg]"
                  src="/images/icons/Clients.svg"
                  alt="Clients"
                />
              </Link>

              <Link
                to="/team/teammember"
                x-tooltip="'Service Providers'"
                className="flex h-11 w-11 items-center justify-center rounded-lg outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
              >
                <img
                  className="h-11 w-11 transition-transform duration-500 ease-in-out hover:rotate-[360deg]"
                  src="/images/icons/Service-Providers.svg"
                  alt="Service-Providers"
                />
              </Link>

              <Link
                to="/services/servicelist"
                x-tooltip="'Services'"
                className="flex h-11 w-11 items-center justify-center rounded-lg outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
              >
                <img
                  className="h-11 w-11 transition-transform duration-500 ease-in-out hover:rotate-[360deg]"
                  src="/images/icons/Services.svg"
                  alt="Services"
                />
              </Link>
              <Link
                to="/promotions/offers"
                x-tooltip="'Offers'"
                className="flex h-11 w-11 items-center justify-center rounded-lg outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
              >
                <img
                  className="h-6 w-6 transition-transform duration-500 ease-in-out hover:rotate-[360deg]"
                  src="/images/icons/offer.png"
                  alt="Offers"
                />
              </Link>
              {/* <Link to="/commingsoon" x-tooltip="'Online Profile'" className="flex h-11 w-11 items-center justify-center rounded-lg outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25" >
                                <img className="h-11 w-11 transition-transform duration-500 ease-in-out hover:rotate-[360deg]" src="/images/icons/Online-Profile.svg" alt="Online-Profile" />
                            </Link> */}

              {/* <Link to="/commingsoon" x-tooltip="'Payments'" className="flex h-11 w-11 items-center justify-center rounded-lg outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25" >
                                <img className="h-11 w-11 transition-transform duration-500 ease-in-out hover:rotate-[360deg]" src="/images/icons/Payments.svg" alt="Payments" />
                            </Link> */}

              {/* <Link to="/commingsoon" x-tooltip="'Reports'" className="flex h-11 w-11 items-center justify-center rounded-lg outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25" >
                                <img className="h-11 w-11 transition-transform duration-500 ease-in-out hover:rotate-[360deg]" src="/images/icons/Reports.svg" alt="Reports" />
                            </Link> */}

              {/* <Link
                to="/commingsoon"
                x-tooltip="'Support'"
                className="flex h-11 w-11 items-center justify-center rounded-lg outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
              >
                <img
                  className="h-11 w-11 transition-transform duration-500 ease-in-out hover:rotate-[360deg]"
                  src="/images/icons/Support.svg"
                  alt="Support"
                />
              </Link> */}
            </div>

            <div className="flex flex-col items-center space-y-3 py-3">
              <Link
                to="/settings"
                x-tooltip="'Settings'"
                className="flex h-11 w-11 items-center justify-center rounded-lg outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
              >
                <img
                  className="h-11 w-11 transition-transform duration-500 ease-in-out hover:rotate-[360deg]"
                  src="/images/icons/Settings.svg"
                  alt="Settings"
                />
              </Link>
              <div
                x-data="usePopper({placement:'right-end',offset:12})"
                className="flex"
              >
                <button
                  x-ref="popperRef"
                  className="avatar h-12 w-12"
                  onClick={this.handleProfileMenu}
                >
                  <img
                    className="rounded-full"
                    src={this.state.user.image}
                    alt={
                      this.state.user.firstname + " " + this.state.user.lastname
                    }
                  />
                  <span className="absolute right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-success dark:border-navy-700"></span>
                </button>

                <div
                  className={this.state.profileMenuClass}
                  style={{ position: "relative", zIndex: "999" }}
                  x-ref="popperRoot"
                  id="profileMenue"
                >
                  <div
                    style={{ position: "relative", top: "-40px" }}
                    className="popper-box w-64 rounded-lg border border-slate-150 bg-white shadow-soft dark:border-navy-600 dark:bg-navy-700"
                  >
                    <div className="flex items-center space-x-4 rounded-t-lg bg-slate-100 py-5 px-4 dark:bg-navy-800">
                      <div className="avatar h-14 w-14">
                        <img
                          className="rounded-full"
                          src={this.state.user.image}
                          alt={
                            this.state.user.firstname +
                            " " +
                            this.state.user.lastname
                          }
                        />
                      </div>
                      <div>
                        <Link
                          to="/profile"
                          className="text-base font-medium text-slate-700 hover:text-primary focus:text-primary dark:text-navy-100 dark:hover:text-accent-light dark:focus:text-accent-light"
                        >
                          {this.state.user.firstname} {this.state.user.lastname}
                        </Link>
                        <p className="text-xs text-slate-400 dark:text-navy-300">
                          {this.state.user.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col pt-2 pb-5">
                      <Link
                        to="/account/profile"
                        className="group flex items-center space-x-3 py-2 px-4 tracking-wide outline-none transition-all hover:bg-slate-100 focus:bg-slate-100 dark:hover:bg-navy-600 dark:focus:bg-navy-600"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning text-white">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4.5 w-4.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        <div style={{ textAlign: "left" }}>
                          <h2 className="font-medium text-slate-700 transition-colors group-hover:text-primary group-focus:text-primary dark:text-navy-100 dark:group-hover:text-accent-light dark:group-focus:text-accent-light">
                            Profile
                          </h2>
                          <div className="text-xs text-slate-400 line-clamp-1 dark:text-navy-300">
                            Your profile setting
                          </div>
                        </div>
                      </Link>
                      {/* <Link to="/account/commingsoon" className="group flex items-center space-x-3 py-2 px-4 tracking-wide outline-none transition-all hover:bg-slate-100 focus:bg-slate-100 dark:hover:bg-navy-600 dark:focus:bg-navy-600">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-info text-white">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" >
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.375 17.556h-6.75m6.75 0H21l-1.58-1.562a2.254 2.254 0 01-.67-1.596v-3.51a6.612 6.612 0 00-1.238-3.85 6.744 6.744 0 00-3.262-2.437v-.379c0-.59-.237-1.154-.659-1.571A2.265 2.265 0 0012 2c-.597 0-1.169.234-1.591.65a2.208 2.208 0 00-.659 1.572v.38c-2.621.915-4.5 3.385-4.5 6.287v3.51c0 .598-.24 1.172-.67 1.595L3 17.556h12.375zm0 0v1.11c0 .885-.356 1.733-.989 2.358A3.397 3.397 0 0112 22a3.397 3.397 0 01-2.386-.976 3.313 3.313 0 01-.989-2.357v-1.111h6.75z"></path>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h2 className="font-medium text-slate-700 transition-colors group-hover:text-primary group-focus:text-primary dark:text-navy-100 dark:group-hover:text-accent-light dark:group-focus:text-accent-light">Notification</h2>
                                                    <div className="text-xs text-slate-400 line-clamp-1 dark:text-navy-300">
                                                        My notification setting
                                                    </div>
                                                </div>
                                            </Link> */}
                      {/* <Link
                        to="/account/commingsoon"
                        className="group flex items-center space-x-3 py-2 px-4 tracking-wide outline-none transition-all hover:bg-slate-100 focus:bg-slate-100 dark:hover:bg-navy-600 dark:focus:bg-navy-600"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-white">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4.5 w-4.5"
                            fill="none"
                            viewBox="0 0 64 64"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <path
                              fill="#fff"
                              d="M32,64A32,32,0,1,1,64,32,32,32,0,0,1,32,64ZM32,5.33A26.67,26.67,0,1,0,58.67,32,26.71,26.71,0,0,0,32,5.33Z"
                            />
                            <path
                              fill="#fff"
                              d="M32,45.33a2.67,2.67,0,0,1-2.67-2.66,14.1,14.1,0,0,1,6.9-11.88,8,8,0,0,0,3.55-8.71A8,8,0,0,0,24,24a2.67,2.67,0,1,1-5.33,0,13.29,13.29,0,0,1,5-10.43A13.43,13.43,0,0,1,35.11,11a13.34,13.34,0,0,1,4,24.3,8.78,8.78,0,0,0-4.39,7.35A2.67,2.67,0,0,1,32,45.33Z"
                            />
                            <circle fill="#fff" cx="32" cy="50.67" r="2.67" />
                          </svg>
                        </div>
                        <div style={{textAlign: "left"}}>
                          <h2 className="font-medium text-slate-700 transition-colors group-hover:text-primary group-focus:text-primary dark:text-navy-100 dark:group-hover:text-accent-light dark:group-focus:text-accent-light">
                            Help & Contact
                          </h2>
                          <div className="text-xs text-slate-400 line-clamp-1 dark:text-navy-300">
                            Help center and contact
                          </div>
                        </div>
                      </Link> */}
                      {/* <Link to="/account/commingsoon" className="group flex items-center space-x-3 py-2 px-4 tracking-wide outline-none transition-all hover:bg-slate-100 focus:bg-slate-100 dark:hover:bg-navy-600 dark:focus:bg-navy-600">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-error text-white">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" >
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>

                                                <div>
                                                    <h2 className="font-medium text-slate-700 transition-colors group-hover:text-primary group-focus:text-primary dark:text-navy-100 dark:group-hover:text-accent-light dark:group-focus:text-accent-light" > Language </h2>
                                                    <div className="text-xs text-slate-400 line-clamp-1 dark:text-navy-300" >
                                                        Your language setting
                                                    </div>
                                                </div>
                                            </Link> */}
                      {/* <Link
                        to="/account/subscriptions-and-packaging"
                        className="group flex items-center space-x-3 py-2 px-4 tracking-wide outline-none transition-all hover:bg-slate-100 focus:bg-slate-100 dark:hover:bg-navy-600 dark:focus:bg-navy-600"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning text-white">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                          <div>
                            <img src={Icon} />
                          </div>
                        </div>

                        <div style={{textAlign: "left"}}>
                          <h2 className="font-medium text-slate-700 transition-colors group-hover:text-primary group-focus:text-primary dark:text-navy-100 dark:group-hover:text-accent-light dark:group-focus:text-accent-light">
                            Subscriptions
                          </h2>
                          <div className="text-xs text-slate-400 line-clamp-1 dark:text-navy-300">
                            Your subscription & packages
                          </div>
                        </div>
                      </Link> */}
                      {/* <Link to="/account/billingdetails" className="group flex items-center space-x-3 py-2 px-4 tracking-wide outline-none transition-all hover:bg-slate-100 focus:bg-slate-100 dark:hover:bg-navy-600 dark:focus:bg-navy-600">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success text-white">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                </div>

                                                <div>
                                                    <h2 className="font-medium text-slate-700 transition-colors group-hover:text-primary group-focus:text-primary dark:text-navy-100 dark:group-hover:text-accent-light dark:group-focus:text-accent-light">Billing & Invoices</h2>
                                                    <div className="text-xs text-slate-400 line-clamp-1 dark:text-navy-300">
                                                        Your billing details & invoices
                                                    </div>
                                                </div>
                                            </Link> */}
                      <div className="mt-3 px-4">
                        <button
                          className="btn h-9 w-full space-x-2 bg-primary text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
                          onClick={() => {
                            localStorage.setItem("loginToken", 0);
                            window.location.href = "/";
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="1.5"
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      <NestedSidebar />
      </div>
    );
  }
}

export default Sidebar;
