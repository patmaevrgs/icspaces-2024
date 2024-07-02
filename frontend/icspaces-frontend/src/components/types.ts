export interface TransactionDetails {
  transactionId: string;
  date: string;
  status: string;
  comment: string;
}

export interface Reservation {
  id: string;
  date: string;
  time: string;
  eventName: string;
  room: string;
  status: string;
  transactionDetails: TransactionDetails;
}


export interface ReservationDataForModal {

  // reservation id
  reservation_id: string;

  // status for pending, for verification, etc
  status: string;

  // first partition in left
  reservation_date: string;       // accessible
  room_name: string;              // accessible
  event_name: string;             // accessible
  event_description: string;      // none
  user_name: string;              // accessible
  user_id: string;                // accessible


  // for the module in the date part
  reserve_day_day_string: string; // accessible
  reserve_day_number: string;     // accessible
  reserve_month: string;          // accessible
  reserve_year: string;           // accessible
  reserve_timeslot: string;       // accessible


  // transaction details
  duration: string;               // accessible
  hourly_fee: string;             // none
  overall_fee: string;            // accessible


  // dates
  verified_date: string;          // resolving
  payment_date:  string;          // resolving
  verification_date:  string;     // resolving
  disapproved_date:  string;      // resolving
  approved_date:  string;         // resolving
  cancellation_date: string       // resolving
  
  // note
  note_from_admin: string;        // resolving

  utilities: string;
};

export interface usersAdmin{
  id: string;
  name: string;
  creationDate: string;
  email: string;
  lastlogin: string;
  role: string;
  numRoomReservations: number
}

export interface Users{
  fname:string;
  lname:string;
  usertype:number;
  profilePicUrl:string;
  email:string;
  college:string;
  department:string;
  course:string;
  student_number:string;
  // add other fields as needed
}