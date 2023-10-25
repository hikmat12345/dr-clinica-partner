import React from "react";
import swal from "sweetalert";
import axiosClient from "../../utils/helpers/server";
import moment from "moment";
import configData from "../../utils/constants/config.json";

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todayBookings: null,
      weekBookings: null,
      todayVisits: null,
      weekVisits: null,
      bookings: [],
      visits: [],
      months: [],
      latestAppointments: [],
      mostServicesBooked: [],
      mostServicesCancelled: [],
      mostServiceProvidorsBooked: [],
      mostServiceProvidorsCancelled: [],
      mostServicesBookedLastMonth: [],
      mostServicesCancelledLastMonth: [],
      mostServiceProvidorsBookedLastMonth: [],
      mostServiceProvidorsCancelledLastMonth: [],
    };
  }

  componentDidMount() {
    axiosClient.get("partner/dashboard/getdashboard/").then((resp) => {
      console.log(resp.data);
      if (parseInt(Object.keys(resp.data)[0]) === 200) {
        this.setState({
          todayBookings: resp.data.todayBookings,
          weekBookings: resp.data.weekBookings,
          todayVisits: resp.data.todayVisits,
          weekVisits: resp.data.weekVisits,
          bookings: resp.data.bookings,
          visits: resp.data.visits,
          months: resp.data.months,
          latestAppointments: resp.data.latestAppointments,
          mostServicesBooked: resp.data.mostServicesBooked,
          mostServicesBookedLastMonth: resp.data.mostServicesBookedLastMonth,
          mostServicesCancelled: resp.data.mostServicesCancelled,
          mostServicesCancelledLastMonth:
            resp.data.mostServicesCancelledLastMonth,
          mostServiceProvidorsBooked: resp.data.mostServiceProvidorsBooked,
          mostServiceProvidorsCancelled:
            resp.data.mostServiceProvidorsCancelled,
          mostServiceProvidorsBookedLastMonth:
            resp.data.mostServiceProvidorsBookedLastMonth,
          mostServiceProvidorsCancelledLastMonth:
            resp.data.mostServiceProvidorsCancelledLastMonth,
        });
      } else {
        swal({
          title: "Dashboard",
          text: resp.data[Object.keys(resp.data)[0]],
          icon: "warning",
          button: "ok",
        });
      }
    });
  }

  comingSoon = (e) => {
    e.preventDefault();
    swal({
      title: "Comming Soon",
      text: "Comming Soon",
      icon: "success",
      button: "ok",
    });
  };

  render() {
    const data = {
      colors: ["#4C4EE7", "#0EA5E9"],
      series: [
        { name: "Bookings", data: this.state.bookings },
        { name: "Patients", data: this.state.visits },
      ],
      chart: {
        height: 255,
        type: "bar",
        parentHeightOffset: 0,
        toolbar: { show: !1 },
      },
      dataLabels: { enabled: !1 },
      plotOptions: {
        bar: { borderRadius: 4, barHeight: "90%", columnWidth: "35%" },
      },
      legend: { show: !1 },
      xaxis: {
        categories: this.state.months,
        labels: { hideOverlappingLabels: !1 },
        axisBorder: { show: !1 },
        axisTicks: { show: !1 },
        tooltip: { enabled: !1 },
      },
      grid: { padding: { left: 0, right: 0, top: 0, bottom: -10 } },
      yaxis: {
        show: !1,
        axisBorder: { show: !1 },
        axisTicks: { show: !1 },
        labels: { show: !1 },
      },
      responsive: [
        {
          breakpoint: 850,
          options: { plotOptions: { bar: { columnWidth: "55%" } } },
        },
      ],
    };
    const traffic = {
      colors: ["#10b981", "#ff9800", "#4467EF", "#64748b"],
      series: [
        { name: "iOS", data: this.state.iOSYearTraffic },
        { name: "Android", data: this.state.androidYearTraffic },
        { name: "Web", data: this.state.webYearTraffic },
        { name: "In-Clinic", data: this.state.inClinicYearTraffic },
      ],
      chart: {
        type: "area",
        height: 220,
        parentHeightOffset: 0,
        toolbar: { show: 1 },
        zoom: { enabled: !1 },
      },
      dataLabels: { enabled: !1 },
      stroke: { curve: "smooth", width: 2 },
      grid: { padding: { left: 0, right: 0, top: -28, bottom: -15 } },
      tooltip: { shared: !0 },
      legend: { show: !1 },
      yaxis: { show: !1 },
      xaxis: {
        labels: { show: !1 },
        axisTicks: { show: !1 },
        axisBorder: { show: !1 },
      },
    };
    return (
      <main class="main-content px-[var(--margin-x)] pb-8">
        <div class="flex items-center space-x-4 py-5 lg:py-6">
          <h2 class="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">
            Dashboard
          </h2>
          <div class="hidden h-full py-1 sm:flex">
            <div class="h-full w-px bg-slate-300 dark:bg-navy-600"></div>
          </div>
          <ul class="hidden flex-wrap items-center space-x-2 sm:flex">
            <li class="flex items-center space-x-2">
              <a
                class="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent"
                href="/"
              >
                Dashboard
              </a>
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
            <li>Dashboard</li>
          </ul>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          <div class="relative flex flex-col overflow-hidden rounded-lg bg-gradient-to-br from-info to-info-focus p-3.5">
            <p class="text-xs uppercase text-sky-100">Appointments Today</p>
            <div class="flex items-end justify-between space-x-2">
              <p class="mt-4 text-2xl font-medium text-white">
                {this.state.todayBookings == null
                  ? 0
                  : this.state.todayBookings._count.id}
              </p>
              <a
                onClick={this.comingSoon}
                class="border-b border-dotted border-current pb-0.5 text-xs font-medium text-sky-100 outline-none transition-colors duration-300 line-clamp-1 hover:text-white focus:text-white"
              >
                Get Report
              </a>
            </div>
            <div class="mask is-reuleaux-triangle absolute top-0 right-0 -m-3 h-16 w-16 bg-white/20"></div>
          </div>

          <div class="relative flex flex-col overflow-hidden rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 p-3.5">
            <p class="text-xs uppercase text-sky-100">Appointments this Week</p>
            <div class="flex items-end justify-between space-x-2">
              <p class="mt-4 text-2xl font-medium text-white">
                {this.state.weekBookings == null
                  ? 0
                  : this.state.weekBookings._count.id}
              </p>
              <a
                onClick={this.comingSoon}
                class="border-b border-dotted border-current pb-0.5 text-xs font-medium text-sky-100 outline-none transition-colors duration-300 line-clamp-1 hover:text-white focus:text-white"
              >
                Get Report
              </a>
            </div>
            <div class="mask is-reuleaux-triangle absolute top-0 right-0 -m-3 h-16 w-16 bg-white/20"></div>
          </div>

          <div class="relative flex flex-col overflow-hidden rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 p-3.5">
            <p class="text-xs uppercase text-sky-100">Clinic Visits Today</p>
            <div class="flex items-end justify-between space-x-2">
              <p class="mt-4 text-2xl font-medium text-white">
                {this.state.todayVisits == null
                  ? 0
                  : this.state.todayVisits._count.id}
              </p>
              <a
                onClick={this.comingSoon}
                class="border-b border-dotted border-current pb-0.5 text-xs font-medium text-sky-100 outline-none transition-colors duration-300 line-clamp-1 hover:text-white focus:text-white"
              >
                Get Report
              </a>
            </div>
            <div class="mask is-reuleaux-triangle absolute top-0 right-0 -m-3 h-16 w-16 bg-white/20"></div>
          </div>

          <div class="relative flex flex-col overflow-hidden rounded-lg bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 p-3.5">
            <p class="text-xs uppercase text-sky-100">
              Clinic Visits this Week
            </p>
            <div class="flex items-end justify-between space-x-2">
              <p class="mt-4 text-2xl font-medium text-white">
                {this.state.weekVisits == null
                  ? 0
                  : this.state.weekVisits._count.id}
              </p>
              <a
                onClick={this.comingSoon}
                class="border-b border-dotted border-current pb-0.5 text-xs font-medium text-sky-100 outline-none transition-colors duration-300 line-clamp-1 hover:text-white focus:text-white"
              >
                Get Report
              </a>
            </div>
            <div class="mask is-reuleaux-triangle absolute top-0 right-0 -m-3 h-16 w-16 bg-white/20"></div>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-1 lg:gap-12 mt-6">
          <div class="flex items-center justify-between space-x-2">
            <h2 class="text-base font-medium tracking-wide text-slate-800 line-clamp-1 dark:text-navy-100">
              Appointments Overview
            </h2>
            <div
              id="sales-tab"
              class="is-scrollbar-hidden overflow-x-auto rounded-lg bg-slate-200 text-slate-600 dark:bg-navy-800 dark:text-navy-200"
            >
              <div class="tabs-list flex p-1">
                <button
                  data-target="#sales-recent-tab"
                  class="tab btn shrink-0 px-3 py-1 text-xs+ font-medium bg-white shadow dark:bg-navy-500 dark:text-navy-100 is-active"
                  data-active-class="bg-white shadow dark:bg-navy-500 dark:text-navy-100"
                  data-default-class="hover:text-slate-800 focus:text-slate-800 dark:hover:text-navy-100 dark:focus:text-navy-100"
                >
                  Last year
                </button>
                <button
                  data-target="#sales-all-tab"
                  class="tab btn shrink-0 px-3 py-1 text-xs+ font-medium hover:text-slate-800 focus:text-slate-800 dark:hover:text-navy-100 dark:focus:text-navy-100"
                  data-active-class="bg-white shadow dark:bg-navy-500 dark:text-navy-100"
                  data-default-class="hover:text-slate-800 focus:text-slate-800 dark:hover:text-navy-100 dark:focus:text-navy-100"
                >
                  Last month
                </button>
              </div>
            </div>
          </div>
          {this.state.bookings.length > 0 ? (
            <div class="ax-transparent-gridline grid w-full grid-cols-1">
              <div
                x-init={`$nextTick(() => { $el._x_chart = new ApexCharts($el,${JSON.stringify(
                  data
                )}); $el._x_chart.render() });`}
              ></div>
            </div>
          ) : (
            <></>
          )}
        </div>

        <div class="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-1 lg:gap-12">
          <div class="card mt-6 shadow-lg">
            <div class="grid grid-cols-1 divide-y divide-slate-150 dark:divide-navy-500 sm:grid-cols-4 sm:divide-x sm:divide-y-0">
              {this.state.mostServicesBooked.length > 0 ? (
                <div class="p-4 sm:p-5 shadow">
                  <h2 class="text-l font-semibold">Mostly Booked Services</h2>
                  <h3 class="font-medium tracking-wide text-slate-700 dark:text-navy-100">
                    {this.state.mostServicesBooked[0].service}
                  </h3>
                  <p class="mt-4">
                    <span class="text-3xl font-medium text-slate-700 dark:text-navy-100">
                      {this.state.mostServicesBooked[0]._count.id}
                    </span>
                    {this.state.mostServicesBookedLastMonth.length > 0 ? (
                      <>
                        {(this.state.mostServicesBooked[0]._count.id /
                          this.state.mostServicesBookedLastMonth[0]._count.id) *
                          100 >
                        0 ? (
                          <span class="text-xs text-success">
                            +
                            {parseFloat(
                              (this.state.mostServicesBooked[0]._count.id /
                                this.state.mostServicesBookedLastMonth[0]._count
                                  .id) *
                                100
                            ).toFixed(2)}
                            %
                          </span>
                        ) : (
                          <span class="text-xs text-danger">
                            -
                            {parseFloat(
                              (this.state.mostServicesBooked[0]._count.id /
                                this.state.mostServicesBookedLastMonth[0]._count
                                  .id) *
                                100
                            ).toFixed(2)}
                            %
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        <span class="text-xs text-success">+100%</span>
                      </>
                    )}
                  </p>
                  <div class="mt-4 flex justify-between">
                    <p class="text-xs uppercase text-slate-400 dark:text-navy-300">
                      Service name
                    </p>
                    <p class="text-xs uppercase text-slate-400 dark:text-navy-300">
                      Booking Count
                    </p>
                  </div>
                  <div class="mt-2 space-y-2.5">
                    {this.state.mostServicesBooked.map((service) => (
                      <div class="flex justify-between space-x-2">
                        <p class="line-clamp-1">{service.service}</p>
                        <p class="font-medium text-slate-700 dark:text-navy-100">
                          {service._count.id}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <></>
              )}

              {this.state.mostServiceProvidorsBooked.length > 0 ? (
                <div class="p-4 sm:p-5 shadow">
                  <h2 class="text-l font-semibold">
                    Mostly Booked Service Providers
                  </h2>
                  <h3 class="font-medium tracking-wide text-slate-700 dark:text-navy-100">
                    {this.state.mostServiceProvidorsBooked[0].serviceprovider}
                  </h3>
                  <p class="mt-4">
                    <span class="text-3xl font-medium text-slate-700 dark:text-navy-100">
                      {this.state.mostServiceProvidorsBooked[0]._count.id}
                    </span>
                    {this.state.mostServiceProvidorsBookedLastMonth.length >
                    0 ? (
                      <>
                        {(this.state.mostServiceProvidorsBooked[0]._count.id /
                          this.state.mostServiceProvidorsBookedLastMonth[0]
                            ._count.id) *
                          100 >
                        0 ? (
                          <span class="text-xs text-success">
                            +
                            {parseFloat(
                              (this.state.mostServiceProvidorsBooked[0]._count
                                .id /
                                this.state
                                  .mostServiceProvidorsBookedLastMonth[0]._count
                                  .id) *
                                100
                            ).toFixed(2)}
                            %
                          </span>
                        ) : (
                          <span class="text-xs text-danger">
                            -
                            {parseFloat(
                              (this.state.mostServiceProvidorsBooked[0]._count
                                .id /
                                this.state
                                  .mostServiceProvidorsBookedLastMonth[0]._count
                                  .id) *
                                100
                            ).toFixed(2)}
                            %
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        <span class="text-xs text-success">+100%</span>
                      </>
                    )}
                  </p>
                  <div class="mt-4 flex justify-between">
                    <p class="text-xs uppercase text-slate-400 dark:text-navy-300">
                      Service name
                    </p>
                    <p class="text-xs uppercase text-slate-400 dark:text-navy-300">
                      Booking Count
                    </p>
                  </div>
                  <div class="mt-2 space-y-2.5">
                    {this.state.mostServiceProvidorsBooked.map(
                      (serviceprovider) => (
                        <div class="flex justify-between space-x-2">
                          <p class="line-clamp-1">
                            {serviceprovider.serviceprovider}
                          </p>
                          <p class="font-medium text-slate-700 dark:text-navy-100">
                            {serviceprovider._count.id}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              ) : (
                <></>
              )}

              {this.state.mostServicesCancelled.length > 0 ? (
                <div class="p-4 sm:p-5 shadow">
                  <h2 class="text-l font-semibold">
                    Mostly Cancelled Services
                  </h2>
                  <h3 class="font-medium tracking-wide text-slate-700 dark:text-navy-100">
                    {this.state.mostServicesCancelled[0].service}
                  </h3>
                  <p class="mt-4">
                    <span class="text-3xl font-medium text-slate-700 dark:text-navy-100">
                      {this.state.mostServicesCancelled[0]._count.id}
                    </span>
                    {this.state.mostServicesCancelledLastMonth.length > 0 ? (
                      <>
                        {(this.state.mostServicesCancelled[0]._count.id /
                          this.state.mostServicesCancelledLastMonth[0]._count
                            .id) *
                          100 >
                        0 ? (
                          <span class="text-xs text-success">
                            +
                            {parseFloat(
                              (this.state.mostServicesCancelled[0]._count.id /
                                this.state.mostServicesCancelledLastMonth[0]
                                  ._count.id) *
                                100
                            ).toFixed(2)}
                            %
                          </span>
                        ) : (
                          <span class="text-xs text-danger">
                            -
                            {parseFloat(
                              (this.state.mostServicesCancelled[0]._count.id /
                                this.state.mostServicesCancelledLastMonth[0]
                                  ._count.id) *
                                100
                            ).toFixed(2)}
                            %
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        <span class="text-xs text-success">+100%</span>
                      </>
                    )}
                  </p>
                  <div class="mt-4 flex justify-between">
                    <p class="text-xs uppercase text-slate-400 dark:text-navy-300">
                      Service name
                    </p>
                    <p class="text-xs uppercase text-slate-400 dark:text-navy-300">
                      Booking Count
                    </p>
                  </div>
                  <div class="mt-2 space-y-2.5">
                    {this.state.mostServicesCancelled.map((service) => (
                      <div class="flex justify-between space-x-2">
                        <p class="line-clamp-1">{service.service}</p>
                        <p class="font-medium text-slate-700 dark:text-navy-100">
                          {service._count.id}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <></>
              )}

              {this.state.mostServiceProvidorsCancelled.length > 0 ? (
                <div class="p-4 sm:p-5 shadow">
                  <h2 class="text-l font-semibold">
                    Mostly Booked Service Providers
                  </h2>
                  <h3 class="font-medium tracking-wide text-slate-700 dark:text-navy-100">
                    {
                      this.state.mostServiceProvidorsCancelled[0]
                        .serviceprovider
                    }
                  </h3>
                  <p class="mt-4">
                    <span class="text-3xl font-medium text-slate-700 dark:text-navy-100">
                      {this.state.mostServiceProvidorsCancelled[0]._count.id}
                    </span>
                    {this.state.mostServiceProvidorsCancelledLastMonth.length >
                    0 ? (
                      <>
                        {(this.state.mostServiceProvidorsCancelled[0]._count
                          .id /
                          this.state.mostServiceProvidorsCancelledLastMonth[0]
                            ._count.id) *
                          100 >
                        0 ? (
                          <span class="text-xs text-success">
                            +
                            {parseFloat(
                              (this.state.mostServiceProvidorsCancelled[0]
                                ._count.id /
                                this.state
                                  .mostServiceProvidorsCancelledLastMonth[0]
                                  ._count.id) *
                                100
                            ).toFixed(2)}
                            %
                          </span>
                        ) : (
                          <span class="text-xs text-danger">
                            -
                            {parseFloat(
                              (this.state.mostServiceProvidorsCancelled[0]
                                ._count.id /
                                this.state
                                  .mostServiceProvidorsCancelledLastMonth[0]
                                  ._count.id) *
                                100
                            ).toFixed(2)}
                            %
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        <span class="text-xs text-success">+100%</span>
                      </>
                    )}
                  </p>
                  <div class="mt-4 flex justify-between">
                    <p class="text-xs uppercase text-slate-400 dark:text-navy-300">
                      Service name
                    </p>
                    <p class="text-xs uppercase text-slate-400 dark:text-navy-300">
                      Booking Count
                    </p>
                  </div>
                  <div class="mt-2 space-y-2.5">
                    {this.state.mostServiceProvidorsCancelled.map(
                      (serviceprovider) => (
                        <div class="flex justify-between space-x-2">
                          <p class="line-clamp-1">
                            {serviceprovider.serviceprovider}
                          </p>
                          <p class="font-medium text-slate-700 dark:text-navy-100">
                            {serviceprovider._count.id}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-1 lg:gap-12">
          <div class="mt-4 sm:mt-5 lg:mt-6">
            <div class="flex items-center justify-between">
              <h2 class="text-base font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">
                Latest Appointments
              </h2>
              <div class="flex">
                <div class="flex items-center" x-data="{isInputActive:false}">
                  <label class="block">
                    <input
                      x-effect="isInputActive === true && $nextTick(() => { $el.focus()});"
                      class="form-input w-full bg-transparent px-1 text-right transition-all duration-100 placeholder:text-slate-500 dark:placeholder:text-navy-200"
                      placeholder="Search here..."
                      type="text"
                    />
                  </label>
                  <button class="btn h-8 w-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4.5 w-4.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                </div>
                <div
                  x-data="usePopper({placement:'bottom-end',offset:4})"
                  class="inline-flex"
                >
                  <button
                    x-ref="popperRef"
                    class="btn h-8 w-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4.5 w-4.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                  </button>
                  <div x-ref="popperRoot" class="popper-root">
                    <div class="popper-box rounded-md border border-slate-150 bg-white py-1.5 font-inter dark:border-navy-500 dark:bg-navy-700">
                      <ul>
                        <li>
                          <a
                            href="#"
                            class="flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-none transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                          >
                            Action
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            class="flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-none transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                          >
                            Another Action
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            class="flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-none transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                          >
                            Something else
                          </a>
                        </li>
                      </ul>
                      <div class="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>
                      <ul>
                        <li>
                          <a
                            href="#"
                            class="flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-none transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                          >
                            Separated Link
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="card mt-3 mb-12">
              <div class="is-scrollbar-hidden min-w-full overflow-x-auto">
                <table class="is-hoverable w-full text-left">
                  <thead>
                    <tr>
                      <th class="whitespace-nowrap rounded-tl-lg bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        NAME
                      </th>
                      <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Service
                      </th>
                      <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        LOCATION
                      </th>
                      <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        DATETIME
                      </th>
                      <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        STATUS
                      </th>
                      <th class="whitespace-nowrap rounded-tr-lg bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.latestAppointments.length > 0 ? (
                      <>
                        {this.state.latestAppointments.map((appointment) => (
                          <tr class="border-y border-transparent border-b-slate-200 dark:border-b-navy-500">
                            <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                              <div class="flex items-center space-x-4">
                                <div class="avatar h-9 w-9">
                                  <img
                                    class="rounded-full"
                                    src={
                                      appointment.customer_bookingsTocustomer
                                        .image
                                    }
                                    alt={`${appointment.customer_bookingsTocustomer.firstname} ${appointment.customer_bookingsTocustomer.lastname}`}
                                  />
                                </div>
                                <span class="font-medium text-slate-700 dark:text-navy-100">
                                  {
                                    appointment.customer_bookingsTocustomer
                                      .firstname
                                  }{" "}
                                  {
                                    appointment.customer_bookingsTocustomer
                                      .lastname
                                  }
                                </span>
                              </div>
                            </td>
                            <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                              <a
                                href="#"
                                class="hover:underline focus:underline"
                              >
                                {appointment.service_bookingsToservice.name}
                              </a>
                            </td>
                            <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                              <a
                                href="#"
                                class="hover:underline focus:underline"
                              >
                                {(
                                  appointment.branch_bookingsTobranch.name +
                                  appointment.branch_bookingsTobranch.address
                                ).length > 70
                                  ? (
                                      appointment.branch_bookingsTobranch.name +
                                      appointment.branch_bookingsTobranch
                                        .address
                                    ).slice(0, 70) + "..."
                                  : appointment.branch_bookingsTobranch.name +
                                    appointment.branch_bookingsTobranch.address}
                              </a>
                            </td>
                            <td class="whitespace-nowrap px-4 py-3 font-medium text-slate-600 dark:text-navy-100 sm:px-5">
                              {moment(appointment.date).format("MMMM DD, YYYY")}{" "}
                              - {appointment.starttime}
                            </td>
                            <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                              {appointment.status ? (
                                <>
                                  <i class="fa-solid fa-circle-xmark"></i>
                                </>
                              ) : (
                                <>
                                  {appointment.invoice ? (
                                    <>
                                      <i class="fas fa-check-circle"></i>
                                    </>
                                  ) : (
                                    <>
                                      <i class="fa-solid fa-clock"></i>
                                    </>
                                  )}
                                </>
                              )}
                            </td>

                            <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                              <button
                                class="btn h-8 w-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                                onClick={() => {
                                  localStorage.setItem(
                                    "appointment",
                                    appointment.id
                                  );
                                  window.location = "/calendar/appointment";
                                }}
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </>
                    ) : (
                      <></>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}
