import React from "react";
import swal from "sweetalert";
import axios from "axios";
import PlacesAutocomplete, {
  geocodeByAddress,
} from "react-places-autocomplete";
import configData from "../../utils/constants/config.json";
import ImageResize from "../../components/ImageCropper/imageupload";

export default class EditBranch extends React.Component {
  static defaultProps = {
    center: {
      lat: 25.2048,
      lng: 55.2708,
    },
    zoom: 13,
  };

  constructor(props) {
    super(props);
    this.state = {
      branch: null,
      branchtiming: [],
      categories: [],
      moreCat: [],
      countries: [],
      editContactDetailsModal: false,
      editCategoryModal: false,
      editAddressModal: false,
      showHourModal: false,
      locationEmailAddress: "",
      locationContactNumber: "",
      mainCategory: "",
      gender: 0,
      genders: [],
      moreCategories: [],
      name: "",
      address: "",
      appartment: "",
      region: "",
      postalcode: "",
      distict: "",
      city: "",
      country: "",
      direction: "",
      description: "",
      lat: 0.0,
      lng: 0.0,
      selectedDay: "",
      selectedDayId: "",
      workinghourstarttime: "",
      workinghourendtime: "",
      isholiday: "",
      locationImages: [],
      newImage: null,
      gmapsLoaded: false,
      loader: false,
      imageResizerloc: false,

      voucherImage: "",
      imageResizer: false,
      imageResizerMobile: false,
      loader: false,
      uplodedImag: "",
      uplodedImagmobile: "",

      selectedMonth: 1,
      selectedBranchId: null,
    };
    if (!this.mapAdded) {
      this.mapAdded = true;
      window.initMap = this.initMap;
      const gmapScriptEl = document.createElement(`script`);
      gmapScriptEl.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCbW7sUOtCHtwO_QhbEsp8hjmlDwERkMWE&libraries=places&callback=initMap`;
      document
        .querySelector(`body`)
        .insertAdjacentElement(`beforeend`, gmapScriptEl);
    }
  }

  componentDidMount() {
    axios({
      method: "get",
      url:
        configData.SERVER_URL +
        "partner/businesssetup/getBranchDetails/" +
        localStorage.getItem("selectedBranch"),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        accesstoken: configData.ACCESSTOKEN,
        logintoken: localStorage.getItem("loginToken"),
      },
    })
      .then((resp) => {
        console.log(resp.data);
        if (parseInt(Object.keys(resp.data)[0]) === 200) {
          this.setState({
            branch: resp.data.branch,
            branchtiming: resp.data.branchtiming,
            categories: resp.data.categories,
            countries: resp.data.countries,
            locationEmailAddress: resp.data.branch.email,
            locationContactNumber: resp.data.branch.phone,
            mainCategory: resp.data.branch.category.id,
            name: resp.data.branch.name,
            address: resp.data.branch.address,
            appartment: resp.data.branch.appartment,
            region: resp.data.branch.region,
            postalcode: resp.data.branch.postcode,
            distict: resp.data.branch.distict,
            city: resp.data.branch.city,
            country: resp.data.branch.country,
            direction: resp.data.branch.direction,
            description: resp.data.branch.description,
            lat: resp.data.branch.lat,
            lng: resp.data.branch.lng,
            locationImages: resp.data.branch.branchimages,
            genders: resp.data.genders,
            uplodedImagmobile: resp.data.branch.bannerMobile,
            uplodedImag: resp.data.branch.bannerWeb,
          });
          let moreCategories = [];
          let moreCat = [];
          resp.data.branch.branchcategories.map((category) => {
            moreCategories.push("" + category.category);
            moreCat.push(category.category_branchcategoriesTocategory);
          });
          this.setState({
            moreCategories: moreCategories,
            moreCat: moreCat,
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

  initMap = () => {
    this.setState({
      gmapsLoaded: true,
    });
  };

  handleChange = (address) => {
    this.setState({ address });
  };

  handleSelect = (address) => {
    this.setState({ address });
    document.getElementById("myAddress").value = address;
    geocodeByAddress(address).then((results) => {
      console.log(address);
      for (var i = 0; i < results[0].address_components.length; i++) {
        var addressType = results[0].address_components[i].types[0];
        if (addressType === "locality") {
          this.setState({
            city: results[0].address_components[i].long_name,
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
          });
          document.getElementById("city").value =
            results[0].address_components[i].long_name;
        }
      }
    });
  };

  modalShow = (e) => {
    e.preventDefault();
    this.setState({
      [e.currentTarget.id]: true,
    });
  };

  modalHide = (e) => {
    e.preventDefault();
    this.setState({
      [e.currentTarget.id]: false,
    });
  };

  handleInputChange = (e) => {
    e.preventDefault();
    this.setState({
      [e.currentTarget.id]: e.currentTarget.value,
    });
  };

  selectCategories = (event) => {
    event.preventDefault();
    if (this.state.moreCategories.includes(event.currentTarget.id)) {
      this.setState({
        moreCategories: this.state.moreCategories.filter(function (category) {
          return category !== event.currentTarget.id;
        }),
      });
      document
        .getElementById(event.currentTarget.id)
        .classList.remove("border");
      document
        .getElementById(event.currentTarget.id)
        .classList.remove("border-primary");
    } else {
      this.setState({
        moreCategories: [...this.state.moreCategories, event.currentTarget.id],
      });
      document.getElementById(event.currentTarget.id).classList.add("border");
      document
        .getElementById(event.currentTarget.id)
        .classList.add("border-primary");
    }
  };

  saveContactDetails = (e) => {
    e.preventDefault();
    var bodyFormData = new URLSearchParams();
    bodyFormData.append("id", this.state.branch.id);
    bodyFormData.append("email", this.state.locationEmailAddress);
    bodyFormData.append("phone", this.state.locationContactNumber);
    bodyFormData.append("gender", this.state.gender);
    bodyFormData.append("description", this.state.description);
    axios({
      method: "post",
      url: configData.SERVER_URL + "partner/businesssetup/updateBranchDetails",
      data: bodyFormData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        accesstoken: configData.ACCESSTOKEN,
        logintoken: localStorage.getItem("loginToken"),
      },
    })
      .then((resp) => {
        console.log(resp.data);
        if (parseInt(Object.keys(resp.data)[0]) === 200) {
          this.state.branch.email = this.state.locationEmailAddress;
          this.state.branch.phone = this.state.locationContactNumber;
          this.state.genders.forEach((gender) => {
            if (gender.id == this.state.gender) {
              this.state.branch.gender = gender.id;
              this.state.branch.gender_branchTogender = gender;
            }
          });
          this.setState({
            branch: this.state.branch,
            editContactDetailsModal: false,
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

  saveContactTypes = (e) => {
    e.preventDefault();
    console.log(this.state.mainCategory);
    console.log(this.state.moreCategories);
    var bodyFormData = new URLSearchParams();
    bodyFormData.append("id", this.state.branch.id);
    bodyFormData.append("category", this.state.mainCategory);
    bodyFormData.append("morecategories", this.state.moreCategories);
    axios({
      method: "post",
      url:
        configData.SERVER_URL + "partner/businesssetup/updateBranchCategories",
      data: bodyFormData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        accesstoken: configData.ACCESSTOKEN,
        logintoken: localStorage.getItem("loginToken"),
      },
    })
      .then((resp) => {
        console.log(resp.data);
        if (parseInt(Object.keys(resp.data)[0]) === 200) {
          let moreCat = [];
          this.state.categories.forEach((category) => {
            if (category.id == parseInt(this.state.mainCategory)) {
              this.state.branch.category = category;
            }
            if (this.state.moreCategories.includes("" + category.id)) {
              moreCat.push(category);
            }
          });
          this.setState({
            branch: this.state.branch,
            moreCat: moreCat,
            editCategoryModal: false,
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

  saveLocation = (e) => {
    e.preventDefault();
    console.log(this.state);
    var bodyFormData = new URLSearchParams();
    bodyFormData.append("id", this.state.branch.id);
    bodyFormData.append("name", this.state.name);
    bodyFormData.append("address", this.state.address);
    bodyFormData.append("appartment", this.state.appartment);
    bodyFormData.append("distict", this.state.distict);
    bodyFormData.append("city", this.state.city);
    bodyFormData.append("region", this.state.region);
    bodyFormData.append("postalcode", this.state.postalcode);
    bodyFormData.append("direction", this.state.direction);
    bodyFormData.append("lat", this.state.lat);
    bodyFormData.append("lng", this.state.lng);
    bodyFormData.append("country", this.state.country);

    axios({
      method: "post",
      url: configData.SERVER_URL + "partner/businesssetup/updateBranchAddress",
      data: bodyFormData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        accesstoken: configData.ACCESSTOKEN,
        logintoken: localStorage.getItem("loginToken"),
      },
    })
      .then((resp) => {
        console.log(resp.data);
        if (parseInt(Object.keys(resp.data)[0]) === 200) {
          this.setState({
            branch: resp.data.branch,
            editAddressModal: false,
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

  changeWorkingHour = (e) => {
    e.preventDefault();
    this.setState({
      selectedDayId: e.currentTarget.id,
      selectedDay: document
        .getElementById(e.currentTarget.id)
        .getAttribute("data-day"),
      isholiday: false,
      showHourModal: true,
    });
  };

  updateWorkingHour = (e) => {
    e.preventDefault();
    if (!this.state.isholiday) {
      if (document.getElementById("workinghourstarttime").value == "") {
        document.getElementById("workinghourstarttime").focus();
        return;
      }
      if (document.getElementById("workinghourendtime").value == "") {
        document.getElementById("workinghourendtime").focus();
        return;
      }
    }
    var bodyFormData = new URLSearchParams();
    bodyFormData.append("branchid", this.state.branch.id);
    bodyFormData.append("id", this.state.selectedDayId);
    bodyFormData.append(
      "starttime",
      document.getElementById("workinghourstarttime").value
    );
    bodyFormData.append(
      "endtime",
      document.getElementById("workinghourendtime").value
    );
    bodyFormData.append("isholiday", this.state.isholiday ? 1 : 0);
    axios({
      method: "post",
      url:
        configData.SERVER_URL +
        "partner/businesssetup/updateBranchWorkingHours",
      data: bodyFormData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        accesstoken: configData.ACCESSTOKEN,
        logintoken: localStorage.getItem("loginToken"),
      },
    })
      .then((resp) => {
        if (parseInt(Object.keys(resp.data)[0]) === 200) {
          this.setState({
            branchtiming: resp.data.branchtiming,
            showHourModal: false,
          });
        } else {
          swal({
            title: "Service Information",
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

  imageAdd = (e) => {
    e.preventDefault();
    // var url = URL.createObjectURL(e.target.files[0])
    // console.log(e.target.files[0])
    this.setState({
      // newImage : e.target.files[0]
      imageResizerloc: true,
    });
  };

  imageModalClose = (e) => {
    this.setState({
      imageResizerMobile: false,
      imageResizer: false,
      imageResizerloc: false,
    });
  };

  changeImage = (file) => {
    this.setState({
      newImage: file,
    });
  };

  saveImageAdded = (e) => {
    e.preventDefault();
    this.setState({ loader: true });
    if (this.state.newImage == null) {
      swal({
        title: "Save Image",
        text: "Please crop the image first",
        icon: "info",
        button: "ok",
      });
      return;
    }
    var bodyFormData = new FormData();
    bodyFormData.append("id", this.state.branch.id);
    bodyFormData.append("image", this.state.newImage);
    axios({
      method: "post",
      url: configData.SERVER_URL + "partner/businesssetup/addNewImageBranch",
      data: bodyFormData,
      headers: {
        "Content-Type": "multipart/form-data",
        accesstoken: configData.ACCESSTOKEN,
        logintoken: localStorage.getItem("loginToken"),
      },
    })
      .then((resp) => {
        this.setState({ loader: false });
        if (parseInt(Object.keys(resp.data)[0]) === 200) {
          this.setState({
            locationImages: [
              ...this.state.locationImages,
              resp.data.branchimage,
            ],
            newImage: null,
          });
          this.imageModalClose(e);
        } else {
          swal({
            title: "Save Image",
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

  deteleImageAdded = (e) => {
    e.preventDefault();
    if (this.state.locationImages.length <= 1) {
      swal({
        title: "Delete Image",
        text: "Atleast one image is required for branch",
        icon: "warning",
        button: "ok",
      });
      return;
    }
    let imageId = e.currentTarget.id;
    var bodyFormData = new URLSearchParams();
    bodyFormData.append("id", imageId);
    axios({
      method: "delete",
      url: configData.SERVER_URL + "partner/businesssetup/deleteImageBranch",
      data: bodyFormData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        accesstoken: configData.ACCESSTOKEN,
        logintoken: localStorage.getItem("loginToken"),
      },
    })
      .then((resp) => {
        if (parseInt(Object.keys(resp.data)[0]) === 200) {
          this.setState({
            locationImages: this.state.locationImages.filter(
              (image) => image.id != imageId
            ),
          });
        } else {
          swal({
            title: "Delete Image",
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

  uploadImage = (isMobile) => {
    this.setState({ loader: true });
    var bodyFormData = new FormData();

    bodyFormData.append("image", this.state.newImage);

    axios({
      method: "post",
      url: configData.SERVER_URL + "partner/businesssetup/branch-banners",
      data: bodyFormData,
      headers: {
        "Content-Type": "multipart/form-data",
        accesstoken: configData.ACCESSTOKEN,
        logintoken: localStorage.getItem("loginToken"),
      },
    })
      .then((resp) => {
        this.setState({ loader: false });
        console.log(resp.data);
        if (isMobile) {
          this.setState({
            imageResizerMobile: false,
            uplodedImagmobile: resp.data.data.url,
          });
        } else {
          this.setState({
            imageResizer: false,
            uplodedImag: resp.data.data.url,
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

  uploadBanners = () => {
    var bannerImgBody = new URLSearchParams();
    bannerImgBody.append("branchId", this.state.branch.id);
    bannerImgBody.append("bannerMobile", this.state.uplodedImagmobile);
    bannerImgBody.append("bannerWeb", this.state.uplodedImag);

    if (this.state.uplodedImag && this.state.uplodedImagmobile) {
      axios({
        method: "post",
        url:
          configData.SERVER_URL + "partner/businesssetup/updateBranchBanners",
        data: bannerImgBody,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          accesstoken: configData.ACCESSTOKEN,
          logintoken: localStorage.getItem("loginToken"),
        },
      }).then((res) => {
        if (parseInt(Object.keys(res)[0]) === 200) {
          swal({
            title: "Thanks",
            text: res[Object.keys(res)[0]],
            icon: "success",
            button: "ok",
          });
          this.setState({
            loader: false,
            imageResizerMobile: false,
            imageResizer: false,
          });
        }
      });
    } else {
      swal({
        title: "Both banners is required",
        text: "Please try again",
        icon: "warning",
        button: "ok",
      });
    }
  };

  modalShowPromotion = (e) => {
    this.setState({ showMonthModal: true });
  };

  modalHidePromotion = (e) => {
    e.preventDefault();
    this.setState({ showMonthModal: false });
  };

  promote = () => {
    const savedToken = localStorage.getItem("loginToken");
    const successURL = `https://partner.drclinica.com/payment-success?session_id={CHECKOUT_SESSION_ID}&branchId=${this.state.selectedBranchId}&noOfMonths=${this.state.selectedMonth}&indicator=top-banner`;
    const cancelled = `https://partner.drclinica.com/cancelled`;

    const paymentFor = "FeaturedClinic";
    var urlencoded = new URLSearchParams();
    urlencoded.append("successURL", successURL);
    urlencoded.append("cancelURL", cancelled);
    urlencoded.append("paymentFor", paymentFor);
    urlencoded.append("noOfMonths", this.state.selectedMonth);
    axios({
      method: "post",
      url: configData.SERVER_URL + `partner/promotion/create-stripe-session`,
      data: urlencoded,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        accesstoken: configData.ACCESSTOKEN,
        logintoken: savedToken,
      },
    })
      .then((resp) => {
        if (parseInt(Object.keys(resp.data)[0]) === 200) {
          window.location.href = resp.data.session.url;
        } else {
          swal({
            text: resp.data[Object.keys(resp.data)[0]],
            title: "Server Not Responding",
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
  render() {
    return (
      <main class="main-content px-[var(--margin-x)] pb-8">
        <div class="flex items-center space-x-4 py-5 lg:py-6">
          <h2 class="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">
            Edit Branch
          </h2>
          <div class="hidden h-full py-1 sm:flex">
            <div class="h-full w-px bg-slate-300 dark:bg-navy-600"></div>
          </div>
          <ul class="hidden flex-wrap items-center space-x-2 sm:flex">
            <li class="flex items-center space-x-2">
              <a
                class="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent"
                href="/account/locations"
              >
                Branches
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
            <li>Edit Branch</li>
          </ul>
        </div>
        {this.state.branch == null ? null : (
          <div class="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6 text-left p-4">
            <div class="col-span-4 sm:col-span-4 ml-4 pl-4">
              <div class="card px-4 py-4 sm:px-5">
                <div class="m-2">
                  <h2 class="text-lg font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">
                    Contact Details & Preferences
                  </h2>
                </div>
                <div class="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>
                <div class="m-2 mt-4">
                  <h6 class="text-sm font-semibold pb-2">
                    Location email address
                  </h6>
                  <a
                    class="underline"
                    href={"mailto:" + this.state.branch.email}
                    target="_blank"
                  >
                    {this.state.branch.email}
                  </a>
                </div>

                <div class="m-2 mt-4">
                  <h6 class="text-sm font-semibold pb-2">
                    Location contact numnber
                  </h6>
                  <a
                    class="underline"
                    href={"tel:" + this.state.branch.phone}
                    target="_blank"
                  >
                    {this.state.branch.phone}
                  </a>
                </div>
                <div class="m-2 mt-4">
                  <h6 class="text-sm font-semibold pb-2">
                    Location Description
                  </h6>
                  <p>{this.state.branch.description} </p>
                </div>
                <div class="m-2 mt-4">
                  <h6 class="text-sm font-semibold pb-2">
                    Branch for {this.state.branch.gender_branchTogender.name}
                  </h6>
                </div>

                <div class="m-2">
                  <button
                    class="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent underline font-semibold"
                    id="editContactDetailsModal"
                    onClick={this.modalShow}
                  >
                    Edit Contact Details & Preferences
                  </button>
                </div>
              </div>
            </div>

            <div class="col-span-4 sm:col-span-4   pr-4">
              <div class="card px-4 py-4 sm:px-5">
                <div class="m-2">
                  <h2 class="text-lg font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">
                    Business Types
                  </h2>
                </div>
                <div class="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>
                <div class="m-2 mt-8">
                  <h6 class="text-sm font-semibold pb-2">Types</h6>
                  <p>
                    {this.state.moreCat.map((category) => category.name + ", ")}
                  </p>
                </div>
                <div class="m-2 mt-8">
                  <button
                    class="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accentt underline font-semibold"
                    id="editCategoryModal"
                    onClick={this.modalShow}
                  >
                    Edit Business Types
                  </button>
                </div>
                <div class="m-2 mt-6">
                  {/* <h6 class="text-sm font-semibold pb-2">Main</h6>
                                <p>{this.state.branch.category.name}</p> */}
                  <h6 class="text-sm font-semibold pb-2">&nbsp;</h6>
                  <p>&nbsp;</p>
                </div>
                <div class=" mt-2">
                  <h6 class="text-sm font-semibold pb-2">&nbsp;</h6>
                  <p>&nbsp;</p>
                </div>
              </div>
            </div>
            <div class="col-span-4 sm:col-span-4 mr-4 pr-4">
              <div class="card px-4 py-4 sm:px-5">
                <div class="m-2">
                  <h2 class="text-lg font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">
                    Update banners
                  </h2>
                </div>
                <div class="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>

                <div class="m-2 mt-4">
                  <div class="grid grid-cols-2 gap-4 text-left">
                    <label class="block">
                      <div class="  mx-auto">
                        {this.state.uplodedImag ? (
                          <>
                            <div className="pb-2">
                              Banner image for web (Size 1056X100){" "}
                            </div>
                            <img
                              style={{ objectFit: "contain" }}
                              class=" border h-16 w-25 bg-slate-200"
                              src={this.state.uplodedImag}
                              alt="avatar"
                              onClick={() => {
                                this.setState({
                                  imageResizer: true,
                                });
                              }}
                            />
                          </>
                        ) : (
                          <button
                            class="btn h-20 min-w-[7rem] border  font-medium text-slate-800  bg-slate-150 focus:bg-slate-150 active:bg-slate-150/80 dark:border-navy-450 dark:text-navy-50 dark:hover:bg-navy-500 dark:focus:bg-navy-500 dark:active:bg-navy-500/90"
                            style={{ border: "dashed" }}
                            id="btn1"
                            alt="avatar"
                            onClick={() => {
                              this.setState({
                                imageResizer: true,
                              });
                            }}
                          >
                            Add banner image for web (Size 1056X100)
                          </button>
                        )}
                      </div>
                    </label>
                    <label class="block">
                      <div class="">
                        {this.state.uplodedImagmobile ? (
                          <>
                            <div className="pb-2">
                              Banner image for mobile (Size 524X100){" "}
                            </div>
                            <img
                              style={{ objectFit: "contain" }}
                              class=" border h-16 w-25 bg-slate-200"
                              src={this.state.uplodedImagmobile}
                              alt="avatar"
                              onClick={() => {
                                this.setState({
                                  imageResizerMobile: true,
                                });
                              }}
                            />
                          </>
                        ) : (
                          <button
                            class="btn h-20 min-w-[7rem] border  font-medium text-slate-800  bg-slate-150 focus:bg-slate-150 active:bg-slate-150/80 dark:border-navy-450 dark:text-navy-50 dark:hover:bg-navy-500 dark:focus:bg-navy-500 dark:active:bg-navy-500/90"
                            id="btn2"
                            style={{ border: "dashed" }}
                            alt="avatar"
                            onClick={() => {
                              this.setState({
                                imageResizerMobile: true,
                              });
                            }}
                          >
                            Add banner image for mobile (Size 524X100)
                          </button>
                        )}
                      </div>
                    </label>
                  </div>
                </div>

                <h4 className="px-1 mt-3 text-primary transition-colors   dark:text-accent-light   font-semibold">
                  {/* Be a part of DrClinica home page bunners */}
                </h4>

                <div class="m-2 mt-3 ml-auto">
                  <button
                    className="btn relative bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
                    onClick={this.uploadBanners}
                  >
                    Update Banners
                  </button>
                </div>
                <h4 className="px-1 mt-3 text-primary transition-colors   dark:text-accent-light   font-semibold">
                  Be a part of DrClinica home page feature banners
                </h4>
                <div class="m-2 mt-3 ml-auto">
                    <button
                    onClick={() => {
                      this.setState({ selectedBranchId: this.state.branch.id });
                      this.modalShowPromotion();
                    }} 
                    className="btn relative bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
                   >
                    Promote Banner
                  </button>
                </div>
              </div>
            </div>
            <div class="col-span-12 sm:col-span-12 mx-4 pl-4">
              <div class="card px-4 py-4 sm:px-5">
                <div class="m-2">
                  <h2 class="text-lg font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">
                    Location
                  </h2>
                </div>
                <div class="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>
                <div class="m-2 text-left mt-4">
                  <h6 class="text-sm font-semibold pb-2">Address</h6>
                  <p>{this.state.branch.address}</p>
                </div>
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-12 m-2">
                  <div class="block sm:col-span-4">
                    <h6 class="text-sm font-semibold pb-2">Appartment</h6>
                    <p>{this.state.branch.appartment}</p>
                  </div>
                  <div class="block sm:col-span-4">
                    <h6 class="text-sm font-semibold pb-2">Region</h6>
                    <p>{this.state.branch.region}</p>
                  </div>
                  <div class="block sm:col-span-4">
                    <h6 class="text-sm font-semibold pb-2">Postal Code</h6>
                    <p>{this.state.branch.postcode}</p>
                  </div>
                </div>
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-12 m-2">
                  <div class="block sm:col-span-4">
                    <h6 class="text-sm font-semibold pb-2">Distict</h6>
                    <p>{this.state.branch.distict}</p>
                  </div>
                  <div class="block sm:col-span-4">
                    <h6 class="text-sm font-semibold pb-2">City</h6>
                    <p>{this.state.branch.city}</p>
                  </div>
                  <div class="block sm:col-span-4">
                    <h6 class="text-sm font-semibold pb-2">Country</h6>
                    <p>{this.state.branch.country_branchTocountry.name}</p>
                  </div>
                </div>
                <div class="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>
                <div class="m-2 text-left mt-4">
                  <h6 class="text-sm font-semibold pb-2">Directions</h6>
                  <p>{this.state.branch.direction}</p>
                </div>

                <div class="m-2">
                  <button
                    class="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accentt underline font-semibold"
                    id="editAddressModal"
                    onClick={this.modalShow}
                  >
                    Edit Location
                  </button>
                </div>
              </div>
            </div>

            <div class="col-span-12 sm:col-span-14 mx-4 pl-4">
              <div class="card px-4 py-4 sm:px-5">
                <div class="m-2">
                  <h2 class="text-lg font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">
                    Opening Hours
                  </h2>
                </div>
                <div class="mx-2">
                  <p>
                    Opening hours for these locations are default working hours
                    for your team and will be visible to your clients. You can
                    amend closed dates for events like Bank Holidays in
                    Settings.
                  </p>
                </div>
                <div class="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>
                <div class="flex items-center justify-between space-x-4 py-5 lg:py-6">
                  {this.state.branchtiming.map((timing) => (
                    <div class="card">
                      <div class="p-4 rounded-t-lg bg-info dark:bg-info text-white text-center">
                        <h5 class="mx-2 px-4 text-base">{timing.day}</h5>
                      </div>
                      {timing.isholiday == 1 ? (
                        <div class="text-center p-4 m-4">
                          <p class="px-4 m-4">&nbsp;</p>
                          <p class="px-4 m-4">Holiday</p>
                          <p class="px-4 m-4">&nbsp;</p>
                        </div>
                      ) : (
                        <div class="text-center p-4 m-4">
                          <p class="px-4 m-4">{timing.startime}</p>
                          <p class="px-4 m-4">-</p>
                          <p class="px-4 m-4">{timing.endtime}</p>
                        </div>
                      )}
                      <div class="text-center pb-2">
                        <button
                          class="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accentt underline font-semibold"
                          id={timing.id}
                          data-day={timing.day}
                          onClick={this.changeWorkingHour}
                        >
                          Edit Time
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div class="col-span-12 sm:col-span-14 mx-4 pl-4">
              <div class="card px-4 py-4 sm:px-5">
                <div class="m-2">
                  <h2 class="text-lg font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">
                    Location Images
                  </h2>
                </div>
                <div class="mx-2">
                  <p>
                    Location images are the images those will appear as a slider
                    on your branch.
                  </p>
                </div>
                <div class="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
                  {this.state.locationImages.map((locationImage) => (
                    <div class="card">
                      <div class="text-right px-2">
                        <div class="inline-flex">
                          <button
                            id={locationImage.id}
                            onClick={this.deteleImageAdded}
                            class="btn h-4 w-4 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                          >
                            <i class="fa fa-times" aria-hidden="true"></i>
                          </button>
                        </div>
                      </div>
                      <div class="px-2 pb-2">
                        <img
                          src={locationImage.image}
                          class="h-48 w-full rounded-lg object-cover object-center"
                          alt="image"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div class="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>
                {this.state.newImage == null ? null : (
                  <div class="alert flex flex-col items-center justify-between rounded-lg border border-slate-300 px-4 py-2 text-center text-slate-800 dark:border-navy-450 dark:text-navy-50 sm:flex-row sm:space-y-0 sm:px-5">
                    <p>
                      {this.state.newImage.name} new iamge has been selected
                    </p>
                    <button
                      class="btn space-x-2 rounded-full bg-slate-150 font-medium text-slate-800 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200/80 dark:bg-navy-500 dark:text-navy-50 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
                      onClick={this.saveImageAdded}
                    >
                      <i class="fas fa-save"></i>
                      <span>Save Image</span>
                    </button>
                  </div>
                )}
                <div class="inline-space mt-5 flex flex-wrap">
                  <label class="btn relative bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90">
                    <input
                      tabindex="-1"
                      type="button"
                      class="absolute inset-0 h-full w-full opacity-0"
                      onClick={this.imageAdd}
                    />
                    <div class="flex items-center space-x-2">
                      <i class="fa-solid fa-cloud-arrow-up text-base"></i>
                      <span>Add New Image</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
        {this.state.editContactDetailsModal ? (
          <div
            class="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
            role="dialog"
          >
            <div
              class="absolute inset-0 bg-slate-900/60 backdrop-blur transition-opacity duration-300"
              id="editContactDetailsModal"
              onClick={this.modalHide}
            ></div>
            <div class="relative w-full max-w-2xl origin-bottom rounded-lg bg-white pb-4 transition-all duration-300 dark:bg-navy-700">
              <div class="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
                <h3 class="text-base font-medium text-slate-700 dark:text-navy-100">
                  Edit Contact Details
                </h3>
                <button
                  class="btn -mr-1.5 h-7 w-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                  id="editContactDetailsModal"
                  onClick={this.modalHide}
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
                <label class="block mx-4 mt-2">
                  <span>Location Email Address</span>
                  <input
                    class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                    placeholder="Location Email Address"
                    type="text"
                    id="locationEmailAddress"
                    value={this.state.locationEmailAddress}
                    onChange={this.handleInputChange}
                  />
                </label>
                <label class="block mx-4 mt-2">
                  <span>Location Contact Number</span>
                  <input
                    class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                    placeholder="Location Contact Number"
                    type="text"
                    id="locationContactNumber"
                    value={this.state.locationContactNumber}
                    onChange={this.handleInputChange}
                  />
                </label>
                <label class="block  mx-4 mt-2">
                  <span>Description</span>
                  <textarea
                    rows="4"
                    placeholder="Enter Description"
                    class="form-textarea w-full resize-none rounded-lg border border-slate-300 bg-transparent p-2.5 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                    id="description"
                    value={this.state.description}
                    onChange={this.handleInputChange}
                  ></textarea>
                </label>
                <label class="block mx-4 mt-2">
                  <span>Branch for*</span>
                  <select
                    class="mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent  px-3 py-2"
                    id="gender"
                    onChange={this.handleInputChange}
                  >
                    <option value={this.state.branch.gender} hidden>
                      {this.state.branch.gender_branchTogender.name}
                    </option>
                    {this.state.genders.map((gender) => (
                      <option value={gender.id}>{gender.name}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div class="text-center mt-2">
                <button
                  class="btn bg-primary btn-color from-sky-400 to-blue-600 font-medium text-white m-2"
                  onClick={this.saveContactDetails}
                >
                  Save
                </button>
                <button
                  class="btn bg-primary btn-color from-sky-400 to-blue-600 font-medium text-white m-2"
                  id="editContactDetailsModal"
                  onClick={this.modalHide}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        ) : null}
        {this.state.editCategoryModal ? (
          <div
            class="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
            role="dialog"
          >
            <div
              class="absolute inset-0 bg-slate-900/60 backdrop-blur transition-opacity duration-300"
              id="editCategoryModal"
              onClick={this.modalHide}
            ></div>
            <div class="relative w-full max-w-2xl origin-bottom rounded-lg bg-white pb-4 transition-all duration-300 dark:bg-navy-700">
              <div class="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
                <h3 class="text-base font-medium text-slate-700 dark:text-navy-100">
                  Edit Business Type
                </h3>
                <button
                  class="btn -mr-1.5 h-7 w-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                  id="editCategoryModal"
                  onClick={this.modalHide}
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
              <div
                class="is-scrollbar-hidden min-w-full overflow-x-auto"
                style={{ maxHeight: "30rem" }}
              >
                {/* <label class="block mx-4 mt-2">
                                <span>Main Business Type*</span>
                                <select class="mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent  px-3 py-2" id="mainCategory" onChange={this.handleInputChange}>
                                    {   this.state.branch == null ? null : <option value="" hidden>{this.state.branch.category.name}</option> }
                                    {this.state.categories.map((category) => ( 
                                        <option value={category.id}>{category.name}</option>
                                    ))}
                                </select>
                            </label> */}
                <label class="block mx-4 mt-2">
                  <span>Business Types*</span>
                </label>
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4 p-4">
                  {this.state.categories.map((category) => (
                    <div
                      class={
                        this.state.moreCategories.includes("" + category.id)
                          ? "card hover:bg-primary hover:text-white border-primary border"
                          : "card hover:bg-primary hover:text-white"
                      }
                      id={category.id}
                      onClick={this.selectCategories}
                    >
                      <div class="flex flex-col items-center p-4 text-center sm:p-5">
                        <div class="avatar h-20 w-20">
                          <img
                            class="rounded-full"
                            src={
                              configData.SERVER_URL +
                              "assets/images/categories/" +
                              category.image
                            }
                            alt={category.name}
                          />
                        </div>
                        <h6 class="pt-2 text-sm">{category.name}</h6>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div class="text-center mt-2">
                <button
                  class="btn bg-primary btn-color from-sky-400 to-blue-600 font-medium text-white m-2"
                  onClick={this.saveContactTypes}
                >
                  Save
                </button>
                <button
                  class="btn bg-primary btn-color from-sky-400 to-blue-600 font-medium text-white m-2"
                  id="editCategoryModal"
                  onClick={this.modalHide}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {this.state.editAddressModal ? (
          <div
            class="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
            role="dialog"
          >
            <div
              class="absolute inset-0 bg-slate-900/60 backdrop-blur transition-opacity duration-300"
              id="editAddressModal"
              onClick={this.modalHide}
            ></div>
            <div class="relative w-full max-w-2xl origin-bottom rounded-lg bg-white pb-4 transition-all duration-300 dark:bg-navy-700">
              <div class="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
                <h3 class="text-base font-medium text-slate-700 dark:text-navy-100">
                  Edit Location Details
                </h3>
                <button
                  class="btn -mr-1.5 h-7 w-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                  id="editAddressModal"
                  onClick={this.modalHide}
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
                <div class="space-y-4 p-4 sm:p-5">
                  <label class="block">
                    <span>Name*</span>
                    <input
                      class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                      placeholder="Name"
                      type="text"
                      id="name"
                      value={this.state.name}
                      onChange={this.handleInputChange}
                    />
                  </label>
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
                        <div class="block">
                          <input
                            {...getInputProps({
                              placeholder: "Search Places ...",
                              className:
                                "location-search-input form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2",
                              id: "address",
                            })}
                          />
                          <div
                            className="autocomplete-dropdown-container"
                            id="overlay"
                          >
                            {loading && <div>Loading...</div>}
                            {suggestions.map((suggestion) => {
                              const className = suggestion.active
                                ? "suggestion-item--active"
                                : "suggestion-item";
                              // inline style for demonstration purpose
                              const style = suggestion.active
                                ? {
                                    backgroundColor: "#fafafa",
                                    cursor: "pointer",
                                    padding: "5px",
                                  }
                                : {
                                    backgroundColor: "#ffffff",
                                    cursor: "pointer",
                                    padding: "5px",
                                  };
                              return (
                                <div
                                  {...getSuggestionItemProps(suggestion, {
                                    className,
                                    style,
                                  })}
                                >
                                  <span>{suggestion.description}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </PlacesAutocomplete>
                  )}
                  <label class="block">
                    <span>Address*</span>
                    <input
                      class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                      placeholder="Address"
                      type="text"
                      id="myAddress"
                      value={this.state.address}
                      readOnly
                    />
                  </label>
                  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label class="block">
                      <span>Appartment</span>
                      <input
                        class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                        placeholder="Appartment"
                        type="text"
                        id="appartment"
                        value={this.state.appartment}
                        onChange={this.handleInputChange}
                      />
                    </label>
                    <div class="grid grid-cols-2 gap-4">
                      <label class="block">
                        <span>City*</span>
                        <input
                          class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                          placeholder="City"
                          type="text"
                          id="city"
                          value={this.state.city}
                          onChange={this.handleInputChange}
                        />
                      </label>
                      <label class="block">
                        <span>Post Code</span>
                        <input
                          class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                          placeholder="Post Code"
                          type="text"
                          id="postalcode"
                          value={this.state.postalcode}
                          onChange={this.handleInputChange}
                        />
                      </label>
                    </div>
                  </div>
                  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div class="grid grid-cols-2 gap-4">
                      <label class="block">
                        <span>Distict</span>
                        <input
                          class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                          placeholder="Distict"
                          type="text"
                          id="distict"
                          value={this.state.distict}
                          onChange={this.handleInputChange}
                        />
                      </label>
                      <label class="block">
                        <span>Region</span>
                        <input
                          class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                          placeholder="Region"
                          type="text"
                          id="region"
                          value={this.state.region}
                          onChange={this.handleInputChange}
                        />
                      </label>
                    </div>
                    <label class="block">
                      <span>Country*</span>
                      <select
                        class="mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent  px-3 py-2"
                        id="country"
                        onChange={this.handleInputChange}
                      >
                        <option hidden>
                          {this.state.branch.country_branchTocountry.name}
                        </option>
                        {this.state.countries.map((country) => (
                          <option value={country.id}>{country.name}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <label class="block">
                    <span>Directions</span>
                    <textarea
                      rows="4"
                      placeholder="Enter Directions"
                      class="form-textarea w-full resize-none rounded-lg border border-slate-300 bg-transparent p-2.5 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                      id="direction"
                      value={this.state.direction}
                      onChange={this.handleInputChange}
                    ></textarea>
                  </label>
                </div>
              </div>
              <div class="text-center mt-2">
                <button
                  class="btn bg-primary btn-color from-sky-400 to-blue-600 font-medium text-white m-2"
                  onClick={this.saveLocation}
                >
                  Save
                </button>
                <button
                  class="btn bg-primary btn-color from-sky-400 to-blue-600 font-medium text-white m-2"
                  id="editAddressModal"
                  onClick={this.modalHide}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {this.state.showHourModal ? (
          <div
            class="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
            role="dialog"
          >
            <div
              class="absolute inset-0 bg-slate-900/60 backdrop-blur transition-opacity duration-300"
              id="showHourModal"
              onClick={this.modalHide}
            ></div>
            <div class="relative w-full max-w-2xl origin-bottom rounded-lg bg-white pb-4 transition-all duration-300 dark:bg-navy-700">
              <div class="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
                <h3 class="text-base font-medium text-slate-700 dark:text-navy-100">
                  Edit Hours
                </h3>
                <button
                  class="btn -mr-1.5 h-7 w-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                  id="showHourModal"
                  onClick={this.modalHide}
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
                <table class="w-full text-left">
                  <thead>
                    <tr class="border border-transparent border-b-slate-200 dark:border-b-navy-500">
                      <th class="whitespace-nowrap px-3 py-3 font-semibold uppercase text-slate-800 dark:text-navy-100 lg:px-5">
                        Day
                      </th>
                      <th class="whitespace-nowrap px-3 py-3 font-semibold uppercase text-slate-800 dark:text-navy-100 lg:px-5">
                        Start Time
                      </th>
                      <th class="whitespace-nowrap px-3 py-3 font-semibold uppercase text-slate-800 dark:text-navy-100 lg:px-5">
                        End Time
                      </th>
                      <th class="whitespace-nowrap px-3 py-3 font-semibold uppercase text-slate-800 dark:text-navy-100 lg:px-5">
                        Is Holiday
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="border border-transparent border-b-slate-200 dark:border-b-navy-500">
                      <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                        {this.state.selectedDay}
                      </td>
                      <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                        <label class="relative flex">
                          <input
                            x-init="$el._x_flatpickr = flatpickr($el,{enableTime: true,noCalendar: true,dateFormat: 'H:i',time_24hr:true})"
                            class="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                            placeholder="Start Time"
                            type="text"
                            id="workinghourstarttime"
                          />
                          <span class="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              stroke-width="1.5"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </span>
                        </label>
                      </td>
                      <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                        <label class="relative flex">
                          <input
                            x-init="$el._x_flatpickr = flatpickr($el,{enableTime: true,noCalendar: true,dateFormat: 'H:i',time_24hr:true})"
                            class="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                            placeholder="End Time"
                            type="text"
                            id="workinghourendtime"
                          />
                          <span class="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              stroke-width="1.5"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </span>
                        </label>
                      </td>
                      <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                        <label class="inline-flex items-center space-x-2">
                          <input
                            class="form-switch h-5 w-10 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-accent dark:checked:before:bg-white"
                            type="checkbox"
                            value="true"
                            id="isholiday"
                            onChange={() => {
                              this.setState(({ isholiday }) => ({
                                isholiday: !isholiday,
                              }));
                            }}
                          />
                          <span>Enable if Day off.</span>
                        </label>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="text-center mt-2">
                <button
                  class="btn bg-primary btn-color from-sky-400 to-blue-600 font-medium text-white m-2"
                  onClick={this.updateWorkingHour}
                >
                  Save
                </button>
                <button
                  class="btn bg-primary btn-color from-sky-400 to-blue-600 font-medium text-white m-2"
                  id="showHourModal"
                  onClick={this.modalHide}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        ) : null}
        {this.state.imageResizerloc ? (
          <ImageResize
            loader={this.state.loader}
            aspectRatio={1.5}
            imageModalClose={this.imageModalClose}
            changeImage={this.changeImage}
            saveImageAdded={this.saveImageAdded}
          />
        ) : (
          <></>
        )}

        {this.state.showMonthModal ? (
          <div
            class="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
            role="dialog"
          >
            <div
              class="absolute inset-0 bg-slate-900/60 backdrop-blur transition-opacity duration-300"
              id="showMonthModal"
              onClick={this.modalHidePromotion}
            ></div>
            <div class="relative w-full max-w-2xl origin-bottom rounded-lg bg-white pb-4 transition-all duration-300 dark:bg-navy-700">
              <div class="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
                <h3 class="text-base font-medium text-slate-700 dark:text-navy-100">
                  Select number of month
                </h3>
                <button
                  class="btn -mr-1.5 h-7 w-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                  id="showMonthModal"
                  onClick={this.modalHidePromotion}
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
                <span className="pb-3"> Payment For</span>
                <input
                  style={{ width: "94%", margin: "auto", display: "block" }}
                  className="mt-1.5 mx-3 mr-4 w-full rounded-lg border border-slate-300 bg-transparent  px-3 py-2"
                  id="category"
                  readOnly={true}
                  value="Featured Clinic"
                />
              </div>
              <div class=" mt-3 is-scrollbar-hidden min-w-full overflow-x-auto">
                <span className="pb-3">Select Number of month</span>
                <select
                  style={{ width: "94%", margin: "auto", display: "block" }}
                  className="mt-1.5 mx-3 mr-4 w-full rounded-lg border border-slate-300 bg-transparent  px-3 py-2"
                  id="category"
                  onChange={(e) => {
                    this.setState({ selectedMonth: e.target.value });
                  }}
                >
                  <option value={0}>Select Number of month</option>
                  {Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).map(
                    (month) => {
                      return <option value={month}>{month}</option>;
                    }
                  )}
                </select>
              </div>

              <div class="is-scrollbar-hidden overflow-x-auto">
                <span className="pb-3">Total Calculated Payment</span>
                <div style={{ fontWeight: "bold" }}>
                  <h3>AED {parseInt(this.state.selectedMonth) * 1000}</h3>
                </div>
              </div>

              <div class="text-center mt-2">
                <button
                  class="btn bg-primary btn-color from-sky-400 to-blue-600 font-medium text-white m-2"
                  id="showMonthModal"
                  onClick={this.modalHidePromotion}
                >
                  Close
                </button>
                <button
                  class="btn bg-primary btn-color from-sky-400 to-blue-600 font-medium text-white m-2"
                  onClick={this.promote}
                >
                  Pay Now
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {this.state.imageResizer ? (
          <ImageResize
            loader={this.state.loader}
            aspectRatio={10.56}
            imageModalClose={() => this.imageModalClose(false)}
            changeImage={this.changeImage}
            saveImageAdded={() => this.uploadImage(false)}
          />
        ) : (
          <></>
        )}
        {this.state.imageResizerMobile ? (
          <ImageResize
            loader={this.state.loader}
            aspectRatio={5.24}
            imageModalClose={() => this.imageModalClose(true)}
            changeImage={this.changeImage}
            saveImageAdded={() => this.uploadImage(true)}
          />
        ) : (
          <></>
        )}
      </main>
    );
  }
}
