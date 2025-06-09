'use client';

import React, { useState } from "react";
import "../styles/formTable.css";
import showAlert from "@/app/utils/alert";
import api from "@/app/utils/api";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import Header from "@/app/components/header";

export default function AdminPage() {
    const router = useRouter();
    const [password, setPassword] = useState<string>("");

    async function onConfirm() {
        try {
            const res = await api.post("/users/admin/login", {
                username: "admin",
                password: password,
            });

            const message = res.data.message?.[0] || "OK";
            showAlert(res.data.statusCode, message);
            sessionStorage.setItem("adminStatus", "true");
            router.push("/");
            return true;
        } catch (error) {
            const err = error as AxiosError<{ message?: string | string[] }>;
            const status = err.response?.status || 500;
            const message =
                (err.response?.data?.message?.[0] as string) || "Unknown error";
            showAlert(status, message);
            sessionStorage.setItem("adminStatus", "false");
            return false;
        }
    }

    function onCancel() {
        router.push("/");
    }

    return (
        <>
            <Header />
            <main>
                <div className="form">
                    <div className="formTable no-select">
                        <label htmlFor="username">Użytkownik</label>
                        <input id="username" name="username" type="text" value="admin" autoComplete="username" readOnly />
                        <br />
                        <label htmlFor="password">Hasło</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Wprowadź Hasło Admina"
                        />
                        <div
                            className="btnsSwitchPopUp"
                            style={{
                                marginTop: "20px"
                            }}>
                            <button
                                style={{
                                    width: "200px",
                                    maxWidth: "200px"
                                }}
                                className="btnSwicthPopUp confirm"
                                onClick={onConfirm}>Potwierdź</button>
                            <button
                                style={{
                                    width: "200px",
                                    maxWidth: "200px",
                                }}
                                className="btnSwicthPopUp cancel-on-white"
                                onClick={onCancel}>Anuluj</button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}