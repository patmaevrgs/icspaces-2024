import { Box, Grid, Divider, Stack, Typography } from '@mui/material';
import SquareIcon from '@mui/icons-material/Square';
import React, { useEffect, useState } from 'react';



const MuiAdminBox = () => {

    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000); // Update every second
        return () => clearInterval(interval);
    }, []);

    const formattedDate = currentDate.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const [totalRequestCount, setTotalRequestCount] = useState(0);
    const [pendingRequestCount, setPendingRequestCount] = useState(0);
    const [paidAmount, setPaidAmount] = useState(0);
    const [pendingAmount, setPendingAmount] = useState(0);
    const [totalAccountsCount, setTotalAccountsCount] = useState(0);
    const [newAccountsCount, setNewAccountsCount] = useState(0);

    
    
    useEffect(() => {

        const fetchTotalRequestCount = async () => {
            const url = 'http://localhost:3001/get-total-request';
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            };
    
            try {
                const response = await fetch(url, options);
                const data = await response.json();
                console.log("The total request count is",data["count"]);
                setTotalRequestCount(data["count"]);
            } catch (error) {
                console.error('Error fetching total request count:', error);
            }
        };

        const fetchPendingRequestCount = async () => {
            const url = 'http://localhost:3001/get-pending-request';
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            };
    
            try {
                const response = await fetch(url, options);
                const data = await response.json();
                console.log("the pending request count is:" ,data);
                setPendingRequestCount(data["count"]);
            } catch (error) {
                console.error('Error fetching total request count:', error);
            }
        };

        const fetchPaidAmount = async () => {
            const url = 'http://localhost:3001/get-paid';
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            };
    
            try {
                const response = await fetch(url, options);
                const data = await response.json();
                // console.log(data);
                setPaidAmount(data["count"]);
            } catch (error) {
                console.error('Error fetching total request count:', error);
            }
        };

        const fetchPendingAmount = async () => {
            const url = 'http://localhost:3001/get-pending';
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            };
    
            try {
                const response = await fetch(url, options);
                const data = await response.json();
                // console.log(data);
                setPendingAmount(data["count"]);
            } catch (error) {
                console.error('Error fetching total request count:', error);
            }
        };

        const fetchTotalAccountsCount = async () => {
            const url = 'http://localhost:3001/get-total-accounts';
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            };
    
            try {
                const response = await fetch(url, options);
                const data = await response.json();
                // console.log(data);
                setTotalAccountsCount(data["count"]);
            } catch (error) {
                console.error('Error fetching total request count:', error);
            }
        };

        const fetchNewAccountsCount = async () => {
            const url = 'http://localhost:3001/get-new-accounts';
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            };
    
            try {
                const response = await fetch(url, options);
                const data = await response.json();
                // console.log(data);
                setNewAccountsCount(data["count"]);
            } catch (error) {
                console.error('Error fetching total request count:', error);
            }
        };
    
        fetchTotalRequestCount();
        fetchPendingRequestCount();
        fetchPaidAmount();
        fetchPendingAmount();
        fetchTotalAccountsCount();
        fetchNewAccountsCount();
    }, []);
    
    const NotifBox = (props:any) => (
        <Box sx={{
            background: 'linear-gradient(to bottom, #FFFFFF, #c5d2d9)',
            color: '#183048', // Changed text clor to black for better visibility
            borderRadius: '15px',
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            height: 163,
            fontSize: {
                xs: 14,
                sm: 18,
                lg: 24,
            },
            padding: 1,
            boxShadow: '0px 8px 12px rgba(0, 0, 0, 0.2)',
        }}>
            {props.children}
        </Box>
    );

    return (
        <Grid container rowSpacing={3} columnSpacing={1}>
            <Grid item xs={12}>
                <Box sx={{
                    display: "flex",
                    justifyContent: "left",
                    alignItems: "left",
                    textAlign:'left',  
                    backgroundColor: '#183048',
                    color: '#FFFFFF',
                    borderRadius:'15px',
                    padding:'3.5%',
                    paddingLeft:'5%',
                    fontFamily: 'Calibri, sans-serif',
                    boxShadow: '0px 8px 12px rgba(0, 0, 0, 0.2)',
                }}>
                    <Stack direction='column' spacing={1}>
                        <Typography variant='h3' sx={{ fontSize: { xs: 30, sm: 40 }, color: "#FFB532" }}>Hello, Admin!</Typography>
                        <Stack>
                        <Typography variant="body1">Today is {formattedDate}</Typography>
                        {/* <Typography variant="body1">You have 3 upcoming events.</Typography> */}
                        </Stack>
                    </Stack>
                </Box>
            </Grid>

            <Grid container item xs={12} spacing={1}>
                <Grid item xs={4}>
                    <NotifBox>
                        <Box
                        component={SquareIcon}
                        sx={{
                            fontSize: 25,
                            color: "#183048",
                            fontFamily: 'Calibri, sans-serif',
                            marginLeftt: 1,
                            borderRadius: 4, // Adjust the border radius as needed
                        }}
                        />
                        <Typography variant="body1">Request</Typography>

                        {/* <Stack direction='row' alignItems='center' sx={{ height: '130%', marginLeft: '-8px' }}>
                            <Stack sx={{ marginLeft: '-40px' }}>
                                <Typography variant="h4">{totalRequestCount}</Typography>
                                <Typography variant="body2">Total Request</Typography>
                            </Stack> 
                            <Stack sx={{ marginLeft: '40px' }}>
                                <Divider orientation="vertical" textAlign='center' flexItem sx={{ width: 1.5, height: 80, backgroundColor: '#183048' }} />
                            </Stack>
                            <Stack sx={{ marginLeft: '30px' }}> 
                                <Typography variant="h4">{pendingRequestCount}</Typography> 
                                <Typography variant="body2">Pending Request</Typography>
                            </Stack> 
                        </Stack> */}

                        <Stack direction='row' alignItems='center' sx={{ height: '130%', marginLeft: '-20px' }} spacing={2}>
                            <div>
                                <Typography variant="h4">{totalRequestCount}</Typography>
                                <Typography variant="body2">Total Request</Typography>
                            </div> 
                            <div>
                                <Divider orientation="vertical" textAlign='center' flexItem sx={{ width: 1.5, height: 80, backgroundColor: '#183048' }} />
                            </div>
                            <div> 
                                <Typography variant="h4">{pendingRequestCount}</Typography> 
                                <Typography variant="body2">Pending Request</Typography>
                            </div> 
                        </Stack>

                    </NotifBox>
                </Grid>
                <Grid item xs={4}>
                    <NotifBox>
                        <Box
                            component={SquareIcon}
                            sx={{
                                fontSize: 25,
                                color: "#183048",
                                fontFamily: 'Calibri, sans-serif',
                                marginLeftt: 1,
                                borderRadius: 4, // Adjust the border radius as needed
                            }}
                        />
                        <Typography variant="body1">Accounts</Typography>

                        {/* <Stack direction='row' alignItems='center' sx={{ height: '130%', marginLeft: '-8px' }}>
                            <Stack sx={{ marginLeft: '-50px' }}>
                                <Typography variant="h4">{totalAccountsCount}</Typography> 
                                <Typography variant="body2">Total Accounts</Typography>
                            </Stack> 
                            <Stack sx={{ marginLeft: '40px' }}>
                                <Divider orientation="vertical" textAlign='center' flexItem sx={{ width: 2, height: 80, backgroundColor: '#183048' }} />
                            </Stack>
                            <Stack sx={{ marginLeft: '40px' }}>
                                <Typography variant="h4">{newAccountsCount}</Typography> 
                                <Typography variant="body2">New Accounts</Typography>
                            </Stack> 
                        </Stack> */}

                        <Stack direction='row' alignItems='center' sx={{ height: '130%', marginLeft: ['-50px', '-35px', '-20px'] }} spacing={2}>
                            <div>
                                <Typography variant="h4">{totalAccountsCount}</Typography> 
                                <Typography variant="body2">Total Accounts</Typography>
                            </div> 
                            <div>
                                <Divider orientation="vertical" textAlign='center' flexItem sx={{ width: 1.5, height: 80, backgroundColor: '#183048' }} />
                            </div>
                            <div> 
                            <Typography variant="h4">{newAccountsCount}</Typography> 
                                <Typography variant="body2">New Accounts</Typography>
                            </div> 
                        </Stack>

                    </NotifBox>
                </Grid>
                <Grid item xs={4}>
                    <NotifBox>
                        <Box
                            component={SquareIcon}
                            sx={{
                                fontSize: 25,
                                color: "#183048",
                                fontFamily: 'Calibri, sans-serif',
                                marginLeftt: 1,
                                borderRadius: 4, // Adjust the border radius as needed
                            }}
                        />
                        <Typography variant="body1">Balances</Typography>

                        {/* <Stack direction='row' alignItems='center' sx={{ height: '130%', marginLeft: '-8px' }}>
                            <Stack sx={{ marginLeft: '10px' }}>
                                <Typography variant="h4">{paidAmount}</Typography> 
                                <Typography variant="body2"> Paid </Typography>
                            </Stack> 
                            <Stack sx={{ marginLeft: '50px' }}>
                                <Divider orientation="vertical" textAlign='center' flexItem sx={{ width: 1.5, height: 80, backgroundColor: '#183048' }} />
                            </Stack>
                            <Stack sx={{ marginLeft: '50px' }}>
                                <Typography variant="h4">{pendingAmount}</Typography> 
                                <Typography variant="body2"> Pending </Typography>
                            </Stack> 
                        </Stack> */}

                        <Stack direction='row' alignItems='center' sx={{ height: '130%', marginLeft: ['-50px', '-35px', '-20px'] }} spacing={3}>
                            <div>
                                <Typography variant="h4">₱{pendingAmount}</Typography> 
                                <Typography variant="body2"> Not Paid </Typography>
                            </div> 
                            <div>
                                <Divider orientation="vertical" textAlign='center' flexItem sx={{ width: 1.5, height: 80, backgroundColor: '#183048' }} />
                            </div>
                            <div> 
                                <Typography variant="h4">₱{paidAmount}</Typography> 
                                <Typography variant="body2"> Paid Amount </Typography>
                            </div> 
                        </Stack>

                    </NotifBox>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default MuiAdminBox;
