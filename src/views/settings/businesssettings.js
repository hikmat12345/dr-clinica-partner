import React from 'react'
import { Link } from 'react-router-dom'

export default class BusinessSettings extends React.Component {
  constructor(props) {
    super(props)
  }
 
  render() {
    return (
      <main class="main-content px-[var(--margin-x)] pb-8">
        <div class="flex items-center space-x-4 py-5 lg:py-6">
          <h2 class="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">
            Business Settings
          </h2>
          <div class="hidden h-full py-1 sm:flex">
            <div class="h-full w-px bg-slate-300 dark:bg-navy-600"></div>
          </div>
          <ul class="hidden flex-wrap items-center space-x-2 sm:flex">
            <li class="flex items-center space-x-2">
              <Link
                class="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent"
                to="/settings"
              >
                Settings
              </Link>
              <svg
                x-ignore
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
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
            <li>Business Settings</li>
          </ul>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2 lg:gap-6">
          <div class="sm:px-5">
            <div class="card px-4 py-4">
              <div>
                <h1 class="text-lg font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100 text-left">
                  Account Setup
                </h1>
              </div>
              <div class="pt-2">
                <div class="pb-4">
                  <Link to="/account/businessdetails">
                    <div class="mt-2 flex h-8 justify-between">
                      <h2 class="font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100 lg:text-base">
                        Business details
                      </h2>
                      <label class="flex items-center space-x-2">
                        <span class="text-xs text-slate-400 dark:text-navy-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
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
                        </span>
                      </label>
                    </div>
                    <div class="max-w-xl text-left">
                      <p>Manage such as your business name and time zone</p>
                    </div>
                  </Link>
                </div>
                <div class="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>

                <div class="pb-4">
                  <Link to="/account/billingdetails">
                    <div class="mt-2 flex h-8 justify-between">
                      <h2 class="font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100 lg:text-base">
                        Billing details and invoices
                      </h2>
                      <label class="flex items-center space-x-2">
                        <span class="text-xs text-slate-400 dark:text-navy-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
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
                        </span>
                      </label>
                    </div>
                    <div class="max-w-xl text-left">
                      <p>
                        View your fee activity and invoices from Dr. Clinica and
                        manage your billing information
                      </p>
                    </div>
                  </Link>
                </div>
                <div class="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>

                <div class="pb-4">
                  <Link to="/account/bankaccount">
                    <div class="mt-2 flex h-8 justify-between">
                      <h2 class="font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100 lg:text-base">
                        Bank accounts
                      </h2>
                      <label class="flex items-center space-x-2">
                        <span class="text-xs text-slate-400 dark:text-navy-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
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
                        </span>
                      </label>
                    </div>
                    <div class="max-w-xl text-left">
                      <p>
                        Manage the bank account you would like payouts to be
                        sent to
                      </p>
                    </div>
                  </Link>
                </div>
                <div class="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>

                {/* <div class="pb-4">
                            <Link to="/account/textmessages">
                                <div class="mt-2 flex h-8 justify-between">
                                    <h2 class="font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100 lg:text-base">
                                        Text messages
                                    </h2>
                                    <label class="flex items-center space-x-2">
                                        <span class="text-xs text-slate-400 dark:text-navy-300">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </span>
                                    </label>
                                </div>
                                <div class="max-w-xl text-left">
                                    <p>Manage your text message balance and automatic top-ups</p>
                                </div>
                            </Link>
                        </div>
                        <div class="my-1 h-px bg-slate-150 dark:bg-navy-500"></div> */}

                <div class="pb-4">
                  <Link to="/account/locations">
                    <div class="mt-2 flex h-8 justify-between">
                      <h2 class="font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100 lg:text-base">
                        Branches
                      </h2>
                      <label class="flex items-center space-x-2">
                        <span class="text-xs text-slate-400 dark:text-navy-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
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
                        </span>
                      </label>
                    </div>
                    <div class="max-w-xl text-left">
                      <p>Manage branches for your business</p>
                    </div>
                  </Link>
                </div>
                <div class="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>

                <div class="pb-4">
                  <Link to="/account/onlinebooking">
                    <div class="mt-2 flex h-8 justify-between">
                      <h2 class="font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100 lg:text-base">
                        Online booking
                      </h2>
                      <label class="flex items-center space-x-2">
                        <span class="text-xs text-slate-400 dark:text-navy-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
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
                        </span>
                      </label>
                    </div>
                    <div class="max-w-xl text-left">
                      <p>
                        Adjust your business info and profile images displayed
                        online
                      </p>
                    </div>
                  </Link>
                </div>
                <div class="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>

                <div class="pb-4">
                  <Link to="/account/bookingfees">
                    <div class="mt-2 flex h-8 justify-between">
                      <h2 class="font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100 lg:text-base">
                        Deposits and cancellation fees
                      </h2>
                      <label class="flex items-center space-x-2">
                        <span class="text-xs text-slate-400 dark:text-navy-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
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
                        </span>
                      </label>
                    </div>
                    <div class="max-w-xl text-left">
                      <p>Avoid no-shows with deposits and cancellation fees</p>
                    </div>
                  </Link>
                </div>
                <div class="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>

                {/* <div class="pb-4">
                            <Link to="/account/commingsoon">
                                <div class="mt-2 flex h-8 justify-between">
                                    <h2 class="font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100 lg:text-base">
                                        Resources
                                    </h2>
                                    <label class="flex items-center space-x-2">
                                        <span class="text-xs text-slate-400 dark:text-navy-300">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </span>
                                    </label>
                                </div>
                                <div class="max-w-xl text-left">
                                    <p>Set up bookable resources such as rooms and equipment and assign them to services</p>
                                </div>
                            </Link>
                        </div>
                        <div class="my-1 h-px bg-slate-150 dark:bg-navy-500"></div> */}

                <div class="pb-4">
                  <Link to="/account/closingdates">
                    <div class="mt-2 flex h-8 justify-between">
                      <h2 class="font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100 lg:text-base">
                        Closed dates
                      </h2>
                      <label class="flex items-center space-x-2">
                        <span class="text-xs text-slate-400 dark:text-navy-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
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
                        </span>
                      </label>
                    </div>
                    <div class="max-w-xl text-left">
                      <p>Set the dates when your business is closed</p>
                    </div>
                  </Link>
                </div>
                <div class="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>
              </div>
            </div>

            <div class="card px-4 py-4 mt-4">
              <div>
                <h1 class="text-lg font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100 text-left">
                  Service Providers
                </h1>
              </div>
              <div class="pt-2">
                <div class="pb-4">
                  <Link to="/team/teammember">
                    <div class="mt-2 flex h-8 justify-between">
                      <h2 class="font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100 lg:text-base">
                        Service providers
                      </h2>
                      <label class="flex items-center space-x-2">
                        <span class="text-xs text-slate-400 dark:text-navy-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
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
                        </span>
                      </label>
                    </div>
                    <div class="max-w-xl text-left">
                      <p>Add, edit and delete your service providers</p>
                    </div>
                  </Link>
                </div>
                <div class="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>

                <div class="pb-4">
                  <Link to="/team/workinghours">
                    <div class="mt-2 flex h-8 justify-between">
                      <h2 class="font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100 lg:text-base">
                        Working hours
                      </h2>
                      <label class="flex items-center space-x-2">
                        <span class="text-xs text-slate-400 dark:text-navy-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
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
                        </span>
                      </label>
                    </div>
                    <div class="max-w-xl text-left">
                      <p>Manage working hours of your service providers</p>
                    </div>
                  </Link>
                </div>
                <div class="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>
            {/* 
                <div class="pb-4">
                  <Link to="/team/commingsoon">
                    <div class="mt-2 flex h-8 justify-between">
                      <h2 class="font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100 lg:text-base">
                        Permissions
                      </h2>
                      <label class="flex items-center space-x-2">
                        <span class="text-xs text-slate-400 dark:text-navy-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
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
                        </span>
                      </label>
                    </div>
                    <div class="max-w-xl text-left">
                      <p>
                        Configure level of access to Dr. Clinica for each of
                        your service providers
                      </p>
                    </div>
                  </Link>
                </div>
                <div class="my-1 h-px bg-slate-150 dark:bg-navy-500"></div> */}

                {/* <div class="pb-4">
                  <Link to="/team/commission">
                    <div class="mt-2 flex h-8 justify-between">
                      <h2 class="font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100 lg:text-base">
                        Commissions
                      </h2>
                      <label class="flex items-center space-x-2">
                        <span class="text-xs text-slate-400 dark:text-navy-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
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
                        </span>
                      </label>
                    </div>
                    <div class="max-w-xl text-left">
                      <p>
                        Set up the calculation of commissions for your service
                        providers
                      </p>
                    </div>
                  </Link>
                </div> */}
                <div class="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>
              </div>
            </div>

            <div class="card px-4 py-4 mt-4">
              <div>
                <h1 class="text-lg font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100 text-left">
                  Services
                </h1>
              </div>
              <div class="pt-2">
                <div class="pb-4">
                  <Link to="/services/servicelist">
                    <div class="mt-2 flex h-8 justify-between">
                      <h2 class="font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100 lg:text-base">
                        Services menu
                      </h2>
                      <label class="flex items-center space-x-2">
                        <span class="text-xs text-slate-400 dark:text-navy-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
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
                        </span>
                      </label>
                    </div>
                    <div class="max-w-xl text-left">
                      <p>
                        Add, edit and delete the types of services available for
                        appointment bookings
                      </p>
                    </div>
                  </Link>
                </div>
                <div class="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>

                <div class="pb-4">
                  <Link to="/services/vouchers">
                    <div class="mt-2 flex h-8 justify-between">
                      <h2 class="font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100 lg:text-base">
                        Vouchers
                      </h2>
                      <label class="flex items-center space-x-2">
                        <span class="text-xs text-slate-400 dark:text-navy-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
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
                        </span>
                      </label>
                    </div>
                    <div class="max-w-xl text-left">
                      <p>
                        Add, edit and delete the types of vouchers available for
                        sale
                      </p>
                    </div>
                  </Link>
                </div>
                <div class="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>

                {/* <div class="pb-4">
                            <Link to="/services/commingsoon">
                                <div class="mt-2 flex h-8 justify-between">
                                    <h2 class="font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100 lg:text-base">
                                        Memberships
                                    </h2>
                                    <label class="flex items-center space-x-2">
                                        <span class="text-xs text-slate-400 dark:text-navy-300">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </span>
                                    </label>
                                </div>
                                <div class="max-w-xl text-left">
                                    <p>Add, edit and delete multi session memberships available for sale</p>
                                </div>
                            </Link>
                        </div>
                        <div class="my-1 h-px bg-slate-150 dark:bg-navy-500"></div> */}

                <div class="pb-4">
                  <Link to="/services/vouchersettings">
                    <div class="mt-2 flex h-8 justify-between">
                      <h2 class="font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100 lg:text-base">
                        Voucher settings
                      </h2>
                      <label class="flex items-center space-x-2">
                        <span class="text-xs text-slate-400 dark:text-navy-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
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
                        </span>
                      </label>
                    </div>
                    <div class="max-w-xl text-left">
                      <p>
                        Choose your voucher expiry period and upsell your
                        services and memberships
                      </p>
                    </div>
                  </Link>
                </div>
                <div class="pb-4">
                  <Link to="/promotions/offers">
                    <div class="mt-2 flex h-8 justify-between">
                      <h2 class="font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100 lg:text-base">
                        Offers
                      </h2>
                      <label class="flex items-center space-x-2">
                        <span class="text-xs text-slate-400 dark:text-navy-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
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
                        </span>
                      </label>
                    </div>
                    <div class="max-w-xl text-left">
                      <p>Set up manual offers</p>
                    </div>
                  </Link>
                </div>
                <div class="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>

                <div class="pb-4">
                  <Link to="/promotions/coupons">
                    <div class="mt-2 flex h-8 justify-between">
                      <h2 class="font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100 lg:text-base">
                        Coupons
                      </h2>
                      <label class="flex items-center space-x-2">
                        <span class="text-xs text-slate-400 dark:text-navy-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
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
                        </span>
                      </label>
                    </div>
                    <div class="max-w-xl text-left">
                      <p>Set up manual coupons</p>
                    </div>
                  </Link>
                </div>
                <div class="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>

              </div>
            </div>
            
          </div>

          <div class="sm:px-5">

            <div class="card px-4 py-4">
              <div>
                <h1 class="text-lg font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100 text-left">
                  Clients
                </h1>
              </div>
              <div class="pt-2">
                <div class="pb-4">
                  <Link to="/clients/notificationsettings">
                    <div class="mt-2 flex h-8 justify-between">
                      <h2 class="font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100 lg:text-base">
                        Client notifications
                      </h2>
                      <label class="flex items-center space-x-2">
                        <span class="text-xs text-slate-400 dark:text-navy-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
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
                        </span>
                      </label>
                    </div>
                    <div class="max-w-xl text-left">
                      <p>
                        Review messages sent to clients about their appointments
                      </p>
                    </div>
                  </Link>
                </div>
                <div class="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>

                {/* <div class="pb-4">
                            <Link to="/clients/referralsources">
                                <div class="mt-2 flex h-8 justify-between">
                                    <h2 class="font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100 lg:text-base">
                                        Referral sources
                                    </h2>
                                    <label class="flex items-center space-x-2">
                                        <span class="text-xs text-slate-400 dark:text-navy-300">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </span>
                                    </label>
                                </div>
                                <div class="max-w-xl text-left">
                                    <p>Set up custom sources to track how clients found your business</p>
                                </div>
                            </Link>
                        </div>
                        <div class="my-1 h-px bg-slate-150 dark:bg-navy-500"></div> */}

                <div class="pb-4">
                  <Link to="/clients/cancelationreasons">
                    <div class="mt-2 flex h-8 justify-between">
                      <h2 class="font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100 lg:text-base">
                        Cancellation reasons
                      </h2>
                      <label class="flex items-center space-x-2">
                        <span class="text-xs text-slate-400 dark:text-navy-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
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
                        </span>
                      </label>
                    </div>
                    <div class="max-w-xl text-left">
                      <p>
                        Track why clients did not arrive for their appointments
                      </p>
                    </div>
                  </Link>
                </div>
                <div class="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>

                {/* <div class="pb-4">
                  <Link to="/clients/emailnotificationsetting">
                    <div class="mt-2 flex h-8 justify-between">
                      <h2 class="font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100 lg:text-base">
                        Email Notification Settings
                      </h2>
                      <label class="flex items-center space-x-2">
                        <span class="text-xs text-slate-400 dark:text-navy-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
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
                        </span>
                      </label>
                    </div>
                    <div class="max-w-xl text-left">
                      <p>Still not recieving notification </p>
                    </div>
                  </Link>
                </div>
                <div class="my-1 h-px bg-slate-150 dark:bg-navy-500"></div> */}
              </div>
            </div>

            <div class="card px-4 py-4 mt-4">
              <div>
                <h1 class="text-lg font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100 text-left">
                  Sales
                </h1>
              </div>
              <div class="pt-2">
                <div class="pb-4">
                  <Link to="/sales/invoicsequencing">
                    <div class="mt-2 flex h-8 justify-between">
                      <h2 class="font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100 lg:text-base">
                        Invoice sequencing
                      </h2>
                      <label class="flex items-center space-x-2">
                        <span class="text-xs text-slate-400 dark:text-navy-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
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
                        </span>
                      </label>
                    </div>
                    <div class="max-w-xl text-left">
                      <p>
                        Configure details displayed on invoices issued to your
                        clients
                      </p>
                    </div>
                  </Link>
                </div>
                <div class="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>

                <div class="pb-4">
                  <Link to="/sales/invoictemplate">
                    <div class="mt-2 flex h-8 justify-between">
                      <h2 class="font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100 lg:text-base">
                        Invoice template
                      </h2>
                      <label class="flex items-center space-x-2">
                        <span class="text-xs text-slate-400 dark:text-navy-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
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
                        </span>
                      </label>
                    </div>
                    <div class="max-w-xl text-left">
                      <p>
                        Configure details displayed on invoices issued to your
                        clients
                      </p>
                    </div>
                  </Link>
                </div>
                <div class="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>

                <div class="pb-4">
                  <Link to="/sales/tax">
                    <div class="mt-2 flex h-8 justify-between">
                      <h2 class="font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100 lg:text-base">
                        Taxes
                      </h2>
                      <label class="flex items-center space-x-2">
                        <span class="text-xs text-slate-400 dark:text-navy-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
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
                        </span>
                      </label>
                    </div>
                    <div class="max-w-xl text-left">
                      <p>
                        Manage tax rates that apply to items sold at checkout
                      </p>
                    </div>
                  </Link>
                </div>
                <div class="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>

                <div class="pb-4">
                  <Link to="/sales/servicecharge">
                    <div class="mt-2 flex h-8 justify-between">
                      <h2 class="font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100 lg:text-base">
                        Service charges
                      </h2>
                      <label class="flex items-center space-x-2">
                        <span class="text-xs text-slate-400 dark:text-navy-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
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
                        </span>
                      </label>
                    </div>
                    <div class="max-w-xl text-left">
                      <p>
                        Manage any extra charges that apply to services and
                        items sold at checkout
                      </p>
                    </div>
                  </Link>
                </div>
                <div class="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>

                <div class="pb-4">
                  <Link to="/sales/paymenttypes">
                    <div class="mt-2 flex h-8 justify-between">
                      <h2 class="font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100 lg:text-base">
                        Payment types
                      </h2>
                      <label class="flex items-center space-x-2">
                        <span class="text-xs text-slate-400 dark:text-navy-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
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
                        </span>
                      </label>
                    </div>
                    <div class="max-w-xl text-left">
                      <p>Set up manual payment types for use during checkout</p>
                    </div>
                  </Link>
                </div>
                <div class="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>

                <div class="pb-4">
                  <Link to="/sales/discounts">
                    <div class="mt-2 flex h-8 justify-between">
                      <h2 class="font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100 lg:text-base">
                        Discounts
                      </h2>
                      <label class="flex items-center space-x-2">
                        <span class="text-xs text-slate-400 dark:text-navy-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
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
                        </span>
                      </label>
                    </div>
                    <div class="max-w-xl text-left">
                      <p>create your discounts</p>
                    </div>
                  </Link>
                </div> 

                <div class="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }
}
