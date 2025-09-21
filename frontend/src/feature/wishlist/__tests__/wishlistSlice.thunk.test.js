import { configureStore } from "@reduxjs/toolkit";
import reducer, {
  fetchWishList,
  addToWishList,
  deleteFromWishList,
} from "../WishlistSlice";

describe("wishlist thunks – with real store", () => {
  let store;

  beforeEach(() => {
    store = configureStore({ reducer: { wishlist: reducer } });
    // mock fetch for each test
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("fetchWishList success stores returned array", async () => {
    const mockData = [{ propertyId: 10 }, { propertyId: 11 }];
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    await store.dispatch(fetchWishList("FAKE_TOKEN"));

    const state = store.getState().wishlist;
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8000/api/property/wishlist",
      expect.objectContaining({
        headers: { Authorization: "Bearer FAKE_TOKEN" },
      })
    );
    expect(state.status).toBe("succeeded");
    expect(state.wishlist).toEqual(mockData);
  });

  test("fetchWishList failure sets error (rejectWithValue)", async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      json: async () => ({ detail: "Unauthorized" }),
    });

    await store.dispatch(fetchWishList("BAD_TOKEN"));

    const state = store.getState().wishlist;
    expect(state.status).toBe("failed");
    expect(state.error).toEqual({ detail: "Unauthorized" });
  });

  test("addToWishList success pushes item", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ propertyId: 99 }),
    });

    await store.dispatch(
      addToWishList({ propertyId: 99, accessToken: "FAKE" })
    );

    const state = store.getState().wishlist;
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8000/api/property/wishlist/add/99/",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer FAKE",
          "Content-Type": "application/json",
        }),
      })
    );
    expect(state.status).toBe("succeeded");
    expect(state.wishlist).toContainEqual({ propertyId: 99 });
  });

  test("addToWishList failure sets error", async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      json: async () => ({ detail: "Duplicate" }),
    });

    await store.dispatch(addToWishList({ propertyId: 5, accessToken: "FAKE" }));

    const state = store.getState().wishlist;
    expect(state.status).toBe("failed");
    expect(state.error).toEqual({ detail: "Duplicate" });
  });

  test("deleteFromWishList success removes by propertyId", async () => {
    store = configureStore({
      reducer: { wishlist: reducer },
      preloadedState: {
        wishlist: {
          wishlist: [{ propertyId: 1 }, { propertyId: 2 }],
          status: "idle",
          error: null,
        },
      },
    });

    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    await store.dispatch(
      deleteFromWishList({ propertyId: 2, accessToken: "FAKE" })
    );

    const state = store.getState().wishlist;
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8000/api/property/wishlist/delete/2/",
      expect.objectContaining({
        method: "DELETE",
        headers: { Authorization: "Bearer FAKE" },
      })
    );
    expect(state.status).toBe("succeeded");
    expect(state.wishlist).toEqual([{ propertyId: 1 }]);
  });

  test("deleteFromWishList failure sets error", async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      json: async () => ({ detail: "Not found" }),
    });

    await store.dispatch(
      deleteFromWishList({ propertyId: 123, accessToken: "FAKE" })
    );

    const state = store.getState().wishlist;
    expect(state.status).toBe("failed");
    expect(state.error).toEqual({ detail: "Not found" });
  });
});
