import { db } from "@/config/firebase";
import { collection, getDocs } from "firebase/firestore"; 

export const getPromos = async () => {
    const querySnapshot = await getDocs(collection(db, "Promos"));
    const Promos = [];
    querySnapshot.forEach((doc) => {
        Promos.push({
            id: doc.id, 
            ...doc.data()
        });
    });
    return Promos;
}

export const getStudents = async (promo_id = null) => {
    const querySnapshot = await getDocs(collection(db, "Students"));
    const students = [];
    querySnapshot.forEach((doc) => {
        if(promo_id){
            if(doc.data().promo_id === promo_id){
                students.push({
                    id: doc.id, 
                    ...doc.data()
                });
            }
        } else {
        
        students.push({
            id: doc.id, 
            ...doc.data()
        });
    }
    });
    return students;
}