"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { useContext } from "react";
import { ModalContext } from "./modal-context";

function Modal() {
    const { show, setShow, title, content } = useContext(ModalContext);

    return (
        <Dialog open={show} onOpenChange={setShow}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div>{content}</div>
            </DialogContent>
        </Dialog>
    );
}

export default Modal;
