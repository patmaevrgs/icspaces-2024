import { Typography, Stack, Button, useMediaQuery, useTheme, Switch, Divider, ButtonGroup } from "@mui/material";
import { useState } from "react";
import { useParams } from 'react-router-dom';
import {Link } from "react-router-dom";

interface HourButtonsProps {
    availableTimes?: any;
    dateTime?: any;
    roomID?: any;
  }

const HourButtons : React.FC<HourButtonsProps> = ({
    availableTimes, dateTime, roomID
  }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [isSwitchOn, setIsSwitchOn] = useState(false);
    const [selectedTime, setSelectedTime] = useState(['']);
    const [activeButton, setActiveButton] = useState([-1]);
    const [activeButton2, setActiveButton2] = useState([-1]);
    const [data1, setData1] = useState('');
    const [data2, setData2] = useState('');   
    const valuesToSend = {
        start_dateTime: data1,
        end_dateTime: data2,
        room_id: roomID,
        date: dateTime.format("dddd DD MMM YYYY")
    }
    const handleClicked = (text:string) => {
        const newSelectedTime = [...selectedTime];
        if (newSelectedTime.includes(text)) {
            const removeIndex = newSelectedTime.indexOf(text);
            newSelectedTime.splice(removeIndex, 1);
        } else{
            newSelectedTime.push(text);
        }
        newSelectedTime.sort();
        setSelectedTime(newSelectedTime);
        setData1(newSelectedTime[1]);
        const timeParts = newSelectedTime[newSelectedTime.length -1].split(':');
        let hours = parseInt(timeParts[0], 10);
        hours = (hours + 1)
        const newTimeString = `${hours.toString().padStart(2, '0')}:00:00`;
        setData2(newTimeString);
    }
    const handleReserve = () => {
        return <Button variant="contained"
        disabled={selectedTime[1] === undefined || roomID === null} 
        sx={{
            textTransform: "none",
            backgroundColor: '#FFB532',
            height: isSmallScreen ? "0.875rem" : "23px",
            width: '130%',
            color: 'black', 
            borderRadius: '20px',
            fontSize: isSmallScreen ? "8px" : "13px",
        }}> <b> Reserve </b> </Button>
    }

    const handleClick = (index:number) => {
        const newSelectedIndexes = [...activeButton];

        const indexExists = newSelectedIndexes.indexOf(index);
        if (indexExists !== -1){
            newSelectedIndexes.splice(indexExists, 1);
        }else{
            newSelectedIndexes.push(index);
        }

        setActiveButton(newSelectedIndexes);
      };

      const handleClick2 = (index:number) => {
        const newSelectedIndexes = [...activeButton2];

        const indexExists = newSelectedIndexes.indexOf(index);
        if (indexExists !== -1){
            newSelectedIndexes.splice(indexExists, 1);
        }else{
            newSelectedIndexes.push(index);
        }

        setActiveButton2(newSelectedIndexes);
      };

    const handleSwitchChange = () => {
        setIsSwitchOn(!isSwitchOn);
    };
    const buttonStyle = {
        textTransform: "none",
        backgroundColor: '#white',
        height: isSmallScreen ? "0.875rem" : "23px",
        width: '100%',
        color: '#828282', 
        borderRadius: '20px',
        fontSize: isSmallScreen ? "8px" : "13px",
        '&:hover': {
            backgroundColor: 'lightgrey',
          },
    };

    const buttonStyle2 = {
        textTransform: "none",
        // backgroundColor: isClicked ? '#183048' : '#white',
        backgroundColor: 'white',
        height: isSmallScreen ? "0.5rem" : "23px",
        width: isSmallScreen ? "0.5rem" :'100%',
        color: '#828282', 
        borderRadius: '10px',
        fontSize: isSmallScreen ? "3px" : "10px",   
        padding: '0',
        '&:hover': {
            backgroundColor: 'lightgrey',
          },
    };

    const buttonStyle3 = { 
        textTransform: "none",
        backgroundColor: '#183048',
        height: isSmallScreen ? "0.875rem" : "23px",
        width: '100%',
        color: '#828282', 
        borderRadius: '20px',
        fontSize: isSmallScreen ? "8px" : "13px",
        '&:hover': {
            backgroundColor: 'lightgrey',
          },
    };
    const buttonStyle4 = {
        textTransform: "none",
        // backgroundColor: isClicked ? '#183048' : '#white',
        backgroundColor: '#183048',
        height: isSmallScreen ? "0.5rem" : "23px",
        width: isSmallScreen ? "0.5rem" :'100%',
        color: 'white!important', 
        borderRadius: '10px',
        fontSize: isSmallScreen ? "3px" : "10px",   
        padding: '0',
    };

    const boxStyle = {
        backgroundColor: '#F2F2F2',
        display: 'fixed',
        height: '50%',
        width: '35%',
        borderRadius: '16px',
        overflow: "auto",
      };

    const textStyle ={
        textAlign: "start",
        color: '#2D5378',
        fontSize: isSmallScreen ? "6px" : "14px",
    }
    const convertTo12HourFormat = (time:any) => {
        const militaryTime = time.split(':');
        let hours = parseInt(militaryTime[0], 10);
        const minutes = militaryTime[1];
        const period = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        const standardTime = `${hours}:${minutes} ${period}`;

        return standardTime;
    };
      
    const filteredAvailableTimes = availableTimes?.filter((time:any) => time >= "07:00:00")
    const availableMorningSlots = filteredAvailableTimes?.filter((time:any) => time <= "12:00:00")
    const availableAfternoonSlots = filteredAvailableTimes?.filter((time:any) => time > "12:00:00" && time <= "21:00:00" );
    const amButtons = ['07:00:00', '08:00:00', '09:00:00', '10:00:00', '11:00:00','12:00:00', '13:00:00'];
    const pmButtons = ['13:00:00', '14:00:00', '15:00:00', '16:00:00', '17:00:00', '18:00:00', '19:00:00', '20:00:00', '21:00:00', '22:00:00']
    const selectedButtons1 = ["7-8 AM", "8-9 AM", "9-10 AM", "10-11 AM", "11-12 PM", "12-1 PM"]
    const selectedButtons2 = ["1-2 PM", "2-3 PM", "3-4 PM", "4-5 PM", "5-6 PM", "6-7 PM", "7-8 PM", "8-9 PM", "9-10 PM", ]
    
    const renderButtons = () => {
        if (isSwitchOn) {
          // Render set of buttons when the switch is on
          
          return (
            <>
            
             {pmButtons?.slice(0,-1).map((PMbuttonText:string, index:number) => (
                <Button key={index} variant="outlined" 
                disabled={!availableAfternoonSlots?.includes(PMbuttonText)}
                onClick={() => {
                    handleClicked(PMbuttonText)
                    handleClick2(index)
                }} sx={activeButton2.includes(index) ? buttonStyle3 : buttonStyle}>
                    {convertTo12HourFormat(PMbuttonText)} - {convertTo12HourFormat(pmButtons[index+1])}
                </Button>
             ))}
            </>
          );
        } else {
          // Render set of buttons when the switch is off
          return (
            <>
            {amButtons?.slice(0,-1).map((AMbuttonText:string, index:number) => (
                <Button key={index} variant="outlined"
                disabled={!availableMorningSlots?.includes(AMbuttonText)} 
                onClick={() => {
                    handleClicked(AMbuttonText) 
                    handleClick(index)
                }} 
                sx={activeButton.includes(index) ? buttonStyle3 : buttonStyle}>

                    {convertTo12HourFormat(AMbuttonText)} - {convertTo12HourFormat(amButtons[index+1])}
                </Button>
             ))}
            </>
          );
        }
      };

    return (
        <Stack direction='column' padding={2} useFlexGap flexWrap="wrap" justifyContent='center' sx={boxStyle} >
            {/*Selected Time Section*/}
            <Stack direction="column" alignItems='stretch' justifyContent='flex-end'width='100%' spacing={1}>
                <Stack direction='row' spacing={1} sx={{overflow: "hidden"}}>
                <Typography sx={{
                    textAlign: 'end',
                    color: '#2D5378',
                    width: '10%',
                    fontSize: isSmallScreen ? "6px" : "11px", 
                    whiteSpace: 'pre-wrap',
                    margin: '2px'
                    }}>
                   <b>Selected Time</b>    
                </Typography>
                <ButtonGroup disableElevation variant="outlined" size="medium" fullWidth> 
                    {selectedButtons1.map((buttonText, index) => (
                        <Button key={index}  disabled variant="outlined" sx={activeButton.includes(index) ? buttonStyle4 : buttonStyle2}>
                        {buttonText}
                        </Button>
                    ))}
                </ButtonGroup>
                </Stack>
                <ButtonGroup disableElevation variant="outlined" size="large" > 
                   {selectedButtons2.map((buttonText, index) => (
                        <Button key={index} disabled variant="outlined" sx={activeButton2.includes(index) ? buttonStyle4 : buttonStyle2}>
                        {buttonText}
                        </Button>
                    ))}
                </ButtonGroup>
                <Divider variant="middle"/>
            </Stack>

            <Stack direction="row" height='60%' justifyContent="space-between">
                {/*What time works best section */}
                <Stack direction='column' padding={3} width='40%' justifyContent='space-around' spacing={1}>
                    <Typography color='#2D5378' sx={{textAlign: "start", fontSize: isSmallScreen ? "12px" : "25px"}}>
                       <b> What time works best? </b> 
                    </Typography>
                    <Typography sx={textStyle}>
                        For durations longer than an hour, you can select multiple time options!
                    </Typography>
                    <Typography sx={textStyle}>
                        Egress should end strictly within your booked schedule. Otherwise, overtime charges will be incurred.
                    </Typography>
                </Stack>
                
                {/*Hour Buttons section */}
                <Stack direction='column' padding={3} alignItems='flex-end'  justifyContent='center' >
                    <Typography sx={{fontSize: isSmallScreen ? "6px" : "13px", color: '#2D5378',}}>
                        <span style={{color: '#787BEC'}}><b>Click here to choose your time slot</b> </span> <br /> <b>AM<Switch checked={isSwitchOn} onChange={handleSwitchChange} size="small"/> PM</b>
                    </Typography>
                    <Stack direction='column' padding={2} spacing={2} width='110%' sx={{overflow: 'auto'}}>
                        {renderButtons()}
                        
                    </Stack>
                </Stack>
            </Stack>
            { (selectedTime[1] === undefined || roomID === null) ? handleReserve() :  
            <Link to="/roomreservation" state={valuesToSend}>
            <Button variant="contained"
            sx={{
                textTransform: "none",
                backgroundColor: '#FFB532',
                height: isSmallScreen ? "0.875rem" : "23px",
                width: '130%',
                color: 'black', 
                borderRadius: '20px',
                fontSize: isSmallScreen ? "8px" : "13px",
                '&:hover': {
                    backgroundColor: '#FFC532',
                }
            }}> <b> Reserve </b> </Button>
        </Link>}
            
        </Stack>
    );
}


export default HourButtons;
