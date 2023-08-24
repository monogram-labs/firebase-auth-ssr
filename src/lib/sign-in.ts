import { signInWithEmailAndPassword, getAuth } from 'firebase/auth'
import { firebaseApp } from './firebase'

const auth = getAuth(firebaseApp)

export function signInAuthorized() {
	return signInWithEmailAndPassword(auth, 'julien@monogram.io', 'aVery!!SecurePassword123')
}

export function signInUnauthorized() {
	return signInWithEmailAndPassword(auth, 'unauthorized@monogram.io', 'un4uthorized!')
}
