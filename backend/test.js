let query = "/get-all-reservations-by-user"
let url = `http://localhost:3001/${query}`

let options = {
    method: 'POST',
    headers: {
        "Content-Type": "application/json"
    },
    //enter fields here
    body: JSON.stringify({
        
        email: 'user@example.com',
        student_number: '202402120',
        org: 'COSS',
        course: 'BSCS',
        college: 'CHE',
        department: 'IHNF'
    })
}

fetch(url, options)
.then(response => response.json())
.then(data => {

    console.log(data); // Handle the response data
    
})
.catch(error => {
    console.error('Error:', error); // Handle errors
});


const t = {
    "reservation_id": 1,
    "user_id": "ajsantiago@up.edu.ph" ,
    "comment_text": "This is a comment."
}