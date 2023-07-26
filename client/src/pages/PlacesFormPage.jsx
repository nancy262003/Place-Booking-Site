import { useEffect, useState } from "react";
import Perks from "../Perks";
import PhotosUploader from "../PhotosUploader";
import AccountNav from "../AccountNav";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";

export default function PlacesFormPage(){
    const {id}=useParams();
    const [title,setTitle]=useState('');
    const [address,setAddress]=useState('');
    const [addedPhotos,setAddedPhotos]=useState([]);
    const[description,setDesciption]=useState('');
    const[perks,setPerks]=useState([]);
    const[extraInfo,setExtraInfo]=useState('');
    const [checkIn,setCheckIn]=useState('');
    const [checkOut,setCheckOut]=useState('');
    const [maxGuest,setMaxGuest]=useState(1);
    const [redirect,setRedirect]=useState(false);
    const [price,setPrice]=useState(100);

    useEffect(()=>{
        if(!id){
            return ;
        }
        axios.get('/places/'+id).then(response=>{
            const {data}=response;
            setTitle(data.title);
            setAddress(data.address);
            setAddedPhotos(data.photos);
            setDesciption(data.description);
            setPerks(data.perks);
            setExtraInfo(data.extraInfo);
            setCheckIn(data.checkIn);
            setCheckOut(data.checkOut);
            setMaxGuest(data.maxGuest);
            setPrice(data.price);
        })

    },[id])

    function inputHeader(text){
        return (
            <h2 className="text-2xl mt-4">{text}</h2>
        )
    }

function inputDescription(text){
    return(
        <p className="text-gray-500 text-sm">{text}</p>
    );
}

function preInput(header,description){
    return (
        <>
            {inputHeader(header)}
            {inputDescription(description)}
        </>
    );

}



    
  async  function savePlace(ev){
        ev.preventDefault();
        const placeData={ title,address,
            addedPhotos,description,
            perks,extraInfo,
            checkIn,checkOut,
            maxGuest,price}

        if(id){
            //update
            await axios.put('/places',{id,
                ...placeData
               });
                setRedirect(true);
        
            }
        
        else{
            //new place
            await axios.post('/places',placeData)
                setRedirect(true);
        
            }
        }
        
  
    if(redirect){
        return <Navigate to={'/account/places'} />
    }
    return (
        <div>
         <AccountNav />
            <form onSubmit={savePlace}>

                {preInput('Title','title, for example:My lovely Apartment')}
                <input type="text" value={title} onChange={ev=> setTitle(ev.target.value)} placeholder="title, for example:My lovely Apartment"></input>

                {preInput('Address','Address to this place')}
                <input type="text" value={address} onChange={ev=>setAddress(ev.target.value)} placeholder="address"/>

                {preInput('Photos','More=Better')}
                <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
                
                
                {preInput('Description','Description for your place')}
                <textarea value={description} onChange={ev=>setDesciption(ev.target.value)} className=""/>

                {preInput('Perks','Select all the perks of your place')}
            
                 <div>
                    <div className="grid gap-1 grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mt-2 justify-center">
                    <Perks selected={perks} onChange={setPerks} />
                    </div>

                 </div>
                  

                 {preInput('Extra Info','House rules, etc')}
                <textarea 
                value={extraInfo}  
                onChange={ev=>setExtraInfo(ev.target.value)}/>
                
                {preInput('Check in&out time','Add check in out times, remember to have some time window fr cleaning the room between guests')}
                
            
            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
                <div >
                {preInput('Check in time','')}
                <input 
                value={checkIn} 
                onChange={ev=>setCheckIn(ev.target.value)} 
                type="text"  
                placeholder="14:00"/>
                </div>

                <div>
                {preInput('Check out time','')}
                    <input 
                    value={checkOut} 
                    onChange={ev=>setCheckOut(ev.target.value)} 
                    type="text" 
                    placeholder="11"/>
                </div>

                
                <div>
                {preInput('Max number of guests','')}
                
                    <input  
                    type="number" 
                    value={maxGuest} 
                    onChange={ev=>setMaxGuest(ev.target.value)}/>
                </div>

                <div>
                {preInput('Price per night','')}
                    <input  
                    type="number" 
                    value={price} 
                    onChange={ev=>setPrice(ev.target.value)}/>
                </div>
            </div>
            <div>
                <button className="primary my-4">
                    Save
                </button>
            </div>
            </form>
            </div>

    )
}