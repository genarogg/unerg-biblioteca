'use client'
import React from 'react'
// import { SimpleLayout } from '@/components/layout'
import Layout from '@/components/layout/auth'
import UserManagementTable from "@/components/tablet-usuarios";

interface usuariosProps {

}

const usuarios: React.FC<usuariosProps> = () => {
    return (
        <Layout where="usuarios">
            <UserManagementTable />
        </Layout>
    );
}

export default usuarios;
