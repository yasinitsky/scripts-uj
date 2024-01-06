import { useState } from "react";
import user from "../services/user";

export default function RegisterForm() {
    let [registerError, setRegisterError] = useState<string>('');
    let [registerSuccess, setRegisterSuccess] = useState<boolean>(false);

    const onSubmit = (e: any) => {
        setRegisterError('');
        setRegisterSuccess(false);

        user.create(e.target[0].value, e.target[1].value).then(() => {
            setRegisterSuccess(true);
        }).catch((error) => {
            setRegisterError(error.response.data.errors[0]);
        })

        e.preventDefault();
    }

    return (
        <div className="container px-4 px-lg-5 my-5 d-flex align-items-center flex-column">
            {registerError && <div className="alert alert-danger w-50">{registerError}</div> }
            {registerSuccess && <div className="alert alert-success w-50">Account successfully created</div> }
            <form className="w-50 center justify-content-center" onSubmit={onSubmit}>
                <div className="form-group mb-3">
                    <label htmlFor="usernameInput">Username</label>
                    <input type="text" className="form-control" id="usernameInput" aria-describedby="emailHelp" placeholder="Enter username" />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="passwordInput">Password</label>
                    <input type="password" className="form-control" id="passwordInput" placeholder="Password" />
                </div>
                <button className="btn btn-primary right" type="submit">Sign Up</button>
            </form>
        </div>
    );
}