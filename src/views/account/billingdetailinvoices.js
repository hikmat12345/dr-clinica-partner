import React from 'react'
import swal from 'sweetalert'
import axios from 'axios'
import PlacesAutocomplete, { geocodeByAddress } from 'react-places-autocomplete'
import configData from '../../utils/constants/config.json'
import { Link } from 'react-router-dom'
import { Button } from 'antd'

export default class BillingDetails extends React.Component {
  static defaultProps = {
    center: {
      lat: 25.2048,
      lng: 55.2708,
    },
    zoom: 13,
  }

  constructor(props) {
    super(props)
    this.state = {
      partner: null,
      billingAddress: null,
      billingCard: null,
      showBillingAddressModal: false,
      showCardModal: false,
      firstname: '',
      lastname: '',
      address: '',
      city: '',
      state: '',
      postalcode: '',
      trnnumber: '',
      gmapsLoaded: false,
      cardHolderName: '',
      cardExpiry:"",
      cardnumber:"",
      cardCVV: '',
      setExpiryValue:"",
      invoiceList: [],
     }
    this.mapAdded = false
  }

  componentDidMount() {
    axios({
      method: 'get',
      url: configData.SERVER_URL + 'partner/account/geBillingDetails',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        accesstoken: configData.ACCESSTOKEN,
        logintoken: localStorage.getItem('loginToken'),
      },
    })
      .then((resp) => {
         if (parseInt(Object.keys(resp.data)[0]) === 200) {
          this.setState({
            partner: resp.data.account,
            billingAddress: resp.data.account.billingaddress[0],
          })
          if (resp.data.account.billingaddress.length > 0) {
            this.setState({
              firstname: resp.data.account.billingaddress[0].firstname,
              lastname: resp.data.account.billingaddress[0].lastname,
              address: resp.data.account.billingaddress[0].address,
              city: resp.data.account.billingaddress[0].city,
              state: resp.data.account.billingaddress[0].state,
              postalcode: resp.data.account.billingaddress[0].postalcode,
              trnnumber: resp.data.account.billingaddress[0].trnnumber,
            })
          }
          if (resp.data.account.billingcard.length > 0) {
            this.setState({
              billingCard: resp.data.account.billingcard[0],
              cardHolderName: resp.data.account.billingcard[0].name,
              cardCVV: resp.data.account.billingcard[0].cvv,
              cardExpiry:resp.data.account.billingcard[0].expiry,
              cardnumber:resp.data.account.billingcard[0].cardnumber
            })
          }
        }
      })
      .catch((err) => {
        swal({
          title: 'Server Not Responding',
          text: 'Please try again later',
          icon: 'warning',
          button: 'ok',
        })
       })
     if (!this.mapAdded) {
        this.mapAdded = true
        window.initMap = this.initMap
        const gmapScriptEl = document.createElement(`script`)
        gmapScriptEl.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCbW7sUOtCHtwO_QhbEsp8hjmlDwERkMWE&libraries=places&callback=initMap`
        document
          .querySelector(`body`)
          .insertAdjacentElement(`beforeend`, gmapScriptEl)
     }
 
    axios({
      method: 'get',
      url: configData.SERVER_URL + 'partner/invoice/getPartnerInvoice',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        accesstoken: configData.ACCESSTOKEN,
        logintoken: localStorage.getItem('loginToken'),
      },
    }).then((resp) => {
       if (parseInt(Object.keys(resp.data)[0]) === 200) {
        this.setState({
          invoiceList: resp.data.data,
        })
      } else {
        swal({
          title: 'Dashboard',
          text: resp.data[Object.keys(resp.data)[0]],
          icon: 'warning',
          button: 'ok',
        })
      }
    })
  }
  initMap = () => {
    this.setState({
      gmapsLoaded: true,
    })
  }

  handleChange = (address) => {
    this.setState({ address })
  }

  handleSelect = (address) => {
    this.setState({ address })
    document.getElementById('myAddress').value = address
    geocodeByAddress(address).then((results) => {
      console.log(results, 'map res')
      for (var i = 0; i < results[0].address_components.length; i++) {
        var addressType = results[0].address_components[i].types[0]
        if (addressType === 'locality') {
          this.setState({
            city: results[0].address_components[i].long_name,
          })
          document.getElementById('city').value =
            results[0].address_components[i].long_name
        }
        if (addressType === 'country') {
          this.setState({
            state: results[0].address_components[i].long_name,
          })
          document.getElementById('state').value =
            results[0].address_components[i].long_name
        }
      }
    })
  }

 
  handleInputChange = (event) => {
    event.preventDefault()


    if (event.target.id=="cardExpiry"){
      const sanitizedValue= event.target.value.replace("/", "")
      let formattedValue = sanitizedValue;
      if (sanitizedValue.length >= 2) {
        formattedValue = `${sanitizedValue.slice(0, 2)}/${sanitizedValue.slice(2)}`;
      }
      this.setState({
        [event.target.id]: formattedValue,
      })
    } else {
      this.setState({
        [event.target.id]: event.target.value,
      })
    }



     
  }

  handleModalShow = (e) => {
    e.preventDefault()
    this.setState({
      [e.target.id]: true,
    })
  }

  handleModalHide = (e) => {
    e.preventDefault()
    this.setState({
      [e.currentTarget.id]: false,
    })
  }

  saveBillingAddress = (e) => {
    e.preventDefault()
    if (this.state.firstname === '') {
      document.getElementById('firstname').focus()
      return
    }
    if (this.state.lastname === '') {
      document.getElementById('lastname').focus()
      return
    }
    if (this.state.address === '') {
      document.getElementById('address').focus()
      return
    }
    if (this.state.postalcode === '') {
      document.getElementById('postalcode').focus()
      return
    }
    var bodyFormData = new URLSearchParams()
    bodyFormData.append('firstname', this.state.firstname)
    bodyFormData.append('lastname', this.state.lastname)
    bodyFormData.append('address', this.state.address)
    bodyFormData.append('city', this.state.city)
    bodyFormData.append('state', this.state.state)
    bodyFormData.append('postalcode', this.state.postalcode)
    bodyFormData.append('trnnumber', this.state.trnnumber)
    axios({
      method: 'post',
      url: configData.SERVER_URL + 'partner/account/saveBillingDetails',
      data: bodyFormData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        accesstoken: configData.ACCESSTOKEN,
        logintoken: localStorage.getItem('loginToken'),
      },
    })
      .then((resp) => {
        if (parseInt(Object.keys(resp.data)[0]) === 200) {
          this.setState({
            showBillingAddressModal: false,
            billingAddress: resp.data.billingaddress,
          })
        } else {
          swal({
            title: 'Credit card detail Information',
            text: resp.data[Object.keys(resp.data)[0]],
            icon: 'warning',
            button: 'ok',
          })
        }
      })
      .catch((err) => {
        swal({
          title: 'Server Not Responding',
          text: 'Please try again later',
          icon: 'warning',
          button: 'ok',
        })
       })
  }

  saveBillingCard = (e) => {
    e.preventDefault()
    console.log(this.state, 'this.statethis.state')
     if (this.state.cardHolderName === '') {
      document.getElementById('cardHolderName').focus()
      return
    }
    if (document.getElementById('cardnumber').value === '') {
      document.getElementById('cardnumber').focus()
      return
    }
    if (document.getElementById('cardExpiry').value === '') {
      document.getElementById('cardExpiry').focus()
      return
    }
    if (this.state.cardCVV === '') {
      document.getElementById('cardCVV').focus()
      return
    }
    var bodyFormData = new URLSearchParams()
    bodyFormData.append('name', this.state.cardHolderName)
    bodyFormData.append('cardnumber',  document.getElementById('cardnumber').value,  )
    bodyFormData.append('cardExpiry', document.getElementById('cardExpiry').value)
    bodyFormData.append('cvv', this.state.cardCVV)
    bodyFormData.append('isdefault', 1)
    axios({
      method: 'post',
      url: configData.SERVER_URL + 'partner/account/createCard',
      data: bodyFormData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        accesstoken: configData.ACCESSTOKEN,
        logintoken: localStorage.getItem('loginToken'),
      },
    })
      .then((resp) => {
        if (parseInt(Object.keys(resp.data)[0]) === 200) {
          this.setState({
            showCardModal: false,
            billingCard: resp.data.card,
          })
        } else {
          swal({
            title: 'Billing Address Information',
            text: resp.data[Object.keys(resp.data)[0]],
            icon: 'warning',
            button: 'ok',
          })
        }
      })
      .catch((err) => {
        swal({
          title: 'Server Not Responding',
          text: 'Please try again later',
          icon: 'warning',
          button: 'ok',
        })
       })
  }

  render() {
    return (
      <main className="main-content px-[var(--margin-x)] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6">
          <h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">
            Billing Details
          </h2>
          <div className="hidden h-full py-1 sm:flex">
            <div className="h-full w-px bg-slate-300 dark:bg-navy-600"></div>
          </div>
          <ul className="hidden flex-wrap items-center space-x-2 sm:flex">
            <li className="flex items-center space-x-2">
              <a
                className="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent"
                href="/settings"
              >
                Settings
              </a>
              <svg
                x-ignore
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </li>
            <li>Billing Details</li>
          </ul>
        </div>
        <div className="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6 text-left p-4">
          <div className="col-span-12 sm:col-span-6 ml-4 pl-4">
            <div className="card px-4 py-4 sm:px-5">
              <div className="m-2">
                <h2 className="text-lg font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">
                  Billing address
                </h2>
              </div>
              <div className="m-2">
                <p>
                  Add or edit your default billing details to display on monthly
                  invoice from Dr. Clinica
                </p>
              </div>
              <div className="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>
              {this.state.billingAddress == null ? (
                <div className="m-2">
                  <p className="my-1">Please set up your billing address</p>
                  <br />
                  <p></p>
                  <br />
                </div>
              ) : (
                <div className="m-2">
                  <h4 className="text-lg font-semibold">
                    {this.state.billingAddress.firstname}{' '}
                    {this.state.billingAddress.lastname}
                  </h4>
                  <p>{this.state.billingAddress.address}</p>
                  <p>
                    {this.state.billingAddress.city},{' '}
                    {this.state.billingAddress.state},{' '}
                    {this.state.billingAddress.postalcode}
                  </p>
                </div>
              )}
              <div className="m-2">
                <button
                  className="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent"
                  id="showBillingAddressModal"
                  onClick={this.handleModalShow}
                >
                  Edit billing address
                </button>
              </div>
            </div>
          </div>
          <div className="col-span-12 sm:col-span-6 mr-4 pr-4">
            <div className="card px-4 py-4 sm:px-5">
              <div className="m-2">
                <h2 className="text-lg font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">
                  Default payment method
                </h2>
              </div>
              <div className="m-2">
                <p>
                  Add or edit your default payment method for Dr. Clinica fees
                  and purchases around the globe.
                </p>
              </div>
              <div className="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>
              {this.state.billingCard == null ? (
                <div className="m-2">
                  <p className="my-1">Please set up your payment method</p>
                  <br />
                  <p></p>
                  <br />
                </div>
              ) : (
                <div className="flex m-2 pt-3 pb-2">
                  <div className="avatar h-12 w-12 mr-2">
                    <img
                      className="rounded-lg"
                      src="/images/credit-card.png"
                      alt="avatar"
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">
                      {this.state.billingCard.cardmask}
                    </h4>
                    <p>Expiry: {this.state.billingCard.expiry}</p>
                  </div>
                </div>
              )}
              <div className="m-2">
                <button
                  className="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent"
                  id="showCardModal"
                  onClick={this.handleModalShow}
                >
                  Manage Payment Method
                </button>
              </div>
            </div>
          </div>
          {/* show invocie list  */}
          <div className="col-span-12 sm:col-span-12 mx-4 pl-4">
            <div className="card px-4 py-4 sm:px-5">
              <div className="m-2">
                <h2 className="text-lg font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">
                  Billing Invoice List
                </h2>
              </div>
              {/* table start  */}
              <div className="container  px-4 sm:px-8">
                <div className="py-8">
                  <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                    <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                      <table className="min-w-full leading-normal">
                        <thead>
                          <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              City
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Country
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              address
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              createdon
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              paymentDate
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              paymentMethod
                            </th>

                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
                          </tr>
                        </thead>
                        <tbody>
                           {this.state.invoiceList?.map((row) => {
                            return (
                              <tr>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                  <div className="flex">
                                    <div className="ml-3">
                                      <p className="text-gray-900 whitespace-no-wrap">
                                        {row?.city}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                  <p className="text-gray-900 whitespace-no-wrap">
                                    {row?.country}
                                  </p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                  <p className="text-gray-900 whitespace-no-wrap">
                                    {row?.address}
                                  </p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                  <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                    <span
                                      aria-hidden
                                      className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                                    ></span>
                                    {row?.status == 0 ? (
                                      <span className="relative">Paid</span>
                                    ) : (
                                      <span className="relative">Pending</span>
                                    )}
                                  </span>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                  <p className="text-gray-900 whitespace-no-wrap">
                                    {row?.createdon?.split('T')[0]}
                                  </p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                  <p className="text-gray-900 whitespace-no-wrap">
                                    {row?.paymentDate}
                                  </p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                  <p className="text-gray-900 whitespace-no-wrap">
                                    {row?.paymentMethod}
                                  </p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                                  <Link
                                    to={`/account/billingdetails/invoice-detail?status=${row?.status}`}
                                    className="inline-block text-gray-500 hover:text-gray-700"
                                  >
                                    More Detail
                                  </Link>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                      {/* if not exist  */}
                      {this.state.invoiceList.length == 0 && (
                        <div className="m-2 text-center mt-4 pt-4">
                          <i className="fas fa-file fa-6x"></i>
                          <h2 className="text-2xl font-semibold">
                            No Record Found
                          </h2>
                          <div className="m-2">
                            <p>
                              Your monthly invoices and fees will appear here
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {this.state.showBillingAddressModal ? (
          <div
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
            role="dialog"
          >
            <div
              className="absolute inset-0 bg-slate-900/60 backdrop-blur transition-opacity duration-300"
              id="showBillingAddressModal"
              onClick={this.handleModalHide}
            ></div>
            <div className="relative w-full max-w-2xl origin-bottom rounded-lg bg-white pb-4 transition-all duration-300 dark:bg-navy-700">
              <div className="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
                <h3 className="text-base font-medium text-slate-700 dark:text-navy-100">
                  Edit Billing Address
                </h3>
                <button
                  className="btn -mr-1.5 h-7 w-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                  id="showBillingAddressModal"
                  onClick={this.handleModalHide}
                >
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
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
              <div className="is-scrollbar-hidden min-w-full overflow-x-auto">
                <div className="space-y-4 p-4 sm:p-5 text-left">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span>First Name*</span>
                      <input
                        className="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                        placeholder="First Name"
                        type="text"
                        id="firstname"
                        value={this.state.firstname}
                        onChange={this.handleInputChange}
                      />
                    </label>
                    <label className="block">
                      <span>Last Name*</span>
                      <input
                        className="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                        placeholder="Last Name"
                        type="text"
                        id="lastname"
                        value={this.state.lastname}
                        onChange={this.handleInputChange}
                      />
                    </label>
                  </div>
                  {this.state.gmapsLoaded && (
                    <PlacesAutocomplete
                      value={this.state.address}
                      onChange={this.handleChange}
                      onSelect={this.handleSelect}
                    >
                      {({
                        getInputProps,
                        suggestions,
                        getSuggestionItemProps,
                        loading,
                      }) => (
                        <div className="block">
                          <input
                            {...getInputProps({
                              placeholder: 'Search Places ...',
                              className:
                                'location-search-input form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2',
                              id: 'address',
                            })}
                          />
                          <div
                            className="autocomplete-dropdown-container"
                            id="overlay"
                          >
                            {loading && <div>Loading...</div>}
                            {suggestions.map((suggestion) => {
                              const className = suggestion.active
                                ? 'suggestion-item--active'
                                : 'suggestion-item'
                              // inline style for demonstration purpose
                              const style = suggestion.active
                                ? {
                                    backgroundColor: '#fafafa',
                                    cursor: 'pointer',
                                    padding: '5px',
                                  }
                                : {
                                    backgroundColor: '#ffffff',
                                    cursor: 'pointer',
                                    padding: '5px',
                                  }
                              return (
                                <div
                                  {...getSuggestionItemProps(suggestion, {
                                    className,
                                    style,
                                  })}
                                >
                                  <span>{suggestion.description}</span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </PlacesAutocomplete>
                  )}
                  <label className="block">
                    <span>Address*</span>
                    <input
                      className="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                      placeholder="Address"
                      type="text"
                      id="myAddress"
                      value={this.state.address}
                      readOnly
                    />
                  </label>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <label className="block">
                      <span>City*</span>
                      <input
                        className="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                        placeholder="City"
                        type="text"
                        id="city"
                        value={this.state.city}
                        onChange={this.handleInputChange}
                      />
                    </label>
                    <label className="block">
                      <span>State*</span>
                      <input
                        className="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                        placeholder="State"
                        type="text"
                        id="state"
                        value={this.state.state}
                        onChange={this.handleInputChange}
                      />
                    </label>
                    <label className="block">
                      <span>Post Code*</span>
                      <input
                        className="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                        placeholder="Post Code"
                        type="text"
                        id="postalcode"
                        value={this.state.postalcode}
                        onChange={this.handleInputChange}
                      />
                    </label>
                  </div>
                  <label className="block">
                    <span>TRN Number</span>
                    <input
                      className="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                      placeholder="TRN Numnber"
                      type="text"
                      id="trnnumber"
                      value={this.state.trnnumber}
                      onChange={this.handleInputChange}
                    />
                  </label>
                </div>
              </div>
              <div className="text-center">
                <button
                  className="btn bg-primary btn-color from-sky-400 to-blue-600 font-medium text-white"
                  onClick={this.saveBillingAddress}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        ) : null}
        {this.state.showCardModal ? (
          <div
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
            role="dialog"
          >
            <div
              className="absolute inset-0 bg-slate-900/60 backdrop-blur transition-opacity duration-300"
              id="showCardModal"
              onClick={this.handleModalHide}
            ></div>
            <div className="relative w-full max-w-2xl origin-bottom rounded-lg bg-white pb-4 transition-all duration-300 dark:bg-navy-700">
              <div className="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
                <h3 className="text-base font-medium text-slate-700 dark:text-navy-100">
                  Credit Card Details
                </h3>
                <button
                  className="btn -mr-1.5 h-7 w-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                  id="showCardModal"
                  onClick={this.handleModalHide}
                >
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
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
              <form  onSubmit={this.saveBillingCard}>
                <div className="is-scrollbar-hidden min-w-full overflow-x-auto">
                  <div className="space-y-4 p-4 sm:p-5 text-left">
                    <label className="block">
                      <span>Card holder full name*</span>
                      <input
                        className="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                        placeholder="Enter card holder name"
                        type="text"
                        id="cardHolderName"
                        value={this.state.cardHolderName}
                        onChange={this.handleInputChange}
                      />
                    </label>
                    <div>
                      <span>Card number*</span>
                      <label className="mt-1 flex -space-x-px">
                        <input
                          // x-input-mask="{creditCard: true}"

                          className="form-input w-full rounded-l-lg border border-slate-300 bg-transparent px-3.5 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                          placeholder="xxxx xxxx xxxx xxxx"
                          type="tel"
                          maxLength={16}
                          minLength={16}
                          id="cardnumber"
                          value={this.state.cardnumber}
                          onChange={this.handleInputChange}
                        />
                        <div className="flex items-center justify-center rounded-r-lg border border-slate-300 bg-slate-150 px-3.5 font-inter text-slate-800 dark:border-navy-450 dark:bg-navy-500 dark:text-navy-100">
                          <span>
                            <i className="fa fa-credit-card" aria-hidden="true"></i>
                          </span>
                        </div>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span>Expiry Date*</span>
                        <input
                          // x-input-mask="{delimiters: ['/'],blocks: [2, 2], number:true}"
                          className="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                          placeholder="Example: xx/xx (Month/Year)"
                          maxLength={5}

                          type="text"
                            id="cardExpiry"
                          value={this.state.cardExpiry}
                          onChange={this.handleInputChange}
                        />
                      </label>
                      <label className="block">
                        <span>CVV*</span>
                        <input
                          className="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                          placeholder="Enter cvv"
                          type="number"
                          maxLength={4}
                          minLength={3}
                          id="cardCVV" 
                          // value={this.state.cardCVV}
                          onChange={this.handleInputChange}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <button
                    className="btn bg-primary btn-color from-sky-400 to-blue-600 font-medium text-white"
                    type='submit' >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : null}
      </main>
    )
  }
}
