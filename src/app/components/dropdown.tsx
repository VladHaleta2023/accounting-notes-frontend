'use client';

import React, { useState, useEffect } from "react";
import { TypeCategory } from "@/app/types/TypeCategory";
import "@/app/styles/globals.css";
import "@/app/styles/dropdown.css";

export type TypeCategories = TypeCategory[];

interface DropdownProps {
    categories: TypeCategories;
}

export default function Dropdown({ categories }: DropdownProps) {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [activeTopic, setActiveTopic] = useState<string | null>(null);
    const [activeCategoryName, setActiveCategoryName] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());

    useEffect(() => {
        const storedCategory = sessionStorage.getItem("activeCategory");
        const storedTopic = sessionStorage.getItem("activeTopic");
        const storedCategoryName = sessionStorage.getItem("activeCategoryName");

        setActiveCategory(storedCategory ?? "Main Body");
        setActiveTopic(storedTopic ?? null);
        setActiveCategoryName(storedCategoryName ?? "Kategorie");
    }, []);

    useEffect(() => {
        if (activeCategory !== null) {
            sessionStorage.setItem("activeCategory", activeCategory);
        }
        if (activeTopic !== null) {
            sessionStorage.setItem("activeTopic", activeTopic);
        }
        if (activeCategoryName !== null) {
            sessionStorage.setItem("activeCategoryName", activeCategoryName);
        }
    }, [activeCategory, activeTopic, activeCategoryName]);

    const handleCategoryClick = (id: string, name: string) => {
        const updatedOpenCategories = new Set(openCategories);
        if (updatedOpenCategories.has(id)) {
            updatedOpenCategories.delete(id);
        } else {
            updatedOpenCategories.add(id);
        }

        setOpenCategories(updatedOpenCategories);
        setActiveCategory(id);
        setActiveTopic("");
        setActiveCategoryName(name);
    };

    const handleTopicClick = (catId: string, topId: string) => {
        setActiveCategory(catId);
        setActiveTopic(topId);
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="dropdown no-select word-break">
            <button className="dropbtn" onClick={toggleDropdown}>
                <div className="menuLine"></div>
                <div className="menuLine"></div>
                <div className="menuLine"></div>
            </button>
            <div className={`dropdown-content ${isOpen ? "show" : ""}`}>
                <div
                    className={`element ${activeCategory === "Main Body" && !activeTopic ? "active" : ""}`}
                    onClick={() => handleCategoryClick("Main Body", "Kategorie")}
                >
                    <span>Kategorie</span>
                </div>

                {categories.map((category: TypeCategory) => (
                    <React.Fragment key={category.id}>
                        <div
                            className={`element ${activeCategory === category.id && !activeTopic ? "active" : ""}`}
                            onClick={() => handleCategoryClick(category.id, category.name ?? "Nieznana")}
                        >
                            <span>{category.name ?? ""}</span>
                            {category.topics.length > 0 && (
                                <span className="dropIcon">
                                    {openCategories.has(category.id) ? "▲" : "▼"}
                                </span>
                            )}
                        </div>
                        {category.topics.length > 0 && openCategories.has(category.id) && (
                            <div className="topics show">
                                {category.topics.map((topic) => (
                                    <div
                                        key={topic.id}
                                        className={`element topic ${activeTopic === topic.id ? "active" : ""}`}
                                        onClick={() => handleTopicClick(category.id, topic.id)}
                                    >
                                        <span>{topic.title}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}