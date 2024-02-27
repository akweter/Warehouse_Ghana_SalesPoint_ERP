// import React, { useState, useEffect } from 'react';
// import Button from '@mui/material/Button';
// import Dialog from '@mui/material/Dialog';
// import DialogTitle from '@mui/material/DialogTitle';
// import DialogActions from '@mui/material/DialogActions';

// const AutoSignout = ({ onLogout }) => {
//   const [openDialog, setOpenDialog] = useState(false);
//   const [countdown, setCountdown] = useState(15);
//   let countdownInterval;

//   const startCountdown = () => {
//     countdownInterval = setInterval(() => {
//       setCountdown((prevCountdown) => prevCountdown - 1);
//     }, 1000);
//   };

//   const stopCountdown = () => {
//     clearInterval(countdownInterval);
//   };

//   const handleDialogOpen = () => {
//     setOpenDialog(true);
//     startCountdown();
//   };

//   const handleDialogClose = () => {
//     setOpenDialog(false);
//     stopCountdown();
//   };

//   const handleLogout = () => {
//     stopCountdown();
//     onLogout();
//     handleDialogClose();
//   };

//   useEffect(() => {
//     handleDialogOpen(); // Open the dialog when the component mounts

//     // Attach the event listeners to the document body
//     document.body.addEventListener('mousedown', handleLogout);
//     document.body.addEventListener('mousemove', handleLogout);

//     return () => {
//       stopCountdown();
//       // Remove the event listeners when the component unmounts
//       document.body.removeEventListener('mousedown', handleLogout);
//       document.body.removeEventListener('mousemove', handleLogout);
//     };
//   }, [onLogout]);

//   useEffect(() => {
//     if (countdown === 0) {
//       handleLogout();
//     }
//     return () => {
//       stopCountdown();
//     };
//   }, [countdown, onLogout]);

//   return (
//     <>
//       <Dialog open={openDialog} onClose={handleDialogClose}>
//         <DialogTitle>{`Logging out in ${countdown} seconds...`}</DialogTitle>
//         <DialogActions>
//           <Button variant="contained" color="primary" onClick={handleLogout}>
//             Cancel Logout
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

// export default AutoSignout;
