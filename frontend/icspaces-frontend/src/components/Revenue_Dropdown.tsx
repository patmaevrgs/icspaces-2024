import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    OutlinedInput,
  } from "@mui/material";
  
  interface Room {
    id: number;
    name: string;
  }
  
  interface DropDown_AdminProps {
    label: string;
    selectedOption: number | null;
    handleSelectChange: (value: number) => void;
    rooms: Room[];
    width?: number;
  }
  console.log("Rendering DropDown_Admin");
  
  const DropDown_Admin: React.FC<DropDown_AdminProps> = ({
    label,
    selectedOption,
    handleSelectChange,
    rooms,
    width,
  }) => {
    console.log("rooms", rooms);
    return (
      <FormControl variant="outlined" style={{ width: width || 200 }}>
        <InputLabel>{label}</InputLabel>
        <Select
          value={selectedOption !== null ? selectedOption : ""}
          onChange={(event) => handleSelectChange(event.target.value as number)}
          input={<OutlinedInput label={label} />}
        >
          <MenuItem value={-1}>Get All Room Revenue</MenuItem>
          {rooms.map((room, index) => (
            <MenuItem key={index} value={room.id}>
              {room.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };
  
  export default DropDown_Admin;
  