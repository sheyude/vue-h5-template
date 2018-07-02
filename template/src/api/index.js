
import  http from '../serving/http.serving'

export default {
    logout:params=>http.httpPost(`/logout`),
}
