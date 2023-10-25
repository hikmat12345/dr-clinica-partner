import React from 'react';
import swal from 'sweetalert';
import axios from 'axios';
import configData from '../../utils/constants/config.json'
import { Circle, Wrapper } from './account.style';
import Typography from '../../components/Typography';
import { FlexCenterCenter, FlexColumn, FlexColumnSpaceBetween, FlexRow } from '../../styles/index.style';
import { Avatar } from 'antd';
import Card from '../../components/Card';
import { cardData } from '../../Data';
import axiosClient from '../../utils/helpers/server';
import { useEffect } from 'react';
import { getSubscriptionData } from '../../utils/helpers/api';
import { useState } from 'react';
import { Flex } from '../../styles/index.style';
import { Container, CardContainer } from '../../components/Card/card.style';

const SubscriptionsAndPackaging = (props) => {
const [packageData, setPackageData] = useState();
const[subscriptionData, setSubscriptionData] = useState();
  const getPackagesData = async() => {
    await axiosClient.get("admin/package/getall")
    .then((res)=>{
      setPackageData(res.data.packages)
    })
  }
  const getSubscriptionData = async() => {
    await axiosClient.get("partner/subscription/getall")
    .then((res)=>{
      setSubscriptionData(res.data.subcription)
    })
  }
  useEffect(() => {
    getPackagesData();
    getSubscriptionData();
  }, []);
  const PackageFeatures = packageData?.map((res)=>{return(res.packagefeatures)})
// console.log(PackageFeatures, "Package Features to transfer")
// console.log(packageData, "Package Data in Main")
// console.log(subscriptionData, "Subscription Data")
    return(
      
        <main class="main-content px-[var(--margin-x)] pb-8">
            <div class="items-center justify-between">
                <div class="flex items-center space-x-4 py-5 lg:py-6">
                    <h2 class="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">Subscriptions and Packaging</h2>
                    <div class="hidden h-full py-1 sm:flex">
                        <div class="h-full w-px bg-slate-300 dark:bg-navy-600"></div>
                    </div>
                    <ul class="hidden flex-wrap items-center space-x-2 sm:flex">
                        <li class="flex items-center space-x-2">
                            <a class="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent" href="/settings">Account</a>
                            <svg x-ignore xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                            </svg>
                        </li>
                        <li>Subscriptions and Packaging</li>
                    </ul>
                </div>
            </div>
            {subscriptionData?.map((data)=>{
              console.log(data, "Inside Subscription Arary")
              return(
              <>
              <Wrapper primary>
            <Typography type = "h1" weight = "semiBold" color = "black">{data.packages.name}</Typography>
            <FlexRow paddingTop>
              
                <div style={{width : "100%"}}>
                <FlexRow paddingRight>
                  <Typography type = "small" weight = "medium" color = "gray">
                  Current Plan
                </Typography>
                <Typography type = "small" weight = "medium" color = "black">
                {data.packages.name}
                </Typography>
                </FlexRow>
  
                <FlexRow paddingRight>
                <Typography type = "small" weight = "medium" color = "gray">
                  Monthly Discount
                </Typography>
                <Typography type = "small" weight = "medium" color = "light blue">
                  {data.packages.monthlydiscount}
                </Typography>
                </FlexRow>
  
                <FlexRow paddingRight>
                <Typography type = "small" weight = "medium" color = "gray">
                  WhatsApp notifications left
                </Typography>
                <Typography type = "small" weight = "medium" color = "black">
                {data.whatsappnotificationleft}
                </Typography>
                </FlexRow>
                </div>
                <div style={{width : "100%"}}>
                <FlexRow paddingRight>
                <Typography type = "small" weight = "medium" color = "gray">
                  valid till
                </Typography>
                <Typography type = "small" weight = "medium" color = "black">
                  {data.validuntil}
                </Typography>
                </FlexRow>
                <FlexRow paddingRight>
                <Typography type = "small" weight = "medium" color = "gray">
                  SMS left
                </Typography>
                <Typography type = "small" weight = "medium" color = "black">
                  {data.smsleft}
                </Typography>
                </FlexRow>
                <FlexRow paddingRight>
                <Typography type = "small" weight = "medium" color = "gray">
                  Next Payment
                </Typography>
                <Typography type = "small" weight = "medium" color = "black">
                  {data.nextpayment}
                </Typography>
                </FlexRow>
                </div>
                <div style={{width : "100%"}}>
                <FlexRow paddingRight>
                <Typography type = "small" weight = "medium" color = "gray">
                  Email left
                </Typography>
                <Typography type = "small" weight = "medium" color = "black">
                  {data.emailsleft}
                </Typography>
                </FlexRow>
                <FlexRow paddingRight>
                <Typography type = "small" weight = "medium" color = "gray">
                Push Notofications Left
                </Typography>
                <Typography type = "small" weight = "medium" color = "black">
                  {data.pushnotoficationleft}
                </Typography>
                </FlexRow>
                <FlexRow paddingRight>
                <Typography type = "small" weight = "medium" color = "gray">
                Price
                </Typography>
                <Typography type = "small" weight = "medium" color = "black">
                  {data.packages.price}
                </Typography>
                </FlexRow>
                </div>
                <div style={{width : "100%"}}>
                <FlexRow paddingRight>
                <Typography type = "small" weight = "medium" color = "gray">
                Monthly Discount
                </Typography>
                <Typography type = "small" weight = "medium" color = "black">
                  {data.packages.monthlydiscount}
                </Typography>
                </FlexRow>
                <FlexRow paddingRight>
                <Typography type = "small" weight = "medium" color = "gray">
                Six Months Discount
                </Typography>
                <Typography type = "small" weight = "medium" color = "black">
                {data.packages.sixmonthdiscount}
                </Typography>
                </FlexRow>
                <FlexRow paddingRight>
                <Typography type = "small" weight = "medium" color = "gray">
                Yearly Discount
                </Typography>
                <Typography type = "small" weight = "medium" color = "black">
                  {data.packages.yearlydiscount}
                </Typography>
                </FlexRow>
                </div>
              
            </FlexRow>
           </Wrapper>
              </>
            )})}
           &nbsp;
           <Container>
            {packageData?.map((data)=>{
            const dataSaab = data?.packagefeatures.map((res)=>{return(res.name)})
            // console.log(data, "Data in a Map function")

            const Features = data.packagefeatures.map((res)=>{return(res.name)})
            // console.log(Features, "Package Features in Package Data")
            return(
              <>
                <CardContainer>
              <Card title = {data.name} description = {data.description}  packageData = {packageData} price = {data.price}/>
                </CardContainer>
              </>
            )
           })}
           </Container>
           
           <Wrapper primary center> 
           <Typography type = "h1" weight = "semiBold" color = "black">All plans include : </Typography>

           <FlexRow paddingTop>
              
                <div style={{width : "100%"}}>
                <FlexRow paddingRight start>
                    <Circle/>
                  <Typography type = "small" weight = "medium" color = "gray" paddingLeft = "1rem">
                  Professional Booking website or widget
                </Typography>
                </FlexRow>
  
                <FlexRow paddingRight start>
                <Circle/>
                <Typography type = "small" weight = "medium" color = "gray" paddingLeft = "1rem">
                  Custom wording on booking website
                </Typography>
                </FlexRow>
  
                <FlexRow paddingRight start>
                <Circle/>
                <Typography type = "small" weight = "medium" color = "gray" paddingLeft = "1rem">
                  Delete history
                </Typography>
                </FlexRow>
                <FlexRow paddingRight start>
                <Circle/>
                <Typography type = "small" weight = "medium" color = "gray" paddingLeft = "1rem">
                  Your own T&C
                </Typography>
                </FlexRow>
                </div>
                <div style={{width : "100%"}}>
                <FlexRow paddingRight start>
                <Circle/>
                <Typography type = "small" weight = "medium" color = "gray" paddingLeft = "1rem">
                Automatic email notificatins
                </Typography>
                </FlexRow>
                <FlexRow paddingRight start>
                <Circle/>
                <Typography type = "small" weight = "medium" color = "gray" paddingLeft = "1rem">
                Booking page directory listing
                </Typography>
                </FlexRow>
                <FlexRow paddingRight start>
                <Circle/>
                <Typography type = "small" weight = "medium" color = "gray" paddingLeft = "1rem">
                Password security settings
                </Typography>
                </FlexRow>
                <FlexRow paddingRight start>
                <Circle/>
                <Typography type = "small" weight = "medium" color = "gray" paddingLeft = "1rem">
                Your own Cancellation policy
                </Typography>
                </FlexRow>
                </div>
                <div style={{width : "100%"}}>
                <FlexRow paddingRight start>
                <Circle/>
                <Typography type = "small" weight = "medium" color = "gray" paddingLeft = "1rem">
                  Clients can book in our time zone
                </Typography>
                </FlexRow>
                <FlexRow paddingRight start>
                <Circle/>
                <Typography type = "small" weight = "medium" color = "gray" paddingLeft = "1rem">
                  Exportable reports
                </Typography>
                </FlexRow>
                <FlexRow paddingRight start>
                <Circle/>
                <Typography type = "small" weight = "medium" color = "gray" paddingLeft = "1rem">
                  Google 2FA user access
                </Typography>
                </FlexRow>
                <FlexRow paddingRight start>
                <Circle/>
                <Typography type = "small" weight = "medium" color = "gray" paddingLeft = "1rem">
                  Independent schedules for company
                </Typography>
                </FlexRow>
                </div>
              
            </FlexRow>

           </Wrapper>
        </main>
    
    )
  }
  export default SubscriptionsAndPackaging;