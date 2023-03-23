import RegisterAndLoginForm from './RegisterAndLoginForm'
import { useContext } from 'react';
import { UserContext } from './UserContext';

export default function Routes() {
    const {username, id} = useContext(UserContext)

    if (username) {
        return <h1>Logged In! {username}</h1>
    }

    return (
        <RegisterAndLoginForm />
    )
}