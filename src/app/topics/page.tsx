'use client';

import React, { useCallback, useEffect, useState } from "react";
import Header from "@/app/components/header";
import { Edit, Trash2, Plus, ArrowUp } from 'lucide-react';
import Message from "@/app/components/message";
import showAlert from "@/app/utils/alert";
import { updateRole, renderTextWithLineBreaks } from "@/app/scripts/utils";
import "@/app/styles/formTable.css";
import "@/app/styles/globals.css";
import Spinner from "@/app/components/spinner";
import { TypeTopic } from "@/app/types/TypeTopic";
import { ApiTopic } from "@/app/api/ApiTopic";
import { useRouter } from "next/navigation";

export default function Topics() {
    const router = useRouter(); 
    const [messageVisible, setMessageVisible] = useState(false);

    const [isAdminOn, setIsAdminOn] = useState<boolean>(false);
    const [topics, setTopics] = useState<TypeTopic[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>("");
    const [activeTopic, setActiveTopic] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const role = updateRole();
        setIsAdminOn(role);

        const storedCategory = sessionStorage.getItem("activeCategory") || "";
        const storedTopic = sessionStorage.getItem("activeTopic") || "";
        setActiveCategory(storedCategory);
        setActiveTopic(storedTopic);
    }, []);

    const fetchTopics = useCallback(async () => {
        setIsLoading(true);
        try {
            setTopics(await ApiTopic.fetchTopics(activeCategory));
        } catch (err) {
            showAlert(500, `Server error: ${err}`);
        } finally {
            setIsLoading(false);
        }
    }, [activeCategory]);

    useEffect(() => {
        if (activeCategory) {
            fetchTopics();
        }
    }, [activeCategory, fetchTopics]);

    const handleDelete = async (): Promise<void> => {
        setMessageVisible(false);

        if (!activeCategory || !activeTopic) return;

        setIsLoading(true);
        try {
            await ApiTopic.deleteTopic(activeCategory, activeTopic);
            await fetchTopics();
        } catch (err) {
            showAlert(500, `Błąd usuwania: ${err}`);
        } finally {
            setIsLoading(false);
            setActiveTopic("");
        }
    }

    const handleEdit = async(id: string, name: string) => {
        sessionStorage.setItem("activeTopic", id);
        sessionStorage.setItem("activeTopicName", name);
        router.push("/topics/edit");
    }

    const handleAdd = async() => {
        router.push("/topics/add");
    }

    const handleBackClick = () => {
        sessionStorage.setItem("activeCategory", "Main Body");
        sessionStorage.setItem("activeCategoryName", "Kategorie");
        sessionStorage.setItem("activeTopicName", "");
        router.push("/");
    }

    return (<>
        <Header />
        <Message
        visible={messageVisible}
        setVisible={setMessageVisible}
        message={`Czy na pewno chcesz usunąć ten temat?`}
        textConfirm={"Tak"}
        textCancel={"Nie"}
        onConfirm={handleDelete}
        />
        <main>
            {isLoading ? 
            <Spinner /> :
            <>
            <div className='form'>
                <button className='btnProperty' onClick={handleBackClick}>
                    <ArrowUp size={24} />
                </button>
                {isAdminOn && 
                    <button
                        className='btnProperty'
                        onClick={() => {
                            handleAdd();
                        }}
                    >
                        <Plus size={24} />
                    </button>
                }
                <div className='formTable no-select'>
                    {topics.map((item) => (
                    <div
                        className='element'
                        key={item.id}
                        onClick={() => {
                            //onItemClick(item.id)
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                // onItemClick(item.id); }
                            }
                        }}>
                        <div
                            id={item.id}
                            className='text'
                        >{renderTextWithLineBreaks(item.title)}</div>
                        {isAdminOn && (
                        <div className='btnsContent'>
                            <button
                                className='btnContent'
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit(item.id, item.title);
                                }}
                            >
                                <Edit size={24} />
                            </button>
                            <button
                                className='btnContent'
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveTopic(item.id);
                                    setMessageVisible(true);
                                }}
                                aria-label="Usuń"
                            >
                                <Trash2 size={24} />
                            </button>
                        </div>
                        )}
                    </div>
                    ))}
                </div>
            </div>
        </>}
        </main>
    </>);
}