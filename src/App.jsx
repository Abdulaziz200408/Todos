import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input, Button, Modal, message } from "antd";
import { CheckCircleOutlined, DeleteOutlined } from "@ant-design/icons";

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
      await axios.post("https://c37ebab283094df7.mokky.dev/api", todoData);
      message.success("Yangi To-do muvaffaqiyatli qo'shildi");
      setIsModalOpen(false);
      setTodoData({ question: "", answer: "" });
      fetchTodos();
    } catch (error) {
      message.error("Saqlashda xatolik yuz berdi");
    }
  };

  const handleDelete = async (id, isDone) => {
    const url = isDone
      ? `https://c37ebab283094df7.mokky.dev/done/${id}`
      : `https://c37ebab283094df7.mokky.dev/api/${id}`;
    try {
      await axios.delete(url);
      message.success("To-do muvaffaqiyatli o'chirildi");
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
    <div className="p-6 max-w-3xl mx-auto bg-gray-900 text-white rounded-lg shadow-lg min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-violet-500">
        To-do Dasturi
      </h1>

      <Button
        type="primary"
        onClick={() => setIsModalOpen(true)}
        className="mb-8 w-full bg-violet-600 hover:bg-violet-700 border-none rounded-lg text-lg"
      >
        Yangi To-do qo'shish
      </Button>

      <div>
        <h2 className="font-semibold text-2xl mb-6 text-violet-400">
          Vazifalar
        </h2>
        <div className="space-y-4">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="flex justify-between items-center p-5 rounded-lg shadow-md bg-gray-800 hover:bg-gray-700 transition duration-300"
            >
              <span className="text-lg text-gray-300 flex-1">
                {todo.question}
              </span>
              <div className="flex items-center space-x-3">
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
          ))}
        </div>

        <h2 className="font-semibold text-2xl mt-10 text-violet-400">
          Bajarilganlar
        </h2>
        <div className="space-y-4 mt-4">
          {doneTodos.map((todo) => (
            <div
              key={todo.id}
              className="flex justify-between items-center p-5 rounded-lg shadow-md bg-gray-700 hover:bg-gray-600 transition duration-300"
            >
              <span className="text-lg text-gray-400 flex-1">
                {todo.question}
              </span>
              <DeleteOutlined
                onClick={() => handleDelete(todo.id, true)}
                className="text-red-500 cursor-pointer text-xl"
              />
            </div>
          ))}
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
        />
        <Input
          placeholder="Javob"
          value={todoData.answer}
          onChange={(e) => setTodoData({ ...todoData, answer: e.target.value })}
        />
      </Modal>
    </div>
  );
};

export default App;
