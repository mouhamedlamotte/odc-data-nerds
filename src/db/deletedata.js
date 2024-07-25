import { db } from "@/config/firebase";
import { kdebug } from "@/constants";
import { deleteDoc, doc } from "firebase/firestore";

export const deleteDocument = async (collectionName, id) => {
    try {
        const docRef = doc(db, collectionName, id);
        await deleteDoc(docRef);
    } catch (error) {
        kdebug(`Error: ${error}`)
    }
} 