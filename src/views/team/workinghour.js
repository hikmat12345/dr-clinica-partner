import React from 'react'
import swal from 'sweetalert'
import axios from 'axios'
import moment from 'moment'
import configData from '../../utils/constants/config.json'
import { ToastContainer, toast } from "react-toastify";

export default class WorkingHours extends React.Component{

    constructor(props) {
        super(props)
        this.state = {
          tacbleAction : "popper-root",
          teammembers : [],
          page : 1,
          teammemberCount : 0,
          pageRecordCount : 5,
          totalPages : 0,
          showSpecialHourModal : false,
          specialhours : [],
          addspecialhour : [],
          selectedTeamMember : null,
          selectedWorkingHourid : null,
          showHourModal : false,
          isholiday : false,
          isHolidayValueTrue:false,
          selectedday : "",
          teammemberindex : null,
          workinghourindex : null,
          startH:0,
          endHour:0,
          showEditSpecialHourModal : false,
          selectedEditSpecialHours : null,
          selectedSpecialHoursIndex : null,
        }
    }
    
    componentDidMount () {
        axios({
            method: "get",
            url: configData.SERVER_URL + 'partner/team/getWorkingHours/1/'+this.state.pageRecordCount,
            headers: { 
                "Content-Type": "application/x-www-form-urlencoded",
                "accesstoken" : configData.ACCESSTOKEN,
                "logintoken" : localStorage.getItem('loginToken')
            },
        }).then(resp => {
            console.log(resp.data)
            if(parseInt(Object.keys(resp.data)[0]) === 200){
            this.setState({
                teammembers : resp.data.teammembers,
                page : resp.data.page,
                teammemberCount : resp.data.teammemberCount,
                pageRecordCount : resp.data.pageRecordCount,
                totalPages : resp.data.totalPages
            })
            }
        }).catch(err => {
            swal({
                title: "Server Not Responding",
                text: "Please try again later",
                icon: "warning",
                button: "ok",
            })
            console.log(err)
        })
    }

    handlePageChange = (e) => {
        e.preventDefault()
        axios({
            method: "get",
            url: configData.SERVER_URL + 'partner/team/getWorkingHours/'+e.currentTarget.getAttribute("data-page")+'/'+this.state.pageRecordCount,
            headers: { 
                "Content-Type": "application/x-www-form-urlencoded",
                "accesstoken" : configData.ACCESSTOKEN,
                "logintoken" : localStorage.getItem('loginToken')
            },
        }).then(resp => {
            console.log(resp.data)
            if(parseInt(Object.keys(resp.data)[0]) === 200){
            this.setState({
                teammembers : resp.data.teammembers,
                page : resp.data.page,
                teammemberCount : resp.data.teammemberCount,
                pageRecordCount : resp.data.pageRecordCount,
                totalPages : resp.data.totalPages
            })
            }
        }).catch(err => {
            swal({
                title: "Server Not Responding",
                text: "Please try again later",
                icon: "warning",
                button: "ok",
            })
            console.log(err)
        })
    }

    handleRecordCountChange = (e) => {
        e.preventDefault()
        axios({
            method: "get",
            url: configData.SERVER_URL + 'partner/team/getWorkingHours/'+this.state.page+'/'+e.currentTarget.value,
            headers: { 
                "Content-Type": "application/x-www-form-urlencoded",
                "accesstoken" : configData.ACCESSTOKEN,
                "logintoken" : localStorage.getItem('loginToken')
            },
        }).then(resp => {
            console.log(resp.data)
            if(parseInt(Object.keys(resp.data)[0]) === 200){
            this.setState({
                teammembers : resp.data.teammembers,
                page : resp.data.page,
                teammemberCount : resp.data.teammemberCount,
                pageRecordCount : resp.data.pageRecordCount,
                totalPages : resp.data.totalPages
            })
            }
        }).catch(err => {
            swal({
                title: "Server Not Responding",
                text: "Please try again later",
                icon: "warning",
                button: "ok",
            })
            console.log(err)
        })
    }

    onToggletableAction = (e) => {
        if(this.state.tacbleAction == "popper-root"){
            this.setState({
                tacbleAction : "popper-root show"
            })
        }else{
            this.setState({
                tacbleAction : "popper-root"
            })
        }
    }

