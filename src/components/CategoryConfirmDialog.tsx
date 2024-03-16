import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"

type PropTypes = {
    openDialog: boolean;
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
    id: string;
    nome: string;
    removeCategoria: (id: string, nome: string) => void;
}

export const CategoryConfirmDialog = ({ openDialog, setOpenDialog, id, nome, removeCategoria }: PropTypes) => {
    const title_style = { width: { xs: 260, md: 500 }, fontSize: 26 };
    const btn_style = { fontWeight: "bold" };

    const handleCancelar = () => {
        setOpenDialog(false);
    };
    const handleFinalizar = () => {
        removeCategoria(id, nome);
        setOpenDialog(false);
    };

    return (
        <div>
            <Dialog open={openDialog} onClose={handleFinalizar}>
                <DialogTitle sx={ title_style }>
                    Apagar categoria
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Remover a categoria "{ nome }" e todos os produtos associados a ela?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelar} size="large" sx={btn_style}>Cancelar</Button>
                    <Button onClick={handleFinalizar} size="large" sx={btn_style}>Confirmar</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}