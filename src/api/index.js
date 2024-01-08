import axios from "../utils/http"
import path from "./path"

const api = {
    getScoreDebug(data) {
        return axios.post(
            path.getScoreDebug,
            data
        )
    },
    loginMFA(data) {
        return axios.post(
            path.loginMFA,
            data
        )
    },
    verify(data) {
        return axios.post(
            path.verify,
            data
        )
    },
    getUserScore(data) {
        return axios.post(
            path.getUserScore,
            data
        )
    },
    feedback(data) {
        return axios.post(
            path.feedback,
            data
        )
    },
}
export default api;