    pagination(){
        if(this.state.page == 1){
        return (
            <ol class="pagination">
            <li class="bg-slate-150 dark:bg-navy-500">
                <button data-page="1" onClick={this.handlePageChange} class="flex h-8 min-w-[2rem] items-center justify-center rounded-lg bg-primary px-3 leading-tight text-white transition-colors hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90">1</button>
            </li>
            { this.state.totalPages > 1 ?
                <li class="bg-slate-150 dark:bg-navy-500">
                <button data-page="2" onClick={this.handlePageChange} class="flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-3 leading-tight transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90">2</button>
                </li> : null
            }
            <li class="rounded-r-lg bg-slate-150 dark:bg-navy-500">
                <button data-page={this.state.totalPages} onClick={this.handlePageChange} class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:text-navy-200 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
                </button>
            </li>
            </ol>
        )
        }else{
        if(this.state.page == this.state.totalPages){
            return (
            <ol class="pagination">
                <li class="rounded-l-lg bg-slate-150 dark:bg-navy-500">
                <button data-page="1" onClick={this.handlePageChange} class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:text-navy-200 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
                    </svg>
                </button>
                </li>
                <li class="bg-slate-150 dark:bg-navy-500">
                <button data-page={ parseInt(this.state.page) - 1} onClick={this.handlePageChange} class="flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-3 leading-tight transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90">{parseInt(this.state.page)  -1}</button>
                </li>
                <li class="bg-slate-150 dark:bg-navy-500">
                <button data-page={this.state.page} onClick={this.handlePageChange}class="flex h-8 min-w-[2rem] items-center justify-center rounded-lg bg-primary px-3 leading-tight text-white transition-colors hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90">{this.state.page}</button>
                </li>
            </ol>
            )
        }else{
            return (
            <ol class="pagination">
                <li class="rounded-l-lg bg-slate-150 dark:bg-navy-500">
                <button data-page="1" onClick={this.handlePageChange} class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:text-navy-200 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
                    </svg>
                </button>
                </li>
                <li class="bg-slate-150 dark:bg-navy-500">
                <button data-page={parseInt(this.state.page) -1} onClick={this.handlePageChange} class="flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-3 leading-tight transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90">{parseInt(this.state.page)  -1}</button>
                </li>
                <li class="bg-slate-150 dark:bg-navy-500">
                <button data-page={this.state.page} onClick={this.handlePageChange} class="flex h-8 min-w-[2rem] items-center justify-center rounded-lg bg-primary px-3 leading-tight text-white transition-colors hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90">{this.state.page}</button>
                </li>
                <li class="bg-slate-150 dark:bg-navy-500">
                <button data-page={parseInt(this.state.page) +1} onClick={this.handlePageChange} class="flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-3 leading-tight transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90">{parseInt(this.state.page)  + 1}</button>
                </li>
                <li class="rounded-r-lg bg-slate-150 dark:bg-navy-500">
                <button data-page={this.state.totalPages} onClick={this.handlePageChange} class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:text-navy-200 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                </button>
                </li>
            </ol>
            )
        }
        }
    }

    handleSpecialHourShow = (specialworkinghour,teammemberId) => {
        this.setState({
            selectedTeamMember : teammemberId,
            specialhours : specialworkinghour,
            showSpecialHourModal : true
        })
    }

    handleSpecialHourHide = (e) => {
        this.setState({
            showSpecialHourModal : false,
            addspecialhour : [],
        })
    }

