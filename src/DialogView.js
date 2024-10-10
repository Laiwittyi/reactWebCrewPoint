
import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const DialogView = ({ dialogTitle, dialogBody, isOpen, deleteCallBackfunction, onClose }) => {
  // console.log("isOpenPara",isOpen)
  // const [open, setOpen] = useState(isOpen);
  // console.log('isOPen '+open)
  // //setOpen(isOpen);
  // const handleClose = () => {
  //     setOpen(false);
  //   }; 

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {dialogTitle}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {dialogBody}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>CANCLE</Button>
        <Button onClick={deleteCallBackfunction}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )

};

export default DialogView;