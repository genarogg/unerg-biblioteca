import React from "react";
import "./sass/footer.scss"
interface FooterProps {
    children?: React.ReactNode;
}

const Footer: React.FC<FooterProps> = () => {

    return (
        <footer className="footer-container">
            <div className="desktop-footer">
                <p><strong>Genarogg | Desarrollado por Genarogg</strong></p>
            </div>
        </footer>
    );
};

export default Footer;
