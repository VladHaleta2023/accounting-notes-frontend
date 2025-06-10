'use client';

import React, { useEffect, useState } from "react";
import Header from "@/app/components/header";
import { Edit, Trash2, Plus } from 'lucide-react';
import Message from "@/app/components/message";
import { TypeCategory } from "@/app/types/TypeCategory";
import showAlert from "@/app/utils/alert";
import { ApiCategory } from "@/app/api/ApiCategory";
import { updateRole, renderTextWithLineBreaks } from "@/app/scripts/utils";
import "@/app/styles/formTable.css";
import "@/app/styles/globals.css";
import { useRouter } from "next/navigation";
import Spinner from "@/app/components/spinner";

export default function Home() {
  const router = useRouter(); 
  const [messageVisible, setMessageVisible] = useState(false);

  const [isAdminOn, setIsAdminOn] = useState<boolean>(false);
  const [categories, setCategories] = useState<TypeCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchCategories = async () => {
    try {
        setCategories(await ApiCategory.fetchCategories());
    }
    catch (err) {
        showAlert(500, `Server error: ${err}`);
    }
  }

  useEffect(() => {
    const init = async () => {
        setIsLoading(true);
        const role = updateRole();
        setIsAdminOn(role);
        await fetchCategories();
        setIsLoading(false);
    };
    init();
  }, []);

  const handleItemClick = (id: string, name: string) => {
    setActiveCategory(id);
    sessionStorage.setItem("activeCategory", id);
    sessionStorage.setItem("activeCategoryName", name);
    router.push("/topics");
  };

  const handleDelete = async (): Promise<void> => {
    setMessageVisible(false);

    if (!activeCategory) return;

    setIsLoading(true);
    try {
        await ApiCategory.deleteCategory(activeCategory);
        await fetchCategories();
    } catch (err) {
        showAlert(500, `Błąd usuwania: ${err}`);
    } finally {
        setIsLoading(false);
        setActiveCategory("");
    }
  }

  const handleEdit = async(id: string, name: string) => {
    sessionStorage.setItem("activeCategory", id);
    sessionStorage.setItem("activeCategoryName", name);
    router.push("/edit");
  }

  const handleAdd = async() => {
    router.push("/add");
  }

  return (<>
    <Header />
    <Message
      visible={messageVisible}
      setVisible={setMessageVisible}
      message={`Czy na pewno chcesz usunąć tą kategorię?`}
      textConfirm={"Tak"}
      textCancel={"Nie"}
      onConfirm={handleDelete}
    />
    <main>
        {isLoading ? 
        <Spinner /> :
        <div className='form'>
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
                {categories.map((item) => (
                <div
                    className='element'
                    key={item.id}
                    onClick={() => {
                        handleItemClick(item.id, item.name);
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleItemClick(item.id, item.name);
                        }
                    }}>
                    <div
                        id={item.id}
                        className='text'
                    >{renderTextWithLineBreaks(item.name)}</div>
                    {isAdminOn && (
                    <div className='btnsContent'>
                        <button
                            className='btnContent'
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(item.id, item.name);
                            }}
                        >
                            <Edit size={24} />
                        </button>
                        <button
                            className='btnContent'
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveCategory(item.id);
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
        </div>}
    </main>
  </>);
}
