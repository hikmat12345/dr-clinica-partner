import axiosClient from "./server";

export const getSubscriptionData = async () => {
    const { data } =  axiosClient.get(`/admin/package/getall`);
    return data;
  };