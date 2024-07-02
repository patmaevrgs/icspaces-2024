import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid, Paper, Divider,
  IconButton, Box,
  Input
} from "@mui/material";
import { Reservation, ReservationDataForModal } from "./types";
import React, { useState, useEffect, useRef } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import Circle from './Circle';
import './ReservationDialogConfig.css';
import axios from "axios";

// Constant values for theme
const SCHEME_FONT_DEFAULT_COLOR = '#204365';
const SCHEME_FONT_GRAY_COLOR = '#acb4bc';
const SCHEME_FONT_DARKER_GRAY_COLOR = '#748391';
const SCHEME_FONT_DARK_BLUE_COLOR = '#183048';
const BUTTON_COLOR_GRAY = '#eceef0';
const SCHEME_FONT_ONLINE_FONT = '#6995ad';
const CANCELLED_BG_COLOR = '#eceef0';
const CANCELLED_FONT_COLOR = '#828282';
const CIRCLE_COLOR = '#f67361';


interface ReservationDialogProps {
  open: boolean;
  onClose: () => void;
  reservation: ReservationDataForModal | null;
}

const ReservationDialogCancelled: React.FC<ReservationDialogProps> = ({
  open,
  onClose,
  reservation,
}) => {
  const [isStudent, setIsStudent] = useState<boolean>(false);
  const [hasPermit, setHasPermit] = useState<boolean>(false);
  const [hasLetter, setHasLetter] = useState<boolean>(false);
  const [documentUploadStatus,setDocumentUploadStatus]=useState<boolean | null>(null)
//************************************* ATTENTION *************************************//
 
const zero=0;


function OnInputClick(event:any){
    event.target.value = ''
    console.log("Event1 "+event)
};


const handleLetterUploadButton = async (event:any) => {

      if (event.target.value===''){
        return
      }
      console.log("Name "+event.target.files[0].name)
      const letter=event.target.files[0]
      console.log("Files "+letter)

      if(letter){
        console.log("Letter Uploading")

        const FormLetter=new FormData()
        if(letter && reservation){
            FormLetter.append('document',letter)
            FormLetter.append('reservation_id',reservation?.reservation_id)
            FormLetter.append('type','letter')
        }

        fetch('http://localhost:3001/upload-reservation-document', {
            method: 'POST', // or 'PUT'
            body: FormLetter// Uncomment this line if you need to send data in the request body
        })
        .then(response => response.json())
        .then(data => {
          if(data.success){
            setDocumentUploadStatus(true)
          }
        
        })
        .catch(error => console.error('Error:', error)
        )
      }


  }

  const handlePermitUploadButton = (event:any) => {
      
      if (event.target.value===''){
        return
      }
      console.log("Name "+event.target.files[0].name)
      const payment=event.target.files[0]
      console.log("Files "+payment)


      if(payment){
        console.log("Proof of Payment Uploading")

        const FormPay=new FormData()
        if(payment&& reservation){
            console.log('Append')
            FormPay.append('document',payment)
            FormPay.append('reservation_id',reservation?.reservation_id)
            FormPay.append('type','payment')
        }

        fetch('http://localhost:3001/upload-reservation-document', {
            method: 'POST', // or 'PUT'
            body: FormPay// Uncomment this line if you need to send data in the request body
        })
        .then(response => response.json())
        .then(data => {
          if(data.success){
            setDocumentUploadStatus(true)
          }
        })
        .catch(error => console.error('Error:', error)
        )
      }

  }
//*************************** THANK YOU FOR YOUR ATTENTION **************************//
  useEffect(() => {

    const checkIfStudent = async () => {
      try {
        const response = await axios.get("http://localhost:3001/get-profile", {
          withCredentials: true,
        });

        if (response.data.success) {
          setIsStudent(`${response.data.data.usertype}` == `0`);
          console.log(`Becomes ${isStudent}`)
        } else {
          setIsStudent(false);
        }
      } catch (error) {
      }
    };
    checkIfStudent();
   
    fetch("http://localhost:3001/get-reservation-document", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reservation_id: reservation?.reservation_id }), // Uncomment this line if you need to send data in the request body
    })
      .then((response) => response.json())
      .then((data1) => {
        console.log('TESTING 1')
        console.log("payment ",data1.payment)
        console.log("letter ",data1.letter)
        // for permit
        if (data1.payment === "" || data1.payment == null) {
          setHasPermit(false);
        } else {
          console.log('meow1')
          setHasPermit(true);
        }

        // for letter
        if (data1.letter === "" || data1.letter == null) {
          setHasLetter(false);
        } else {
          console.log('meow2')
          setHasLetter(true);
        }
        setDocumentUploadStatus(false)
      }
    )
  },[documentUploadStatus])
