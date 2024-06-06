import axios from "axios";
import FormData from "form-data";
const prevUrl = "http://192.168.1.243:8080/formatter/api/";

function AddData(api, payload) {
  axios.post(prevUrl + api);
}
