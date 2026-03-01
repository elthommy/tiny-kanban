import pytest
from httpx import AsyncClient


@pytest.mark.anyio
async def test_create_tag(client: AsyncClient):
    resp = await client.post("/api/tags", json={"name": "Bug", "bg_color": "#ef4444"})
    assert resp.status_code == 201
    assert resp.json()["name"] == "Bug"
    assert resp.json()["bg_color"] == "#ef4444"
    assert resp.json()["fg_color"] == "#000000"


@pytest.mark.anyio
async def test_create_tag_default_color(client: AsyncClient):
    resp = await client.post("/api/tags", json={"name": "Default"})
    assert resp.status_code == 201
    assert resp.json()["bg_color"] == "#3b82f6"
    assert resp.json()["fg_color"] == "#000000"


@pytest.mark.anyio
async def test_create_tag_light_bg_gets_black_text(client: AsyncClient):
    resp = await client.post(
        "/api/tags", json={"name": "Bright", "bg_color": "#eab308"}
    )
    assert resp.status_code == 201
    assert resp.json()["fg_color"] == "#000000"


@pytest.mark.anyio
async def test_list_tags(client: AsyncClient):
    await client.post("/api/tags", json={"name": "Bug", "bg_color": "#ef4444"})
    await client.post("/api/tags", json={"name": "Feature", "bg_color": "#22c55e"})
    resp = await client.get("/api/tags")
    assert len(resp.json()) == 2


@pytest.mark.anyio
async def test_duplicate_tag_name(client: AsyncClient):
    await client.post("/api/tags", json={"name": "Bug", "bg_color": "#ef4444"})
    resp = await client.post("/api/tags", json={"name": "Bug", "bg_color": "#3b82f6"})
    assert resp.status_code == 409


@pytest.mark.anyio
async def test_delete_tag(client: AsyncClient):
    tag = (
        await client.post("/api/tags", json={"name": "Bug", "bg_color": "#ef4444"})
    ).json()
    resp = await client.delete(f"/api/tags/{tag['id']}")
    assert resp.status_code == 204
    assert len((await client.get("/api/tags")).json()) == 0
