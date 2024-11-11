import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input, Button, Modal, message } from "antd";
import { CheckCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import "./App.css";

const { TextArea } = Input;

const App = () => {
  const [todos, setTodos] = useState([]);
  const [doneTodos, setDoneTodos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [todoData, setTodoData] = useState({ question: "", answer: "" });

  useEffect(() => {
    fetchTodos();
    fetchDoneTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(
        "https://c37ebab283094df7.mokky.dev/api"
      );
      setTodos(response.data);
    } catch (error) {
      message.error("Ma'lumotlarni olishda xatolik yuz berdi");
    }
  };

  const fetchDoneTodos = async () => {
    try {
      const response = await axios.get(
        "https://c37ebab283094df7.mokky.dev/done"
      );
      setDoneTodos(response.data);
    } catch (error) {
      message.error("Bajarilganlarni olishda xatolik yuz berdi");
    }
  };

  const handleAddTodo = async () => {
    try {
      if (todoData.question && todoData.answer) {
        await axios.post("https://c37ebab283094df7.mokky.dev/api", todoData);
        message.success("Yangi To-do muvaffaqiyatli qo'shildi");
        setIsModalOpen(false);
        setTodoData({ question: "", answer: "" });
        fetchTodos();
      } else {
        message.warning("Iltimos, savol va javobni kiriting");
      }
    } catch (error) {
      message.error("Saqlashda xatolik yuz berdi");
    }
  };

  const handleDelete = async (id, isDone) => {
    const confirmDelete = window.confirm("O'chirmoqchimisiz?");
    if (!confirmDelete) return;

    const url = isDone
      ? `https://c37ebab283094df7.mokky.dev/done/${id}`
      : `https://c37ebab283094df7.mokky.dev/api/${id}`;
    try {
      await axios.delete(url);
      message.success(" Savollar  muvaffaqiyatli o'chirildi");
      fetchTodos();
      fetchDoneTodos();
    } catch (error) {
      message.error("O'chirishda xatolik yuz berdi");
    }
  };

  const handleToggleCompleted = async (todo) => {
    try {
      await axios.post("https://c37ebab283094df7.mokky.dev/done", {
        question: todo.question,
        answer: todo.answer,
        archived: true,
      });
      await axios.delete(`https://c37ebab283094df7.mokky.dev/api/${todo.id}`);
      message.success("To-do arxivga ko'chirildi");
      fetchTodos();
      fetchDoneTodos();
    } catch (error) {
      message.error("Arxivlashda xatolik yuz berdi");
    }
  };

  return (
    <div
      style={{
        maxWidth: "1300px",
      }}
      className="p-6  mx-auto text-white rounded-lg shadow-lg min-h-screen"
    >
      <h1 className="text-4xl font-bold mb-8 text-center text-violet-500">
        Interview questions
      </h1>

      <Button
        type="primary"
        onClick={() => setIsModalOpen(true)}
        className="mb-8 py-6 w-full bg-violet-600 hover:bg-violet-700 border-none rounded-lg text-lg"
      >
        Add question
      </Button>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <h2 className="font-semibold text-2xl mb-6 text-violet-400">
            Questions
          </h2>
          <div className="space-y-4 cursor-pointer">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="flex flex-col justify-between p-5 rounded-lg shadow-md bg-gray-800 hover:bg-gray-700 transition duration-300"
              >
                <div className=" flex items-start">
                  <div className="text-lg text-gray-300 flex-1">
                    <strong>{todo.question}</strong>
                    <p>{todo.answer}</p>
                  </div>
                  <div className="flex items-center space-x-3 mt-4">
                    <CheckCircleOutlined
                      className="text-violet-500 cursor-pointer text-xl"
                      onClick={() => handleToggleCompleted(todo)}
                    />
                    <DeleteOutlined
                      onClick={() => handleDelete(todo.id, false)}
                      className="text-red-500 cursor-pointer text-xl"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <h2 className="font-semibold text-2xl mb-6 text-violet-400">
            Learned ones
          </h2>
          <div className="space-y-4 cursor-pointer">
            {doneTodos.map((todo) => (
              <div
                key={todo.id}
                className="flex flex-col justify-between p-5 rounded-lg shadow-md bg-gray-700 hover:bg-gray-600 transition duration-300"
              >
                <div className=" flex items-start">
                  <div className="text-lg text-gray-400 flex-1">
                    <strong>{todo.question}</strong>
                    <p>{todo.answer}</p>
                  </div>
                  <DeleteOutlined
                    onClick={() => handleDelete(todo.id, true)}
                    className="text-red-500 cursor-pointer text-xl mt-4"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal
        title="Yangi To-do qo'shish"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleAddTodo}
        className="custom-modal"
      >
        <Input
          placeholder="Savol"
          value={todoData.question}
          onChange={(e) =>
            setTodoData({ ...todoData, question: e.target.value })
          }
          className="mb-4"
          style={{ color: "black" }}
        />
        <TextArea
          placeholder="Javob"
          value={todoData.answer}
          onChange={(e) => setTodoData({ ...todoData, answer: e.target.value })}
          style={{ color: "black" }}
        />
      </Modal>
    </div>
  );
};

export default App;
