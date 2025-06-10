'use client';

import React, { useEffect, useState } from "react";
import "@/app/styles/formTable.css";
import { useRouter } from "next/navigation";
import Header from "@/app/components/header";
import { updateRole } from "@/app/scripts/utils";
import Spinner from "@/app/components/spinner";
import { AxiosError } from "axios";
import showAlert from "@/app/utils/alert";
import { ApiCategory } from "@/app/api/ApiCategory";

export default function EditCategoryPage() {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<string>("");
    const [activeCategoryName, setActiveCategoryName] = useState<string>("");

    useEffect(() => {
        const role = updateRole();
        if (!role) {
            sessionStorage.setItem("adminStatus", "false");
            router.push("/");
            return;
        } else {
            sessionStorage.setItem("adminStatus", "true");
        }

        const storedCategory = sessionStorage.getItem("activeCategory");
        const storedCategoryName = sessionStorage.getItem("activeCategoryName");

        setActiveCategory(storedCategory || "");
        setActiveCategoryName(storedCategoryName || "");

        setIsLoading(false);
    }, [router]);

    async function onConfirm() {
        try {
            if (await ApiCategory.updateCategory(activeCategory, activeCategoryName))
                router.push("/");
        } catch (error) {
            const err = error as AxiosError<{ message?: string | string[] }>;
            const status = err.response?.status || 500;
            const message = (err.response?.data?.message?.[0] as string) || "Unknown error";
            showAlert(status, message);
            sessionStorage.setItem("adminStatus", "false");
        }
    }

    function onCancel() {
        router.push("/");
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
                            <div className="title">Kategoria</div>
                            <textarea
                                id="textarea"
                                name="textarea"
                                className="inputCustomText"
                                value={activeCategoryName}
                                onChange={(e) => setActiveCategoryName(e.target.value)}
                                placeholder="Wprowadź tekst..."
                            />
                            <div
                                className="btnsSwitchPopUp"
                                style={{ marginTop: "20px" }}
                            >
                                <button
                                    style={{ width: "200px", maxWidth: "200px" }}
                                    className="btnSwicthPopUp confirm"
                                    onClick={onConfirm}
                                >
                                    Aktualizować
                                </button>
                                <button
                                    style={{ width: "120px", maxWidth: "120px" }}
                                    className="btnSwicthPopUp cancel-on-white"
                                    onClick={onCancel}
                                >
                                    Anuluj
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            )}
        </>
    );
}