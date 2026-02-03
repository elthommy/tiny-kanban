import pytest
from httpx import AsyncClient


@pytest.mark.anyio
async def test_create_column(client: AsyncClient):
    resp = await client.post("/api/columns", json={"name": "To Do"})
    assert resp.status_code == 201
    data = resp.json()
    assert data["name"] == "To Do"
    assert data["position"] == 0
    assert data["is_done_column"] is False


@pytest.mark.anyio
async def test_list_columns(client: AsyncClient):
    await client.post("/api/columns", json={"name": "To Do"})
    await client.post("/api/columns", json={"name": "In Progress"})
    resp = await client.get("/api/columns")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 2
    assert data[0]["name"] == "To Do"
    assert data[1]["name"] == "In Progress"


@pytest.mark.anyio
async def test_update_column(client: AsyncClient):
    create = await client.post("/api/columns", json={"name": "To Do"})
    col_id = create.json()["id"]
    resp = await client.patch(
        f"/api/columns/{col_id}", json={"name": "Done", "is_done_column": True}
    )
    assert resp.status_code == 200
    assert resp.json()["name"] == "Done"
    assert resp.json()["is_done_column"] is True


@pytest.mark.anyio
async def test_delete_column_archives_cards(client: AsyncClient):
    col = await client.post("/api/columns", json={"name": "To Do"})
    col_id = col.json()["id"]
    card = await client.post(f"/api/columns/{col_id}/cards", json={"title": "Task 1"})
    card_id = card.json()["id"]

    resp = await client.delete(f"/api/columns/{col_id}")
    assert resp.status_code == 204

    archive = await client.get("/api/archive")
    items = archive.json()["items"]
    assert any(c["id"] == card_id for c in items)


@pytest.mark.anyio
async def test_reorder_columns(client: AsyncClient):
    c1 = (await client.post("/api/columns", json={"name": "A"})).json()
    c2 = (await client.post("/api/columns", json={"name": "B"})).json()
    c3 = (await client.post("/api/columns", json={"name": "C"})).json()

    resp = await client.put(
        "/api/columns/reorder",
        json={"column_ids": [c3["id"], c1["id"], c2["id"]]},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data[0]["name"] == "C"
    assert data[1]["name"] == "A"
    assert data[2]["name"] == "B"
