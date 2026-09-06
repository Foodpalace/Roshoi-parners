export class IsolationError extends Error {
  readonly status: number;
  constructor(message: string, status = 403) {
    super(message);
    this.name = "IsolationError";
    this.status = status;
  }
}

/** Hard isolation: restaurant_id on a row must match the membership. */
export function assertSameRestaurant(ctxRestaurantId: string, rowRestaurantId: string): void {
  if (ctxRestaurantId !== rowRestaurantId) {
    throw new IsolationError("Cross-restaurant access denied", 404);
  }
}
