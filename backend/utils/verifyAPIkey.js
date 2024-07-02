import dotenv from "dotenv"
dotenv.config()

const verifyAPIkey = (api_key) => {
    if (api_key == process.env.VERIFY){
        return true
    }else{
        return false
    }
}