//*************************** THANK YOU FOR YOUR ATTENTION **************************//

  // Handler for the "Approve" button click
  const handleCalendarButton = () => {
    window.location.href = "http://localhost:3000/schedulepage";
  };

  // Handler for the "Approve" button click
  const handlePermitButton = () => {

    // Fetch value from database
    fetch("http://localhost:3001/get-reservation-document", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reservation_id: reservation?.reservation_id }), // Uncomment this line if you need to send data in the request body
    })
      .then((response) => response.json())
      .then((data1) => {
        if (data1.payment == "" || data1.payment == null) {
          alert("There is no permit uploaded at this time!");
        } else {
          window.location.href = data1.payment.url;
        }
      }
    )
  };

  // Handler for the "Approve" button click
  const handleLetterButton = () => {

    // Fetch value from database
    fetch("http://localhost:3001/get-reservation-document", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reservation_id: reservation?.reservation_id }), // Uncomment this line if you need to send data in the request body
    })
      .then((response) => response.json())
      .then((data1) => {
        if (data1.letter == "" || data1.letter == null) {
          alert("There is no letter uploaded at this time!");
        } else {
          window.location.href = data1.letter.url;
        }
      }
    )
  };

  return (
    <Dialog open={open} onClose={onClose} classes={{ paper: 'dialog-paper' }} sx={{'& .dialog-paper': {borderRadius: '25px', padding: '20px', overflow: 'auto', transform: 'scale(1)'}}}>
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      <DialogContent sx={{ overflow: 'hidden'}}>
        {reservation && (

          // for parent cotainer
          <>

            {/* <Typography className="unselectable" variant="body1">
              Transaction ID: {reservation.transactionDetails.transactionId}
            </Typography>

            <Typography className="unselectable" variant="body1">
              Date: {reservation.transactionDetails.date}
            </Typography>
            <Typography className="unselectable" variant="body1">
              Status: {reservation.transactionDetails.status}
            </Typography>
            <Typography className="unselectable" variant="body1">
              Comment: {reservation.transactionDetails.comment}
            </Typography> */}

            <Grid container spacing={0}  columns={40} padding={2}>      

              {/* Events details */}
              <Grid item xs= {30} sx={{ paddingBottom: '0px' }}>
                <Paper elevation={0} sx={{ p: 2, borderRadius: 0 , padding: 0}}>

                  {/* This is for the reservation details */}
                  <Typography className="unselectable" sx={{padding:'0px', display: 'block', fontSize: '0.65vw', color:SCHEME_FONT_GRAY_COLOR}}>
                  Reservation created on {reservation.reservation_date}</Typography>

                  {/* This is for the location title*/}
                  <Typography className="unselectable" sx={{fontWeight: 'bold', fontSize: '2.3vw', padding:'0px', paddingTop:'8px', lineHeight: '1.0', display: 'block', color:SCHEME_FONT_DARK_BLUE_COLOR}}>
                  {reservation.room_name}</Typography>

                  {/* This is for the event title */}
                  <Typography className="unselectable" sx={{fontSize: '1vw', padding:'0px', lineHeight: '2', display: 'block', color:SCHEME_FONT_DARKER_GRAY_COLOR}}>
                  {reservation.event_name}</Typography>
                  
                  {/* Restrict area for where event description text is displayed */}
                  <Box border={1} padding={0} style={{ width: '80%', border:'none'}}>
                    <Typography className="unselectable" sx={{fontSize: '0.8vw', padding:'0px', lineHeight: '1.3', display: 'block', color:SCHEME_FONT_DARKER_GRAY_COLOR}}>
                    {reservation.event_description}</Typography>
                  </Box>
                </Paper>
              </Grid>

              {/* Modular space for the date and time */}
              <Grid item xs= {10} sx={{ height: '100%', paddingBottom:'0px'}}>
                <Paper elevation={4} sx={{ height: '100%', borderRadius: 4, padding: 1.5,
                    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.6)',
                    backgroundColor: '#d3dfe5',
                  }}>

                      {/* This is for the day of the week */}
                      <Typography className="unselectable" sx={{fontSize: '0.7vw', textAlign: 'center', padding:'0px', color: SCHEME_FONT_DEFAULT_COLOR, lineHeight: '1.8', display: 'block'}}>
                        {reservation.reserve_day_day_string}</Typography>
                      
                      {/* This is for the day number */}
                      <Typography className="unselectable" sx={{fontWeight: 'bold', fontSize: '3.5vw', justifyContent: 'center', textAlign: 'center', padding:'0px', lineHeight: '1.06', display: 'block', color: SCHEME_FONT_DEFAULT_COLOR}}>
                      {reservation.reserve_day_number}</Typography>

                      {/* This is for the month*/}
                      <Typography className="unselectable" sx={{fontWeight: 'bold', fontSize: '1vw',  justifyContent: 'center', textAlign: 'center', padding:'0px', paddingBottom:'20px', color: SCHEME_FONT_DEFAULT_COLOR, display: 'block', lineHeight: '0.4'}}>
                      {reservation.reserve_month} </Typography>
                      
                      {/* This is for the line*/}
                      <Divider  sx={{borderTopWidth: '2px', borderTopColor: SCHEME_FONT_DARK_BLUE_COLOR}}/> 

                      <Typography className="unselectable" sx={{fontWeight: 'bold', fontSize: '70%', textAlign: 'center', padding: '0px', paddingTop: '10px', 
                          paddingBottom: '0px', color: SCHEME_FONT_DEFAULT_COLOR, lineHeight: '1.2', display: 'block', width: 'fit-content', margin: '0 auto', whiteSpace: 'nowrap'}}
                      >
                        {reservation.reserve_timeslot}
                      </Typography>
                </Paper>
              </Grid>
              
              {/* Row for username, email, and view calendar */}
              <Grid item xs={40} sx={{ padding: '0px' }}>
                <Grid container spacing={0} columns={80} padding={0} sx={{ paddingTop: '15px !important' }}>

                  {/* Circle */}
                  <Grid item xs={5} sx={{ paddingTop: '10px !important' }}>
                    <Circle color={CIRCLE_COLOR} size={21} />
                  </Grid>

                  {/* Username and Email */}
                  <Grid item xs={55}>
                    <Typography className="unselectable" sx={{color: SCHEME_FONT_ONLINE_FONT, fontSize:'0.8vw'}}>
                      {reservation.user_name}
                    </Typography>
                    <Typography className="unselectable" sx={{color: SCHEME_FONT_ONLINE_FONT, fontSize:'0.65vw'}}>
                      {reservation.user_id}
                    </Typography>
                  </Grid>

                  {!isStudent && (
                    <Button variant="contained" style={{ backgroundColor: BUTTON_COLOR_GRAY, color: SCHEME_FONT_DARKER_GRAY_COLOR, borderRadius: '7px', width: '25%', 
                      fontSize:'0.65vw', textTransform: 'none', height:'36px', boxShadow: 'none', paddingTop: '5px'}}
                      onClick={handleCalendarButton}>
                        View Calendar
                    </Button>
                  )}
                </Grid>
              </Grid>

              
              {/* Spacer line */}
              <Grid item xs={40} sx={{paddingTop:'0px'}}>
                <Divider  sx={{ py: '10px' }}/>    
              </Grid>


              {/* Payment Details Label*/} 
              <Grid item xs= {10} sx={{ paddingTop: '25px' }}>
                <Paper elevation={0} sx={{ p: 3, height: '100%', borderRadius: 0 , padding: 0, width:'100%'}}>
                  <Typography className="unselectable" sx={{fontSize: '0.9vw', padding:'1px', lineHeight: '1.3', display: 'block', color:SCHEME_FONT_DARKER_GRAY_COLOR}}>
                    Duration:
                  </Typography>
                  <Typography className="unselectable" sx={{fontSize: '0.9vw', padding:'1px', lineHeight: '1.3', display: 'block', color:SCHEME_FONT_DARKER_GRAY_COLOR, whiteSpace: 'nowrap'}}>
                    Hourly Fee:
                  </Typography>
                  <Typography className="unselectable" sx={{fontSize: '0.9vw', padding:'1px', lineHeight: '1.3', display: 'block', color:SCHEME_FONT_DARKER_GRAY_COLOR, whiteSpace: 'nowrap'}}>
                    Overall Fee:
                  </Typography>
                </Paper>
              </Grid>


              {/* Payment Details*/}
              <Grid item xs= {20} sx={{ paddingTop: '25px' }}>
                <Paper elevation={0} sx={{ p: 2, height: '100%', borderRadius: 0 , padding: 0}}>
                  <Typography className="unselectable" sx={{fontSize: '0.9vw', padding:'1px', lineHeight: '1.3', display: 'block', color:SCHEME_FONT_DEFAULT_COLOR}}>
                    {reservation.duration} {reservation.duration == "1" ? "hour" : "hours"}
                  </Typography>
                    <Typography className="unselectable" sx={{fontSize: '0.9vw', padding:'1px', lineHeight: '1.3', display: 'block', color:SCHEME_FONT_DEFAULT_COLOR}}>
                    ₱ {reservation.hourly_fee}
                  </Typography>
                  <Typography className="unselectable" sx={{fontSize: '0.9vw', padding:'1px', lineHeight: '1.3', display: 'block', color:SCHEME_FONT_DEFAULT_COLOR}}>
                    ₱ {reservation.overall_fee}
                  </Typography>
                </Paper>
              </Grid>



              {/* View Letter and View Permit area */}
              <Grid item xs= {10} sx={{ paddingTop:'25px'}}>

              {/* Letter Button Handler*/}
              {hasLetter ?                           
                <Button variant="contained" style={{ backgroundColor: "#183048", color: "#ffffff", borderRadius: '7px', width: '100%', 
                  fontSize:'0.65vw', textTransform: 'none', height:'32px', boxShadow: 'none', paddingTop: '5px'}}
                  onClick={handleLetterButton}>
                    View Letter
                </Button> :              
                //************************************* ATTENTION *************************************//
                <Button component="label" style={{ backgroundColor: BUTTON_COLOR_GRAY, color: SCHEME_FONT_DARKER_GRAY_COLOR, borderRadius: '7px', width: '100%', 
                fontSize:'0.65vw', textTransform: 'none', height:'32px', boxShadow: 'none', paddingTop: '5px'}}
                 >
                    Upload Letter

                    <Input type="file" inputProps={{accept:"application/pdf"}} sx={{border:0,clip: 'rect(0 0 0 0)',
                        clipPath: 'inset(50%)',height: 1, overflow: 'hidden', position: 'absolute',
                        bottom: 0,left: 0, whiteSpace: 'nowrap',width: 1,
                        }} disableUnderline
                        onChange={handleLetterUploadButton}
                        onClick={OnInputClick}
             
                    />
                </Button>
                 //*************************** THANK YOU FOR YOUR ATTENTION **************************//
              }

              {/* A simple spacer */}
              <Typography className="unselectable" sx={{lineHeight:'10px'}}>{'\u00A0'}</Typography>

              {/* Permit Button Handler */}
              {hasPermit ?                           
              <Button variant="contained" style={{ backgroundColor: "#183048", color: "#ffffff", borderRadius: '7px', width: '100%', 
              fontSize:'0.65vw', textTransform: 'none', height:'32px', boxShadow: 'none', paddingTop: '5px'}}
                  onClick={handlePermitButton}>
                    View Permit
                </Button> :              
                //************************************* ATTENTION *************************************//
                <Button component="label" style={{ backgroundColor: BUTTON_COLOR_GRAY, color: SCHEME_FONT_DARKER_GRAY_COLOR, borderRadius: '7px', width: '100%', 
                fontSize:'0.65vw', textTransform: 'none', height:'32px', boxShadow: 'none', paddingTop: '5px'}}
                 >
                    Upload Payment

                    <Input type="file" inputProps={{accept:"application/pdf"}} sx={{border:0,clip: 'rect(0 0 0 0)',
                        clipPath: 'inset(50%)',height: 1, overflow: 'hidden', position: 'absolute',
                        bottom: 0,left: 0, whiteSpace: 'nowrap',width: 1,
                        }} disableUnderline
                        onChange={handlePermitUploadButton}
                        onClick={OnInputClick}
                    />
                </Button>
                 //*************************** THANK YOU FOR YOUR ATTENTION **************************//
              }
              
              </Grid>   

              
              {/* notification */}
              {/* <Box border={1} paddingTop={3} style={{ width: '100%', border:'none'}}>
                <Typography className="unselectable" sx={{textAlign: 'center', fontSize: '0.8vw', padding:'0px', lineHeight: '1.3', display: 'block', color:SCHEME_FONT_DARKER_GRAY_COLOR}}>
                "Make sure that everyone can hear your screaming. Sound values must always be greater than 75 decibels."</Typography>
              </Box> */}

              {/* Spacer line */}
              <Grid item xs={40} sx={{paddingBottom:'12px'}}>
                <Divider  sx={{ py: '10px' }}/>
              </Grid>     

              {/* Modular space for the date and time */}
              <Grid item xs= {20} sx={{ height: '100%', paddingBottom:'0px', paddingTop:'9px'}}>
                <Paper elevation={0} sx={{ height: '100%', borderRadius: 2, padding: 1, backgroundColor: CANCELLED_BG_COLOR, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography className="unselectable" sx={{fontWeight: 'bold', fontSize: '1.3vw', color: CANCELLED_FONT_COLOR}}>
                    Cancelled
                  </Typography>
                </Paper>
                <Typography className="unselectable" sx={{textAlign: 'center', fontSize: '0.6vw', padding:'0px', paddingTop:'2px', lineHeight: '1.3', display: 'block', color:SCHEME_FONT_DARKER_GRAY_COLOR}}>
                  Requested on {reservation.reservation_date}
                </Typography>
                
                {reservation.approved_date != "" ? 
                  <Typography className="unselectable" sx={{textAlign: 'center', fontSize: '0.6vw', padding:'0px', paddingTop:'2px', lineHeight: '1.3', display: 'block', color:SCHEME_FONT_DARKER_GRAY_COLOR}}>
                    Approved on {reservation.approved_date}
                  </Typography> : <Typography/>
                }
                
                {reservation.payment_date != "" ? 
                <Typography className="unselectable" sx={{textAlign: 'center', fontSize: '0.6vw', padding:'0px', paddingTop:'2px', lineHeight: '1.3', display: 'block', color:SCHEME_FONT_DARKER_GRAY_COLOR}}>
                  Paid on {reservation.payment_date}
                </Typography> : <Typography/>
                }

                <Typography className="unselectable" sx={{textAlign: 'center', fontSize: '0.6vw', padding:'0px', paddingTop:'2px', lineHeight: '1.3', display: 'block', color:SCHEME_FONT_DARKER_GRAY_COLOR}}>
                  Cancelled on {reservation.cancellation_date}
                </Typography>
              </Grid>

              {/* Utilities section */}
              <Grid item xs= {20} sx={{ height: '100%', paddingBottom:'2px', paddingTop:'9px'}}>
              <Typography className="unselectable" sx={{textAlign: 'left', fontSize: '0.9vw', padding:'10px', lineHeight: '1.3', display: 'block', color:SCHEME_FONT_DEFAULT_COLOR, paddingTop:'0px'}}>
                  {reservation.utilities == "" ? "No additional utilities were included.": `${reservation.utilities.includes(',') ? `Utilities include the following: ${reservation.utilities}`: `${"aeiou".includes(reservation.utilities[0].toLowerCase()) ? "An":"A"} ${reservation.utilities} was included in the utilities.`}`}
                </Typography>
              </Grid>

              {/* Restrict area for where event description text is displayed */}
              <Box border={1} paddingTop={3} style={{ width: '100%', border:'none'}}>
                <Typography className="unselectable" sx={{textAlign: 'left', fontSize: '0.8vw', padding:'0px', lineHeight: '1.3', display: 'block', color:SCHEME_FONT_DEFAULT_COLOR}}>
                  {reservation.note_from_admin == '(no note provided by staff)' ? 'The reservation holder has cancelled their reservation with no given note.' : `Reason from reservation holder: ${reservation.note_from_admin}`}
                </Typography>
              </Box>
            </Grid>

          </>
        )}
      </DialogContent>
    </Dialog>
  );
};




export default ReservationDialogCancelled;
