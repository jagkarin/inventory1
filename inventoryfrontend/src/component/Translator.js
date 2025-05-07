// src/components/ThaiToEnglish.js
import React, { useState } from 'react';

const ThaiToEnglish = () => {
  const [text, setText] = useState('');
  const [translated, setTranslated] = useState('');

  const translateThaiToEnglish = async (thaiText) => {
    try {
      // ใช้ fetch เรียก API ตัวอย่าง (ในที่นี้ใช้ Google Translate API)
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=th&tl=en&dt=t&q=${encodeURI(thaiText)}`
      );
      const data = await response.json();
      // Google Translate ส่งผลลัพธ์ในรูปแบบ array ซ้อนกัน
      const translatedText = data[0][0][0];
      setTranslated(translatedText);
    } catch (error) {
      console.error('Translation error:', error);
      setTranslated('เกิดข้อผิดพลาดในการแปล');
    }
  };

  const handleTranslate = () => {
    if (text.trim()) {
      translateThaiToEnglish(text);
    }
  };

  return (
    <div>
      <h3>แปลไทยเป็นอังกฤษ</h3>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="พิมพ์ข้อความภาษาไทย"
        rows="3"
        style={{ width: '300px', marginBottom: '10px' }}
      />
      <br />
      <button onClick={handleTranslate} disabled={!text.trim()}>
        แปล
      </button>
      <div style={{ marginTop: '10px' }}>
        <strong>ผลลัพธ์:</strong> {translated}
      </div>
    </div>
  );
};

export default ThaiToEnglish;