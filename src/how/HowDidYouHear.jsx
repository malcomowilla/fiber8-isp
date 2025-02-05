import React, { useState } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import { FaFacebook, FaGoogle, FaTwitter, FaUserFriends, FaNewspaper } from "react-icons/fa";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
  font-family: "Comic Sans MS", cursive, sans-serif;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 20px;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
`;

const Option = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 150px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

const OptionText = styled.span`
  margin-top: 10px;
  font-size: 1rem;
  color: #555;
`;

const Button = styled(motion.button)`
  margin-top: 30px;
  padding: 15px 30px;
  font-size: 1.2rem;
  color: white;
  background: #ff6f61;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #ff4a3d;
  }
`;

const HowDidYouHear = () => {
  const [selectedOption, setSelectedOption] = useState(null);

  const options = [
    { id: 1, icon: <FaFacebook size={40} color="#1877F2" />, text: "Facebook" },
    { id: 2, icon: <FaGoogle size={40} color="#DB4437" />, text: "Google" },
    { id: 3, icon: <FaTwitter size={40} color="#1DA1F2" />, text: "Twitter" },
    { id: 4, icon: <FaUserFriends size={40} color="#FFC107" />, text: "Friends" },
    { id: 5, icon: <FaNewspaper size={40} color="#4CAF50" />, text: "News" },
  ];

  const handleOptionClick = (id) => {
    setSelectedOption(id);
  };

  const handleSubmit = () => {
    if (selectedOption) {
      alert(`You selected: ${options.find((opt) => opt.id === selectedOption).text}`);
    } else {
      alert("Please select an option!");
    }
  };

  return (
    <Container>
      <Title>How did you hear about us?</Title>
      <OptionsContainer>
        {options.map((option) => (
          <Option
            key={option.id}
            onClick={() => handleOptionClick(option.id)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              border: selectedOption === option.id ? "3px solid #ff6f61" : "3px solid transparent",
            }}
          >
            {option.icon}
            <OptionText>{option.text}</OptionText>
          </Option>
        ))}
      </OptionsContainer>
      <Button
        onClick={handleSubmit}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        Submit
      </Button>
    </Container>
  );
};

export default HowDidYouHear;