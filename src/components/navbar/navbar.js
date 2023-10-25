import React from 'react';
import './navbar.css'

class Navbar extends React.Component{

    constructor(props) {
        super(props)
        this.modeColor = "colorful"
        this.state = {
            notificationMenuClass : "popper-root",
            notificationAllTabClass : "is-active",
            notificationAlertTabClass : "hidden",
            notificationEventsTabClass : "hidden",
            notificationLogsTabClass : "hidden",
            themeColor : localStorage.getItem("dark-mode")
        }
    }

    componentDidMount (){
        if(this.state.themeColor == "dark"){
            document.documentElement.classList.add("dark")
        }
    }

    onThemeChange = (event) => {
        event.preventDefault()
        if(this.modeColor == "colorful"){
            this.modeColor = "colorless"
            document.body.classList.remove('is-monochrome')
        }else{
            this.modeColor = "colorful"
            document.body.classList.add('is-monochrome')
        }
    }

    onModeChange = (event) => {
        event.preventDefault()
        if(this.state.themeColor == "dark"){
            localStorage.setItem('dark-mode', "light")
            this.setState({
                themeColor : "light"
            })
            document.documentElement.classList.remove("dark")
        }else{
            localStorage.setItem('dark-mode', "dark")
            this.setState({
                themeColor : "dark"
            })
            document.documentElement.classList.add("dark")
        }
        window.location.reload(false)
    }

    ontoggleNoficationMenu = (event) => {
        if(this.state.notificationMenuClass == "popper-root"){
            this.setState({
                notificationMenuClass : "popper-root show"
            })
        }else{
            this.setState({
                notificationMenuClass : "popper-root"
            })
        }
    }

