import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

const MOODS = [
  { label: 'Happy',   emoji: '😊', value: 'happy',   score: 5 },
  { label: 'Calm',    emoji: '😌', value: 'calm',    score: 4 },
  { label: 'Anxious', emoji: '😰', value: 'anxious', score: 2 },
  { label: 'Sad',     emoji: '😢', value: 'sad',     score: 2 },
  { label: 'Angry',   emoji: '😠', value: 'angry',   score: 1 },
]

function Dashboard() {
  const [selectedMood, setSelectedMood] = useState('')
  const [note, setNote]                 = useState('')
  const [entries, setEntries]           = useState([])
  const [message, setMessage]           = useState('')

  // Graph ke liye data
  const chartData = entries.map((entry, i) => ({
    name: `Entry ${i + 1}`,
    score: MOODS.find(m => m.value === entry.mood)?.score || 0,
    mood: entry.mood
  }))

  function handleSave() {
    if (!selectedMood) {
      setMessage('Please select a mood first!')
      return
    }
    const newEntry = {
      mood: selectedMood,
      note: note,
      time: new Date().toLocaleTimeString()
    }
    setEntries([newEntry, ...entries])
    setSelectedMood('')
    setNote('')
    setMessage('Mood saved! ✅')
  }

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>MindBridge Dashboard</h2>
        <p style={styles.sub}>How are you feeling today?</p>
      </div>

      {/* Mood Buttons */}
      <div style={styles.moodRow}>
        {MOODS.map((m) => (
          <button
            key={m.value}
            onClick={() => setSelectedMood(m.value)}
            style={{
              ...styles.moodBtn,
              background: selectedMood === m.value ? '#4f46e5' : '#f0f4ff',
              color:      selectedMood === m.value ? 'white'   : '#333',
            }}
          >
            {m.emoji} {m.label}
          </button>
        ))}
      </div>

      {/* Note */}
      <textarea
        style={styles.textarea}
        placeholder="Write something about your day... (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={3}
      />

      {/* Save Button */}
      <button style={styles.saveBtn} onClick={handleSave}>
        Save Mood
      </button>

      {message && <p style={styles.msg}>{message}</p>}

      {/* Graph — sirf tab dikhe jab entries hon */}
      {entries.length > 1 && (
        <div style={styles.chartBox}>
          <h3 style={styles.chartTitle}>Your Mood Trend</h3>
          <p style={styles.chartSub}>5 = Happy, 1 = Angry</p>

          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 5]} />
              <Tooltip
                formatter={(value, name, props) => [
                  `Score: ${value}`,
                  props.payload.mood
                ]}
              />
              <Bar dataKey="score" fill="#4f46e5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Entries List */}
      {entries.length > 0 && (
        <div style={styles.entriesBox}>
          <h3 style={styles.chartTitle}>Today's Entries</h3>
          {entries.map((entry, index) => (
            <div key={index} style={styles.entryCard}>
              <span style={styles.entryMood}>
                {MOODS.find(m => m.value === entry.mood)?.emoji} {entry.mood}
              </span>
              <span style={styles.entryTime}>{entry.time}</span>
              {entry.note && <p style={styles.entryNote}>{entry.note}</p>}
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

const styles = {
  container:  { maxWidth: '600px', margin: '40px auto', padding: '0 20px' },
  header:     { textAlign: 'center', marginBottom: '24px' },
  title:      { color: '#4f46e5', fontSize: '26px', margin: 0 },
  sub:        { color: '#666', marginTop: '6px' },
  moodRow:    { display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '20px' },
  moodBtn:    { padding: '10px 18px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: '500' },
  textarea:   { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '15px', resize: 'none', marginBottom: '16px', boxSizing: 'border-box' },
  saveBtn:    { width: '100%', padding: '14px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', cursor: 'pointer' },
  msg:        { textAlign: 'center', color: 'green', margin: '12px 0' },
  chartBox:   { marginTop: '30px', padding: '20px', background: '#f8f9ff', borderRadius: '12px' },
  chartTitle: { color: '#4f46e5', marginBottom: '4px' },
  chartSub:   { color: '#999', fontSize: '13px', marginBottom: '16px' },
  entriesBox: { marginTop: '20px', padding: '20px', background: '#f8f9ff', borderRadius: '12px' },
  entryCard:  { background: 'white', padding: '12px 16px', borderRadius: '8px', marginBottom: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' },
  entryMood:  { fontWeight: '600', color: '#4f46e5', flex: 1 },
  entryTime:  { color: '#999', fontSize: '13px' },
  entryNote:  { width: '100%', color: '#555', margin: '4px 0 0' }
}

export default Dashboard