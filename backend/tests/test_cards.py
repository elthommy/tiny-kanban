import pytest
from httpx import AsyncClient


@pytest.fixture
async def col_id(client: AsyncClient):
    resp = await client.post("/api/columns", json={"name": "To Do"})
    return resp.json()["id"]


@pytest.fixture
async def col2_id(client: AsyncClient):
    resp = await client.post("/api/columns", json={"name": "In Progress"})
    return resp.json()["id"]


@pytest.mark.anyio
async def test_create_card(client: AsyncClient, col_id: str):
    resp = await client.post(
        f"/api/columns/{col_id}/cards",
        json={"title": "Test card", "description": "A description"},
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["title"] == "Test card"
    assert data["column_id"] == col_id
    assert data["position"] == 0


@pytest.mark.anyio
async def test_update_card(client: AsyncClient, col_id: str):
    card = (
        await client.post(f"/api/columns/{col_id}/cards", json={"title": "Old"})
    ).json()
    resp = await client.patch(f"/api/cards/{card['id']}", json={"title": "New"})
    assert resp.status_code == 200
    assert resp.json()["title"] == "New"


@pytest.mark.anyio
async def test_delete_card(client: AsyncClient, col_id: str):
    card = (
        await client.post(f"/api/columns/{col_id}/cards", json={"title": "Delete me"})
    ).json()
    resp = await client.delete(f"/api/cards/{card['id']}")
    assert resp.status_code == 204


@pytest.mark.anyio
async def test_move_card(client: AsyncClient, col_id: str, col2_id: str):
    card = (
        await client.post(f"/api/columns/{col_id}/cards", json={"title": "Move me"})
    ).json()
    resp = await client.put(
        "/api/cards/move",
        json={
            "card_id": card["id"],
            "target_column_id": col2_id,
            "position": 0,
        },
    )
    assert resp.status_code == 200
    assert resp.json()["column_id"] == col2_id


@pytest.mark.anyio
async def test_archive_and_restore_card(client: AsyncClient, col_id: str):
    card = (
        await client.post(f"/api/columns/{col_id}/cards", json={"title": "Archive me"})
    ).json()
    resp = await client.post(f"/api/cards/{card['id']}/archive")
    assert resp.status_code == 200
    assert resp.json()["is_archived"] is True

    resp = await client.post(f"/api/cards/{card['id']}/restore")
    assert resp.status_code == 200
    assert resp.json()["is_archived"] is False
    assert resp.json()["column_id"] == col_id


@pytest.mark.anyio
async def test_card_with_tags(client: AsyncClient, col_id: str):
    tag = (await client.post("/api/tags", json={"name": "Bug", "color": "red"})).json()
    card = (
        await client.post(
            f"/api/columns/{col_id}/cards",
            json={"title": "Tagged", "tag_ids": [tag["id"]]},
        )
    ).json()
    assert len(card["tags"]) == 1
    assert card["tags"][0]["name"] == "Bug"
