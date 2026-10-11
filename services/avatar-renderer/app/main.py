from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="X1 Independent Avatar Renderer (unbound scaffold)", version="0.1.0")

class RenderRequest(BaseModel):
    session_id: str
    avatar_id: str
    consent_receipt_id: str

@app.get("/healthz")
def health():
    raise HTTPException(
        status_code=503,
        detail={"status":"RENDER_ENGINE_UNBOUND","gpu":False,"model_loaded":False}
    )

@app.post("/v1/sessions")
def create_session(_: RenderRequest):
    raise HTTPException(
        status_code=503,
        detail="Renderer disabled until licensed model, verified consent, auth and GPU are provisioned"
    )
