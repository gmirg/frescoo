import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { today } from "../helpers/today";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Close } from "../helpers/Close";

export const AddFood = () => {
    const [food, setFood] = useState([])
    const { name } = useParams();
    const [added2Fridge, setAdded2Fridge] = useState(today);
    const [expires, setExpires] = useState();
    const [open, setOpen] = useState("No")
    const [idMongo, setIdMongo] = useState();
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            const data = await fetch(`http://127.0.0.1:5000/food/${name}`);
            const json = await data.json();
            setFood(json)
        }
        fetchData()
            // make sure to catch any error
            .catch(console.error);
    }, [])
    useEffect(() => {
        if (open === "Yes") {
            let calcExpiredIfOpen = Date.parse(added2Fridge) + (food.lasts_oc * (3600 * 1000 * 24))
            let expiresDateIfOpen = new Date(calcExpiredIfOpen).toLocaleDateString()
            setExpires(expiresDateIfOpen)
        } else {
            let calcExpired = Date.parse(added2Fridge) + (food.lasts * (3600 * 1000 * 24))
            let expiresDate = new Date(calcExpired).toLocaleDateString()
            setExpires(expiresDate);
        }
    }, [food, added2Fridge, open])
    const addtoFridge = async (e) => {
        e.preventDefault();
        let dateOnFridge = new Date(e.target.onFridge.value).toLocaleDateString()
        let data = {
            Name: food.Name,
            img_food : food.img_food,
            food_category: food.food_category,
            qty: e.target.quantity.value,
            value: food.value,
            onFridge: dateOnFridge,
            opened_cooked: e.target.oc.value,
            Notes: e.target.message.value,
            expires_on: expires
        }
        console.log(data)
        // await fetch('http://127.0.0.1:5000/add', {
        //     method: 'POST',
        //     body: JSON.stringify(data),
        //     mode: "cors",
        //     headers: {
        //         "Access-Control-Allow-Origin": "*",
        //         "Content-type": "application/json",
        //     }
        // })
        // .then(res => res.json())
        // .then(json => {
        //     setIdMongo(json.id);
        // });
        // console.log(idMongo);
        await fetch('http://127.0.0.1:5000/add', {
            method: 'POST',
            body: JSON.stringify(data),
            mode: "cors",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-type": "application/json",
            }
        })
        .then((res) => {
            if (!res.ok) {
                throw new Error(`HTTP error: ${res.status}`);
            }
            return res.json()
        })
        .then( data => {
            if (data) {
                setIdMongo(data.id)
            }
        })
        .catch((error) => {
            console.error(`Could not get products: ${error}`);
          })
        ;
        console.log(idMongo)
        let id = idMongo;
        let food2fridge = {
            id_food : id,
            fk_id_user: localStorage.getItem('user')
        }
        await fetch('http://127.0.0.1:5000/food2fridge', {
            method: 'POST',
            body: JSON.stringify(food2fridge),
            mode: "cors",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-type": "application/json",
            }
         })
        .then(res => res.json())
        .then(json => console.log(json)
        );
    }
const handleChange = (e) => {
    setOpen(e.target.value)
}
return (
    <div>
        <Close/>
        <div className="form-header">
            <div className="name-block">
                <h1>{food.Name}</h1>
                <h2>{food.food_category}</h2>
            </div>
            <div className="image-block">
                <img className="thumb" src={"." + food.img_food} width="96" alt="" />
            </div>
        </div>
        <div className='form-container'>
            <form onSubmit={addtoFridge}>
                <div>
                    <label>Quantity</label>
                    <input type="number" step="0.01" name="quantity" required />
                </div>
                <div>
                    <label>On fridge</label>
                    <input type="date"
                        name="onFridge"
                        defaultValue={added2Fridge}
                        onChange={e => setAdded2Fridge(e.target.value)}
                        required />
                </div>
                <div>

                    <label>Opened / cooked</label>
                    <div className="radio">
                        <input type="radio"
                            id="Yes"
                            name="oc"
                            value="Yes"
                            checked={open === "Yes"}
                            onChange={handleChange}
                            required />
                        <label htmlFor="Yes">Yes</label>
                        <input type="radio"
                            id="No"
                            name="oc"
                            value="No"
                            checked={open === "No"}
                            onChange={handleChange}
                            required />
                        <label htmlFor="No">No</label>
                    </div>
                </div>
                <div>
                    <label>Notes</label>
                    <textarea name="message" />
                </div>
                <img className="logo-center" src="http://localhost:3000/frescoo.png" width="96" alt="" />
                {food.lasts && food.lasts_oc ? (
                    <div className="expiration">
                        <span className="fresco">frescoo until: </span><span className="exdate">{expires}</span>
                    </div>
                ) : ""}
                <input type="submit" value="Add food" />
            </form>
        </div>


    </div>
)
}
