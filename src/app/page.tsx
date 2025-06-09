import React, { useState } from "react";
import Header from "@/app/components/header";
import { Edit, Trash2, Plus } from 'lucide-react';
import Message from "@/app/components/message";

export default function Home() {
  const [messageVisible, setMessageVisible] = useState(false);
  const [textTitle, setTextTitle] = useState("");

  const handleDelete = async () => {

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
    <div className='form'>
        {isAdminOn && 
            <button
                className='btnProperty'
                onClick={onAddClick}
            >
                <Plus size={24} />
            </button>
        }
        <div className='formTable no-select'>
            {table.map((item) => (
            <div
                className='element'
                key={item.id}
                onClick={() => onItemClick(item.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') onItemClick(item.id); }}
            >
                <textarea
                    id={item.id}
                    ref={textareaRef}
                    className='text'
                    value={isCategory(item) ? item.name : (item as TypeTopic).title}
                    readOnly
                    rows={getRowCountFromText(isCategory(item) ? item.name : (item as TypeTopic).title)}
                />
                {isAdminOn && (
                <div className='btnsContent'>
                    <button
                        className='btnContent'
                        onClick={(e) => {
                            e.stopPropagation();
                            onEditClick();
                            if (isCategory(item)) {
                                saveSelection(item.id, "");
                            }
                            else {
                                const storedCategoryId = sessionStorage.getItem("categoryId") || "Main Body";
                                saveSelection(storedCategoryId, item.id);
                            }
                        }}
                    >
                    <Edit size={24} />
                    </button>
                    <button
                        className='btnContent'
                        onClick={(e) => {
                            e.stopPropagation();
                            if (isCategory(item)) {
                                setTextTitle("tą kategorię?");
                                saveSelection(item.id, "");
                            }
                            else {
                                const storedCategoryId = sessionStorage.getItem("categoryId") || "Main Body";
                                setTextTitle("ten temat?");
                                saveSelection(storedCategoryId, item.id);
                            }
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
  </>);
}
