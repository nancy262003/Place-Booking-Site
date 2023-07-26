import { useContext, useEffect, useState } from "react"
import {differenceInCalendarDays} from  "date-fns"
import axios from "axios";
import { UserContext } from "./UserContext";
import { Navigate } from "react-router-dom";

export default function BookingWidget({ place }) {
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [numberOfGuest, setNumberOfGuests] = useState(1);
    const [name,setName]=useState('');
    const [phone,setPhone]=useState('');
    const [redirect,setRedirect]=useState('');
  const {user} = useContext(UserContext);

  useEffect(()=>{
if(user){
    setName(user.name);
}
  },[user])

    let numberofNights=-1;
    if(checkIn && checkOut){
        numberofNights=differenceInCalendarDays(new Date(checkOut),new Date(checkIn));
    }

  async  function bookThisPlace(){
        
   const response=  await  axios.post('/bookings',{
        checkIn,checkOut,numberOfGuest,name,
        place:place._id,
        price:numberofNights*place.price,
    });

    const bookingId=response.data._id;
    setRedirect(`/account/bookings/${bookingId}`)
    }

    if(redirect){
        return <Navigate to={redirect} />
    }
    return (
        <div className="bg-white shadow p-4 rounded-2xl">
            <div className="text-2xl text-center">  Price:Rs {place.price}/-per night</div>
            <div className="border  rounded-2xl mt-4">
                <div className="flex">
                    <div className=" py-3 px-4">
                        <label>Check in:</label>
                        <input 
                        type="date" 
                        value={checkIn} 
                        onChange={ev=>setCheckIn(ev.target.value)}/>
                    </div>
                    <div className=" py-3 px-4 border-l">
                        <label>Check out:</label>
                        <input 
                        type="date" 
                        value={checkOut} 
                        onChange={ev=>setCheckOut(ev.target.value)}/>
                    </div>
                </div>
                <div>
                    <div className=" py-3 px-4 border-l">
                        <label>Number of guests:</label>
                        <input 
                        type="number" 
                        value={numberOfGuest} 
                        onChange={ev=>setNumberOfGuests(ev.target.value)}/>
                    </div>
                </div>
                {numberofNights>0 &&(
                    <div className="py-3 px-4 border-t">
                    <label>Your full name:</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={ev=>setName(ev.target.value)}/>

<label>Phone Number:</label>
                    <input 
                        type="tel" 
                        value={phone} 
                        onChange={ev=>setPhone(ev.target.value)}/>
                     </div>
                )}
            </div>

            <button onClick={bookThisPlace} className="primary mt-4"> 
            Book This Place
            {numberofNights>0 &&(
                <span> Rs { numberofNights * place.price}/-</span>
            )}
            </button>
        </div>
    )
}