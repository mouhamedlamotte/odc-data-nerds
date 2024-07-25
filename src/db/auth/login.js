import { auth, gihubProvider, googleProvider } from '@/config/firebase';
import { kdebug } from '@/constants'
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import React from 'react'

export const LoginWithEmailAndPassword  = async (user) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, user.email, user.password)
        if (userCredential) {
            return userCredential
        } else {
            kdebug(`User not found`)
            return null
        }
    } catch (error) {
        kdebug(`Error: ${error}`)
    }
}


export const LoginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        if (result) {
            const user = result.user
            return user

        } else {
            return null
        }
    } catch (error) {
        kdebug(`Error: ${error}`)
    }
}

export const LoginWithGithub = async () => {
    try {
        signInWithPopup(auth, gihubProvider)
        .then((result) => {
        });
        if (result) {
            const user = result.user
            return user
        } else {
            return null
        }
    } catch (error) {
        kdebug(`Error: ${error}`)
    }
}