    saveSpecialHour = (e) => {
        console.log(e.currentTarget.id)
        console.log(this.state.selectedTeamMember)
        console.log(document.getElementById("addspecialdate" + e.currentTarget.id).value)
        console.log(document.getElementById("addspecialstarttime" + e.currentTarget.id).value)
        console.log(document.getElementById("addspecialendtime" + e.currentTarget.id).value)
        let holiday = 0
        if(document.getElementById("isholiday" + e.currentTarget.id).checked){
            holiday = 1
            if(document.getElementById('addspecialdate' + e.currentTarget.id).value == ""){
                document.getElementById('addspecialdate' + e.currentTarget.id).focus()
                return
            }
        }else{
            if(document.getElementById('addspecialdate' + e.currentTarget.id).value == ""){
                document.getElementById('addspecialdate' + e.currentTarget.id).focus()
                return
            }
            if(document.getElementById('addspecialstarttime' + e.currentTarget.id).value == ""){
                document.getElementById('addspecialstarttime' + e.currentTarget.id).focus()
                return
            }
            if(document.getElementById('addspecialendtime' + e.currentTarget.id).value == ""){
                document.getElementById('addspecialendtime' + e.currentTarget.id).focus()
                return
            }
        }
        var bodyFormData = new URLSearchParams()
        bodyFormData.append('teammember', this.state.selectedTeamMember)
        bodyFormData.append('date', document.getElementById("addspecialdate" + e.currentTarget.id).value)
        bodyFormData.append('starttime', document.getElementById("addspecialstarttime" + e.currentTarget.id).value)
        bodyFormData.append('endtime', document.getElementById("addspecialendtime" + e.currentTarget.id).value)
        bodyFormData.append('isholiday', holiday)
        axios({
            method: "post",
            url: configData.SERVER_URL + 'partner/team/createSpecialWorkinHour',
            data : bodyFormData,
            headers: { 
                "Content-Type": "application/x-www-form-urlencoded",
                "accesstoken" : configData.ACCESSTOKEN,
                "logintoken" : localStorage.getItem('loginToken')
            },
        }).then(resp => {
            console.log(resp.data)
            if(parseInt(Object.keys(resp.data)[0]) === 200){
                console.log(resp.data.specialworkinghour)
                this.setState({
                    specialhours : [...this.state.specialhours,resp.data.specialworkinghour]
                })
                this.state.teammembers.forEach((teammember) => {
                    if(teammember.id == resp.data.specialworkinghour.teammember){
                        teammember.specialworkinghour = [...teammember.specialworkinghour,resp.data.specialworkinghour]
                    }
                })
            }
        }).catch(err => {
            swal({
                title: "Server Not Responding",
                text: "Please try again later",
                icon: "warning",
                button: "ok",
            })
            console.log(err)
        })
    }

    changeWorkingHour = (e, starth, endh, checkHolidayBtn) => {
        
        this.setState({
            selectedWorkingHourid : e.currentTarget.id,
            isholiday : checkHolidayBtn,
            showHourModal : true,
            startH:starth,
            endHour:endh,
            isHolidayValueTrue:checkHolidayBtn,
            selectedday : document.getElementById(e.currentTarget.id).getAttribute('data-day'),
            teammemberindex : document.getElementById(e.currentTarget.id).getAttribute('data-teammember'),
            workinghourindex : document.getElementById(e.currentTarget.id).getAttribute('data-hour')
        })
    }

    handleHourHide = (e) => {
        e.preventDefault()
        this.setState({
            showHourModal : false,
        })
    }

    updateWorkingHour = (e) => {
        e.preventDefault()
        if(!this.state.isholiday){
            if(document.getElementById('workinghourstarttime').value == ""){
                document.getElementById('workinghourstarttime').focus()
                return
            }
            if(document.getElementById('workinghourendtime').value == ""){
                document.getElementById('workinghourendtime').focus()
                return
            }
        }


            const startTime = document.getElementById('workinghourstarttime').value;
            const endTime = document.getElementById('workinghourendtime').value;

            // Check if the start time and end time are the same
            if (startTime === endTime) {
           toast.error(`Start time and end time cannot be the same.`, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            });
                return;
            }

            // Convert start time and end time to Date objects
            const startDate = new Date(`2000-01-01 ${startTime}`);
            const endDate = new Date(`2000-01-01 ${endTime}`);

