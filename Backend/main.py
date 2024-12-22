from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient

app = FastAPI()

# MongoDB connection
client = AsyncIOMotorClient("mongodb://localhost:27017/")
db = client["todo_db"]
collection = db["todos"]

class Todo(BaseModel):
    id: str
    title: str
    description: str
    completed: bool

@app.get("/todos")
async def get_all_todos():
    todos = await collection.find().to_list(1000)
    return todos

@app.get("/todos/{todo_id}")
async def get_todo(todo_id: str):
    todo = await collection.find_one({"id": todo_id})
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo

@app.post("/todos")
async def create_todo(todo: Todo):
    await collection.insert_one(todo.dict())
    return todo

@app.put("/todos/{todo_id}")
async def update_todo(todo_id: str, todo: Todo):
    await collection.update_one({"id": todo_id}, {"$set": todo.dict()})
    return todo

@app.delete("/todos/{todo_id}")
async def delete_todo(todo_id: str):
    await collection.delete_one({"id": todo_id})
    return {"message": "Todo deleted successfully"}