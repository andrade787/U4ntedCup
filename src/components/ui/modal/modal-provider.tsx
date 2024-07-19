"use client";
import { ModalContext } from "./modal-context";
import { useState } from "react";

function ModalProvider({ children }: { children: React.ReactNode }) {
    const [show, setShow] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<React.ReactNode>(null);

    const setModalContent = (newTitle: string, newContent: React.ReactNode) => {
        setTitle(newTitle);
        setContent(newContent);
        setShow(true);
    };

    return (
        <ModalContext.Provider value={{ show, title, content, setShow, setModalContent }}>
            {children}
        </ModalContext.Provider>
    );
}

export default ModalProvider;
