import React from 'react'
import Header from "./header"
import Footer from '../Footer'
import "../sass/layout.scss"

import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';

import { Spinner } from '@/components/ui';
import { useAuth } from '@context/AuthContext';



interface LayoutProps {
    children: React.ReactNode;
    where?: string;
    header?: React.ReactNode;
    footer?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({
    children,
    where = "",
    header,
    footer
}) => {


    const { state: { loading } } = useAuth();

    return (
        <div className={`containerAll clean ${where}`}>
            {loading ? (
                <Spinner />
            ) : (
                <>
                    {header ? header : <Header />}
                    <main>
                        {children}
                    </main>
                    {footer ? footer : <Footer />}
                    <ToastContainer />
                </>
            )}
        </div>
    );
}

export default Layout;