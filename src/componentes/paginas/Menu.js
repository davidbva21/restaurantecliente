import React,{useState,useEffect,useContext} from 'react';
import {Link} from 'react-router-dom';
import Producto from '../ui/Platillo';

import{ FirebaseContext } from  '../../firebase';

const Menu  = () => {
    
    const {firebase} = useContext(FirebaseContext);
    const [productoss,guardarProductos] = useState([]);

    useEffect(()=>{
        const obtenerPlatillos = () =>{
            firebase.db.collection('productos').onSnapshot(manejarSnapshot);
        }
        obtenerPlatillos();
    },[]);
    useEffect(()=>{
        console.log(productoss);
    },[productoss]);
    
    
    function manejarSnapshot(snapshot){
        const prod = snapshot.docs.map(doc =>{
            return{
                id:doc.id,
                ...doc.data()
            }
        });
        guardarProductos(prod);
    }
    

    return (  
        <>
            <h1 className="text-3xl font-light mb-4">MENU</h1>
            <Link to="/nuevo-platillo" className=" bg-blue-800 hover:bg-indigo-700, inline-block mb-5 p-2 text-white uppercase font-bold">Agregar platillo</Link>
            {productoss.map(producto =>(
                    <Producto  key={producto.id}  producto={producto} />
            ))}
        
        </>

    );
}
 
export default Menu;