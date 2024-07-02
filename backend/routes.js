import { generateURL, checkIfLoggedIn, callbackHandler, getProfileData, logout, setUserInfoFirstLogin } from "./auth-controller.js"


import { searchHandler, getAllRooms, getAllRoomsAndUtilities, insertRoom, setRoomClassSchedule, setEditedRoom, addUtility, deleteUtility, getRoomInfo, searchRoomById, getAllRoomFilters, getRoomName, processUtilities, addNewRoom, getAllRoomsAndUtilitiesComplete, deleteRoom, getAllArchivedRoomsAndUtilities } from "./room-controller.js"
import { getAllStudents, getAllUsers, changeUserType, updateStudentDetails, updateFacultyDetails, getAllFaculty, getUserfromReservation, getUserInformation, getEmail, getStudentDetails, getFacultyDetails, setFacultyToAdmin, getLastLoggedInDate, setUsersToStudent, setNewUserStatus } from "./user-controller.js"
import { 
    getReservationIdByEventName, getAdminCommentByID,getNewAccounts, getTotalRequest, getPendingRequest, getTotalAccounts, getPending, getPaid, getReservationByRoom, 
    getAllReservationsByUser, getReservation, getReservationByName, getReservationByStatus, addReservation, setAsApproved, setAsCancelled,  setAsDisapproved, 
    setAsPaid, addComment, getAllReservations, getTotalRoomReservations, getReservationSortedOldest, getReservationSortedNewest, getAllReservationsbyRoom, getAvailableRoomTime,
    getAllReservationsWithDummyData, getAllReservationsbyRoomAndStatus,
    getReservationTimeline, editReservation, getRevenueReport, getRevenuebyRoomAndStatus
} from "./reservation-controller.js"
import {addGuestReservation,trackGuestReservation, setGuestAsApproved, setGuestAsPaid, setGuestAsDisapproved, setGuestAsCancelled} from "./guest-controller.js"
import { getRoomImage, uploadRoomImage, deleteRoomImage, uploadReservationDocument, getReservationDocument, deleteReservationDocument} from "./file-controller.js"

//utilities
import { sendEmail } from "./utils/email-sender.js"
import { upload, multerVerify } from "./utils/multer-util.js"
import { getSystemLogs, addReservationStatusChangeNotification, addUserStatusChangeNotification, addReservationCommentNotification, getNotificationsForUser } from "./notifications-controller.js"


