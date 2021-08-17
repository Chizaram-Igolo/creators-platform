import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import IconButton from "@material-ui/core/IconButton";
import Collapse from "@material-ui/core/Collapse";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function AlertMessage({
  message,
  severity,
  isOpen,
  clearMessages,
}) {
  const classes = useStyles();
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    let timeOut = setTimeout(() => {
      setOpen(false);
      clearMessages();
    }, 5000);

    return () => {
      clearTimeout(timeOut);
    };
  }, []);

  return (
    <div className={classes.root}>
      <Collapse in={open}>
        <Alert
          severity={severity}
          className={`border ${
            severity === "success" ? "border-success" : ""
          } ${severity === "error" ? "border-danger" : ""} mb-4`}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {message}
        </Alert>
      </Collapse>
    </div>
  );
}
