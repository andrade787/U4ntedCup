"use client";

import { createContext } from "react";

interface ModalContextType {
    show: boolean;
    title: string;
    content: React.ReactNode;
    setShow: (value: boolean) => void;
    setModalContent: (title: string, content: React.ReactNode) => void;
}

export const ModalContext = createContext<ModalContextType>({
    show: false,
    title: "",
    content: null,
    setShow: () => { },
    setModalContent: () => { },
});
