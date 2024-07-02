import { Box, Typography, TextField, Icon, Grid, Stack, useMediaQuery, MenuItem, Snackbar, Button, List, ListItem, ListItemText, IconButton } from "@mui/material";
import React, { useState, useEffect, useRef, ChangeEvent} from 'react';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import { useParams } from "react-router-dom";
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import '../../App.css';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import BackButton from "../../components/BackButton";

const darkColor = '#183048';
const inputStyle = {
  fontSize: '20px',
  color: darkColor,
  fontFamily: 'Inter',
  fontWeight: 400,
  marginBottom: '5%',
  backgroundColor: '#FFFFFF',
};

const styles = {
  list: {
    width: '100%',
    // border: '1px solid #ddd',
    marginTop: '1%',
    maxWidth: '100%',
    // backgroundColor: theme.palette.background.paper,

  },
  listItem: {
    color: darkColor,
    border: '1px solid',
    borderColor: '#183048',
    borderRadius: '100px',
    marginBottom: '10px',
    maxHeight: '5vh',
    maxWidth: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
};


const AddRoom_Admin = () => {


  const [items, setItems] = useState<Utility[]>([]);
  const [originalItems, setOrignalItems] = useState<Utility[]>([]);
  const [newItem, setNewItem] = useState<Utility>({item_name: '', item_qty: 0, fee: 0 });
  const [room, setRoom] = useState<Room | undefined>(undefined);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const isVertical = useMediaQuery('(min-width:970px)');
  const [orientation, setOrientation] = useState('');
  const roomName = useRef<HTMLInputElement>(null);
  const roomLocation = useRef<HTMLInputElement>(null);
  const roomCapacity = useRef<HTMLInputElement>(null);
  const roomType = useRef<HTMLInputElement>(null);
  const roomFee = useRef<HTMLInputElement>(null);
  const roomOvertimeFee = useRef<HTMLInputElement>(null);
  const utilityQty = useRef<HTMLInputElement[]>([]);   
  const utilityPrice = useRef<HTMLInputElement[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCapacity, setSelectedCapacity] = useState('');
  const [selectedRoomType, setSelectedRoomType] = useState('');
  const initialQuantities = items.map(item => item.item_qty);
  const initialPrices = items.map(item => item.fee);
  const [userEmail, setUserEmail] = useState<string | null>(null);



  // Set initial state using useState
  const [quantities, setQuantities] = useState(initialQuantities);
  const [prices, setPrices] = useState(initialPrices);

  // Function to handle value change
  const handleLocationChange = () => {
    setSelectedLocation(roomLocation.current?.value || '');
  };

  const handleCapacityChange = () => {
    setSelectedCapacity(roomCapacity.current?.value || '');
  };

  const handleRoomTypeChange = () => {
    setSelectedRoomType(roomType.current?.value || '');
  }

  const location = [
    {
      value: 0,
      label: 'First Floor',
    },
    {
      value: 1,
      label: 'Second Floor',
    },
    {
      value: 2,
      label: 'Third Floor',
    },
    {
      value: 3,
      label: 'Fourth Floor',
    },
  ];

  const capacities = [
    {
      value: 40,
      label: '40',
    },
    {
      value: 50,
      label: '50',
    },
    {
      value: 100,
      label: '100',
    },
  ];

  const room_types = [
    {
      value: 'Lecture Hall',
      label: 'Lecture Hall',
    },
    {
      value: 'Conference Room',
      label: 'Conference Room',
    },
    {
      value: 'Computer Lab',
      label: 'Computer Lab',
    },
  ];


  // Define the types
  interface Room {
    room_id: number;
    room_name: string;
    floor_number: number;
    room_capacity: number;
    fee: number;
    additional_fee_per_hour: number;
  }

  interface Utility {
    item_name: string;
    item_qty: number;
    fee: number;
  }

  useEffect(() => {
    setOrientation(isVertical ? 'vertical' : 'horizontal');
  }, [isVertical]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("http://localhost:3001/get-profile", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (data.success) {
          setUserEmail(data.data.email);
        } else {
          console.error("Error: ", data.message || "Unknown error occurred");
        }
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      }
    };

    fetchUserProfile();
  }, []); // Empty dependency array ensures this runs once on mount

  //function to save to database

  const saveEdit = async () => {
    // Access the values of the text fields directly using refs
    const name = roomName.current!.value;
    const location = roomLocation.current!.value;
    const capacity = roomCapacity.current!.value;
    const type = roomType.current!.value;
    const fee = roomFee.current!.value;
    const overtimeFee = roomOvertimeFee.current!.value;
    console.log('Location', location);
    console.log('Capacity', capacity);
  
    // Validate if any required field is empty
    if (!name || !location || !capacity || !fee || !overtimeFee || !type) {
      setSnackbarMessage("Please fill out all fields with valid inputs.");
      setSnackbarOpen(true);
      console.error("Please fill out all fields with valid inputs.");
      return; // Exit early if any required field is empty
    }

  
    // Prepare the payload to send to the backend
    const roomDetails = {
      room_name: name,
      floor_number: parseInt(location), // Convert location to number
      room_capacity: parseInt(capacity), // Convert capacity to number
      room_type: type,
      fee: parseFloat(fee), // Convert fee to float
      additional_fee_per_hour: parseFloat(overtimeFee), // Convert overtimeFee to float
      utilities: items,
      admin_id: userEmail,

    };
  
    try {
      console.log('Room Details:', roomDetails);
      // Send an HTTP request to update utilities
      const utilityResponse = await fetch("http://localhost:3001/add-new-room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roomDetails), // Convert utilityDetails object to JSON string
      });
  
      if (!utilityResponse.ok) {
        setSnackbarMessage("Failed to save new room.");
        setSnackbarOpen(true);
        throw new Error("Failed to save new room.");
      } else {
        utilityResponse.json().then((data) => {
          console.log("New room saved successfully:", data["room_id"]);
          setSnackbarMessage("New room saved successfully.");
          setSnackbarOpen(true);

          const room_id = data["room_id"];

          const formData = new FormData();
          if (image && room_id) {
              formData.append("image", image);
              formData.append("room_id", room_id);
          }

        fetch('http://localhost:3001/upload-room-image', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));

        });
      }


      

      console.log('Location', location);
      console.log('Capacity', capacity);
      console.log("Image Type: ", typeof(image));
      console.log('Room Details')
      console.log("New Room Created Successfully.");
      console.log("Room Details:", roomDetails);
      setSnackbarMessage("New room created successfully.");
      setSnackbarOpen(true);


      
    } catch (error) {
      console.error("Error saving room details:", error);
      // Handle errors gracefully
    }
  };
  
  const addItem = () => {
    if (newItem.item_name.trim() !== '') {
      setItems([...items, newItem]);
      setNewItem({item_name: '', item_qty: 0, fee: 0 }); // Clear the input field after adding
    }
  };

  const deleteItem = (index: number) => {
    setItems(prevItems => {
      const updatedItems = [...prevItems];
      updatedItems.splice(index, 1);
      return updatedItems;
    });
  
    setQuantities(prevQuantities => {
      const updatedQuantities = [...prevQuantities];
      updatedQuantities.splice(index, 1);
      return updatedQuantities;
    });

    setPrices(prevPrices => {
      const updatedPrices = [...prevPrices];
      updatedPrices.splice(index, 1);
      return updatedPrices;
    });
  
  };

  const cancelEdit = () => {
    window.location.reload();
    // Clear the input fields
    setSnackbarMessage("Changes have been discarded.");
    setSnackbarOpen(true);
  };

  const [image, setImage] = useState<File | null>(null);
  const [photoName, setPhotoName] = useState<string>('');

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedImage = e.target.files?.[0];
    if (selectedImage) {
      setImage(selectedImage);
      setPhotoName(selectedImage.name); // Set the photo name
    }
  };

  const handleUpload = () => {
    // You can implement image upload logic here, e.g., using Axios or Fetch API
    console.log(image);
  };

  const [hourlyError, setHourlyError] = useState(false);
  const [overtimeError, setOvertimeError] = useState(false);
  const [roomNameError, setRoomNameError] = useState(false);


  useEffect(() => {
    if (roomOvertimeFee.current) {
      roomOvertimeFee.current.value = room?.additional_fee_per_hour !== undefined ? room.additional_fee_per_hour.toString() : '';
    } 
    if (roomFee.current) {
      roomFee.current.value = room?.fee !== undefined ? room.fee.toString() : '';
    }
    if (roomName.current) {
      roomName.current.value = room?.room_name || '';
    }
  }, [room]);

  const handleBlurRoomName = () => {
    const value = roomName.current?.value || ''; // Use optional chaining
    setRoomNameError(value === '');
  }
  
  const handleBlurHourlyFee = () => {
    const value = roomFee.current?.value || ''; // Use optional chaining
    setHourlyError(value === '');
  };

  const handleBlurOvertimeFee = () => {
    const value = roomOvertimeFee.current?.value || ''; // Use optional chaining
    setOvertimeError(value === '');
  };


  return (
      <>


      <Box
      sx={{
        overflow: "auto",
        overflowX: "hidden",
        height: "calc(100vh - 2vh)" ,
        maxWidth: '100%',
        // border: '3px solid #ff6699',
        display: 'flex',
        flexDirection: 'column', // Stack vertically on small screens, horizontally on medium screens and above
        alignItems: 'space-between', // Align items at the start
        // height: 'auto', // Full height of the viewport
        justifyContent: 'start', // Center children vertically
        padding: 0, // Add padding around the box

      }}
    >
        <Grid item md={11} mb={3} mt={2} style={{marginTop: '7%', marginLeft: '4%'}}>
          <Box display="flex" alignItems="flex-start">
            <BackButton />
            <Typography
              variant="h4"
              ml={2}
              color="primary"
              style={{ fontWeight: "bold" }}
            >
              Add New Room
            </Typography>
          </Box>
        </Grid>

        
      
       <Snackbar
          open={snackbarOpen}
          autoHideDuration={2000} // Adjust the duration as needed
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
          anchorOrigin={{
            vertical: "bottom", // Change to 'top' if you want it to appear at the top
            horizontal: "center", // Change to 'left' if you want it to appear on the left
          }}
        />
      <Stack direction="column" spacing={2} justifyContent="center" alignItems="center" width="100%" margin='2%' >
      <Stack sx={{
        // border: '2px solid #333',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'start',
        flexDirection: { xs: 'column', sm:'column', md: 'row', lg: 'row'},
        maxWidth: '100%',
        height: 'auto',
        backgroundColor: '#EEEEEE',
        color: darkColor,
        borderRadius: 4,
        padding: 2,
        // paddingLeft: 4,
        // paddingTop: 4,
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        width: { xs: '80%', md: '70%' }, // Adjust width for different screen sizes
        // marginTop: { xs: 'auto', md: '13%' }, 
        zIndex: 1,
      }}
      spacing={2}
      useFlexGap
      flexWrap="wrap"
      // direction={{ xs: 'column', md: 'row' }}
      >
      
      {/* <Stack direction={{xs: 'column', md: 'row'}} spacing={2}  useFlexGap flexWrap="wrap" border={1} color='#333' width={'90%'}> */}
      <Stack  direction="column" spacing={0} width={{xs: '100%',  md:'48%'}}
      // sx={{
      //   border: '2px solid #333',}}
      >



        <>
          <Typography variant="h6" style={{color: darkColor, fontFamily:'Inter', fontWeight: 700}}>Room Information</Typography>
          <TextField 
            id="room-name" 
            label="Room Name" 
            defaultValue="Room Name"
            variant="outlined" 
            size="small" 
            error={roomNameError}
            helperText={roomNameError ? 'This field is required.' : ''}
            onBlur={handleBlurRoomName}
            inputRef={roomName}
            margin = "normal"
            inputProps={{
              maxLength: 25,
            }}
            InputProps={{
              style: {
                wordWrap: 'break-word',
                maxWidth: '100%',
                fontSize: '30px',
                color: darkColor,
                fontFamily: 'Inter', // Just 'Inter' is enough, no need for 'Inter.700' here
                fontWeight: 700,
                marginBottom: '5%',
                backgroundColor: '#FFFFFF',
              },
            }}
          />
        <TextField
          id="type"
          select
          label="Room Type"
          // defaultValue={location[room?.floor_number]} 
          // value={selectedRoomType}
          SelectProps={{
            native: true,
          }}
          variant="outlined"
          size="small"
          inputRef={roomType}
          InputProps={{
            style: inputStyle,
          }}
          onChange={handleRoomTypeChange} 
        >
          {room_types.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>

      <TextField
          id="location"
          select
          label="Room Location"
          // defaultValue={location[room?.floor_number]} 
          // value={selectedLocation}
          SelectProps={{
            native: true,
          }}
          variant="outlined"
          size="small"
          inputRef={roomLocation}
          InputProps={{
            style: inputStyle,
          }}
          onChange={handleLocationChange} 
        >
          {location.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>

      <TextField id="room-capaciy" 
            select 
            label="Room Capacity" 
            defaultValue= "0.00"
            variant="outlined" 
            size = "small" 
            inputRef={roomCapacity}
            SelectProps={{
              native: true,
            }}
            InputProps = {{
              style: inputStyle,
            }}
            onChange={handleCapacityChange}
      >
      {capacities.map((optionCapacity) => (
        <option key={optionCapacity.value} value={optionCapacity.value}>
          {optionCapacity.label}
        </option>
      ))}
      </TextField>

      <TextField id="room-fee" label="Fee per Hour" defaultValue={room?.fee} variant="outlined" size="small" type="number" inputRef={roomFee}
        InputLabelProps={{ shrink: true }}
        error={hourlyError}
        helperText={hourlyError ? 'This field is required. Please add valid integer inputs.' : ''}
        onBlur={handleBlurHourlyFee}
        margin="normal"
        InputProps={{
          style: inputStyle,
          inputProps: {
            maxLength: 10,
            min: 0, // Optionally, you can set minimum value
            step: 50, // Optionally, you can set step value
            max: 100000,
          },
        }}
    />
      <TextField id="room-overtime-fee" label = "Additional Fee per Hour"defaultValue='0' variant="outlined" size = "small" type = "number"  inputRef={roomOvertimeFee}
        InputLabelProps={{ shrink: true }}
        error={overtimeError}
        helperText={overtimeError ? 'This field is required. Please add valid integer inputs.' : ''}
        onBlur={handleBlurOvertimeFee}
        margin="normal"
        InputProps = {{
          style: inputStyle,
          inputProps: {
            maxLength: 10,
            min: 0, // Optionally, you can set minimum value
            step: 50, // Optionally, you can set step value
            max: 100000,
          },
        }}
      />

        </>
  

      </Stack>

      {orientation === 'vertical' ? (
        <svg width="2" height="100%" >
          <line x1="0" y1="0" x2="0" y2="100%" stroke="#333" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      ) : (
        <svg width="100%" height="2">
          <line x1="0" y1="0" x2="100%" y2="0" stroke="#333" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      )}

      <Stack direction="column" spacing={2} justifyContent="flex-start" alignItems="flex-start"  width={{xs: '100%', md:'47%'}} >
        <Typography variant="h6" style={{color: darkColor, fontFamily:'Inter', fontWeight: 700}}>Equipments Available: </Typography> 
        <Typography variant="h6" style={{color: 'gray', fontFamily:'Inter', fontWeight: 400, fontSize: '12px', marginTop: '1%'}}>Character Limit: 20</Typography>
       

        <List style ={styles.list} >
          {items.map((item, index) => (
            <ListItem key={index} style={styles.listItem}>
              <ListItemText primary={item.item_name} style={{ color: darkColor, flex: 1, wordWrap: 'break-word', maxWidth: '45%',
                }} />
              <Typography variant="body1" style={{ color: darkColor, flex: 'none', width: '10%', fontSize: '15px', textAlign: 'center', padding:'5px'}}>Price: </Typography>
              <TextField 
                id="item" 
                value={prices[index]}
                variant="standard" 
                size="small" 
                type="number" 
                inputRef={(input) => (utilityPrice.current[index] = input)} 
                InputProps={{
                  style: { ...inputStyle, flex: 'none', width: '70px', fontSize: '15px', textAlign: 'center', marginTop: '1vh', wordWrap: 'break-word',
                  maxWidth: '100%',},
                  disableUnderline: true,
                  
                }}
                inputProps={{
                  style: { textAlign: 'center', verticalAlign: 'bottom'},
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    const newValue = (e.target as HTMLInputElement).value;
                    const updatedItems = [...items];
                    updatedItems[index].fee = parseInt(newValue);
                    setItems(updatedItems);
                    const updatedPrices = [...prices];
                    updatedPrices[index] = parseInt(newValue);
                    setPrices(updatedPrices);
                    console.log('Updated Prices:', items);

                  }
                  
                }}
              />

              <Typography variant="body1" style={{ color: darkColor, flex: 'none', width: '7%', fontSize: '15px', textAlign: 'center'}}>Qty: </Typography>
              <TextField 
                id="item" 
                value={quantities[index]}
                variant="standard" 
                size="small" 
                type="number" 
                inputRef={(input) => (utilityQty.current[index] = input)} 
                InputProps={{
                  style: { ...inputStyle, flex: 'none', width: '50px', fontSize: '15px', textAlign: 'center', marginTop: '1vh', wordWrap: 'break-word',
                  maxWidth: '100%',},
                  disableUnderline: true,
                  
                }}
                inputProps={{
                  style: { textAlign: 'center', verticalAlign: 'bottom'},
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    const newValue = (e.target as HTMLInputElement).value;
                    const updatedItems = [...items];
                    updatedItems[index].item_qty = parseInt(newValue);
                    setItems(updatedItems);
                    const updatedQuantities = [...quantities];
                    updatedQuantities[index] = parseInt(newValue);
                    setQuantities(updatedQuantities);
                    console.log('Updated Quantities:', items);
                  }
                  
                }}
              />

              <IconButton
                onClick={() => deleteItem(index)}
                
                aria-label="delete"
                style={{ color: '#183048', marginLeft: 'auto' }}
              >
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
          
          {items.length <= 4 && (
          <ListItem style={styles.listItem}>
          <TextField
              // label="Add New Equipment"
              placeholder="Add New Equipment"
              value={newItem.item_name}
              onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value})}
              size="small"
              variant="standard"
              inputProps={{
                maxLength: 20,
              }}
              InputProps={{
                disableUnderline: true,
              }}
            />
            <IconButton onClick={addItem} aria-label="add" >
              <AddCircleOutlineRoundedIcon />
            </IconButton>
          </ListItem>
          )}
        </List>
        
        
        <div style={{ margin: '0px', padding: '0px', width: '100%', display: 'flex', textAlign: 'end', justifyContent: 'space-between', border: '1px solid black'}}>
          <input
            accept="image/*"
            id="image-upload"
            type="file"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
          <label htmlFor="image-upload">
            <Button
              component="span"
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              style = {{height: '100%', width: '100%'}}
            >
              Upload file
            </Button>
          </label>
  
          <TextField
            value={photoName}
            variant="outlined"
            size="small"
            disabled
            sx={{
              width: '70%',
              backgroundColor: '#FFFFFF',
              color: 'black', // Change text color to black
              fontFamily: 'Inter',
              fontWeight: 400,
              fontSize: '15px',
              // marginTop: '15px',
            }}
            inputProps={{ color: 'black' }} // Additional input color for consistency
          />

        </div>

            {/* {fileName && <span>{fileName}</span>} Render the file name if it exists */}

      </Stack>
      

      </Stack>
      <Stack direction={{xs: 'row', md: 'row'}} spacing={'10%'} width={{xs: '100%', md:'50%'}} margin='2%' justifyContent='center' >
        <Button variant="contained" color="primary" onClick={saveEdit} style={{width: '20%',borderRadius: '50px', backgroundColor: '#FFB532', color: darkColor, fontFamily: 'Inter', fontWeight: 700, fontSize: '15px'}}> Save </Button>
        <Button variant="contained" color="secondary" onClick={cancelEdit} style={{width: '20%',borderRadius: '50px', backgroundColor: '#E4E4E4', color: darkColor, fontFamily: 'Inter', fontWeight: 700, fontSize: '15px'}}>Cancel</Button>
      </Stack>
      </Stack>
      
      </Box>
      </>


);
  
};

export default AddRoom_Admin;




