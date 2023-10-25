import React, { useEffect } from 'react'
import "./payment.css"
import { BsCheckCircleFill } from 'react-icons/bs';
import swal from 'sweetalert'
import axios from 'axios'
 import configData from '../../utils/constants/config.json'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
const PaymentSuccss = () =>{
  const[state, setState]=useState(null)
  const sessionId = new URLSearchParams(window?.location?.search)?.get( 'session_id' )
  const noOfMonths = new URLSearchParams(window?.location?.search)?.get( 'noOfMonths' )
  const indicator= new URLSearchParams(window?.location?.search)?.get( 'indicator' )
  const offerId = new URLSearchParams(window?.location?.search)?.get( 'offerId' )
  const couponId = new URLSearchParams(window?.location?.search)?.get( 'couponId' )
  const branchId = new URLSearchParams(window?.location?.search)?.get( 'branchId' )
  const topBannerBranchId = new URLSearchParams(window?.location?.search)?.get( 'branchId' ) 
  const bottomBannerBranchId = new URLSearchParams(window?.location?.search)?.get( 'branchId' ) 
 
     let setFeaturedUrl= ""
      if(indicator=="offer"){
        setFeaturedUrl="set-featured-offer"
      } else if(indicator=="couponcons"){
        setFeaturedUrl="set-featured-coupon"
      } else if(indicator=="branch"){
        setFeaturedUrl="set-featured-branch"
      } else if(indicator=="top-banner"){
        setFeaturedUrl="set-featured-top-banner"
      } else if(indicator=="bottom-banner"){
        setFeaturedUrl="set-featured-bottom-banner"
      }
    useEffect(()=>{
      const savedToken = localStorage.getItem('loginToken')
      var urlencoded = new URLSearchParams();
         urlencoded.append("noOfMonths", noOfMonths);

        if (indicator == "offer") {
          urlencoded.append("offerId", offerId);
        } else if (indicator == "couponcons") {
          urlencoded.append("couponId", couponId);
        } else if (indicator == "branch") {
          urlencoded.append("branchId", branchId);
        } else if (indicator == "top-banner") {
          urlencoded.append("branchId", topBannerBranchId);
        } else if (indicator == "bottom-banner") {
          urlencoded.append("branchId", bottomBannerBranchId);
        }
        
        urlencoded.append("sessionId", sessionId);
        axios({
            method: "post",
            url: configData.SERVER_URL + `partner/promotion/${setFeaturedUrl}`,
            data: urlencoded,
            headers: { 
                "Content-Type": "application/x-www-form-urlencoded",
                "accesstoken" : configData.ACCESSTOKEN,
                "logintoken" : savedToken
            },
        }).then(resp => {
            if(parseInt(Object.keys(resp.data)[0]) === 200){
              setState(true)
              swal({
                text: resp.data[Object.keys(resp.data)[0]],
                title: "Thanks",
                icon: "success",
                button: "ok",
              });
              }else{
                swal({
                  text: resp.data[Object.keys(resp.data)[0]],
                  title: "Server Not Responding",
                  icon: "warning",
                  button: "ok",
                });
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
    }, [])
    const navigate = useNavigate();
    const backtohomepage = () => {
        navigate('/')
    }
  return (
    <main class="main-content px-[var(--margin-x)] pb-8">
      {state ?
      <>
    <div class="flex items-center space-x-4 py-5 lg:py-6">
      <h2 class="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">
        Payment
      </h2>
      <div class="hidden h-full py-1 sm:flex">
        <div class="h-full w-px bg-slate-300 dark:bg-navy-600"></div>
      </div>
      <ul class="hidden flex-wrap items-center space-x-2 sm:flex">
        <li class="flex items-center space-x-2">
          <a
            class="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent"
             
          >
            Payment success
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
        <li>Success</li>
      </ul>
    </div> 
{/* bpdy */}

 {/* <div class="card-success"> */}
    <div className='successfulcard'>
      <div className='checkicon font-bold text-3xl'>
        <div className='p-2'><BsCheckCircleFill/></div>
        <div>Payment Successful!</div>
      </div>
        <h1 className='font-bold py-1'>Thank you! Your payment of AED. {noOfMonths*1000} has been received</h1> 
        {/* <p className='py-2'>Order ID : IC-1234, IC-5678 | Transection ID : 12345</p> */}
        <h2 className='pt-3 pb-2 text-lg'>Payment Details</h2>
      <div className='shadow px-4 py-2 card-success'>
          <div className='flex'>
            <div className='px-8'>Total Amount: AED. {noOfMonths*1000}</div>
            <div className='px-8'>Paid Amount: AED. {noOfMonths*1000}</div>
          </div>
          {/* <div className='flex'>
            <div className='px-8'>Total Amount: ₹ 5000</div>
            <div className='px-8'>Paid Via Account Balance: ₹ 1000</div>
          </div> */}
      </div>
      {/* <p className='py-4'>Please wait for some time for the amount to show up in your Dr Account</p> */}
      <p className='py-4 text-slate-300'>Please Contact us at +971 4 835 9754 or email to hello@drclinica.com for any querry</p>
      <button className="successbtn px-5 py-1 my-3" onClick={backtohomepage}>OK</button>
      {/* </div> */}

      </div>  
      </>:
       <div style={{display:"block", margin:"auto", width:"200px"}}>
       <svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
       </svg>
       Loading...
     </div>
      }
    </main>
  )
}
export default PaymentSuccss