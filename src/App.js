import "./App.css";
import React from "react";
import swal from "sweetalert";
import axios from "axios";
import configData from "./utils/constants/config.json";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/********** Components *********/
import Navbar from "./components/navbar/navbar";
import Footer from "./components/footer/footer";
import Sidebar from "./components/sidebar/Sidebar/sidebar";
import RightSidebar from "./components/sidebar/rightsidebar";
import MobileSearchBar from "./components/searchbar/mobilesearchbar";
import { BusinessProvider } from "./utils/helpers/businesscontext";

/********** Main Screens *********/
import Dashboard from "./views/dashboard/dashboard";
import Login from "./views/auth/login";
import Registration from "./views/auth/registration";
import BusinessSetup from "./views/profile/businesssetup";
import Products from "./views/products/products";
import BusinessSettings from "./views/settings/businesssettings";
import CommingSoon from "./views/commingsoon";
import Service from "./views/service/service";
import AddNewService from "./views/service/addnewservice";
import TeamMember from "./views/team/teammember";
import AddNewTeamMember from "./views/team/addteammember";
import WorkingHours from "./views/team/workinghour";
import Commission from "./views/team/commission";
import BusinessDetails from "./views/account/businessdetails";
import BillingDetails from "./views/account/billingdetailinvoices";
import BankAccount from "./views/account/bankaccount";
import TextMessages from "./views/account/textmessage";
import Locations from "./views/branch/location";
import OnlineBooking from "./views/account/onlinebooking";
import AddBranch from "./views/branch/addbranch";
import EditBranch from "./views/branch/editbranch";
import BookingFees from "./views/account/bookingfees";
import ClosingDates from "./views/branch/closingdates";
import EditTeamMember from "./views/team/editteammember";
import EditService from "./views/service/editservice";
import Tax from "./views/sales/tax";
import InvoiceSequencing from "./views/sales/invoicesequencing";
import InvoiceTemplate from "./views/sales/invoicetemplate";
import ServiceCharge from "./views/sales/servicecharge";
import PaymentTypes from "./views/sales/paymenttypes";
import NotificationSettings from "./views/clients/notificationsettings";
import ReferralSources from "./views/clients/referralsources";
import CancellationReasons from "./views/clients/cancellationreasons";
import Vouchers from "./views/vouchers/vouchers";
import AddVoucher from "./views/vouchers/addvoucher";
import EditVoucher from "./views/vouchers/editvoucher";
import VoucherSettigns from "./views/vouchers/vouchersettings";
import Appointmet from "./views/appointments/appointment";
import PrivacyPolicy from "./views/staticpages/termsandconditions";
import Profile from "./views/profile/profile";
import Scanner from "./views/appointments/scanner";
import ViewAppointOld from "./views/appointments/viewappointment";
import SubscriptionsAndPackaging from "./views/account/subscriptionsAndPackaging";
import AddAppointment from "./Pages/AddAppointment/AddAppointment";
import Emailnotificationsetting from "./views/clients/emailnotificationsetting";
import CalendarBackup from "./views/calendar/calendarBackup";
import Calendar from "./views/calendar/calendar";
import Discount from "./views/discounts/discounts";
import ViewAppointment from "./Pages/ViewAppointment/ViewAppointment";
import EditApointment from "./Pages/EditAppointment/EditApointment";
import PartnerPrivacyPolicy from "./views/staticpages/privacypolicy";
import ClientList from "./views/clients/clientlist";
import Invoicedetail from "./views/account/invoicedetail";
import AppoitmentListing from "./views/appointments/appointmentListing"
import Reviews from "./views/clients/reviews";
import ServiceProviderReviews from "./views/team/ServiceProviderReviews";
import PaymentTransactions from "./views/sales/paymentTransactions"
import SoldVouchers from "./views/sales/soldVouchers"
import StripeComplete from "./views/account/stripecomplete";
import Offers from "./views/offers/offers";
import Coupons from "./views/coupons/coupons";
import ClientDetail from "./views/clients/client-detail";
import Paymentsuccess from "./views/payment/paymentsuccess";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      business: null,
      loggedIn: false,
    };
  }

  componentDidMount() {
    const savedToken = localStorage.getItem("loginToken");
    if (savedToken) {
      axios({
        method: "get",
        url: configData.SERVER_URL + "partner/authetication/verifyToken",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          accesstoken: configData.ACCESSTOKEN,
          logintoken: savedToken,
        },
      })
        .then((resp) => {
          console.log(resp.data);
          if (parseInt(Object.keys(resp.data)[0]) === 200) {
            this.setState({
              loggedIn: true,
              user: resp.data.partner,
              business: resp.data.business,
            });
            // if (resp.data.business != null && (window.location.host.split('.'))[0] != resp.data.business.subdomain && (window.location.host.split('.'))[0] != "") {
            //   window.location.href = `http://${resp.data.business.subdomain}.${configData.DOMAIN}/`
            // }
          } else {
            if (
              window.location.pathname != "/" &&
              window.location.pathname != "/registration" &&
              window.location.pathname != "/privacypolicy" &&
              window.location.pathname != "/terms-&-condition" &&
              window.location.pathname != "/stripecomplete"
              // window.location.pathname.split('/')[1] != 'viewappointment'
            ) {
              window.location = "/";
            }
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

  render() {
    return (
      <>
        <BusinessProvider value={this.state.business}>
          <div className="App">
            <Router>
              {this.state.loggedIn && this.state.business != null ? (
                <Navbar />
              ) : null}
              {this.state.loggedIn && this.state.business != null ? (
                <Sidebar user={this.state.user} />
              ) : null}
              {this.state.loggedIn && this.state.business != null ? (
                <MobileSearchBar />
              ) : null}
              {this.state.loggedIn && this.state.business != null ? (
                <RightSidebar />
              ) : null}
              {this.state.loggedIn && this.state.business != null ? (
                <Footer />
              ) : null}
              {this.state.loggedIn ? (
                this.state.business == null ? (
                  <Routes>
                    <Route path="" element={<BusinessSetup />} />
                  </Routes>
                ) : (
                  <Routes>
                    <Route path="" element={<Dashboard />} />
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/sales/discounts" element={<Discount />} />

                    <Route
                      path="/calendarBackup"
                      element={<CalendarBackup />}
                    />
                    <Route
                      path="/calendar/addappointment"
                      element={<AddAppointment />}
                    />
                    <Route
                      path="/sales/appointments/listing"
                      element={<AppoitmentListing />}
                    />
                    <Route
                      path="/account/billingdetails/invoice-detail"
                      element={<Invoicedetail />}
                    />
                    <Route
                      path="/calendar/Appointment"
                      element={<Appointmet />}
                    />
                    <Route path="/settings" element={<BusinessSettings />} />
                    <Route path="/account/profile" element={<Profile />} />
                    <Route path="/services/servicelist" element={<Service />} />
                    <Route
                      path="/services/addnewservice"
                      element={<AddNewService />}
                    />
                    <Route
                      path="/services/editservice"
                      element={<EditService />}
                    />
                    <Route path="/services/products" element={<Products />} />
                    <Route
                      path="/services/vouchers"
                      element={<Vouchers business={this.state.business} />}
                    />
                    <Route
                      path="/services/addvoucher"
                      element={<AddVoucher business={this.state.business} />}
                    />
                    <Route
                      path="/services/editvoucher"
                      element={<EditVoucher business={this.state.business} />}
                    />
                    <Route
                      path="/services/vouchersettings"
                      element={
                        <VoucherSettigns business={this.state.business} /> }
                    />
                    <Route path="/team/teammember" element={<TeamMember />} />
                    <Route path="/team/provider-reviews" element={<ServiceProviderReviews />} />
                    <Route path="/promotions/offers" element={<Offers />} />
                    <Route path="/promotions/coupons" element={<Coupons />} />
                    <Route
                      path="/team/addnewteammember"
                      element={<AddNewTeamMember />}
                    />
                    <Route
                      path="/calendar/viewappointment/:id"
                      element={<ViewAppointment />}
                    />
                    <Route
                      path="/team/editteammember"
                      element={<EditTeamMember />}
                    />
                    <Route
                      path="/team/workinghours"
                      element={<WorkingHours />}
                    />
                    <Route
                      path="/team/workinghours"
                      element={<WorkingHours />}
                    />
                    <Route path="/team/commission" element={<Commission />} />
                    <Route
                      path="/account/businessdetails"
                      element={<BusinessDetails />}
                    />
                    <Route
                      path="/account/subscriptions-and-packaging"
                      element={<SubscriptionsAndPackaging />}
                    />
                    <Route
                      path="/account/billingdetails"
                      element={<BillingDetails />}
                    />
                    <Route
                      path="/account/bankaccount"
                      element={<BankAccount />}
                    />
                    <Route
                      path="/account/textmessages"
                      element={<TextMessages />}
                    />
                    <Route path="/account/locations" element={<Locations />} />
                    <Route
                      path="/account/onlinebooking"
                      element={<OnlineBooking />}
                    />
                    <Route path="/account/addbranch" element={<AddBranch />} />
                    <Route
                      path="/account/editbranch"
                      element={<EditBranch />}
                    />
                    <Route
                      path="/account/bookingfees"
                      element={<BookingFees />}
                    />
                    <Route
                      path="/account/closingdates"
                      element={<ClosingDates />}
                    />
                    <Route path="/commingsoon" element={<CommingSoon />} />
                    <Route
                      path="/services/commingsoon"
                      element={<CommingSoon />}
                    />
                    <Route path="/team/commingsoon" element={<CommingSoon />} />
                    <Route
                      path="/clients/notificationsettings"
                      element={<NotificationSettings />}
                    />
                    <Route
                      path="/payment-success"
                      element={<Paymentsuccess />}
                    />
                     <Route
                      path="/clients/detail"
                      element={<ClientDetail />}
                    />
                    <Route
                      path="/clients/reviews"
                      element={<Reviews />}
                    />
                    <Route path="/clients/" element={<ClientList />} />
                    <Route
                      path="/clients/emailnotificationsetting"
                      element={<Emailnotificationsetting />}
                    />
                    <Route
                      path="/clients/referralsources"
                      element={<ReferralSources />}
                    />
                    <Route
                      path="/clients/cancelationreasons"
                      element={<CancellationReasons />}
                    />
                    <Route
                      path="/sales/transactions"
                      element={<PaymentTransactions />}
                    />
                    <Route
                      path="/sales/soldvouchers"
                      element={<SoldVouchers />}
                    />
                    <Route path="/sales/tax" element={<Tax />} />
                    <Route
                      path="/sales/invoicsequencing"
                      element={<InvoiceSequencing />}
                    />
                    <Route
                      path="/sales/invoictemplate"
                      element={<InvoiceTemplate />}
                    />
                    <Route
                      path="/sales/servicecharge"
                      element={<ServiceCharge />}
                    />
                    <Route
                      path="/sales/paymenttypes"
                      element={<PaymentTypes />}
                    />
                    <Route
                      path="/account/commingsoon"
                      element={<CommingSoon />}
                    />
                    <Route
                      path="/viewappointment/editappointment"
                      element={<EditApointment />}
                    />
                    <Route
                      path="/viewappointment/:id"
                      element={<ViewAppointOld />}
                    />
                  </Routes>
                )
              ) : (
                <Routes>
                  <Route path="" element={<Login />} />
                  <Route path="/registration" element={<Registration />} />
                  <Route path="/privacypolicy" element={<PrivacyPolicy />} />
                  <Route path="/stripecomplete" element={<StripeComplete />} />
                  <Route
                    path="/terms-&-condition"
                    element={<PartnerPrivacyPolicy />}
                  />
                </Routes>
              )}
            </Router>
          </div>
        </BusinessProvider>
      </>
    );
  }
}
