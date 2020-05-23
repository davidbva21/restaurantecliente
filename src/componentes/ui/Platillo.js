import React,{useContext,useRef} from 'react';

import {FirebaseContext} from '../../firebase';

const Platillo = ({producto}) => {

    const {firebase} = useContext(FirebaseContext);
    const{nombre,precio,descripcion,imagen,categoria,existencia,id} = producto;
    const existenciaRef = useRef(existencia);





    const actualizarDisponibilidad = () =>{
        const existencia = (existenciaRef.current.value==='true');
        try{
            firebase.db.collection('productos').doc(id).update({
                existencia
            })
        }catch(error){
            console.log(error);
        }

    }
    return (  
        <div className="w-full px-3 mb-4">
            <div className="p-5 shadow-md bg-white">
                <div className="lg:flex">
                    <div className="lg:w-5/12 xl:w-3/12 ">
                        <img src={imagen} alt="Imagen platillo" />
                        <div className="sm:flex sm:-mx-2">
                            <label className="block mt-3 sm:w-2/4 pl-2" >
                                <span className="block">Existencias</span>
                                <select value={existencia}
                                    ref={existenciaRef}
                                    onChange={()=>actualizarDisponibilidad()}
                                     className="bg-white shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
                                    <option value="true">Disponible</option>
                                    <option value="false"> No disponible</option>
                                </select>
                            </label>
                        </div>
                    </div>
                    <div className="lg:w-7/12 pl-5">
                        <p className="font-bold text-2xl text-yellow-600 mb-5"> {nombre}</p>
                        <p className="text-gray-600 mb-4">Categoría:{'  '} 
                            <span className="text-gray-700 font-bold uppercase">
                                {categoria}
                            </span>
                         </p>
                         <p className="text-gray-600 mb-4">
                                {descripcion}
                         </p>
                         <p className="text-gray-600 mb-4">Precio:{'  '} 
                            <span className="text-gray-700 font-bold uppercase">
                                 ${precio}
                            </span>
                         </p>
                    </div>
                </div>
          
            </div>

           
        
        </div>
    );
}
 
export default Platillo;