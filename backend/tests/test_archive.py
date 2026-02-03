import pytest
from httpx import AsyncClient


@pytest.fixture
async def col_id(client: AsyncClient):
    resp = await client.post("/api/columns", json={"name": "To Do"})
    return resp.json()["id"]


@pytest.fixture
async def archived_cards(client: AsyncClient, col_id: str):
    ids = []
    for i in range(3):
        card = (
            await client.post(
                f"/api/columns/{col_id}/cards", json={"title": f"Card {i}"}
            )
        ).json()
        await client.post(f"/api/cards/{card['id']}/archive")
        ids.append(card["id"])
    return ids


@pytest.mark.anyio
async def test_list_archive(client: AsyncClient, archived_cards: list[str]):
    resp = await client.get("/api/archive")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] == 3
    assert len(data["items"]) == 3


@pytest.mark.anyio
async def test_archive_search(client: AsyncClient, col_id: str):
    card = (
        await client.post(
            f"/api/columns/{col_id}/cards", json={"title": "Unique searchable"}
        )
    ).json()
    await client.post(f"/api/cards/{card['id']}/archive")

    resp = await client.get("/api/archive", params={"q": "searchable"})
    assert resp.json()["total"] == 1

    resp = await client.get("/api/archive", params={"q": "nonexistent"})
    assert resp.json()["total"] == 0


@pytest.mark.anyio
async def test_restore_all(client: AsyncClient, archived_cards: list[str]):
    resp = await client.post("/api/archive/restore-all")
    assert resp.status_code == 200
    assert len(resp.json()) == 3

    archive = await client.get("/api/archive")
    assert archive.json()["total"] == 0


@pytest.mark.anyio
async def test_clear_archive(client: AsyncClient, archived_cards: list[str]):
    resp = await client.post("/api/archive/clear")
    assert resp.status_code == 204

    archive = await client.get("/api/archive")
    assert archive.json()["total"] == 0
