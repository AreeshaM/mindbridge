import { useState } from 'react'
import { sendChatMessage } from '../api/auth'

function Chat() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hi! I am your MindBridge AI companion. How are you feeling today?' }
  ])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSend() {
    if (!input.trim()) return

    // User message add karo
    const userMsg = { role: 'user', text: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const data = await sendChatMessage(input, '')
      const aiMsg = { role: 'ai', text: data.reply }
      setMessages(prev => [...prev, aiMsg])
    } catch {
      setMessages(prev => [...prev, {
        role: 'ai', text: 'Sorry, something went wrong. Please try again.'
      }])
    }
    setLoading(false)
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter') handleSend()
  }

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>🧠 MindBridge AI</h2>
        <p style={styles.sub}>Your mental health companion</p>
      </div>

      {/* Messages */}
      <div style={styles.messagesBox}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            ...styles.messageRow,
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
          }}>
            <div style={{
              ...styles.bubble,
              background:   msg.role === 'user' ? '#4f46e5' : '#f0f4ff',
              color:        msg.role === 'user' ? 'white'   : '#333',
              borderRadius: msg.role === 'user'
                ? '18px 18px 4px 18px'
                : '18px 18px 18px 4px'
            }}>
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ ...styles.messageRow, justifyContent: 'flex-start' }}>
            <div style={{ ...styles.bubble, background: '#f0f4ff', color: '#999' }}>
              AI is thinking...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={styles.inputRow}>
        <input
          style={styles.input}
          placeholder="Type your message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          style={styles.sendBtn}
          onClick={handleSend}
          disabled={loading}
        >
          Send
        </button>
      </div>

    </div>
  )
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    padding: '0 16px'
  },
  header: {
    textAlign: 'center',
    padding: '20px 0 10px'
  },
  title: { color: '#4f46e5', margin: 0 },
  sub:   { color: '#999', margin: '4px 0 0', fontSize: '14px' },
  messagesBox: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  messageRow: {
    display: 'flex',
    width: '100%'
  },
  bubble: {
    maxWidth: '75%',
    padding: '12px 16px',
    fontSize: '15px',
    lineHeight: '1.5'
  },
  inputRow: {
    display: 'flex',
    gap: '10px',
    padding: '16px 0',
    borderTop: '1px solid #eee'
  },
  input: {
    flex: 1,
    padding: '12px',
    borderRadius: '24px',
    border: '1px solid #ddd',
    fontSize: '15px',
    outline: 'none'
  },
  sendBtn: {
    padding: '12px 24px',
    background: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '24px',
    fontSize: '15px',
    cursor: 'pointer'
  }
}

export default Chat