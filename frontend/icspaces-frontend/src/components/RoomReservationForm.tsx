import { Box, Stack, Grid,Typography,Button,TextField, Card, FormControlLabel, Checkbox, FormGroup,  Dialog, Input, DialogTitle, DialogContent, DialogActions} from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import HomeBG from "../assets/room_images/HomeBG.png";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useState,useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Axios } from 'axios';
import BackButton from "./BackButton";
import { WindowSharp } from '@mui/icons-material';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Singapore")


const RoomReservationForm = () => {

    const [room_id,setroom_id]=useState(1);
    const location=useLocation();
    const [roomImages, setRoomImages] = useState<{ [key: string]: string }>({});
    useEffect(() => {
        const getPhotos = async () => {
          try {
            const photos = await fetch(
              "http://localhost:3001/get-room-image",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ room_id }),
              }
            );
            if (!photos.ok) {
              throw new Error("Failed to fetch room images");
            }
    
            const imagesData = await photos.json();
    
            if (imagesData && imagesData.images && imagesData.images.length > 0) {
              const latestImage = imagesData.images[0].url;
              setRoomImages((prevImages) => ({
                ...prevImages,
                [room_id.toString()]: latestImage,
              }));
              console.log("Setting images successful");
            } 
          } catch (error) {
            console.error("Failed to fetch rooms and utilities:", error);
          }
        };
        getPhotos();
      }, [room_id]);

    useEffect(() => {// SET START TIME AND END TIME OF RESERVATION
        const costCalculator = async () => {
            let start=startTime.slice(0,2);
            let end=endTime.slice(0,2);
            // console.log("Cost")
            // console.log(start)
            // console.log(end)
            let cost1 =  (Number(end)-Number(start)) * Number( hourlyFee);
            // console.log(cost1);
            setsumCost(cost1);
        }
        const fetchRoomInfo = async () => {
            fetch('http://localhost:3001/get-room-info', {// ROOM INFO
        method: 'POST', // or 'PUT'
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({room_id}), // Uncomment this line if you need to send data in the request body
    })
    .then(response => response.json())
    .then(data => {
        setRoomName(data.room.room_name);
        sethourlyFee(data.room.fee);

    });    
        };

    fetchRoomInfo();
    costCalculator()
    },);

    const handleOSA = (event:any) => {

    };

    const handleLetter = (event:any) => {
       
    }; 
    useEffect(() => {

        const receivedValues=location.state; //RECEIVE VALUES FROM THE ROOM PAGE ABOUT RESERVATION DETAILS
        console.log("Received this")
        console.log(receivedValues);
        setroom_id(Number(receivedValues.room_id));
        console.log(receivedValues.date)
        setstartTime(receivedValues.start_dateTime)
        setendTime(receivedValues.end_dateTime)

        console.log(receivedValues.date.substr(receivedValues.date.indexOf(" ") + 1))
        let tempDate= dayjs(receivedValues.date).format('YYYY-MM-DD HH:mm:ss').toString().slice(0,10)
        console.log("tempdate ",tempDate)
        setDate(tempDate);
        let newDate = dayjs.tz().format("YYYY-MM-DD HH:mm:ss")
        console.log("newDate " +newDate)
        setcreationDate(newDate);

        const fetchUser = async () => {
            try {
                const response = await axios.get("http://localhost:3001/get-profile", {
                    withCredentials: true,
                });

                if (response.data.success) {
                    const user = response.data.data;
                    console.log(user)
                    setEmail(user.email);
               
                    setName(user.displayname)
                    setloggedIn(true);
                    console.log("User type[",user.usertype,"]")
                    if(user.usertype==2){
                        setisAdmin(true)
                    }
                    else if(user.usertype==0){
                        setIsStudent(true)
                        setisAdmin(false)
                    }else{
                        setisAdmin(false)
                    }
                    return(user.email)
                } else {
                    throw new Error(response.data.errmsg);
                    setloggedIn(false);
                }
            } catch (error) {
                console.error("Failed to fetch user:", error);
                setloggedIn(false);
            }
        };
        fetchUser().then( (val) =>
            {
               console.log("Email1 "+typeof(val))
               fetch('http://localhost:3001/get-student-details', {//GET STUDENT DETAILS BUT IT DOESNT WORK WTF
                   method: 'POST', // or 'PUT'
                   headers: {
                   'Content-Type': 'application/json',
                   },
                   body: JSON.stringify({val}), // Uncomment this line if you need to send data in the request body
               })
               .then(response => response.json())
               .then(data => {
                   console.log("Fetch student details", JSON.stringify({data}.data))
                   const org1 = JSON.stringify({data}.data.org);
                   // if (org1==null && !isAdmin){
                   //     window.alert("You need an organization to book as a student")
                   //     window.location.href = "http://localhost:3000/accountpage"
                   // }
               });
            }
        );  


        if(receivedValues.start_dateTime===undefined ||receivedValues.start_dateTime===""  ){
            alert("Select Time First");
            window.location.href = "http://localhost:3000/roompage/"+room_id
        }


    }, []);



    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
      });
    
    function OSASubmit(){
        var name = document.getElementById('osafile'); 
        console.log("name: "+name);
        
    };
    function OnInputClick(event:any){
        event.target.value = ''
        console.log("Event1 "+event)
    };
    function LetterSubmit(event:any){
            if (event.target.value===''){
                return
            }
            console.log("Event "+event.target.value)
            setletterDean(event.target.files[0])
            console.log("Files "+event.target.files[0])
            setLetterName(event.target.files[0].name)
    };       

    function PermitSubmit(event:any){
        if (event.target.value===''){
            return
        }
        console.log("Event "+event.target.value)
        setProofofPayment(event.target.files[0])
        console.log("Files "+event.target.files[0])
        setPermitName(event.target.files[0].name)
    };        

    const isEmail = (email:string) =>
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

   const handleBlurContactFormat = () => {

    const value = contact || '';
    if(value === ''){
        setcontactFormat(value === '');
    }else{
        if(Number(value)<0){
            setcontactFormat(true);
        }else{
            setcontactFormat(false);
        }
    }
   }    

   const handleBlurEmailError = (email1:string) => {

    if (!isEmail(email1)) {
        setemailError(true);
    }else{
        setemailError(false);
    }


   }          
    const [isStudent,setIsStudent]=useState(false);
    const [name,setName]=useState('');
    const [email,setEmail]=useState('');
    const [otherEmail,setOtherEmail]=useState('')
    const [contact,setContact]=useState('');
    const [roomName,setRoomName]=useState('');
    const [eventName,seteventName]=useState('');
    const [date,setDate]=useState('');
    const [startTime,setstartTime]=useState('');
    const [org,setOrg]=useState('');
    const [endTime,setendTime]=useState('');
    const [hourlyFee,sethourlyFee]=useState('');
    const [sumCost,setsumCost]=useState(0);
    const [creationDate,setcreationDate]=useState('');
    const [eventDetails,seteventDetails]=useState('');
    const [submitFail,setsubmitFail]=useState<boolean | null>(null)
    const zero=0;
    const [letterDean,setletterDean]= useState<File | null>(null);
    const [permitName,setPermitName]=useState('No file chosen');
    const [letterName,setLetterName]=useState('No file chosen');
    const [proofofPayment,setProofofPayment]= useState<File | null>(null);
    
    const [loggedIn,setloggedIn]=useState(false);
    const [open, setOpen] = useState(false);
    const [timeError,setTimeError]=useState(false);
    const [contactFormat,setcontactFormat]=useState(false);
    const [emailError,setemailError]=useState(false);
    const [isAdmin,setisAdmin]=useState(false);
    const [guestBooking,setGuestBooking]=useState(false);
    const [reservationID,setReservationID]=useState<string | null>(null);
    const [fname,setFname]=useState('');
    const [lname,setLname]=useState('');

    const [utilities1,setUtilities]=useState([]);
    

    const handleContactChange = (event: { target: { value: string; }; }) => {
        setContact(event.target.value);
      };

    const preventMinus = (e:any) => {
        if (e.code === 'Minus') {
            e.preventDefault();
        }
    };
    const handleOpen = (e:any) => {
        e.preventDefault();
        setOpen(true);
        console.log("Booking Confirm")
    }

    const handleGuestReservation = (event:any) => {
       setGuestBooking(event.target.checked)
       console.log("User Type ",guestBooking)
    }

    const HandleSubmit = (e:any) => {
        e.preventDefault();
        const startDateTime= date+" "+startTime
        const endDateTime= date+" "+endTime
        const startDateTime1 = dayjs.tz(startDateTime).format("YYYY-MM-DD HH:mm:ss")
        const endDateTime1 = dayjs.tz(endDateTime).format("YYYY-MM-DD HH:mm:ss")
        console.log("start ",startDateTime1)
        console.log("end ", endDateTime1)
        console.log({startDateTime,endDateTime, date, creationDate})
        console.log({room_id,eventName,eventDetails,email,sumCost})

        const result = fetch('http://localhost:3001/get-available-room-time', { //CHECK FOR TIME CONFLICT, SIMPLE IF CHECKING
            method: 'POST', // or 'PUT'
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                room_id: room_id,
                date:date,

            }), // Uncomment this line if you need to send data in the request body
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            //Check if timeslot is taken and redirect to roompage 
            if(data.availableTimes.indexOf(startTime) > -1 && data.availableTimes.indexOf(endTime) > -1 ){
                console.log('time is available')
                return false
            }else{
                setTimeError(true);
                
                console.log("Time error is "+ timeError)
                console.log('time is not available')
                window.alert("Time is not available, please choose another timeslot")
                window.location.href = "http://localhost:3000/roompage/"+room_id
                return true
            }

        })
        .catch(err => {
            console.log(err)
        }
        )

       
        const reservationSuccess = result.then(r=>{//ADD RESERVATION
    
            if(r==false){
                if(guestBooking){//GUEST BOOKING DONE BY ADMIN
                    console.log('Guest Booking is Added')
                    //  const { fname, lname, email, admin_id, activity_name, activity_desc, room_id, start_datetime, end_datetime, discount, additional_fee, total_amount_due, status_code, utilities } = req.body
                    fetch('http://localhost:3001/add-guest-reservation', {
                        method: 'POST', // or 'PUT'
                        headers: {
                        'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            fname:fname,  lname:lname,
                            email:otherEmail,admin_id:email,
                            activity_name:eventName,  activity_desc:eventDetails,
                            room_id: room_id, date_created:creationDate,
                            start_datetime: startDateTime,
                            end_datetime: endDateTime,
                            discount:zero,
                            additional_fee:zero,
                            total_amount_due:sumCost,
                            status_code:zero,
                            utilities:utilities1,
                        }), // Uncomment this line if you need to send data in the request body
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data)
                        console.log(data.reservation_id)
                        setReservationID(data.reservation_id)
                        // window.alert("You've booked for Guest successfully")
                        setsubmitFail(false)
          
                    })
                    .catch(err => {
                        console.log(err)
                        setsubmitFail(true);
      
                    }
                    )
                   return submitFail
                } 
                else{//REGULAR BOOKING

                    fetch('http://localhost:3001/add-reservation', {
                        method: 'POST', // or 'PUT'
                        headers: {
                        'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            activity_name:eventName, 
                            activity_desc:eventDetails,
                            room_id: room_id,
                            user_id:email,
                            date_created:creationDate,
                            start_datetime: startDateTime1,
                            end_datetime: endDateTime1,
                            discount:zero,
                            additional_fee:zero,
                            total_amount_due:sumCost,
                            status_code:zero,
                            utilities:utilities1,
                        }), // Uncomment this line if you need to send data in the request body
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data)
                        console.log(data.reservation_id)
                        setReservationID(data.reservation_id)
                        // window.alert("You've booked successfully")
                        // window.location.href = "http://localhost:3000/homepage"
                        setsubmitFail(false)
                    })
                    .catch(err => {
                        console.log("Failed to add")
                        console.log(err)
                        setsubmitFail(true);
                    }
                    )
                }
                return submitFail
            }else{
                console.log("Do Nothing")
                setsubmitFail(true)
                window.location.href = "http://localhost:3000/roompage/"+room_id
                return submitFail
            }

        })
   
        

        

    }

    useEffect(() => {
        console.log("Submit Fail ", submitFail)
            if(submitFail==false){
               
                console.log("File Uploading")
                
                if(proofofPayment){
                    console.log("Proof of Payment Uploading")

                    const FormPay=new FormData()
                    if(proofofPayment&& reservationID){
                        console.log('Append')
                        FormPay.append('document',proofofPayment)
                        FormPay.append('reservation_id',reservationID)
                        FormPay.append('type','payment')
                    }

                    fetch('http://localhost:3001/upload-reservation-document', {
                        method: 'POST', // or 'PUT'
                        body: FormPay// Uncomment this line if you need to send data in the request body
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data)
                

                    })
                    .catch(error => console.error('Error:', error)
                    )

                }

                if(letterDean){
                    console.log("Dean Letter Uploading")
                    const FormDean=new FormData()
                    if(letterDean && reservationID){
                        console.log('Append')
                        FormDean.append('document',letterDean)
                        FormDean.append('reservation_id',reservationID)
                        FormDean.append('type','letter')
                    }


                    fetch('http://localhost:3001/upload-reservation-document', {
                        method: 'POST', // or 'PUT'
                        body: FormDean
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data)

                    })
                    .catch(error => console.error('Error:', error)
                    )
                }

                window.alert("Reservation Success!")
                window.location.href = "http://localhost:3000/homepage"

            }else{
                console.log("Not Uploading Files")

            
            }

     }, [submitFail])



    return (
        <>
            <form  className="loginform" onSubmit={handleOpen}  >

            <FormGroup>
  
            <Grid container height='40%' mt={5} alignSelf={'center'}  overflow='auto' mb={'4em'}   sx={{ direction: { xs: 'row', sm: 'column' }   }}>

                {/* Back Button */}
                <Grid item xs={12} justifyContent='flex-end'  > 
                    <Stack direction='row' spacing={3} alignItems="center" >
                        <Link to={'/roompage/'+room_id} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <BackButton/>
                        </Link>
                        <Typography variant='h4'  sx={{  fontSize: {xs:20},color:'#183048'}}>Room Reservation Form</Typography>
                    </Stack>
                </Grid>
                
               
                <Grid container mt={2} sx={{borderRadius:'15px'}}  style={{overflowY:'hidden'}}>
              
               {/* User details*/}
               
               <Grid item xs={12} md={4} bgcolor='#EEEEEE' padding={2} >
                    <Stack spacing={2} textAlign='left' >
                        {isAdmin && 
                            <>              
                                    <FormControlLabel  onClick={handleGuestReservation} control={<Checkbox />} sx={{ fontSize:10}} label="Check for Guest reservation" /> 
                                
                            </>
                        }         
                        {guestBooking && isAdmin &&
                            <>
                                <Stack direction='row' spacing={1}>
                                    <Stack>
                                        <Typography  >First name</Typography>
                                        <TextField size='small'  variant="outlined" required type='text' onChange={(e) => setFname(e.target.value)}/>
                                    </Stack>
                                    <Stack>
                                        <Typography  >Last Name</Typography>
                                        <TextField sx={{textAlign:'center'}} size='small'  variant="outlined" required type='text' onChange={(e) => setLname(e.target.value)} />
                                    </Stack>
                                    <Stack>
                   
                                    </Stack>
          
                             
                                </Stack>
                                <Typography >User Email*</Typography>
                                <TextField size='small' 
                                    error={emailError} 
                                    value={otherEmail}
                                    InputLabelProps={{shrink:true}}
                                    onBlur={(e) => handleBlurEmailError(e.target.value)}
                                    variant="outlined" required type='email'
                                    onChange={(e) => setOtherEmail(e.target.value)} 
                                    helperText={emailError ? 'Add a valid email e.g. aliceguo@up.edu.ph': ''}
                                />    
                                
                            </>
                        }
                        {!guestBooking &&
                             <>
                                <Typography  >Name*</Typography>
                                <TextField size='small' value={name} variant="outlined" required type='text' onChange={(e) => setName(e.target.value)} /> 
                                <Typography >Email*</Typography>
                                <TextField size='small' 
                                    error={emailError} 
                                    value={email}
                                    InputLabelProps={{shrink:true}}
                                    onBlur={(e) => handleBlurEmailError(e.target.value)}
                                    variant="outlined" required type='email'
                                    onChange={(e) => setEmail(e.target.value)} 
                                    helperText={emailError ? 'Add a valid email e.g. aliceguo@up.edu.ph': ''}
                                />    
                            </>
                  
                        }
            
{/* 
                        <Typography >Contact*</Typography>
                        <TextField size='small'
                            error={contactFormat} 
                            InputLabelProps={{shrink:true}}
                            onBlur={handleBlurContactFormat}
                            variant="outlined" required type='number'
                            onChange={(e) => setContact(e.target.value)} 
                            helperText={contactFormat ? 'Please add valid integer inputs': ''}
                            
                            onKeyDown={preventMinus}
                            InputProps={{ inputProps: { min: 0 } }}
                        /> */}

                        <Card sx={{ backgroundColor:'#D9D9D9', borderRadius:'15px', padding:3}} >
                                <Box  >
                                    <Stack spacing={2} >
                                        <Box>
                                            <Typography variant='h6' align='left'>Letter addressed to dean</Typography>
                                            <Typography variant='subtitle2'>Must be signed by junior or senior faculty adviser</Typography>
                                        </Box>
                                        <Stack direction='row'  spacing={3} height={30}>

                                        <Button component="label" sx={{backgroundColor:'#F1F1F1', minWidth:'100px',maxWidth: "100px"}} size='small' aria-required>
                                            Choose file
                                            {/* <VisuallyHiddenInput id='letterfile' type="file" /> */}
                                            <Input onChange={LetterSubmit}  type="file" inputProps={{accept:"application/pdf"}} sx={{border:0,
                                                        clip: 'rect(0 0 0 0)',
                                                        clipPath: 'inset(50%)',
                                                        height: 1,
                                                        overflow: 'hidden',
                                                        position: 'absolute',
                                                        bottom: 0,
                                                        left: 0,
                                                        whiteSpace: 'nowrap',
                                                        width: 1,
                                            }} disableUnderline
                                    
                                             />
                                         
                                        </Button>
                                        <Typography noWrap >{letterName}</Typography>
                                        </Stack>
 
                  
                                        {/* <TextField type={"file"} inputProps={{accept:"application/pdf"}}/> */}
                                        <Typography variant='h6'>Proof of Payment</Typography>
                                 
                                        <Stack  direction='row' spacing={3} height={30} >

                                            <Button component="label" sx={{backgroundColor:'#F1F1F1', minWidth:'100px',maxWidth: "100px"}} size='small' aria-required>
                                                Choose file
                                                {/* <VisuallyHiddenInput id='letterfile' type="file" /> */}
                                                <Input type="file" inputProps={{accept:"application/pdf"}} sx={{border:0,clip: 'rect(0 0 0 0)',
                                                            clipPath: 'inset(50%)',height: 1, overflow: 'hidden', position: 'absolute',
                                                            bottom: 0,left: 0, whiteSpace: 'nowrap',width: 1,
                                                }} disableUnderline
                                                onChange={PermitSubmit}
                                                onClick={OnInputClick}
                                            />
                                            
                                            </Button>
                                            <Typography noWrap>{permitName}</Typography>  
                                             
                                        </Stack>
                                        {/* <FormControlLabel control={<Checkbox defaultChecked />} sx={{marginTop:-3}}label="Check if Permit is N/A" />  */}
                                    </Stack>
                            
                                </Box>
                        </Card>

                        
                    </Stack>
                  
                    </Grid>
                   {/* Event information and Submit */}
       
                        
                  <Grid item xs={12} md={4} sx={{backgroundColor:'#E9E9E9',}} textAlign='left' padding={2}>
                    <Stack padding={3} spacing={1}   >
                                <Typography>You are reserving</Typography>
                                <Typography variant='h4'>{roomName}</Typography>
                                {roomImages[room_id.toString()] ? (
                                    <Box component="img"
                                    src={roomImages[room_id.toString()]}
                                    alt={`Room Image`}
                                    sx={{
                                        maxHeight: 400,
                                        borderRadius: 4,
                                        width: 'auto',
                                    }}
                                />
                                ) : (
                                    <Box 
                                    sx={{
                                        minHeight:'30vh',
                                        backgroundColor: 'white', backgroundImage: `url(${HomeBG})`,
                                        backgroundRepeat: "no-repeat",
                                        backgroundSize: 'cover',
                                        borderRadius:'15px'
                                    }}/>
                                )}
                                <Stack direction='row' spacing={2}>
                                
                                    <Typography variant='subtitle2'>Date: &nbsp; </Typography>
                                    <Typography>{date}</Typography>
                                    
                                    
                                </Stack>
                                <Typography >Timeslot/s Reserved</Typography>
                                <Stack direction='row' spacing={1} justifyContent='flex-start'>
                    
                                        
                                   
                                                <Typography sx={{backgroundColor:'#CBCBCB', borderRadius:'15px'}} padding={1}>{startTime}</Typography> 
                                         
                                       
                                                <Typography  padding={1}>to </Typography> 
                                          
                                       
                                                <Typography sx={{backgroundColor:'#CBCBCB',borderRadius:'15px'}} padding={1}>{endTime}</Typography> 
                                    
                                </Stack>
                                <Typography variant='subtitle1'>Overall Cost:  {sumCost}</Typography>
                        </Stack>           
                  </Grid>
                  <Grid item xs={12} md={4} padding={2} sx={{backgroundColor:'#E9E9E9'}} >
                    <Stack spacing={2}  >
   
                        <Typography align='left' >Event Name</Typography>
                        <TextField size='small' variant="outlined" required type='text' onChange={(e) => seteventName(e.target.value)} />
                        <Typography align='left'>Event Details</Typography>
                        <TextField
                            label='Enter text here...'
                            InputProps={{
                                rows: 4,
                                multiline: true,
                                inputComponent: 'textarea',         
                            }}        
                            onChange={(e) => seteventDetails(e.target.value)} 
                            required
                        />    
                        <Box justifyContent={'center'} >
                            <Button type="submit" sx={{backgroundColor:'#FFB532', maxWidth:'100%' }} size='large' >Submit</Button>   
                        </Box>   

        
                                     
                    </Stack>
                  </Grid>
                   {/* Event information and Submit */}
            
     
                </Grid>
                
                          
          </Grid>
            <Dialog open={open}  onClose={() => setOpen(false)}>
                <DialogTitle>Confirm Booking</DialogTitle>
                <DialogContent>
                    <Stack sx={{  backgroundColor:'#D9D9D9',borderRadius:'15px'}} padding={2}>
{/* 
                    const startDateTime= date+" "+startTime
        const endDateTime= date+" "+endTime
        console.log({startDateTime,endDateTime, date, creationDate})
        console.log({room_id,eventName,eventDetails,email,sumCost}) */}
                        <Stack direction='row' spacing={2}>   
                                <Typography variant='subtitle2'>Email</Typography>
                                <Typography>{guestBooking? otherEmail:email}</Typography>   
                        </Stack>
                        <Stack direction='row' spacing={2}>   
                                <Typography variant='subtitle2'>Event Name:</Typography>
                                <Typography>{eventName}</Typography>   
                        </Stack>

                        <Stack direction='row' spacing={2}>   
                                <Typography variant='subtitle2'>Room:</Typography>
                                <Typography>{roomName}</Typography>   
                        </Stack>
                        <Stack direction='row' spacing={2}>   
                                <Typography variant='subtitle2'>Date: </Typography>
                                <Typography>{date}</Typography>    
                        </Stack>
                        <Stack direction='row' spacing={2}>   
                                <Typography variant='subtitle2'>Time: </Typography>
                                <Typography>{startTime} - {endTime}</Typography>   
                        </Stack>
                        
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button type="submit" onClick={HandleSubmit}>
                        Book
                    </Button>
                    <Button onClick={() => setOpen(false)}>
                        Return
                    </Button>
                </DialogActions>
      
            </Dialog>
          </FormGroup>

          </form>
        </>

        
    )
}

export default RoomReservationForm;