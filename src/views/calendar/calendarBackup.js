import React from 'react'
import Paper from '@mui/material/Paper'
import { ViewState, EditingState } from '@devexpress/dx-react-scheduler'
import {
  AppointmentForm,
  MonthView,
} from '@devexpress/dx-react-scheduler-material-ui'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import {
  Scheduler,
  WeekView,
  DayView,
  Toolbar,
  DateNavigator,
  Appointments,
  TodayButton,
  EditRecurrenceMenu,
  DragDropProvider,
} from '@devexpress/dx-react-scheduler-material-ui'
import axiosClient from '../../utils/helpers/server'
import swal from 'sweetalert'
import { Table } from 'antd'
import { Select } from 'antd'
// end of src

// external view comp
const ExternalViewSwitcher = ({ currentViewName, onChange }) => (
  <>
    <RadioGroup
      aria-label="Views"
      style={{ flexDirection: 'row' }}
      name="views"
      value={currentViewName}
      onChange={onChange}
    >
      <FormControlLabel
        value="Three-Day-View"
        control={<Radio />}
        label="Three Days View"
      />

      <FormControlLabel value="Day" control={<Radio />} label="Day View" />
      <FormControlLabel
        value="work-week"
        control={<Radio />}
        label="Week View"
      />
      <FormControlLabel value="Month" control={<Radio />} label="Month View" />
      <FormControlLabel value="List" control={<Radio />} label="List View" />
    </RadioGroup>
  </>
)

// page component
export default class CalendarBackup extends React.PureComponent {
  constructor(props) {
    super(props)
    const today = new Date()
    this.state = {
      data: [],
      currentDate: `${today.getFullYear()}-${
        today.getMonth() + 1
      }-${today.getDate()}`,
      startingHour: 0,
      endingHour: 24,
      currentViewName: 'Day',
      rows: [],
      menuProps: {},
      searchInput: '',
      docName: [],
      items: [],
      filteredArray: [],
      scheduledFilterArray: [],
      selectedOption: false,
      filteredItems: [],
      bookingsList: [],
      bookingsListCustomer: [],
      bookingsListStore: [],
      bookingsListCustomerStore: [],
      showCalender: false,
      selectedDateValue: '',
    }

    this.onPoviderFilter = (name, designation) => {
      console.log(name, designation, 'name, designation')
      this.setState({ showCalender: !this.state.showCalender })

      // change it
      if (name) {
        const filteredArrray = this.state.rows?.filter((data) => {
          return data.doctorName == name
        })
        this.setState({ filteredArray: filteredArrray })
        this.setState({ selectedOption: true })
      }
      if (name) {
        const scheduledFilterArray = this.state.data?.filter((data) => {
          return data.doctorName == name
        })

        this.setState({ scheduledFilterArray: scheduledFilterArray })
        this.setState({ selectedOption: true })
      }
    }
    // search by customer filter
    this.onPoviderCustomerFilter = (servciename) => {
      this.setState({ showCalenderCustomer: !this.state.showCalenderCustomer })
      console.log(this.state.rows, 'this.state.rows')
      if (servciename) {
        const filteredArrray = this.state.rows?.filter((data) => {
          return data.treatment == servciename
        })
        this.setState({ filteredArray: filteredArrray })
        this.setState({ selectedOption: true })
      }
      if (servciename) {
        const scheduledFilterArray = this.state.data?.filter((data) => {
          return data.treatment == servciename
        })

        this.setState({ scheduledFilterArray: scheduledFilterArray })
        this.setState({ selectedOption: true })
      }
    }
    //  on all
    this.onAll = (name) => {
      if (name == 'doctor') {
        this.setState({ showCalender: !this.state.showCalender })
      }
      if (name == 'service') {
        this.setState({
          showCalenderCustomer: !this.state.showCalenderCustomer,
        })
      }
      this.setState({ filteredArray: this.state.rows })
      this.setState({ selectedOption: true })
      this.setState({ scheduledFilterArray: this.state.data })
      this.setState({ selectedOption: true })
    }
    this.currentViewNameChange = (e) => {
      console.log('currentViewNameChange  ')

      this.setState({ currentViewName: e.target.value })
    }
  }

