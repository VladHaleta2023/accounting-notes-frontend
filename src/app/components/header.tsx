'use client';

import React, { useEffect, useState } from "react";
import showAlert from "@/app/utils/alert";
import api from "@/app/utils/api";
import { updateRole } from "@/app/scripts/utils";
import { AxiosError } from "axios"; 
import Message from "@/app/components/message";
import { useRouter } from "next/navigation";
import { TypeCategory } from "@/app/types/TypeCategory";
import { ApiCategory } from "@/app/api/ApiCategory";
import Dropdown from "@/app/components/dropdown";
import "@/app/styles/globals.css";
import "@/app/styles/header.css";

export default function Header() {
    const router = useRouter();

    const [messageVisible, setMessageVisible] = useState(false);
    const [isAdminOn, setIsAdminOn] = useState<boolean>(false);
    const [categories, setCategories] = useState<TypeCategory[]>([]);

    const fetchCategories = async () => {
        try {
            setCategories(await ApiCategory.fetchCategories());
        }
        catch (err) {
            showAlert(500, `Server error: ${err}`);
        }
    }

    useEffect(() => {
        const role = updateRole();
        setIsAdminOn(role);
        fetchCategories();
    }, []);
    
    const logoutAdmin = async () => {
        try {
            const res = await api.post("/users/admin/logout");
            sessionStorage.setItem("adminStatus", "false");

            const message = res.data.message[0];
            if (res.data.statusCode === 200) {
                showAlert(res.data.statusCode, message);
            } else {
                showAlert(res.data.statusCode, message);
            }
        } catch (error) {
            const err = error as AxiosError<{ message?: string | string[] }>;

            if (err.response) {
                const status = err.response.status;
                const message = err.response.data?.message?.[0] || "Unknown error";
                showAlert(status, message);
            } else if (err.request) {
                showAlert(500, "No response from server");
            } else {
                showAlert(500, "Request setup error");
            }
        }
        finally {
            setIsAdminOn(updateRole());
        }
    }

    const toggleAdmin = async () => {
        if (isAdminOn) {
            setMessageVisible(true);
        }
        else {
            router.push("/admin")
        }
    };

    return (<>
        <Message
            visible={messageVisible}
            setVisible={setMessageVisible}
            message={"Czy na pewno chcesz wyłączyć tryb Admina?"}
            textConfirm={"Tak"}
            textCancel={"Nie"}
            onConfirm={async () => { await logoutAdmin() }}
        />
        <header className="header">
            <Dropdown categories={categories} />
            <span style={{fontSize: "26px", marginLeft: "14px"}}>ANotatki</span>
            <button className="btnHeader" onClick={toggleAdmin}>
                Admin: {isAdminOn ? "on" : "off"}
            </button>
        </header>
    </>);
}