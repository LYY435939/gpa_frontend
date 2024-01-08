import axios from 'axios'
import qs from "qs";

import {ElLoading} from 'element-plus'

let loading;

const startLoading = () => {
    const options = {
        lock: true,
        text: "加载中",
        background: 'rgba(0,0,0,0.2)'
    };
    loading = ElLoading.service(options);
}
const endLoading = () => {
    loading.close();
}

const instance = axios.create({
    // timeout: 10000,
    // withCredentials: true
});
instance.interceptors.request.use(
    (config) => {
        if (config.method === "post" && config.Stringify !== false) {
            config.data = qs.stringify(config.data);
        }
        startLoading();
        return config;
    },
    error => {
        endLoading();
        return Promise.reject(error);
    }
)

instance.interceptors.response.use(
    (response) => {
        endLoading();
        return response.status === 200 ? Promise.resolve(response) : Promise.reject(response);
    },
    error => {
        endLoading();
        return Promise.reject(error);
    }
)
export default instance;