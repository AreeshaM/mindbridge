import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../api/auth'

function Register() {
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage]   = useState('')
  const [loading, setLoading]   = useState(false)

  // useNavigate — page change karta hai bina link click kiye
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    try {
      const data = await registerUser(name, email, password)

      // Token save karo — baad mein har request mein use hoga
      localStorage.setItem('token', data.access_token)
      localStorage.setItem('user_name', data.user_name)

      setMessage('Register ho gaya! ✅')

      // Dashboard pe bhejo
      setTimeout(() => navigate('/dashboard'), 1000)

    } catch (error) {
      setMessage(error.response?.data?.detail || 'something went wrong')
    }

    setLoading(false)
  }

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>MindBridge — Register</h2>

        <input
          style={styles.input}
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          style={styles.input}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          style={styles.input}
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          style={styles.button}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

        {message && <p style={styles.msg}>{message}</p>}
      </div>
    </div>
  )
}

const styles = {
  container: { height:'100vh', display:'flex', justifyContent:'center', alignItems:'center', backgroundColor:'#f0f4ff' },
  box: { background:'white', padding:'40px', borderRadius:'12px', display:'flex', flexDirection:'column', gap:'16px', width:'360px', boxShadow:'0 4px 20px rgba(0,0,0,0.1)' },
  title: { textAlign:'center', color:'#4f46e5' },
  input: { padding:'12px', borderRadius:'8px', border:'1px solid #ddd', fontSize:'15px' },
  button: { padding:'12px', backgroundColor:'#4f46e5', color:'white', border:'none', borderRadius:'8px', fontSize:'15px', cursor:'pointer' },
  msg: { color:'green', textAlign:'center' }
}

export default Register