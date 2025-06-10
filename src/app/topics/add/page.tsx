'use client';

import React, { useEffect, useState } from "react";
import "@/app/styles/formTable.css";
import { useRouter } from "next/navigation";
import Header from "@/app/components/header";
import { updateRole } from "@/app/scripts/utils";
import Spinner from "@/app/components/spinner";
import { AxiosError } from "axios";
import showAlert from "@/app/utils/alert";
import { ApiTopic } from "@/app/api/ApiTopic";

export default function AddCategoryPage() {
    const router = useRouter();
    const [text, setText] = useState<string>("");
    const [activeCategory, setActiveCategory] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const role = updateRole();

        if (!role) {
            sessionStorage.setItem("adminStatus", "false");
            router.push("/topics");
        }
        else {
            sessionStorage.setItem("adminStatus", "true");
        }

        const storedCategory = sessionStorage.getItem("activeCategory") || "";
        setActiveCategory(storedCategory);

        setIsLoading(false);
    }, [router]);

    async function onConfirm() {
        try {
            if (await ApiTopic.createTopic(activeCategory, text))
                router.push("/topics");
        }
        catch (error) {
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
        router.push("/topics");
    }

    return (
        <>
            <Header />
            {isLoading ? (
                <main>
                    <Spinner />
                </main>
            ) : (
                <main>
                    <div className="form">
                        <div className="formTable no-select">
                            <div className="title">
                                {"Temat"}
                            </div>
                            <textarea
                                id="textarea"
                                name="textarea"
                                className="inputCustomText"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Wprowadź tekst..."
                            />
                            <div
                                className="btnsSwitchPopUp"
                                style={{
                                    marginTop: "20px"
                                }}>
                                <button
                                    style={{
                                        width: "120px",
                                        maxWidth: "120px"
                                    }}
                                    className="btnSwicthPopUp confirm"
                                    onClick={onConfirm}>Dodać</button>
                                <button
                                    style={{
                                        width: "120px",
                                        maxWidth: "120px",
                                    }}
                                    className="btnSwicthPopUp cancel-on-white"
                                    onClick={onCancel}>Anuluj</button>
                            </div>
                        </div>
                    </div>
                </main>
            )}
        </>
    );
}