            // Check if the end time is less than the start time
            if (endDate < startDate) { 
                toast.error(`End time cannot be less than start time.`, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    });
                return;
            }

        var bodyFormData = new URLSearchParams()
        bodyFormData.append('id', this.state.selectedWorkingHourid)
        bodyFormData.append('starttime', document.getElementById('workinghourstarttime').value)
        bodyFormData.append('endtime', document.getElementById('workinghourendtime').value)
        bodyFormData.append('isholiday', this.state.isholiday ? 1 : 0)
        axios({
            method: "post",
            url: configData.SERVER_URL + 'partner/team/updateWorkingHour',
            data: bodyFormData,
            headers: { 
                "Content-Type": "application/x-www-form-urlencoded",
                "accesstoken" : configData.ACCESSTOKEN,
                "logintoken" : localStorage.getItem('loginToken')
            },
        }).then(resp => {
            if(parseInt(Object.keys(resp.data)[0]) === 200){
                this.state.teammembers[this.state.teammemberindex].workinghour[this.state.workinghourindex] = resp.data.workinghour
                console.log(this.state.teammembers[this.state.teammemberindex].workinghour[this.state.workinghourindex])
                this.setState({
                    teammembers : this.state.teammembers,
                    showHourModal : false,
                })
            }else{
                swal({
                    title: "Service Information",
                    text: resp.data[Object.keys(resp.data)[0]],
                    icon: "warning",
                    button: "ok",
                })
            }
        }).catch(err => {
            swal({
                title: "Server Not Responding",
                text: "Please try again later",
                icon: "warning",
                button: "ok",
            })
            console.log(err)
        })
    }

    editSpecialHour = (specialhour,index) => {
        this.setState({
            showEditSpecialHourModal : true,
            selectedEditSpecialHours : specialhour,
            selectedSpecialHoursIndex : index
        })
        
    }
    
    handleshowEditSpecialHourModalHide = (e) => {
        e.preventDefault()
        this.setState({
            showEditSpecialHourModal : false
        })
    }

    saveEditSpecialHour = (e) => {
        e.preventDefault()
        console.log(this.state.selectedEditSpecialHours.id)
        console.log(document.getElementById("editspecialdate").value)
        console.log(document.getElementById("editspecialstarttime").value)
        console.log(document.getElementById("editspecialendtime").value)
        let holiday = 0
        if(document.getElementById("editisholiday").checked){
            holiday = 1
            if(document.getElementById('editspecialdate').value == ""){
                document.getElementById('editspecialdate').focus()
                return
            }
        }else{
            if(document.getElementById('editspecialdate').value == ""){
                document.getElementById('editspecialdate').focus()
                return
            }
            if(document.getElementById('editspecialstarttime').value == ""){
                document.getElementById('editspecialstarttime').focus()
                return
            }
            if(document.getElementById('editspecialendtime').value == ""){
                document.getElementById('editspecialendtime').focus()
                return
            }
        }
        var bodyFormData = new URLSearchParams()
        bodyFormData.append('id', this.state.selectedEditSpecialHours.id)
        bodyFormData.append('date', document.getElementById("editspecialdate").value)
        bodyFormData.append('starttime', document.getElementById("editspecialstarttime").value)
        bodyFormData.append('endtime', document.getElementById("editspecialendtime").value)
        bodyFormData.append('isholiday', holiday)
        axios({
            method: "post",
            url: configData.SERVER_URL + 'partner/team/updateSpecialWorkingHour',
            data : bodyFormData,
            headers: { 
                "Content-Type": "application/x-www-form-urlencoded",
                "accesstoken" : configData.ACCESSTOKEN,
                "logintoken" : localStorage.getItem('loginToken')
            },
        }).then(resp => {
            console.log(resp.data)
            if(parseInt(Object.keys(resp.data)[0]) === 200){
                console.log(resp.data.specialworkinghour)
                this.state.specialhours[this.state.selectedSpecialHoursIndex] = resp.data.specialworkinghour
                this.setState({
                    showEditSpecialHourModal : false,
                    specialhours : this.state.specialhours
                })
                this.state.teammembers.forEach((teammember) => {
                    if(teammember.id == resp.data.specialworkinghour.teammember){
                        teammember.specialworkinghour = this.state.specialhours
                    }
                })
            }
        }).catch(err => {
            swal({
                title: "Server Not Responding",
                text: "Please try again later",
                icon: "warning",
                button: "ok",
            })
            console.log(err)
        })
    }
    
    render() {
        return (
            <main class="main-content px-[var(--margin-x)] pb-8">
            <div class="flex items-center space-x-4 py-5 lg:py-6">
            <h2 class="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">Working Hours</h2>
            <div class="hidden h-full py-1 sm:flex">
                <div class="h-full w-px bg-slate-300 dark:bg-navy-600"></div>
            </div>
            <ul class="hidden flex-wrap items-center space-x-2 sm:flex">
                <li class="flex items-center space-x-2">
                <a class="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent" href="/settings">Settings</a>
                <svg x-ignore xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
                </li>
                <li>Working Hours</li>
            </ul>
            </div>
            <div class="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6">
            <div>
              <div class="flex items-center justify-between">
                <h2 class="text-base font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">
                    Team Member List
                </h2>
                <div class="flex">
                    <div class="flex items-center" x-data="{isInputActive:false}">
                    <label class="block">
                        <input x-effect="isInputActive === true && $nextTick(() => { $el.focus()});" class="form-input bg-transparent px-1 text-right transition-all duration-100 placeholder:text-slate-500 dark:placeholder:text-navy-200" placeholder="Search here..." type="text" />
                    </label>
                    <button class="btn h-8 w-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                    </button>
                    </div>
                    <div x-data="usePopper({placement:'bottom-end',offset:4})" class="inline-flex">
                    <button x-ref="popperRef" class="btn h-8 w-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25" onClick={this.onToggletableAction}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                        </svg>
                    </button>
                    <div x-ref="popperRoot" class={this.state.tacbleAction}>
                        <div class="popper-box rounded-md border border-slate-150 bg-white py-1.5 font-inter dark:border-navy-500 dark:bg-navy-700">
                        {/* <ul>
                            <li>
                                <a href="/" class="flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-none transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100">Download PDF</a>
                            </li>
                            <li>
                                <a href="/" class="flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-none transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100">Downlaod Excel</a>
                            </li>
                        </ul>
                        <div class="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>
                        <ul>
                            <li>
                                <a href="/" class="flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-none transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100">Create Share Link</a>
                            </li>
                        </ul> */}
                        </div>
                    </div>
                    </div>
                </div>
                </div>
                <div class="card mt-3">
                <div class="is-scrollbar-hidden min-w-full overflow-x-auto" x-data="pages.tables.initExample1">
                    <table class="is-hoverable w-full text-left">
                    <thead>
                        <tr>
                        <th class="whitespace-nowrap rounded-tl-lg bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Team Member</th>
                        <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Sunday</th>
                        <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Monday</th>
                        <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Tuesday</th>
                        <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Wednesday</th>
                        <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Thursday</th>
                        <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Friday</th>
                        <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Saturday</th>
                        <th class="whitespace-nowrap rounded-tr-lg bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.teammembers.map((teammember,index) => ( 
                        <tr class="border-y border-transparent border-b-slate-200 dark:border-b-navy-500">
                            <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                                <div class="inline-flex items-center space-x-2">
                                    <div class="avatar">
                                        <img class="rounded-full" src={teammember.profileimage} alt={teammember.firstname + " " + teammember.lastname}/>
                                    </div>
                                    <span>
                                        <strong>{teammember.firstname} {teammember.lastname}</strong>
                                        <br/>
                                        {teammember.title}
                                    </span>
                                </div>
                            </td>

                            { teammember.workinghour.sort((a, b) => (a.daynumber > b.daynumber) ? 1 : -1).map((hour,ind) => (
                                 hour.isholiday == 1 ? 
                                    <td class="whitespace-nowrap px-4 py-3 sm:px-5" id={hour.id} data-day={hour.day} data-teammember={index} data-hour={ind} onClick={(e)=>this.changeWorkingHour(e,0,0,true)}><button>Day-Off</button></td>
                                    :
                                    <td class="whitespace-nowrap px-4 py-3 sm:px-5" id={hour.id} data-day={hour.day} data-teammember={index} data-hour={ind} onClick={(e)=>this.changeWorkingHour(e,hour.starttime, hour.endtime)}><button>{hour.starttime}-{hour.endtime}</button></td>
                                
                            ))}
                            <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                            <div x-data="usePopper({placement:'bottom-end',offset:4})" class="inline-flex">
                                <button x-ref="popperRef" class="btn h-8 w-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                                onClick={() => {
                                    if(document.getElementById("pooper-"+teammember.id).classList.contains("show")){
                                        document.getElementById("pooper-"+teammember.id).classList.remove("show")
                                    }else{
                                        document.getElementById("pooper-"+teammember.id).classList.add("show")
                                    }
                                }}>
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"/>
                                </svg>
                                </button>

                                <div id={ "pooper-" + teammember.id } x-ref="popperRoot" class="popper-root">
                                <div class="popper-box rounded-md border border-slate-150 bg-white py-1.5 font-inter dark:border-navy-500 dark:bg-navy-700">
                                    <ul>
                                        <li>
                                            <button class="flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-none transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100" onClick={() => {
                                                swal({
                                                    title: "Edit",
                                                    text: "Please click on the time you want to update",
                                                    icon: "info",
                                                    button: "ok",
                                                })  
                                                document.getElementById("pooper-"+teammember.id).classList.remove("show")
                                            }}>Edit</button>
                                        </li>
                                        <li>
                                            <button class="flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-none transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100" onClick={() => {
                                                document.getElementById("pooper-"+teammember.id).classList.remove("show")
                                                this.handleSpecialHourShow(teammember.specialworkinghour,teammember.id)
                                            }}>Special Working Hour</button>
                                        </li>
                                    </ul>
                                </div>
                                </div>
                            </div>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>

                <div class="flex flex-col justify-between space-y-4 px-4 py-4 sm:flex-row sm:items-center sm:space-y-0 sm:px-5">
                    <div class="flex items-center space-x-2 text-xs+">
                    <span>Show</span>
                    <label class="block">
                        <select onChange={this.handleRecordCountChange} class="form-select rounded-full border border-slate-300 bg-white px-2 py-1 pr-6 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent">
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                        </select>
                    </label>
                    <span>entries</span>
                    </div>

                    {this.pagination()}

                    <div class="text-xs+">{(this.state.page - 1) * this.state.pageRecordCount} - {(this.state.page) * this.state.pageRecordCount} of {this.state.servicesCount} entries</div>
                </div>
                </div>
            </div>
            </div>
            { this.state.showSpecialHourModal ? 
                <div class="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5" role="dialog">
                    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur transition-opacity duration-300" id="showCountryModal" onClick={this.handleSpecialHourHide}></div>
                    <div class="relative w-800 origin-bottom rounded-lg bg-white pb-4 transition-all duration-300 dark:bg-navy-700">
                        <div class="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
                            <h3 class="text-base font-medium text-slate-700 dark:text-navy-100">Special Hours</h3>
                            <button class="btn -mr-1.5 h-7 w-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25" onClick={this.handleSpecialHourHide}>
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" >
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" ></path>
                                </svg>
                            </button>
                        </div>
                        <div class="is-scrollbar-hidden min-w-full overflow-x-auto">
                            <table class="w-full text-left">
                                <thead>
                                    <tr class="border border-transparent border-b-slate-200 dark:border-b-navy-500">
                                        <th class="whitespace-nowrap px-3 py-3 font-semibold uppercase text-slate-800 dark:text-navy-100 lg:px-5">#</th>
                                        <th class="whitespace-nowrap px-3 py-3 font-semibold uppercase text-slate-800 dark:text-navy-100 lg:px-5">Date</th>
                                        <th class="whitespace-nowrap px-3 py-3 font-semibold uppercase text-slate-800 dark:text-navy-100 lg:px-5">Start Time</th>
                                        <th class="whitespace-nowrap px-3 py-3 font-semibold uppercase text-slate-800 dark:text-navy-100 lg:px-5">End Time</th>
                                        <th class="whitespace-nowrap px-3 py-3 font-semibold uppercase text-slate-800 dark:text-navy-100 lg:px-5">Holiday</th>
                                        <th class="whitespace-nowrap px-3 py-3 font-semibold uppercase text-slate-800 dark:text-navy-100 lg:px-5">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { this.state.specialhours.map((specialhour,index) => (
                                        <tr class="border border-transparent border-b-slate-200 dark:border-b-navy-500">
                                            <td class="whitespace-nowrap px-4 py-3 sm:px-5">{index + 1}</td>
                                            <td class="whitespace-nowrap px-4 py-3 sm:px-5">{ moment(specialhour.date).format('MMMM Do YYYY') }</td>
                                            <td class="whitespace-nowrap px-4 py-3 sm:px-5">{ specialhour.starttime }</td>
                                            <td class="whitespace-nowrap px-4 py-3 sm:px-5">{ specialhour.endtime }</td>
                                            <td class="whitespace-nowrap px-4 py-3 sm:px-5">{ specialhour.isholiday ? <label>Day Off</label>: <label>Working Day</label> }</td>
                                            <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                                                <button class="btn h-9 w-9 rounded-full bg-primary p-0 font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90" onClick={() => this.editSpecialHour(specialhour,index) }>
                                                    <i class="fa-solid fa-edit"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    { this.state.addspecialhour.map((specialhour,index) => (
                                        <tr class="border border-transparent border-b-slate-200 dark:border-b-navy-500">
                                            <td class="whitespace-nowrap px-4 py-3 sm:px-5">{index + this.state.specialhours.length + 1}</td>
                                            <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                                                <label class="relative flex">
                                                    <input x-init="$el._x_flatpickr = flatpickr($el)" class="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Date." type="text" id={ "addspecialdate" + specialhour }/>
                                                    <span class="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                                        </svg>
                                                    </span>
                                                </label>
                                            </td>
                                            <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                                                <label class="relative flex">
                                                    <input x-init="$el._x_flatpickr = flatpickr($el,{enableTime: true,noCalendar: true,dateFormat: 'H:i',time_24hr:true})" class="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Start Time" type="text" id={ "addspecialstarttime" + specialhour }/>
                                                    <span class="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                        </svg>
                                                    </span>
                                                </label>
                                            </td>
                                            <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                                                <label class="relative flex">
                                                    <input x-init="$el._x_flatpickr = flatpickr($el,{enableTime: true,noCalendar: true,dateFormat: 'H:i',time_24hr:true})" class="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="End Time" type="text" id={ "addspecialendtime" + specialhour}/>
                                                    <span class="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </span>
                                                </label>
                                            </td>
                                            <td>
                                                <label class="inline-flex items-center space-x-2">
                                                    <input class="form-checkbox is-outline h-5 w-5 rounded-full border-slate-400/70 before:bg-primary checked:border-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:before:bg-accent dark:checked:border-accent dark:hover:border-accent dark:focus:border-accent" type="checkbox"  id={ "isholiday" + specialhour }/>
                                                    <p>Enable Day Off</p>
                                                </label>
                                            </td>
                                            <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                                                <button class="btn h-9 w-9 rounded-full bg-primary p-0 font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90" id={ specialhour } onClick={this.saveSpecialHour}>
                                                    <i class="fa-solid fa-save"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div class="text-center mt-2">  
                            <button class="btn bg-primary btn-color from-sky-400 to-blue-600 font-medium text-white m-2" onClick={() => {
                                this.setState({
                                    addspecialhour : [...this.state.addspecialhour,this.state.addspecialhour.length + 1]
                                })
                                console.log(this.state.addspecialhour)
                            }}>Add New</button>
                            <button class="btn bg-primary btn-color from-sky-400 to-blue-600 font-medium text-white m-2" onClick={this.handleSpecialHourHide}>Close</button>
                        </div>
                    </div>
                </div>
                :
                null
            }
            { this.state.showHourModal ? 
                <div class="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5" role="dialog">
                    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur transition-opacity duration-300" id="showCountryModal" onClick={this.handleHourHide}></div>
                    <div class="relative w-full max-w-2xl origin-bottom rounded-lg bg-white pb-4 transition-all duration-300 dark:bg-navy-700">
                        <div class="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
                            <h3 class="text-base font-medium text-slate-700 dark:text-navy-100">Edit Hours</h3>
                            <button class="btn -mr-1.5 h-7 w-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25" onClick={this.handleHourHide}>
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" >
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" ></path>
                                </svg>
                            </button>
                        </div>
                        <div class="is-scrollbar-hidden min-w-full overflow-x-auto">
                            <table class="w-full text-left">
                                <thead>
                                    <tr class="border border-transparent border-b-slate-200 dark:border-b-navy-500">
                                        <th class="whitespace-nowrap px-3 py-3 font-semibold uppercase text-slate-800 dark:text-navy-100 lg:px-5">Day</th>
                                        <th class="whitespace-nowrap px-3 py-3 font-semibold uppercase text-slate-800 dark:text-navy-100 lg:px-5">Start Date</th>
                                        <th class="whitespace-nowrap px-3 py-3 font-semibold uppercase text-slate-800 dark:text-navy-100 lg:px-5">End Date</th>
                                        <th class="whitespace-nowrap px-3 py-3 font-semibold uppercase text-slate-800 dark:text-navy-100 lg:px-5">Is Holiday</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="border border-transparent border-b-slate-200 dark:border-b-navy-500">
                                        <td class="whitespace-nowrap px-4 py-3 sm:px-5">{ this.state.selectedday}</td>
                                        <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                                            <label class="relative flex">
                                                <input x-init="$el._x_flatpickr = flatpickr($el,{enableTime: true,noCalendar: true,dateFormat: 'H:i',time_24hr:true})" class="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" value={this.state.startH} placeholder="Start Time" type="text" id="workinghourstarttime"/>
                                                <span class="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                    </svg>
                                                </span>
                                            </label>
                                        </td>
                                        <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                                            <label class="relative flex">
                                                <input x-init="$el._x_flatpickr = flatpickr($el,{enableTime: true,noCalendar: true,dateFormat: 'H:i',time_24hr:true})" class="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="End Time" value={this.state.endHour} type="text" id="workinghourendtime"/>
                                                <span class="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </span>
                                            </label>
                                        </td>
                                        <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                                            <label class="inline-flex items-center space-x-2">
                                                <input class="form-switch h-5 w-10 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-accent dark:checked:before:bg-white" checked={this.state.isholiday} type="checkbox" value="true" id="isholiday" 
                                                    onChange={()=>{
                                                            this.setState(({ isholiday }) => ({ isholiday: !isholiday }))
                                                    }}/>
                                                <span>Enable if Day off.</span>
                                            </label>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="text-center mt-2">  
                            <button class="btn bg-primary btn-color from-sky-400 to-blue-600 font-medium text-white m-2" onClick={this.updateWorkingHour}>Save</button>
                            <button class="btn bg-primary btn-color from-sky-400 to-blue-600 font-medium text-white m-2" onClick={this.handleHourHide}>Close</button>
                        </div>
                    </div>
                </div>
                :
                null
            }
            { this.state.showEditSpecialHourModal ? 
                <div class="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5" role="dialog">
                    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur transition-opacity duration-300" id="showCountryModal" onClick={this.handleshowEditSpecialHourModalHide}></div>
                    <div class="relative w-full max-w-2xl origin-bottom rounded-lg bg-white pb-4 transition-all duration-300 dark:bg-navy-700">
                        <div class="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
                            <h3 class="text-base font-medium text-slate-700 dark:text-navy-100">Edit Special Hours</h3>
                            <button class="btn -mr-1.5 h-7 w-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25" onClick={this.handleshowEditSpecialHourModalHide}>
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" >
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" ></path>
                                </svg>
                            </button>
                        </div>
                        <div class="is-scrollbar-hidden min-w-full overflow-x-auto">
                            <table class="w-full text-left">
                                <thead>
                                    <tr class="border border-transparent border-b-slate-200 dark:border-b-navy-500">
                                        <th class="whitespace-nowrap px-3 py-3 font-semibold uppercase text-slate-800 dark:text-navy-100 lg:px-5">Date</th>
                                        <th class="whitespace-nowrap px-3 py-3 font-semibold uppercase text-slate-800 dark:text-navy-100 lg:px-5">Start Time</th>
                                        <th class="whitespace-nowrap px-3 py-3 font-semibold uppercase text-slate-800 dark:text-navy-100 lg:px-5">End Time</th>
                                        <th class="whitespace-nowrap px-3 py-3 font-semibold uppercase text-slate-800 dark:text-navy-100 lg:px-5">Holiday</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="border border-transparent border-b-slate-200 dark:border-b-navy-500">
                                            <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                                                <label class="relative flex">
                                                    <input x-init="$el._x_flatpickr = flatpickr($el)" class="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Date." type="text" id="editspecialdate" value={moment(this.state.selectedEditSpecialHours.date).format('YYYY-MM-DD')}/>
                                                    <span class="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                                        </svg>
                                                    </span>
                                                </label>
                                            </td>
                                            <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                                                <label class="relative flex">
                                                    <input x-init="$el._x_flatpickr = flatpickr($el,{enableTime: true,noCalendar: true,dateFormat: 'H:i',time_24hr:true})" class="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Start Time" type="text" id="editspecialstarttime" value={this.state.selectedEditSpecialHours.starttime}/>
                                                    <span class="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                        </svg>
                                                    </span>
                                                </label>
                                            </td>
                                            <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                                                <label class="relative flex">
                                                    <input x-init="$el._x_flatpickr = flatpickr($el,{enableTime: true,noCalendar: true,dateFormat: 'H:i',time_24hr:true})" class="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="End Time" type="text" id="editspecialendtime" value={ this.state.selectedEditSpecialHours.endtime}/>
                                                    <span class="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </span>
                                                </label>
                                            </td>
                                            <td>
                                                <label class="inline-flex items-center space-x-2">
                                                    <input class="form-checkbox is-outline h-5 w-5 rounded-full border-slate-400/70 before:bg-primary checked:border-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:before:bg-accent dark:checked:border-accent dark:hover:border-accent dark:focus:border-accent" type="checkbox" id="editisholiday"/>
                                                    <p>Enable Day Off</p>
                                                </label>
                                            </td>
                                        </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="text-center mt-2">  
                            <button class="btn bg-primary btn-color from-sky-400 to-blue-600 font-medium text-white m-2" onClick={this.saveEditSpecialHour}>Save</button>
                            <button class="btn bg-primary btn-color from-sky-400 to-blue-600 font-medium text-white m-2" onClick={this.handleshowEditSpecialHourModalHide}>Close</button>
                        </div>
                    </div>
                </div>
                :
                null
            }
             <ToastContainer />
        </main>
        )
    }
}