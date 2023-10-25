import React from 'react';
import swal from 'sweetalert';
import axios from 'axios';
import configData from '../../utils/constants/config.json'

export default class StripeComplete extends React.Component{

    componentDidMount () {
        axios({
            method: "get",
            url: configData.SERVER_URL + 'partner/account/activatestripeactive',
            headers: { 
                "Content-Type": "application/x-www-form-urlencoded",
                "accesstoken" : configData.ACCESSTOKEN,
                "logintoken" : localStorage.getItem('loginToken')
            },
        }).then(resp => {
            console.log(resp.data)
            if(parseInt(Object.keys(resp.data)[0]) === 200){
                window.location = "/account/bankaccount";
            }
        }).catch(err => {
            swal({
                title: "Server Not Responding",
                text: "Please reload",
                icon: "warning",
                button: "ok",
            })
            console.log(err)
        })
      }

    render() {
        return (
            <></>
        )
    }
}