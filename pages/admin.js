import { useState } from "react";

export default function Admin() {
  const [text, setText] = useState("");
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState("");

  const sendBroadcast = async (e) => {
    e.preventDefault();
    if (!text || !photo) {
      setMessage("Заполните все поля");
      return;
    }

    const formData = new FormData();
    formData.append("text", text);
    formData.append("photo", photo);

    const res = await fetch("/api/broadcast", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Рассылка сообщений</h1>
      {message && <p>{message}</p>}
      <form onSubmit={sendBroadcast}>
        <textarea
          placeholder="Текст сообщения"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          cols={40}
          required
        />
        <br />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
          required
        />
        <br />
        <br />
        <button type="submit">Отправить</button>
      </form>
    </div>
  );
}
