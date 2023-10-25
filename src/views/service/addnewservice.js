import React from 'react'
import swal from 'sweetalert'
import axios from 'axios'
import configData from '../../utils/constants/config.json'

export default class AddNewService extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      basicInfo: true,
      booking: false,
      team: false,
      pricing: false,
      confirmation: false,
      teams: [],
      categories: [],
      subcategories: [],
      taxes: [],
      genders: [],
      pricetypes: [],
      branches: [],
      name: '',
      subcategory: null,
      category: null,
      gender: null,
      description: '',
      aftercare: '',
      branch: '',
      onlinebooking: true,
      vouchersale: true,
      tax: null,
      serviceteam: [],
      // intial of multiple tabs
      count: 1,
       isSpecialPriceGreater:false, 
       isSubmitDisabled: [],
      inputsNew: [
        {
          pricename: null,
          priceduration: null,
          specialprice: 0,
          pricetype: null,
          pricefrom: null,
          extratime:true
        },
      ],
      pricename: null,
      priceduration: 0,
      specialprice: 0,
      pricetype: null,
      pricefrom: 0,
      extratime: false,
      extratimeduration: 0,
      inputCount: 1,
      inputs: [{ id: 1 }],
      addNewOption: Array.from(Array(1).keys()),
    }
  }
  // second onchange function
  handleInputChangeNew = (event, index, key, pricefrom, specialprice) => {
    const { value } = event.target;
    const isSpecialPriceGreater = parseInt(pricefrom) <= parseInt(value);
    
    // Check if the special price is greater than the new regular price
    const isNewSpecialPriceGreater = parseInt(value) > parseInt(specialprice);
   

    this.setState((prevState) => {
      const inputs = [...prevState.inputsNew];
      inputs[index][key] = value;
      inputs[index].isSpecialPriceGreater = isSpecialPriceGreater;
      inputs[index].isNewSpecialPriceGreater = isNewSpecialPriceGreater;
      return { inputs,   };
    });
  };

  //   also select one
  handleSelectChange = (event, index) => {
    const { value } = event.target
    this.setState((prevState) => {
      const inputsNew = [...prevState.inputsNew]
      inputsNew[index].pricetype = value
      return { inputsNew }
    })
  }
  //   handle increase options
  handleIncrementCount = () => {
    this.setState((prevState) => {
      const count = prevState.count + 1
      const inputsNew = [
        ...prevState.inputsNew,
        { value: '', option: 'Option 1' },
      ]
      return { count, inputsNew }
    })
  }

  handleIncrement = () => {
    const newInputCount = this.state.inputCount + 1
    const newInput = { id: newInputCount }
    this.setState({
      inputCount: newInputCount,
      inputs: [...this.state.inputs, newInput],
    })
  }
  handleChange = (event, inputId) => {
    const updatedInputs = [...this.state.inputs]
    const inputIndex = updatedInputs.findIndex((input) => input.id === inputId)
    updatedInputs[inputIndex][event.target.name] = event.target.value
    this.setState({ inputs: updatedInputs })
  }

  removeHandler = (searchObj) => {
    this.setState({
      inputsNew: this.state.inputsNew.filter(
        (obj) => obj.pricename !== searchObj.pricename,
      ),
    })
  }
  componentDidMount() {
    axios({
      method: 'get',
      url: configData.SERVER_URL + 'partner/service/createServicePreLoad',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        accesstoken: configData.ACCESSTOKEN,
        logintoken: localStorage.getItem('loginToken'),
      },
    })
      .then((resp) => {
        console.log(resp.data)
       
        if (parseInt(Object.keys(resp.data)[0]) === 200) {
          if(resp.data.teams.length < 1) {
            swal({
              title: 'Service',
              text: 'Please cretae service providor first',
              icon: 'info',
              button: 'ok',
            }).then(function(){
              window.location.replace('/team/addnewteammember')
            })
          }
          this.setState({
            teams: resp.data.teams,
            categories: resp.data.categories,
            subcategories: resp.data.subcategories,
            taxes: resp.data.taxes,
            genders: resp.data.genders,
            pricetypes: resp.data.pricetypes,
            branches: resp.data.branches,
            tax:resp.data.taxes[0].id
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
        console.log(err)
      })
    let durations = []
    for (let index = 10; index <= 720; index += 10) {
      durations.push(index)
    }
  }

  handleInputChange = (event) => {
    event.preventDefault()
    this.setState({
      [event.target.id]: event.target.value,
    })
  }

  handleBasicInfoNext = (event) => {
    event.preventDefault()
    console.log(this.state.branch)
    if (this.state.name === null) {
      document.getElementById('name').focus()
      return
    }
    if (this.state.category === null) {
      document.getElementById('category').focus()
      return
    }
    if (this.state.subcategory === null) {
      document.getElementById('subcategory').focus()
      return
    }
    if (this.state.gender === null) {
      document.getElementById('gender').focus()
      return
    }
    if (this.state.branch === null || this.state.branch === "" || this.state.branch === undefined) {
      document.getElementById('branch').focus()
      return
    }
    this.setState({
      basicInfo: false,
      booking: true,
    })
  }

  handleBookingNext = (event) => {
    event.preventDefault()
    if (this.state.tax === null) {
      document.getElementById('tax').focus()
      return
    }
    axios({
      method: 'get',
      url: configData.SERVER_URL + `customer/appointments/service-providers/${this.state.branch}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        accesstoken: configData.ACCESSTOKEN,
        logintoken: localStorage.getItem('loginToken'),
      },
    }).then((resp) => {
        console.log(resp.data)
        if (parseInt(Object.keys(resp.data)[0]) === 200) { 
          if(resp.data.data.teamMembers.length < 1) {
            const selectedBranch= this.state.branches?.filter((branch)=>branch.id==this.state.branch)
            console.log(selectedBranch, this.state.branch,this.state.branches, 'selectedBranch')
            swal({
              title: 'Service',
              text: 'Please cretae service providor in '+selectedBranch[0]?.name+" branch",
              icon: 'info',
              button: 'ok',
            }).then(function(){
              window.location.replace('/team/addnewteammember')
            })
          }else{
            this.setState({
              teams: resp.data.data.teamMembers,
              booking: false,
              team: true,
            })
          }
        }
    }).catch((err) => {
        swal({
          title: 'Server Not Responding',
          text: 'Please try again later',
          icon: 'warning',
          button: 'ok',
        })
        console.log(err)
    })
  }

  handleTeamNext = (event) => {
    event.preventDefault()
    if(this.state.serviceteam.length > 0){
      this.setState({
        team: false,
        pricing: true,
      })
    }else{
      swal({
        title: 'Service Provider',
        text: 'Please add atleast one service provider',
        icon: 'info',
        button: 'ok',
      })
    }
  }

  handlePriceNext = (event) => {
    event.preventDefault()
    console.log(this.state.isSpecialPriceGreater, this.state.inputsNew, 'this.state.isSpecialPriceGreater')
   const isSubmitDisabled= this.state.inputsNew.some((input) => input.isSpecialPriceGreater)
    if(isSubmitDisabled){
      return
    }
    if (this.state.inputsNew[0]?.pricename === null) {
      document.getElementById('pricename').focus()
      return
    }
    if (this.state.inputsNew[0]?.priceduration === null) {
      document.getElementById('priceduration').focus()
      return
    }
    if (this.state.inputsNew[0]?.pricetype === null) {
      document.getElementById('pricetype').focus()
      return
    }
    if (this.state.inputsNew[0]?.pricefrom === null) {
      document.getElementById('pricefrom').focus()
      return
    }
    if (this.state.isSpecialPriceGreater && this.state.inputsNew[0]?.specialprice != null && this.state.inputsNew[0]?.specialprice != "") {
      document.getElementById('specialprice').focus()
      return
    }
    this.setState({
      pricing: false,
      confirmation: true,
    })
  }

  selectTeam = (event) => {
    event.preventDefault()
    if (this.state.serviceteam.includes(event.currentTarget.id)) {
      this.setState({
        serviceteam: this.state.serviceteam.filter(function (service) {
          return service !== event.currentTarget.id
        }),
      })
      document.getElementById(event.currentTarget.id).classList.remove('border')
      document
        .getElementById(event.currentTarget.id)
        .classList.remove('border-primary')
    } else {
      this.setState({
        serviceteam: [...this.state.serviceteam, event.currentTarget.id],
      })
      document.getElementById(event.currentTarget.id).classList.add('border')
      document
        .getElementById(event.currentTarget.id)
        .classList.add('border-primary')
    }
  }

  handleConfirmService = (event) => {
    event.preventDefault()
    console.log(this.state)
    
    const prices = this.state.inputsNew.map((each) => {
      return {
        name: each.pricename,
        duration: parseInt(each.priceduration),
        specialprice: parseInt(each.specialprice),
        pricetype: parseInt(each.pricetype),
        pricefrom: parseInt(each.pricefrom),
      }
    })
    var dataval = JSON.stringify({
      name: this.state.name,
      category: parseInt(this.state.category),
      subcategory: parseInt(this.state.subcategory),
      branch: parseInt(this.state.branch),
      tax: parseInt(this.state.tax),
      description: this.state.description,
      aftercare: this.state.aftercare,
      gender: parseInt(this.state.gender),
      onlinebooking: this.state.onlinebooking ? 1 : 0,
      vouchersale: this.state.vouchersale ? 1 : 0,
      extratimeduration: parseInt(this.state.extratimeduration),
      extratime: this.state.extratime ? 1 : 0,
      prices: prices,
      serviceteam:this.state.serviceteam,

    })

    var config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: configData.SERVER_URL + 'partner/service/createService',
      headers: {
        'Content-Type': 'application/json',
        accesstoken: configData.ACCESSTOKEN,
        logintoken: localStorage.getItem('loginToken'),
        // accesstoken:
        //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ',
        // logintoken:
        //   '4rlscAvZvJSQu967O2FE6e0KQn5R0YmvyvDpImQj3lyOaof_ajOVmYiOedutU-wGnE_VTJ7eIOlINQZb5jfKodyxXDrHWJAMQkws_ZKzD0yU0i3pI8bx10hObVYdDAtOdAMbkCiWQ4-1ouMqQsAZub',
        // 'Content-Type': 'application/json',
        // Cookie:
        //   'connect.sid=s%3AGNV5_Ht2A3CRTpmiMKLRkjWvWluIQuNt.D6CUd8SVW1OFnfKHWS%2FUCG6SR7yvREwEHggjeI9hMIk',
      },
      data: dataval,
    }

    axios(config)
      .then((resp) => {
        if (parseInt(Object.keys(resp.data)[0]) === 200) {
            window.location.replace('/services/servicelist')
        } else {
          swal({
            title: 'Service Information',
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
        console.log(err)
      })
  }

  // add new option for price
  addPriceSlot = (event) => {
    event.preventDefault()
    this.setState({
      prices: [
        ...this.state.prices,
        {
          id: null,
          service: this.state.selectedserviceId,
          name: '',
          duration: 0,
          pricetype: null,
          pricefrom: 0,
          specialprice: 0,
        },
      ],
    })
    console.log(this.state.prices)
  }

  handleExtraTimeChange = (index, event) => {
    const { checked } = event.target;
    console.log(index, event, 'index, event')

    this.setState({inputsNew:[...this.state.inputsNew, {...this.state.inputsNew[index],extratime:event }]});
  } 
  render() {
    const { count, inputsNew } = this.state
    return (
      <main className="main-content px-[var(--margin-x)] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6">
          <h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">
            Add New Service
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
            <li>Add New Service</li>
          </ul>
        </div>

        <div
          className={
            this.state.basicInfo
              ? 'grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6'
              : 'grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6 hide'
          }
        >
          <div className="col-span-12 grid lg:col-span-4 lg:place-items-center">
            <div>
              <ol className="steps is-vertical line-space [--size:2.75rem] [--line:.5rem]">
                <li className="step space-x-4 pb-12 before:bg-slate-200 dark:before:bg-navy-500">
                  <div className="step-header mask is-hexagon bg-primary text-white dark:bg-accent">
                    <i className="fa-solid fa-layer-group text-base"></i>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-slate-400 dark:text-navy-300">
                      Step 1
                    </p>
                    <h3 className="text-base font-medium text-primary dark:text-accent-light">
                      Basic Info
                    </h3>
                  </div>
                </li>
                <li className="step space-x-4 pb-12 before:bg-slate-200 dark:before:bg-navy-500">
                  <div className="step-header mask is-hexagon bg-slate-200 text-slate-500 dark:bg-navy-500 dark:text-navy-100">
                    <i className="fa-solid fa-ticket text-base"></i>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-slate-400 dark:text-navy-300">
                      Step 2
                    </p>
                    <h3 className="text-base font-medium">Booking</h3>
                  </div>
                </li>
                <li className="step space-x-4 pb-12 before:bg-slate-200 dark:before:bg-navy-500">
                  <div className="step-header mask is-hexagon bg-slate-200 text-slate-500 dark:bg-navy-500 dark:text-navy-100">
                    <i className="fa-solid fa-users text-base"></i>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-slate-400 dark:text-navy-300">
                      Step 3
                    </p>
                    <h3 className="text-base font-medium">Team</h3>
                  </div>
                </li>
                <li className="step space-x-4 pb-12 before:bg-slate-200 dark:before:bg-navy-500">
                  <div className="step-header mask is-hexagon bg-slate-200 text-slate-500 dark:bg-navy-500 dark:text-navy-100">
                    <i className="fa-solid fa-tag text-base"></i>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-slate-400 dark:text-navy-300">
                      Step 4
                    </p>
                    <h3 className="text-base font-medium">Pricing</h3>
                  </div>
                </li>
                <li className="step space-x-4 before:bg-slate-200 dark:before:bg-navy-500">
                  <div className="step-header mask is-hexagon bg-slate-200 text-slate-500 dark:bg-navy-500 dark:text-navy-100">
                    <i className="fa-solid fa-check text-base"></i>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-slate-400 dark:text-navy-300">
                      Step 5
                    </p>
                    <h3 className="text-base font-medium">Confirm</h3>
                  </div>
                </li>
              </ol>
            </div>
          </div>
          <div className="col-span-12 grid lg:col-span-8">
            <div className="card">
              <div className="border-b border-slate-200 p-4 dark:border-navy-500 sm:px-5">
                <div className="flex items-center space-x-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 p-1 text-primary dark:bg-accent-light/10 dark:text-accent-light">
                    <i className="fa-solid fa-layer-group"></i>
                  </div>
                  <h4 className="text-lg font-medium text-slate-700 dark:text-navy-100">
                    Basic Infomation
                  </h4>
                </div>
              </div>
              <div className="space-y-4 p-4 sm:p-5 text-left">
                <label className="block">
                  <span>Service Name*</span>
                  <input
                    className="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                    placeholder="Enter Your Service Name"
                    type="text"
                    id="name"
                    onChange={this.handleInputChange}
                  />
                </label>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span>Service Categories*</span>
                      <select
                        className="mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent  px-3 py-2"
                        id="category"
                        onChange={this.handleInputChange}
                      >
                        <option value="" hidden>
                          Service Categories
                        </option>
                        {this.state.categories.map((category) => (
                          <option value={category.id}>{category.name}</option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span>Service Sub Category*</span>
                      <select
                        className="mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent  px-3 py-2"
                        id="subcategory"
                        onChange={this.handleInputChange}
                      >
                        <option value="" hidden>
                         Select Sub Category
                        </option>
                        {this.state.subcategories
                          .filter(
                            (subcategory) =>
                              subcategory.category == this.state.category,
                          )
                          .map((filteredsubcategory) => (
                            <option value={filteredsubcategory.id}>
                              {filteredsubcategory.name}
                            </option>
                          ))}
                      </select>
                    </label>
                  </div>
                  <label className="block">
                    <span>Service Available for*</span>
                    <select
                      className="mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent  px-3 py-2"
                      id="gender"
                      onChange={this.handleInputChange}
                    >
                      <option value="" hidden>
                        Select Option
                      </option>
                      {this.state.genders.map((gender) => (
                        <option value={gender.id}>{gender.name}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span>Service description</span>
                    <textarea
                      rows="4"
                      placeholder="Enter Service Description"
                      className="form-textarea w-full resize-none rounded-lg border border-slate-300 bg-transparent p-2.5 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                      id="description"
                      onChange={this.handleInputChange}
                    ></textarea>
                  </label>
                  <label className="block">
                    <span>Aftercare description</span>
                    <textarea
                      rows="4"
                      placeholder="Enter Aftercare Description"
                      className="form-textarea w-full resize-none rounded-lg border border-slate-300 bg-transparent p-2.5 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                      id="aftercare"
                      onChange={this.handleInputChange}
                    ></textarea>
                  </label>
                </div>

                <label className="block">
                  <span>Set branch*</span>
                  <select
                    className="mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent  px-3 py-2"
                    id="branch"
                    onChange={this.handleInputChange}
                  >
                    <option value="" hidden>
                      Select Option
                    </option>
                    {this.state.branches.map((branch) => (
                      <option value={branch.id}>{branch.address}</option>
                    ))}
                  </select>
                </label>

                <div className="flex justify-center space-x-2 pt-4">
                  <button className="btn space-x-2 bg-slate-150 font-medium text-slate-800 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200/80 dark:bg-navy-500 dark:text-navy-50 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span>Prev</span>
                  </button>
                  <button
                    className="btn space-x-2 bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
                    onClick={this.handleBasicInfoNext}
                  >
                    <span>Next</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={
            this.state.booking
              ? 'grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6'
              : 'grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6 hide'
          }
        >
          <div className="col-span-12 grid lg:col-span-4 lg:place-items-center">
            <div>
              <ol className="steps is-vertical line-space [--size:2.75rem] [--line:.5rem]">
                <li className="step space-x-4 pb-12 before:bg-primary dark:before:bg-navy-500">
                  <div className="step-header mask is-hexagon bg-primary text-white dark:bg-accent">
                    <i className="fa-solid fa-layer-group text-base"></i>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-slate-400 dark:text-navy-300">
                      Step 1
                    </p>
                    <h3 className="text-base font-medium text-primary dark:text-accent-light">
                      Basic Info
                    </h3>
                  </div>
                </li>
                <li className="step space-x-4 pb-12 before:bg-slate-200 dark:before:bg-navy-500">
                  <div className="step-header mask is-hexagon bg-primary text-white dark:bg-accent">
                    <i className="fa-solid fa-ticket text-base"></i>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-slate-400 dark:text-navy-300">
                      Step 2
                    </p>
                    <h3 className="text-base font-medium">Booking</h3>
                  </div>
                </li>
                <li className="step space-x-4 pb-12 before:bg-slate-200 dark:before:bg-navy-500">
                  <div className="step-header mask is-hexagon bg-slate-200 text-slate-500 dark:bg-navy-500 dark:text-navy-100">
                    <i className="fa-solid fa-users text-base"></i>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-slate-400 dark:text-navy-300">
                      Step 3
                    </p>
                    <h3 className="text-base font-medium">Team</h3>
                  </div>
                </li>
                <li className="step space-x-4 pb-12 before:bg-slate-200 dark:before:bg-navy-500">
                  <div className="step-header mask is-hexagon bg-slate-200 text-slate-500 dark:bg-navy-500 dark:text-navy-100">
                    <i className="fa-solid fa-tag text-base"></i>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-slate-400 dark:text-navy-300">
                      Step 4
                    </p>
                    <h3 className="text-base font-medium">Pricing</h3>
                  </div>
                </li>
                <li className="step space-x-4 before:bg-slate-200 dark:before:bg-navy-500">
                  <div className="step-header mask is-hexagon bg-slate-200 text-slate-500 dark:bg-navy-500 dark:text-navy-100">
                    <i className="fa-solid fa-check text-base"></i>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-slate-400 dark:text-navy-300">
                      Step 5
                    </p>
                    <h3 className="text-base font-medium">Confirm</h3>
                  </div>
                </li>
              </ol>
            </div>
          </div>
          <div className="col-span-12 grid lg:col-span-8">
            <div className="card">
              <div className="border-b border-slate-200 p-4 dark:border-navy-500 sm:px-5">
                <div className="flex items-center space-x-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 p-1 text-primary dark:bg-accent-light/10 dark:text-accent-light">
                    <i className="fa-solid fa-ticket"></i>
                  </div>
                  <h4 className="text-lg font-medium text-slate-700 dark:text-navy-100">
                    Booking
                  </h4>
                </div>
              </div>
              <div className="space-y-4 p-4 sm:p-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
                  <label className="inline-flex items-center space-x-2">
                    Enable online bookings, choose who the service is available
                    for and add a short description.
                  </label>
                  <label className="inline-flex items-center space-x-2">
                    <input
                      className="form-switch h-5 w-10 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-accent dark:checked:before:bg-white"
                      type="checkbox"
                      value="true"
                      defaultChecked={this.state.onlinebooking}
                      id="onlinebooking"
                      onChange={() => {
                        this.setState(({ onlinebooking }) => ({
                          onlinebooking: !onlinebooking,
                        }))
                      }}
                    />
                    <span>Enable Online Booking.</span>
                  </label>
                </div>
                <div className="my-3 mx-4 h-px bg-slate-200 dark:bg-navy-500"></div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
                  <label className="inline-flex items-center space-x-2">
                    Enable voucher sale, choose who the service is available for
                    and add a short description.
                  </label>
                  <label className="inline-flex items-center space-x-2">
                    <input
                      className="form-switch h-5 w-10 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-accent dark:checked:before:bg-white"
                      type="checkbox"
                      value="true"
                      defaultChecked={this.state.vouchersale}
                      id="vouchersale"
                      onChange={() => {
                        this.setState(({ vouchersale }) => ({
                          vouchersale: !vouchersale,
                        }))
                      }}
                    />
                    <span>Enable Voucher Sales.</span>
                  </label>
                </div>
                <div className="my-3 mx-4 h-px bg-slate-200 dark:bg-navy-500"></div>
                <label className="block">
                  <span>Set Tax Rate*</span>
                  <select
                    className="mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent  px-3 py-2"
                    id="tax"
                    onChange={this.handleInputChange}
                  >
                    <option value="" hidden>
                      Select Option
                    </option>
                    {this.state.taxes.length > 0 ?<option value={this.state.taxes[0].id} hidden selected>{this.state.taxes[0].name}</option> : <></> }
                    {this.state.taxes.map((tax) => (
                      <option value={tax.id}>{tax.name}</option>
                    ))}
                  </select>
                </label>

                <div className="flex justify-center space-x-2 pt-4">
                  <button
                    className="btn space-x-2 bg-slate-150 font-medium text-slate-800 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200/80 dark:bg-navy-500 dark:text-navy-50 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
                    onClick={() =>
                      this.setState({
                        basicInfo: true,
                        booking: false,
                      })
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span>Prev</span>
                  </button>
                  <button
                    className="btn space-x-2 bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
                    onClick={this.handleBookingNext}
                  >
                    <span>Next</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={
            this.state.team
              ? 'grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6'
              : 'grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6 hide'
          }
        >
          <div className="col-span-12 grid lg:col-span-4 lg:place-items-center">
            <div>
              <ol className="steps is-vertical line-space [--size:2.75rem] [--line:.5rem]">
                <li className="step space-x-4 pb-12 before:bg-primary dark:before:bg-navy-500">
                  <div className="step-header mask is-hexagon bg-primary text-white dark:bg-accent">
                    <i className="fa-solid fa-layer-group text-base"></i>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-slate-400 dark:text-navy-300">
                      Step 1
                    </p>
                    <h3 className="text-base font-medium text-primary dark:text-accent-light">
                      Basic Info
                    </h3>
                  </div>
                </li>
                <li className="step space-x-4 pb-12 before:bg-primary dark:before:bg-navy-500">
                  <div className="step-header mask is-hexagon bg-primary text-white dark:bg-accent">
                    <i className="fa-solid fa-ticket text-base"></i>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-slate-400 dark:text-navy-300">
                      Step 2
                    </p>
                    <h3 className="text-base font-medium">Booking</h3>
                  </div>
                </li>
                <li className="step space-x-4 pb-12 before:bg-slate-200 dark:before:bg-navy-500">
                  <div className="step-header mask is-hexagon bg-primary text-white dark:bg-accent">
                    <i className="fa-solid fa-users text-base"></i>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-slate-400 dark:text-navy-300">
                      Step 3
                    </p>
                    <h3 className="text-base font-medium">Team</h3>
                  </div>
                </li>
                <li className="step space-x-4 pb-12 before:bg-slate-200 dark:before:bg-navy-500">
                  <div className="step-header mask is-hexagon bg-slate-200 text-slate-500 dark:bg-navy-500 dark:text-navy-100">
                    <i className="fa-solid fa-tag text-base"></i>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-slate-400 dark:text-navy-300">
                      Step 4
                    </p>
                    <h3 className="text-base font-medium">Pricing</h3>
                  </div>
                </li>
                <li className="step space-x-4 before:bg-slate-200 dark:before:bg-navy-500">
                  <div className="step-header mask is-hexagon bg-slate-200 text-slate-500 dark:bg-navy-500 dark:text-navy-100">
                    <i className="fa-solid fa-check text-base"></i>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-slate-400 dark:text-navy-300">
                      Step 5
                    </p>
                    <h3 className="text-base font-medium">Confirm</h3>
                  </div>
                </li>
              </ol>
            </div>
          </div>

          <div className="col-span-12 grid lg:col-span-8">
            <div className="card">
              <div className="border-b border-slate-200 p-4 dark:border-navy-500 sm:px-5">
                <div className="flex items-center space-x-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 p-1 text-primary dark:bg-accent-light/10 dark:text-accent-light">
                    <i className="fa-solid fa-users"></i>
                  </div>
                  <h4 className="text-lg font-medium text-slate-700 dark:text-navy-100">
                    Team
                  </h4>
                </div>
              </div>
              <div className="space-y-4 p-4 sm:p-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
                  {this.state.teams.map((team) => (
                    <div
                      className="card hover:bg-primary hover:text-white"
                      id={team.id}
                      onClick={this.selectTeam}
                    >
                      <div className="flex flex-col items-center p-4 text-center sm:p-5">
                        <div className="avatar h-20 w-20">
                          <img
                            className="rounded-full"
                            src={team.profileimage}
                            alt={team.firstname + ' ' + team.lastname}
                          />
                        </div>
                        <h3 className="pt-3 text-lg font-medium">
                          {team.firstname + ' ' + team.lastname}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center space-x-2 pt-4">
                  <button
                    className="btn space-x-2 bg-slate-150 font-medium text-slate-800 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200/80 dark:bg-navy-500 dark:text-navy-50 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
                    onClick={() =>
                      this.setState({
                        booking: true,
                        team: false,
                      })
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span>Prev</span>
                  </button>
                  <button
                    className="btn space-x-2 bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
                    onClick={this.handleTeamNext}
                  >
                    <span>Next</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* pricing sections  */}
        <div
          className={
            this.state.pricing
              ? 'grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6'
              : 'grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6 hide'
          }
        >
          <div className="col-span-12 grid lg:col-span-4 lg:place-items-center">
            <div>
              <ol className="steps is-vertical line-space [--size:2.75rem] [--line:.5rem]">
                <li className="step space-x-4 pb-12 before:bg-primary dark:before:bg-navy-500">
                  <div className="step-header mask is-hexagon bg-primary text-white dark:bg-accent">
                    <i className="fa-solid fa-layer-group text-base"></i>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-slate-400 dark:text-navy-300">
                      Step 1
                    </p>
                    <h3 className="text-base font-medium text-primary dark:text-accent-light">
                      Basic Info
                    </h3>
                  </div>
                </li>
                <li className="step space-x-4 pb-12 before:bg-primary dark:before:bg-navy-500">
                  <div className="step-header mask is-hexagon bg-primary text-white dark:bg-accent">
                    <i className="fa-solid fa-ticket text-base"></i>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-slate-400 dark:text-navy-300">
                      Step 2
                    </p>
                    <h3 className="text-base font-medium">Booking</h3>
                  </div>
                </li>
                <li className="step space-x-4 pb-12 before:bg-primary dark:before:bg-navy-500">
                  <div className="step-header mask is-hexagon bg-primary text-white dark:bg-accent">
                    <i className="fa-solid fa-users text-base"></i>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-slate-400 dark:text-navy-300">
                      Step 3
                    </p>
                    <h3 className="text-base font-medium">Team</h3>
                  </div>
                </li>
                <li className="step space-x-4 pb-12 before:bg-slate-200 dark:before:bg-navy-500">
                  <div className="step-header mask is-hexagon bg-primary text-white dark:bg-accent">
                    <i className="fa-solid fa-tag text-base"></i>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-slate-400 dark:text-navy-300">
                      Step 4
                    </p>
                    <h3 className="text-base font-medium">Pricing</h3>
                  </div>
                </li>
                <li className="step space-x-4 before:bg-slate-200 dark:before:bg-navy-500">
                  <div className="step-header mask is-hexagon bg-slate-200 text-slate-500 dark:bg-navy-500 dark:text-navy-100">
                    <i className="fa-solid fa-check text-base"></i>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-slate-400 dark:text-navy-300">
                      Step 5
                    </p>
                    <h3 className="text-base font-medium">Confirm</h3>
                  </div>
                </li>
              </ol>
            </div>
          </div>
          {/* Pricing container */}
          <div className="col-span-12 grid lg:col-span-8">
            <div className="card">
              <div className="border-b border-slate-200 p-4 dark:border-navy-500 sm:px-5">
                <div className="flex items-center space-x-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 p-1 text-primary dark:bg-accent-light/10 dark:text-accent-light">
                    <i className="fa-solid fa-tag"></i>
                  </div>
                  <h4 className="text-lg font-medium text-slate-700 dark:text-navy-100">
                    Pricing
                  </h4>
                </div>
              </div>
              {/* pricing tabs */}
               <div className="space-y-4 p-4 sm:p-5">
                {inputsNew?.map((input, index) => {
                  return (
                    <div style={{ borderTop: index > 0 && '2px solid' }}>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => this.removeHandler(input)}
                          className="btn mt-2 border-dotted border-2 border-indigo-600  grid grid-cols-1 gap-4 sm:grid-cols-1 text-xs+ pl-0 text-dark"
                        >
                          <span>
                            {' '}
                            Remove <i className="fa-solid fa-close"></i>
                          </span>
                        </button>
                      )}
                      <label
                        className={`block ${
                          this.state.addNewOption?.length > 1 &&
                          'border-t-4 border-stone-800'
                        }`}
                      >
                        <span>Price Name*</span>
                        <input
                          className="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                          placeholder="Price Name"
                          type="text"
                          id="pricename"
                          value={input.pricename}
                          onChange={(e) =>
                            this.handleInputChangeNew(e, index, 'pricename')
                          }
                        />
                      </label>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
                        <div className="grid grid-cols-1">
                          <label className="block">Duration*</label>
                          <label className="flex -space-x-px">
                            <input
                              className="form-input w-full border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                              placeholder="Enter Price Duration"
                              type="number"
                              id="priceduration"
                              value={input.priceduration}
                              onChange={(e) =>
                                this.handleInputChangeNew(
                                  e,
                                  index,
                                  'priceduration',
                                )
                              }
                            />
                            <div className="flex items-center justify-center rounded-r-lg border border-slate-300 px-3.5 font-inter dark:border-navy-450">
                              <span>Minutes</span>
                            </div>
                          </label>
                        </div>
                        <div className="grid grid-cols-1">
                          <label className="block">Price Type*</label>
                          <label className="flex -space-x-px">
                            <select
                              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent  px-3 py-2"
                              id="pricetype"
                              value={input.pricetype}
                              onChange={(e) =>
                                this.handleSelectChange(e, index)
                              }
                            >
                              <option value="" hidden>
                                Select Price Type
                              </option>
                              {this.state.pricetypes.map((pricetype) => (
                                <option value={pricetype.id}>
                                  {pricetype.type}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
                        <div className="grid grid-cols-1">
                          <label className="block">Price*</label>
                          <label className="flex -space-x-px">
                            <div className="flex items-center justify-center rounded-l-lg border border-slate-300 px-3.5 font-inter dark:border-navy-450">
                              <span>AED</span>
                            </div>
                            <input
                              className="form-input w-full border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                              placeholder="Enter Price"
                              type="number"
                              id="pricefrom"
                              value={input.pricefrom}
                              onChange={(e) =>
                                this.handleInputChangeNew(e, index, 'pricefrom')
                              }
                            />
                            <div className="flex items-center justify-center rounded-r-lg border border-slate-300 px-3.5 font-inter dark:border-navy-450">
                              <span>.00</span>
                            </div>
                          </label>
                        </div>
                        <div className="grid grid-cols-1" id="special-price">
                          <label className="block">
                            Special Price (Optional)
                          </label>
                          <label className="flex -space-x-px">
                            <div className="flex items-center justify-center rounded-l-lg border border-slate-300 px-3.5 font-inter dark:border-navy-450">
                              <span>AED</span>
                            </div>
                            <input
                              className="form-input w-full border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                              placeholder="Enter Price"
                              type="number"
                              id="specialprice"
                              value={input.specialprice}
                              onChange={(e) => this.handleInputChangeNew(
                                  e,
                                  index,
                                  'specialprice',
                                  input.pricefrom, input.specialprice
                                ) 
                            }
                            />
                            <div className="flex items-center justify-center rounded-r-lg border border-slate-300 px-3.5 font-inter dark:border-navy-450">
                              <span>.00</span>
                            </div>
                          </label>
                          {/* {(this.state.isSpecialPriceGreater ==true && input.specialprice)?<span>The special price must be less than normal price.</span>:""} */}
                          {(input.isSpecialPriceGreater && input.specialprice) ? <span style={{color:"red"}}>The special price must be less than the normal price.</span> : ""}
                          {/* {(input.isSpecialPriceGreater && input.specialprice) ? (
                                <span>The special price must be less than the normal price.</span>
                              ) : (
                                input.isNewSpecialPriceGreater ? (
                                  <span>The special price must be less than the new normal price.</span>
                                ) : null
                              )} */}

                        </div>
                      </div>
                      <div className="my-3 mx-4 h-px bg-slate-200 dark:bg-navy-500"></div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
                        <label className="inline-flex items-center space-x-2">
                          Enable extra time after the service.
                        </label>
                        <label className="inline-flex items-center space-x-2">
                          <input
                            className="form-switch h-5 w-10 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-accent dark:checked:before:bg-white"
                            type="checkbox"
                            value="true"
                            id="extratime"
                            onChange={() => {
                              this.setState(({ extratime }) => ({
                                extratime: !extratime,
                              }))
                            }}
                          />
                          <span>Enable Extra Time.</span>
                        </label>
                      </div>

                      {this.state.extratime ? (
                        <div className="grid grid-cols-1 gap-4">
                          <label className="block">Extra Time Duration*</label>
                          <label className="mt-1 flex -space-x-px">
                            <input
                              className="form-input w-full border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                              placeholder="Enter Price Duration"
                              type="number"
                              id="extratimeduration"
                              value={input.extratimeduration}
                              onChange={(e) =>
                                this.handleInputChangeNew(
                                  e,
                                  index,
                                  'extratimeduration',
                                )
                              }
                            />
                            <div className="flex items-center justify-center rounded-r-lg border border-slate-300 px-3.5 font-inter dark:border-navy-450">
                              <span>Minutes</span>
                            </div>
                          </label>
                        </div>
                      ) : null}
                    </div>
                  )
                })}
                {/* add more option */}
                <button
                  type="button"
                  className="border-dashed border-2 p-2 grid grid-cols-1 gap-4 sm:grid-cols-1 text-xs+ text-info"
                  onClick={this.handleIncrementCount}
                >
                  <span>
                    Add New Option <i className="fa-solid fa-plus"></i>
                  </span>
                </button>

                <div className="flex justify-center space-x-2 pt-4">
                  <button
                    className="btn space-x-2 bg-slate-150 font-medium text-slate-800 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200/80 dark:bg-navy-500 dark:text-navy-50 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
                    onClick={() =>
                      this.setState({
                        team: true,
                        pricing: false,
                      })
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span>Prev</span>
                  </button>
                  <button
                    className="btn space-x-2 bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
                    onClick={this.handlePriceNext}
                  >
                    <span>Next</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* end of pricing tab one  */}
            </div>
          </div>
        </div>

        <div
          className={
            this.state.confirmation
              ? 'grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6'
              : 'grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6 hide'
          }
        >
          <div className="col-span-12 grid lg:col-span-4 lg:place-items-center">
            <div>
              <ol className="steps is-vertical line-space [--size:2.75rem] [--line:.5rem]">
                <li className="step space-x-4 pb-12 before:bg-primary dark:before:bg-navy-500">
                  <div className="step-header mask is-hexagon bg-primary text-white dark:bg-accent">
                    <i className="fa-solid fa-layer-group text-base"></i>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-slate-400 dark:text-navy-300">
                      Step 1
                    </p>
                    <h3 className="text-base font-medium text-primary dark:text-accent-light">
                      Basic Info
                    </h3>
                  </div>
                </li>
                <li className="step space-x-4 pb-12 before:bg-primary dark:before:bg-navy-500">
                  <div className="step-header mask is-hexagon bg-primary text-white dark:bg-accent">
                    <i className="fa-solid fa-ticket text-base"></i>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-slate-400 dark:text-navy-300">
                      Step 2
                    </p>
                    <h3 className="text-base font-medium">Booking</h3>
                  </div>
                </li>
                <li className="step space-x-4 pb-12 before:bg-primary dark:before:bg-navy-500">
                  <div className="step-header mask is-hexagon bg-primary text-white dark:bg-accent">
                    <i className="fa-solid fa-users text-base"></i>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-slate-400 dark:text-navy-300">
                      Step 3
                    </p>
                    <h3 className="text-base font-medium">Team</h3>
                  </div>
                </li>
                <li className="step space-x-4 pb-12 before:bg-primary dark:before:bg-navy-500">
                  <div className="step-header mask is-hexagon bg-primary text-white dark:bg-accent">
                    <i className="fa-solid fa-tag text-base"></i>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-slate-400 dark:text-navy-300">
                      Step 4
                    </p>
                    <h3 className="text-base font-medium">Pricing</h3>
                  </div>
                </li>
                <li className="step space-x-4 before:bg-slate-200 dark:before:bg-navy-500">
                  <div className="step-header mask is-hexagon bg-primary text-white dark:bg-accent">
                    <i className="fa-solid fa-check text-base"></i>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-slate-400 dark:text-navy-300">
                      Step 5
                    </p>
                    <h3 className="text-base font-medium">Confirm</h3>
                  </div>
                </li>
              </ol>
            </div>
          </div>
          <div className="col-span-12 grid lg:col-span-8">
            <div className="card">
              <div className="border-b border-slate-200 p-4 dark:border-navy-500 sm:px-5">
                <div className="flex items-center space-x-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 p-1 text-primary dark:bg-accent-light/10 dark:text-accent-light">
                    <i className="fa-solid fa-check"></i>
                  </div>
                  <h4 className="text-lg font-medium text-slate-700 dark:text-navy-100">
                    Confirm
                  </h4>
                </div>
              </div>
              <div className="space-y-4 p-4 sm:p-5">
                <label className="block">
                  <span>Service Name*</span>
                  <input
                    className="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                    placeholder="Enter Your Service Name"
                    type="text"
                    value={this.state.name}
                    readOnly
                  />
                </label>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span>Service Type*</span>
                      <select
                        className="mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent  px-3 py-2"
                        id="category"
                        onChange={this.handleInputChange}
                      >
                        {this.state.categories.map((category) => {
                          if (category.id == this.state.category) {
                            return (
                              <option value={category.id}>
                                {category.name}
                              </option>
                            )
                          }
                        })}
                      </select>
                    </label>
                    <label className="block">
                      <span>Service Category*</span>
                      <select
                        className="mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent  px-3 py-2"
                        id="subcategory"
                        onChange={this.handleInputChange}
                      >
                        {this.state.subcategories.map((subcategory) => {
                          if (subcategory.id == this.state.subcategory) {
                            return (
                              <option value={subcategory.id}>
                                {subcategory.name}
                              </option>
                            )
                          }
                        })}
                      </select>
                    </label>
                  </div>
                  <label className="block">
                    <span>Service Available for*</span>
                    <select
                      className="mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent  px-3 py-2"
                      id="gender"
                      onChange={this.handleInputChange}
                    >
                      {this.state.genders.map((gender) => {
                        if (gender.id == this.state.gender) {
                          return (
                            <option value={gender.id}>{gender.name}</option>
                          )
                        }
                      })}
                    </select>
                  </label>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span>Service description</span>
                    <textarea
                      rows="4"
                      placeholder="Enter Service Description"
                      className="form-textarea w-full resize-none rounded-lg border border-slate-300 bg-transparent p-2.5 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                      value={this.state.description}
                      readOnly
                    ></textarea>
                  </label>
                  <label className="block">
                    <span>Aftercare description</span>
                    <textarea
                      rows="4"
                      placeholder="Enter Aftercare Description"
                      className="form-textarea w-full resize-none rounded-lg border border-slate-300 bg-transparent p-2.5 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                      value={this.state.aftercare}
                      readOnly
                    ></textarea>
                  </label>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
                  <label className="inline-flex items-center space-x-2">
                    Enable online bookings, choose who the service is available
                    for and add a short description.
                  </label>
                  <label className="inline-flex items-center space-x-2">
                    <input
                      className="form-switch h-5 w-10 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-accent dark:checked:before:bg-white"
                      type="checkbox"
                      checked={this.state.onlinebooking}
                      readOnly
                    />
                    <span>Enable Online Booking.</span>
                  </label>
                </div>
                <div className="my-3 mx-4 h-px bg-slate-200 dark:bg-navy-500"></div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
                  <label className="inline-flex items-center space-x-2">
                    Enable voucher sale, choose who the service is available for
                    and add a short description.
                  </label>
                  <label className="inline-flex items-center space-x-2">
                    <input
                      className="form-switch h-5 w-10 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-accent dark:checked:before:bg-white"
                      type="checkbox"
                      checked={this.state.vouchersale}
                      readOnly
                    />
                    <span>Enable Voucher Sales.</span>
                  </label>
                </div>
                <div className="my-3 mx-4 h-px bg-slate-200 dark:bg-navy-500"></div>
                <label className="block">
                  <span>Set Tax Rate*</span>
                  <select
                    className="mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent  px-3 py-2"
                    id="tax"
                    onChange={this.handleInputChange}
                  >
                    {this.state.taxes.map((tax) => {
                      if (tax.id == this.state.tax) {
                        return <option value={tax.id}>{tax.name}</option>
                      }
                    })}
                  </select>
                </label>
                {inputsNew.map((input, index) => {
                  return (
                    <>
                      <label className="block">
                        <span>Price Name*</span>
                        <input
                          className="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                          placeholder="Price Name"
                          value={input.pricename}
                          readOnly
                        />
                      </label>

                      <div
                        key={index}
                        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                      >
                        <div className="grid grid-cols-1 mt-2">
                          <label className="block">Price Duration*</label>
                          <label className="mt-1 flex -space-x-px">
                            <input
                              className="form-input w-full border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                              placeholder="Enter Price Duration"
                              type="number"
                              value={input.priceduration}
                              readOnly
                            />
                            <div className="flex items-center justify-center rounded-r-lg border border-slate-300 px-3.5 font-inter dark:border-navy-450">
                              <span>Minutes</span>
                            </div>
                          </label>
                        </div>
                        <div className="grid grid-cols-1 mt-2">
                          <label className="block">Price Type*</label>
                          <label className="mt-1 flex -space-x-px">
                            <select
                              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent  px-3 py-2"
                              id="pricetype"
                              onChange={this.handleInputChange}
                            >
                              {console.log(input.pricetype, 'pricetype')}
                              <option value={input.pricetype}>
                                {input.pricetype == 1
                                  ? 'Free'
                                  : input.pricetype == 2
                                  ? 'From'
                                  : input.pricetype == 3
                                  ? 'Fixed'
                                  : input.pricetype == 4
                                  ? 'Special'
                                  : ''}
                              </option>
                            </select>
                          </label>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="grid grid-cols-1 mt-2">
                          <label className="block">Price*</label>
                          <label className="mt-1 flex -space-x-px">
                            <div className="flex items-center justify-center rounded-l-lg border border-slate-300 px-3.5 font-inter dark:border-navy-450">
                              <span>AED</span>
                            </div>
                            <input
                              className="form-input w-full border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                              placeholder="Enter Price"
                              type="number"
                              value={input.pricefrom}
                              readOnly
                            />
                            <div className="flex items-center justify-center rounded-r-lg border border-slate-300 px-3.5 font-inter dark:border-navy-450">
                              <span>.00</span>
                            </div>
                          </label>
                        </div>
                        <div className="grid grid-cols-1  mt-2">
                          <label className="block">
                            Special Price (Optional)
                          </label>
                          <label className="mt-1 flex -space-x-px">
                            <div className="flex items-center justify-center rounded-l-lg border border-slate-300 px-3.5 font-inter dark:border-navy-450">
                              <span>AED</span>
                            </div>
                            <input
                              className="form-input w-full border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                              placeholder="Enter Price"
                              type="number"
                              value={input.specialprice}
                              readOnly
                            />
                            <div className="flex items-center justify-center rounded-r-lg border border-slate-300 px-3.5 font-inter dark:border-navy-450">
                              <span>.00</span>
                            </div>
                          </label>
                        </div>
                      </div>
                      <div className="my-3 mx-4 h-px bg-slate-200 dark:bg-navy-500"></div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
                        <label className="inline-flex items-center space-x-2">
                          Enable extra time after the service.
                        </label>
                        <label className="inline-flex items-center space-x-2">
                          <input
                            className="form-switch h-5 w-10 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-accent dark:checked:before:bg-white"
                            type="checkbox"
                            checked={input.extratime}
                            onChange={event => this.handleExtraTimeChange(index, input.extratime)}
                          />
                          <span>Enable Extra Time.</span>
                        </label>
                      </div>

                      {input.extratime && (
                        <div className="grid grid-cols-1 gap-4">
                          <label className="block">Extra Time Duration*</label>
                          <label className="mt-1 flex -space-x-px">
                            <input
                              className="form-input w-full border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                              placeholder="Enter Price Duration"
                              type="number"
                              value={input.extratimeduration}
                              readOnly
                            />
                            <div className="flex items-center justify-center rounded-r-lg border border-slate-300 px-3.5 font-inter dark:border-navy-450">
                              <span>Minutes</span>
                            </div>
                          </label>
                        </div>
                      ) }
                    </>
                  )
                })}
                <div className="flex justify-center space-x-2 pt-4">
                  <button
                    className="btn space-x-2 bg-slate-150 font-medium text-slate-800 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200/80 dark:bg-navy-500 dark:text-navy-50 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
                    onClick={() =>
                      this.setState({
                        pricing: true,
                        confirmation: false,
                      })
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span>Prev</span>
                  </button>
                  <button
                    className="btn space-x-2 bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
                    onClick={this.handleConfirmService}
                  >
                    <span>Submit</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }
}