const setUpRoutes = (app) => {
    // app.<METHOD>("/<ROUTE>", <FUNCTION>)
    app.get('/', (req, res) => { res.send("API Home") });

    //auth
    app.post('/auth/google', generateURL)
    app.get('/auth/google/callback', callbackHandler)
    app.get('/get-profile', getProfileData)
    app.get('/logout', logout)
    app.get('/is-logged-in', checkIfLoggedIn)
    app.post('/set-uinfo-firstlogin', setUserInfoFirstLogin)
    
    //users
    app.post('/get-all-users', getAllUsers)
    app.post('/get-all-students', getAllStudents)
    app.post('/get-all-faculty', getAllFaculty)
    app.post('/change-user-type', changeUserType)
    app.post('/update-student-details', updateStudentDetails)
    app.post('/update-faculty-details', updateFacultyDetails)
    app.post('/get-user-from-reservation', getUserfromReservation)
    app.post('/get-user-information', getUserInformation)
    app.post('/get-email-of-user', getEmail)
    app.post('/get-student-details', getStudentDetails)
    app.post('/get-faculty-details', getFacultyDetails)
    app.post('/set-faculty-to-admin',setFacultyToAdmin)
    app.post('/get-last-login-date', getLastLoggedInDate)
    app.post('/set-users-to-student', setUsersToStudent)
    app.post('/set-new-user-status', setNewUserStatus)

    //rooms
    app.post('/get-room-info', getRoomInfo)
    app.post('/delete-room', deleteRoom)
    app.post('/search', searchHandler)
    app.post('/insert-room', insertRoom)
    app.post('/get-all-rooms',getAllRoomsAndUtilities)
    app.post('/get-all-rooms-complete',getAllRoomsAndUtilitiesComplete)
    app.post('/set-class-schedule', setRoomClassSchedule)
    app.post('/edit-room-information', setEditedRoom) 
    app.post('/add-utility', addUtility)
    app.post('/delete-utility', deleteUtility)
    app.post('/get-room', searchRoomById)
    app.post('/get-all-room-filters',getAllRoomFilters)
    app.post('/get-room-name', getRoomName)
    app.post('/set-utilities', processUtilities)
    app.post('/add-new-room', addNewRoom)
    app.post('/get-all-rooms-archived', getAllArchivedRoomsAndUtilities)

    //reservations
    app.post('/get-all-reservations-by-user', getAllReservationsByUser)
    app.post('/get-reservation', getReservation)
    app.post('/get-reservation-by-name', getReservationByName)
    app.post('/get-reservation-by-status', getReservationByStatus)
    app.post('/add-reservation', addReservation)
    app.post('/get-reservation-by-room', getReservationByRoom)
    app.post('/set-as-approved', setAsApproved)
    app.post('/set-as-disapproved', setAsDisapproved)
    app.post('/set-as-cancelled', setAsCancelled)
    app.post('/set-as-paid', setAsPaid)
    app.post('/add-comment', addComment)
    app.post('/get-total-reservations', getTotalRoomReservations)
    app.post('/get-all-reservation', getAllReservations)
    app.post('/get-all-reservations-sort-oldest', getReservationSortedOldest)
    app.post('/get-all-reservations-sort-latest', getReservationSortedNewest)
    app.post('/get-all-reservations-by-room', getAllReservationsbyRoom)
    app.post('/get-all-reservations-by-room-and-status', getAllReservationsbyRoomAndStatus)
    app.post('/get-revenue-by-room-and-status', getRevenuebyRoomAndStatus)
    app.post('/get-available-room-time', getAvailableRoomTime)
    app.post('/get-reservation-id-by-name', getReservationIdByEventName)
    app.post('/get-admin-comment-by-id', getAdminCommentByID)
    app.post('/get-all-reservations-with-dummy-data', getAllReservationsWithDummyData)
    app.post('/get-reservation-timeline', getReservationTimeline)
    app.post('/edit-reservation', editReservation)
    app.post('/get-revenue-report', getRevenueReport)

    // getTotalRequest, getPendingRequest, getTotalAccounts, getPending, getPaid, getNewAccounts
    app.post('/get-total-request', getTotalRequest)
    app.post('/get-pending-request', getPendingRequest)
    app.post('/get-total-accounts', getTotalAccounts)
    app.post('/get-pending', getPending)
    app.post('/get-paid', getPaid)
    app.post('/get-new-accounts', getNewAccounts)

    //guests
    app.post('/track-guest-reservation', trackGuestReservation)
    app.post('/add-guest-reservation', addGuestReservation)
    app.post('/set-guest-reservation-approved', setGuestAsApproved)
    app.post('/set-guest-reservation-paid', setGuestAsPaid)
    app.post('/set-guest-reservation-cancelled', setGuestAsCancelled)
    app.post('/set-guest-reservation-disapproved', setGuestAsDisapproved)
    //files
    // room images
    app.post('/upload-room-image', upload.single('image'), multerVerify, uploadRoomImage)
    app.post('/get-room-image', getRoomImage)
    app.post('/delete-room-image', deleteRoomImage)
    // documents
    app.post('/upload-reservation-document', upload.single('document'), multerVerify, uploadReservationDocument) // type: payment or letter
    app.post('/get-reservation-document', getReservationDocument)
    app.post('/delete-reservation-document', deleteReservationDocument)

    //email testing
    app.post('/send-email', sendEmail)
    
    //notifications
    app.post('/add-reservation-status-change-notification', addReservationStatusChangeNotification)
    app.post('/add-user-status-change-notification', addUserStatusChangeNotification)
    app.post('/add-reservation-comment-notification', addReservationCommentNotification)
    app.post('/get-notifications-for-user', getNotificationsForUser)
    app.post('/get-system-logs', getSystemLogs)
}

export default setUpRoutes;
