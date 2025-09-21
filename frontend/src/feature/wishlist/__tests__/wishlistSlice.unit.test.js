import reducer, {
  fetchWishList,
  addToWishList,
  deleteFromWishList,
} from "../WishlistSlice";

describe("wishlist slice – reducer-only", () => {
  test("fetchWishList.fulfilled sets list and status", () => {
    const payload = [{ propertyId: 1 }, { propertyId: 2 }];
    const state = reducer(undefined, {
      type: fetchWishList.fulfilled.type,
      payload,
    });
    expect(state.wishlist).toEqual(payload);
    expect(state.status).toBe("succeeded");
    expect(state.error).toBeNull();
  });

  test("fetchWishList.rejected sets failed + error payload", () => {
    const state = reducer(undefined, {
      type: fetchWishList.rejected.type,
      payload: "Unauthorized",
    });
    expect(state.status).toBe("failed");
    expect(state.error).toBe("Unauthorized");
  });

  test("addToWishList.fulfilled pushes item and sets succeeded", () => {
    const prev = { wishlist: [{ propertyId: 1 }], status: "idle", error: null };
    const state = reducer(prev, {
      type: addToWishList.fulfilled.type,
      payload: { propertyId: 2 },
    });
    expect(state.wishlist).toEqual([{ propertyId: 1 }, { propertyId: 2 }]);
    expect(state.status).toBe("succeeded");
  });

  test("addToWishList.rejected sets failed + error payload", () => {
    const prev = { wishlist: [], status: "idle", error: null };
    const state = reducer(prev, {
      type: addToWishList.rejected.type,
      payload: "Bad Request",
    });
    expect(state.status).toBe("failed");
    expect(state.error).toBe("Bad Request");
  });

  test("deleteFromWishList.fulfilled removes item by propertyId", () => {
    const prev = {
      wishlist: [{ propertyId: 1 }, { propertyId: 2 }, { propertyId: 3 }],
      status: "idle",
      error: null,
    };
    const state = reducer(prev, {
      type: deleteFromWishList.fulfilled.type,
      payload: 2, // propertyId returned by thunk
    });
    expect(state.wishlist).toEqual([{ propertyId: 1 }, { propertyId: 3 }]);
    expect(state.status).toBe("succeeded");
  });

  test("deleteFromWishList.rejected sets failed + error payload", () => {
    const prev = { wishlist: [{ propertyId: 1 }], status: "idle", error: null };
    const state = reducer(prev, {
      type: deleteFromWishList.rejected.type,
      payload: "Delete failed",
    });
    expect(state.status).toBe("failed");
    expect(state.error).toBe("Delete failed");
  });
});
