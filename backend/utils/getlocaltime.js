const getLocalTime = () =>{
    const dateTimeObject = new Date();

    const year = dateTimeObject.getFullYear();
    const month = String(dateTimeObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateTimeObject.getDate()).padStart(2, '0');
    const hours = String(dateTimeObject.getHours()).padStart(2, '0');
    const minutes = String(dateTimeObject.getMinutes()).padStart(2, '0');
    const seconds = String(dateTimeObject.getSeconds()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    console.log(formattedDate)

    return formattedDate
}

export { getLocalTime }