import { Divider, Grid, Stack, Typography, Button, Box } from "@mui/material";
import React, { ChangeEvent, } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';

interface RoomPhotosProps {
    roomID: any;
  }

const RoomPhotos  : React.FC<RoomPhotosProps> = ({
    roomID
  }) => {
    const [allImages, setAllImages] = useState<AllPhotos []>([]);
    const [image, setImage] = useState<File | null>(null);
    const [photoName, setPhotoName] = useState<string>("");
    interface AllPhotos {
        id: number;
        url: string;
    }
    
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
                body: JSON.stringify({ room_id: roomID }),
              }
            );
            if (!photos.ok) {
              throw new Error("Failed to fetch room images");
            }
    
            const imagesData = await photos.json();
            setAllImages(imagesData.images);
                
          }catch (error) {
            console.error("Failed to fetch images:", error);
          }
        }
        getPhotos();
      }, [roomID, image]);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedImage = e.target.files?.[0];
    if (selectedImage) {
        setImage(selectedImage);
        setPhotoName(selectedImage.name);
    }
    };
    const deletePhoto = (image_id:number) => {
        const confirmed = window.confirm("Are you sure you want to delete this photo?");
        if (confirmed){
          try {
            fetch("http://localhost:3001/delete-room-image", {
              method: "POST",
              headers: {'Content-Type': 'application/json',},
              body: JSON.stringify({file_id: image_id}),
            })
              .then((response) => {
                if (!response.ok) {
                  window.alert("Error in deleting the photo! Please try again.");
                  throw new Error("Network response was not ok");
                }
                return response.json();
              })
              .then((data) => {console.log(data); window.location.reload();})
          } catch (error) {
            console.error("Error deleting photo:", error);
          }
          
        }
      };

    useEffect(() => {
        const getPhotos = async () => {
            try {
                const formData = new FormData();
                if (image && roomID) {
                    formData.append("image", image);
                    formData.append("room_id", roomID);
                }
                await fetch("http://localhost:3001/upload-room-image", {
                method: "POST",
                body: formData,
            })
                .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
                })
                .then((data) => console.log(data))
                .then(() => {
                  window.location.reload();
                })
                .catch((error) => console.error("Error:", error));
            }catch (error) {
                console.error("Error adding room image:", error);
            }
        }
        getPhotos();
    },[image]);

    return (
      <Stack direction="column" spacing={1} sx={{ overflow: 'auto' }}>
        <Divider />
        <Typography variant="h4" fontWeight="bold" sx={{ textAlign: 'start' }}>
          Current Photos
        </Typography>
        <Box sx={{ overflowX: 'auto' }}>
          <Grid container spacing={1} sx={{ flexWrap: 'wrap' }}>
            {allImages.map((item, index) => (
              <Grid
                item
                key={index}
                xs={12}
                sm={6}
                md={3}
                sx={{
                  position: 'relative',
                  width: { xs: '150px', sm: '190px', md: '20px' },
                  height: { xs: '70px', sm: '110px', md: '160px' },
                }}
              >
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => deletePhoto(allImages[index].id)}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    borderRadius: '50%',
                    minWidth: 0,
                    padding: 0,
                    backgroundColor: '#CCCCCC',
                    color: 'black',
                    '&:hover': {
                      backgroundColor: 'lightgrey',
                    },
                  }}
                >
                  <CloseIcon />
                </Button>
                <img
                  src={allImages[index].url}
                  style={{
                    borderRadius: '16px',
                    position: 'static',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  alt={`Photo ${index + 1}`}
                />
              </Grid>
            ))}
            <Grid item xs={12} sm={6} md={3}>
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
                  startIcon={<AddCircleOutlineIcon />}
                  sx={{
                    width: { xs: '150px', sm: '190px', md: '250px' },
                    height: { xs: '70px', sm: '110px', md: '150px' },
                    backgroundColor: '#e0e0e0',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '16px',
                    border: '1px solid #ccc',
                    '&:hover': {
                      backgroundColor: 'lightgrey',
                    },
                  }}
                >
                  Add Photo
                </Button>
              </label>
            </Grid>
          </Grid>
        </Box>
      </Stack>
    );    
}

export default RoomPhotos;