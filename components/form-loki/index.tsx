"use client";

import React, { useState } from 'react'
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v4";
import { RECAPTCHA_KEY } from "@env";

import ResetPassWord from './faces/ResetPassWord';
import Login from './faces/Login';
import Register from './faces/Register';

import "./faces/sass/_styleGeneral.scss"

interface LokiLoginProps {
    register?: boolean;
    reset?: boolean;
    social?: boolean;
}

const LokiLogin: React.FC<LokiLoginProps> = ({
    register = true,
    reset = true,
    social = false,
}) => {
    const [formState, setFormState] = useState("initial");

    const cardState = (css: string) => {
        setFormState(css);
    };

    return (
        <div className={`container-form-loki ${formState}`} id='containerFormLoki'>
            <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_KEY}>
                {reset && <ResetPassWord cardState={cardState} />}
                <Login
                    cardState={cardState}
                    register={register}
                    reset={reset}
                    social={social}
                />
                {register && <Register cardState={cardState} social={social} />}
            </GoogleReCaptchaProvider>
        </div>
    );
}

export default LokiLogin;