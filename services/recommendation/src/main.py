import os
import random
import json
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import google.generativeai as genai
from dotenv import load_dotenv

# Try to load env from ../api/.env
load_dotenv(os.path.join(os.path.dirname(__file__), '..', 'api', '.env'))

app = FastAPI(title="MealMind AI Recommendation Service")

# Configure Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

class RecipeContext(BaseModel):
    available_recipes: List[dict]
    meal_type: Optional[str] = None
    weather: Optional[str] = None
    recent_recipes: Optional[List[str]] = []
    
class ComboRequest(BaseModel):
    available_recipes: List[Dict[str, Any]]
    servings: Optional[int] = 2

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "recommendation", "ai_ready": bool(GEMINI_API_KEY)}

@app.post("/api/v1/recommend/combo")
async def recommend_combo(req: ComboRequest):
    if not GEMINI_API_KEY:
        # Fallback if no API key
        if len(req.available_recipes) >= 3:
            shuffled = sorted(req.available_recipes, key=lambda x: random.random())
            return {"combo": [r['id'] for r in shuffled[:3]], "reason": "Chưa có GEMINI_API_KEY, lấy ngẫu nhiên 3 món."}
        return {"combo": [], "reason": "Not enough recipes"}
        
    prompt = f"""
    Bạn là một chuyên gia dinh dưỡng và đầu bếp AI của ứng dụng MealMind (dành cho ẩm thực Việt Nam).
    Nhiệm vụ: Tạo một mâm cơm gia đình (combo) gồm 3-4 món ăn hài hoà từ danh sách các món ăn sau:
    {json.dumps([{ 'id': r['id'], 'name': r['name'], 'calories': r.get('calories') } for r in req.available_recipes], ensure_ascii=False)}
    
    Yêu cầu:
    1. Chọn 1 món chính (chiếm nhiều đạm/calo nhất), 1 món canh (nếu có), và 1 món phụ (rau/thịt phụ).
    2. Đảm bảo các món ăn trong mâm hợp mùi vị với nhau (ví dụ: Thịt luộc + Cà pháo + Canh cua).
    3. Trả về đúng định dạng JSON sau, không kèm markdown hay diễn giải nào khác:
    {{
        "combo": ["id_mon_1", "id_mon_2", "id_mon_3"],
        "reason": "Lý do vì sao chọn mâm cơm này (VD: Mâm cơm thanh mát, cân bằng dinh dưỡng với cá và rau muống)"
    }}
    """
    
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        text = response.text
        # extract json from text if it's wrapped in markdown
        if '```json' in text:
            text = text.split('```json')[1].split('```')[0].strip()
        elif '```' in text:
            text = text.split('```')[1].strip()
            
        data = json.loads(text)
        return data
    except Exception as e:
        print(f"Error from Gemini: {e}")
        # fallback
        shuffled = sorted(req.available_recipes, key=lambda x: random.random())
class MealPlanRequest(BaseModel):
    available_recipes: List[Dict[str, Any]]
    days: int = 7
    meals_per_day: int = 3
    
@app.post("/api/v1/recommend/meal-plan")
async def recommend_meal_plan(req: MealPlanRequest):
    total_meals = req.days * req.meals_per_day
    if not GEMINI_API_KEY:
        # Fallback
        shuffled = sorted(req.available_recipes, key=lambda x: random.random())
        picked = [r['id'] for r in shuffled[:total_meals]]
        # Pad if not enough
        while len(picked) < total_meals and len(req.available_recipes) > 0:
            picked.append(random.choice(req.available_recipes)['id'])
        return {"plan": picked, "reason": "Chưa có API Key, đây là thực đơn ngẫu nhiên"}

    prompt = f"""
    Bạn là chuyên gia dinh dưỡng MealMind.
    Nhiệm vụ: Tạo một thực đơn trong {req.days} ngày, mỗi ngày {req.meals_per_day} bữa (Sáng, Trưa, Tối), tổng cộng {total_meals} bữa ăn.
    Danh sách món ăn khả dụng:
    {json.dumps([{ 'id': r['id'], 'name': r['name'], 'calories': r.get('calories'), 'mealTypes': r.get('mealTypes') } for r in req.available_recipes], ensure_ascii=False)}
    
    Yêu cầu:
    1. Trả về đúng 1 mảng dẹt chứa CHÍNH XÁC {total_meals} recipe ID (của 21 bữa liên tiếp từ Ngày 1 Sáng đến Ngày 7 Tối).
    2. Các bữa Sáng ưu tiên món có mealTypes chứa 'breakfast' hoặc nấu nhanh, bữa Trưa/Tối ưu tiên 'lunch', 'dinner'.
    3. Tránh lặp lại 1 món quá 2 lần trong tuần, đa dạng hóa nguyên liệu.
    4. Trả về đúng định dạng JSON sau:
    {{
        "plan": ["id_1", "id_2", ..., "id_21"],
        "reason": "Lý do ngắn gọn cho thực đơn tuần này"
    }}
    """
    
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        text = response.text
        if '```json' in text:
            text = text.split('```json')[1].split('```')[0].strip()
        elif '```' in text:
            text = text.split('```')[1].strip()
            
        data = json.loads(text)
        return data
    except Exception as e:
        print(f"Error from Gemini meal-plan: {e}")
        shuffled = sorted(req.available_recipes, key=lambda x: random.random())
        picked = [r['id'] for r in shuffled[:total_meals]]
        return {"plan": picked, "reason": "Có lỗi từ AI, đây là thực đơn ngẫu nhiên"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.main:app", host="0.0.0.0", port=8000, reload=True)
