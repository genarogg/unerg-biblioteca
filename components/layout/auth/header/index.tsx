import React from "react";
import "../../sass/header.scss";

import { BtnFreya } from "@/components/ui";

import Title from "./Title";
import SideBar from "./sidebar";

import Nav from "@/components/layout/nav/Nav";
import { useAuth } from "@context/AuthContext";

interface HeaderProps {
    children?: React.ReactNode;
    where?: string;
}

const Header: React.FC<HeaderProps> = () => {

    const { state: { isAuthenticated } } = useAuth();

    const btnRemove = () => {
        console.log("btnRemove");
        const btn = document.getElementById("btn-hamburguer-loki");
        btn?.classList.remove("active");
    }

    const toggleAside = () => {
        const container = document.getElementById("container-aside");
        container?.classList.toggle("sidebar-header");
    }

    const menuItems = [
        { href: "/", label: "Inicio" },
    ];

    if (isAuthenticated) {
        menuItems.push(
            { href: "/dashboard", label: "Dashboard" },
            { href: "/profile", label: "Perfil" },
            { href: "/", label: "Salir" }
        );
    }
    else{
        menuItems.push(
            { href: "/login", label: "login" }
        );
    }



    return (
        <header className="header-container">
            <div className="desktop-header">
                <Title />
                <Nav menuItems={menuItems} />
            </div>

            <div className="movile-header">
                <nav>
                    <ul className="elements">
                        <li>
                            <BtnFreya onClick={() => { toggleAside() }} />
                        </li>
                        <li>
                            <Title />
                        </li>
                    </ul>
                    <SideBar
                        logoutfn={() => { btnRemove(); toggleAside(); }}
                    >
                        <Nav
                            menuItems={menuItems}
                            onClick={() => { btnRemove(); toggleAside(); }}
                        />
                    </SideBar>
                </nav>
            </div>

        </header>
    );
};

export default Header;
