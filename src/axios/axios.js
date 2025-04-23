import axios from "axios";

const api = axios.create({
    baseURL:"http://localhost:5000/api/v1/",
    headers:{
        'accept':'application/json'
    }
});

const sheets = {
    getUsers:()=>api.get("user"),
    postCadastro:(user)=>api.post("user", user),
    postLogin:(user) => api.post("login/", user),
    deleteUser:(id_usuario) => api.delete("user/" + id_usuario),
    getEvents:()=>api.get("evento"),
    deleteEvent:(id_usuario) => api.delete("evento/" + id_usuario),
}

export default sheets;