import { useContext, useState } from "react"
import session from "../services/session";

export default function LoginForm() {
    let [loginError, setLoginError] = useState<string>('');

    const onSubmit = (e: any) => {
        setLoginError('');

        session.create(e.target[0].value, e.target[1].value).then(() => {
            document.location = '/';
        }).catch((error) => {
            setLoginError(JSON.parse(error.response.data).errors[0]);
        });

        e.preventDefault();
    }

    return (
        <div className="container px-4 px-lg-5 my-5 d-flex align-items-center flex-column">
            {loginError && <div className="alert alert-danger w-50">{loginError}</div>} 
            <form className="w-50 center justify-content-center" onSubmit={onSubmit}>
                <div className="form-group mb-3">
                    <label htmlFor="usernameInput">Username</label>
                    <input type="text" className="form-control" id="usernameInput" aria-describedby="emailHelp" placeholder="Enter username" />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="passwordInput">Password</label>
                    <input type="password" className="form-control" id="passwordInput" placeholder="Password" />
                </div>
                <button className="btn btn-primary right" type="submit">Sign In</button>
            </form>
        </div>
    );
}