import React from 'react';
import { Link } from 'react-router-dom';

export default class TeamSidebar extends React.Component{

  render() {
    return (
        <div class="sidebar-panel">
            <div class="flex h-full grow flex-col bg-white pl-[var(--main-sidebar-width)] dark:bg-navy-750">
                <div class="flex h-18 w-full items-center justify-between pl-4 pr-1">
                    <p class="text-base tracking-wider text-slate-800 dark:text-navy-100" >Service Providers</p>
                    <button class="btn h-7 w-7 rounded-full p-0 text-primary hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:text-accent-light/80 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25" onClick={() => {
                        document.body.classList.remove('is-sidebar-open')
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                </div>

                <div x-data="{expandedItem:null}" class="h-[calc(100%-4.5rem)] overflow-x-hidden pb-6" x-init="$el._x_simplebar = new SimpleBar($el);">
                    <ul class="flex flex-1 flex-col px-4 font-inter">
                        <li><Link x-data="navLink" to="/team/teammember" class="flex py-2 text-xs+ tracking-wide outline-none transition-colors duration-300 ease-in-out">Service provider menu</Link></li>
                        <li><Link x-data="navLink" to="/team/workinghours" class="flex py-2 text-xs+ tracking-wide outline-none transition-colors duration-300 ease-in-out">Working hours</Link></li>
                        <li><Link x-data="navLink" to="/team/commingsoon" class="flex py-2 text-xs+ tracking-wide outline-none transition-colors duration-300 ease-in-out">Permissions</Link></li>
                        <li><Link x-data="navLink" to="/team/commission" class="flex py-2 text-xs+ tracking-wide outline-none transition-colors duration-300 ease-in-out">Commissions</Link></li>
                        <li><Link x-data="navLink" to="/team/provider-reviews" class="flex py-2 text-xs+ tracking-wide outline-none transition-colors duration-300 ease-in-out">Provider reviews</Link></li>
                    </ul>
                </div>
            </div>
        </div>
    )
  }
}