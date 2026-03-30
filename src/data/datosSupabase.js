import { useState, useEffect } from "react";
import supabase from "../supabase";
import listaHuespedes from "../components/FormularioHuesped";

export default function ObtenerHuespedes(){
    //const [listaHuespedes, setListaHuespedes] = useState([]);

    /*useEffect(() => {
        fetchHuespedes();
    }, []);

    const fetchHuespedes = async () => {
        const { data, error } = await supabase
        .from('huesped')
        .select("*")

        if(error){
            console.log('Error: ', error)
        }else{
            setListaHuespedes([data, ...listaHuespedes]);
            console.log(data);
        }


    }*/
}