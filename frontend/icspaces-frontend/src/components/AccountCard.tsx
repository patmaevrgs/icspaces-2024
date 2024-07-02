import { TableRow, TableCell, Button,Grid,Box, Avatar, Stack,Typography, Divider} from "@mui/material";
import { Users } from "./types";
import HomeBG from "../assets/room_images/HomeBG.png";
import LocalPostOfficeIcon from '@mui/icons-material/LocalPostOffice';
import { useState,useEffect } from "react";
import BackButton from "./BackButton";
interface AccountCardProps {
  users: Users;
  onClick: () => void;
}

const userRole: Record<number, string> = { 
  0: 'Student',
  1: 'Faculty',
  2: 'Admin',
  3: 'Director',

  // add other status codes as needed
};



const AccountCard: React.FC<AccountCardProps> = ({

  
  users,
  onClick,
}) => {
  function FetchReservationDetails(email1:string){

    useEffect(() => {
        fetch('http://localhost:3001/get-total-reservations', {
            method: 'POST', // or 'PUT'
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({email:email1}), // Uncomment this line if you need to send data in the request body
        })
        .then(response => response.json())
        .then(data => {

          setTotalReservations(data.totalReservations);
        });
      }, []);
  };
  function FetchLastLogin(email1:string){
    useEffect(() => {
        fetch('http://localhost:3001/get-last-login-date', {
            method: 'POST', // or 'PUT'
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({email:email1}), // Uncomment this line if you need to send data in the request body
        })
        .then(response => response.json())
        .then(data => {

          setlastLogin(data.email.slice(0,10));

        });
      }, []);
  };
  const BlueTypography = (
    props: any //Bottom three cells
  ) => (
    <Typography sx={{color:'#183048'}} >
      {props.children}
    </Typography>
  ); 
  const GrayTypography = (
    props: any //Bottom three cells
  ) => (
    <Typography variant='subtitle2' color='#8A8A8A' sx={{textAlign:{xs:'center',md:'left'}}} >
      {props.children}
    </Typography>
  ); 
 
 const [totalReservations,setTotalReservations]=useState(0);
 const [lastLogin,setlastLogin]=useState('');


  return (
    <>
  {users && FetchReservationDetails(users.email)}
  {users && FetchLastLogin(users.email)}
    <Grid
    container
    width='100%'
    borderRadius='15px'
    sx={{border:'solid',borderWidth:'0.5px', borderColor:"#B9B9B9"}}
  >
    
    <Grid item xs={12} md={1}>{/* Image */}
      <Grid container style={{ height: "100%"}} justifyContent='space-evenly' >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          padding={1}
        >
          <Avatar  src={users.profilePicUrl} sx={{ width: 75, height: 75 }}>{users.fname.substring(0,1)}.{users.lname.substring(0,1)}</Avatar>
        </Box>
        <Divider orientation="vertical"   sx={{height:'100%', display:{xs:'none',md:'block'} }}  />
      </Grid>
      
    </Grid>
      <Grid item xs={12} md={11}> {/* User Details */}
        <Grid container  >
          <Grid item xs={12}>{/* 1st Row */}
            <Stack sx={{ flexDirection:{xs:'column',lg:'row'} }}  padding={1}  spacing={{ xs: 1, md: 0 }} justifyContent='space-between' >
              <Box marginRight='auto'  sx={{ display:{xs:'flex',md:'inline'}, 
                    flexDirection:{xs:'row-reverse',md:'row'},
                    textOverflow:'ellipsis',
                    minWidth:{xs:'100%',md:'25%'},
                    maxWidth:{xs:'100%',md:'25%'},
                  }}
                  justifyContent='space-evenly'
               > 
                <Typography sx={{textAlign:{xs:'center',md:'left'}}} variant='h6' color='#183048'> {users.lname},&nbsp;{users.fname}</Typography>
                {/* <GrayTypography>Last name, First name</GrayTypography> */}
                <Typography variant='subtitle2' color='#8A8A8A' sx={{textAlign:{xs:'center',md:'left'},  display:{xs:'none',md:'block'}, }} >
                  Last name, First name
                </Typography>
              </Box>
              <Box marginRight='auto' sx={{
                  display:{xs:'flex',md:'inline'}, 
                  flexDirection:{xs:'row-reverse',md:'row'},
                  textOverflow:'ellipsis',

                  minWidth:{xs:'100%',md:'30%'},
                  maxWidth:{xs:'100%',md:'30%'},
                }}
                justifyContent='space-evenly'
              >
                
                <Typography sx={{ textAlign:{xs:'center',md:'left'}, display: "flex", alignItems: "center",  color: "#183048",}}>
        
                    <LocalPostOfficeIcon  sx={{ fontSize: 16, color: "#183048" }}/>
                    &nbsp;
                     {users.email}
                </Typography>
                
                <GrayTypography>Email</GrayTypography>
              </Box>

              <Box marginRight='auto'  sx={{
                  display:{xs:'flex',md:'inline'}, 
                  flexDirection:{xs:'row-reverse',md:'row'},
                  textOverflow:'ellipsis',

                  minWidth:{xs:'100%',md:'20%'},
                  maxWidth:{xs:'100%',md:'20%'},
                }} 
                justifyContent='space-evenly'
              >
                <BlueTypography>{totalReservations}</BlueTypography>
                <Typography variant='subtitle2' color='#8A8A8A' sx={{textAlign:{xs:'left',md:'center'}}} >
                  Total Room Reservations
                </Typography>
              </Box>
              
              <Box marginRight={4} sx={{
                    display:{xs:'flex',md:'inline'}, 
                    flexDirection:{xs:'row-reverse',md:'row'},
                    textOverflow:'ellipsis',
                    minWidth:{xs:'100%',md:'15%'},
                    maxWidth:{xs:'100%',md:'15%'},
              }}
              justifyContent='space-evenly'
              >
                <BlueTypography>{lastLogin}</BlueTypography>
                <Typography variant='subtitle2' color='#8A8A8A' sx={{textAlign:{xs:'left',md:'center'}}} >
                  Last log-in
                </Typography>
              </Box>
            </Stack>
            <Divider orientation="horizontal"   flexItem sx={{width:"100%"}}  />
          </Grid>
          
          <Grid item xs={12}  padding={1}> {/* Role and Button */}
            
            <Grid container alignItems='center' justifyContent='space-between' >

                <Stack direction='row'>
                  <BlueTypography>Role: &nbsp;</BlueTypography>
                  <Typography sx={{fontWeight:500, color: "#183048" }}>{userRole[users.usertype]}</Typography>
                </Stack>
                
                <Button sx={{borderRadius:'15px',backgroundColor:"#FFB532", width:{xs:'30%',xl:"12%"}, minHeight: 0, minWidth: 0, padding: 0.3, textTransform: 'capitalize'}} onClick={onClick} >Edit Role</Button>
            </Grid>

          </Grid>

        </Grid>
      </Grid>

  </Grid>
  </>
 
  );
};

export default AccountCard;
