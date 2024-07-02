import { useState, useEffect} from "react";
import {
  Stack,Typography, Button, Box, Grid, FormControl,InputLabel,TextField,ButtonGroup,Theme, MenuItem, Select,Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import AccountCard from "./AccountCard";
import BackButton from "./BackButton";
import AccountDialog from "./AccountDialog";
import { Users } from "./types";
import useMediaQuery from "@mui/material/useMediaQuery";
import SearchIcon from "@mui/icons-material/Search";

import { Link } from "react-router-dom";
const statusMapping: Record<number, string> = { 
  0: 'Student',
  1: 'Faculty',
  2: 'Admin',
  3: 'Director',

  // add other status codes as needed
};

const AccountManage = () => {
  const [selectedUser, setSelectedUser] = useState<Users | null>(null);
  useEffect(() => {
    fetch('http://localhost:3001/get-all-users', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      // body: JSON.stringify(data), // Uncomment this line if you need to send data in the request body
    })
    .then(response => response.json())
    .then(data => {
     
      setDataTable(data);
      setOriginalData(data);
      console.log("Data is fetched");
      console.log(data)
    });
  }, [selectedUser]);

  function FetchStudentDetails(email:string){

        fetch('http://localhost:3001/get-student-details', {
            method: 'POST', // or 'PUT'
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({email}), // Uncomment this line if you need to send data in the request body
        })
        .then(response => response.json())
        .then(data => {
            setstudentNumber(data.student_number);
            setOrg(data.org);
            setCourse(data.course);
            setCollege(data.college);
            setDepartment(data.department);
            setuserMail(data.email);
            setuserIconURL(data.profilePicUrl)
            console.log('meow');
        });
   
  };




  const [reservationView, setReservationView] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [dataTable, setDataTable] = useState<Users[]>([]); 
  const [accountNum,setAccountNum] = useState(dataTable.length);
  const [originalData, setOriginalData] = useState<Users[]>([]);
  const [sortOrder, setSortOrder] = useState("Latest");
  const [open, setOpen] = useState(false);
  const [userIconURL,setuserIconURL]=useState('');
  const isSmallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  //for the account dialog
  const [fname, setFname]=useState('');
  const [lname, setLname]=useState('');
  const [college,setCollege]=useState('');
  const [department,setDepartment]=useState('');  
  const [studentNumber,setstudentNumber]=useState('');  
  const [course,setCourse]=useState('');  
  const [org,setOrg]=useState(''); 
  const [userMail,setuserMail]=useState('');

  const handleUserMailChange = (event: { target: { value: string; }; }) => {
    setuserMail(event.target.value);
  };
  const handleCollegeChange = (event: { target: { value: string; }; }) => {
    setCollege(event.target.value);
  };
  const handleDepartmentChange = (event: { target: { value: string; }; }) => {
    setDepartment(event.target.value);
  };
  const handleStudentNumberChange = (event: { target: { value: string; }; }) => {
    setstudentNumber(event.target.value);
  };
  const handleOrgChange = (event: { target: { value: string; }; }) => {
    setOrg(event.target.value);
  };
  const handleCourseChange = (event: { target: { value: string; }; }) => {
    setCourse(event.target.value);
  };

  const handleFnameChange = (event: { target: { value: string; }; }) => {
    setFname(event.target.value);
  };

  const handleViewChange = (event: { target: { value: any; }; }) => {
    const view = event.target.value;
    setReservationView(view);
    applyFilters(view, searchTerm);
  };

  const handleSearchChange = (event: { target: { value: any; }; }) => {
    const search = event.target.value;
    setSearchTerm(search);
    applyFilters(reservationView, search);
  };
  const applyFilters = (view: string, search: string) => {
    let filteredData = originalData;
    if (view !== 'All') {
      filteredData = filteredData.filter(row => statusMapping[row.usertype] === view);
    }
    if (search) {
      filteredData = filteredData.filter(row => row.lname.toLowerCase().includes(search.toLowerCase()));
    }
    setDataTable(filteredData);
  };

  const handleOpen = (reservation: Users) => { //p[]
    setSelectedUser(reservation);
    setOpen(true);
  };

  return (
    <Stack
      style={{
        display: "flex",
        flexDirection: "column",        
        width: "85%",
      }}
      spacing={1}
    >
      {/* Return Button*/}
        <Grid container >
            <Stack direction='row' spacing={6} textAlign="left">
              <Link to={'/homepage'} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <BackButton/>
                        </Link>
                <Typography variant='h4'  sx={{  fontSize: {xs:17,md:30},color:'#183048'}}>Manage Accounts</Typography>
            </Stack>
        </Grid>
      {/* Account Filters */}
      {/* <AccountFilters /> */}

      <Grid
      container
      direction={isSmallScreen ? "column" : "row"}
      spacing={2}
      width='100%'
      justifyContent='space-between'
    >
      <Grid item xs={12} sm={6} md={5}  style={{display:"flex",justifyContent:"flex-start"}}>
        <TextField
          label="Search by last name"
          value={searchTerm}
          onChange={handleSearchChange}
          variant="outlined"
          InputProps={{ endAdornment: <SearchIcon /> }}   
          fullWidth
        />
      </Grid>

      {/* Account Filters End */}

      <Grid item xs={12} sm={6} md={2} container direction='column' style={{display:"flex",justifyContent:"flex-start"}}>
        <FormControl variant="outlined" >
          <InputLabel id="filter-label">Filter</InputLabel>
          <Select
            labelId="filter-label"
            label="Filter" value={reservationView} onChange={handleViewChange}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Student">Student</MenuItem>
            <MenuItem value="Faculty">Faculty</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Director">Director</MenuItem>
          </Select>
        </FormControl>
      </Grid>

    </Grid>

      {/* Account Filters */}



      <Box display="flex" justifyContent="flex-end">
        <Typography variant = 'subtitle1'my={3}>Total Accounts: {dataTable.length}</Typography>
       </Box>
     
      <Stack 
        style={{
          maxWidth: "100%",
          minWidth: "100%",
          maxHeight: "400px",
          overflowX: "auto",
          overflowY: "auto",

        }}
        spacing={2}
        
      >

        {/* Account Filters */}
        
        {dataTable.map((reservation) => (
            <AccountCard
              key={reservation.email}
              users={reservation}
              onClick={() => handleOpen(reservation)}
            />
          ))}
        {/* Dialog */}
        {selectedUser && 
          <AccountDialog
          open={open}
          onClose={() => setSelectedUser(null)}
          user={selectedUser}
          />
        }

        {/* {selectedUser && (
          <>
          {selectedUser.usertype===0 && FetchStudentDetails(selectedUser.email)}
          <Dialog open={open} onClose={()=>setSelectedUser(null)} >
            <DialogTitle>
              <Stack direction='row' justifyContent='space-between' >
                <Typography variant='h6'>Account Info</Typography>
                <Button sx={{justifyContent:'flex', backgroundColor:'gray'}}>
                  <CloseIcon></CloseIcon>
                </Button>
              </Stack>
            </DialogTitle>
            <DialogContent>

            <Grid container>
                <Grid item>
                    <Stack direction='row' spacing={2} padding={1} sx={{ display: "flex", alignItems: "center", justifyContent:"space-evenly"}}>
                        <Avatar sx={{ width: 50, height: 50 }}>VH</Avatar>
                        <Typography variant='h6'>{selectedUser.lname},&nbsp;{selectedUser.fname}</Typography>
                    </Stack>
                </Grid>
            </Grid>
            <Button onClick={()=>setSelectedUser(null)} color="primary">
            Close
            </Button>
            </DialogContent>
            <FormControl variant="outlined" size='small'>
              <Stack spacing={2} mt={1}>
                  <TextField onChange={handleFnameChange} value={fname}></TextField>
                
              </Stack>
              </FormControl>
          </Dialog>
          </>
        )} */}
   

      </Stack>
    </Stack>
  );
};

export default AccountManage;
