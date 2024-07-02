import { Box, Stack } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search'; 
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BookmarksOutlinedIcon from '@mui/icons-material/BookmarksOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const MuiBox = () => {
    return (
        <Stack direction = 'column' spacing = {2}>
            <Box sx = {{
                    backgroundColor: '#DDDDDD',
                    color: '#183048',
                    height: '100px',
                    width: '542px',
                    padding: '16px',
                    '&:hover': {
                        backgroundColor: '#FFB532',
                    },
                }}>
                    <Stack direction= 'column' spacing={1}>
                        <h1>Hello, Frontend!</h1>
                        <p>Today is Tuesday, March 04, 2024. </p>
                        <p>You have 3 upcoming events. </p>
                    </Stack>
            </Box>
            <Stack direction='row' spacing={2}>
                <Box sx = {{
                    backgroundColor: '#DDDDDD',
                    color: '#183048',
                    height: '100px',
                    width: '100px',
                    padding: '16px',
                    '&:hover': {
                        backgroundColor: '#61dafb',
                    },
                }}>
                    <Stack direction="column" alignItems="center">
                        <SearchIcon sx={{ fontSize: 40, color: '#183048' }} />
                        <div>Make Reservation</div>
                    </Stack>
                </Box>

                <Box sx = {{
                    backgroundColor: '#DDDDDD',
                    color: '#183048',
                    height: '100px',
                    width: '100px',
                    padding: '16px',
                    '&:hover': {
                        backgroundColor: '#FFB532',
                    },
                }}>
                    <Stack direction="column" alignItems="center">
                        <CalendarTodayIcon sx={{ fontSize: 40, color: '#183048' }} />
                        <div>Make Reservation</div>
                    </Stack>
                </Box>

                <Box sx = {{
                    backgroundColor: '#DDDDDD',
                    color: '#183048',
                    height: '100px',
                    width: '100px',
                    padding: '16px',
                    '&:hover': {
                        backgroundColor: '#FFB532',
                    },
                }}>
                    <Stack direction="column" alignItems="center">
                        <BookmarksOutlinedIcon sx={{ fontSize: 40, color: '#183048' }} />
                        <div>Reservation Status</div>
                    </Stack>
                </Box>

                <Box sx = {{
                    backgroundColor: '#DDDDDD',
                    color: '#183048',
                    height: '100px',
                    width: '100px',
                    padding: '16px',
                    '&:hover': {
                        backgroundColor: '#FFB532',
                    },
                }}>
                    <Stack direction="column" alignItems="center">
                        <HelpOutlineIcon sx={{ fontSize: 40, color: '#183048' }} />
                        <div>FAQs</div>
                    </Stack>
                </Box>
            </Stack>
        </Stack>
    )
}

export default MuiBox;