	render(){
        console.log(window.location.pathname.split('/')[1], 'window.location.pathname.spli')
		return(
            <nav class="header print:hidden">
                <div class="header-container relative flex w-full bg-white dark:bg-navy-750 print:hidden">
                <div class="flex w-full items-center justify-between">
                    <div class="h-7 w-7">
                    { window.location.pathname.split('/')[1] == "settings" || window.location.pathname.split('/')[1] == "calendar"  ?
                    <></> :
                    <button class="menu-toggle ml-0.5 flex h-7 w-7 flex-col justify-center space-y-1.5 text-primary outline-none focus:outline-none dark:text-accent-light/80" onClick={() => {
                        if(window.location.pathname != "/" && window.location.pathname.split('/')[1] != "settings" && window.location.pathname.split('/')[1] != "calendar" && window.location.pathname.split('/')[1] != "profile"){
                            document.body.classList.add('is-sidebar-open')
                        }
                    }}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>}
                    </div>

                    <div id="toptheme-btn" class="-mr-1.5 flex items-center space-x-2">
                        {/* <button class="btn h-8 w-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 sm:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5.5 w-5.5 text-slate-500 dark:text-navy-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                            </svg>
                        </button>

                        <button class="btn h-8 w-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"  onClick={this.onModeChange}>
                            { this.state.themeColor == "dark" ? 
                                <svg class="h-6 w-6 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M11.75 3.412a.818.818 0 01-.07.917 6.332 6.332 0 00-1.4 3.971c0 3.564 2.98 6.494 6.706 6.494a6.86 6.86 0 002.856-.617.818.818 0 011.1 1.047C19.593 18.614 16.218 21 12.283 21 7.18 21 3 16.973 3 11.956c0-4.563 3.46-8.31 7.925-8.948a.818.818 0 01.826.404z"/>
                                </svg>
                                :
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
                                </svg>
                            }
                        </button>

                        <button class="btn h-8 w-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25" onClick={this.onThemeChange}>
                            <i class="fa-solid fa-palette bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-lg font-semibold text-transparent"></i>
                        </button> */}

                        {/* <button x-ref="popperRef" class="btn relative h-8 w-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25" onClick={this.ontoggleNoficationMenu}>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-500 dark:text-navy-100" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.375 17.556h-6.75m6.75 0H21l-1.58-1.562a2.254 2.254 0 01-.67-1.596v-3.51a6.612 6.612 0 00-1.238-3.85 6.744 6.744 0 00-3.262-2.437v-.379c0-.59-.237-1.154-.659-1.571A2.265 2.265 0 0012 2c-.597 0-1.169.234-1.591.65a2.208 2.208 0 00-.659 1.572v.38c-2.621.915-4.5 3.385-4.5 6.287v3.51c0 .598-.24 1.172-.67 1.595L3 17.556h12.375zm0 0v1.11c0 .885-.356 1.733-.989 2.358A3.397 3.397 0 0112 22a3.397 3.397 0 01-2.386-.976 3.313 3.313 0 01-.989-2.357v-1.111h6.75z" />
                            </svg>
                            <span class="absolute -top-px -right-px flex h-3 w-3 items-center justify-center">
                                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-80"></span>
                                <span class="inline-flex h-2 w-2 rounded-full bg-secondary"></span>
                            </span>
                        </button> */}
                    
                        <div class="flex">
                            <div class={this.state.notificationMenuClass} x-ref="popperRoot" style={{position:"fixed",right:"10px",top:"100%"}}>
                                <div x-data="{activeTab:'tabAll'}" class="popper-box mx-4 mt-1 flex max-h-[calc(100vh-6rem)] w-[calc(100vw-2rem)] flex-col rounded-lg border border-slate-150 bg-white shadow-soft dark:border-navy-800 dark:bg-navy-700 dark:shadow-soft-dark sm:m-0 sm:w-80">
                                    <div class="rounded-t-lg bg-slate-100 text-slate-600 dark:bg-navy-800 dark:text-navy-200">
                                        <div class="flex items-center justify-between px-4 pt-2">
                                            <div class="flex items-center space-x-2">
                                                <h3 class="font-medium text-slate-700 dark:text-navy-100">Notifications</h3>
                                                <div class="badge h-5 rounded-full bg-primary/10 px-1.5 text-primary dark:bg-accent-light/15 dark:text-accent-light">26</div>
                                            </div>
                                            <button class="btn -mr-1.5 h-7 w-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                                </svg>
                                            </button>
                                        </div>
                                        <div class="is-scrollbar-hidden flex shrink-0 overflow-x-auto px-3">
                                            <button class="btn shrink-0 rounded-none border-b-2 px-3.5 py-2.5" onClick={() => {
                                                this.setState({
                                                    notificationAllTabClass : "is-active",
                                                    notificationAlertTabClass : "hidden",
                                                    notificationEventsTabClass : "hidden",
                                                    notificationLogsTabClass : "hidden"
                                                })
                                            }}>
                                                <span>All</span>
                                            </button>
                                            <button class="btn shrink-0 rounded-none border-b-2 px-3.5 py-2.5" onClick={() => {
                                                this.setState({
                                                    notificationAllTabClass : "hidden",
                                                    notificationAlertTabClass : "is-active",
                                                    notificationEventsTabClass : "hidden",
                                                    notificationLogsTabClass : "hidden"
                                                })
                                            }}>
                                                <span>Alets</span>
                                            </button>
                                            <button class="btn shrink-0 rounded-none border-b-2 px-3.5 py-2.5" onClick={() => {
                                                this.setState({
                                                    notificationAllTabClass : "hidden",
                                                    notificationAlertTabClass : "hidden",
                                                    notificationEventsTabClass : "is-active",
                                                    notificationLogsTabClass : "hidden"
                                                })
                                            }}>
                                                <span>Events</span>
                                            </button>
                                            <button class="btn shrink-0 rounded-none border-b-2 px-3.5 py-2.5" onClick={() => {
                                                this.setState({
                                                    notificationAllTabClass : "hidden",
                                                    notificationAlertTabClass : "hidden",
                                                    notificationEventsTabClass : "hidden",
                                                    notificationLogsTabClass : "is-active"
                                                })
                                            }}>
                                                <span>Logs</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div class="tab-content flex flex-col overflow-hidden">
                                        <div class={ "is-scrollbar-hidden space-y-4 overflow-y-auto px-4 py-4 " + this.state.notificationAllTabClass}>
                                            <div class="flex items-center space-x-3">
                                                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary/10 dark:bg-secondary-light/15">
                                                    <i class="fa fa-user-edit text-secondary dark:text-secondary-light"></i>
                                                </div>
                                                <div>
                                                    <p class="font-medium text-slate-600 dark:text-navy-100">User Photo Changed</p>
                                                    <div class="mt-1 text-xs text-slate-400 line-clamp-1 dark:text-navy-300">
                                                        John Doe changed his avatar photo
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="flex items-center space-x-3">
                                                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-info/10 dark:bg-info/15">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p class="font-medium text-slate-600 dark:text-navy-100">Mon, June 14, 2021</p>
                                                    <div class="mt-1 flex text-xs text-slate-400 dark:text-navy-300">
                                                        <span class="shrink-0">08:00 - 09:00</span>
                                                        <div class="mx-2 my-1 w-px bg-slate-200 dark:bg-navy-500"></div>
                                                        <span class="line-clamp-1">Frontend Conf</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="flex items-center space-x-3">
                                                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 dark:bg-accent-light/15">
                                                    <i class="fa-solid fa-image text-primary dark:text-accent-light"></i>
                                                </div>
                                                <div>
                                                    <p class="font-medium text-slate-600 dark:text-navy-100">Images Added</p>
                                                    <div
                                                    class="mt-1 text-xs text-slate-400 line-clamp-1 dark:text-navy-300"
                                                    >
                                                    Mores Clarke added new image gallery
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class={ "is-scrollbar-hidden space-y-4 overflow-y-auto px-4 py-4 " + this.state.notificationAlertTabClass}>
                                            <div class="flex items-center space-x-3">
                                                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary/10 dark:bg-secondary-light/15">
                                                    <i class="fa fa-user-edit text-secondary dark:text-secondary-light"></i>
                                                </div>
                                                <div>
                                                    <p class="font-medium text-slate-600 dark:text-navy-100">User Photo Changed</p>
                                                    <div class="mt-1 text-xs text-slate-400 line-clamp-1 dark:text-navy-300">John Doe changed his avatar photo</div>
                                                </div>
                                            </div>
                                            <div class="flex items-center space-x-3">
                                                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 dark:bg-accent-light/15">
                                                    <i class="fa-solid fa-image text-primary dark:text-accent-light"></i>
                                                </div>
                                                <div>
                                                    <p class="font-medium text-slate-600 dark:text-navy-100">Images Added</p>
                                                    <div class="mt-1 text-xs text-slate-400 line-clamp-1 dark:text-navy-300">
                                                        Mores Clarke added new image gallery
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="flex items-center space-x-3">
                                                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-success/10 dark:bg-success/15">
                                                    <i class="fa fa-leaf text-success"></i>
                                                </div>
                                                <div>
                                                    <p class="font-medium text-slate-600 dark:text-navy-100">Design Completed</p>
                                                    <div class="mt-1 text-xs text-slate-400 line-clamp-1 dark:text-navy-300">
                                                        Robert Nolan completed the design of the CRM application
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class={ "is-scrollbar-hidden space-y-4 overflow-y-auto px-4 py-4 " + this.state.notificationEventsTabClass}>
                                            <div class="flex items-center space-x-3">
                                                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-info/10 dark:bg-info/15">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p class="font-medium text-slate-600 dark:text-navy-100">Mon, June 14, 2021</p>
                                                    <div class="mt-1 flex text-xs text-slate-400 dark:text-navy-300">
                                                        <span class="shrink-0">08:00 - 09:00</span>
                                                        <div class="mx-2 my-1 w-px bg-slate-200 dark:bg-navy-500"></div>
                                                        <span class="line-clamp-1">Frontend Conf</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="flex items-center space-x-3">
                                                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-info/10 dark:bg-info/15">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p class="font-medium text-slate-600 dark:text-navy-100">Wed, June 21, 2021</p>
                                                    <div class="mt-1 flex text-xs text-slate-400 dark:text-navy-300">
                                                        <span class="shrink-0">16:00 - 20:00</span>
                                                        <div class="mx-2 my-1 w-px bg-slate-200 dark:bg-navy-500"></div>
                                                        <span class="line-clamp-1">UI/UX Conf</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class={ "is-scrollbar-hidden space-y-4 overflow-y-auto px-4 py-4 " + this.state.notificationLogsTabClass}>
                                            <div class="mt-8 pb-8 text-center">
                                                <img class="mx-auto w-36" src="images/illustrations/empty-girl-box.svg" alt="image"/>
                                                <div class="mt-5">
                                                    <p class="text-base font-semibold text-slate-700 dark:text-navy-100">No any logs</p>
                                                    <p class="text-slate-400 dark:text-navy-300"> There are no unread logs yet</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <button class="btn h-8 w-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25" onClick={() => { document.getElementById('rightsidedrawer').classList.remove("hidden") }}>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5.5 w-5.5 text-slate-500 dark:text-navy-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                            </svg>
                        </button> */}
                    </div>
                </div>
                </div>
            </nav>
		);
	}
}

export default Navbar