import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  IconButton, 
  TextField, 
  InputAdornment,
  Avatar,
  Fade,
  CircularProgress
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CloseIcon from '@mui/icons-material/Close';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../Styles/theme';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi there! 👋 How can I help you today?' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [open, setOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const chatWindowRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Ensure chat window is visible when opened
  useEffect(() => {
    if (open && chatWindowRef.current) {
      // Position the chat window to be visible
      const viewportHeight = window.innerHeight;
      const chatHeight = 550;
      const bottomSpace = 90;
      
      // Ensure the chat window doesn't go above the viewport
      const topPosition = Math.max(20, viewportHeight - chatHeight - bottomSpace);
      
      chatWindowRef.current.style.bottom = 'auto';
      chatWindowRef.current.style.top = `${topPosition}px`;
    }
  }, [open]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!userInput.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text: userInput }]);
    const input = userInput;
    setUserInput('');
    
    // Show typing indicator
    setIsTyping(true);
    
    try {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
    
      
      const data = await response.json();
      
      // Small delay to make the typing effect more natural
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { sender: 'bot', text: data.response }]);
      }, 700);
      
    } catch (error) {
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [
          ...prev,
          {
            sender: 'bot',
            text: 'Oops! Something went wrong. Please try again.'
          }
        ]);
      }, 700);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box>
        <Fade in={true}>
          <IconButton 
            onClick={() => setOpen(!open)} 
            sx={{ 
              position: 'fixed', 
              bottom: 20, 
              right: 20,
              zIndex: 1300, 
              backgroundColor: theme.palette.custom.main,
              color: theme.palette.primary.main,
              boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
              width: 60,
              height: 60,
              '&:hover': {
                backgroundColor: theme.palette.custom.accent,
                transform: 'scale(1.05)',
                transition: 'all 0.3s ease'
              }
            }}
          >
            {open ? <CloseIcon fontSize="medium" /> : <ChatBubbleOutlineIcon fontSize="medium" />}
          </IconButton>
        </Fade>
        
        {open && (
          <Fade in={open} timeout={400}>
            <Paper
              ref={chatWindowRef}
              elevation={8}
              sx={{
                position: 'fixed',
                right: 85, // Increased this value to move the chat window to the left
                width: 380,
                height: 550,
                maxHeight: 'calc(100vh - 40px)', // Leave some space at top and bottom
                overflow: 'hidden',
                boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                borderRadius: 3,
                backgroundColor: theme.palette.primary.main,
                zIndex: 1200, // Higher z-index to stay above header
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Box 
                sx={{ 
                  backgroundColor: theme.palette.custom.highlight, 
                  color: '#fff', 
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  borderBottom: '1px solid rgba(0,0,0,0.08)'
                }}
              >
                <Avatar sx={{ bgcolor: theme.palette.custom.accent }}>
                  <SupportAgentIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="500">ArtGlimpse</Typography>
                  <Typography variant="caption">Online | Ready to help</Typography>
                </Box>
              </Box>
              
              <Box
                sx={{
                  p: 2,
                  flexGrow: 1,
                  overflowY: 'auto',
                  backgroundColor: theme.palette.tints.tint1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1
                }}
              >
                {messages.map((msg, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      mb: 1
                    }}
                  >
                    {msg.sender === 'bot' && (
                      <Avatar 
                        sx={{ 
                          bgcolor: theme.palette.custom.main,
                          width: 32,
                          height: 32,
                          mr: 1,
                          mt: 0.5
                        }}
                      >
                        <SupportAgentIcon fontSize="small" />
                      </Avatar>
                    )}
                    
                    <Typography
                      variant="body1"
                      sx={{
                        p: 1.5,
                        borderRadius: msg.sender === 'user' 
                          ? '18px 18px 4px 18px' 
                          : '18px 18px 18px 4px',
                        maxWidth: '75%',
                        backgroundColor: msg.sender === 'user' 
                          ? theme.palette.custom.accent 
                          : '#fff',
                        color: msg.sender === 'user' ? '#fff' : '#000',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                        wordBreak: 'break-word'
                      }}
                    >
                      {msg.text}
                    </Typography>
                    
                    {msg.sender === 'user' && (
                      <Avatar 
                        sx={{ 
                          bgcolor: theme.palette.shades.dark,
                          width: 32,
                          height: 32,
                          ml: 1,
                          mt: 0.5
                        }}
                      >
                        C
                      </Avatar>
                    )}
                  </Box>
                ))}
                
                {isTyping && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: theme.palette.custom.main,
                        width: 32,
                        height: 32
                      }}
                    >
                      <SupportAgentIcon fontSize="small" />
                    </Avatar>
                    <Box 
                      sx={{ 
                        p: 1.5,
                        borderRadius: '18px 18px 18px 4px',
                        backgroundColor: '#fff',
                        display: 'flex',
                        gap: 0.5
                      }}
                    >
                      <CircularProgress size={10} />
                      <CircularProgress size={10} />
                      <CircularProgress size={10} />
                    </Box>
                  </Box>
                )}
                
                <div ref={messagesEndRef} />
              </Box>
              
              <Box
                sx={{
                  display: 'flex',
                  p: 2,
                  borderTop: `1px solid rgba(0,0,0,0.08)`,
                  backgroundColor: '#fff',
                  minHeight: 70
                }}
              >
                <TextField
                  fullWidth
                  placeholder="Type your message..."
                  multiline
                  maxRows={3}
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  variant="outlined"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backgroundColor: theme.palette.tints.tint1,
                      '&:hover fieldset': {
                        borderColor: theme.palette.custom.accent,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.custom.accent,
                      },
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton 
                          onClick={handleSend}
                          disabled={!userInput.trim()}
                          sx={{
                            backgroundColor: userInput.trim() ? theme.palette.custom.accent : 'transparent',
                            color: userInput.trim() ? '#fff' : theme.palette.shades.medium,
                            '&:hover': {
                              backgroundColor: userInput.trim() ? theme.palette.custom.highlight : 'transparent',
                            }
                          }}
                        >
                          <SendIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Box>
            </Paper>
          </Fade>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default Chatbot;