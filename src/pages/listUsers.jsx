import { useState, useEffect, use } from "react";
// Imports para criação de tabela
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
// TableHead é onde colocamos os titulos
import TableHead from "@mui/material/TableHead";
// TableBody é onde colocamos o conteúdo
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import api from "../axios/axios";
import { Button, IconButton, Alert, Snackbar} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete"
import ConfirmDelete from "../components/ConfirmDelete"

function listUsers() {
  const [users, setUsers] = useState([]);
  const [alert, setAlert] = useState({
    // visibilidade (false = oculto; true= visivel)
    open: false,

    // Nivel do alerta (sucess, error, warning, etc)
    severity: "",

    // Mensagem que sera exibida
    message: ""
  });

  //função para exibir o alerta
  const showAlert = (severity, message) => {
    setAlert({open: true, severity, message})
  }

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false})
  }

  const [userToDelete, setUserToDelete] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();

  const openDeleteModal = (id,name)=>{
    setUserToDelete({id:id, name:name});
    setModalOpen(true);
  }


  async function getUsers() {
    // Chamada da Api
    await api.getUsers().then(
      (response) => {
        console.log(response.data.users);
        setUsers(response.data.users);
      },
      (error) => {
        console.log("Erro ", error);
      }
    );
  }

  async function deleteUser(){
    try{
      await api.deleteUser(userToDelete.id);
      await getUsers();
      // mensagem informativa
      showAlert("success", "Usuário Excluido com Sucesso!")
      setModalOpen(false)
    }
    catch(error){
      console.log("Erro ao deletar usuário...", error)
      showAlert("error", error.response.data.error)
      setModalOpen(false)
    }
  }

  const listUsers = users.map((user) => {
    return (
      <TableRow key={user.id_usuario}>
        <TableCell align="center">{user.name}</TableCell>
        <TableCell align="center">{user.email}</TableCell>
        <TableCell align="center">{user.cpf}</TableCell>

        <TableCell align="center">
          <IconButton onClick={() => openDeleteModal(user.id_usuario, user.name)}>
            <DeleteIcon color="error"/>
          </IconButton>
        </TableCell>
      </TableRow>
    );
  });

  function logout(){
    localStorage.removeItem("authenticated");
    navigate("/")
  }

  function redEvents(){
    navigate("/events")
  }


  useEffect(() => {
    // if (!localStorage.getItem("authenticated")) {
    //   navigate("/");
    // }
    getUsers();
  }, []);

  return (
    <div>
    <Snackbar open={alert.open}
    autoHideDuration={3000}
    onClose={handleCloseAlert}
    anchorOrigin={{vertical:"top", horizontal:"center"}}>
      <Alert onClose={handleCloseAlert} 
      severity={alert.severity}
      sx={{
        width: "100%"
      }}>
        {alert.message}
      </Alert>
    </Snackbar>
    <ConfirmDelete
    open={modalOpen}
    userName={userToDelete.name}
    onConfirm={deleteUser}
    onClose={()=>setModalOpen(false)}
    />
      {users.length === 0 ? (
        <h1>Carregando usuários</h1>
      ) : (
        <div>
          <h5>Lista de usuários</h5>
          <TableContainer component={Paper} style={{ margin: "2px" }}>
            <Table size="small">
              <TableHead
                style={{ backgroundColor: "brown", borderStyle: "solid" }}
              >
                <TableRow>
                  <TableCell align="center">Nome</TableCell>
                  <TableCell align="center">Email</TableCell>
                  <TableCell align="center">CPF</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{listUsers}</TableBody>
            </Table>
          </TableContainer>
          <Button fullWidth variant="contained" 
          to = "/"
          onClick={logout}>
            SAIR
          </Button>
          <div>
            <br />
          </div>
          <Button fullWidth variant="contained" 
          to = "/events"
          onClick={redEvents}>
            EVENTOS
          </Button>
          <div>
            <br />
          </div>
        </div>

      )}
    </div>
  );
}
export default listUsers;
