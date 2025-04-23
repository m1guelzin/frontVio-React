import { useState, useEffect } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete"

function listEvents() {
  const [events, setEvents] = useState([]);
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

  const navigate = useNavigate();
  async function getEvents() {
    // Chamada da Api
    await api.getEvents().then(
      (response) => {
        console.log(response.data.events);
        setEvents(response.data.events);
      },
      (error) => {
        console.log("Erro ", error);
      }
    );
  }

  async function deleteEvent(id){
    try{
      await api.deleteEvent(id);
      await getEvents();
      // mensagem informativa
      showAlert("success", "Evento Excluido com Sucesso!")
    }
    catch(error){
      console.log("Erro ao deletar usuário...", error)
      showAlert("error", error.response.data.error)
    }
  }

  const listEvents = events.map((event) => {
    return (
      <TableRow key={event.id_evento}>
        <TableCell align="center">{event.nome}</TableCell>
        <TableCell align="center">{event.descricao}</TableCell>
        <TableCell align="center">{event.data_hora}</TableCell>
        <TableCell align="center">{event.local}</TableCell>

        <TableCell align="center">
          <IconButton onClick={() => deleteEvent(event.id_evento)}>
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

  function redUsers(){
    navigate("/users")
  }


  useEffect(() => {
    // if (!localStorage.getItem("authenticated")) {
    //   navigate("/");
    // }
    getEvents();
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

      {events.length === 0 ? (
        <h1>Carregando Eventos</h1>
      ) : (
        <div>
          <h5>Lista de Eventos</h5>
          <TableContainer component={Paper} style={{ margin: "2px" }}>
            <Table size="small">
              <TableHead
                style={{ backgroundColor: "brown", borderStyle: "solid" }}
              >
                <TableRow>
                  <TableCell align="center">Nome Evento</TableCell>
                  <TableCell align="center">Descrição</TableCell>
                  <TableCell align="center">Data e Hora</TableCell>
                  <TableCell align="center">Local</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{listEvents}</TableBody>
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
          onClick={redUsers}>
            USUARIOS
          </Button>
        </div>
      )}
    </div>
  );
}
export default listEvents;