  currentDateChange = (currentDate) => {
    this.setState({ currentDate })
    this.getAppointments(currentDate)
  }

  componentDidMount() {
    this.getAppointments(new Date(this.state.currentDate))
  }

  componentDidUpdate() {}

  getAppointments(currentDate) {
    console.log(currentDate, 'getAppointments  ')
    axiosClient
      .get(
        `partner/calendar/getcalendarpreloaddata/${currentDate.getFullYear()}-${
          currentDate.getMonth() + 1
        }-${currentDate.getDate()}`,
      )

      .then((resp) => {
        console.log(resp, 'Responce to show data for table')
        if (parseInt(Object.keys(resp.data)) === 200) {
          let startingHour = new Date(
            `${currentDate.getFullYear()}-${
              currentDate.getMonth() + 1
            }-${currentDate.getDate()} 09:00`,
          ).getTime()
          let endingHour = new Date(
            `${currentDate.getFullYear()}-${
              currentDate.getMonth() + 1
            }-${currentDate.getDate()} 18:00 `,
          ).getTime()
          let data = []
          let rows = []
          let items = []
          let filteredItems = []

          this.setState({
            bookingsList: resp?.data?.bookings?.filter(
              (list) => list?.teammember?.firstname !== undefined,
            ),
          })
          this.setState({
            bookingsListCustomer: resp?.data?.bookings?.filter(
              (list) => list?.service_bookingsToservice?.id !== undefined,
            ),
          })
          resp.data.bookings.forEach((booking) => {
            const bookingDate = new Date(booking.date)
            if (
              new Date(
                `${currentDate.getFullYear()}-${
                  currentDate.getMonth() + 1
                }-${currentDate.getDate()} ${booking.starttime}`,
              ).getTime() < startingHour
            ) {
              startingHour = new Date(
                `${currentDate.getFullYear()}-${
                  currentDate.getMonth() + 1
                }-${currentDate.getDate()} ${booking.starttime}`,
              ).getTime()
            }

            if (
              new Date(
                `${currentDate.getFullYear()}-${
                  currentDate.getMonth() + 1
                }-${currentDate.getDate()} ${booking.endtime}`,
              ).getTime() > endingHour
            ) {
              endingHour = new Date(
                `${currentDate.getFullYear()}-${
                  currentDate.getMonth() + 1
                }-${currentDate.getDate()} ${booking.endtime}`,
              ).getTime()
            }

            let starttime = booking.starttime.split(':')
            let endtime = booking.endtime.split(':')
            data.push({
              title: (
                <>
                  <div>
                    {booking?.customer_bookingsTocustomer?.firstname}{' '}
                    {booking?.customer_bookingsTocustomer?.lastname}
                  </div>
                  <div>({booking?.service_bookingsToservice?.name})</div>
                  <div>
                    {' '}
                    {booking?.teammember?.firstname}{' '}
                    {booking?.teammember?.lastname}{' '}
                  </div>
                </>
              ),

              startDate: new Date(
                bookingDate?.getFullYear(),
                bookingDate?.getMonth(),
                bookingDate?.getDate(),
                starttime[0],
                starttime[1],
              ),
              endDate: new Date(
                bookingDate?.getFullYear(),
                bookingDate?.getMonth(),
                bookingDate?.getDate(),
                endtime[0],
                endtime[1],
              ),
              id: booking?.id,
              location: booking?.branch_bookingsTobranch?.address,
              gender: booking?.customer_bookingsTocustomer?.gender,
              doctorName: booking?.teammember?.firstname,
            })

            rows?.push({
              name: booking?.customer_bookingsTocustomer?.firstname,
              treatment: booking?.service_bookingsToservice?.name,
              timings: (
                <>
                  {starttime} - {endtime}
                </>
              ),
              doctorName: booking?.teammember?.firstname,
            })
            items?.push({
              label: booking?.teammember?.firstname,
              value: booking?.teammember?.firstname,
            })

            console?.log(items, 'checking for items')
          })
          filteredItems = [
            ...new Map(items.map((item) => [item['value'], item])).values(),
          ]
          console.log('Filtered Items', filteredItems)
          if (data?.length || rows?.length || items?.length > 0) {
            this.setState({
              startingHour: new Date(startingHour).getHours(),
              endingHour: new Date(endingHour).getHours(),
              data: data,
              rows: rows,
              items: items,
              filteredItems: filteredItems,
            })
          } else {
            this.setState({
              startingHour: 9,
              endingHour: 19,
              data: data,
            })
          }
        } else {
          swal({
            title: 'Get Calendar Data',
            text: resp?.data[Object.keys(resp.data)[0]],
            icon: 'warning',
            button: 'ok',
          })
        }
      })
  }
  commitChanges({ added, changed, deleted }) {
    console.log('asldfkasjdf', added, changed, deleted)
  }

