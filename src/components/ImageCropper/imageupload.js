import React from 'react';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css"
import swal from 'sweetalert';

export default function ImageResize({aspectRatio, imageModalClose, changeImage, saveImageAdded, loader=false}) {
    const [image, setImage] = React.useState("");
    const [cropData, setCropData] = React.useState("");
    const [cropper, setCropper] = React.useState(null);
    const [saveImage, setSaveImage] = React.useState(true);

    const dataURLtoBlob = (dataURL) => {
        let array, binary, i, len;
        binary = atob(dataURL.split(',')[1]);
        array = [];
        i = 0;
        len = binary.length;
        while (i < len) {
          array.push(binary.charCodeAt(i));
          i++;
        }
        return new Blob([new Uint8Array(array)], {
          type: 'image/png'
        });
      };

    const getCropData = () => {
        if (typeof cropper !== "undefined") {
            setCropData(cropper.getCroppedCanvas().toDataURL());
            const file = dataURLtoBlob(cropper.getCroppedCanvas().toDataURL());
            changeImage(file)
            setSaveImage(false)
        }
    };

    const onChange = (e) => {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        if(files){
            if(files[0].size > 2097152){
                swal({
                    title: "Image Size",
                    text: "Please use image with size below 2 MB",
                    icon: "warning",
                    button: "ok",
                })
                return
            }
            const reader = new FileReader();
            reader.onload = () => {
            setImage(reader.result);
            };
            reader.readAsDataURL(files[0]);
        }
    };

    return (
        <div class="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5" role="dialog">
            <div class="absolute inset-0 bg-slate-900/60 backdrop-blur transition-opacity duration-300" id="addNewServiceCharge" onClick={(e) => imageModalClose(e)}></div>
            <div class="relative w-full origin-bottom rounded-lg bg-white pb-4 transition-all duration-300 dark:bg-navy-700">
                <div class="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
                    <h3 class="text-base font-medium text-slate-700 dark:text-navy-100">Upload Image</h3>
                    <button class="btn -mr-1.5 h-7 w-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25" onClick={(e) => imageModalClose(e)}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" ></path>
                        </svg>
                    </button>
                </div>
                <div class="is-scrollbar-hidden min-w-full overflow-x-auto p-4">
                    <div className="p-4">
                        <div className="mx-auto grid w-full grid-cols-1 sm:grid-cols-2 sm:gap-5 lg:gap-6">
                            <div className="card p-4 sm:p-5">
                                    {image ? (
                                        <Cropper
                                            className="cropper"
                                            zoomTo={0.5}
                                            aspectRatio={aspectRatio}
                                            initialAspectRatio={1}
                                            src={image}
                                            viewMode={1}
                                            minCropBoxHeight={10}
                                            minCropBoxWidth={10}
                                            background={false}
                                            responsive={true}
                                            autoCropArea={1}
                                            checkOrientation={false}
                                            onInitialized={(instance) => {
                                                setCropper(instance);
                                            }}
                                            guides={true}
                                        />
                                    ) : (
                                        <h1 className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
                                            How to Crop and Resize Image in the Browser using CropperJs
                                        </h1>
                                    )}
                            </div>
                            <div className="card p-4 sm:p-5">
                                <div id="itemdivcard">
                                    {cropData ? (
                                        <img src={cropData} alt="cropped" />
                                    ) : (
                                    <h1 className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">Cropped image will apear here!</h1>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mx-auto mt-8 grid w-full grid-cols-1 sm:grid-cols-1">
                            <div  >
                                <label class="btn button relative bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90">
                                    <input tabindex="-1" type="file" class="absolute inset-0 h-full w-full opacity-0" onChange={onChange}/>
                                    <div class="flex items-center space-x-2">
                                        <i class="fa-solid fa-cloud-arrow-up text-base"></i>
                                        <span>Add New Image</span>
                                    </div>
                                </label>
                                <button className={image == "" ? 'button-disabled'  : 'button'} type="button" id="leftbutton" disabled={image == "" ? true  : false} onClick={getCropData}>
                                    Crop Image
                                </button>
                                {loader ? <button className={saveImage ? 'button-disabled'  : 'button'} type="button" id="leftbutton" disabled={saveImage}>
                                    <svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                     <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                                     <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                                    </svg>
                                    Loading...
                                </button>:
                                 <button className={saveImage ? 'button-disabled'  : 'button'} type="button" id="leftbutton" disabled={saveImage} onClick={saveImageAdded}>
                                    Save Image 
                                </button>
                                 }
                            </div>
                        </div>
                    </div>
                </div>
                <div class="text-center">  
                    {/* <button class="btn bg-primary btn-color from-sky-400 to-blue-600 font-medium text-white m-2" onClick={this.handleSaveImage}>Save</button>
                    <button class="btn bg-primary btn-color from-sky-400 to-blue-600 font-medium text-white m-2" id="addNewServiceCharge" onClick={this.modalHide}>Close</button> */}
                </div>
            </div>
        </div>
    )
}