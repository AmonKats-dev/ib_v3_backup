import { API_URL } from "../../constants/config";
import { TOKEN } from "../../constants/auth";

const token = localStorage.getItem(TOKEN);
export async function postData(props) {
  const response = await fetch(`${API_URL}/${props.endpoint}`, {
    method: "POST",
    body: JSON.stringify(props.data),
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}

export async function getdata(props) {
  const response = await fetch(`${API_URL}${props.endpoint}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}
