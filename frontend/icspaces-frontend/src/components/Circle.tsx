import React from 'react';
import { Box } from '@mui/material';

interface CircleProps {
  color: string;
  size: number;
}

const Circle: React.FC<CircleProps> = ({ color, size }) => {
  return (
    <Box
      width={size}
      height={size}
      borderRadius="50%"
      bgcolor={color}
    />
  );
};

export default Circle;
