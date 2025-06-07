'use client'
import React from 'react'
import Layout from '@components/layout'
import FormLoki from '@components/form-loki'

interface loginProps {

}

const login: React.FC<loginProps> = () => {
    return (
        <Layout where="login">
            <FormLoki/>
        </Layout>
    );
}

export default login;