  onChange = (value) => {
    if (value) {
      const filteredArrray = this.state.rows?.filter((data) => {
        return data.doctorName == value
      })

      console.log(filteredArrray, 'Filtered Array')
      this.setState({ filteredArray: filteredArrray })
      this.setState({ selectedOption: true })
    }
    if (value) {
      const scheduledFilterArray = this.state.data?.filter((data) => {
        return data.doctorName == value
      })

      this.setState({ scheduledFilterArray: scheduledFilterArray })
      this.setState({ selectedOption: true })
    }
  }

  onSearch = (value) => {}
  AddAppointmentHandler = () => {
    window.location.href = '/calendar/addappointment'
  }
  CalenderEventHandler = () => {
    console.log('CalenderEventHandler  ')
    this.setState({ showCalender: !this.state.showCalender })
  }
  CalenderEventHandlerCustomer = () => {
    this.setState({ showCalenderCustomer: !this.state.showCalenderCustomer })
  }
  currentDateSelection = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  render() {
    const {
      data,
      currentDate,
      startingHour,
      endingHour,
      currentViewName,
      rows,
      searchInput,
      filteredData,
      items,
      docName,
      selectedOption,
      filteredArray,
      scheduledFilterArray,
      filteredItems,
      showCalender,
      showCalenderCustomer,
      bookingsList,
      bookingsListCustomer,
      bookingsListCustomerStore,
      bookingsListStore,
      selectedDateValue,
    } = this.state
    console.log(currentDate, 'currentDate')
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Treatment',
        dataIndex: 'treatment',
        key: 'treatment',
      },
      {
        title: 'Doctor Name',
        dataIndex: 'doctorName',
        key: 'doctorName',
      },
      {
        title: 'Timings',
        dataIndex: 'timings',
        key: 'timings',
      },
    ]

    return (
      <main className="main-content px-[var(--margin-x)] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6">
          <h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">
            Calendar
          </h2>
          <div className="hidden h-full py-1 sm:flex">
            <div className="h-full w-px bg-slate-300 dark:bg-navy-600"></div>
          </div>
          <ul className="hidden flex-wrap items-center space-x-2 sm:flex">
            <li className="flex items-center space-x-2">
              <a
                className="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent"
                href="/"
              >
                Dashboard
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
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </li>
            <li>Calendar</li>
          </ul>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-1 lg:gap-6 text-center">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {/* external view switcher  */}
            <div>
              <ExternalViewSwitcher
                currentViewName={currentViewName}
                onChange={this.currentViewNameChange}
              />
            </div>
            <div style={{ display: 'flex', width: '45%' }}>
              {/* search filter  */}
              <div
                style={{
                  position: 'relative',
                  top: '10px',
                  flex: 9,
                  width: '10rem',
                }}
              >
                <button
                  id="dropdownNotificationButton"
                  data-dropdown-toggle="dropdownNotification"
                  className="inline-flex  text-sm font-medium text-gray-500 hover:text-gray-900 focus:outline-none dark:hover:text-white dark:text-gray-400"
                  type="button"
                  style={{ marginRight: 'auto', display: 'flex' }}
                  onClick={this.CalenderEventHandler}
                >
                  <span>Search by Doctor</span>
                  <span
                    className="pt-1 pl-2 ml-3"
                    style={{ marginLeft: '9px' }}
                  >
                    {' '}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      fill="#000000"
                      height="15px"
                      width="15px"
                      version="1.1"
                      id="Layer_1"
                      viewBox="0 0 512 512"
                      xmlSpace="preserve"
                    >
                      <g>
                        <g>
                          <path d="M4.71,0v147.877l178.335,178.335V512l145.91-48.637V326.211L507.29,147.877V0H4.71z M458.653,127.731L280.318,306.066 v122.243l-48.637,16.212V306.066L53.347,127.731V48.637h405.306V127.731z" />
                        </g>
                      </g>
                    </svg>
                  </span>
                </button>

                {showCalender && (
                  <div
                    id="dropdownNotification"
                    className="z-20 w-full max-w-sm bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-800 dark:divide-gray-700"
                    aria-labelledby="dropdownNotificationButton"
                    style={{
                      position: 'absolute',
                      zIndex: 999,
                    }}
                  >
                    <div
                      onClick={() => this.onAll('doctor')}
                      className="block px-4 cursor-pointer py-2 font-medium text-center text-gray-700 rounded-t-lg bg-gray-50 dark:bg-gray-800 dark:text-white"
                    >
                      All
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                      {console.log(bookingsList, 'bookingsListbookingsList')}
                      {bookingsList?.map((booking) => {
                        return (
                          <button
                            onClick={() =>
                              this.onPoviderFilter(
                                booking?.teammember?.firstname,
                                booking?.teammember?.startdate?.split('T')[0],
                              )
                            }
                            className="flex  w-full px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <div className="flex-shrink-0">
                              <div className="absolute flex items-center justify-center w-5 h-5 ml-6 -mt-5 bg-blue-600 border border-white rounded-full dark:border-gray-800">
                                <svg
                                  className="w-3 h-3 text-white"
                                  aria-hidden="true"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z"></path>
                                  <path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"></path>
                                </svg>
                              </div>
                            </div>
                            <div className="w-full pl-3">
                              <div className="text-gray-500 text-left text-sm   dark:text-gray-400">
                                <div className="  text-gray-900 dark:text-white">
                                  Name :{' '}
                                  {`${booking?.teammember?.firstname} ${booking?.teammember?.lastname}`}{' '}
                                </div>
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                    {/* <a
                  href="#"
                  className="block py-2 text-sm font-medium text-center text-gray-900 rounded-b-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
                >
                  <div className="inline-flex items-center ">
                    <svg
                      className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                      <path
                        fill-rule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    All
                  </div>
                </a> */}
                  </div>
                )}
              </div>

              {/* search by customer   */}
              <div
                style={{
                  position: 'relative',
                  marginLeft: '1%',
                  top: '10px',
                  flex: 9,
                }}
              >
                <button
                  id="dropdownNotificationButton"
                  data-dropdown-toggle="dropdownNotification"
                  className="inline-flex  text-sm font-medium text-gray-500 hover:text-gray-900 focus:outline-none dark:hover:text-white dark:text-gray-400"
                  type="button"
                  style={{ marginRight: 'auto', display: 'flex' }}
                  onClick={this.CalenderEventHandlerCustomer}
                >
                  <span>Search by Service</span>
                  <span
                    className="pt-1 pl-2 ml-3"
                    style={{ marginLeft: '9px' }}
                  >
                    {' '}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      fill="#000000"
                      height="15px"
                      width="15px"
                      version="1.1"
                      id="Layer_1"
                      viewBox="0 0 512 512"
                      xmlSpace="preserve"
                    >
                      <g>
                        <g>
                          <path d="M4.71,0v147.877l178.335,178.335V512l145.91-48.637V326.211L507.29,147.877V0H4.71z M458.653,127.731L280.318,306.066 v122.243l-48.637,16.212V306.066L53.347,127.731V48.637h405.306V127.731z" />
                        </g>
                      </g>
                    </svg>
                  </span>
                </button>

                {showCalenderCustomer && (
                  <div
                    id="dropdownNotification"
                    className="z-20 w-full max-w-sm bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-800 dark:divide-gray-700"
                    aria-labelledby="dropdownNotificationButton"
                    style={{
                      position: 'absolute',
                      zIndex: 999,
                    }}
                  >
                    <div
                      onClick={() => this.onAll('service')}
                      className="block px-4 cursor-pointer py-2 font-medium text-center text-gray-700 rounded-t-lg bg-gray-50 dark:bg-gray-800 dark:text-white"
                    >
                      All
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                      {bookingsListCustomer?.map((booking) => {
                        return (
                          <button
                            onClick={() =>
                              this.onPoviderCustomerFilter(
                                booking?.service_bookingsToservice?.name,
                              )
                            }
                            className="flex  w-full px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <div className="flex-shrink-0">
                              <div className="absolute flex items-center justify-center w-5 h-5 ml-6 -mt-5 bg-blue-600 border border-white rounded-full dark:border-gray-800">
                                <svg
                                  className="w-3 h-3 text-white"
                                  aria-hidden="true"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z"></path>
                                  <path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"></path>
                                </svg>
                              </div>
                            </div>
                            <div className="w-full pl-3">
                              <div className="text-gray-500 text-left text-sm   dark:text-gray-400">
                                <div className="  text-gray-900 dark:text-white">
                                  Service :{' '}
                                  {`${booking?.service_bookingsToservice?.name}`}
                                </div>
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
              {/* add appointment btn */}
              <div
                style={{
                  display: 'flex',
                  marginLeft: '1%',
                  flex: 9,
                  justifyContent: 'end',
                }}
              >
                <button
                  className="btn space-x-2 bg-slate-150 font-medium text-slate-800 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200/80 dark:bg-navy-500 dark:text-navy-50 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
                  onClick={this.AddAppointmentHandler}
                >
                  Add Appointment
                </button>
              </div>
            </div>
            {/* <div style={{ display: 'flex', justifyContent: 'end' }}>
            <Select
              showSearch
              placeholder="Select Doctor"
              optionFilterProp="children"
              onChange={this.onChange}
              onSearch={this.onSearch}
              filterOption={(input, option) =>
                (option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={filteredItems}
            />
          </div> */}
          </div>
          {currentViewName === 'List' ? (
            <>
              <Table
                columns={columns}
                dataSource={selectedOption ? filteredArray : rows}
              />
            </>
          ) : (
            <Paper>
              <Scheduler data={selectedOption ? scheduledFilterArray : data}>
                <ViewState
                  currentDate={currentDate}
                  onCurrentDateChange={this.currentDateChange}
                  currentViewName={currentViewName}
                  onCurrentViewNameChange={this.currentViewNameChange}
                />

                <DayView
                  startDayHour={startingHour}
                  endDayHour={endingHour}
                  name="Day"
                />
                {/* two days  */}
                <DayView
                  startDayHour={startingHour}
                  endDayHour={endingHour}
                  name="Three-Day-View"
                  intervalCount={3}
                />
                <WeekView
                  startDayHour={startingHour}
                  endDayHour={endingHour}
                  cellDuration={30}
                  displayName="Test"
                  name="work-week"
                />
                <MonthView />
                <EditingState onCommitChanges={this.commitChanges} />
                <EditRecurrenceMenu />
                <Toolbar />
                <DateNavigator />
                <TodayButton />
                <Appointments />
                <DragDropProvider />
                <AppointmentForm />
              </Scheduler>
            </Paper>
          )}
        </div>
      </main>
    )
  }
}
