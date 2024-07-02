import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Typography,
  styled,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"; // Import the ExpandMoreIcon component from the appropriate package

const StyledExpandMoreIcon = styled(ExpandMoreIcon)(({ theme }) => ({
  "&:hover": {
    color: theme.palette.secondary.main,
  },
}));

const FAQ_Accordion: React.FC = () => {
  return (
    <Grid container direction="column" spacing={2} mb={10}>
      <Grid item>
        <Accordion>
          <AccordionSummary
            expandIcon={<StyledExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography fontWeight="bold">
              What features does ICSpaces offer?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              {" "}
              ICSpaces offers a user-friendly interface with essential functions
              to streamline your event planning process. These include: Venue
              Search: Easily browse through available lecture halls and computer
              laboratories based on your event requirements in the “Rooms” tab.
              Availability Calendar: View real-time availability of venues to
              plan your event date more effectively. Reservation Management:
              Monitor booking status or cancel reservations conveniently through
              the “Reservations” tab.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Grid>
      <Grid item>
        <Accordion>
          <AccordionSummary
            expandIcon={<StyledExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography fontWeight="bold">
              How do I make a reservation on ICSpaces?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              {" "}
              Making a reservation is easy! Simply navigate to our website,
              continue as a guest without an account or log in to your account,
              select your desired venue and date, and fill out the reservation
              form.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Grid>
      <Grid item>
        <Accordion>
          <AccordionSummary
            expandIcon={<StyledExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography fontWeight="bold">
              Can I cancel or modify my reservation?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              {" "}
              Unfortunately, you can’t modify a reservation. You may opt to
              cancel it then create a booking with the new details.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Grid>
      <Grid item>
        <Accordion>
          <AccordionSummary
            expandIcon={<StyledExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography fontWeight="bold">
              What types of events can I host using ICSpaces?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              {" "}
              ICSpaces caters to a wide range of events, including coding
              competitions, quizcons, conferences, seminars, trivia nights, and
              more. Whatever your event needs, we have the perfect venue for
              you.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Grid>
      <Grid item>
        <Accordion>
          <AccordionSummary
            expandIcon={<StyledExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography fontWeight="bold">
              Are there any restrictions on event times or durations?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              {" "}
              Event times and durations are subject to availability and may vary
              depending on the venue's schedule. We strive to accommodate your
              preferred timing to the best of our ability.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Grid>
      <Grid item>
        <Accordion>
          <AccordionSummary
            expandIcon={<StyledExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography fontWeight="bold">
              Is technical support available if I encounter any issues during
              the reservation process?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              {" "}
              Absolutely! Our dedicated technical support team is here to assist
              you with any questions or concerns you may have. Feel free to
              reach out to us via email for prompt assistance.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Grid>
      <Grid item>
        <Accordion>
          <AccordionSummary
            expandIcon={<StyledExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography fontWeight="bold">
              Can I view photos and specifications of the available venues
              before making a reservation?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              {" "}
              Yes, you can! ICSpaces provides detailed information, including
              photos and specifications, for each available venue. Simply browse
              through our “rooms” tab to find the perfect space for your event.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Grid>
      <Grid item>
        <Accordion>
          <AccordionSummary
            expandIcon={<StyledExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography fontWeight="bold">
              What payment methods are accepted for reservations?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              {" "}
              Physical payment is required. Transactions can be made on or
              before the day of the event. For your convenience, details about
              the fees are stated when you make your reservation. Rest assured,
              we’re working on making payments easier for you!
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Grid>
      <Grid item>
        <Accordion>
          <AccordionSummary
            expandIcon={<StyledExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography fontWeight="bold">
              Is there a limit to the number of attendees I can invite to my
              event?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              {" "}
              The capacity of each venue varies, so be sure to select a space
              that can comfortably accommodate your expected number of
              attendees. If you're unsure, feel free to reach out to us for
              guidance.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Grid>
      <Grid item>
        <Accordion>
          <AccordionSummary
            expandIcon={<StyledExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography fontWeight="bold">
              Are there any additional amenities or services available for my
              event?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              {" "}
              Depending on your needs, ICSpaces offers additional amenities and
              services such as audiovisual equipment (e.g. sound system,
              projector, and screen), personal computers, and the likes.
              Amenities available for each venue are also stated. Simply
              navigate to the “rooms” tab, and select your preferred venue.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Grid>
      <Grid item>
        <Accordion>
          <AccordionSummary
            expandIcon={<StyledExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography fontWeight="bold">
              How far in advance should I make a reservation for my event?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              {" "}
              We recommend making reservations as far in advance as possible to
              secure your preferred date and venue. Popular dates tend to fill
              up quickly, so it's best to plan ahead to avoid disappointment.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Grid>
    </Grid>
  );
};

export default FAQ_Accordion;
