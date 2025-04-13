import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { SendOutlined, CloseOutlined } from "@ant-design/icons";
import { Fab } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import { sendMessageToChatbot } from "../../utils/api";
import "./Chatbot.css";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: userInput }]);
    setUserInput("");
    setIsTyping(true);

    try {
      console.log("Sending message:", userInput);
      const data = await sendMessageToChatbot(userInput);

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.reply || "No response" },
      ]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: `Error: ${error.message}` },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chatbot-wrapper">
      {/* Floating Chat Button */}
      <Fab
        sx={{
          background: "linear-gradient(135deg, #FF6F61, #FF3C2F)",
          color: "white",
          "&:hover": { background: "#FF5733" },
        }}
        className="chatbot-fab"
        onClick={() => setIsOpen(!isOpen)}
      >
        <ChatIcon />
      </Fab>

      {isOpen && (
        <motion.div
          className="chatbot-container"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="chatbot-header">
            <h4>Chatbot</h4>
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              <CloseOutlined />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                className={`chatbot-message ${
                  message.sender === "user" ? "user-message" : "bot-message"
                }`}
                initial={{ opacity: 0, x: message.sender === "user" ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {message.sender === "bot" && message.text.includes("Here are some properties") ? (
                  message.text
                    .split("\n")
                    .map((line, i) => (
                      <p key={i}>
                        {i === 0 ? "" : "• "} {/* ✅ Only add bullets after first line */}
                        {line}
                      </p>
                    ))
                ) : (
                  <p>{message.text}</p>
                )}
              </motion.div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                className="bot-message typing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, repeat: Infinity }}
              >
                <span className="typing-dots">.</span>
                <span className="typing-dots">.</span>
                <span className="typing-dots">.</span>
              </motion.div>
            )}

            {/* Auto-scroll to latest message */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Field */}
          <div className="chatbot-input">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button className="send-btn" onClick={handleSend}>
              <SendOutlined />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Chatbot;
