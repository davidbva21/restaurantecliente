import React,{useContext,useState} from 'react';
import { useFormik, yupToFormErrors } from 'formik';
import * as Yup from 'yup';
import {useNavigate} from 'react-router-dom';

import {FirebaseContext} from '../../firebase';

import FileUploader from 'react-firebase-file-uploader';


const NuevoPlatillo  = () => {

    const {firebase} = useContext(FirebaseContext);

    const navigate = useNavigate();

    const [subiendo,guardarSubiendo]= useState(false);
    const [progreso,guardarProgreso] = useState(0);
    const [url,guardarUrlImagen] = useState('');

    const formik = useFormik({
        initialValues:{
            nombre:'',
            precio:'',
            categoria:'',
            imagen:'',
            descripcion:''
        },
        validationSchema: Yup.object({
            nombre : Yup.string().min(3,'Los platillos deben de tener al menos 3 caracteres')
                                .required('El nombre del platillo es obligatorio'),
            precio : Yup.number().min(1,'el precio debe ser mayor a 0')
                                .required('El precio del platillo es obligatorio'),
            categoria : Yup.string().required('La categoria del platillo es obligatorio'),
            descripcion : Yup.string().min(20,'La descripción debe ser mas larga')
                                .required('La descripción del platillo es obligatoria')
        }),
        onSubmit:platillo =>{
            try{
                platillo.imagen = url;
                platillo.existencia = true;
                firebase.db.collection('productos').add(platillo);

                navigate('/menu');
            }catch(error){

            }
        }
    });

    const handleUploadStart = () =>{
        guardarProgreso(0);
        guardarSubiendo(true);

    }

    const handleUploadSuccess = async (nombre) =>{
        guardarProgreso(100);
        guardarSubiendo(false);
        const url = await firebase.storage.ref("productos").child(nombre).getDownloadURL();
        guardarUrlImagen(url);
    }

    const handleUploadError = (error) =>{
        guardarSubiendo(false);
        console.log(error);
    }

    const handleProgress = (progreso) =>{
        guardarProgreso(progreso);

    }



    return (  
        <>
            <h1 className="text-3xl font-light mb-4">Agregar platillo</h1>

            <div className="flex justify-center mt-10">
                <div className="w-full max-w-3xl ">
                    <form onSubmit={formik.handleSubmit}> 
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre"  >Nombre</label>
                            <input id="nombre"
                                    value={formik.values.nombre}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    type="text" 
                                    placeholder="Nombre platillo" 
                                    className="shadow appearance-none border rounded w-full py-2 py-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></input>
                        </div>
                        {formik.touched.nombre && formik.errors.nombre?
                            (
                                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5 " role="alert">
                                    <p>{formik.errors.nombre}</p>
                                </div>
                            )
                            :null}

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="precio"  >Precio</label>
                            <input   onBlur={formik.handleBlur}
                                    value={formik.values.precio}
                                    onChange={formik.handleChange}
                                    id="precio" type="number" placeholder="100" min="0" className="shadow appearance-none border rounded w-full py-2 py-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></input>
                        </div>
                        {formik.touched.precio && formik.errors.precio?
                            (
                                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5 " role="alert">
                                    <p>{formik.errors.precio}</p>
                                </div>
                            )
                            :null}

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="categoria"  >Categoria</label>
                            <select  onBlur={formik.handleBlur}
                                value={formik.values.categoria}
                                onChange={formik.handleChange}
                                id="categoria" name="categoria" className="shadow appearance-none border rounded w-full py-2 py-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                <option value ="">--Seleccione--</option>
                                <option value ="desayuno">Desayuno</option>
                                <option value ="comida">Comida</option>
                                <option value ="cena">Cena</option>
                                <option value ="bebida">Bebida</option>
                                <option value ="postre">Postre</option>
                                <option value ="ensalada">Ensalada</option>

                            </select>
                        </div>

                        {formik.touched.categoria && formik.errors.categoria?
                            (
                                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5 " role="alert">
                                    <p>{formik.errors.categoria}</p>
                                </div>
                            )
                            :null}

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="imagen"  >Imagen</label>
                            <FileUploader
                                accept='image/*'
                                id='imagen'
                                name='imagen'
                                randomizeFilename
                                storageRef={firebase.storage.ref("productos")}
                                onUploadStart={handleUploadStart}
                                onUploadError={handleUploadError}
                                onUploadSuccess={handleUploadSuccess}
                                onProgress={handleProgress}
                            />

                        </div>
                        {subiendo && (
                            <div className="h-12 relative w-full border">
                                <div className="bg-green-500 absolute left-0 top-0 text-white 
                                        px-2 text-sm h-12 flex items-center" style={{width:`${progreso}%`}}>
                                         {progreso} %
                                </div>
                            </div>)
                        }
                        {url &&(
                            <p className="bg-green-500 text-white p-3 text-center my-5">
                                La imagen se subió correctamente
                            </p>
                        )}

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2 " htmlFor="descripcion"  >Descripción</label>
                            <textarea  onBlur={formik.handleBlur}  value={formik.values.descripcion}
                                    onChange={formik.handleChange} 
                                    id="descripcion" placeholder="Descripción del platillo" className="h-40 shadow appearance-none border rounded w-full py-2 py-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
                        </div>
                        {formik.touched.descripcion && formik.errors.descripcion?
                            (
                                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5 " role="alert">
                                    <p>{formik.errors.descripcion}</p>
                                </div>
                            )
                            :null}

                        <input value="Agregar platillo" type="submit" className="bg-gray-800 hover:bg-gray-900 w-full mt-5 p-2 text-white uppercase font-bold" />
                    </form>
                    

                </div>

            </div>
        </>

    );
}
 
export default NuevoPlatillo;