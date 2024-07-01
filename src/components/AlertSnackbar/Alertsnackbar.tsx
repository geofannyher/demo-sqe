import { Snackbar, Alert } from "@mui/material";

const AlertSnackbar = ({ open, onClose, message }: any) => {
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
      <Alert onClose={onClose} severity="error">
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AlertSnackbar;
