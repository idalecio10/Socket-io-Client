import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import uuid from 'uuid/dist/v4'

const myId = uuid()

//Conectar ao servidor
const socket = io('http://localhost:8080')
socket.on('connect', () => console.log('[IO] Conectar => Uma nova conexão foi estabelecida'))
//Conectar ao servidor

const Chat = () => {
    const [message, updateMessage] = useState('')
    const [messages, updateMessages] = useState([])
 
    useEffect(() => {
        const handleNewMessage = newMessage =>
            updateMessages([...messages, newMessage])
        socket.on('chat.message', handleNewMessage)
        return () => socket.off('chat.message', handleNewMessage)
    }, [messages])

    const handleFormSubmit = event => {
        event.preventDefault()
        if (message.trim()) {
            socket.emit('chat.message', {
                id: myId,
                message
            })
            updateMessage('')
        }
    }

    const handleInputChange = event =>
        updateMessage(event.target.value)

    return (
        <main className="container">
            <ul className="list">
                { messages.map((m, index) => (
                    <li
                        className={`list__item list__item--${m.id === myId ? 'mine' : 'other'}`}
                        key={index}
                    >
                        <span className={`message message--${m.id === myId ? 'mine' : 'other'}`}>
                            { m.message }
                        </span>
                    </li>
                ))}
            </ul>
            <form className="form" onSubmit={handleFormSubmit}>
                <input
                    className="form__field"
                    onChange={handleInputChange}
                    placeholder="Escreva uma mensagem"
                    type="text"
                    value={message}
                />
            </form>
        </main>
    )
}

export default Chat
