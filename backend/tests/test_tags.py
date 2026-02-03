import pytest
from httpx import AsyncClient


@pytest.mark.anyio
async def test_create_tag(client: AsyncClient):
    resp = await client.post("/api/tags", json={"name": "Bug", "color": "red"})
    assert resp.status_code == 201
    assert resp.json()["name"] == "Bug"
    assert resp.json()["color"] == "red"


@pytest.mark.anyio
async def test_list_tags(client: AsyncClient):
    await client.post("/api/tags", json={"name": "Bug", "color": "red"})
    await client.post("/api/tags", json={"name": "Feature", "color": "green"})
    resp = await client.get("/api/tags")
    assert len(resp.json()) == 2


@pytest.mark.anyio
async def test_duplicate_tag_name(client: AsyncClient):
    await client.post("/api/tags", json={"name": "Bug", "color": "red"})
    resp = await client.post("/api/tags", json={"name": "Bug", "color": "blue"})
    assert resp.status_code == 409


@pytest.mark.anyio
async def test_delete_tag(client: AsyncClient):
    tag = (await client.post("/api/tags", json={"name": "Bug", "color": "red"})).json()
    resp = await client.delete(f"/api/tags/{tag['id']}")
    assert resp.status_code == 204
    assert len((await client.get("/api/tags")).json()) == 0
