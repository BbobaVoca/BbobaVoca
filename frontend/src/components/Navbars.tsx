import React from "react";
import { Button, Navbar } from "flowbite-react";

function Navbars() {

    return (
        <Navbar border fluid className="fixed left-0 right-0 top-0 z-50">
        <Navbar.Brand href="/">
            <img
            alt="Logo"
            className="ml-20 mr-2 h-6 sm:h-9"
            src=""
            />
            <span className="self-center whitespace-nowrap font-seoleim text-xl dark:text-white">
            뽑아보카
            </span>
        </Navbar.Brand>
        </Navbar>
    );
}

export default Navbars;