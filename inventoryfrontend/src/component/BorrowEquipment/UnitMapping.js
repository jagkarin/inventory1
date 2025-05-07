// UnitMapping.js
const unitMapping = {
  "คอมพิวเตอร์": "เครื่อง",
  "ปากกา": "แท่ง",
  "ดินสอ": "แท่ง",
  "เก้าอี้": "ตัว",
  "โต๊ะ": "ตัว",
  "สมุด": "เล่ม",
  "หนังสือ": "เล่ม",
  "เมาส์": "ตัว",
  "คีย์บอร์ด": "ตัว",
  "เม้าส์" : "ตัว",
};

const getUnit = (itemName) => {
  return unitMapping[itemName] || "ชิ้น"; // Default เป็น "ชิ้น" ถ้าไม่เจอ
};

export { unitMapping, getUnit }; // ต้อง export getUnit ด้วย