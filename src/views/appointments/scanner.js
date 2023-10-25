import useScanDetection from 'use-scan-detection';
import axiosClient from '../../utils/helpers/server';
import swal from 'sweetalert';
import { useState } from 'react';
 
const Scanner = ({appointment, updateAppointment}) => {
    const [voucher, setVoucher] = useState()
    const [qrcode, setQrcode] = useState()
    const [payableAmount, setPayableAmount] = useState(0)
    const [isPayment, setIsPayment] = useState(false)
    const [voucherpayments, setVoucherpayments] = useState()
    const [scanned, setScanned] = useState(false)
 
    useScanDetection({
        onComplete: (qrcode) => {
            console.log(qrcode)
            setQrcode(qrcode)
            getScannedVoucher(qrcode)
        },
        minLength: 13, // EAN13
        onError: (error) => {
            swal({
                title: "Scan Fialed",
                text: "Please reconnect the scanner and try again",
                icon: "warning",
                button: "ok",
            })
        }
    });

    const getScannedVoucher = (qrcode) => {
        axiosClient.get(`partner/vouchers/scanvoucher?qrcode=${qrcode}`).then(resp => {
            if(parseInt(Object.keys(resp.data)[0]) === 200){
            console.log(resp.data)
            setVoucher(resp.data.voucher)
            setVoucherpayments(resp.data.voucherpayments)
            setScanned(true)
            }else{
                swal({
                    title: "Get Appoitment Data",
                    text: resp.data[Object.keys(resp.data)[0]],
                    icon: "warning",
                    button: "ok",
                })
            }
        })
    }

    const onPaymentClicked = (e) => {
        e.preventDefault()
        console.log(payableAmount)
        console.log(parseFloat(voucher.vouchers.value - voucherpayments._sum.amount).toFixed(2))
        if(parseFloat(voucher.vouchers.value - voucherpayments._sum.amount).toFixed(2) < parseFloat(payableAmount)){
            swal({
                title: "Invalid Payment Amount",
                text: "Please enter the valid amount to pay that must be below than AED "+parseFloat(voucher.vouchers.value - voucherpayments._sum.amount).toFixed(2),
                icon: "warning",
                button: "ok",
            })
            return
        }
        var bodyFormData = new URLSearchParams()
        bodyFormData.append('bookingId', appointment.id)
        bodyFormData.append('voucherId', voucher.id)
        bodyFormData.append('bill', payableAmount)
        axiosClient.post(`partner/vouchers/paybyvoucher`,bodyFormData).then(resp => {
            if(parseInt(Object.keys(resp.data)[0]) === 200){
                console.log(resp.data)
                updateAppointment(resp.data.appointment,resp.data.payment.length > 0 ? resp.data.payment[0]._sum.amount : 0.0)
                getScannedVoucher(qrcode)
            }else{
                swal({
                    title: "Get Appoitment Data",
                    text: resp.data[Object.keys(resp.data)[0]],
                    icon: "warning",
                    button: "ok",
                })
            }
        })

    }
    
    return (
        <>
        { scanned ?
            <>
                { voucher ? 
                    <div class="items-center justify-between alert flex rounded-lg border border-slate-300 px-4 py-4 text-slate-800 dark:border-navy-450 dark:text-navy-50 sm:px-5">
                        {parseFloat(voucherpayments._sum.amount) >= parseFloat(voucher.vouchers.value) ? 
                            <>
                                <div>
                                    <p>Voucher Scanned is Used Already</p>
                                    <small> <button class="underline decoration-primary decoration-2">the voucher you are scanning is already used. please contact admin for more details</button></small>
                                </div>
                                <div class="badge bg-warning text-white"><i class="fa fa-credit-card pr-1" aria-hidden="true"></i>AED { parseFloat(voucher.vouchers.value - voucherpayments._sum.amount).toFixed(2)}</div>
                            </>
                            :
                            <>
                                <div>
                                    <p>Voucher Scanned is Valid</p>
                                    <small> <button class="underline decoration-primary decoration-2" onClick={() => {setIsPayment(true)}}>click to pay</button></small>
                                </div>
                                <div class="badge bg-warning text-white"><i class="fa fa-credit-card pr-1" aria-hidden="true"></i>AED { parseFloat(voucher.vouchers.value - voucherpayments._sum.amount).toFixed(2)}</div>
                            </>
                        }
                    </div>
                    :
                    <div class="items-center justify-between alert flex rounded-lg border border-slate-300 px-4 py-4 text-slate-800 dark:border-navy-450 dark:text-navy-50 sm:px-5">
                        <div>
                            <p>Voucher Scanned is not Valid</p>
                            <small> <button class="underline decoration-primary decoration-2">please try again</button></small>
                        </div>
                        <div class="badge bg-warning text-white"><i class="fa fa-credit-card pr-1" aria-hidden="true"></i>AED 00</div>
                    </div>

                }
                { isPayment ? 
                    <div class="items-center justify-between alert flex rounded-lg border border-slate-300 px-4 py-4 text-slate-800 dark:border-navy-450 dark:text-navy-50 sm:px-5">
                        <div> <label class="block">
                            <span>Enter the amount you want to pay:</span>
                            <input class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" value={payableAmount} onChange={(e) => {setPayableAmount(e.currentTarget.value)}} type="number"/>
                        </label>
                        </div>
                        <div class="badge bg-warning text-white" onClick={onPaymentClicked}><i class="fa fa-credit-card pr-1" aria-hidden="true"></i>Pay</div>
                    </div>
                    : <></>
                }
            </>
            :
            <div class="items-center justify-between alert flex rounded-lg border border-slate-300 px-4 py-4 text-slate-800 dark:border-navy-450 dark:text-navy-50 sm:px-5">
                <div>
                    <p>Please Scan the voucher</p>
                    <small> <button class="underline decoration-primary decoration-2">(please place the voucher near to scanner)</button></small>
                </div>
            </div>
        }
        </>
    );
};
 
export default Scanner