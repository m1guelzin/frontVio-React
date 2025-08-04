import axios from "axios";

const api = axios.create({
    baseURL:"http://localhost:5000/api/v1/",
    headers:{
        'accept':'application/json'
    }
});

api.interceptors.request.use(
    (config) =>{
        const token = localStorage.getItem("token");
        console.log(token);
        if(token){
            config.headers.Authorization = `${token}`
        }
        return config;
    },
    (error) => Promise.reject(error)
);

const sheets = {
    getUsers:()=>api.get("user"),
    postCadastro:(user)=>api.post("user", user),
    postLogin:(user) => api.post("login/", user),
    deleteUser:(id_usuario) => api.delete("user/" + id_usuario),
    getEvents:()=>api.get("evento"),
    deleteEvent:(id_usuario) => api.delete("evento/" + id_usuario),
    createIngresso: (dados) => api.post("/ingresso", dados),

    createEvento: (form, imagem) => {
        const data = new FormData();
        for (let key in form) data.append(key, form[key]);
        if(imagem) data.append("imagem", imagem);

        return api.post("/evento", data, {
            headers:{
                "Content-Type":"multpart/form-data",
                Accept:"application/json",
            }
        })
    }
}

export default sheets;