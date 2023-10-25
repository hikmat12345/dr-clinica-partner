import React from 'react'
import swal from 'sweetalert'
import axios from 'axios'
import configData from '../../utils/constants/config.json'
import { API } from '../../Pages/AddAppointment/API'
import moment from 'moment'

export default class Discount extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tacbleAction: 'popper-root',
      discountList: [],
      page: 1,
      servicesCount: 0,
      pageRecordCount: 5,
      totalPages: 0, 

      branchid: 0,
      discountValue: 0,
      isPercentage: 'true',
      branchList: [],
      branchSelectValue: 0,
      isCreate: false,
    }
  }

  componentDidMount() {
    
    // Branch list
    axios({
      method: 'get',
      url: configData.SERVER_URL + `partner/businesssetup/getBranches`,
      headers: {
        'Content-Type': 'Content-Type", "application/json',
        accesstoken: configData.ACCESSTOKEN,
        logintoken: localStorage.getItem('loginToken'),
      },
    })
      .then((resp) => {
        this.setState({ branchList: resp.data?.branches })
        this.getDiscountList(resp.data?.branches[0].id)
      })
      .catch(() => {})
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.isCreate !== this.state.isCreate) {
      console.log('State updated!')
      this.getDiscountList()
    }
  }
  getDiscountList = (initialBranchId) => {
    axios({
      method: 'get',
      url:
        configData.SERVER_URL +
        `partner/discount/list-discount?branchId=${this.state.branchList[0]?.id?this.state.branchList[0]?.id:initialBranchId }&count=${this.state.pageRecordCount}&page=1`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        accesstoken: configData.ACCESSTOKEN,
        logintoken: localStorage.getItem('loginToken'),
      },
    })
      .then((resp) => {
        console.log(resp.data, 'resp.data')
        this.setState({
          discountList: resp?.data?.data?.discount,
          page: resp?.data?.data?.page,
          servicesCount: resp?.data?.data?.servicesCount,
          pageRecordCount: resp?.data?.data?.pageRecordCount,
          totalPages: resp?.data?.data?.totalPages,
        })
      })
      .catch((err) => {
        swal({
          title: 'Server Not Responding',
          text: 'Please try again later',
          icon: 'warning',
          button: 'ok',
        })
        console.log(err)
      })
  }
  onChangeBranch = (event) => {
    this.setState({ branchSelectValue: event.target.value })
  }
  handlePageChange = (e) => {
    e.preventDefault()
    axios({
      method: 'get',
      url:
        configData.SERVER_URL +
        `partner/discount/list-discount?branchId=${this.state.branchSelectValue !==0?this.state.branchSelectValue: this.state.branchList[0]?.id}&count=${
          this.state.pageRecordCount
        }&page=${e.currentTarget.getAttribute('data-page')}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        accesstoken: configData.ACCESSTOKEN,
        logintoken: localStorage.getItem('loginToken'),
      },
    })
      .then((resp) => {
            this.setState({
            discountList: resp?.data?.data?.discount,
            page: resp?.data?.data?.page,
            servicesCount: resp?.data?.data?.servicesCount,
            pageRecordCount: resp?.data?.data?.pageRecordCount,
            totalPages: resp?.data?.data?.totalPages,
          })
       })
      .catch((err) => {
        swal({
          title: 'Server Not Responding',
          text: 'Please try again later',
          icon: 'warning',
          button: 'ok',
        })
        console.log(err)
      })
  }

  handleRecordCountChange = (e) => {
    e.preventDefault()
    axios({
      method: 'get',
      url:
        configData.SERVER_URL +
        `partner/discount/list-discount?branchId=${this.state.branchSelectValue !==0?this.state.branchSelectValue: this.state.branchList[0]?.id}&count=${e.currentTarget.value}&page=${this.state.page}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        accesstoken: configData.ACCESSTOKEN,
        logintoken: localStorage.getItem('loginToken'),
      },
    })
      .then((resp) => {
            this.setState({
            discountList: resp?.data?.data?.discount,
            page: resp?.data?.data?.page,
            servicesCount: resp?.data?.data?.servicesCount,
            pageRecordCount: resp?.data?.data?.pageRecordCount,
            totalPages: resp?.data?.data?.totalPages,
          })
       })
      .catch((err) => {
        swal({
          title: 'Server Not Responding',
          text: 'Please try again later',
          icon: 'warning',
          button: 'ok',
        })
        console.log(err)
      })
  }

  onToggletableAction = (e) => {
    if (this.state.tacbleAction == 'popper-root') {
      this.setState({
        tacbleAction: 'popper-root show',
      })
    } else {
      this.setState({
        tacbleAction: 'popper-root',
      })
    }
  }

  pagination() {
    if (this.state.page == 1) {
      return (
        <ol class="pagination">
          <li class="bg-slate-150 dark:bg-navy-500">
            <button
              data-page="1"
              onClick={this.handlePageChange}
              class="flex h-8 min-w-[2rem] items-center justify-center rounded-lg bg-primary px-3 leading-tight text-white transition-colors hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
            >
              1
            </button>
          </li>
          {this.state.totalPages > 1 ? (
            <li class="bg-slate-150 dark:bg-navy-500">
              <button
                data-page="2"
                onClick={this.handlePageChange}
                class="flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-3 leading-tight transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
              >
                2
              </button>
            </li>
          ) : null}
          <li class="rounded-r-lg bg-slate-150 dark:bg-navy-500">
            <button
              data-page={this.state.totalPages}
              onClick={this.handlePageChange}
              class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:text-navy-200 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
            >
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
            </button>
          </li>
        </ol>
      )
    } else {
      if (this.state.page == this.state.totalPages) {
        return (
          <ol class="pagination">
            <li class="rounded-l-lg bg-slate-150 dark:bg-navy-500">
              <button
                data-page="1"
                onClick={this.handlePageChange}
                class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:text-navy-200 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            </li>
            <li class="bg-slate-150 dark:bg-navy-500">
              <button
                data-page={parseInt(this.state.page) - 1}
                onClick={this.handlePageChange}
                class="flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-3 leading-tight transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
              >
                {parseInt(this.state.page) - 1}
              </button>
            </li>
            <li class="bg-slate-150 dark:bg-navy-500">
              <button
                data-page={this.state.page}
                onClick={this.handlePageChange}
                class="flex h-8 min-w-[2rem] items-center justify-center rounded-lg bg-primary px-3 leading-tight text-white transition-colors hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
              >
                {this.state.page}
              </button>
            </li>
          </ol>
        )
      } else {
        return (
          <ol class="pagination">
            <li class="rounded-l-lg bg-slate-150 dark:bg-navy-500">
              <button
                data-page="1"
                onClick={this.handlePageChange}
                class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:text-navy-200 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            </li>
            <li class="bg-slate-150 dark:bg-navy-500">
              <button
                data-page={parseInt(this.state.page) - 1}
                onClick={this.handlePageChange}
                class="flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-3 leading-tight transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
              >
                {parseInt(this.state.page) - 1}
              </button>
            </li>
            <li class="bg-slate-150 dark:bg-navy-500">
              <button
                data-page={this.state.page}
                onClick={this.handlePageChange}
                class="flex h-8 min-w-[2rem] items-center justify-center rounded-lg bg-primary px-3 leading-tight text-white transition-colors hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
              >
                {this.state.page}
              </button>
            </li>
            <li class="bg-slate-150 dark:bg-navy-500">
              <button
                data-page={parseInt(this.state.page) + 1}
                onClick={this.handlePageChange}
                class="flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-3 leading-tight transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
              >
                {parseInt(this.state.page) + 1}
              </button>
            </li>
            <li class="rounded-r-lg bg-slate-150 dark:bg-navy-500">
              <button
                data-page={this.state.totalPages}
                onClick={this.handlePageChange}
                class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:text-navy-200 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
              >
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
              </button>
            </li>
          </ol>
        )
      }
    }
  }

  handleInputChange = (event) => {
    this.setState((prevValues) => ({
      ...prevValues,
      [event.target.name]: event.target.value,
    }))
  }

  handleSubmit = (event) => {
    event.preventDefault()

    API({
      method: 'POST',
      url: 'partner/discount/create-discount',
      contentType: 'application/json',
      payload: JSON.stringify({
        branchId: this.state.branchSelectValue,
        isPercentage: JSON.parse(this.state.isPercentage),
        value: Number(this.state.discountValue),
      }),
    }).then((res) => {
      console.log(res, 'resresres')

      if (res?.message == 'discount is created successfully') {
        swal({
          title: 'Thanks',
          text: res?.message,
          icon: 'success',
          button: 'ok',
        })
        this.setState({
          isPercentage: 'true',
          discountValue: 0,
          branchSelectValue: 0,
          isCreate: !this.state.isCreate,
        })
        if (this.state.tacbleAction == 'popper-root') {
          this.setState({
            tacbleAction: 'popper-root show',
          })
        } else {
          this.setState({
            tacbleAction: 'popper-root',
          })
        }
      } else {
        swal({
          title: 'We are sorry.',
          text: res?.message,
          icon: 'warning',
          button: 'ok',
        })
      }
    })
  }
  render() {
    return (
      <main class="main-content px-[var(--margin-x)] pb-8">
        <div class="items-center justify-between">
          <div class="flex items-center space-x-4 py-5 lg:py-6">
            <h2 class="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">
              Discount Menu
            </h2>
            <div class="hidden h-full py-1 sm:flex">
              <div class="h-full w-px bg-slate-300 dark:bg-navy-600"></div>
            </div>
            <ul class="hidden flex-wrap items-center space-x-2 sm:flex">
              <li class="flex items-center space-x-2">
                <a
                  class="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent"
                  href="/settings"
                >
                  Settings
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
              <li>Discounts</li>
            </ul>
          </div>
          <div class="text-right">
            <button
              x-ref="popperRef"
              onClick={this.onToggletableAction}
              class="btn bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
            >
              Create New Discount
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6">
          <div>
            <div class="flex items-center justify-between">
              <h2 class="text-base font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">
                Discount List
              </h2>
              <div class="flex">
                {/* <div class="flex items-center" x-data="{isInputActive:false}">
                  <label class="block">
                    <input
                      x-effect="isInputActive === true && $nextTick(() => { $el.focus()});"
                      class="form-input bg-transparent px-1 text-right transition-all duration-100 placeholder:text-slate-500 dark:placeholder:text-navy-200"
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
                </div>  */}
                 <div
                  x-data="usePopper({placement:'bottom-end',offset:4})"
                  class="inline-flex"
                >
                  {/* <button
                    x-ref="popperRef"
                    class="btn h-8 w-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                    onClick={this.onToggletableAction}
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
                  </button> */}
                  <div x-ref="popperRoot" class={this.state.tacbleAction+" shadow-xl"}>
                    <div
                      style={{ height: '17rem', width: '22rem' }}
                      class="popper-box rounded-md border border-slate-150 bg-white py-1.5 font-inter dark:border-navy-500 dark:bg-navy-700"
                    >
                      <form className="space-x-6 p-6 text-left">
                        <label className="block" style={{ marginLeft: '0px' }}>
                          <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
                            Select Branch
                          </span>
                          <select
                            value={this.state.branchSelectValue}
                            onChange={this.onChangeBranch}
                            className="block appearance-none text-gray-600 w-full bg-white border border-gray-400 shadow-inner px-4 py-2 pr-8 rounded"
                          >
                            <option id={0} value={0}>
                              Select Branch
                            </option>
                            {this.state.branchList?.map(({ id, name }, key) => {
                              return (
                                <option id={key} value={id}>
                                  {name}
                                </option>
                              )
                            })}
                          </select>
                        </label>
                        <label className=" mt-3">
                          <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
                            Discount
                          </span>
                          <input
                            type="number"
                            name="discountValue"
                            value={this.state.discountValue}
                            onChange={this.handleInputChange}
                            className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                            placeholder="Exampel John"
                          />
                        </label>

                        <div className="mt-4" style={{ marginLeft: '4px' }}>
                          <legend>Is Percentage ?</legend>

                          <input
                            id="draft"
                            className="peer/draft mt-2"
                            type="radio"
                            name="isPercentage"
                            value={'true'}
                            checked={this.state.isPercentage == 'true'}
                            onChange={this.handleInputChange}
                          />
                          <label
                            for="draft"
                            className="peer-checked/draft:text-sky-500 mr-4"
                          >
                            Yes
                          </label>

                          <input
                            name="isPercentage"
                            value={'false'}
                            checked={this.state.isPercentage == 'false'}
                            onChange={this.handleInputChange}
                            id="published"
                            className="peer/published"
                            type="radio"
                          />
                          <label
                            for="published"
                            className="peer-checked/published:text-sky-500"
                          >
                            No
                          </label>
                        </div>

                        <button
                          onClick={this.handleSubmit}
                          type="button"
                          className="btn  px-3 py-1 space-x-2 bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
                          style={{
                            float: 'right',
                            marginBottom: '16px',
                          }}
                        >
                          Save
                        </button>
                      </form>
                    </div>
                  </div>
                </div> 
              </div>
            </div>
            <div class="card mt-3">
              <div
                class="is-scrollbar-hidden min-w-full overflow-x-auto"
                x-data="pages.tables.initExample1"
              >
                <table class="is-hoverable w-full text-left">
                  <thead>
                    <tr>
                      <th class="whitespace-nowrap rounded-tl-lg bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        #
                      </th>
                      <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Created At
                      </th>
                      <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Updated At
                      </th>
                      <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Discount
                      </th>
                      <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Status
                      </th>
                      <th class="whitespace-nowrap rounded-tr-lg bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {console.log(
                      this.state?.discountList,
                      'this.state.discountList',
                    )}
                    {this.state.discountList?.map((discount, index) => (
                      <tr class="border-y border-transparent border-b-slate-200 dark:border-b-navy-500">
                        <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                          {index + 1}
                        </td>
                        <td class="whitespace-nowrap px-3 py-3 font-medium text-slate-700 dark:text-navy-100 lg:px-5">
                          {moment(discount?.createdAt).format('MMMM DD, YYYY')}
                        </td>
                        <td class="whitespace-nowrap px-3 py-3 font-medium text-slate-700 dark:text-navy-100 lg:px-5">
                          {moment(discount?.updatedAt).format('MMMM DD, YYYY')}
                        </td>
                        <td class="whitespace-nowrap px-3 py-3 font-medium text-slate-700 dark:text-navy-100 lg:px-5">
                          {discount?.value +
                            (discount?.isPercentage == true ? '%' : ' AED')}
                        </td>
                        <td class="whitespace-nowrap px-3 py-3 font-medium text-slate-700 dark:text-navy-100 lg:px-5">
                          {discount?.status == 0 ?'Active': 'InActive' }
                        </td>
                        <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                          <div
                            x-data="usePopper({placement:'bottom-end',offset:4})"
                            class="inline-flex"
                          >
                            <button
                              x-ref="popperRef"
                              class="btn h-8 w-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                              onClick={() => {
                                if (
                                  document
                                    .getElementById('pooper-' + discount.id)
                                    .classList.contains('show')
                                ) {
                                  document
                                    .getElementById('pooper-' + discount.id)
                                    .classList.remove('show')
                                } else {
                                  document
                                    .getElementById('pooper-' + discount.id)
                                    .classList.add('show')
                                }
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                stroke-width="2"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                                />
                              </svg>
                            </button>

                            <div
                              id={'pooper-' + discount.id}
                              x-ref="popperRoot"
                              class="popper-root"
                            >
                              <div class="popper-box rounded-md border border-slate-150 bg-white py-1.5 font-inter dark:border-navy-500 dark:bg-navy-700">
                                <ul>
                                  <li>
                                    <button
                                      class="flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-none transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                                      onClick={() => {
                                        API({
                                          method: 'PUT',
                                          url:
                                            'partner/discount/update-status/' +
                                            discount?.id,
                                            contentType: 'application/json',
                                            payload: JSON.stringify({
                                              branchId: discount?.branchId,
                                              status: discount?.status == 0 ? 1 : 0,
                                           }),
                                        })
                                          .then((resp) => {
                                            this.setState({ isCreate: !this.state.isCreate })
                                            document
                                              .getElementById(
                                                'pooper-' + discount.id,
                                              )
                                              .classList.remove('show')
                                          })
                                          .catch((err) => {
                                            document
                                              .getElementById(
                                                'pooper-' + discount.id,
                                              )
                                              .classList.remove('show')
                                            swal({
                                              title: 'Server Not Responding',
                                              text: 'Please try again later',
                                              icon: 'warning',
                                              button: 'ok',
                                            })
                                           })
                                      }}
                                    >
                                      Change Status
                                    </button>
                                  </li>
                                </ul>
                                <div class="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody> 
                </table>
                 {this.state.discountList?.length == 0 && (
                        <div class="m-2 text-center mt-4 pt-4">
                          <i class="fas fa-file fa-6x"></i>
                          <h2 class="text-2xl font-semibold">
                            No Discount Found
                          </h2>
                          <div class="m-2">
                            <p>
                              Your discount list will appear here
                            </p>
                          </div>
                        </div>
                      )}
              </div>

              {this.state.discountList?.length !== 0 && ( <div class="flex flex-col justify-between space-y-4 px-4 py-4 sm:flex-row sm:items-center sm:space-y-0 sm:px-5">
                <div class="flex items-center space-x-2 text-xs+">
                  <span>Show</span>
                  <label class="block">
                    <select
                      onChange={this.handleRecordCountChange}
                      class="form-select rounded-full border border-slate-300 bg-white px-2 py-1 pr-6 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="15">15</option>
                      <option value="20">20</option>
                    </select>
                  </label>
                  <span>entries</span>
                </div>

                {this.pagination()}

                <div class="text-xs+">
                  {(this.state.page - 1) * this.state.pageRecordCount} -{' '}
                  {this.state.page * this.state.pageRecordCount} of{' '}
                  {this.state.servicesCount} entries
                </div>
              </div>)}
            </div>
          </div>
        </div>
      </main>
    )
  }
}
