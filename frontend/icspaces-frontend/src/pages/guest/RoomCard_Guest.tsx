import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
} from "@mui/material";
import { Link } from "react-router-dom";

interface RoomCardProps {
  image: string;
  room_id: string;
  room_name: string;
  room_capacity: string;
  fee: string;
  room_type: string;
  floor_number: string;
  additional_fee_per_hour: string;
  utilities: string[];
  
}

const statusMapping: Record<string, string> = { 
  '0': 'Ground',
  '1': 'First',
  '2': 'Second'
  // add other status codes as needed
};

const RoomCard: React.FC<RoomCardProps> = ({ image, room_id, room_name, room_capacity, fee, room_type,floor_number, additional_fee_per_hour, utilities   }) => {
  

  return (
    <Grid
      container
      mb={4}
      sx={{
        justifyContent: {
          xs: "space-evenly",
          sm: "space-evenly",
          md: "flex-end",
          lg: "space-evenly",
          xl: "space-evenly",
        },
      }}
    >
      <Grid item xs={11} sm={7} md={10} lg={10}>
        <Card
          style={{ display: "flex", flexDirection: "column", height: "auto" }}
        >
          <Grid container>
            <Grid item xs={12} sm={12} md={5}>
              <CardMedia
                component="img"
                image={image}
                alt="Room Image"
                style={{ width: "100%", height: 200, objectFit: "cover" }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={7}>
              <CardContent style={{ flex: 1 }}>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  mb={1}
                  textAlign="start"
                  color="primary"
                >
                  {room_name}
                </Typography>
                <Grid container spacing={1}>
                  {/* First column */}
                  <Grid item xs={6}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      textAlign="start"
                    >
                      <strong>Floor:</strong> {statusMapping[floor_number]}
                      <br />
                      <strong>Type:</strong> {room_type}
                    </Typography>
                  </Grid>
                  {/* Second column */}
                  <Grid item xs={6}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      textAlign="start"
                    >
                      <strong>Capacity:</strong> {room_capacity}
                      <br />
                      <strong>Amenities:</strong> {utilities.join(", ")}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container justifyContent="flex-end" pt={3}>
                  <Button
                    size="small"
                    color="primary"
                    component={Link}
                    to={`/roompageguest/${room_id}`}
                    sx={{
                      "&:hover": {
                        color: "secondary.main",
                      },
                    }}
                  >
                    View Room
                  </Button>
                </Grid>
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
};

export default RoomCard;
