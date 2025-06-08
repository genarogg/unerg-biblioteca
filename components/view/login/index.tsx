'use client'
import React from 'react'
import Layout from '@/components/layout/auth'
import FormLoki from '@/components/form-loki'
import "./sass/login.scss"

interface LoginProps {

}

const Login: React.FC<LoginProps> = () => {
    return (
        <Layout where="login">
            <FormLoki />
        </Layout>
    );
}

export default Login;